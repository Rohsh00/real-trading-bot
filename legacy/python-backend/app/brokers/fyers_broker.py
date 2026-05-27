import uuid
from fyers_apiv3 import fyersModel

from app.brokers.interfaces.base_broker import BaseBroker
from app.services.broker.fyers_token_service import FyersTokenService
from app.core.config import settings
from app.core.logger import logger


class FyersBroker(BaseBroker):
    
    broker_name = "fyers"

    async def _get_fyers_client(self):
        token_data = await FyersTokenService.get_token()
        if not token_data or "access_token" not in token_data:
            raise ValueError("Fyers access token not found. Please login via /api/v1/broker/fyers/login")
        
        access_token = token_data["access_token"]
        
        fyers = fyersModel.FyersModel(
            client_id=settings.FYERS_APP_ID,
            is_async=False,
            token=access_token,
            log_path=""
        )
        return fyers

    async def place_order(self, symbol, side, quantity, price):
        fyers = await self._get_fyers_client()
        
        # Fyers requires a specific side format: 1 for BUY, -1 for SELL
        fyers_side = 1 if side.upper() == "BUY" else -1
        
        data = {
            "symbol": symbol,
            "qty": int(quantity),
            "type": 2, # 2 is for Limit Order, 1 for Market
            "side": fyers_side,
            "productType": "INTRADAY",
            "limitPrice": float(price),
            "stopPrice": 0,
            "validity": "DAY",
            "disclosedQty": 0,
            "offlineOrder": False,
        }
        
        response = fyers.place_order(data=data)
        
        if response.get("s") != "ok":
            logger.error(f"Fyers order failed: {response}")
            raise Exception(f"Fyers Order Failed: {response.get('message')}")
            
        order_id = response.get("id")
        
        order = {
            "order_id": order_id,
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "price": price,
            "status": "SUBMITTED" # Real status would come via websocket or polling
        }
        
        logger.info(f"Fyers Order Placed: {order}")
        return order

    async def cancel_order(self, order_id):
        fyers = await self._get_fyers_client()
        response = fyers.cancel_order(data={"id": order_id})
        
        if response.get("s") != "ok":
            logger.error(f"Fyers cancel failed: {response}")
            raise Exception(f"Fyers Cancel Failed: {response.get('message')}")
            
        logger.info(f"Fyers Order Cancelled: {order_id}")

    async def get_positions(self):
        fyers = await self._get_fyers_client()
        response = fyers.positions()
        
        if response.get("s") != "ok":
            raise Exception(f"Failed to fetch Fyers positions: {response.get('message')}")
            
        fyers_positions = response.get("netPositions", [])
        positions = []
        for p in fyers_positions:
            qty = p.get("netQty", 0)
            side = "CLOSED"
            if qty > 0:
                side = "BUY"
            elif qty < 0:
                side = "SELL"
                
            positions.append({
                "symbol": p.get("symbol"),
                "quantity": abs(qty),
                "side": side,
                "average_price": p.get("avgPrice")
            })
            
        return positions

    async def get_balance(self):
        fyers = await self._get_fyers_client()
        response = fyers.funds()
        
        if response.get("s") != "ok":
            raise Exception(f"Failed to fetch Fyers funds: {response.get('message')}")
            
        fund_limits = response.get("fund_limit", [])
        available_balance = 0.0
        for fund in fund_limits:
            if fund.get("title") == "Available Balance":
                available_balance = fund.get("equityAmount", 0.0)
                break
                
        return {
            "balance": available_balance
        }

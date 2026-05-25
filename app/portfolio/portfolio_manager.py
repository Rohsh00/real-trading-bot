from collections import defaultdict
from app.core.logger import logger
from app.cache.redis import redis_client


class PortfolioManager:

    positions = defaultdict(dict)

    @classmethod
    async def get_cash_balance(cls) -> float:
        val = await redis_client.get("portfolio:cash_balance")
        return float(val) if val else 100000.0

    @classmethod
    async def set_cash_balance(cls, amount: float):
        await redis_client.set("portfolio:cash_balance", str(amount))

    @classmethod
    async def get_realized_pnl(cls) -> float:
        val = await redis_client.get("portfolio:realized_pnl")
        return float(val) if val else 0.0

    @classmethod
    async def set_realized_pnl(cls, amount: float):
        await redis_client.set("portfolio:realized_pnl", str(amount))

    @classmethod
    async def load_positions(
        cls,
        positions_list: list
    ):
        cls.positions.clear()
        for pos in positions_list:
            cls.positions[pos.symbol] = {
                "quantity": pos.quantity,
                "average_price": pos.average_price,
                "stop_loss": pos.stop_loss,
                "take_profit": pos.take_profit
            }

        logger.info(
            f"Loaded {len(positions_list)} positions "
            f"into memory."
        )

    @classmethod
    async def update_position(
        cls,
        symbol: str,
        side: str,
        quantity: float,
        price: float
    ):
        current_position = cls.positions.get(symbol)
        cash = await cls.get_cash_balance()
        pnl = await cls.get_realized_pnl()

        if side == "BUY":
            cash -= (quantity * price)
            cls.positions[symbol] = {
                "quantity": quantity,
                "average_price": price,
                "stop_loss": price * 0.98,
                "take_profit": price * 1.03
            }
            await cls.set_cash_balance(cash)

        elif side == "SELL" and current_position:
            trade_pnl = (price - current_position["average_price"]) * quantity
            pnl += trade_pnl
            cash += (quantity * price)
            
            cls.positions.pop(symbol)
            await cls.set_realized_pnl(pnl)
            await cls.set_cash_balance(cash)

            logger.info(f"Trade Closed. PnL={trade_pnl}")

        logger.info(f"Portfolio Updated: Cash={cash}")

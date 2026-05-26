from app.core.logger import logger
from app.services.risk_service import RiskService
from app.portfolio.portfolio_manager import PortfolioManager


class RiskManager:

    @classmethod
    async def validate_order(
        cls,
        symbol: str,
        quantity: float,
        price: float,
        side: str
    ) -> bool:

        settings = await RiskService.get_settings()
        
        # 1. Restricted Symbols Check
        def normalize_sym(s: str) -> str:
            return str(s).strip().upper().replace("/", "").replace("-", "")

        restricted_symbols = [
            normalize_sym(s) 
            for s in settings.get("restricted_symbols", [])
        ]
        if normalize_sym(symbol) in restricted_symbols:
            logger.warning(f"Risk rejected order: {symbol} is restricted")
            return False

        # 2. Max Position Size Check
        order_value = quantity * price
        if order_value > settings.get("max_position_size", 10000.0):
            logger.warning(f"Risk rejected order: size {order_value} exceeds max {settings.get('max_position_size')}")
            return False

        # 3. Max Open Positions Check (Only for BUY orders)
        if side == "BUY":
            open_positions = len(PortfolioManager.positions)
            if open_positions >= settings.get("max_open_positions", 5):
                logger.warning(f"Risk rejected order: max open positions {settings.get('max_open_positions')} reached")
                return False

        # 4. Max Daily Loss / Drawdown Check
        realized_pnl = await PortfolioManager.get_realized_pnl()
        max_daily_loss_limit = -abs(settings.get("max_daily_loss", 5000.0))
        if realized_pnl <= max_daily_loss_limit:
            logger.warning(f"Risk rejected order: max daily loss {max_daily_loss_limit} exceeded")
            return False

        return True

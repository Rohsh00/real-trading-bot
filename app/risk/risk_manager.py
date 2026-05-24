from app.core.logger import logger


class RiskManager:

    MAX_POSITION_SIZE = 10000

    @classmethod
    async def validate_order(
        cls,
        symbol: str,
        quantity: float,
        price: float
    ) -> bool:

        order_value = quantity * price

        if order_value > cls.MAX_POSITION_SIZE:

            logger.warning(
                f"Risk rejected order for {symbol}"
            )

            return False

        return True

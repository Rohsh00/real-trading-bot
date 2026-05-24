import uuid

from app.brokers.interfaces.base_broker import (
    BaseBroker
)

from app.core.logger import logger


class PaperBroker(BaseBroker):

    async def place_order(
        self,
        symbol,
        side,
        quantity,
        price
    ):

        order = {
            "order_id": str(uuid.uuid4()),
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "price": price,
            "status": "FILLED"
        }

        logger.info(
            f"Paper Order Filled: {order}"
        )

        return order

    async def cancel_order(
        self,
        order_id
    ):

        logger.info(
            f"Paper Order Cancelled: "
            f"{order_id}"
        )

    async def get_positions(
        self
    ):

        return []

    async def get_balance(
        self
    ):

        return {
            "balance": 100000
        }

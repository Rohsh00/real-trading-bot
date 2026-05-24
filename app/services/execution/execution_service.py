from uuid import uuid4
from decimal import Decimal

from app.models.order import Order
from app.models.trade import Trade

from app.repositories.order_repository import (
    OrderRepository
)

from app.repositories.trade_repository import (
    TradeRepository
)

from app.services.position.position_service import (
    PositionService
)


class ExecutionService:

    def __init__(
        self,
        db
    ):

        self.order_repo = OrderRepository(db)

        self.trade_repo = TradeRepository(db)

        self.position_service = PositionService(db)

    async def persist_execution(
        self,
        execution_result: dict
    ):

        order = Order(
            id=str(uuid4()),
            symbol=execution_result["symbol"],
            side=execution_result["side"],
            order_type="MARKET",
            quantity=Decimal(
                str(execution_result["quantity"])
            ),
            price=Decimal(
                str(execution_result["price"])
            ),
            status="FILLED"
        )

        saved_order = await self.order_repo.create(
            order
        )

        trade = Trade(
            id=str(uuid4()),
            order_id=saved_order.id,
            symbol=execution_result["symbol"],
            side=execution_result["side"],
            quantity=Decimal(
                str(execution_result["quantity"])
            ),
            price=Decimal(
                str(execution_result["price"])
            )
        )

        await self.trade_repo.create(
            trade
        )

        side = execution_result["side"]
        symbol = execution_result["symbol"]
        price = float(execution_result["price"])
        quantity = float(execution_result["quantity"])

        if side == "BUY":
            await self.position_service.create_position(
                symbol=symbol,
                quantity=quantity,
                average_price=price,
                stop_loss=price * 0.98,
                take_profit=price * 1.03
            )
        elif side == "SELL":
            await self.position_service.close_position(
                symbol=symbol
            )

        return saved_order

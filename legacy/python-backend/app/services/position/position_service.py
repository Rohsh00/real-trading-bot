from uuid import uuid4

from app.models.position import Position

from app.repositories.position_repository import (
    PositionRepository
)


class PositionService:

    def __init__(
        self,
        db
    ):
        self.repo = PositionRepository(db)

    async def create_position(
        self,
        symbol: str,
        quantity: float,
        average_price: float,
        stop_loss: float,
        take_profit: float
    ):

        position = Position(
            id=str(uuid4()),
            symbol=symbol,
            quantity=quantity,
            average_price=average_price,
            stop_loss=stop_loss,
            take_profit=take_profit,
            unrealized_pnl=0
        )

        return await self.repo.create(
            position
        )

    async def get_position(
        self,
        symbol: str
    ):

        return await self.repo.get_by_symbol(
            symbol
        )

    async def get_all_positions(
        self
    ):

        return await self.repo.get_all()

    async def close_position(
        self,
        symbol: str
    ):

        position = await self.repo.get_by_symbol(
            symbol
        )

        if position:

            await self.repo.delete(
                position
            )

    async def update_position(
        self,
        position
    ):

        await self.repo.update()

        return position

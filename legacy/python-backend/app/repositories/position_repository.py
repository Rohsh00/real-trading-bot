from sqlalchemy import select

from app.models.position import Position


class PositionRepository:

    def __init__(
        self,
        db
    ):
        self.db = db

    async def create(
        self,
        position: Position
    ):

        self.db.add(position)

        await self.db.commit()

        await self.db.refresh(position)

        return position

    async def get_by_symbol(
        self,
        symbol: str
    ):

        result = await self.db.execute(
            select(Position).where(
                Position.symbol == symbol
            )
        )

        return result.scalar_one_or_none()

    async def get_all(self):

        result = await self.db.execute(
            select(Position)
        )

        return result.scalars().all()

    async def delete(
        self,
        position: Position
    ):

        await self.db.delete(position)

        await self.db.commit()

    async def update(self):

        await self.db.commit()

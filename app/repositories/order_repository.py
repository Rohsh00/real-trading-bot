from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order


class OrderRepository:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db

    async def create(
        self,
        order: Order
    ) -> Order:

        self.db.add(order)

        await self.db.commit()

        await self.db.refresh(order)

        return order

    async def get_by_id(
        self,
        order_id: str
    ):

        result = await self.db.execute(
            select(Order).where(
                Order.id == order_id
            )
        )

        return result.scalar_one_or_none()

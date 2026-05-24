from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.strategy import Strategy


class StrategyRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        strategy_data: dict
    ):

        strategy = Strategy(**strategy_data)

        db.add(strategy)

        await db.commit()
        await db.refresh(strategy)

        return strategy

    @staticmethod
    async def get_all(
        db: AsyncSession
    ):

        result = await db.execute(
            select(Strategy)
        )

        return result.scalars().all()

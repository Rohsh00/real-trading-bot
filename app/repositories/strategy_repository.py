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

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        strategy_id: str
    ):
        result = await db.execute(
            select(Strategy).where(Strategy.id == strategy_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update(
        db: AsyncSession,
        strategy: Strategy,
        update_data: dict
    ):
        for key, value in update_data.items():
            setattr(strategy, key, value)
        await db.commit()
        await db.refresh(strategy)
        return strategy

    @staticmethod
    async def delete(
        db: AsyncSession,
        strategy: Strategy
    ):
        await db.delete(strategy)
        await db.commit()
        return True

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.strategy_repository import (
    StrategyRepository
)


class StrategyService:

    @staticmethod
    async def create_strategy(
        db: AsyncSession,
        payload: dict
    ):

        return await StrategyRepository.create(
            db,
            payload
        )

    @staticmethod
    async def list_strategies(
        db: AsyncSession
    ):

        return await StrategyRepository.get_all(db)

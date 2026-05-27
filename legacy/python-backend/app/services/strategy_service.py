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

    @staticmethod
    async def update_strategy(
        db: AsyncSession,
        strategy_id: str,
        update_data: dict
    ):
        strategy = await StrategyRepository.get_by_id(db, strategy_id)
        if not strategy:
            return None
        return await StrategyRepository.update(db, strategy, update_data)

    @staticmethod
    async def delete_strategy(
        db: AsyncSession,
        strategy_id: str
    ):
        strategy = await StrategyRepository.get_by_id(db, strategy_id)
        if not strategy:
            return False
        return await StrategyRepository.delete(db, strategy)

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schemas.strategy import (
    StrategyCreate,
    StrategyResponse
)

from app.services.strategy_service import (
    StrategyService
)

router = APIRouter()


@router.post(
    "/strategies",
    response_model=StrategyResponse
)
async def create_strategy(
    payload: StrategyCreate,
    db: AsyncSession = Depends(get_db)
):

    strategy = await StrategyService.create_strategy(
        db,
        payload.model_dump()
    )

    return strategy


@router.get(
    "/strategies",
    response_model=list[StrategyResponse]
)
async def list_strategies(
    db: AsyncSession = Depends(get_db)
):

    return await StrategyService.list_strategies(db)

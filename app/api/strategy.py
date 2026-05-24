from fastapi import APIRouter
from fastapi import Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schemas.strategy import (
    StrategyCreate,
    StrategyResponse,
    StrategyUpdate
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


@router.put(
    "/strategies/{strategy_id}",
    response_model=StrategyResponse
)
async def update_strategy(
    strategy_id: str,
    payload: StrategyUpdate,
    db: AsyncSession = Depends(get_db)
):

    strategy = await StrategyService.update_strategy(
        db,
        strategy_id,
        payload.model_dump(exclude_unset=True)
    )

    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")

    return strategy


@router.delete(
    "/strategies/{strategy_id}"
)
async def delete_strategy(
    strategy_id: str,
    db: AsyncSession = Depends(get_db)
):

    success = await StrategyService.delete_strategy(
        db,
        strategy_id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Strategy not found")

    return {"message": "Strategy deleted successfully"}

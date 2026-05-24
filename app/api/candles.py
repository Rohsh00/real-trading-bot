from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.repositories.candle.candle_repository import (
    CandleRepository
)

router = APIRouter()


@router.get("/candles")

async def get_candles(
    symbol: str,
    timeframe: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):

    repo = CandleRepository(db)

    candles = await repo.get_candles(
        symbol=symbol,
        timeframe=timeframe,
        limit=limit
    )

    return candles

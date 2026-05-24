from sqlalchemy import select

from app.models.candle import Candle


class CandleRepository:

    def __init__(
        self,
        db
    ):

        self.db = db

    async def create(
        self,
        candle: Candle
    ):

        self.db.add(candle)

        await self.db.commit()

        await self.db.refresh(candle)

        return candle

    async def get_candles(
        self,
        symbol: str,
        timeframe: str,
        limit: int = 100
    ):

        query = (
            select(Candle)
            .where(
                Candle.symbol == symbol,
                Candle.timeframe == timeframe
            )
            .limit(limit)
        )

        result = await self.db.execute(
            query
        )

        return result.scalars().all()

from uuid import uuid4
from decimal import Decimal
from datetime import datetime

from app.models.candle import Candle

from app.repositories.candle.candle_repository import (
    CandleRepository
)

from app.core.logger import logger


class CandleService:

    def __init__(
        self,
        db
    ):

        self.repo = CandleRepository(db)

    async def persist_candle(
        self,
        candle_data: dict
    ):

        timestamp = datetime.fromisoformat(
            candle_data["timestamp"]
        )

        candle = Candle(
            id=str(uuid4()),
            symbol=candle_data["symbol"],
            timeframe=candle_data["timeframe"],
            open=Decimal(
                str(candle_data["open"])
            ),
            high=Decimal(
                str(candle_data["high"])
            ),
            low=Decimal(
                str(candle_data["low"])
            ),
            close=Decimal(
                str(candle_data["close"])
            ),
            volume=Decimal(
                str(candle_data["volume"])
            ),
            timestamp=timestamp
        )

        saved = await self.repo.create(
            candle
        )

        logger.info(
            f"Candle Persisted: "
            f"{saved.symbol} "
            f"{saved.timeframe}"
        )

        return saved
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class Candle(BaseModel):

    __tablename__ = "candles"

    symbol: Mapped[str] = mapped_column(
        String(20),
        index=True
    )

    timeframe: Mapped[str] = mapped_column(
        String(10),
        index=True
    )

    timestamp: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        index=True
    )

    open: Mapped[float] = mapped_column(Float)

    high: Mapped[float] = mapped_column(Float)

    low: Mapped[float] = mapped_column(Float)

    close: Mapped[float] = mapped_column(Float)

    volume: Mapped[float] = mapped_column(Float)

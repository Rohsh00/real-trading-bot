from sqlalchemy import String
from sqlalchemy import Float

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class Position(BaseModel):

    __tablename__ = "positions"

    symbol: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        index=True
    )

    quantity: Mapped[float] = mapped_column(
        Float
    )

    average_price: Mapped[float] = mapped_column(
        Float
    )

    stop_loss: Mapped[float] = mapped_column(
        Float
    )

    take_profit: Mapped[float] = mapped_column(
        Float
    )

    unrealized_pnl: Mapped[float] = mapped_column(
        Float,
        default=0
    )
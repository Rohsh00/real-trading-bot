from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import JSON

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class RiskSettings(BaseModel):

    __tablename__ = "risk_settings"

    # We will only have one row, so we can use a static ID or just rely on the first row
    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        default="default"
    )

    max_position_size: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=10000.0
    )

    max_open_positions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5
    )

    max_daily_loss: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=-5000.0
    )

    restricted_symbols: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=[]
    )

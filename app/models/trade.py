from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import ForeignKey

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class Trade(BaseModel):

    __tablename__ = "trades"

    order_id: Mapped[str] = mapped_column(
        ForeignKey("orders.id"),
        nullable=False
    )

    symbol: Mapped[str] = mapped_column(
        String(20),
        index=True
    )

    side: Mapped[str] = mapped_column(
        String(10)
    )

    quantity: Mapped[float] = mapped_column(
        Float
    )

    price: Mapped[float] = mapped_column(
        Float
    )

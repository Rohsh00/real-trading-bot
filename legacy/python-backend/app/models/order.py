from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class Order(BaseModel):

    __tablename__ = "orders"

    symbol: Mapped[str] = mapped_column(
        String(20),
        index=True
    )

    side: Mapped[str] = mapped_column(
        String(10)
    )

    order_type: Mapped[str] = mapped_column(
        String(20)
    )

    quantity: Mapped[float] = mapped_column(
        Float
    )

    price: Mapped[float] = mapped_column(
        Float
    )

    status: Mapped[str] = mapped_column(
        String(20),
        index=True
    )

    exchange_order_id: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

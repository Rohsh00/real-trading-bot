from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import JSON

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class Strategy(BaseModel):

    __tablename__ = "strategies"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    config: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default={}
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

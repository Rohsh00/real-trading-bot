from sqlalchemy import String
from sqlalchemy import JSON

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base_model import BaseModel


class AuditLog(BaseModel):

    __tablename__ = "audit_logs"

    event_type: Mapped[str] = mapped_column(
        String(50),
        index=True,
        nullable=False
    )

    event_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    entity_id: Mapped[str] = mapped_column(
        String(50),
        nullable=True,
        index=True
    )

    details: Mapped[dict] = mapped_column(
        JSON,
        nullable=True,
        default={}
    )

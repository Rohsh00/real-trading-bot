import uuid
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.repositories.audit_repository import AuditRepository
from app.core.logger import logger


class AuditService:

    @staticmethod
    async def log_event(
        db: AsyncSession,
        event_type: str,
        event_name: str,
        entity_id: Optional[str] = None,
        details: Optional[dict] = None
    ) -> AuditLog:
        """
        Record a significant system event in the audit trail.
        """
        if details is None:
            details = {}

        if entity_id is not None:
            entity_id = str(entity_id)

        audit_log = AuditLog(
            id=uuid.uuid4(),
            event_type=event_type,
            event_name=event_name,
            entity_id=entity_id,
            details=details
        )

        repo = AuditRepository(db)
        try:
            saved_log = await repo.create(audit_log)
            logger.debug(f"Audit Log Created: [{event_type}] {event_name}")
            return saved_log
        except Exception as e:
            logger.error(f"Failed to save audit log for {event_name}: {e}")
            raise

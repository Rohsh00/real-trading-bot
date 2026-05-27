from sqlalchemy import select
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog


class AuditRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, audit_log: AuditLog) -> AuditLog:
        self.db.add(audit_log)
        await self.db.commit()
        await self.db.refresh(audit_log)
        return audit_log

    async def get_recent(self, limit: int = 100) -> list[AuditLog]:
        result = await self.db.execute(
            select(AuditLog)
            .order_by(desc(AuditLog.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

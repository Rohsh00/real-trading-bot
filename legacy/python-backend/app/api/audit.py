from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.audit_repository import AuditRepository

router = APIRouter()


@router.get("/audit")
async def get_audit_logs(
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    repo = AuditRepository(db)
    logs = await repo.get_recent(limit=limit)
    return logs

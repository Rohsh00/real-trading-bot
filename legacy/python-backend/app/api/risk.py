from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.core.database import get_db
from app.services.risk_service import RiskService
from app.core.logger import logger

router = APIRouter(prefix="/api/v1/risk", tags=["Risk Controls"])


@router.get("")
async def get_risk_settings(db: AsyncSession = Depends(get_db)):
    """
    Get the current risk settings.
    """
    try:
        settings = await RiskService.get_settings(db)
        return settings
    except Exception as e:
        logger.error(f"Error fetching risk settings: {e}")
        return {"error": "Failed to fetch risk settings"}


@router.put("")
async def update_risk_settings(
    data: Dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Update the risk settings.
    """
    try:
        updated_settings = await RiskService.update_settings(db, data)
        return updated_settings
    except Exception as e:
        logger.error(f"Error updating risk settings: {e}")
        return {"error": "Failed to update risk settings"}

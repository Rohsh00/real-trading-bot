from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.models.risk import RiskSettings


class RiskRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_settings(self) -> RiskSettings:
        result = await self.db.execute(
            select(RiskSettings).where(RiskSettings.name == "default")
        )
        settings = result.scalar_one_or_none()
        
        if not settings:
            settings = RiskSettings(
                id=uuid.uuid4(),
                name="default",
                max_position_size=10000.0,
                max_open_positions=5,
                max_daily_loss=-5000.0,
                restricted_symbols=["DOGEUSDT", "SHIBUSDT"]
            )
            self.db.add(settings)
            await self.db.commit()
            await self.db.refresh(settings)

        return settings

    async def update_settings(self, data: dict) -> RiskSettings:
        settings = await self.get_settings()
        
        if "max_position_size" in data:
            settings.max_position_size = data["max_position_size"]
        if "max_open_positions" in data:
            settings.max_open_positions = data["max_open_positions"]
        if "max_daily_loss" in data:
            settings.max_daily_loss = data["max_daily_loss"]
        if "restricted_symbols" in data:
            settings.restricted_symbols = data["restricted_symbols"]

        await self.db.commit()
        await self.db.refresh(settings)
        return settings

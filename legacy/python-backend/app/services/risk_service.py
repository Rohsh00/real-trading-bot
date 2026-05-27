import orjson
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache.redis import redis_client
from app.repositories.risk_repository import RiskRepository
from app.core.logger import logger


class RiskService:

    CACHE_KEY = "system:risk_settings"

    @classmethod
    async def get_settings(cls, db: AsyncSession = None) -> dict:
        """
        Get risk settings from Redis cache.
        If cache miss, fetch from DB and populate cache.
        """
        cached = await redis_client.get(cls.CACHE_KEY)
        if cached:
            return orjson.loads(cached)

        if db is None:
            # Need DB to fetch, but it wasn't provided.
            # Return defaults or raise error. We'll return safe defaults.
            logger.warning("Risk cache miss and no DB session provided!")
            return {
                "max_position_size": 10000.0,
                "max_open_positions": 5,
                "max_daily_loss": -5000.0,
                "restricted_symbols": []
            }

        repo = RiskRepository(db)
        settings = await repo.get_settings()
        
        data = {
            "max_position_size": settings.max_position_size,
            "max_open_positions": settings.max_open_positions,
            "max_daily_loss": settings.max_daily_loss,
            "restricted_symbols": settings.restricted_symbols
        }

        await cls._update_cache(data)
        return data

    @classmethod
    async def update_settings(cls, db: AsyncSession, data: dict) -> dict:
        repo = RiskRepository(db)
        settings = await repo.update_settings(data)
        
        updated_data = {
            "max_position_size": settings.max_position_size,
            "max_open_positions": settings.max_open_positions,
            "max_daily_loss": settings.max_daily_loss,
            "restricted_symbols": settings.restricted_symbols
        }

        await cls._update_cache(updated_data)
        return updated_data

    @classmethod
    async def _update_cache(cls, data: dict):
        await redis_client.set(cls.CACHE_KEY, orjson.dumps(data))
        logger.info(f"Risk settings cache updated: {data}")

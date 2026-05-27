import orjson
from app.cache.redis import redis_client
from app.core.logger import logger


class FyersTokenService:
    REDIS_KEY = "fyers_access_token"

    @classmethod
    async def save_token(cls, access_token: str, refresh_token: str = None):
        data = {"access_token": access_token}
        if refresh_token:
            data["refresh_token"] = refresh_token
        
        await redis_client.set(cls.REDIS_KEY, orjson.dumps(data))
        logger.info("Fyers token saved to Redis")

    @classmethod
    async def get_token(cls):
        data = await redis_client.get(cls.REDIS_KEY)
        if data:
            return orjson.loads(data)
        return None

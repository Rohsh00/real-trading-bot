import orjson

from app.cache.redis import redis_client

from app.core.logger import logger


class SignalPublisher:

    CHANNEL_NAME = "trading_signals"

    @staticmethod
    async def publish(signal: dict):

        await redis_client.publish(
            SignalPublisher.CHANNEL_NAME,
            orjson.dumps(signal).decode()
        )

        logger.info(
            f"Signal Published: {signal}"
        )

import orjson

from app.cache.redis import redis_client


class CandlePublisher:

    CHANNEL = "candle_events"

    @classmethod
    async def publish(
        cls,
        candle: dict
    ):

        await redis_client.publish(
            cls.CHANNEL,
            orjson.dumps(
                candle
            ).decode()
        )

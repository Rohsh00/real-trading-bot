import orjson
from datetime import datetime, timezone

from app.cache.redis import redis_client
from app.core.logger import logger


class SignalPublisher:

    CHANNEL_NAME = "trading_signals"
    LOG_KEY = "signals_log"        # Redis list, capped at 100 entries
    LOG_MAX = 100

    @staticmethod
    async def publish(signal: dict):
        # Stamp the signal with a UTC timestamp
        signal_with_ts = {
            **signal,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        payload = orjson.dumps(signal_with_ts).decode()

        # 1. Pub/sub for execution_runner to consume
        await redis_client.publish(
            SignalPublisher.CHANNEL_NAME,
            payload
        )

        # 2. Persist to capped Redis list so /signals/recent can read it
        await redis_client.lpush(SignalPublisher.LOG_KEY, payload)
        await redis_client.ltrim(SignalPublisher.LOG_KEY, 0, SignalPublisher.LOG_MAX - 1)

        logger.info(f"Signal Published: {signal_with_ts}")

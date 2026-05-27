from collections import defaultdict
from datetime import datetime

import orjson

from app.cache.redis import redis_client
from app.core.logger import logger
from app.services.candle.candle_publisher import CandlePublisher


class TimeframeCandleEngine:

    candles = defaultdict(dict)

    TIMEFRAMES = [
        "1m",
        "5m",
        "15m"
    ]

    @classmethod
    def _is_complete(
        cls,
        candle: dict
    ):

        age = (
            datetime.utcnow()
            - candle["created_at"]
        ).seconds

        timeframe = candle["timeframe"]

        if timeframe == "1m":
            return age >= 60

        if timeframe == "5m":
            return age >= 300

        if timeframe == "15m":
            return age >= 900

        return False

    @classmethod
    async def _publish_live(cls, candle: dict):
        """
        Store the current in-progress candle in Redis so the FastAPI
        WebSocket endpoint (different process) can read and stream it.
          Key:  live_candle:{symbol}:{timeframe}  (TTL 120s)
          PubSub channel: live_candle_events:{symbol}:{timeframe}
        """
        redis_key = f"live_candle:{candle['symbol']}:{candle['timeframe']}"
        channel = f"live_candle_events:{candle['symbol']}:{candle['timeframe']}"

        payload = orjson.dumps({
            "symbol": candle["symbol"],
            "timeframe": candle["timeframe"],
            "open": candle["open"],
            "high": candle["high"],
            "low": candle["low"],
            "close": candle["close"],
            "volume": candle["volume"],
            "timestamp": candle["created_at"].isoformat(),
            "is_live": True,
        }).decode()

        # Store latest state (readable by HTTP endpoint)
        await redis_client.set(redis_key, payload, ex=120)

        # Pub/sub push so WebSocket can forward to browser immediately
        await redis_client.publish(channel, payload)

    @classmethod
    async def process_tick(
        cls,
        symbol,
        price,
        quantity=0
    ):

        for timeframe in cls.TIMEFRAMES:

            key = f"{symbol}:{timeframe}"

            candle = cls.candles.get(key)

            if candle and cls._is_complete(candle):

                completed_candle = {
                    "symbol": candle["symbol"],
                    "timeframe": candle["timeframe"],
                    "open": candle["open"],
                    "high": candle["high"],
                    "low": candle["low"],
                    "close": candle["close"],
                    "volume": candle["volume"],
                    "timestamp": candle["created_at"].isoformat()
                }

                await CandlePublisher.publish(completed_candle)

                logger.info(f"Published Candle: {key}")

                # Start a new candle from this tick
                cls.candles[key] = {
                    "symbol": symbol,
                    "timeframe": timeframe,
                    "open": price,
                    "high": price,
                    "low": price,
                    "close": price,
                    "volume": quantity,
                    "created_at": datetime.utcnow()
                }

                await cls._publish_live(cls.candles[key])
                continue

            if not candle:

                cls.candles[key] = {
                    "symbol": symbol,
                    "timeframe": timeframe,
                    "open": price,
                    "high": price,
                    "low": price,
                    "close": price,
                    "volume": quantity,
                    "created_at": datetime.utcnow()
                }

            else:

                candle["high"] = max(candle["high"], price)
                candle["low"] = min(candle["low"], price)
                candle["close"] = price
                candle["volume"] += quantity

            # Publish live state on every tick update
            await cls._publish_live(cls.candles[key])

            logger.info(f"{key} Candle Updated")
import orjson

from app.cache.redis import redis_client

from app.core.logger import logger


class TickProcessor:

    CHANNEL_NAME = "market_ticks"

    @staticmethod
    async def process_tick(data: dict):

        normalized_tick = {
            "symbol": data.get("s"),
            "price": float(data.get("p")),
            "quantity": float(data.get("q")),
            "trade_time": data.get("T")
        }

        await redis_client.publish(
            TickProcessor.CHANNEL_NAME,
            orjson.dumps(normalized_tick).decode()
        )

        await redis_client.set(
            f"latest_price:{normalized_tick['symbol']}",
            normalized_tick["price"]
        )

        logger.info(
            f"Processed tick: {normalized_tick}"
        )

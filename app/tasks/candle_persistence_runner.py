import asyncio

import orjson

from app.cache.redis import redis_client

from app.core.database import (
    AsyncSessionLocal
)

from app.services.candle.candle_service import (
    CandleService
)

from app.core.logger import logger


async def main():

    logger.info(
        "Starting Candle Persistence Runner..."
    )

    pubsub = redis_client.pubsub()

    await pubsub.subscribe(
        "candle_events"
    )

    logger.info(
        "Subscribed to candle_events"
    )

    async for message in pubsub.listen():

        if message["type"] != "message":
            continue

        try:

            candle = orjson.loads(
                message["data"]
            )

            async with (
                AsyncSessionLocal()
            ) as db:

                service = CandleService(db)

                await service.persist_candle(
                    candle
                )

        except Exception as e:

            logger.error(
                f"Candle Persistence Error: {e}"
            )


if __name__ == "__main__":

    asyncio.run(main())
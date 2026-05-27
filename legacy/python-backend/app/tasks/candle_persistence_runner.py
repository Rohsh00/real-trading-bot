import asyncio
import traceback

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


async def run_with_recovery():
    while True:
        try:
            await main()
        except Exception as e:
            logger.error(f"Candle Persistence Runner crashed: {e}")
            logger.error(traceback.format_exc())
            logger.info("Restarting Candle Persistence Runner in 5 seconds...")
            await asyncio.sleep(5)


if __name__ == "__main__":

    asyncio.run(run_with_recovery())
import asyncio

import orjson

from app.cache.redis import (
    redis_client
)

from app.strategy_engine.strategy_manager import (
    StrategyManager
)

from app.core.logger import logger


async def main():

    logger.info(
        "Starting Strategy Runner..."
    )

    pubsub = redis_client.pubsub()

    await pubsub.subscribe(
        "market_ticks"
    )

    logger.info(
        "Subscribed to market_ticks"
    )

    strategy_manager = StrategyManager()

    async def sync_loop():
        while True:
            try:
                await strategy_manager.sync_strategies()
            except Exception as e:
                logger.error(f"Strategy Sync Error: {e}")
            await asyncio.sleep(5)

    asyncio.create_task(sync_loop())

    while True:

        message = await pubsub.get_message(
            ignore_subscribe_messages=True,
            timeout=1.0
        )

        if message is None:

            await asyncio.sleep(
                0.01
            )

            continue

        try:

            tick = orjson.loads(
                message["data"]
            )

            logger.info(
                f"Received Tick: {tick}"
            )

            signal = (
                await strategy_manager.process_market_data(
                    symbol=tick["symbol"],
                    price=tick["price"]
                )
            )

            if signal:

                logger.info(
                    f"Generated Signal: {signal}"
                )

        except Exception as e:

            logger.error(
                f"Strategy Runner Error: {e}"
            )


if __name__ == "__main__":

    asyncio.run(main())
import asyncio
import traceback

from app.core.logger import logger

from app.websockets.market_stream import (
    MarketStream
)


async def main():

    stream = MarketStream()

    await stream.start()


async def run_with_recovery():
    while True:
        try:
            await main()
        except Exception as e:
            logger.error(f"Stream Runner crashed: {e}")
            logger.error(traceback.format_exc())
            logger.info("Restarting Stream Runner in 5 seconds...")
            await asyncio.sleep(5)


if __name__ == "__main__":

    asyncio.run(run_with_recovery())

import asyncio

from app.websockets.market_stream import (
    MarketStream
)


async def main():

    stream = MarketStream()

    await stream.start()


if __name__ == "__main__":

    asyncio.run(main())

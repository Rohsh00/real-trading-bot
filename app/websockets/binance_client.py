import websockets
import orjson

from tenacity import retry
from tenacity import wait_fixed
from tenacity import stop_after_attempt

from app.registry.strategy_registry import (
    StrategyRegistry
)

from app.core.logger import logger


class BinanceWebSocketClient:

    registry = StrategyRegistry()

    symbols = (
        registry.get_symbols()
    )

    stream_url = (
        "wss://stream.binance.com:9443/stream?streams="
        + "/".join(
            [
                f"{symbol.lower()}@trade"
                for symbol in symbols
            ]
        )
    )

    @retry(
        wait=wait_fixed(5),
        stop=stop_after_attempt(999999)
    )
    async def connect(self):

        logger.info(
            f"Connecting to {self.stream_url}"
        )

        async with websockets.connect(
            self.stream_url
        ) as websocket:

            logger.info(
                "Connected to Binance"
            )

            while True:

                message = await websocket.recv()

                payload = orjson.loads(
                    message
                )

                yield payload["data"]

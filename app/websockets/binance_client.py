import asyncio

import websockets
import orjson

from app.registry.strategy_registry import (
    StrategyRegistry
)

from app.core.logger import logger
from app.core.config import settings


class BinanceWebSocketClient:

    registry = StrategyRegistry()

    symbols = (
        registry.get_symbols()
    )

    stream_url = (
        f"{settings.BINANCE_WS_BASE_URL}/stream?streams="
        + "/".join(
            [
                f"{symbol.lower()}@trade"
                for symbol in symbols
            ]
        )
    )

    async def connect(self):
        """
        Async generator that yields trade ticks forever.
        Reconnects automatically on any disconnect or timeout —
        using a manual retry loop instead of @retry so that it
        works correctly with async generators (tenacity @retry
        does not compose properly with `async def ... yield`).
        """

        reconnect_delay = 5  # seconds between reconnect attempts

        while True:

            try:

                logger.info(
                    f"Connecting to Binance: {self.stream_url}"
                )

                async with websockets.connect(
                    self.stream_url,
                    ping_interval=20,      # send a ping every 20s
                    ping_timeout=30,       # wait up to 30s for pong
                    close_timeout=10,
                ) as websocket:

                    logger.info("Connected to Binance WebSocket")
                    reconnect_delay = 5    # reset backoff on success

                    while True:

                        message = await websocket.recv()

                        payload = orjson.loads(message)

                        yield payload["data"]

            except (
                websockets.exceptions.ConnectionClosedError,
                websockets.exceptions.ConnectionClosedOK,
                asyncio.TimeoutError,
                OSError,
            ) as exc:

                logger.warning(
                    f"Binance WebSocket disconnected: {exc}. "
                    f"Reconnecting in {reconnect_delay}s..."
                )

                await asyncio.sleep(reconnect_delay)

                # Exponential backoff capped at 60s
                reconnect_delay = min(reconnect_delay * 2, 60)

            except Exception as exc:

                logger.error(
                    f"Unexpected stream error: {exc}. "
                    f"Reconnecting in {reconnect_delay}s..."
                )

                await asyncio.sleep(reconnect_delay)

                reconnect_delay = min(reconnect_delay * 2, 60)

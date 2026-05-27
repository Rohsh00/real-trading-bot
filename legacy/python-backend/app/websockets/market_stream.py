from app.websockets.binance_client import (
    BinanceWebSocketClient
)

from app.market.tick_processor import (
    TickProcessor
)

from app.candles.timeframe_candle_engine import (
    TimeframeCandleEngine
)

from app.core.logger import logger


class MarketStream:

    def __init__(self):

        self.client = BinanceWebSocketClient()

    async def start(self):

        logger.info(
            "Starting Market Stream"
        )

        async for tick in self.client.connect():

            await TickProcessor.process_tick(
                tick
            )

            await TimeframeCandleEngine.process_tick(
                symbol=tick["s"],
                price=float(tick["p"]),
                quantity=float(tick["q"])
            )

from collections import defaultdict

from app.core.logger import logger


class CandleBuilder:

    candles = defaultdict(dict)

    @classmethod
    async def process_tick(
        cls,
        tick: dict
    ):

        symbol = tick["symbol"]

        candle = cls.candles.get(symbol)

        if not candle:

            cls.candles[symbol] = {
                "open": tick["price"],
                "high": tick["price"],
                "low": tick["price"],
                "close": tick["price"]
            }

        else:

            candle["high"] = max(
                candle["high"],
                tick["price"]
            )

            candle["low"] = min(
                candle["low"],
                tick["price"]
            )

            candle["close"] = tick["price"]

        logger.info(
            f"Candle Updated: {cls.candles[symbol]}"
        )

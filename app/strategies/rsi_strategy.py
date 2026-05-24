from collections import defaultdict

import pandas as pd

from app.signals.signal_publisher import (
    SignalPublisher
)

from app.core.logger import logger


class RSIStrategy:

    def __init__(
        self,
        period=14
    ):

        self.period = period

        self.price_history = defaultdict(list)

    async def generate_signal(
        self,
        symbol,
        price
    ):

        history = self.price_history[symbol]

        history.append(price)

        if len(history) < self.period:
            return

        prices = pd.Series(history)

        delta = prices.diff()

        gain = (
            delta.where(delta > 0, 0)
            .rolling(self.period)
            .mean()
        )

        loss = (
            -delta.where(delta < 0, 0)
            .rolling(self.period)
            .mean()
        )

        rs = gain / loss

        rsi = (
            100
            - (
                100 / (1 + rs)
            )
        )

        latest_rsi = rsi.iloc[-1]

        signal = None

        if latest_rsi < 30:
            signal = "BUY"

        elif latest_rsi > 70:
            signal = "SELL"

        if signal:

            payload = {
                "strategy": "rsi",
                "symbol": symbol,
                "signal": signal,
                "price": price
            }

            logger.info(
                f"RSI Signal: {payload}"
            )

            await SignalPublisher.publish(
                payload
            )

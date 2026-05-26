from collections import defaultdict

import pandas as pd

from app.signals.signal_publisher import (
    SignalPublisher
)

from app.core.logger import logger

from app.strategy_engine.base_strategy import BaseStrategy

class MACDStrategy(BaseStrategy):

    strategy_name = "macd"

    def __init__(self):

        self.price_history = defaultdict(list)

    async def generate_signal(
        self,
        symbol,
        price
    ):

        history = self.price_history[symbol]

        history.append(price)

        if len(history) < 35:
            return

        prices = pd.Series(history)

        ema12 = prices.ewm(
            span=12
        ).mean()

        ema26 = prices.ewm(
            span=26
        ).mean()

        macd = ema12 - ema26

        signal_line = macd.ewm(
            span=9
        ).mean()

        latest_macd = macd.iloc[-1]
        latest_signal = signal_line.iloc[-1]

        previous_macd = macd.iloc[-2]
        previous_signal = signal_line.iloc[-2]

        signal = None

        if (
            previous_macd <= previous_signal
            and latest_macd > latest_signal
        ):

            signal = "BUY"

        elif (
            previous_macd >= previous_signal
            and latest_macd < latest_signal
        ):

            signal = "SELL"

        if signal:

            payload = {
                "strategy": "macd",
                "symbol": symbol,
                "signal": signal,
                "price": price
            }

            logger.info(
                f"MACD Signal: {payload}"
            )

            await SignalPublisher.publish(
                payload
            )

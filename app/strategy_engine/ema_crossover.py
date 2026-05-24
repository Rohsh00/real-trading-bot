from collections import defaultdict

import pandas as pd

from app.strategy_engine.base_strategy import (
    BaseStrategy
)

from app.signals.signal_publisher import (
    SignalPublisher
)

from app.core.logger import logger


class EMACrossoverStrategy(BaseStrategy):

    def __init__(
        self,
        fast_period: int = 5,
        slow_period: int = 10
    ):

        self.fast_period = fast_period
        self.slow_period = slow_period

        self.price_history = defaultdict(list)

    async def generate_signal(
        self,
        symbol: str,
        price: float
    ):

        history = self.price_history[symbol]

        history.append(price)

        max_history = self.slow_period + 50

        if len(history) > max_history:
            history.pop(0)

        if len(history) < self.slow_period:
            return

        prices = pd.Series(history)

        fast_ema = prices.ewm(
            span=self.fast_period
        ).mean()

        slow_ema = prices.ewm(
            span=self.slow_period
        ).mean()

        latest_fast = fast_ema.iloc[-1]
        latest_slow = slow_ema.iloc[-1]

        previous_fast = fast_ema.iloc[-2]
        previous_slow = slow_ema.iloc[-2]

        signal = None

        if (
            previous_fast <= previous_slow
            and latest_fast > latest_slow
        ):

            signal = "BUY"

        elif (
            previous_fast >= previous_slow
            and latest_fast < latest_slow
        ):

            signal = "SELL"

        if signal:

            payload = {
                "strategy": "ema_crossover",
                "symbol": symbol,
                "signal": signal,
                "price": price
            }

            logger.info(
                f"Generated Signal: {payload}"
            )

            await SignalPublisher.publish(
                payload
            )

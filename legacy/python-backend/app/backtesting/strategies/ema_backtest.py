import pandas as pd


class EMABacktestStrategy:

    def __init__(
        self,
        fast_period=5,
        slow_period=10
    ):

        self.fast_period = fast_period
        self.slow_period = slow_period

    def generate_signals(
        self,
        dataframe: pd.DataFrame
    ):

        dataframe["fast_ema"] = (
            dataframe["close"]
            .ewm(span=self.fast_period)
            .mean()
        )

        dataframe["slow_ema"] = (
            dataframe["close"]
            .ewm(span=self.slow_period)
            .mean()
        )

        dataframe["signal"] = 0

        dataframe.loc[
            dataframe["fast_ema"]
            > dataframe["slow_ema"],
            "signal"
        ] = 1

        dataframe.loc[
            dataframe["fast_ema"]
            < dataframe["slow_ema"],
            "signal"
        ] = -1

        return dataframe

from app.backtesting.metrics.performance_metrics import (
    PerformanceMetrics
)

from app.core.logger import logger


class BacktestEngine:

    def __init__(
        self,
        strategy,
        initial_balance=10000
    ):

        self.strategy = strategy

        self.initial_balance = initial_balance

        self.balance = initial_balance

        self.position = None

        self.trade_history = []

        self.equity_curve = []

    def run(
        self,
        dataframe
    ):

        dataframe = (
            self.strategy.generate_signals(
                dataframe
            )
        )

        previous_signal = 0

        for _, row in dataframe.iterrows():

            signal = row["signal"]

            price = row["close"]

            if (
                signal == 1
                and previous_signal != 1
            ):

                self.position = price

                logger.info(
                    f"BUY at {price}"
                )

            elif (
                signal == -1
                and self.position
            ):

                pnl = (
                    price
                    - self.position
                )

                self.balance += pnl

                self.trade_history.append(
                    pnl
                )

                logger.info(
                    f"SELL at {price} "
                    f"PnL={pnl}"
                )

                self.position = None

            self.equity_curve.append(
                self.balance
            )

            previous_signal = signal

        total_return = (
            PerformanceMetrics
            .calculate_total_return(
                self.initial_balance,
                self.balance
            )
        )

        sharpe_ratio = (
            PerformanceMetrics
            .calculate_sharpe_ratio(
                self.trade_history
            )
        )

        max_drawdown = (
            PerformanceMetrics
            .calculate_max_drawdown(
                self.equity_curve
            )
        )

        return {
            "initial_balance":
                self.initial_balance,

            "final_balance":
                self.balance,

            "total_return_percent":
                total_return,

            "total_trades":
                len(self.trade_history),

            "sharpe_ratio":
                sharpe_ratio,

            "max_drawdown_percent":
                max_drawdown
        }

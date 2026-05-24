import numpy as np


class PerformanceMetrics:

    @staticmethod
    def calculate_total_return(
        initial_balance,
        final_balance
    ):

        return (
            (
                final_balance
                - initial_balance
            )
            / initial_balance
        ) * 100

    @staticmethod
    def calculate_sharpe_ratio(
        returns,
        risk_free_rate=0
    ):

        returns = np.array(returns)

        if returns.std() == 0:
            return 0

        return (
            (
                returns.mean()
                - risk_free_rate
            )
            / returns.std()
        )

    @staticmethod
    def calculate_max_drawdown(
        equity_curve
    ):

        peak = equity_curve[0]

        max_drawdown = 0

        for value in equity_curve:

            if value > peak:
                peak = value

            drawdown = (
                peak - value
            ) / peak

            if drawdown > max_drawdown:
                max_drawdown = drawdown

        return max_drawdown * 100

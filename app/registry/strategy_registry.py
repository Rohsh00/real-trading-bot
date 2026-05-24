import yaml

from app.strategy_engine.ema_crossover import (
    EMACrossoverStrategy
)

from app.strategies.rsi_strategy import (
    RSIStrategy
)

from app.strategies.macd_strategy import (
    MACDStrategy
)


class StrategyRegistry:

    def __init__(self):

        with open(
            "config/strategy_config.yaml",
            "r"
        ) as file:

            self.config = yaml.safe_load(file)

        self.strategy_map = {
            "ema": EMACrossoverStrategy(),
            "rsi": RSIStrategy(),
            "macd": MACDStrategy()
        }

    def get_strategies_for_symbol(
        self,
        symbol
    ):

        strategy_names = (
            self.config["strategies"]
            .get(symbol, [])
        )

        return [
            self.strategy_map[name]
            for name in strategy_names
        ]

    def get_symbols(self):

        return self.config["symbols"]

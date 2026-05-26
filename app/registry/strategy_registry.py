import yaml
import importlib
import pkgutil

import app.strategies
import app.strategy_engine


class StrategyRegistry:

    def __init__(self):

        with open(
            "config/strategy_config.yaml",
            "r"
        ) as file:

            self.config = yaml.safe_load(file)

        self._load_strategies()

    def _load_strategies(self):
        packages = [app.strategies, app.strategy_engine]
        for package in packages:
            for _, module_name, _ in pkgutil.iter_modules(package.__path__):
                importlib.import_module(f"{package.__name__}.{module_name}")

    def get_symbols(self):

        return self.config["symbols"]

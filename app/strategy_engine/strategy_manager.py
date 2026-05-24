from app.registry.strategy_registry import (
    StrategyRegistry
)

from app.core.logger import logger


class StrategyManager:

    def __init__(self):

        self.registry = StrategyRegistry()

    async def process_market_data(
        self,
        symbol,
        price
    ):

        strategies = (
            self.registry
            .get_strategies_for_symbol(
                symbol
            )
        )

        for strategy in strategies:

            try:

                await strategy.generate_signal(
                    symbol,
                    price
                )

            except Exception as error:

                logger.error(
                    f"Strategy Error: {error}"
                )

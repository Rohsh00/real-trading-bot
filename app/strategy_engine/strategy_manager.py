from app.core.database import AsyncSessionLocal
from app.repositories.strategy_repository import StrategyRepository
from app.core.logger import logger

from app.strategy_engine.ema_crossover import EMACrossoverStrategy
from app.strategies.rsi_strategy import RSIStrategy
from app.strategies.macd_strategy import MACDStrategy

class StrategyManager:

    def __init__(self):
        self.active_strategies = {}

    async def sync_strategies(self):
        async with AsyncSessionLocal() as db:
            db_strategies = await StrategyRepository.get_all(db)
        
        active_db_strategies = {str(s.id): s for s in db_strategies if s.is_active}
        
        # Remove strategies that are no longer active
        current_ids = list(self.active_strategies.keys())
        for strat_id in current_ids:
            if strat_id not in active_db_strategies:
                logger.info(f"Removing inactive strategy {strat_id} from execution engine")
                del self.active_strategies[strat_id]
        
        # Add or update active strategies
        for strat_id, db_strat in active_db_strategies.items():
            if strat_id not in self.active_strategies:
                logger.info(f"Loading active strategy {strat_id} ({db_strat.name}) into execution engine")
                config = db_strat.config or {}
                
                # Infer strategy type
                if "fast_period" in config or "slow_period" in config or "ema" in db_strat.name.lower():
                    self.active_strategies[strat_id] = EMACrossoverStrategy(
                        fast_period=config.get("fast_period", 5),
                        slow_period=config.get("slow_period", 10)
                    )
                elif "period" in config or "overbought" in config or "rsi" in db_strat.name.lower():
                    self.active_strategies[strat_id] = RSIStrategy(
                        period=config.get("period", 14)
                    )
                elif "fast" in config or "slow" in config or "macd" in db_strat.name.lower():
                    self.active_strategies[strat_id] = MACDStrategy()
                else:
                    logger.warning(f"Could not infer strategy type for {db_strat.name}, defaulting to EMA")
                    self.active_strategies[strat_id] = EMACrossoverStrategy()

    async def process_market_data(
        self,
        symbol,
        price
    ):
        for strategy in self.active_strategies.values():
            try:
                await strategy.generate_signal(
                    symbol,
                    price
                )
            except Exception as error:
                logger.error(
                    f"Strategy Error: {error}"
                )

from app.core.database import AsyncSessionLocal
from app.repositories.strategy_repository import StrategyRepository
from app.core.logger import logger

from app.strategy_engine.base_strategy import BaseStrategy
from app.registry.strategy_registry import StrategyRegistry

class StrategyManager:

    def __init__(self):
        self.active_strategies = {}
        StrategyRegistry()  # Ensure strategies are dynamically loaded

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
                
                # Infer strategy type dynamically or fallback to inference
                strategy_type = config.get("type") or config.get("strategy_type")
                if not strategy_type:
                    if "ema" in db_strat.name.lower():
                        strategy_type = "ema_crossover"
                    elif "rsi" in db_strat.name.lower():
                        strategy_type = "rsi"
                    elif "macd" in db_strat.name.lower():
                        strategy_type = "macd"
                    else:
                        logger.warning(f"Could not infer strategy type for {db_strat.name}, defaulting to ema_crossover")
                        strategy_type = "ema_crossover"
                
                kwargs = {k: v for k, v in config.items() if k not in ("type", "strategy_type")}
                try:
                    self.active_strategies[strat_id] = BaseStrategy.create(strategy_type, **kwargs)
                except Exception as e:
                    logger.error(f"Failed to create strategy {strategy_type} for {db_strat.name}: {e}")


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

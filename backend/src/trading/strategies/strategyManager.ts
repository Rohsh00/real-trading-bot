// Import strategies to trigger registration
import "./emaCrossover";
import "./rsiStrategy";
import "./macdStrategy";

import { BaseStrategy } from "./baseStrategy";
import { StrategyRepository } from "../../repositories/strategyRepository";
import { logger } from "../../core/logger";

export class StrategyManager {
  public activeStrategies: { [id: string]: BaseStrategy } = {};

  async syncStrategies(): Promise<void> {
    const dbStrategies = await StrategyRepository.getAll();
    const activeDbStrategies = dbStrategies.filter((s) => s.is_active);
    const activeDbMap = new Map(activeDbStrategies.map((s) => [s.id, s]));

    // Remove inactive strategies
    const currentIds = Object.keys(this.activeStrategies);
    for (const stratId of currentIds) {
      if (!activeDbMap.has(stratId)) {
        logger.info(`Removing inactive strategy ${stratId} from execution engine`);
        delete this.activeStrategies[stratId];
      }
    }

    // Add or update active strategies
    for (const [stratId, dbStrat] of activeDbMap.entries()) {
      if (!this.activeStrategies[stratId]) {
        logger.info(`Loading active strategy ${stratId} (${dbStrat.name}) into execution engine`);
        const config = (dbStrat.config as any) || {};

        let strategyType = config.type || config.strategy_type;
        if (!strategyType) {
          const lowerName = dbStrat.name.toLowerCase();
          if (lowerName.includes("ema")) {
            strategyType = "ema_crossover";
          } else if (lowerName.includes("rsi")) {
            strategyType = "rsi";
          } else if (lowerName.includes("macd")) {
            strategyType = "macd";
          } else {
            logger.warn(`Could not infer strategy type for ${dbStrat.name}, defaulting to ema_crossover`);
            strategyType = "ema_crossover";
          }
        }

        // Filter config properties (exclude type / strategy_type)
        const kwargs: any = {};
        for (const [k, v] of Object.entries(config)) {
          if (k !== "type" && k !== "strategy_type") {
            kwargs[k] = v;
          }
        }

        try {
          this.activeStrategies[stratId] = BaseStrategy.create(strategyType, kwargs);
        } catch (e: any) {
          logger.error(`Failed to create strategy ${strategyType} for ${dbStrat.name}: ${e.message}`);
        }
      }
    }
  }

  async processMarketData(symbol: string, price: number): Promise<void> {
    for (const strategy of Object.values(this.activeStrategies)) {
      try {
        await strategy.generateSignal(symbol, price);
      } catch (e: any) {
        logger.error(`Strategy Error: ${e.message}`);
      }
    }
  }
}
export default StrategyManager;

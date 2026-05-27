"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyManager = void 0;
// Import strategies to trigger registration
require("./emaCrossover");
require("./rsiStrategy");
require("./macdStrategy");
const baseStrategy_1 = require("./baseStrategy");
const strategyRepository_1 = require("../../repositories/strategyRepository");
const logger_1 = require("../../core/logger");
class StrategyManager {
    activeStrategies = {};
    async syncStrategies() {
        const dbStrategies = await strategyRepository_1.StrategyRepository.getAll();
        const activeDbStrategies = dbStrategies.filter((s) => s.is_active);
        const activeDbMap = new Map(activeDbStrategies.map((s) => [s.id, s]));
        // Remove inactive strategies
        const currentIds = Object.keys(this.activeStrategies);
        for (const stratId of currentIds) {
            if (!activeDbMap.has(stratId)) {
                logger_1.logger.info(`Removing inactive strategy ${stratId} from execution engine`);
                delete this.activeStrategies[stratId];
            }
        }
        // Add or update active strategies
        for (const [stratId, dbStrat] of activeDbMap.entries()) {
            if (!this.activeStrategies[stratId]) {
                logger_1.logger.info(`Loading active strategy ${stratId} (${dbStrat.name}) into execution engine`);
                const config = dbStrat.config || {};
                let strategyType = config.type || config.strategy_type;
                if (!strategyType) {
                    const lowerName = dbStrat.name.toLowerCase();
                    if (lowerName.includes("ema")) {
                        strategyType = "ema_crossover";
                    }
                    else if (lowerName.includes("rsi")) {
                        strategyType = "rsi";
                    }
                    else if (lowerName.includes("macd")) {
                        strategyType = "macd";
                    }
                    else {
                        logger_1.logger.warn(`Could not infer strategy type for ${dbStrat.name}, defaulting to ema_crossover`);
                        strategyType = "ema_crossover";
                    }
                }
                // Filter config properties (exclude type / strategy_type)
                const kwargs = {};
                for (const [k, v] of Object.entries(config)) {
                    if (k !== "type" && k !== "strategy_type") {
                        kwargs[k] = v;
                    }
                }
                try {
                    this.activeStrategies[stratId] = baseStrategy_1.BaseStrategy.create(strategyType, kwargs);
                }
                catch (e) {
                    logger_1.logger.error(`Failed to create strategy ${strategyType} for ${dbStrat.name}: ${e.message}`);
                }
            }
        }
    }
    async processMarketData(symbol, price) {
        for (const strategy of Object.values(this.activeStrategies)) {
            try {
                await strategy.generateSignal(symbol, price);
            }
            catch (e) {
                logger_1.logger.error(`Strategy Error: ${e.message}`);
            }
        }
    }
}
exports.StrategyManager = StrategyManager;
exports.default = StrategyManager;

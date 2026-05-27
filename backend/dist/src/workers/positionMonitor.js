"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionService_1 = require("../services/positionService");
const portfolioManager_1 = require("../trading/portfolio/portfolioManager");
const logger_1 = require("../core/logger");
async function main() {
    while (true) {
        try {
            const positions = await positionService_1.PositionService.getAllPositions();
            await portfolioManager_1.PortfolioManager.loadPositions(positions);
            for (const [symbol, position] of Object.entries(portfolioManager_1.PortfolioManager.positions)) {
                logger_1.logger.info(`Monitoring Position: ${symbol} SL=${position.stop_loss} TP=${position.take_profit}`);
            }
        }
        catch (e) {
            logger_1.logger.error(`Error in Position Monitor cycle: ${e.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
}
async function runWithRecovery() {
    while (true) {
        try {
            await main();
        }
        catch (e) {
            logger_1.logger.error(`Position Monitor crashed: ${e.message}`);
            if (e.stack)
                logger_1.logger.error(e.stack);
            logger_1.logger.info("Restarting Position Monitor in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}
runWithRecovery();

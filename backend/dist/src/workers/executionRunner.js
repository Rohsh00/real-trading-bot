"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../core/redis");
const executionEngine_1 = require("../trading/execution/executionEngine");
const executionService_1 = require("../services/executionService");
const positionService_1 = require("../services/positionService");
const portfolioManager_1 = require("../trading/portfolio/portfolioManager");
const auditService_1 = require("../services/auditService");
const logger_1 = require("../core/logger");
async function main() {
    // Load positions from database on startup
    try {
        const positions = await positionService_1.PositionService.getAllPositions();
        await portfolioManager_1.PortfolioManager.loadPositions(positions);
        logger_1.logger.info(`Execution Runner loaded ${positions.length} positions from database.`);
        await auditService_1.AuditService.logEvent("SYSTEM", "SYSTEM_STARTUP", null, { positions_loaded: positions.length, service: "execution_runner" });
    }
    catch (err) {
        logger_1.logger.error(`Execution Runner startup database load failed: ${err.message}`);
    }
    const pubsub = (0, redis_1.createRedisClient)();
    await pubsub.subscribe("trading_signals");
    logger_1.logger.info("Execution Engine Subscribed to trading_signals");
    const engine = new executionEngine_1.ExecutionEngine();
    pubsub.on("message", async (channel, message) => {
        if (channel !== "trading_signals")
            return;
        try {
            const signal = JSON.parse(message);
            const executionResult = await engine.executeSignal(signal);
            if (executionResult) {
                await executionService_1.ExecutionService.persistExecution(executionResult);
                logger_1.logger.info(`Execution persisted: ${JSON.stringify(executionResult)}`);
            }
        }
        catch (e) {
            logger_1.logger.error(`Execution Runner Error: ${e.message}`);
        }
    });
    return () => {
        pubsub.disconnect();
    };
}
async function runWithRecovery() {
    while (true) {
        let cleanup;
        try {
            cleanup = await main();
            // Keep alive
            await new Promise(() => { });
        }
        catch (e) {
            if (cleanup)
                cleanup();
            logger_1.logger.error(`Execution Runner crashed: ${e.message}`);
            if (e.stack)
                logger_1.logger.error(e.stack);
            logger_1.logger.info("Restarting Execution Runner in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}
runWithRecovery();

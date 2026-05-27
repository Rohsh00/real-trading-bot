"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../core/redis");
const strategyManager_1 = require("../trading/strategies/strategyManager");
const logger_1 = require("../core/logger");
async function main() {
    logger_1.logger.info("Starting Strategy Runner...");
    const pubsub = (0, redis_1.createRedisClient)();
    await pubsub.subscribe("market_ticks");
    logger_1.logger.info("Subscribed to market_ticks");
    const strategyManager = new strategyManager_1.StrategyManager();
    // Sync strategies immediately on startup
    try {
        await strategyManager.syncStrategies();
    }
    catch (err) {
        logger_1.logger.error(`Initial Strategy Sync Error: ${err.message}`);
    }
    // Set up 5s sync interval
    const syncInterval = setInterval(async () => {
        try {
            await strategyManager.syncStrategies();
        }
        catch (e) {
            logger_1.logger.error(`Strategy Sync Error: ${e.message}`);
        }
    }, 5000);
    pubsub.on("message", async (channel, message) => {
        if (channel !== "market_ticks")
            return;
        try {
            const tick = JSON.parse(message);
            logger_1.logger.info(`Received Tick: ${message}`);
            await strategyManager.processMarketData(tick.symbol, tick.price);
        }
        catch (e) {
            logger_1.logger.error(`Strategy Runner Error: ${e.message}`);
        }
    });
    return () => {
        clearInterval(syncInterval);
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
            logger_1.logger.error(`Strategy Runner crashed: ${e.message}`);
            if (e.stack)
                logger_1.logger.error(e.stack);
            logger_1.logger.info("Restarting Strategy Runner in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}
runWithRecovery();

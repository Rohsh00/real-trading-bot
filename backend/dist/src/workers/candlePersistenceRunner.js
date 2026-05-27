"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../core/redis");
const candleService_1 = require("../services/candleService");
const logger_1 = require("../core/logger");
async function main() {
    logger_1.logger.info("Starting Candle Persistence Runner...");
    const pubsub = (0, redis_1.createRedisClient)();
    await pubsub.subscribe("candle_events");
    logger_1.logger.info("Subscribed to candle_events");
    pubsub.on("message", async (channel, message) => {
        if (channel !== "candle_events")
            return;
        try {
            const candle = JSON.parse(message);
            await candleService_1.CandleService.persistCandle(candle);
        }
        catch (e) {
            logger_1.logger.error(`Candle Persistence Error: ${e.message}`);
        }
    });
}
async function runWithRecovery() {
    while (true) {
        try {
            await main();
            // Keep process alive
            await new Promise(() => { });
        }
        catch (e) {
            logger_1.logger.error(`Candle Persistence Runner crashed: ${e.message}`);
            if (e.stack)
                logger_1.logger.error(e.stack);
            logger_1.logger.info("Restarting Candle Persistence Runner in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}
runWithRecovery();

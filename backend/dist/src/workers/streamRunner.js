"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marketStream_1 = require("../websockets/marketStream");
const logger_1 = require("../core/logger");
async function main() {
    const stream = new marketStream_1.MarketStream();
    await stream.start();
}
async function runWithRecovery() {
    while (true) {
        try {
            await main();
            // Keep process alive since ws client is event-driven
            await new Promise(() => { });
        }
        catch (e) {
            logger_1.logger.error(`Stream Runner crashed: ${e.message}`);
            if (e.stack)
                logger_1.logger.error(e.stack);
            logger_1.logger.info("Restarting Stream Runner in 5 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}
runWithRecovery();

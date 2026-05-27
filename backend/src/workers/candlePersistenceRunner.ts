import { createRedisClient } from "../core/redis";
import { CandleService } from "../services/candleService";
import { logger } from "../core/logger";

async function main() {
  logger.info("Starting Candle Persistence Runner...");
  const pubsub = createRedisClient();

  await pubsub.subscribe("candle_events");
  logger.info("Subscribed to candle_events");

  pubsub.on("message", async (channel, message) => {
    if (channel !== "candle_events") return;

    try {
      const candle = JSON.parse(message);
      await CandleService.persistCandle(candle);
    } catch (e: any) {
      logger.error(`Candle Persistence Error: ${e.message}`);
    }
  });
}

async function runWithRecovery() {
  while (true) {
    try {
      await main();
      // Keep process alive
      await new Promise(() => {});
    } catch (e: any) {
      logger.error(`Candle Persistence Runner crashed: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      logger.info("Restarting Candle Persistence Runner in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runWithRecovery();

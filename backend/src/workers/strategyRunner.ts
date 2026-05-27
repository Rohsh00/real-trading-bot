import { createRedisClient } from "../core/redis";
import { StrategyManager } from "../trading/strategies/strategyManager";
import { logger } from "../core/logger";

async function main() {
  logger.info("Starting Strategy Runner...");
  const pubsub = createRedisClient();

  await pubsub.subscribe("market_ticks");
  logger.info("Subscribed to market_ticks");

  const strategyManager = new StrategyManager();

  // Sync strategies immediately on startup
  try {
    await strategyManager.syncStrategies();
  } catch (err: any) {
    logger.error(`Initial Strategy Sync Error: ${err.message}`);
  }

  // Set up 5s sync interval
  const syncInterval = setInterval(async () => {
    try {
      await strategyManager.syncStrategies();
    } catch (e: any) {
      logger.error(`Strategy Sync Error: ${e.message}`);
    }
  }, 5000);

  pubsub.on("message", async (channel, message) => {
    if (channel !== "market_ticks") return;

    try {
      const tick = JSON.parse(message);
      logger.info(`Received Tick: ${message}`);
      await strategyManager.processMarketData(tick.symbol, tick.price);
    } catch (e: any) {
      logger.error(`Strategy Runner Error: ${e.message}`);
    }
  });

  return () => {
    clearInterval(syncInterval);
    pubsub.disconnect();
  };
}

async function runWithRecovery() {
  while (true) {
    let cleanup: (() => void) | undefined;
    try {
      cleanup = await main();
      // Keep alive
      await new Promise(() => {});
    } catch (e: any) {
      if (cleanup) cleanup();
      logger.error(`Strategy Runner crashed: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      logger.info("Restarting Strategy Runner in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runWithRecovery();

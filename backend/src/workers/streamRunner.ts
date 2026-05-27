import { MarketStream } from "../websockets/marketStream";
import { logger } from "../core/logger";

async function main() {
  const stream = new MarketStream();
  await stream.start();
}

async function runWithRecovery() {
  while (true) {
    try {
      await main();
      // Keep process alive since ws client is event-driven
      await new Promise(() => {});
    } catch (e: any) {
      logger.error(`Stream Runner crashed: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      logger.info("Restarting Stream Runner in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runWithRecovery();

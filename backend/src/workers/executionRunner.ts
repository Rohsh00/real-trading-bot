import { createRedisClient } from "../core/redis";
import { ExecutionEngine } from "../trading/execution/executionEngine";
import { ExecutionService } from "../services/executionService";
import { PositionService } from "../services/positionService";
import { PortfolioManager } from "../trading/portfolio/portfolioManager";
import { AuditService } from "../services/auditService";
import { logger } from "../core/logger";

async function main() {
  // Load positions from database on startup
  try {
    const positions = await PositionService.getAllPositions();
    await PortfolioManager.loadPositions(positions);
    logger.info(`Execution Runner loaded ${positions.length} positions from database.`);
    
    await AuditService.logEvent(
      "SYSTEM",
      "SYSTEM_STARTUP",
      null,
      { positions_loaded: positions.length, service: "execution_runner" }
    );
  } catch (err: any) {
    logger.error(`Execution Runner startup database load failed: ${err.message}`);
  }

  const pubsub = createRedisClient();
  await pubsub.subscribe("trading_signals");
  logger.info("Execution Engine Subscribed to trading_signals");

  const engine = new ExecutionEngine();

  pubsub.on("message", async (channel, message) => {
    if (channel !== "trading_signals") return;

    try {
      const signal = JSON.parse(message);
      const executionResult = await engine.executeSignal(signal);

      if (executionResult) {
        await ExecutionService.persistExecution(executionResult);
        logger.info(`Execution persisted: ${JSON.stringify(executionResult)}`);
      }
    } catch (e: any) {
      logger.error(`Execution Runner Error: ${e.message}`);
    }
  });

  return () => {
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
      logger.error(`Execution Runner crashed: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      logger.info("Restarting Execution Runner in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runWithRecovery();

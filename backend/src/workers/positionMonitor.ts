import { PositionService } from "../services/positionService";
import { PortfolioManager } from "../trading/portfolio/portfolioManager";
import { logger } from "../core/logger";

async function main() {
  while (true) {
    try {
      const positions = await PositionService.getAllPositions();
      await PortfolioManager.loadPositions(positions);

      for (const [symbol, position] of Object.entries(PortfolioManager.positions)) {
        logger.info(
          `Monitoring Position: ${symbol} SL=${position.stop_loss} TP=${position.take_profit}`
        );
      }
    } catch (e: any) {
      logger.error(`Error in Position Monitor cycle: ${e.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

async function runWithRecovery() {
  while (true) {
    try {
      await main();
    } catch (e: any) {
      logger.error(`Position Monitor crashed: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      logger.info("Restarting Position Monitor in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runWithRecovery();

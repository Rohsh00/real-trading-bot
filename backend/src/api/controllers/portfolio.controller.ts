import { Request, Response } from "express";
import { PositionService } from "../../services/positionService";
import { PortfolioManager } from "../../trading/portfolio/portfolioManager";
import { logger } from "../../core/logger";

export class PortfolioController {
  static async getPortfolio(req: Request, res: Response) {
    try {
      const positions = await PositionService.getAllPositions();
      const positionsDict: any = {};
      for (const pos of positions) {
        positionsDict[pos.symbol] = {
          quantity: pos.quantity,
          average_price: pos.average_price,
          stop_loss: pos.stop_loss,
          take_profit: pos.take_profit,
          unrealized_pnl: pos.unrealized_pnl,
        };
      }

      const cashBalance = await PortfolioManager.getCashBalance();
      const realizedPnl = await PortfolioManager.getRealizedPnl();

      return res.json({
        cash_balance: cashBalance,
        positions: positionsDict,
        realized_pnl: realizedPnl,
      });
    } catch (err: any) {
      logger.error(`Error in /portfolio: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

import redisClient from "../../core/redis";
import { logger } from "../../core/logger";

interface PositionState {
  quantity: number;
  average_price: number;
  stop_loss?: number | null;
  take_profit?: number | null;
}

export class PortfolioManager {
  static positions: { [symbol: string]: PositionState } = {};

  static async getCashBalance(): Promise<number> {
    const val = await redisClient.get("portfolio:cash_balance");
    return val ? parseFloat(val) : 100000.0;
  }

  static async setCashBalance(amount: number): Promise<void> {
    await redisClient.set("portfolio:cash_balance", String(amount));
  }

  static async getRealizedPnl(): Promise<number> {
    const val = await redisClient.get("portfolio:realized_pnl");
    return val ? parseFloat(val) : 0.0;
  }

  static async setRealizedPnl(amount: number): Promise<void> {
    await redisClient.set("portfolio:realized_pnl", String(amount));
  }

  static async loadPositions(positionsList: any[]): Promise<void> {
    this.positions = {};
    for (const pos of positionsList) {
      this.positions[pos.symbol] = {
        quantity: pos.quantity,
        average_price: pos.average_price,
        stop_loss: pos.stop_loss,
        take_profit: pos.take_profit,
      };
    }
    logger.info(`Loaded ${positionsList.length} positions into memory.`);
  }

  static async updatePosition(
    symbol: string,
    side: string,
    quantity: number,
    price: number
  ): Promise<void> {
    const currentPosition = this.positions[symbol];
    let cash = await this.getCashBalance();
    let pnl = await this.getRealizedPnl();

    if (side === "BUY") {
      cash -= (quantity * price);
      this.positions[symbol] = {
        quantity,
        average_price: price,
        stop_loss: price * 0.98,
        take_profit: price * 1.03,
      };
      await this.setCashBalance(cash);
    } else if (side === "SELL" && currentPosition) {
      const tradePnl = (price - currentPosition.average_price) * quantity;
      pnl += tradePnl;
      cash += (quantity * price);

      delete this.positions[symbol];
      await this.setRealizedPnl(pnl);
      await this.setCashBalance(cash);

      logger.info(`Trade Closed. PnL=${tradePnl}`);
    }

    logger.info(`Portfolio Updated: Cash=${cash}`);
  }
}
export default PortfolioManager;

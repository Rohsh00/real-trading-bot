import { logger } from "../../core/logger";
import { RiskService } from "../../services/riskService";
import { PortfolioManager } from "../portfolio/portfolioManager";

export class RiskManager {
  static async validateOrder(
    symbol: string,
    quantity: number,
    price: number,
    side: string
  ): Promise<boolean> {
    const settings = await RiskService.getSettings();

    const normalizeSym = (s: string): string => {
      return String(s).trim().toUpperCase().replace("/", "").replace("-", "");
    };

    // 1. Restricted Symbols Check
    const restrictedSymbols = (settings.restricted_symbols || []).map((s: string) => normalizeSym(s));
    if (restrictedSymbols.includes(normalizeSym(symbol))) {
      logger.warn(`Risk rejected order: ${symbol} is restricted`);
      return false;
    }

    // 2. Max Position Size Check
    const orderValue = quantity * price;
    const maxPositionSize = settings.max_position_size !== undefined ? settings.max_position_size : 10000.0;
    if (orderValue > maxPositionSize) {
      logger.warn(`Risk rejected order: size ${orderValue} exceeds max ${maxPositionSize}`);
      return false;
    }

    // 3. Max Open Positions Check (Only for BUY orders)
    if (side === "BUY") {
      const openPositions = Object.keys(PortfolioManager.positions).length;
      const maxOpenPositions = settings.max_open_positions !== undefined ? settings.max_open_positions : 5;
      if (openPositions >= maxOpenPositions) {
        logger.warn(`Risk rejected order: max open positions ${maxOpenPositions} reached`);
        return false;
      }
    }

    // 4. Max Daily Loss / Drawdown Check
    const realizedPnl = await PortfolioManager.getRealizedPnl();
    const maxDailyLoss = settings.max_daily_loss !== undefined ? settings.max_daily_loss : -5000.0;
    const maxDailyLossLimit = -Math.abs(maxDailyLoss);
    if (realizedPnl <= maxDailyLossLimit) {
      logger.warn(`Risk rejected order: max daily loss ${maxDailyLossLimit} exceeded`);
      return false;
    }

    return true;
  }
}
export default RiskManager;

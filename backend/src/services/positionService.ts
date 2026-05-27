import { randomUUID } from "crypto";
import { PositionRepository } from "../repositories/positionRepository";

export class PositionService {
  static async createPosition(
    symbol: string,
    quantity: number,
    averagePrice: number,
    stopLoss: number,
    takeProfit: number
  ) {
    return PositionRepository.create({
      id: randomUUID(),
      symbol,
      quantity,
      average_price: averagePrice,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      unrealized_pnl: 0,
    });
  }

  static async getPosition(symbol: string) {
    return PositionRepository.getBySymbol(symbol);
  }

  static async getAllPositions() {
    return PositionRepository.getAll();
  }

  static async closePosition(symbol: string) {
    const position = await PositionRepository.getBySymbol(symbol);
    if (position) {
      await PositionRepository.delete(symbol);
    }
  }

  static async updatePosition(symbol: string, data: {
    quantity?: number;
    average_price?: number;
    stop_loss?: number | null;
    take_profit?: number | null;
    unrealized_pnl?: number;
  }) {
    return PositionRepository.update(symbol, data);
  }
}
export default PositionService;

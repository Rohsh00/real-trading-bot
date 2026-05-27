import { randomUUID } from "crypto";
import { CandleRepository } from "../repositories/candleRepository";
import { logger } from "../core/logger";

export class CandleService {
  static async persistCandle(candleData: {
    symbol: string;
    timeframe: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: string;
  }) {
    const timestamp = new Date(candleData.timestamp);
    const candle = await CandleRepository.create({
      id: randomUUID(),
      symbol: candleData.symbol,
      timeframe: candleData.timeframe,
      open: candleData.open,
      high: candleData.high,
      low: candleData.low,
      close: candleData.close,
      volume: candleData.volume,
      timestamp,
    });

    logger.info(`Candle Persisted: ${candle.symbol} ${candle.timeframe}`);
    return candle;
  }
}
export default CandleService;

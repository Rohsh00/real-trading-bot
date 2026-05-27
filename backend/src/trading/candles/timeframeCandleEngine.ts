import redisClient from "../../core/redis";
import { logger } from "../../core/logger";
import { CandlePublisher } from "../../services/candlePublisher";

interface CandleState {
  symbol: string;
  timeframe: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  created_at: Date;
}

export class TimeframeCandleEngine {
  private static candles: { [key: string]: CandleState } = {};
  public static TIMEFRAMES = ["1m", "5m", "15m"];

  private static isComplete(candle: CandleState): boolean {
    const ageSeconds = Math.floor((Date.now() - candle.created_at.getTime()) / 1000);
    const timeframe = candle.timeframe;

    if (timeframe === "1m") return ageSeconds >= 60;
    if (timeframe === "5m") return ageSeconds >= 300;
    if (timeframe === "15m") return ageSeconds >= 900;
    return false;
  }

  private static async publishLive(candle: CandleState) {
    const redisKey = `live_candle:${candle.symbol}:${candle.timeframe}`;
    const channel = `live_candle_events:${candle.symbol}:${candle.timeframe}`;

    const payload = JSON.stringify({
      symbol: candle.symbol,
      timeframe: candle.timeframe,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      timestamp: candle.created_at.toISOString(),
      is_live: true,
    });

    // Store latest state (readable by HTTP endpoint)
    await redisClient.set(redisKey, payload, "EX", 120);

    // Pub/sub push so WebSocket can forward to browser immediately
    await redisClient.publish(channel, payload);
  }

  static async processTick(symbol: string, price: number, quantity: number = 0) {
    for (const timeframe of this.TIMEFRAMES) {
      const key = `${symbol}:${timeframe}`;
      const candle = this.candles[key];

      if (candle && this.isComplete(candle)) {
        const completedCandle = {
          symbol: candle.symbol,
          timeframe: candle.timeframe,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
          timestamp: candle.created_at.toISOString(),
        };

        await CandlePublisher.publish(completedCandle);
        logger.info(`Published Candle: ${key}`);

        // Start a new candle from this tick
        this.candles[key] = {
          symbol,
          timeframe,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: quantity,
          created_at: new Date(),
        };

        await this.publishLive(this.candles[key]);
        continue;
      }

      if (!candle) {
        this.candles[key] = {
          symbol,
          timeframe,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: quantity,
          created_at: new Date(),
        };
      } else {
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
        candle.volume += quantity;
      }

      // Publish live state on every tick update
      await this.publishLive(this.candles[key]);
      logger.info(`${key} Candle Updated`);
    }
  }
}
export default TimeframeCandleEngine;

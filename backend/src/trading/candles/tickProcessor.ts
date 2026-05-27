import redisClient from "../../core/redis";
import { logger } from "../../core/logger";

export class TickProcessor {
  static CHANNEL_NAME = "market_ticks";

  static async processTick(data: any) {
    const normalizedTick = {
      symbol: data.s,
      price: parseFloat(data.p),
      quantity: parseFloat(data.q),
      trade_time: data.T,
    };

    await redisClient.publish(this.CHANNEL_NAME, JSON.stringify(normalizedTick));
    await redisClient.set(`latest_price:${normalizedTick.symbol}`, String(normalizedTick.price));

    logger.info(`Processed tick: ${JSON.stringify(normalizedTick)}`);
  }
}
export default TickProcessor;

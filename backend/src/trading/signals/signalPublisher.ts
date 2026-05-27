import redisClient from "../../core/redis";
import { logger } from "../../core/logger";

export class SignalPublisher {
  static CHANNEL_NAME = "trading_signals";
  static LOG_KEY = "signals_log";
  static LOG_MAX = 100;

  static async publish(signal: {
    strategy: string;
    symbol: string;
    signal: string;
    price: number;
  }) {
    const signalWithTs = {
      ...signal,
      timestamp: new Date().toISOString(),
    };

    const payload = JSON.stringify(signalWithTs);

    // 1. Pub/sub for execution runner to consume
    await redisClient.publish(this.CHANNEL_NAME, payload);

    // 2. Persist to capped Redis list so /signals/recent can read it
    await redisClient.lpush(this.LOG_KEY, payload);
    await redisClient.ltrim(this.LOG_KEY, 0, this.LOG_MAX - 1);

    logger.info(`Signal Published: ${payload}`);
  }
}
export default SignalPublisher;

import redisClient from "../core/redis";

export class CandlePublisher {
  static CHANNEL = "candle_events";

  static async publish(candle: any) {
    await redisClient.publish(this.CHANNEL, JSON.stringify(candle));
  }
}
export default CandlePublisher;

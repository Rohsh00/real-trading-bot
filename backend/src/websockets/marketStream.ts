import { BinanceWebSocketClient } from "./binanceClient";
import { TickProcessor } from "../trading/candles/tickProcessor";
import { TimeframeCandleEngine } from "../trading/candles/timeframeCandleEngine";
import { logger } from "../core/logger";

export class MarketStream {
  private client = new BinanceWebSocketClient();

  async start() {
    logger.info("Starting Market Stream");
    this.client.connect(async (tick) => {
      await TickProcessor.processTick(tick);
      await TimeframeCandleEngine.processTick(
        tick.s,
        parseFloat(tick.p),
        parseFloat(tick.q)
      );
    });
  }
}
export default MarketStream;

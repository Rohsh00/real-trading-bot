import { BaseStrategy } from "./baseStrategy";
import { SignalPublisher } from "../signals/signalPublisher";
import { calculateRSI } from "../../utils/indicators";
import { logger } from "../../core/logger";

export class RSIStrategy extends BaseStrategy {
  private period: number;
  private priceHistory: { [symbol: string]: number[] } = {};

  constructor(config?: { period?: number }) {
    super();
    this.period = config?.period || 14;
  }

  async generateSignal(symbol: string, price: number): Promise<void> {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = [];
    }

    const history = this.priceHistory[symbol];
    history.push(price);

    // Keep history clean and capped to avoid memory leaks
    const maxHistory = this.period + 100;
    if (history.length > maxHistory) {
      history.shift();
    }

    if (history.length < this.period) {
      return;
    }

    const rsi = calculateRSI(history, this.period);
    const latestRsi = rsi[rsi.length - 1];

    let signal: string | null = null;

    if (latestRsi < 30) {
      signal = "BUY";
    } else if (latestRsi > 70) {
      signal = "SELL";
    }

    if (signal) {
      const payload = {
        strategy: "rsi",
        symbol,
        signal,
        price,
      };

      logger.info(`RSI Signal: ${JSON.stringify(payload)}`);
      await SignalPublisher.publish(payload);
    }
  }
}

// Register strategy
BaseStrategy.register("rsi", RSIStrategy);
export default RSIStrategy;

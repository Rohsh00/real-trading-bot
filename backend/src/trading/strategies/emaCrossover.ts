import { BaseStrategy } from "./baseStrategy";
import { SignalPublisher } from "../signals/signalPublisher";
import { calculateEMA } from "../../utils/indicators";
import { logger } from "../../core/logger";

export class EMACrossoverStrategy extends BaseStrategy {
  private fastPeriod: number;
  private slowPeriod: number;
  private priceHistory: { [symbol: string]: number[] } = {};

  constructor(config?: { fast_period?: number; slow_period?: number }) {
    super();
    this.fastPeriod = config?.fast_period || 5;
    this.slowPeriod = config?.slow_period || 10;
  }

  async generateSignal(symbol: string, price: number): Promise<void> {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = [];
    }

    const history = this.priceHistory[symbol];
    history.push(price);

    const maxHistory = this.slowPeriod + 50;
    if (history.length > maxHistory) {
      history.shift();
    }

    if (history.length < this.slowPeriod) {
      return;
    }

    const fastEma = calculateEMA(history, this.fastPeriod);
    const slowEma = calculateEMA(history, this.slowPeriod);

    const latestFast = fastEma[fastEma.length - 1];
    const latestSlow = slowEma[slowEma.length - 1];

    const previousFast = fastEma[fastEma.length - 2];
    const previousSlow = slowEma[slowEma.length - 2];

    let signal: string | null = null;

    if (previousFast <= previousSlow && latestFast > latestSlow) {
      signal = "BUY";
    } else if (previousFast >= previousSlow && latestFast < latestSlow) {
      signal = "SELL";
    }

    if (signal) {
      const payload = {
        strategy: "ema_crossover",
        symbol,
        signal,
        price,
      };

      logger.info(`Generated Signal: ${JSON.stringify(payload)}`);
      await SignalPublisher.publish(payload);
    }
  }
}

// Register strategy
BaseStrategy.register("ema_crossover", EMACrossoverStrategy);
BaseStrategy.register("ema", EMACrossoverStrategy);
export default EMACrossoverStrategy;

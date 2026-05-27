import { BaseStrategy } from "./baseStrategy";
import { SignalPublisher } from "../signals/signalPublisher";
import { calculateMACD } from "../../utils/indicators";
import { logger } from "../../core/logger";

export class MACDStrategy extends BaseStrategy {
  private priceHistory: { [symbol: string]: number[] } = {};

  async generateSignal(symbol: string, price: number): Promise<void> {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = [];
    }

    const history = this.priceHistory[symbol];
    history.push(price);

    // Keep history capped
    const maxHistory = 150;
    if (history.length > maxHistory) {
      history.shift();
    }

    if (history.length < 35) {
      return;
    }

    const { macdLine, signalLine } = calculateMACD(history);

    const latestMacd = macdLine[macdLine.length - 1];
    const latestSignal = signalLine[signalLine.length - 1];

    const previousMacd = macdLine[macdLine.length - 2];
    const previousSignal = signalLine[signalLine.length - 2];

    let signal: string | null = null;

    if (previousMacd <= previousSignal && latestMacd > latestSignal) {
      signal = "BUY";
    } else if (previousMacd >= previousSignal && latestMacd < latestSignal) {
      signal = "SELL";
    }

    if (signal) {
      const payload = {
        strategy: "macd",
        symbol,
        signal,
        price,
      };

      logger.info(`MACD Signal: ${JSON.stringify(payload)}`);
      await SignalPublisher.publish(payload);
    }
  }
}

// Register strategy
BaseStrategy.register("macd", MACDStrategy);
export default MACDStrategy;

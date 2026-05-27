import { CSVRow } from "./data/csvLoader";
import { PerformanceMetrics } from "./metrics/performanceMetrics";
import { logger } from "../core/logger";

export class BacktestEngine {
  private strategy: any;
  private initialBalance: number;
  private balance: number;
  private position: number | null = null;
  private tradeHistory: number[] = [];
  private equityCurve: number[] = [];

  constructor(strategy: any, initialBalance: number = 10000) {
    this.strategy = strategy;
    this.initialBalance = initialBalance;
    this.balance = initialBalance;
  }

  run(dataframe: CSVRow[]) {
    const data = this.strategy.generateSignals(dataframe);
    let previousSignal = 0;

    for (const row of data) {
      const signal = row.signal;
      const price = row.close;

      if (signal === 1 && previousSignal !== 1) {
        this.position = price;
        logger.info(`BUY at ${price}`);
      } else if (signal === -1 && this.position !== null) {
        const pnl = price - this.position;
        this.balance += pnl;
        this.tradeHistory.push(pnl);
        logger.info(`SELL at ${price} PnL=${pnl}`);
        this.position = null;
      }

      this.equityCurve.push(this.balance);
      previousSignal = signal;
    }

    const totalReturn = PerformanceMetrics.calculateTotalReturn(this.initialBalance, this.balance);
    const sharpeRatio = PerformanceMetrics.calculateSharpeRatio(this.tradeHistory);
    const maxDrawdown = PerformanceMetrics.calculateMaxDrawdown(this.equityCurve);

    return {
      initial_balance: this.initialBalance,
      final_balance: this.balance,
      total_return_percent: totalReturn,
      total_trades: this.tradeHistory.length,
      sharpe_ratio: sharpeRatio,
      max_drawdown_percent: maxDrawdown,
    };
  }
}
export default BacktestEngine;

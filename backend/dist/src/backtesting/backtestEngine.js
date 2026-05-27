"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestEngine = void 0;
const performanceMetrics_1 = require("./metrics/performanceMetrics");
const logger_1 = require("../core/logger");
class BacktestEngine {
    strategy;
    initialBalance;
    balance;
    position = null;
    tradeHistory = [];
    equityCurve = [];
    constructor(strategy, initialBalance = 10000) {
        this.strategy = strategy;
        this.initialBalance = initialBalance;
        this.balance = initialBalance;
    }
    run(dataframe) {
        const data = this.strategy.generateSignals(dataframe);
        let previousSignal = 0;
        for (const row of data) {
            const signal = row.signal;
            const price = row.close;
            if (signal === 1 && previousSignal !== 1) {
                this.position = price;
                logger_1.logger.info(`BUY at ${price}`);
            }
            else if (signal === -1 && this.position !== null) {
                const pnl = price - this.position;
                this.balance += pnl;
                this.tradeHistory.push(pnl);
                logger_1.logger.info(`SELL at ${price} PnL=${pnl}`);
                this.position = null;
            }
            this.equityCurve.push(this.balance);
            previousSignal = signal;
        }
        const totalReturn = performanceMetrics_1.PerformanceMetrics.calculateTotalReturn(this.initialBalance, this.balance);
        const sharpeRatio = performanceMetrics_1.PerformanceMetrics.calculateSharpeRatio(this.tradeHistory);
        const maxDrawdown = performanceMetrics_1.PerformanceMetrics.calculateMaxDrawdown(this.equityCurve);
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
exports.BacktestEngine = BacktestEngine;
exports.default = BacktestEngine;

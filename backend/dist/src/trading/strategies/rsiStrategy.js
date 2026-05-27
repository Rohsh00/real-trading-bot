"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSIStrategy = void 0;
const baseStrategy_1 = require("./baseStrategy");
const signalPublisher_1 = require("../signals/signalPublisher");
const indicators_1 = require("../../utils/indicators");
const logger_1 = require("../../core/logger");
class RSIStrategy extends baseStrategy_1.BaseStrategy {
    period;
    priceHistory = {};
    constructor(config) {
        super();
        this.period = config?.period || 14;
    }
    async generateSignal(symbol, price) {
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
        const rsi = (0, indicators_1.calculateRSI)(history, this.period);
        const latestRsi = rsi[rsi.length - 1];
        let signal = null;
        if (latestRsi < 30) {
            signal = "BUY";
        }
        else if (latestRsi > 70) {
            signal = "SELL";
        }
        if (signal) {
            const payload = {
                strategy: "rsi",
                symbol,
                signal,
                price,
            };
            logger_1.logger.info(`RSI Signal: ${JSON.stringify(payload)}`);
            await signalPublisher_1.SignalPublisher.publish(payload);
        }
    }
}
exports.RSIStrategy = RSIStrategy;
// Register strategy
baseStrategy_1.BaseStrategy.register("rsi", RSIStrategy);
exports.default = RSIStrategy;

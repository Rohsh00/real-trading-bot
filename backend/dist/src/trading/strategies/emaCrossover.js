"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMACrossoverStrategy = void 0;
const baseStrategy_1 = require("./baseStrategy");
const signalPublisher_1 = require("../signals/signalPublisher");
const indicators_1 = require("../../utils/indicators");
const logger_1 = require("../../core/logger");
class EMACrossoverStrategy extends baseStrategy_1.BaseStrategy {
    fastPeriod;
    slowPeriod;
    priceHistory = {};
    constructor(config) {
        super();
        this.fastPeriod = config?.fast_period || 5;
        this.slowPeriod = config?.slow_period || 10;
    }
    async generateSignal(symbol, price) {
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
        const fastEma = (0, indicators_1.calculateEMA)(history, this.fastPeriod);
        const slowEma = (0, indicators_1.calculateEMA)(history, this.slowPeriod);
        const latestFast = fastEma[fastEma.length - 1];
        const latestSlow = slowEma[slowEma.length - 1];
        const previousFast = fastEma[fastEma.length - 2];
        const previousSlow = slowEma[slowEma.length - 2];
        let signal = null;
        if (previousFast <= previousSlow && latestFast > latestSlow) {
            signal = "BUY";
        }
        else if (previousFast >= previousSlow && latestFast < latestSlow) {
            signal = "SELL";
        }
        if (signal) {
            const payload = {
                strategy: "ema_crossover",
                symbol,
                signal,
                price,
            };
            logger_1.logger.info(`Generated Signal: ${JSON.stringify(payload)}`);
            await signalPublisher_1.SignalPublisher.publish(payload);
        }
    }
}
exports.EMACrossoverStrategy = EMACrossoverStrategy;
// Register strategy
baseStrategy_1.BaseStrategy.register("ema_crossover", EMACrossoverStrategy);
baseStrategy_1.BaseStrategy.register("ema", EMACrossoverStrategy);
exports.default = EMACrossoverStrategy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MACDStrategy = void 0;
const baseStrategy_1 = require("./baseStrategy");
const signalPublisher_1 = require("../signals/signalPublisher");
const indicators_1 = require("../../utils/indicators");
const logger_1 = require("../../core/logger");
class MACDStrategy extends baseStrategy_1.BaseStrategy {
    priceHistory = {};
    async generateSignal(symbol, price) {
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
        const { macdLine, signalLine } = (0, indicators_1.calculateMACD)(history);
        const latestMacd = macdLine[macdLine.length - 1];
        const latestSignal = signalLine[signalLine.length - 1];
        const previousMacd = macdLine[macdLine.length - 2];
        const previousSignal = signalLine[signalLine.length - 2];
        let signal = null;
        if (previousMacd <= previousSignal && latestMacd > latestSignal) {
            signal = "BUY";
        }
        else if (previousMacd >= previousSignal && latestMacd < latestSignal) {
            signal = "SELL";
        }
        if (signal) {
            const payload = {
                strategy: "macd",
                symbol,
                signal,
                price,
            };
            logger_1.logger.info(`MACD Signal: ${JSON.stringify(payload)}`);
            await signalPublisher_1.SignalPublisher.publish(payload);
        }
    }
}
exports.MACDStrategy = MACDStrategy;
// Register strategy
baseStrategy_1.BaseStrategy.register("macd", MACDStrategy);
exports.default = MACDStrategy;

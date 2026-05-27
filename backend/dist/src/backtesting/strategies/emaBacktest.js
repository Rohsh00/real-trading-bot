"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMABacktestStrategy = void 0;
const indicators_1 = require("../../utils/indicators");
class EMABacktestStrategy {
    fastPeriod;
    slowPeriod;
    constructor(fastPeriod = 5, slowPeriod = 10) {
        this.fastPeriod = fastPeriod;
        this.slowPeriod = slowPeriod;
    }
    generateSignals(dataframe) {
        const closes = dataframe.map((row) => row.close);
        const fastEma = (0, indicators_1.calculateEMA)(closes, this.fastPeriod);
        const slowEma = (0, indicators_1.calculateEMA)(closes, this.slowPeriod);
        for (let i = 0; i < dataframe.length; i++) {
            const row = dataframe[i];
            row.fast_ema = fastEma[i];
            row.slow_ema = slowEma[i];
            if (row.fast_ema > row.slow_ema) {
                row.signal = 1;
            }
            else if (row.fast_ema < row.slow_ema) {
                row.signal = -1;
            }
            else {
                row.signal = 0;
            }
        }
        return dataframe;
    }
}
exports.EMABacktestStrategy = EMABacktestStrategy;
exports.default = EMABacktestStrategy;

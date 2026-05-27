"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEMA = calculateEMA;
exports.calculateRSI = calculateRSI;
exports.calculateMACD = calculateMACD;
function calculateEMA(prices, period) {
    if (prices.length === 0)
        return [];
    const ema = [];
    const k = 2 / (period + 1);
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
    }
    return ema;
}
function calculateRSI(prices, period) {
    if (prices.length <= period)
        return Array(prices.length).fill(50);
    const rsi = Array(prices.length).fill(50);
    // Compute price differences (deltas)
    const deltas = [];
    for (let i = 1; i < prices.length; i++) {
        deltas.push(prices[i] - prices[i - 1]);
    }
    // Calculate rolling mean of gains and losses
    for (let i = period; i < prices.length; i++) {
        let sumGain = 0;
        let sumLoss = 0;
        // Look at the last 'period' deltas (which correspond to indices from i-period to i-1 in deltas array)
        for (let j = i - period; j < i; j++) {
            const d = deltas[j];
            if (d > 0) {
                sumGain += d;
            }
            else {
                sumLoss += -d;
            }
        }
        const avgGain = sumGain / period;
        const avgLoss = sumLoss / period;
        if (avgLoss === 0) {
            rsi[i] = 100;
        }
        else {
            const rs = avgGain / avgLoss;
            rsi[i] = 100 - 100 / (1 + rs);
        }
    }
    return rsi;
}
function calculateMACD(prices) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = [];
    for (let i = 0; i < prices.length; i++) {
        macdLine.push(ema12[i] - ema26[i]);
    }
    const signalLine = calculateEMA(macdLine, 9);
    return { macdLine, signalLine };
}

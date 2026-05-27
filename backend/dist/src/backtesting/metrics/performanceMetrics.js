"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMetrics = void 0;
class PerformanceMetrics {
    static calculateTotalReturn(initialBalance, finalBalance) {
        return ((finalBalance - initialBalance) / initialBalance) * 100;
    }
    static calculateSharpeRatio(returns, riskFreeRate = 0) {
        if (returns.length === 0)
            return 0;
        const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
        const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        if (stdDev === 0)
            return 0;
        return (mean - riskFreeRate) / stdDev;
    }
    static calculateMaxDrawdown(equityCurve) {
        if (equityCurve.length === 0)
            return 0;
        let peak = equityCurve[0];
        let maxDrawdown = 0;
        for (const value of equityCurve) {
            if (value > peak) {
                peak = value;
            }
            const drawdown = (peak - value) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        return maxDrawdown * 100;
    }
}
exports.PerformanceMetrics = PerformanceMetrics;
exports.default = PerformanceMetrics;

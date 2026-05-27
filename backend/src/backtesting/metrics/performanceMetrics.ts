export class PerformanceMetrics {
  static calculateTotalReturn(initialBalance: number, finalBalance: number): number {
    return ((finalBalance - initialBalance) / initialBalance) * 100;
  }

  static calculateSharpeRatio(returns: number[], riskFreeRate: number = 0): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;

    const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    return (mean - riskFreeRate) / stdDev;
  }

  static calculateMaxDrawdown(equityCurve: number[]): number {
    if (equityCurve.length === 0) return 0;

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
export default PerformanceMetrics;

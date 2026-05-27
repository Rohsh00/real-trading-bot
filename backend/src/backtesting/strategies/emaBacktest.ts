import { CSVRow } from "../data/csvLoader";
import { calculateEMA } from "../../utils/indicators";

export class EMABacktestStrategy {
  private fastPeriod: number;
  private slowPeriod: number;

  constructor(fastPeriod: number = 5, slowPeriod: number = 10) {
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
  }

  generateSignals(dataframe: CSVRow[]): CSVRow[] {
    const closes = dataframe.map((row) => row.close);
    const fastEma = calculateEMA(closes, this.fastPeriod);
    const slowEma = calculateEMA(closes, this.slowPeriod);

    for (let i = 0; i < dataframe.length; i++) {
      const row = dataframe[i];
      row.fast_ema = fastEma[i];
      row.slow_ema = slowEma[i];

      if (row.fast_ema > row.slow_ema) {
        row.signal = 1;
      } else if (row.fast_ema < row.slow_ema) {
        row.signal = -1;
      } else {
        row.signal = 0;
      }
    }

    return dataframe;
  }
}
export default EMABacktestStrategy;

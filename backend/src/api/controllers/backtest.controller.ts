import { Request, Response } from "express";
import { CSVLoader } from "../../backtesting/data/csvLoader";
import { EMABacktestStrategy } from "../../backtesting/strategies/emaBacktest";
import { BacktestEngine } from "../../backtesting/backtestEngine";
import { logger } from "../../core/logger";

export class BacktestController {
  static async runBacktest(req: Request, res: Response) {
    try {
      const data = CSVLoader.loadCsv("data/btcusdt_sample.csv");
      const strategy = new EMABacktestStrategy();
      const engine = new BacktestEngine(strategy);
      const results = engine.run(data);
      return res.json(results);
    } catch (err: any) {
      logger.error(`Error in /backtest: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestController = void 0;
const csvLoader_1 = require("../../backtesting/data/csvLoader");
const emaBacktest_1 = require("../../backtesting/strategies/emaBacktest");
const backtestEngine_1 = require("../../backtesting/backtestEngine");
const logger_1 = require("../../core/logger");
class BacktestController {
    static async runBacktest(req, res) {
        try {
            const data = csvLoader_1.CSVLoader.loadCsv("data/btcusdt_sample.csv");
            const strategy = new emaBacktest_1.EMABacktestStrategy();
            const engine = new backtestEngine_1.BacktestEngine(strategy);
            const results = engine.run(data);
            return res.json(results);
        }
        catch (err) {
            logger_1.logger.error(`Error in /backtest: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.BacktestController = BacktestController;

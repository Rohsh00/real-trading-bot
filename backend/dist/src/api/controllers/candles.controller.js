"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesController = void 0;
const candleRepository_1 = require("../../repositories/candleRepository");
const logger_1 = require("../../core/logger");
class CandlesController {
    static async getCandles(req, res) {
        const symbol = req.query.symbol;
        const timeframe = req.query.timeframe;
        const limit = parseInt(req.query.limit || "100", 10);
        if (!symbol || !timeframe) {
            return res.status(400).json({ error: "Missing symbol or timeframe" });
        }
        try {
            const candles = await candleRepository_1.CandleRepository.getCandles(symbol, timeframe, limit);
            return res.json(candles);
        }
        catch (err) {
            logger_1.logger.error(`Error in /candles: ${err.message}`);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.CandlesController = CandlesController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleService = void 0;
const crypto_1 = require("crypto");
const candleRepository_1 = require("../repositories/candleRepository");
const logger_1 = require("../core/logger");
class CandleService {
    static async persistCandle(candleData) {
        const timestamp = new Date(candleData.timestamp);
        const candle = await candleRepository_1.CandleRepository.create({
            id: (0, crypto_1.randomUUID)(),
            symbol: candleData.symbol,
            timeframe: candleData.timeframe,
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
            volume: candleData.volume,
            timestamp,
        });
        logger_1.logger.info(`Candle Persisted: ${candle.symbol} ${candle.timeframe}`);
        return candle;
    }
}
exports.CandleService = CandleService;
exports.default = CandleService;

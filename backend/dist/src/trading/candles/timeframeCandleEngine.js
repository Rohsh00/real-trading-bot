"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeframeCandleEngine = void 0;
const redis_1 = __importDefault(require("../../core/redis"));
const logger_1 = require("../../core/logger");
const candlePublisher_1 = require("../../services/candlePublisher");
class TimeframeCandleEngine {
    static candles = {};
    static TIMEFRAMES = ["1m", "5m", "15m"];
    static isComplete(candle) {
        const ageSeconds = Math.floor((Date.now() - candle.created_at.getTime()) / 1000);
        const timeframe = candle.timeframe;
        if (timeframe === "1m")
            return ageSeconds >= 60;
        if (timeframe === "5m")
            return ageSeconds >= 300;
        if (timeframe === "15m")
            return ageSeconds >= 900;
        return false;
    }
    static async publishLive(candle) {
        const redisKey = `live_candle:${candle.symbol}:${candle.timeframe}`;
        const channel = `live_candle_events:${candle.symbol}:${candle.timeframe}`;
        const payload = JSON.stringify({
            symbol: candle.symbol,
            timeframe: candle.timeframe,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
            timestamp: candle.created_at.toISOString(),
            is_live: true,
        });
        // Store latest state (readable by HTTP endpoint)
        await redis_1.default.set(redisKey, payload, "EX", 120);
        // Pub/sub push so WebSocket can forward to browser immediately
        await redis_1.default.publish(channel, payload);
    }
    static async processTick(symbol, price, quantity = 0) {
        for (const timeframe of this.TIMEFRAMES) {
            const key = `${symbol}:${timeframe}`;
            const candle = this.candles[key];
            if (candle && this.isComplete(candle)) {
                const completedCandle = {
                    symbol: candle.symbol,
                    timeframe: candle.timeframe,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                    volume: candle.volume,
                    timestamp: candle.created_at.toISOString(),
                };
                await candlePublisher_1.CandlePublisher.publish(completedCandle);
                logger_1.logger.info(`Published Candle: ${key}`);
                // Start a new candle from this tick
                this.candles[key] = {
                    symbol,
                    timeframe,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                    volume: quantity,
                    created_at: new Date(),
                };
                await this.publishLive(this.candles[key]);
                continue;
            }
            if (!candle) {
                this.candles[key] = {
                    symbol,
                    timeframe,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                    volume: quantity,
                    created_at: new Date(),
                };
            }
            else {
                candle.high = Math.max(candle.high, price);
                candle.low = Math.min(candle.low, price);
                candle.close = price;
                candle.volume += quantity;
            }
            // Publish live state on every tick update
            await this.publishLive(this.candles[key]);
            logger_1.logger.info(`${key} Candle Updated`);
        }
    }
}
exports.TimeframeCandleEngine = TimeframeCandleEngine;
exports.default = TimeframeCandleEngine;

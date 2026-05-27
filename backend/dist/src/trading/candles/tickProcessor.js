"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickProcessor = void 0;
const redis_1 = __importDefault(require("../../core/redis"));
const logger_1 = require("../../core/logger");
class TickProcessor {
    static CHANNEL_NAME = "market_ticks";
    static async processTick(data) {
        const normalizedTick = {
            symbol: data.s,
            price: parseFloat(data.p),
            quantity: parseFloat(data.q),
            trade_time: data.T,
        };
        await redis_1.default.publish(this.CHANNEL_NAME, JSON.stringify(normalizedTick));
        await redis_1.default.set(`latest_price:${normalizedTick.symbol}`, String(normalizedTick.price));
        logger_1.logger.info(`Processed tick: ${JSON.stringify(normalizedTick)}`);
    }
}
exports.TickProcessor = TickProcessor;
exports.default = TickProcessor;

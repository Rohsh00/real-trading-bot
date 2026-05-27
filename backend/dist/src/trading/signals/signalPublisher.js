"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalPublisher = void 0;
const redis_1 = __importDefault(require("../../core/redis"));
const logger_1 = require("../../core/logger");
class SignalPublisher {
    static CHANNEL_NAME = "trading_signals";
    static LOG_KEY = "signals_log";
    static LOG_MAX = 100;
    static async publish(signal) {
        const signalWithTs = {
            ...signal,
            timestamp: new Date().toISOString(),
        };
        const payload = JSON.stringify(signalWithTs);
        // 1. Pub/sub for execution runner to consume
        await redis_1.default.publish(this.CHANNEL_NAME, payload);
        // 2. Persist to capped Redis list so /signals/recent can read it
        await redis_1.default.lpush(this.LOG_KEY, payload);
        await redis_1.default.ltrim(this.LOG_KEY, 0, this.LOG_MAX - 1);
        logger_1.logger.info(`Signal Published: ${payload}`);
    }
}
exports.SignalPublisher = SignalPublisher;
exports.default = SignalPublisher;

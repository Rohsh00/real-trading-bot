"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlePublisher = void 0;
const redis_1 = __importDefault(require("../core/redis"));
class CandlePublisher {
    static CHANNEL = "candle_events";
    static async publish(candle) {
        await redis_1.default.publish(this.CHANNEL, JSON.stringify(candle));
    }
}
exports.CandlePublisher = CandlePublisher;
exports.default = CandlePublisher;

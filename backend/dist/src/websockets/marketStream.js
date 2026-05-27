"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketStream = void 0;
const binanceClient_1 = require("./binanceClient");
const tickProcessor_1 = require("../trading/candles/tickProcessor");
const timeframeCandleEngine_1 = require("../trading/candles/timeframeCandleEngine");
const logger_1 = require("../core/logger");
class MarketStream {
    client = new binanceClient_1.BinanceWebSocketClient();
    async start() {
        logger_1.logger.info("Starting Market Stream");
        this.client.connect(async (tick) => {
            await tickProcessor_1.TickProcessor.processTick(tick);
            await timeframeCandleEngine_1.TimeframeCandleEngine.processTick(tick.s, parseFloat(tick.p), parseFloat(tick.q));
        });
    }
}
exports.MarketStream = MarketStream;
exports.default = MarketStream;

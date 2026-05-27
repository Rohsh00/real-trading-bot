"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceWebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../core/config");
const logger_1 = require("../core/logger");
const strategyRegistry_1 = require("../trading/strategies/strategyRegistry");
class BinanceWebSocketClient {
    registry = new strategyRegistry_1.StrategyRegistry();
    symbols = this.registry.getSymbols();
    streamUrl = `${config_1.settings.BINANCE_WS_BASE_URL}/stream?streams=` +
        this.symbols.map((symbol) => `${symbol.toLowerCase()}@trade`).join("/");
    ws = null;
    onTickCallback = null;
    constructor() { }
    connect(onTick) {
        this.onTickCallback = onTick;
        this.startConnection();
    }
    startConnection() {
        let reconnectDelay = 5000; // milliseconds
        logger_1.logger.info(`Connecting to Binance WebSocket: ${this.streamUrl}`);
        this.ws = new ws_1.default(this.streamUrl);
        this.ws.on("open", () => {
            logger_1.logger.info("Connected to Binance WebSocket");
            reconnectDelay = 5000; // reset delay
        });
        this.ws.on("message", async (data) => {
            try {
                const payload = JSON.parse(data.toString());
                if (payload && payload.data && this.onTickCallback) {
                    await this.onTickCallback(payload.data);
                }
            }
            catch (err) {
                logger_1.logger.error(`Error parsing message from Binance: ${err.message}`);
            }
        });
        this.ws.on("close", (code, reason) => {
            logger_1.logger.warn(`Binance WebSocket closed (${code}): ${reason}. Reconnecting in ${reconnectDelay / 1000}s...`);
            this.reconnect(reconnectDelay);
        });
        this.ws.on("error", (err) => {
            logger_1.logger.error(`Binance WebSocket error: ${err.message}`);
            this.ws?.close();
        });
    }
    reconnect(delay) {
        const nextDelay = Math.min(delay * 2, 60000); // capped at 60s
        setTimeout(() => {
            this.startConnection();
        }, delay);
    }
}
exports.BinanceWebSocketClient = BinanceWebSocketClient;
exports.default = BinanceWebSocketClient;

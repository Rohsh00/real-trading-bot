"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const config_1 = require("./core/config");
const logger_1 = require("./core/logger");
const redis_1 = require("./core/redis");
const app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
// Create Server
const server = http_1.default.createServer(app_1.app);
exports.server = server;
// WebSocket Server for Live Candles
const wss = new ws_1.WebSocketServer({ noServer: true });
wss.on("connection", async (ws, request, symbol, timeframe) => {
    const channel = `live_candle_events:${symbol}:${timeframe}`;
    const redisKey = `live_candle:${symbol}:${timeframe}`;
    const pubsub = (0, redis_1.createRedisClient)();
    try {
        await pubsub.subscribe(channel);
        // Send latest candle state immediately
        const last = await redis_1.redisClient.get(redisKey);
        if (last) {
            ws.send(last);
        }
        pubsub.on("message", (chan, message) => {
            if (chan === channel && ws.readyState === ws_1.WebSocket.OPEN) {
                ws.send(message);
            }
        });
        ws.on("close", async () => {
            await pubsub.unsubscribe(channel);
            pubsub.disconnect();
        });
        ws.on("error", async () => {
            await pubsub.unsubscribe(channel);
            pubsub.disconnect();
        });
    }
    catch (err) {
        logger_1.logger.error(`WebSocket connection setup error: ${err.message}`);
        ws.close();
    }
});
server.on("upgrade", (request, socket, head) => {
    const { pathname, query } = url_1.default.parse(request.url || "", true);
    if (pathname === "/api/v1/ws/candles") {
        const symbol = query.symbol || "BTCUSDT";
        const timeframe = query.timeframe || "1m";
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request, symbol, timeframe);
        });
    }
    else {
        socket.destroy();
    }
});
// Start Server
const PORT = config_1.settings.API_PORT;
const HOST = config_1.settings.API_HOST;
server.listen(PORT, HOST, () => {
    logger_1.logger.info(`Server running at http://${HOST}:${PORT}/`);
});
exports.default = app_1.app;

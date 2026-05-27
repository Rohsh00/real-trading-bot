import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { settings } from "./core/config";
import { logger } from "./core/logger";
import { redisClient, createRedisClient } from "./core/redis";
import { app } from "./app";

// Create Server
const server = http.createServer(app);

// WebSocket Server for Live Candles
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async (ws: WebSocket, request: any, symbol: string, timeframe: string) => {
  const channel = `live_candle_events:${symbol}:${timeframe}`;
  const redisKey = `live_candle:${symbol}:${timeframe}`;
  const pubsub = createRedisClient();

  try {
    await pubsub.subscribe(channel);

    // Send latest candle state immediately
    const last = await redisClient.get(redisKey);
    if (last) {
      ws.send(last);
    }

    pubsub.on("message", (chan, message) => {
      if (chan === channel && ws.readyState === WebSocket.OPEN) {
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
  } catch (err: any) {
    logger.error(`WebSocket connection setup error: ${err.message}`);
    ws.close();
  }
});

server.on("upgrade", (request, socket, head) => {
  const { pathname, query } = url.parse(request.url || "", true);

  if (pathname === "/api/v1/ws/candles") {
    const symbol = (query.symbol as string) || "BTCUSDT";
    const timeframe = (query.timeframe as string) || "1m";

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, symbol, timeframe);
    });
  } else {
    socket.destroy();
  }
});

// Start Server
const PORT = settings.API_PORT;
const HOST = settings.API_HOST;
server.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}/`);
});

// Export server for testing
export { app, server };
export default app;

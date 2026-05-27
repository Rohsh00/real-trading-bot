import WebSocket from "ws";
import { settings } from "../core/config";
import { logger } from "../core/logger";
import { StrategyRegistry } from "../trading/strategies/strategyRegistry";

export class BinanceWebSocketClient {
  private registry = new StrategyRegistry();
  private symbols = this.registry.getSymbols();
  private streamUrl = `${settings.BINANCE_WS_BASE_URL}/stream?streams=` +
    this.symbols.map((symbol) => `${symbol.toLowerCase()}@trade`).join("/");

  private ws: WebSocket | null = null;
  private onTickCallback: ((tick: any) => Promise<void>) | null = null;

  constructor() {}

  connect(onTick: (tick: any) => Promise<void>) {
    this.onTickCallback = onTick;
    this.startConnection();
  }

  private startConnection() {
    let reconnectDelay = 5000; // milliseconds

    logger.info(`Connecting to Binance WebSocket: ${this.streamUrl}`);
    this.ws = new WebSocket(this.streamUrl);

    this.ws.on("open", () => {
      logger.info("Connected to Binance WebSocket");
      reconnectDelay = 5000; // reset delay
    });

    this.ws.on("message", async (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload && payload.data && this.onTickCallback) {
          await this.onTickCallback(payload.data);
        }
      } catch (err: any) {
        logger.error(`Error parsing message from Binance: ${err.message}`);
      }
    });

    this.ws.on("close", (code, reason) => {
      logger.warn(`Binance WebSocket closed (${code}): ${reason}. Reconnecting in ${reconnectDelay / 1000}s...`);
      this.reconnect(reconnectDelay);
    });

    this.ws.on("error", (err) => {
      logger.error(`Binance WebSocket error: ${err.message}`);
      this.ws?.close();
    });
  }

  private reconnect(delay: number) {
    const nextDelay = Math.min(delay * 2, 60000); // capped at 60s
    setTimeout(() => {
      this.startConnection();
    }, delay);
  }
}
export default BinanceWebSocketClient;

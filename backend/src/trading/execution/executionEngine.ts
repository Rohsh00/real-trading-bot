import crypto from "crypto";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import redisClient from "../../core/redis";
import { PortfolioManager } from "../portfolio/portfolioManager";
import { RiskManager } from "../risk/riskManager";
import { BrokerFactory } from "../brokers/brokerFactory";
import { logger } from "../../core/logger";
import { resolveWorkspacePath } from "../../core/config";

class Lock {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    } else {
      this.locked = false;
    }
  }
}

export class ExecutionEngine {
  private DEFAULT_QUANTITY = 0.01;
  private locks: { [symbol: string]: Lock } = {};
  private broker: any;

  constructor() {
    const filePath = resolveWorkspacePath("config/broker_config.yaml");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const config = yaml.parse(fileContent);
    const brokerName = config.broker || "paper";

    this.broker = BrokerFactory.getBroker(brokerName);
  }

  async executeSignal(signal: {
    symbol: string;
    signal: string;
    price: number;
    idempotency_key?: string;
  }): Promise<any> {
    const symbol = signal.symbol;

    // Idempotency Protection
    let idempotencyKey = "";
    if (signal.idempotency_key) {
      idempotencyKey = `execution:idempotency:${signal.idempotency_key}`;
    } else {
      // Sort keys to get identical hash for identical objects
      const sortedKeys = Object.keys(signal).sort();
      const sortedObj: any = {};
      for (const k of sortedKeys) {
        sortedObj[k] = (signal as any)[k];
      }
      const signalStr = JSON.stringify(sortedObj);
      const signalHash = crypto.createHash("sha256").update(signalStr).digest("hex");
      idempotencyKey = `execution:idempotency:${signalHash}`;
    }

    const acquired = await redisClient.set(idempotencyKey, "1", "EX", 10, "NX");
    if (!acquired) {
      logger.warn(`Duplicate execution blocked by idempotency key: ${idempotencyKey}`);
      return;
    }

    if (!this.locks[symbol]) {
      this.locks[symbol] = new Lock();
    }

    await this.locks[symbol].acquire();

    try {
      const side = signal.signal;
      const price = signal.price;
      const quantity = this.DEFAULT_QUANTITY;

      const currentPosition = PortfolioManager.positions[symbol];

      if (side === "BUY" && currentPosition) {
        logger.info(`Already holding ${symbol}`);
        return;
      }

      if (side === "SELL" && !currentPosition) {
        logger.info(`No open position for ${symbol}`);
        return;
      }

      const isAllowed = await RiskManager.validateOrder(symbol, quantity, price, side);
      if (!isAllowed) {
        logger.warn("Risk manager rejected order");
        return;
      }

      const order = await this.broker.placeOrder(symbol, side, quantity, price);

      await PortfolioManager.updatePosition(symbol, side, quantity, price);

      logger.info(`Execution Complete: ${JSON.stringify(order)}`);
      return order;
    } finally {
      this.locks[symbol].release();
    }
  }
}
export default ExecutionEngine;

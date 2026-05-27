"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEngine = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const redis_1 = __importDefault(require("../../core/redis"));
const portfolioManager_1 = require("../portfolio/portfolioManager");
const riskManager_1 = require("../risk/riskManager");
const brokerFactory_1 = require("../brokers/brokerFactory");
const logger_1 = require("../../core/logger");
class Lock {
    locked = false;
    queue = [];
    async acquire() {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        return new Promise((resolve) => {
            this.queue.push(resolve);
        });
    }
    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            if (next)
                next();
        }
        else {
            this.locked = false;
        }
    }
}
class ExecutionEngine {
    DEFAULT_QUANTITY = 0.01;
    locks = {};
    broker;
    constructor() {
        const filePath = path_1.default.resolve(process.cwd(), "config/broker_config.yaml");
        const fileContent = fs_1.default.readFileSync(filePath, "utf8");
        const config = yaml_1.default.parse(fileContent);
        const brokerName = config.broker || "paper";
        this.broker = brokerFactory_1.BrokerFactory.getBroker(brokerName);
    }
    async executeSignal(signal) {
        const symbol = signal.symbol;
        // Idempotency Protection
        let idempotencyKey = "";
        if (signal.idempotency_key) {
            idempotencyKey = `execution:idempotency:${signal.idempotency_key}`;
        }
        else {
            // Sort keys to get identical hash for identical objects
            const sortedKeys = Object.keys(signal).sort();
            const sortedObj = {};
            for (const k of sortedKeys) {
                sortedObj[k] = signal[k];
            }
            const signalStr = JSON.stringify(sortedObj);
            const signalHash = crypto_1.default.createHash("sha256").update(signalStr).digest("hex");
            idempotencyKey = `execution:idempotency:${signalHash}`;
        }
        const acquired = await redis_1.default.set(idempotencyKey, "1", "EX", 10, "NX");
        if (!acquired) {
            logger_1.logger.warn(`Duplicate execution blocked by idempotency key: ${idempotencyKey}`);
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
            const currentPosition = portfolioManager_1.PortfolioManager.positions[symbol];
            if (side === "BUY" && currentPosition) {
                logger_1.logger.info(`Already holding ${symbol}`);
                return;
            }
            if (side === "SELL" && !currentPosition) {
                logger_1.logger.info(`No open position for ${symbol}`);
                return;
            }
            const isAllowed = await riskManager_1.RiskManager.validateOrder(symbol, quantity, price, side);
            if (!isAllowed) {
                logger_1.logger.warn("Risk manager rejected order");
                return;
            }
            const order = await this.broker.placeOrder(symbol, side, quantity, price);
            await portfolioManager_1.PortfolioManager.updatePosition(symbol, side, quantity, price);
            logger_1.logger.info(`Execution Complete: ${JSON.stringify(order)}`);
            return order;
        }
        finally {
            this.locks[symbol].release();
        }
    }
}
exports.ExecutionEngine = ExecutionEngine;
exports.default = ExecutionEngine;

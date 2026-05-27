"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaperBroker = void 0;
const crypto_1 = require("crypto");
const baseBroker_1 = require("./baseBroker");
const logger_1 = require("../../core/logger");
class PaperBroker extends baseBroker_1.BaseBroker {
    async placeOrder(symbol, side, quantity, price) {
        const order = {
            order_id: (0, crypto_1.randomUUID)(),
            symbol,
            side,
            quantity,
            price,
            status: "FILLED",
        };
        logger_1.logger.info(`Paper Order Filled: ${JSON.stringify(order)}`);
        return order;
    }
    async cancelOrder(orderId) {
        logger_1.logger.info(`Paper Order Cancelled: ${orderId}`);
    }
    async getPositions() {
        return [];
    }
    async getBalance() {
        return {
            balance: 100000.0,
        };
    }
}
exports.PaperBroker = PaperBroker;
baseBroker_1.BaseBroker.register("paper", PaperBroker);
exports.default = PaperBroker;

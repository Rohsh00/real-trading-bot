"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const crypto_1 = require("crypto");
const orderRepository_1 = require("../repositories/orderRepository");
const tradeRepository_1 = require("../repositories/tradeRepository");
const positionService_1 = require("./positionService");
const auditService_1 = require("./auditService");
class ExecutionService {
    static async persistExecution(executionResult) {
        const orderId = (0, crypto_1.randomUUID)();
        const order = await orderRepository_1.OrderRepository.create({
            id: orderId,
            symbol: executionResult.symbol,
            side: executionResult.side,
            order_type: "MARKET",
            quantity: executionResult.quantity,
            price: executionResult.price,
            status: "FILLED",
        });
        const tradeId = (0, crypto_1.randomUUID)();
        await tradeRepository_1.TradeRepository.create({
            id: tradeId,
            order_id: order.id,
            symbol: executionResult.symbol,
            side: executionResult.side,
            quantity: executionResult.quantity,
            price: executionResult.price,
        });
        const side = executionResult.side;
        const symbol = executionResult.symbol;
        const price = executionResult.price;
        const quantity = executionResult.quantity;
        if (side === "BUY") {
            await positionService_1.PositionService.createPosition(symbol, quantity, price, price * 0.98, price * 1.03);
            await auditService_1.AuditService.logEvent("POSITION", "POSITION_OPENED", symbol, { side, quantity, price });
        }
        else if (side === "SELL") {
            await positionService_1.PositionService.closePosition(symbol);
            await auditService_1.AuditService.logEvent("POSITION", "POSITION_CLOSED", symbol, { side, quantity, price });
        }
        await auditService_1.AuditService.logEvent("EXECUTION", "ORDER_FILLED", order.id, executionResult);
        return order;
    }
}
exports.ExecutionService = ExecutionService;
exports.default = ExecutionService;

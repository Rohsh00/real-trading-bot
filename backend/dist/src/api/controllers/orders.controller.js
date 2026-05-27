"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const orderRepository_1 = require("../../repositories/orderRepository");
const logger_1 = require("../../core/logger");
class OrdersController {
    static async getRecent(req, res) {
        const limit = parseInt(req.query.limit || "20", 10);
        try {
            const orders = await orderRepository_1.OrderRepository.getRecent(limit);
            return res.json(orders.map((o) => ({
                id: o.id,
                symbol: o.symbol,
                side: o.side,
                order_type: o.order_type,
                quantity: o.quantity,
                price: o.price,
                status: o.status,
                created_at: o.created_at.toISOString(),
            })));
        }
        catch (err) {
            logger_1.logger.error(`Error in /orders/recent: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.OrdersController = OrdersController;

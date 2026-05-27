"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const database_1 = require("../core/database");
class OrderRepository {
    static async create(data) {
        return database_1.prisma.order.create({
            data,
        });
    }
    static async getById(orderId) {
        return database_1.prisma.order.findUnique({
            where: {
                id: orderId,
            },
        });
    }
    static async getRecent(limit = 20) {
        return database_1.prisma.order.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: limit,
        });
    }
}
exports.OrderRepository = OrderRepository;
exports.default = OrderRepository;

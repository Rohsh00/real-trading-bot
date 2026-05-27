"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRepository = void 0;
const database_1 = require("../core/database");
class StrategyRepository {
    static async create(data) {
        return database_1.prisma.strategy.create({
            data,
        });
    }
    static async getAll() {
        return database_1.prisma.strategy.findMany();
    }
    static async getById(strategyId) {
        return database_1.prisma.strategy.findUnique({
            where: {
                id: strategyId,
            },
        });
    }
    static async update(strategyId, data) {
        return database_1.prisma.strategy.update({
            where: {
                id: strategyId,
            },
            data,
        });
    }
    static async delete(strategyId) {
        await database_1.prisma.strategy.delete({
            where: {
                id: strategyId,
            },
        });
        return true;
    }
}
exports.StrategyRepository = StrategyRepository;
exports.default = StrategyRepository;

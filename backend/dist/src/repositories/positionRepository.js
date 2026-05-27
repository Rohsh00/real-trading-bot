"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionRepository = void 0;
const database_1 = require("../core/database");
class PositionRepository {
    static async create(data) {
        return database_1.prisma.position.create({
            data,
        });
    }
    static async getBySymbol(symbol) {
        return database_1.prisma.position.findUnique({
            where: {
                symbol,
            },
        });
    }
    static async getAll() {
        return database_1.prisma.position.findMany();
    }
    static async delete(symbol) {
        await database_1.prisma.position.delete({
            where: {
                symbol,
            },
        });
    }
    static async update(symbol, data) {
        return database_1.prisma.position.update({
            where: {
                symbol,
            },
            data,
        });
    }
}
exports.PositionRepository = PositionRepository;
exports.default = PositionRepository;

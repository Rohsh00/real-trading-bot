"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleRepository = void 0;
const database_1 = require("../core/database");
class CandleRepository {
    static async create(data) {
        return database_1.prisma.candle.create({
            data,
        });
    }
    static async getCandles(symbol, timeframe, limit = 100) {
        return database_1.prisma.candle.findMany({
            where: {
                symbol,
                timeframe,
            },
            orderBy: {
                timestamp: "desc",
            },
            take: limit,
        });
    }
}
exports.CandleRepository = CandleRepository;

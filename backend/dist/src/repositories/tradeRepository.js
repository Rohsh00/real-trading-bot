"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRepository = void 0;
const database_1 = require("../core/database");
class TradeRepository {
    static async create(data) {
        return database_1.prisma.trade.create({
            data,
        });
    }
}
exports.TradeRepository = TradeRepository;
exports.default = TradeRepository;

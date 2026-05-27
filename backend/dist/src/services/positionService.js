"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionService = void 0;
const crypto_1 = require("crypto");
const positionRepository_1 = require("../repositories/positionRepository");
class PositionService {
    static async createPosition(symbol, quantity, averagePrice, stopLoss, takeProfit) {
        return positionRepository_1.PositionRepository.create({
            id: (0, crypto_1.randomUUID)(),
            symbol,
            quantity,
            average_price: averagePrice,
            stop_loss: stopLoss,
            take_profit: takeProfit,
            unrealized_pnl: 0,
        });
    }
    static async getPosition(symbol) {
        return positionRepository_1.PositionRepository.getBySymbol(symbol);
    }
    static async getAllPositions() {
        return positionRepository_1.PositionRepository.getAll();
    }
    static async closePosition(symbol) {
        const position = await positionRepository_1.PositionRepository.getBySymbol(symbol);
        if (position) {
            await positionRepository_1.PositionRepository.delete(symbol);
        }
    }
    static async updatePosition(symbol, data) {
        return positionRepository_1.PositionRepository.update(symbol, data);
    }
}
exports.PositionService = PositionService;
exports.default = PositionService;

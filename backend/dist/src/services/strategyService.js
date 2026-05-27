"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const crypto_1 = require("crypto");
const strategyRepository_1 = require("../repositories/strategyRepository");
class StrategyService {
    static async createStrategy(payload) {
        return strategyRepository_1.StrategyRepository.create({
            id: (0, crypto_1.randomUUID)(),
            name: payload.name,
            description: payload.description,
            config: payload.config,
            is_active: payload.is_active !== undefined ? payload.is_active : true,
        });
    }
    static async listStrategies() {
        return strategyRepository_1.StrategyRepository.getAll();
    }
    static async updateStrategy(strategyId, updateData) {
        const strategy = await strategyRepository_1.StrategyRepository.getById(strategyId);
        if (!strategy) {
            return null;
        }
        return strategyRepository_1.StrategyRepository.update(strategyId, updateData);
    }
    static async deleteStrategy(strategyId) {
        const strategy = await strategyRepository_1.StrategyRepository.getById(strategyId);
        if (!strategy) {
            return false;
        }
        return strategyRepository_1.StrategyRepository.delete(strategyId);
    }
}
exports.StrategyService = StrategyService;
exports.default = StrategyService;

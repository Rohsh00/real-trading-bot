"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskService = void 0;
const redis_1 = __importDefault(require("../core/redis"));
const riskRepository_1 = require("../repositories/riskRepository");
const logger_1 = require("../core/logger");
class RiskService {
    static CACHE_KEY = "system:risk_settings";
    static async getSettings() {
        const cached = await redis_1.default.get(this.CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
        const settings = await riskRepository_1.RiskRepository.getSettings();
        const data = {
            max_position_size: settings.max_position_size,
            max_open_positions: settings.max_open_positions,
            max_daily_loss: settings.max_daily_loss,
            restricted_symbols: settings.restricted_symbols,
        };
        await this.updateCache(data);
        return data;
    }
    static async updateSettings(data) {
        const settings = await riskRepository_1.RiskRepository.updateSettings(data);
        const updatedData = {
            max_position_size: settings.max_position_size,
            max_open_positions: settings.max_open_positions,
            max_daily_loss: settings.max_daily_loss,
            restricted_symbols: settings.restricted_symbols,
        };
        await this.updateCache(updatedData);
        return updatedData;
    }
    static async updateCache(data) {
        await redis_1.default.set(this.CACHE_KEY, JSON.stringify(data));
        logger_1.logger.info(`Risk settings cache updated: ${JSON.stringify(data)}`);
    }
}
exports.RiskService = RiskService;
exports.default = RiskService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategiesController = void 0;
const strategyService_1 = require("../../services/strategyService");
const logger_1 = require("../../core/logger");
class StrategiesController {
    static async createStrategy(req, res) {
        try {
            const strategy = await strategyService_1.StrategyService.createStrategy(req.body);
            return res.status(201).json(strategy);
        }
        catch (err) {
            logger_1.logger.error(`Error creating strategy: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
    static async listStrategies(req, res) {
        try {
            const list = await strategyService_1.StrategyService.listStrategies();
            return res.json(list);
        }
        catch (err) {
            logger_1.logger.error(`Error listing strategies: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
    static async updateStrategy(req, res) {
        try {
            const updated = await strategyService_1.StrategyService.updateStrategy(req.params.strategy_id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Strategy not found" });
            }
            return res.json(updated);
        }
        catch (err) {
            logger_1.logger.error(`Error updating strategy: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
    static async deleteStrategy(req, res) {
        try {
            const deleted = await strategyService_1.StrategyService.deleteStrategy(req.params.strategy_id);
            if (!deleted) {
                return res.status(404).json({ error: "Strategy not found" });
            }
            return res.json({ message: "Strategy deleted successfully" });
        }
        catch (err) {
            logger_1.logger.error(`Error deleting strategy: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.StrategiesController = StrategiesController;

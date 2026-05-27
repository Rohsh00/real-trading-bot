"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskController = void 0;
const riskService_1 = require("../../services/riskService");
const logger_1 = require("../../core/logger");
class RiskController {
    static async getSettings(req, res) {
        try {
            const riskSettings = await riskService_1.RiskService.getSettings();
            return res.json(riskSettings);
        }
        catch (err) {
            logger_1.logger.error(`Error in GET /risk: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
    static async updateSettings(req, res) {
        try {
            const updated = await riskService_1.RiskService.updateSettings(req.body);
            return res.json(updated);
        }
        catch (err) {
            logger_1.logger.error(`Error in PUT /risk: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.RiskController = RiskController;

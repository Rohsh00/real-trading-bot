"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const auditRepository_1 = require("../../repositories/auditRepository");
const logger_1 = require("../../core/logger");
class AuditController {
    static async getRecent(req, res) {
        const limit = parseInt(req.query.limit || "100", 10);
        try {
            const logs = await auditRepository_1.AuditRepository.getRecent(limit);
            return res.json(logs);
        }
        catch (err) {
            logger_1.logger.error(`Error in /audit: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.AuditController = AuditController;

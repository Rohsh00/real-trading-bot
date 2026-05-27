"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const crypto_1 = require("crypto");
const auditRepository_1 = require("../repositories/auditRepository");
const logger_1 = require("../core/logger");
class AuditService {
    static async logEvent(eventType, eventName, entityId = null, details = {}) {
        try {
            const log = await auditRepository_1.AuditRepository.create({
                id: (0, crypto_1.randomUUID)(),
                event_type: eventType,
                event_name: eventName,
                entity_id: entityId ? String(entityId) : null,
                details: details || {},
            });
            logger_1.logger.debug(`Audit Log Created: [${eventType}] ${eventName}`);
            return log;
        }
        catch (e) {
            logger_1.logger.error(`Failed to save audit log for ${eventName}: ${e.message}`);
            throw e;
        }
    }
}
exports.AuditService = AuditService;
exports.default = AuditService;

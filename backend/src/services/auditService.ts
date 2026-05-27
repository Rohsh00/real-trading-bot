import { randomUUID } from "crypto";
import { AuditRepository } from "../repositories/auditRepository";
import { logger } from "../core/logger";

export class AuditService {
  static async logEvent(
    eventType: string,
    eventName: string,
    entityId: string | null = null,
    details: any = {}
  ) {
    try {
      const log = await AuditRepository.create({
        id: randomUUID(),
        event_type: eventType,
        event_name: eventName,
        entity_id: entityId ? String(entityId) : null,
        details: details || {},
      });
      logger.debug(`Audit Log Created: [${eventType}] ${eventName}`);
      return log;
    } catch (e: any) {
      logger.error(`Failed to save audit log for ${eventName}: ${e.message}`);
      throw e;
    }
  }
}
export default AuditService;

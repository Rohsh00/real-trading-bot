import { Request, Response } from "express";
import { AuditRepository } from "../../repositories/auditRepository";
import { logger } from "../../core/logger";

export class AuditController {
  static async getRecent(req: Request, res: Response) {
    const limit = parseInt((req.query.limit as string) || "100", 10);
    try {
      const logs = await AuditRepository.getRecent(limit);
      return res.json(logs);
    } catch (err: any) {
      logger.error(`Error in /audit: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

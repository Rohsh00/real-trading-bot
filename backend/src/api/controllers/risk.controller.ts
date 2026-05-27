import { Request, Response } from "express";
import { RiskService } from "../../services/riskService";
import { logger } from "../../core/logger";

export class RiskController {
  static async getSettings(req: Request, res: Response) {
    try {
      const riskSettings = await RiskService.getSettings();
      return res.json(riskSettings);
    } catch (err: any) {
      logger.error(`Error in GET /risk: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const updated = await RiskService.updateSettings(req.body);
      return res.json(updated);
    } catch (err: any) {
      logger.error(`Error in PUT /risk: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

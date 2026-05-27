import { Request, Response } from "express";
import { StrategyService } from "../../services/strategyService";
import { logger } from "../../core/logger";

export class StrategiesController {
  static async createStrategy(req: Request, res: Response) {
    try {
      const strategy = await StrategyService.createStrategy(req.body);
      return res.status(201).json(strategy);
    } catch (err: any) {
      logger.error(`Error creating strategy: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  static async listStrategies(req: Request, res: Response) {
    try {
      const list = await StrategyService.listStrategies();
      return res.json(list);
    } catch (err: any) {
      logger.error(`Error listing strategies: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateStrategy(req: Request, res: Response) {
    try {
      const updated = await StrategyService.updateStrategy(req.params.strategy_id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      return res.json(updated);
    } catch (err: any) {
      logger.error(`Error updating strategy: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteStrategy(req: Request, res: Response) {
    try {
      const deleted = await StrategyService.deleteStrategy(req.params.strategy_id);
      if (!deleted) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      return res.json({ message: "Strategy deleted successfully" });
    } catch (err: any) {
      logger.error(`Error deleting strategy: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

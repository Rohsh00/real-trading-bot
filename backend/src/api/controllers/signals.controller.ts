import { Request, Response } from "express";
import { redisClient } from "../../core/redis";
import { logger } from "../../core/logger";

export class SignalsController {
  static async getRecent(req: Request, res: Response) {
    const limit = parseInt((req.query.limit as string) || "20", 10);
    try {
      const raw = await redisClient.lrange("signals_log", 0, limit - 1);
      const signals = raw.map((item) => JSON.parse(item));
      return res.json(signals);
    } catch (err: any) {
      logger.error(`Error fetching recent signals: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

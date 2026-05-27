import { Request, Response } from "express";
import { CandleRepository } from "../../repositories/candleRepository";
import { logger } from "../../core/logger";

export class CandlesController {
  static async getCandles(req: Request, res: Response) {
    const symbol = req.query.symbol as string;
    const timeframe = req.query.timeframe as string;
    const limit = parseInt((req.query.limit as string) || "100", 10);

    if (!symbol || !timeframe) {
      return res.status(400).json({ error: "Missing symbol or timeframe" });
    }

    try {
      const candles = await CandleRepository.getCandles(symbol, timeframe, limit);
      return res.json(candles);
    } catch (err: any) {
      logger.error(`Error in /candles: ${err.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

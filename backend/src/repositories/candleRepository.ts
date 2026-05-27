import { prisma } from "../core/database";
import { Candle } from "@prisma/client";

export class CandleRepository {
  static async create(data: {
    id: string;
    symbol: string;
    timeframe: string;
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }): Promise<Candle> {
    return prisma.candle.create({
      data,
    });
  }

  static async getCandles(symbol: string, timeframe: string, limit: number = 100): Promise<Candle[]> {
    return prisma.candle.findMany({
      where: {
        symbol,
        timeframe,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });
  }
}

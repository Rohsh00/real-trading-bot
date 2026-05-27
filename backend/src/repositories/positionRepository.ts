import { prisma } from "../core/database";
import { Position } from "@prisma/client";

export class PositionRepository {
  static async create(data: {
    id: string;
    symbol: string;
    quantity: number;
    average_price: number;
    stop_loss?: number | null;
    take_profit?: number | null;
    unrealized_pnl?: number;
  }): Promise<Position> {
    return prisma.position.create({
      data,
    });
  }

  static async getBySymbol(symbol: string): Promise<Position | null> {
    return prisma.position.findUnique({
      where: {
        symbol,
      },
    });
  }

  static async getAll(): Promise<Position[]> {
    return prisma.position.findMany();
  }

  static async delete(symbol: string): Promise<void> {
    await prisma.position.delete({
      where: {
        symbol,
      },
    });
  }

  static async update(symbol: string, data: {
    quantity?: number;
    average_price?: number;
    stop_loss?: number | null;
    take_profit?: number | null;
    unrealized_pnl?: number;
  }): Promise<Position> {
    return prisma.position.update({
      where: {
        symbol,
      },
      data,
    });
  }
}
export default PositionRepository;

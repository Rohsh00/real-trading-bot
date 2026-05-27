import { prisma } from "../core/database";
import { Strategy } from "@prisma/client";

export class StrategyRepository {
  static async create(data: {
    id: string;
    name: string;
    description?: string | null;
    config: any;
    is_active: boolean;
  }): Promise<Strategy> {
    return prisma.strategy.create({
      data,
    });
  }

  static async getAll(): Promise<Strategy[]> {
    return prisma.strategy.findMany();
  }

  static async getById(strategyId: string): Promise<Strategy | null> {
    return prisma.strategy.findUnique({
      where: {
        id: strategyId,
      },
    });
  }

  static async update(strategyId: string, data: {
    name?: string;
    description?: string | null;
    config?: any;
    is_active?: boolean;
  }): Promise<Strategy> {
    return prisma.strategy.update({
      where: {
        id: strategyId,
      },
      data,
    });
  }

  static async delete(strategyId: string): Promise<boolean> {
    await prisma.strategy.delete({
      where: {
        id: strategyId,
      },
    });
    return true;
  }
}
export default StrategyRepository;

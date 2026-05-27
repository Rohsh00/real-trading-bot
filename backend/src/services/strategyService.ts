import { randomUUID } from "crypto";
import { StrategyRepository } from "../repositories/strategyRepository";

export class StrategyService {
  static async createStrategy(payload: {
    name: string;
    description?: string | null;
    config: any;
    is_active?: boolean;
  }) {
    return StrategyRepository.create({
      id: randomUUID(),
      name: payload.name,
      description: payload.description,
      config: payload.config,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    });
  }

  static async listStrategies() {
    return StrategyRepository.getAll();
  }

  static async updateStrategy(strategyId: string, updateData: any) {
    const strategy = await StrategyRepository.getById(strategyId);
    if (!strategy) {
      return null;
    }
    return StrategyRepository.update(strategyId, updateData);
  }

  static async deleteStrategy(strategyId: string) {
    const strategy = await StrategyRepository.getById(strategyId);
    if (!strategy) {
      return false;
    }
    return StrategyRepository.delete(strategyId);
  }
}
export default StrategyService;

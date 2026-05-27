import redisClient from "../core/redis";
import { RiskRepository } from "../repositories/riskRepository";
import { logger } from "../core/logger";

export class RiskService {
  static CACHE_KEY = "system:risk_settings";

  static async getSettings(): Promise<any> {
    const cached = await redisClient.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const settings = await RiskRepository.getSettings();
    const data = {
      max_position_size: settings.max_position_size,
      max_open_positions: settings.max_open_positions,
      max_daily_loss: settings.max_daily_loss,
      restricted_symbols: settings.restricted_symbols,
    };

    await this.updateCache(data);
    return data;
  }

  static async updateSettings(data: any): Promise<any> {
    const settings = await RiskRepository.updateSettings(data);
    const updatedData = {
      max_position_size: settings.max_position_size,
      max_open_positions: settings.max_open_positions,
      max_daily_loss: settings.max_daily_loss,
      restricted_symbols: settings.restricted_symbols,
    };

    await this.updateCache(updatedData);
    return updatedData;
  }

  static async updateCache(data: any) {
    await redisClient.set(this.CACHE_KEY, JSON.stringify(data));
    logger.info(`Risk settings cache updated: ${JSON.stringify(data)}`);
  }
}
export default RiskService;

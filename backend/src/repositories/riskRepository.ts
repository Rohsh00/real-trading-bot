import { randomUUID } from "crypto";
import { prisma } from "../core/database";
import { RiskSettings } from "@prisma/client";

export class RiskRepository {
  static async getSettings(): Promise<RiskSettings> {
    let settings = await prisma.riskSettings.findUnique({
      where: {
        name: "default",
      },
    });

    if (!settings) {
      settings = await prisma.riskSettings.create({
        data: {
          id: randomUUID(),
          name: "default",
          max_position_size: 10000.0,
          max_open_positions: 5,
          max_daily_loss: -5000.0,
          restricted_symbols: ["DOGEUSDT", "SHIBUSDT"],
        },
      });
    }

    return settings;
  }

  static async updateSettings(data: {
    max_position_size?: number;
    max_open_positions?: number;
    max_daily_loss?: number;
    restricted_symbols?: any;
  }): Promise<RiskSettings> {
    const settings = await this.getSettings();

    const updateData: any = {};
    if (data.max_position_size !== undefined) updateData.max_position_size = data.max_position_size;
    if (data.max_open_positions !== undefined) updateData.max_open_positions = data.max_open_positions;
    if (data.max_daily_loss !== undefined) updateData.max_daily_loss = data.max_daily_loss;
    if (data.restricted_symbols !== undefined) updateData.restricted_symbols = data.restricted_symbols;

    return prisma.riskSettings.update({
      where: {
        id: settings.id,
      },
      data: updateData,
    });
  }
}
export default RiskRepository;

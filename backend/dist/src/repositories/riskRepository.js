"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskRepository = void 0;
const crypto_1 = require("crypto");
const database_1 = require("../core/database");
class RiskRepository {
    static async getSettings() {
        let settings = await database_1.prisma.riskSettings.findUnique({
            where: {
                name: "default",
            },
        });
        if (!settings) {
            settings = await database_1.prisma.riskSettings.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
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
    static async updateSettings(data) {
        const settings = await this.getSettings();
        const updateData = {};
        if (data.max_position_size !== undefined)
            updateData.max_position_size = data.max_position_size;
        if (data.max_open_positions !== undefined)
            updateData.max_open_positions = data.max_open_positions;
        if (data.max_daily_loss !== undefined)
            updateData.max_daily_loss = data.max_daily_loss;
        if (data.restricted_symbols !== undefined)
            updateData.restricted_symbols = data.restricted_symbols;
        return database_1.prisma.riskSettings.update({
            where: {
                id: settings.id,
            },
            data: updateData,
        });
    }
}
exports.RiskRepository = RiskRepository;
exports.default = RiskRepository;

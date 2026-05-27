"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskManager = void 0;
const logger_1 = require("../../core/logger");
const riskService_1 = require("../../services/riskService");
const portfolioManager_1 = require("../portfolio/portfolioManager");
class RiskManager {
    static async validateOrder(symbol, quantity, price, side) {
        const settings = await riskService_1.RiskService.getSettings();
        const normalizeSym = (s) => {
            return String(s).trim().toUpperCase().replace("/", "").replace("-", "");
        };
        // 1. Restricted Symbols Check
        const restrictedSymbols = (settings.restricted_symbols || []).map((s) => normalizeSym(s));
        if (restrictedSymbols.includes(normalizeSym(symbol))) {
            logger_1.logger.warn(`Risk rejected order: ${symbol} is restricted`);
            return false;
        }
        // 2. Max Position Size Check
        const orderValue = quantity * price;
        const maxPositionSize = settings.max_position_size !== undefined ? settings.max_position_size : 10000.0;
        if (orderValue > maxPositionSize) {
            logger_1.logger.warn(`Risk rejected order: size ${orderValue} exceeds max ${maxPositionSize}`);
            return false;
        }
        // 3. Max Open Positions Check (Only for BUY orders)
        if (side === "BUY") {
            const openPositions = Object.keys(portfolioManager_1.PortfolioManager.positions).length;
            const maxOpenPositions = settings.max_open_positions !== undefined ? settings.max_open_positions : 5;
            if (openPositions >= maxOpenPositions) {
                logger_1.logger.warn(`Risk rejected order: max open positions ${maxOpenPositions} reached`);
                return false;
            }
        }
        // 4. Max Daily Loss / Drawdown Check
        const realizedPnl = await portfolioManager_1.PortfolioManager.getRealizedPnl();
        const maxDailyLoss = settings.max_daily_loss !== undefined ? settings.max_daily_loss : -5000.0;
        const maxDailyLossLimit = -Math.abs(maxDailyLoss);
        if (realizedPnl <= maxDailyLossLimit) {
            logger_1.logger.warn(`Risk rejected order: max daily loss ${maxDailyLossLimit} exceeded`);
            return false;
        }
        return true;
    }
}
exports.RiskManager = RiskManager;
exports.default = RiskManager;

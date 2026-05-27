"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioManager = void 0;
const redis_1 = __importDefault(require("../../core/redis"));
const logger_1 = require("../../core/logger");
class PortfolioManager {
    static positions = {};
    static async getCashBalance() {
        const val = await redis_1.default.get("portfolio:cash_balance");
        return val ? parseFloat(val) : 100000.0;
    }
    static async setCashBalance(amount) {
        await redis_1.default.set("portfolio:cash_balance", String(amount));
    }
    static async getRealizedPnl() {
        const val = await redis_1.default.get("portfolio:realized_pnl");
        return val ? parseFloat(val) : 0.0;
    }
    static async setRealizedPnl(amount) {
        await redis_1.default.set("portfolio:realized_pnl", String(amount));
    }
    static async loadPositions(positionsList) {
        this.positions = {};
        for (const pos of positionsList) {
            this.positions[pos.symbol] = {
                quantity: pos.quantity,
                average_price: pos.average_price,
                stop_loss: pos.stop_loss,
                take_profit: pos.take_profit,
            };
        }
        logger_1.logger.info(`Loaded ${positionsList.length} positions into memory.`);
    }
    static async updatePosition(symbol, side, quantity, price) {
        const currentPosition = this.positions[symbol];
        let cash = await this.getCashBalance();
        let pnl = await this.getRealizedPnl();
        if (side === "BUY") {
            cash -= (quantity * price);
            this.positions[symbol] = {
                quantity,
                average_price: price,
                stop_loss: price * 0.98,
                take_profit: price * 1.03,
            };
            await this.setCashBalance(cash);
        }
        else if (side === "SELL" && currentPosition) {
            const tradePnl = (price - currentPosition.average_price) * quantity;
            pnl += tradePnl;
            cash += (quantity * price);
            delete this.positions[symbol];
            await this.setRealizedPnl(pnl);
            await this.setCashBalance(cash);
            logger_1.logger.info(`Trade Closed. PnL=${tradePnl}`);
        }
        logger_1.logger.info(`Portfolio Updated: Cash=${cash}`);
    }
}
exports.PortfolioManager = PortfolioManager;
exports.default = PortfolioManager;

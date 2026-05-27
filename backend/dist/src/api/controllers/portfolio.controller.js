"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioController = void 0;
const positionService_1 = require("../../services/positionService");
const portfolioManager_1 = require("../../trading/portfolio/portfolioManager");
const logger_1 = require("../../core/logger");
class PortfolioController {
    static async getPortfolio(req, res) {
        try {
            const positions = await positionService_1.PositionService.getAllPositions();
            const positionsDict = {};
            for (const pos of positions) {
                positionsDict[pos.symbol] = {
                    quantity: pos.quantity,
                    average_price: pos.average_price,
                    stop_loss: pos.stop_loss,
                    take_profit: pos.take_profit,
                    unrealized_pnl: pos.unrealized_pnl,
                };
            }
            const cashBalance = await portfolioManager_1.PortfolioManager.getCashBalance();
            const realizedPnl = await portfolioManager_1.PortfolioManager.getRealizedPnl();
            return res.json({
                cash_balance: cashBalance,
                positions: positionsDict,
                realized_pnl: realizedPnl,
            });
        }
        catch (err) {
            logger_1.logger.error(`Error in /portfolio: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.PortfolioController = PortfolioController;

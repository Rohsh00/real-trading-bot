"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FyersBroker = void 0;
const axios_1 = __importDefault(require("axios"));
const baseBroker_1 = require("./baseBroker");
const config_1 = require("../../core/config");
const logger_1 = require("../../core/logger");
const redis_1 = __importDefault(require("../../core/redis"));
class FyersBroker extends baseBroker_1.BaseBroker {
    async getAuthHeaders() {
        const tokenDataRaw = await redis_1.default.get("fyers_access_token");
        if (!tokenDataRaw) {
            throw new Error("Fyers access token not found. Please login via /api/v1/broker/fyers/login");
        }
        const tokenData = JSON.parse(tokenDataRaw);
        const accessToken = tokenData.access_token;
        return {
            "Authorization": `${config_1.settings.FYERS_APP_ID}:${accessToken}`,
            "Content-Type": "application/json",
        };
    }
    async placeOrder(symbol, side, quantity, price) {
        const headers = await this.getAuthHeaders();
        const fyersSide = side.toUpperCase() === "BUY" ? 1 : -1;
        const data = {
            symbol,
            qty: Math.floor(quantity),
            type: 2, // Limit order
            side: fyersSide,
            productType: "INTRADAY",
            limitPrice: price,
            stopPrice: 0,
            validity: "DAY",
            disclosedQty: 0,
            offlineOrder: false,
        };
        try {
            const response = await axios_1.default.post("https://api-t1.fyers.in/api/v3/orders", data, { headers });
            if (response.data.s !== "ok") {
                logger_1.logger.error(`Fyers order failed: ${JSON.stringify(response.data)}`);
                throw new Error(`Fyers Order Failed: ${response.data.message}`);
            }
            const orderId = response.data.id;
            const order = {
                order_id: orderId,
                symbol,
                side,
                quantity,
                price,
                status: "SUBMITTED",
            };
            logger_1.logger.info(`Fyers Order Placed: ${JSON.stringify(order)}`);
            return order;
        }
        catch (err) {
            logger_1.logger.error(`Fyers Place Order exception: ${err.message}`);
            throw err;
        }
    }
    async cancelOrder(orderId) {
        const headers = await this.getAuthHeaders();
        try {
            const response = await axios_1.default.delete("https://api-t1.fyers.in/api/v3/orders", {
                headers,
                data: { id: orderId },
            });
            if (response.data.s !== "ok") {
                logger_1.logger.error(`Fyers cancel failed: ${JSON.stringify(response.data)}`);
                throw new Error(`Fyers Cancel Failed: ${response.data.message}`);
            }
            logger_1.logger.info(`Fyers Order Cancelled: ${orderId}`);
        }
        catch (err) {
            logger_1.logger.error(`Fyers Cancel Order exception: ${err.message}`);
            throw err;
        }
    }
    async getPositions() {
        const headers = await this.getAuthHeaders();
        try {
            const response = await axios_1.default.get("https://api-t1.fyers.in/api/v3/positions", { headers });
            if (response.data.s !== "ok") {
                throw new Error(`Failed to fetch Fyers positions: ${response.data.message}`);
            }
            const fyersPositions = response.data.netPositions || [];
            return fyersPositions.map((p) => {
                const qty = p.netQty || 0;
                let side = "CLOSED";
                if (qty > 0)
                    side = "BUY";
                else if (qty < 0)
                    side = "SELL";
                return {
                    symbol: p.symbol,
                    quantity: Math.abs(qty),
                    side,
                    average_price: p.avgPrice,
                };
            });
        }
        catch (err) {
            logger_1.logger.error(`Fyers getPositions exception: ${err.message}`);
            throw err;
        }
    }
    async getBalance() {
        const headers = await this.getAuthHeaders();
        try {
            const response = await axios_1.default.get("https://api-t1.fyers.in/api/v3/funds", { headers });
            if (response.data.s !== "ok") {
                throw new Error(`Failed to fetch Fyers funds: ${response.data.message}`);
            }
            const fundLimits = response.data.fund_limit || [];
            let availableBalance = 0.0;
            for (const fund of fundLimits) {
                if (fund.title === "Available Balance") {
                    availableBalance = fund.equityAmount || 0.0;
                    break;
                }
            }
            return {
                balance: availableBalance,
            };
        }
        catch (err) {
            logger_1.logger.error(`Fyers getBalance exception: ${err.message}`);
            throw err;
        }
    }
}
exports.FyersBroker = FyersBroker;
baseBroker_1.BaseBroker.register("fyers", FyersBroker);
exports.default = FyersBroker;

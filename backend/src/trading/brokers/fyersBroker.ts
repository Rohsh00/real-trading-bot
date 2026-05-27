import axios from "axios";
import { BaseBroker } from "./baseBroker";
import { settings } from "../../core/config";
import { logger } from "../../core/logger";
import redisClient from "../../core/redis";

export class FyersBroker extends BaseBroker {
  private async getAuthHeaders() {
    const tokenDataRaw = await redisClient.get("fyers_access_token");
    if (!tokenDataRaw) {
      throw new Error("Fyers access token not found. Please login via /api/v1/broker/fyers/login");
    }
    const tokenData = JSON.parse(tokenDataRaw);
    const accessToken = tokenData.access_token;

    return {
      "Authorization": `${settings.FYERS_APP_ID}:${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  async placeOrder(symbol: string, side: string, quantity: number, price: number): Promise<any> {
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
      const response = await axios.post("https://api-t1.fyers.in/api/v3/orders", data, { headers });
      if (response.data.s !== "ok") {
        logger.error(`Fyers order failed: ${JSON.stringify(response.data)}`);
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

      logger.info(`Fyers Order Placed: ${JSON.stringify(order)}`);
      return order;
    } catch (err: any) {
      logger.error(`Fyers Place Order exception: ${err.message}`);
      throw err;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    try {
      const response = await axios.delete("https://api-t1.fyers.in/api/v3/orders", {
        headers,
        data: { id: orderId },
      });
      if (response.data.s !== "ok") {
        logger.error(`Fyers cancel failed: ${JSON.stringify(response.data)}`);
        throw new Error(`Fyers Cancel Failed: ${response.data.message}`);
      }
      logger.info(`Fyers Order Cancelled: ${orderId}`);
    } catch (err: any) {
      logger.error(`Fyers Cancel Order exception: ${err.message}`);
      throw err;
    }
  }

  async getPositions(): Promise<any[]> {
    const headers = await this.getAuthHeaders();
    try {
      const response = await axios.get("https://api-t1.fyers.in/api/v3/positions", { headers });
      if (response.data.s !== "ok") {
        throw new Error(`Failed to fetch Fyers positions: ${response.data.message}`);
      }

      const fyersPositions = response.data.netPositions || [];
      return fyersPositions.map((p: any) => {
        const qty = p.netQty || 0;
        let side = "CLOSED";
        if (qty > 0) side = "BUY";
        else if (qty < 0) side = "SELL";

        return {
          symbol: p.symbol,
          quantity: Math.abs(qty),
          side,
          average_price: p.avgPrice,
        };
      });
    } catch (err: any) {
      logger.error(`Fyers getPositions exception: ${err.message}`);
      throw err;
    }
  }

  async getBalance(): Promise<{ balance: number }> {
    const headers = await this.getAuthHeaders();
    try {
      const response = await axios.get("https://api-t1.fyers.in/api/v3/funds", { headers });
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
    } catch (err: any) {
      logger.error(`Fyers getBalance exception: ${err.message}`);
      throw err;
    }
  }
}

BaseBroker.register("fyers", FyersBroker);
export default FyersBroker;

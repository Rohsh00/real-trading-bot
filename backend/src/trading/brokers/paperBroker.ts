import { randomUUID } from "crypto";
import { BaseBroker } from "./baseBroker";
import { logger } from "../../core/logger";

export class PaperBroker extends BaseBroker {
  async placeOrder(symbol: string, side: string, quantity: number, price: number): Promise<any> {
    const order = {
      order_id: randomUUID(),
      symbol,
      side,
      quantity,
      price,
      status: "FILLED",
    };

    logger.info(`Paper Order Filled: ${JSON.stringify(order)}`);
    return order;
  }

  async cancelOrder(orderId: string): Promise<void> {
    logger.info(`Paper Order Cancelled: ${orderId}`);
  }

  async getPositions(): Promise<any[]> {
    return [];
  }

  async getBalance(): Promise<{ balance: number }> {
    return {
      balance: 100000.0,
    };
  }
}

BaseBroker.register("paper", PaperBroker);
export default PaperBroker;

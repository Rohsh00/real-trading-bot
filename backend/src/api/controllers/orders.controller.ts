import { Request, Response } from "express";
import { OrderRepository } from "../../repositories/orderRepository";
import { logger } from "../../core/logger";

export class OrdersController {
  static async getRecent(req: Request, res: Response) {
    const limit = parseInt((req.query.limit as string) || "20", 10);
    try {
      const orders = await OrderRepository.getRecent(limit);
      return res.json(
        orders.map((o) => ({
          id: o.id,
          symbol: o.symbol,
          side: o.side,
          order_type: o.order_type,
          quantity: o.quantity,
          price: o.price,
          status: o.status,
          created_at: o.created_at.toISOString(),
        }))
      );
    } catch (err: any) {
      logger.error(`Error in /orders/recent: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
}

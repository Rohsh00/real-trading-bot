import { prisma } from "../core/database";
import { Order } from "@prisma/client";

export class OrderRepository {
  static async create(data: {
    id: string;
    symbol: string;
    side: string;
    order_type: string;
    quantity: number;
    price: number;
    status: string;
    exchange_order_id?: string | null;
  }): Promise<Order> {
    return prisma.order.create({
      data,
    });
  }

  static async getById(orderId: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
  }

  static async getRecent(limit: number = 20): Promise<Order[]> {
    return prisma.order.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });
  }
}
export default OrderRepository;

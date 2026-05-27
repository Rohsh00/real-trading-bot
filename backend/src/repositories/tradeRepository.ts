import { prisma } from "../core/database";
import { Trade } from "@prisma/client";

export class TradeRepository {
  static async create(data: {
    id: string;
    order_id: string;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
  }): Promise<Trade> {
    return prisma.trade.create({
      data,
    });
  }
}
export default TradeRepository;

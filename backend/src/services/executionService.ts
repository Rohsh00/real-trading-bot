import { randomUUID } from "crypto";
import { OrderRepository } from "../repositories/orderRepository";
import { TradeRepository } from "../repositories/tradeRepository";
import { PositionService } from "./positionService";
import { AuditService } from "./auditService";

export class ExecutionService {
  static async persistExecution(executionResult: {
    symbol: string;
    side: string;
    quantity: number;
    price: number;
  }) {
    const orderId = randomUUID();
    const order = await OrderRepository.create({
      id: orderId,
      symbol: executionResult.symbol,
      side: executionResult.side,
      order_type: "MARKET",
      quantity: executionResult.quantity,
      price: executionResult.price,
      status: "FILLED",
    });

    const tradeId = randomUUID();
    await TradeRepository.create({
      id: tradeId,
      order_id: order.id,
      symbol: executionResult.symbol,
      side: executionResult.side,
      quantity: executionResult.quantity,
      price: executionResult.price,
    });

    const side = executionResult.side;
    const symbol = executionResult.symbol;
    const price = executionResult.price;
    const quantity = executionResult.quantity;

    if (side === "BUY") {
      await PositionService.createPosition(
        symbol,
        quantity,
        price,
        price * 0.98,
        price * 1.03
      );
      await AuditService.logEvent(
        "POSITION",
        "POSITION_OPENED",
        symbol,
        { side, quantity, price }
      );
    } else if (side === "SELL") {
      await PositionService.closePosition(symbol);
      await AuditService.logEvent(
        "POSITION",
        "POSITION_CLOSED",
        symbol,
        { side, quantity, price }
      );
    }

    await AuditService.logEvent(
      "EXECUTION",
      "ORDER_FILLED",
      order.id,
      executionResult
    );

    return order;
  }
}
export default ExecutionService;

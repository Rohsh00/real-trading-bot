import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/core/database";
import { redisClient } from "../src/core/redis";
import { PositionService } from "../src/services/positionService";
import { ExecutionService } from "../src/services/executionService";
import { randomUUID } from "crypto";

describe("Integration Tests", () => {
  afterAll(async () => {
    // Close DB and Redis connections
    await prisma.$disconnect();
    await redisClient.quit();
  });

  test("GET /api/v1/health should return health check results", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("healthy");
    expect(res.body.components.database).toBe("connected");
  });

  test("GET /api/v1/backtest should run a sample backtest", async () => {
    const res = await request(app).get("/api/v1/backtest");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total_trades");
    expect(res.body).toHaveProperty("final_balance");
  });

  test("Strategies API Lifecycle", async () => {
    const uniqueName = `Test Strategy ${randomUUID()}`;
    const payload = {
      name: uniqueName,
      description: "Integration test strategy",
      config: { ema_short: 10, ema_long: 21 },
    };

    // 1. Create Strategy
    const createRes = await request(app)
      .post("/api/v1/strategies")
      .send(payload);
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe(uniqueName);
    expect(createRes.body.is_active).toBe(true);

    const strategyId = createRes.body.id;

    // 2. List Strategies
    const listRes = await request(app).get("/api/v1/strategies");
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((s: any) => s.name === uniqueName)).toBe(true);

    // 3. Delete Strategy
    const deleteRes = await request(app).delete(`/api/v1/strategies/${strategyId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Strategy deleted successfully");
  });

  test("Candles API Retrieval", async () => {
    const symbol = `TESTBTC_${randomUUID().substring(0, 6)}`;
    const timeframe = "1h";
    const timestamp = new Date();

    // Insert dummy candle directly
    await prisma.candle.create({
      data: {
        id: randomUUID(),
        symbol,
        timeframe,
        timestamp,
        open: 50000.0,
        high: 51000.0,
        low: 49000.0,
        close: 50500.0,
        volume: 10.5,
      },
    });

    // Call REST endpoint
    const res = await request(app)
      .get("/api/v1/candles")
      .query({ symbol, timeframe, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].symbol).toBe(symbol);
    expect(res.body[0].timeframe).toBe(timeframe);

    // Cleanup
    await prisma.candle.deleteMany({ where: { symbol } });
  });

  test("Portfolio Positions Lifecycle", async () => {
    const symbol = `TESTPOS_${randomUUID().substring(0, 6)}`;

    // 1. Ensure position is clean
    await PositionService.closePosition(symbol);

    // Check starting state
    let portfolioRes = await request(app).get("/api/v1/portfolio");
    expect(portfolioRes.status).toBe(200);
    expect(portfolioRes.body.positions).not.toHaveProperty(symbol);

    // 2. Simulate BUY execution
    const buyResult = {
      symbol,
      side: "BUY",
      quantity: 0.05,
      price: 1000.0,
    };
    await ExecutionService.persistExecution(buyResult);

    // 3. Verify positions table holds BUY
    const pos = await PositionService.getPosition(symbol);
    expect(pos).not.toBeNull();
    expect(pos?.quantity).toBe(0.05);
    expect(pos?.average_price).toBe(1000.0);

    // Check via handler
    portfolioRes = await request(app).get("/api/v1/portfolio");
    expect(portfolioRes.body.positions).toHaveProperty(symbol);
    expect(portfolioRes.body.positions[symbol].quantity).toBe(0.05);
    expect(portfolioRes.body.positions[symbol].average_price).toBe(1000.0);

    // 4. Simulate SELL execution
    const sellResult = {
      symbol,
      side: "SELL",
      quantity: 0.05,
      price: 1050.0,
    };
    await ExecutionService.persistExecution(sellResult);

    // 5. Verify positions table is empty again
    const posAfterSell = await PositionService.getPosition(symbol);
    expect(posAfterSell).toBeNull();

    // Check via handler
    portfolioRes = await request(app).get("/api/v1/portfolio");
    expect(portfolioRes.body.positions).not.toHaveProperty(symbol);
  });
});

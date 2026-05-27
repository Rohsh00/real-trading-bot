import { Router } from "express";
import { healthRouter } from "./health.routes";
import { candlesRouter } from "./candles.routes";
import { backtestRouter } from "./backtest.routes";
import { strategiesRouter } from "./strategies.routes";
import { portfolioRouter } from "./portfolio.routes";
import { signalsRouter } from "./signals.routes";
import { ordersRouter } from "./orders.routes";
import { brokerRouter } from "./broker.routes";
import { riskRouter } from "./risk.routes";
import { auditRouter } from "./audit.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/candles", candlesRouter);
apiRouter.use("/backtest", backtestRouter);
apiRouter.use("/strategies", strategiesRouter);
apiRouter.use("/portfolio", portfolioRouter);
apiRouter.use("/signals", signalsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/broker", brokerRouter);
apiRouter.use("/risk", riskRouter);
apiRouter.use("/audit", auditRouter);

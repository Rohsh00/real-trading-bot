import { Router } from "express";
import { BacktestController } from "../controllers/backtest.controller";

export const backtestRouter = Router();

backtestRouter.get("/", BacktestController.runBacktest);

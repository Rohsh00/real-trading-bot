import { Router } from "express";
import { CandlesController } from "../controllers/candles.controller";

export const candlesRouter = Router();

candlesRouter.get("/", CandlesController.getCandles);

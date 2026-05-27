import { Router } from "express";
import { RiskController } from "../controllers/risk.controller";

export const riskRouter = Router();

riskRouter.get("/", RiskController.getSettings);
riskRouter.put("/", RiskController.updateSettings);

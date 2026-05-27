import { Router } from "express";
import { StrategiesController } from "../controllers/strategies.controller";

export const strategiesRouter = Router();

strategiesRouter.post("/", StrategiesController.createStrategy);
strategiesRouter.get("/", StrategiesController.listStrategies);
strategiesRouter.put("/:strategy_id", StrategiesController.updateStrategy);
strategiesRouter.delete("/:strategy_id", StrategiesController.deleteStrategy);

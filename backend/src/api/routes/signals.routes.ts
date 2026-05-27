import { Router } from "express";
import { SignalsController } from "../controllers/signals.controller";

export const signalsRouter = Router();

signalsRouter.get("/recent", SignalsController.getRecent);

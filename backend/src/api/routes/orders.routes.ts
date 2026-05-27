import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";

export const ordersRouter = Router();

ordersRouter.get("/recent", OrdersController.getRecent);

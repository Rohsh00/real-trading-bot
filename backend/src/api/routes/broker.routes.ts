import { Router } from "express";
import { BrokerController } from "../controllers/broker.controller";

export const brokerRouter = Router();

brokerRouter.get("/status", BrokerController.getStatus);
brokerRouter.get("/fyers/login", BrokerController.getFyersLogin);
brokerRouter.get("/fyers/callback", BrokerController.getFyersCallback);

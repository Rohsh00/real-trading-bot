"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brokerRouter = void 0;
const express_1 = require("express");
const broker_controller_1 = require("../controllers/broker.controller");
exports.brokerRouter = (0, express_1.Router)();
exports.brokerRouter.get("/status", broker_controller_1.BrokerController.getStatus);
exports.brokerRouter.get("/fyers/login", broker_controller_1.BrokerController.getFyersLogin);
exports.brokerRouter.get("/fyers/callback", broker_controller_1.BrokerController.getFyersCallback);

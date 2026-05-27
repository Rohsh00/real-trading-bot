"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRouter = void 0;
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
exports.ordersRouter = (0, express_1.Router)();
exports.ordersRouter.get("/recent", orders_controller_1.OrdersController.getRecent);

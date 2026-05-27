"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backtestRouter = void 0;
const express_1 = require("express");
const backtest_controller_1 = require("../controllers/backtest.controller");
exports.backtestRouter = (0, express_1.Router)();
exports.backtestRouter.get("/", backtest_controller_1.BacktestController.runBacktest);

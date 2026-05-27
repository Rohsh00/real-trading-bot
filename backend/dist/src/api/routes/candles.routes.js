"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candlesRouter = void 0;
const express_1 = require("express");
const candles_controller_1 = require("../controllers/candles.controller");
exports.candlesRouter = (0, express_1.Router)();
exports.candlesRouter.get("/", candles_controller_1.CandlesController.getCandles);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signalsRouter = void 0;
const express_1 = require("express");
const signals_controller_1 = require("../controllers/signals.controller");
exports.signalsRouter = (0, express_1.Router)();
exports.signalsRouter.get("/recent", signals_controller_1.SignalsController.getRecent);

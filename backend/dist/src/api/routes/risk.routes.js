"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskRouter = void 0;
const express_1 = require("express");
const risk_controller_1 = require("../controllers/risk.controller");
exports.riskRouter = (0, express_1.Router)();
exports.riskRouter.get("/", risk_controller_1.RiskController.getSettings);
exports.riskRouter.put("/", risk_controller_1.RiskController.updateSettings);

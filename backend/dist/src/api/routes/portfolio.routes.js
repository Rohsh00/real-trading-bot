"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioRouter = void 0;
const express_1 = require("express");
const portfolio_controller_1 = require("../controllers/portfolio.controller");
exports.portfolioRouter = (0, express_1.Router)();
exports.portfolioRouter.get("/", portfolio_controller_1.PortfolioController.getPortfolio);

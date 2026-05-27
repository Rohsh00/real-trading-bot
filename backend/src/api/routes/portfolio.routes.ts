import { Router } from "express";
import { PortfolioController } from "../controllers/portfolio.controller";

export const portfolioRouter = Router();

portfolioRouter.get("/", PortfolioController.getPortfolio);

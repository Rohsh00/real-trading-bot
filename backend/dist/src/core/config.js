"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.settings = {
    APP_NAME: process.env.APP_NAME || "Trading Bot API",
    APP_VERSION: process.env.APP_VERSION || "1.0.0",
    API_HOST: process.env.API_HOST || "0.0.0.0",
    API_PORT: parseInt(process.env.API_PORT || "8000", 10),
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://trader:traderpass@localhost:5432/tradingbot",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
    REDIS_DB: parseInt(process.env.REDIS_DB || "0", 10),
    BINANCE_WS_BASE_URL: process.env.BINANCE_WS_BASE_URL || "wss://stream.binance.com:443",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    FYERS_APP_ID: process.env.FYERS_APP_ID || "",
    FYERS_SECRET_KEY: process.env.FYERS_SECRET_KEY || "",
    FYERS_REDIRECT_URI: process.env.FYERS_REDIRECT_URI || "http://localhost:8000/api/v1/broker/fyers/callback",
    PAPER_TRADING: process.env.PAPER_TRADING === "true",
    DEBUG: process.env.DEBUG === "true",
};

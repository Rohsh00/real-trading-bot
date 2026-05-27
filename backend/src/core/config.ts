import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Helper to resolve workspace paths (supporting workspace package subdirectory vs workspace root)
export function resolveWorkspacePath(relativePath: string): string {
  let attemptPath = path.resolve(process.cwd(), relativePath);
  if (fs.existsSync(attemptPath)) {
    return attemptPath;
  }
  attemptPath = path.resolve(process.cwd(), "..", relativePath);
  if (fs.existsSync(attemptPath)) {
    return attemptPath;
  }
  return path.resolve(process.cwd(), relativePath);
}

// Load environment variables from .env file
dotenv.config({ path: resolveWorkspacePath(".env") });

export const settings = {
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

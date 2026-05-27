import winston from "winston";
import { settings } from "./config";

const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  if (Object.keys(metadata).length > 0 && level === "error" && metadata.stack) {
    msg += `\n${metadata.stack}`;
  } else if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: settings.LOG_LEVEL.toLowerCase(),
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

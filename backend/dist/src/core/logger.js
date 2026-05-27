"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("./config");
const logFormat = winston_1.default.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(metadata).length > 0 && level === "error" && metadata.stack) {
        msg += `\n${metadata.stack}`;
    }
    else if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
exports.logger = winston_1.default.createLogger({
    level: config_1.settings.LOG_LEVEL.toLowerCase(),
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.metadata({ fillExcept: ["message", "level", "timestamp"] }), logFormat),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
        }),
    ],
});

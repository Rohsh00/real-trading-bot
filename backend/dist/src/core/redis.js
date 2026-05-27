"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const logger_1 = require("./logger");
exports.redisClient = new ioredis_1.default({
    host: config_1.settings.REDIS_HOST,
    port: config_1.settings.REDIS_PORT,
    db: config_1.settings.REDIS_DB,
});
exports.redisClient.on("connect", () => {
    logger_1.logger.info("Connected to Redis successfully");
});
exports.redisClient.on("error", (err) => {
    logger_1.logger.error("Redis connection error", { error: err.message });
});
const createRedisClient = () => {
    return new ioredis_1.default({
        host: config_1.settings.REDIS_HOST,
        port: config_1.settings.REDIS_PORT,
        db: config_1.settings.REDIS_DB,
    });
};
exports.createRedisClient = createRedisClient;
exports.default = exports.redisClient;

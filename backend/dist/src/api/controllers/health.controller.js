"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const os_1 = __importDefault(require("os"));
const redis_1 = require("../../core/redis");
const database_1 = require("../../core/database");
class HealthController {
    static async getHealth(req, res) {
        const componentsStatus = {
            redis: "unknown",
            database: "unknown",
        };
        let isHealthy = true;
        // Check Redis
        try {
            const pong = await redis_1.redisClient.ping();
            if (pong === "PONG") {
                componentsStatus.redis = "connected";
            }
            else {
                componentsStatus.redis = "unresponsive";
                isHealthy = false;
            }
        }
        catch (err) {
            componentsStatus.redis = "disconnected";
            isHealthy = false;
        }
        // Check Database
        try {
            await database_1.prisma.$executeRawUnsafe("SELECT 1");
            componentsStatus.database = "connected";
        }
        catch (err) {
            componentsStatus.database = "disconnected";
            isHealthy = false;
        }
        // Cross-platform Memory info
        const total = os_1.default.totalmem();
        const free = os_1.default.freemem();
        const used = total - free;
        const memoryInfo = {
            total_mb: Math.floor(total / 1024 / 1024),
            used_mb: Math.floor(used / 1024 / 1024),
            available_mb: Math.floor(free / 1024 / 1024),
        };
        const responseData = {
            success: isHealthy,
            service: "trading-bot",
            status: isHealthy ? "healthy" : "unhealthy",
            components: componentsStatus,
            memory: memoryInfo,
        };
        if (!isHealthy) {
            return res.status(503).json(responseData);
        }
        return res.json(responseData);
    }
}
exports.HealthController = HealthController;

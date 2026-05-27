"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalsController = void 0;
const redis_1 = require("../../core/redis");
const logger_1 = require("../../core/logger");
class SignalsController {
    static async getRecent(req, res) {
        const limit = parseInt(req.query.limit || "20", 10);
        try {
            const raw = await redis_1.redisClient.lrange("signals_log", 0, limit - 1);
            const signals = raw.map((item) => JSON.parse(item));
            return res.json(signals);
        }
        catch (err) {
            logger_1.logger.error(`Error fetching recent signals: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.SignalsController = SignalsController;

import { Request, Response } from "express";
import os from "os";
import { redisClient } from "../../core/redis";
import { prisma } from "../../core/database";

export class HealthController {
  static async getHealth(req: Request, res: Response) {
    const componentsStatus = {
      redis: "unknown",
      database: "unknown",
    };
    let isHealthy = true;

    // Check Redis
    try {
      const pong = await redisClient.ping();
      if (pong === "PONG") {
        componentsStatus.redis = "connected";
      } else {
        componentsStatus.redis = "unresponsive";
        isHealthy = false;
      }
    } catch (err) {
      componentsStatus.redis = "disconnected";
      isHealthy = false;
    }

    // Check Database
    try {
      await prisma.$executeRawUnsafe("SELECT 1");
      componentsStatus.database = "connected";
    } catch (err) {
      componentsStatus.database = "disconnected";
      isHealthy = false;
    }

    // Cross-platform Memory info
    const total = os.totalmem();
    const free = os.freemem();
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

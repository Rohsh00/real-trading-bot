import Redis from "ioredis";
import { settings } from "./config";
import { logger } from "./logger";

export const redisClient = new Redis({
  host: settings.REDIS_HOST,
  port: settings.REDIS_PORT,
  db: settings.REDIS_DB,
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis successfully");
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error", { error: err.message });
});

export const createRedisClient = () => {
  return new Redis({
    host: settings.REDIS_HOST,
    port: settings.REDIS_PORT,
    db: settings.REDIS_DB,
  });
};
export default redisClient;

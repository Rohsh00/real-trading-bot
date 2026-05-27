import { Request, Response, NextFunction } from "express";
import { logger } from "../../core/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
};

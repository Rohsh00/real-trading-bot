"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = require("../../core/logger");
const loggerMiddleware = (req, res, next) => {
    logger_1.logger.debug(`${req.method} ${req.path}`);
    next();
};
exports.loggerMiddleware = loggerMiddleware;

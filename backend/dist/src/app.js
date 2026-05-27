"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_middleware_1 = require("./api/middlewares/logger.middleware");
const routes_1 = require("./api/routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logger_middleware_1.loggerMiddleware);
// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Trading Bot API Running",
    });
});
// Mount API router
app.use("/api/v1", routes_1.apiRouter);
exports.default = app;

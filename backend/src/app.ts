import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./api/middlewares/logger.middleware";
import { apiRouter } from "./api/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Trading Bot API Running",
  });
});

// Mount API router
app.use("/api/v1", apiRouter);

export { app };
export default app;

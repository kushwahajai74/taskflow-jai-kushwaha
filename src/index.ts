import express from "express";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server ready at http://localhost:${env.PORT}`);
});

const shutdown = () => {
  logger.info("Graceful shutdown initiated...");
  server.close(() => {
    logger.info("Server closed. Process exiting.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

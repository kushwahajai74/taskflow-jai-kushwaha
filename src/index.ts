import express from "express";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

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

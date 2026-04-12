import app from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server ready at http://localhost:${env.PORT}/health`);
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

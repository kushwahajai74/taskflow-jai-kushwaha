import knex from "knex";
import config from "../knexfile";
import { logger } from "./logger";

const db = knex(config);

// Verify connection
db.raw("SELECT 1")
  .then(() => {
    logger.info("✅ Database connected successfully");
  })
  .catch((err) => {
    logger.error(err, "❌ Database connection failed");
    process.exit(1);
  });

export default db;

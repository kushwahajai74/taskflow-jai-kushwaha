import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../lib/errors";
import { logger } from "../lib/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (err instanceof ZodError) {
    const fields = Object.fromEntries(
      err.issues
        .filter((e) => e.path?.[0])
        .map((e) => [String(e.path[0]), e.message])
    );

    return res.status(400).json({
      error: "validation_failed",
      fields,
    });
  }

  // Fallback to 500
  return res.status(500).json({
    error: "Internal server error",
  });
};

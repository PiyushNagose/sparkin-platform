import { ZodError } from "zod";
import {
  isDatabaseConnectivityError,
  markDatabaseUnhealthy,
} from "../database/database-health.js";
import { AppError } from "../errors/app-error.js";
import { logger } from "../utils/logger.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.flatten(),
      requestId: req.requestId,
    });
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error("Application error", {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: error.statusCode,
        message: error.message,
      });
    }
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null,
      requestId: req.requestId,
    });
  }

  if (isDatabaseConnectivityError(error)) {
    markDatabaseUnhealthy(error);

    logger.error("Database connectivity error", {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      error: error.message,
    });

    return res.status(503).json({
      message:
        "Database is unavailable. Check MongoDB connection and Atlas network access.",
      requestId: req.requestId,
    });
  }

  logger.error("Unhandled error", {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    error: error.message,
    stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
  });

  return res.status(500).json({
    message: "Internal server error",
    requestId: req.requestId,
  });
}

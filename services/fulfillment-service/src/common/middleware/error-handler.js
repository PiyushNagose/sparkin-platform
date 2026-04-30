import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

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
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null,
      requestId: req.requestId,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    requestId: req.requestId,
  });
}

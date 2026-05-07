import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export function requestContext(req, res, next) {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);

  const startMs = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - startMs;
    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    logger[level](`${req.method} ${req.path}`, {
      requestId: req.requestId,
      status: res.statusCode,
      ms,
    });
  });

  next();
}

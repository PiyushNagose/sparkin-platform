import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { errorHandler } from "./common/middleware/error-handler.js";
import { notFoundHandler } from "./common/middleware/not-found-handler.js";
import { requestContext } from "./common/middleware/request-context.js";
import { env } from "./config/env.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(io) {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.use(requestContext);

  app.get("/health", (req, res) => {
    res.status(200).json({
      service: env.serviceName,
      status: "ok",
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/v1", createApiRouter(io));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

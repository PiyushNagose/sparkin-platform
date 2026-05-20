import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/logger.js";
import { requestId } from "./middleware/request-id.js";
import { createRouter } from "./routes/index.js";
import { createGatewayRefreshMiddleware } from "./websocket.js";

export function createApp({ socketServer } = {}) {
  const app = express();

  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    }),
  );

  // Keep request bodies untouched so proxied POST/PATCH uploads and auth
  // requests stream cleanly to downstream services.

  // Request tracking
  app.use(requestId);
  app.use(requestLogger);

  if (socketServer) {
    app.use(createGatewayRefreshMiddleware(socketServer));
  }

  // All routes
  app.use(createRouter());

  return app;
}

import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { env } from "./config/env.js";
import { errorHandler } from "./common/middleware/error-handler.js";
import { notFoundHandler } from "./common/middleware/not-found-handler.js";
import { requestContext } from "./common/middleware/request-context.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.nodeEnv === "production" ? 1 : false);
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
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.resolve("uploads")));
  // If a requested avatar file doesn't exist, serve a tiny SVG placeholder
  app.use("/uploads/avatars/:file", (req, res, next) => {
    try {
      const filePath = path.resolve("uploads", "avatars", req.params.file);
      if (fs.existsSync(filePath)) return next();
    } catch (err) {
      // ignore filesystem errors and fallthrough to placeholder
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="100%" height="100%" fill="#F2F4F7"/>
  <g fill="#B8C2D3">
    <circle cx="128" cy="96" r="48" />
    <rect x="48" y="168" width="160" height="48" rx="8" />
  </g>
</svg>`;

    res.type("image/svg+xml").status(200).send(svg);
  });
  app.use(requestContext);

  app.get("/health", (req, res) => {
    res.status(200).json({
      service: env.serviceName,
      status: "ok",
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

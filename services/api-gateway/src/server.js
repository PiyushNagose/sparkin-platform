import { createApp } from "./app.js";
import { env } from "./config/env.js";

const isProd = env.NODE_ENV === "production";
const COLORS = { INFO: "\x1b[32m", WARN: "\x1b[33m", ERROR: "\x1b[31m" };
const RESET = "\x1b[0m";

function log(level, message, meta = {}) {
  const ts = new Date().toISOString();
  if (isProd) {
    process.stdout.write(
      JSON.stringify({
        ts,
        level: level.toLowerCase(),
        service: env.SERVICE_NAME,
        message,
        ...meta,
      }) + "\n",
    );
  } else {
    const color = COLORS[level] || "";
    const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
    process.stdout.write(
      `${color}[${level}]${RESET} ${ts} [${env.SERVICE_NAME}] ${message}${metaStr}\n`,
    );
  }
}

const app = createApp();

const server = app.listen(env.PORT, () => {
  log("INFO", "Service started", { port: env.PORT });
  log("INFO", "Routing to downstream services", {
    identity: env.IDENTITY_SERVICE_URL,
    business: env.BUSINESS_SERVICE_URL,
    fulfillment: env.FULFILLMENT_SERVICE_URL,
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    log("ERROR", "Port already in use", { port: env.PORT });
  } else {
    log("ERROR", "Server error", { error: error.message });
  }
  process.exit(1);
});

const shutdown = (signal) => {
  log("INFO", "Shutting down", { signal });
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

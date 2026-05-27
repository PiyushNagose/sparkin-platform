import { createServer } from "http";
import { createApp } from "./app.js";
import { createGatewaySocketServer } from "./websocket.js";
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

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

let shuttingDown = false;

function registerFatalHandlers(shutdown) {
  process.on("unhandledRejection", (reason) => {
    log("ERROR", "Unhandled promise rejection", {
      error: reason instanceof Error ? reason.message : String(reason),
    });
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    log("ERROR", "Uncaught exception", {
      error: error.message,
    });
    shutdown("uncaughtException");
  });
}

async function verifyDownstreamServices() {
  if (env.NODE_ENV !== "production") return;

  const services = [
    ["identity", env.IDENTITY_SERVICE_URL],
    ["business", env.BUSINESS_SERVICE_URL],
    ["fulfillment", env.FULFILLMENT_SERVICE_URL],
  ];

  const results = await Promise.allSettled(
    services.map(async ([name, baseUrl]) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(joinUrl(baseUrl, "/health"), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`health returned ${response.status}`);
        }
      } finally {
        clearTimeout(timeout);
      }

      return name;
    }),
  );

  const failed = results
    .map((result, index) => ({ result, service: services[index] }))
    .filter(({ result }) => result.status === "rejected")
    .map(({ result, service }) => ({
      name: service[0],
      url: joinUrl(service[1], "/health"),
      error: result.reason?.message || "unknown error",
    }));

  if (failed.length) {
    log("ERROR", "Downstream health check failed; refusing to start gateway", {
      failed,
    });
    process.exit(1);
  }
}

const server = createServer();
const io = createGatewaySocketServer(server);
const app = createApp({ socketServer: io });

server.on("request", app);
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 60_000;

await verifyDownstreamServices();

server.listen(env.PORT, () => {
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
  if (shuttingDown) return;
  shuttingDown = true;
  log("INFO", "Shutting down", { signal });
  const forceCloseTimer = setTimeout(() => {
    log("ERROR", "Forced shutdown after timeout", { signal });
    process.exit(1);
  }, 10_000);

  server.close(() => {
    clearTimeout(forceCloseTimer);
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
registerFatalHandlers(shutdown);

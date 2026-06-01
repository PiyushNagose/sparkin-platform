import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./common/utils/logger.js";

let shuttingDown = false;

function registerFatalHandlers(shutdown) {
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", {
      service: env.serviceName,
      error: reason instanceof Error ? reason.message : String(reason),
    });
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", {
      service: env.serviceName,
      error: error.message,
    });
    shutdown("uncaughtException");
  });
}

async function startServer() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info("Service started", {
      service: env.serviceName,
      port: env.port,
    });
  });
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;
  server.requestTimeout = 60_000;

  server.on("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      logger.error("Port already in use", {
        service: env.serviceName,
        port: env.port,
      });
    } else {
      logger.error("Server error", {
        service: env.serviceName,
        error: error.message,
      });
    }

    await disconnectDatabase();
    process.exit(1);
  });

  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info("Shutting down", { service: env.serviceName, signal });
    const forceCloseTimer = setTimeout(async () => {
      logger.error("Forced shutdown after timeout", {
        service: env.serviceName,
        signal,
      });
      await disconnectDatabase();
      process.exit(1);
    }, 10_000);

    server.close(async () => {
      clearTimeout(forceCloseTimer);
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  registerFatalHandlers(shutdown);
}

startServer().catch((error) => {
  console.error(
    `[${process.env.SERVICE_NAME || "identity-service"}] failed to start`,
    error,
  );
  process.exit(1);
});

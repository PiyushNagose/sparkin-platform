import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./common/utils/logger.js";

async function startServer() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info("Service started", {
      service: env.serviceName,
      port: env.port,
    });
  });

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
    logger.info("Shutting down", { service: env.serviceName, signal });
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error(
    `[${process.env.SERVICE_NAME || "identity-service"}] failed to start`,
    error,
  );
  process.exit(1);
});

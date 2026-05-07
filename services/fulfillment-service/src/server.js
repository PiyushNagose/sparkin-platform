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

  server.on("error", (error) => {
    logger.error("Server error", {
      service: env.serviceName,
      error: error.message,
    });
    process.exit(1);
  });

  async function shutdown(signal) {
    logger.info("Shutting down", { service: env.serviceName, signal });
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error(
    `[${process.env.SERVICE_NAME || "fulfillment-service"}] startup failed`,
    error,
  );
  process.exit(1);
});

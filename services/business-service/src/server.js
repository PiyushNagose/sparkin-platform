import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[${env.serviceName}] listening on port ${env.port}`);
  });

  server.on("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`[${env.serviceName}] port ${env.port} is already in use`);
    } else {
      console.error(`[${env.serviceName}] server error`, error);
    }

    await disconnectDatabase();
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`[${env.serviceName}] received ${signal}, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error(`[${env.serviceName}] failed to start`, error);
  process.exit(1);
});

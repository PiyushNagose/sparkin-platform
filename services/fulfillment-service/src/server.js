import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`${env.serviceName} listening on port ${env.port}`);
  });

  server.on("error", (error) => {
    console.error(`${env.serviceName} failed to start`, error);
    process.exit(1);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Shutting down ${env.serviceName}.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error(`${env.serviceName} startup failed`, error);
  process.exit(1);
});

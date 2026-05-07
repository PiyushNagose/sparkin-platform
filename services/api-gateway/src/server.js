import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`[${env.SERVICE_NAME}] listening on port ${env.PORT}`);
  console.log(`[${env.SERVICE_NAME}] routing to:`);
  console.log(`  identity   → ${env.IDENTITY_SERVICE_URL}`);
  console.log(`  business   → ${env.BUSINESS_SERVICE_URL}`);
  console.log(`  fulfillment → ${env.FULFILLMENT_SERVICE_URL}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[${env.SERVICE_NAME}] port ${env.PORT} is already in use`);
  } else {
    console.error(`[${env.SERVICE_NAME}] server error`, error);
  }
  process.exit(1);
});

const shutdown = (signal) => {
  console.log(`[${env.SERVICE_NAME}] received ${signal}, shutting down`);
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { attachChatSocket } from "./modules/chat/chat.socket.js";
import { logger } from "./common/utils/logger.js";

async function startServer() {
  await connectDatabase();

  // Create a bare http server first so Socket.io and Express share the same port
  const httpServer = createServer();

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
    path: "/socket.io",
  });

  // Attach socket handlers (uses io internally)
  attachChatSocket(io);

  // Create Express app with io injected so REST routes can emit socket events
  const app = createApp(io);

  // Attach Express to the http server
  httpServer.on("request", app);

  httpServer.listen(env.port, () => {
    logger.info("Service started", {
      service: env.serviceName,
      port: env.port,
      transport: "HTTP + WS",
    });
  });

  httpServer.on("error", async (error) => {
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
    httpServer.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error(
    `[${process.env.SERVICE_NAME || "business-service"}] failed to start`,
    error,
  );
  process.exit(1);
});

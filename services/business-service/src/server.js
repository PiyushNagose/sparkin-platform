import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { attachChatSocket } from "./modules/chat/chat.socket.js";
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
  httpServer.keepAliveTimeout = 65_000;
  httpServer.headersTimeout = 66_000;
  httpServer.requestTimeout = 60_000;

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

    httpServer.close(async () => {
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
    `[${process.env.SERVICE_NAME || "business-service"}] failed to start`,
    error,
  );
  process.exit(1);
});

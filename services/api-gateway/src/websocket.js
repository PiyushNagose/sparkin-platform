import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env.js";

const REFRESH_EXCLUDED_PREFIXES = ["/api/v1/chat"];
const REFRESH_DEBOUNCE_MS = 500;
const pendingRefreshEvents = new Map();

function shouldEmitRefresh(req) {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return false;
  }

  const path = (req.originalUrl || req.url || "").split("?")[0];
  return !REFRESH_EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function createGatewaySocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    transports: ["websocket", "polling"],
    pingInterval: 25_000,
    pingTimeout: 20_000,
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      return next(new Error("Unauthorized socket connection"));
    }

    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      socket.user = {
        userId: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      return next(new Error("Unauthorized socket connection"));
    }

    return next();
  });

  io.on("connection", (socket) => {
    socket.join("global");
    if (socket.user?.userId) {
      socket.join(`user:${socket.user.userId}`);
    }
  });

  return io;
}

export function createGatewayRefreshMiddleware(io) {
  return (req, res, next) => {
    if (!shouldEmitRefresh(req)) {
      return next();
    }

    const method = req.method.toUpperCase();
    let emitted = false;
    const emitRefresh = () => {
      if (emitted) return;
      emitted = true;

      if (res.statusCode >= 200 && res.statusCode < 400) {
        const payload = {
          path: req.originalUrl,
          method,
          timestamp: new Date().toISOString(),
        };
        const key = `${method}:${payload.path}`;

        if (pendingRefreshEvents.has(key)) {
          clearTimeout(pendingRefreshEvents.get(key));
        }

        pendingRefreshEvents.set(
          key,
          setTimeout(() => {
            pendingRefreshEvents.delete(key);
            io.to("global").emit("refresh:page", payload);
          }, REFRESH_DEBOUNCE_MS),
        );
      }
    };

    res.once("finish", emitRefresh);
    res.once("close", emitRefresh);

    next();
  };
}

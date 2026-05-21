import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env.js";

const REFRESH_EXCLUDED_PREFIXES = ["/api/v1/chat"];

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
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      socket.user = null;
      return next();
    }

    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      socket.user = {
        userId: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      socket.user = null;
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
        io.to("global").emit("refresh:page", {
          path: req.originalUrl,
          method,
          timestamp: new Date().toISOString(),
        });
      }
    };

    res.once("finish", emitRefresh);
    res.once("close", emitRefresh);

    next();
  };
}

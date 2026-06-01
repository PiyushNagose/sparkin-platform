import mongoose from "mongoose";

const DATABASE_RECOVERY_WINDOW_MS = 10_000;

let unhealthyUntil = 0;

const STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export function getDatabaseHealth() {
  const readyState = mongoose.connection.readyState;
  const state = STATE_LABELS[readyState] || "unknown";
  const recovering = readyState !== 1 && Date.now() < unhealthyUntil;

  return {
    status: readyState === 1 && !recovering ? "ok" : "unavailable",
    state,
    readyState,
    recovering,
  };
}

export function requireDatabase(req, res, next) {
  const database = getDatabaseHealth();

  if (database.status === "ok") {
    return next();
  }

  return res.status(503).json({
    message:
      "Database is unavailable. Check MongoDB connection and Atlas network access.",
    details: { database },
    requestId: req.requestId,
  });
}

export function isDatabaseConnectivityError(error) {
  const name = String(error?.name || "");
  const message = String(error?.message || "").toLowerCase();

  return (
    [
      "MongoNetworkError",
      "MongoNetworkTimeoutError",
      "MongoServerSelectionError",
      "MongooseServerSelectionError",
    ].includes(name) ||
    message.includes("server selection timed out") ||
    message.includes("timed out") ||
    message.includes("connection timed out") ||
    message.includes("network timeout") ||
    message.includes("buffering timed out") ||
    message.includes("before initial connection is complete")
  );
}

export function markDatabaseUnhealthy(error) {
  unhealthyUntil = Date.now() + DATABASE_RECOVERY_WINDOW_MS;
}

export function markDatabaseHealthy() {
  unhealthyUntil = 0;
}

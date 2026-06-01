import mongoose from "mongoose";
import {
  markDatabaseHealthy,
  markDatabaseUnhealthy,
} from "../common/database/database-health.js";
import { env } from "./env.js";

const DB_SOCKET_TIMEOUT_MS = 45_000;
const DB_RECONNECT_MS = 5_000;

let reconnectTimer = null;
let connectingPromise = null;
let reconnectEnabled = true;

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

function scheduleReconnect() {
  if (
    !reconnectEnabled ||
    reconnectTimer ||
    mongoose.connection.readyState === 1
  ) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connectDatabase({ throwOnFailure: false });
  }, DB_RECONNECT_MS);
}

mongoose.connection.on("disconnected", () => {
  scheduleReconnect();
});

mongoose.connection.on("connected", () => {
  markDatabaseHealthy();
});

mongoose.connection.on("error", (error) => {
  markDatabaseUnhealthy(error);
  console.error(`[${env.serviceName}] MongoDB error: ${error.message}`);
});

export async function connectDatabase({ throwOnFailure = true } = {}) {
  reconnectEnabled = true;

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = mongoose
    .connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 15_000,
      heartbeatFrequencyMS: 10000,
      socketTimeoutMS: DB_SOCKET_TIMEOUT_MS,
      connectTimeoutMS: 15_000,
      maxPoolSize: 20,
      minPoolSize: 1,
      retryReads: true,
    })
    .then(() => {
      markDatabaseHealthy();
      console.log(`[${env.serviceName}] connected to MongoDB`);
      return true;
    })
    .catch((error) => {
      markDatabaseUnhealthy(error);
      console.error(
        `[${env.serviceName}] MongoDB connection failed: ${error.message}`,
      );
      scheduleReconnect();
      if (throwOnFailure) {
        throw error;
      }
      return false;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
}

export async function disconnectDatabase() {
  reconnectEnabled = false;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  await mongoose.disconnect();
}

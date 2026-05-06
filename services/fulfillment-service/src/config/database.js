import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  console.log(`[${env.serviceName}] connected to MongoDB`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

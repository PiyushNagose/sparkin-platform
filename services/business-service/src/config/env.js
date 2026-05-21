import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4002),
  SERVICE_NAME: z.string().min(1).default("business-service"),
  CLIENT_URL: z.string().min(1).default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  FULFILLMENT_SERVICE_URL: z
    .string()
    .url()
    .default("http://localhost:4003/api/v1"),
  ALLOW_LOCALHOST_DOWNSTREAM: z
    .enum(["true", "false"])
    .optional()
    .default("false"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid business-service environment: ${message}`);
}

function isLocalhostUrl(value) {
  const hostname = new URL(value).hostname.toLowerCase();
  return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
}

if (
  parsed.data.NODE_ENV === "production" &&
  parsed.data.ALLOW_LOCALHOST_DOWNSTREAM !== "true" &&
  isLocalhostUrl(parsed.data.FULFILLMENT_SERVICE_URL)
) {
  throw new Error(
    "Invalid business-service environment: FULFILLMENT_SERVICE_URL cannot point to localhost in production. Set it to the deployed fulfillment-service URL, or set ALLOW_LOCALHOST_DOWNSTREAM=true only when fulfillment runs in the same production host.",
  );
}

// Warn in production if JWT secret looks like the default dev value
if (
  parsed.data.NODE_ENV === "production" &&
  parsed.data.JWT_ACCESS_SECRET.includes("dev-")
) {
  process.stderr.write(
    "[business-service] WARNING: JWT_ACCESS_SECRET appears to be the default dev value. Rotate before going live.\n",
  );
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  serviceName: parsed.data.SERVICE_NAME,
  clientUrl: parsed.data.CLIENT_URL,
  mongodbUri: parsed.data.MONGODB_URI,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  fulfillmentServiceUrl: parsed.data.FULFILLMENT_SERVICE_URL,
  allowLocalhostDownstream: parsed.data.ALLOW_LOCALHOST_DOWNSTREAM === "true",
};

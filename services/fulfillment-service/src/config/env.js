import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4003),
  SERVICE_NAME: z.string().min(1).default("fulfillment-service"),
  CLIENT_URL: z.string().min(1).default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  // Razorpay is optional — payment gateway integration is not yet active
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid fulfillment-service environment: ${message}`);
}

// Warn in production if JWT secret looks like the default dev value
if (
  parsed.data.NODE_ENV === "production" &&
  parsed.data.JWT_ACCESS_SECRET.includes("dev-")
) {
  process.stderr.write(
    "[fulfillment-service] WARNING: JWT_ACCESS_SECRET appears to be the default dev value. Rotate before going live.\n",
  );
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  serviceName: parsed.data.SERVICE_NAME,
  clientUrl: parsed.data.CLIENT_URL,
  mongodbUri: parsed.data.MONGODB_URI,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  razorpayKeyId: parsed.data.RAZORPAY_KEY_ID,
  razorpayKeySecret: parsed.data.RAZORPAY_KEY_SECRET,
};

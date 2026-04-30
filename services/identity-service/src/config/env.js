import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4001),
  SERVICE_NAME: z.string().min(1).default("identity-service"),
  CLIENT_URL: z.string().min(1).default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().min(2).default("15m"),
  JWT_REFRESH_TTL: z.string().min(2).default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid identity-service environment: ${message}`);
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  serviceName: parsed.data.SERVICE_NAME,
  clientUrl: parsed.data.CLIENT_URL,
  mongodbUri: parsed.data.MONGODB_URI,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtAccessTtl: parsed.data.JWT_ACCESS_TTL,
  jwtRefreshTtl: parsed.data.JWT_REFRESH_TTL,
};

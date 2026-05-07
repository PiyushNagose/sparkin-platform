import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  SERVICE_NAME: z.string().default("api-gateway"),
  IDENTITY_SERVICE_URL: z.string().url(),
  BUSINESS_SERVICE_URL: z.string().url(),
  FULFILLMENT_SERVICE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(8),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("[api-gateway] Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;

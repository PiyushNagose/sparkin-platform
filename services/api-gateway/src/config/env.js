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
  ALLOW_LOCALHOST_DOWNSTREAM: z
    .enum(["true", "false"])
    .optional()
    .default("false"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("[api-gateway] Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

function isLocalhostUrl(value) {
  const hostname = new URL(value).hostname.toLowerCase();
  return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
}

if (
  parsed.data.NODE_ENV === "production" &&
  parsed.data.ALLOW_LOCALHOST_DOWNSTREAM !== "true"
) {
  const localDownstreams = [
    ["IDENTITY_SERVICE_URL", parsed.data.IDENTITY_SERVICE_URL],
    ["BUSINESS_SERVICE_URL", parsed.data.BUSINESS_SERVICE_URL],
    ["FULFILLMENT_SERVICE_URL", parsed.data.FULFILLMENT_SERVICE_URL],
  ].filter(([, value]) => isLocalhostUrl(value));

  if (localDownstreams.length) {
    console.error(
      "[api-gateway] Refusing to start in production with localhost downstream URLs:",
    );
    for (const [name, value] of localDownstreams) {
      console.error(`  ${name}=${value}`);
    }
    console.error(
      "Set each service URL to its deployed internal/public URL, or set ALLOW_LOCALHOST_DOWNSTREAM=true only when all services run in the same production host.",
    );
    process.exit(1);
  }
}

export const env = {
  ...parsed.data,
  allowLocalhostDownstream: parsed.data.ALLOW_LOCALHOST_DOWNSTREAM === "true",
};

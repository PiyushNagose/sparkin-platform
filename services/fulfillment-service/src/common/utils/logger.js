/**
 * Structured logger — zero dependencies.
 *
 * In production (NODE_ENV=production) outputs newline-delimited JSON.
 * In development outputs coloured, human-readable lines.
 *
 * Usage:
 *   import { logger } from '../../common/utils/logger.js';
 *   logger.info('Project created', { projectId, customerId });
 *   logger.error('Payment update failed', { error: err.message, paymentId });
 */

const isProd = process.env.NODE_ENV === "production";

const COLORS = {
  debug: "\x1b[36m",
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};
const RESET = "\x1b[0m";

function write(level, message, meta = {}) {
  const ts = new Date().toISOString();
  const service = process.env.SERVICE_NAME || "service";

  if (isProd) {
    process.stdout.write(
      JSON.stringify({ ts, level, service, message, ...meta }) + "\n",
    );
  } else {
    const color = COLORS[level] || "";
    const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
    process.stdout.write(
      `${color}[${level.toUpperCase()}]${RESET} ${ts} [${service}] ${message}${metaStr}\n`,
    );
  }
}

export const logger = {
  debug: (message, meta) => write("debug", message, meta),
  info: (message, meta) => write("info", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  error: (message, meta) => write("error", message, meta),
};

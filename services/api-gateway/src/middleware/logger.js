const isProd = process.env.NODE_ENV === "production";
const COLORS = { INFO: "\x1b[32m", WARN: "\x1b[33m", ERROR: "\x1b[31m" };
const RESET = "\x1b[0m";

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const level =
      res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    const ts = new Date().toISOString();

    if (isProd) {
      process.stdout.write(
        JSON.stringify({
          ts,
          level: level.toLowerCase(),
          service: "api-gateway",
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          ms,
          requestId: req.requestId,
        }) + "\n",
      );
    } else {
      const color = COLORS[level] || "";
      process.stdout.write(
        `${color}[${level}]${RESET} ${ts} [api-gateway] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms) [${req.requestId}]\n`,
      );
    }
  });

  next();
}

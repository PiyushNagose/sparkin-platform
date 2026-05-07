export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const level =
      res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(
      `[api-gateway] ${level} ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms) [${req.requestId}]`,
    );
  });

  next();
}

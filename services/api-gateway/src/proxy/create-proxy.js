import proxy from "express-http-proxy";

/**
 * Creates a proxy middleware that forwards requests to a downstream service.
 *
 * @param {string} targetUrl - base URL of the downstream service (e.g. http://localhost:4002)
 */
export function createProxy(targetUrl) {
  return proxy(targetUrl, {
    // req.url is the path AFTER the mount point, e.g. when the gateway mounts
    // router.use("/api/v1/leads", businessProxy), req.url is "/" or "/:leadId".
    // We reconstruct the full downstream path by prepending the matched prefix
    // from req.originalUrl so business-service receives "/api/v1/leads/...".
    proxyReqPathResolver(req) {
      // req.originalUrl = full path as seen by the gateway, e.g. /api/v1/leads?page=1
      // This is exactly what the downstream service expects.
      return req.originalUrl || req.url || "/";
    },

    // Forward gateway metadata headers downstream.
    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["x-request-id"] = srcReq.requestId || "";
      proxyReqOpts.headers["x-forwarded-for"] =
        srcReq.ip || srcReq.headers["x-forwarded-for"] || "";
      proxyReqOpts.headers["x-gateway"] = "sparkin-api-gateway";
      return proxyReqOpts;
    },

    // Pass the response body through unchanged
    userResDecorator(proxyRes, proxyResData) {
      return proxyResData;
    },

    // Handle proxy errors (downstream service unreachable or connection reset)
    proxyErrorHandler(err, res) {
      const ts = new Date().toISOString();
      const isProd = process.env.NODE_ENV === "production";
      if (isProd) {
        process.stdout.write(
          JSON.stringify({
            ts,
            level: "error",
            service: "api-gateway",
            message: "Proxy error",
            target: targetUrl,
            method: res.req?.method,
            path: res.req?.originalUrl || res.req?.url,
            requestId: res.req?.requestId,
            error: err.message,
          }) + "\n",
        );
      } else {
        process.stderr.write(
          `\x1b[31m[ERROR]\x1b[0m ${ts} [api-gateway] Proxy error -> ${targetUrl} ${res.req?.method || ""} ${res.req?.originalUrl || res.req?.url || ""} [${res.req?.requestId || ""}]: ${err.message}\n`,
        );
      }
      if (res.headersSent) return;
      res.status(502).json({
        message:
          "Downstream service is temporarily unavailable. Please try again.",
      });
    },

    // 30s timeout — enough for file uploads and long DB queries
    timeout: 30000,

    preserveHostHdr: false,
  });
}

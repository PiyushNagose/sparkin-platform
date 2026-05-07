import proxy from "express-http-proxy";

/**
 * Creates a proxy middleware that forwards requests to a downstream service.
 *
 * @param {string} targetUrl - base URL of the downstream service (e.g. http://localhost:4002)
 * @param {object} options
 * @param {string} [options.pathPrefix] - strip this prefix before forwarding (e.g. "/api/v1")
 */
export function createProxy(targetUrl, options = {}) {
  const { pathPrefix = "" } = options;

  return proxy(targetUrl, {
    // Use originalUrl so mounted gateway routes keep their full downstream path.
    proxyReqPathResolver(req) {
      const originalPath = req.originalUrl || req.url;
      const path = pathPrefix
        ? originalPath.replace(new RegExp(`^${pathPrefix}`), "")
        : originalPath;
      return path || "/";
    },

    // Forward the original request ID downstream
    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["x-request-id"] = srcReq.requestId;
      proxyReqOpts.headers["x-forwarded-for"] =
        srcReq.ip || srcReq.headers["x-forwarded-for"] || "";
      proxyReqOpts.headers["x-gateway"] = "sparkin-api-gateway";
      return proxyReqOpts;
    },

    // Surface downstream errors clearly
    userResDecorator(proxyRes, proxyResData, userReq, userRes) {
      return proxyResData;
    },

    // Handle proxy errors (downstream service unreachable)
    proxyErrorHandler(err, res, next) {
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
            error: err.message,
          }) + "\n",
        );
      } else {
        process.stderr.write(
          `\x1b[31m[ERROR]\x1b[0m ${ts} [api-gateway] Proxy error → ${targetUrl}: ${err.message}\n`,
        );
      }
      res.status(502).json({
        message:
          "Downstream service is temporarily unavailable. Please try again.",
        service: targetUrl,
      });
    },

    // Increase timeout for file uploads and long-running operations
    timeout: 30000,

    // Preserve the original host header
    preserveHostHdr: false,
  });
}

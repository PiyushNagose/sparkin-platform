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
    // Strip the gateway prefix so downstream receives /api/v1/...
    proxyReqPathResolver(req) {
      const path = pathPrefix
        ? req.url.replace(new RegExp(`^${pathPrefix}`), "")
        : req.url;
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
      console.error(`[api-gateway] Proxy error → ${targetUrl}: ${err.message}`);
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

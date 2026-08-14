import proxy from "express-http-proxy";

function logProxyError(targetUrl, req, error, extra = {}) {
  const ts = new Date().toISOString();
  const isProd = process.env.NODE_ENV === "production";
  const errorMessage =
    error?.message ||
    error?.code ||
    "Downstream service did not respond to the gateway request";

  if (isProd) {
    process.stdout.write(
      JSON.stringify({
        ts,
        level: "error",
        service: "api-gateway",
        message: "Proxy error",
        target: targetUrl,
        method: req?.method,
        path: req?.originalUrl || req?.url,
        requestId: req?.requestId,
        error: errorMessage,
        code: error?.code,
        ...extra,
      }) + "\n",
    );
    return;
  }

  const retrySuffix = extra.retryAttempt
    ? ` [retry ${extra.retryAttempt}]`
    : "";
  process.stderr.write(
    `\x1b[31m[ERROR]\x1b[0m ${ts} [api-gateway] Proxy error -> ${targetUrl} ${req?.method || ""} ${req?.originalUrl || req?.url || ""} [${req?.requestId || ""}]${retrySuffix}: ${errorMessage}\n`,
  );
}

function createProxyMiddleware(targetUrl) {
  return proxy(targetUrl, {
    parseReqBody: false,
    proxyReqPathResolver(req) {
      return req.originalUrl || req.url || "/";
    },

    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["x-request-id"] = srcReq.requestId || "";
      proxyReqOpts.headers["x-forwarded-for"] =
        srcReq.ip || srcReq.headers["x-forwarded-for"] || "";
      proxyReqOpts.headers["x-gateway"] = "sparkin-api-gateway";

      // express-http-proxy attaches request timeout listeners to the outgoing
      // socket. Reusing that socket can accumulate listeners over repeated
      // proxied calls, so keep gateway-to-service connections fresh.
      proxyReqOpts.headers.connection = "close";
      proxyReqOpts.agent = false;

      return proxyReqOpts;
    },

    proxyErrorHandler(err, res, next) {
      next(err);
    },

    timeout: 120_000,
    preserveHostHdr: false,
  });
}

/**
 * Creates a proxy middleware that forwards requests to a downstream service.
 *
 * @param {string} targetUrl - base URL of the downstream service.
 */
export function createProxy(targetUrl) {
  const downstreamProxy = createProxyMiddleware(targetUrl);

  return (req, res, next) => {
    downstreamProxy(req, res, (error) => {
      if (error) {
        logProxyError(targetUrl, req, error);
        if (!res.headersSent) {
          res.status(503).json({
            message:
              "Required backend service is unavailable. Please check service deployment and environment URLs.",
          });
        }
        return;
      }

      next();
    });
  };
}

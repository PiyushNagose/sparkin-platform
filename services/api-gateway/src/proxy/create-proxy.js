import http from "node:http";
import https from "node:https";
import proxy from "express-http-proxy";

const agentCache = new Map();
const RETRYABLE_ERROR_CODES = new Set(["ECONNRESET", "EPIPE"]);
const RETRYABLE_ERROR_MESSAGES = ["socket hang up"];

function isRetryableProxyError(error) {
  if (!error) {
    return false;
  }

  if (RETRYABLE_ERROR_CODES.has(error.code)) {
    return true;
  }

  const message = String(error.message || "").toLowerCase();
  return RETRYABLE_ERROR_MESSAGES.some((pattern) => message.includes(pattern));
}

function getKeepAliveAgent(targetUrl) {
  const cachedAgent = agentCache.get(targetUrl);
  if (cachedAgent) {
    return cachedAgent;
  }

  const protocol = new URL(targetUrl).protocol;
  const Agent = protocol === "https:" ? https.Agent : http.Agent;
  const agent = new Agent({
    keepAlive: true,
    keepAliveMsecs: 15_000,
    maxSockets: 100,
    maxFreeSockets: 10,
    scheduling: "lifo",
    timeout: 70_000,
  });

  agentCache.set(targetUrl, agent);
  return agent;
}

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

function createProxyMiddleware(targetUrl, { useKeepAlive }) {
  return proxy(targetUrl, {
    proxyReqPathResolver(req) {
      return req.originalUrl || req.url || "/";
    },

    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      proxyReqOpts.headers["x-request-id"] = srcReq.requestId || "";
      proxyReqOpts.headers["x-forwarded-for"] =
        srcReq.ip || srcReq.headers["x-forwarded-for"] || "";
      proxyReqOpts.headers["x-gateway"] = "sparkin-api-gateway";

      // Let Node negotiate connection reuse; forcing the header increases the
      // chance of reusing a stale downstream socket.
      delete proxyReqOpts.headers.connection;

      proxyReqOpts.agent = useKeepAlive
        ? getKeepAliveAgent(targetUrl)
        : false;

      return proxyReqOpts;
    },

    proxyErrorHandler(err, res, next) {
      next(err);
    },

    timeout: 30_000,
    preserveHostHdr: false,
  });
}

/**
 * Creates a proxy middleware that forwards requests to a downstream service.
 *
 * For idempotent reads, we retry once without keep-alive when a pooled socket
 * has gone stale. This permanently addresses the common "socket hang up"
 * pattern without duplicating mutating requests.
 *
 * @param {string} targetUrl - base URL of the downstream service.
 */
export function createProxy(targetUrl) {
  const keepAliveProxy = createProxyMiddleware(targetUrl, {
    useKeepAlive: true,
  });
  const freshConnectionProxy = createProxyMiddleware(targetUrl, {
    useKeepAlive: false,
  });

  return (req, res, next) => {
    keepAliveProxy(req, res, (error) => {
      const canRetry =
        !res.headersSent &&
        !req._gatewayProxyRetried &&
        ["GET", "HEAD"].includes(req.method) &&
        isRetryableProxyError(error);

      if (canRetry) {
        req._gatewayProxyRetried = true;
        logProxyError(targetUrl, req, error, { retryAttempt: 1 });
        freshConnectionProxy(req, res, (retryError) => {
          if (retryError) {
            logProxyError(targetUrl, req, retryError, { retryAttempt: 2 });
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
        return;
      }

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

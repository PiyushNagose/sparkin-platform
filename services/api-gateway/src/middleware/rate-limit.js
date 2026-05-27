/**
 * Simple in-memory rate limiter.
 * Production should use Redis-backed rate limiting.
 */

const windows = new Map();
let requestCounter = 0;

function getKey(req) {
  return req.ip || "unknown";
}

function pruneExpiredWindows(now, windowMs) {
  requestCounter += 1;

  if (requestCounter % 500 !== 0) {
    return;
  }

  for (const [key, entry] of windows.entries()) {
    if (now - entry.start > windowMs) {
      windows.delete(key);
    }
  }
}

/**
 * @param {number} maxRequests - max requests per window
 * @param {number} windowMs - window size in milliseconds
 */
export function rateLimit(maxRequests = 100, windowMs = 60_000) {
  return (req, res, next) => {
    const key = getKey(req);
    const now = Date.now();
    pruneExpiredWindows(now, windowMs);
    const entry = windows.get(key);

    if (!entry || now - entry.start > windowMs) {
      windows.set(key, { start: now, count: 1 });
      res.setHeader("RateLimit-Limit", String(maxRequests));
      res.setHeader("RateLimit-Remaining", String(maxRequests - 1));
      return next();
    }

    entry.count += 1;
    const retryAfterSeconds = Math.ceil((entry.start + windowMs - now) / 1000);

    res.setHeader("RateLimit-Limit", String(maxRequests));
    res.setHeader(
      "RateLimit-Remaining",
      String(Math.max(maxRequests - entry.count, 0)),
    );

    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "Too many requests. Please slow down.",
        retryAfter: retryAfterSeconds,
      });
    }

    next();
  };
}

// Stricter limit for auth endpoints to prevent brute force
export const authRateLimit = rateLimit(20, 60_000);

// Standard limit for all other endpoints
export const standardRateLimit = rateLimit(200, 60_000);

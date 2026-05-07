/**
 * Simple in-memory rate limiter.
 * Production should use Redis-backed rate limiting.
 */

const windows = new Map();

function getKey(req) {
  return req.ip || req.headers["x-forwarded-for"] || "unknown";
}

/**
 * @param {number} maxRequests - max requests per window
 * @param {number} windowMs - window size in milliseconds
 */
export function rateLimit(maxRequests = 100, windowMs = 60_000) {
  return (req, res, next) => {
    const key = getKey(req);
    const now = Date.now();
    const entry = windows.get(key);

    if (!entry || now - entry.start > windowMs) {
      windows.set(key, { start: now, count: 1 });
      return next();
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
      return res.status(429).json({
        message: "Too many requests. Please slow down.",
        retryAfter: Math.ceil((entry.start + windowMs - now) / 1000),
      });
    }

    next();
  };
}

// Stricter limit for auth endpoints to prevent brute force
export const authRateLimit = rateLimit(20, 60_000);

// Standard limit for all other endpoints
export const standardRateLimit = rateLimit(200, 60_000);

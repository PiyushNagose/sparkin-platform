import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Validates the Bearer token and attaches decoded payload to req.auth.
 * Returns 401 if token is missing or invalid.
 */
export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Access token is invalid or expired" });
  }
}

/**
 * Optionally reads the token — does not block if missing.
 * Useful for public routes that behave differently when authenticated.
 */
export function optionalAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "").trim();
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      req.auth = {
        userId: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      // invalid token — treat as unauthenticated
    }
  }

  next();
}

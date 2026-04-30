import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "Missing or invalid authorization header");
  }

  const token = authorization.replace("Bearer ", "").trim();
  let payload;

  try {
    payload = jwt.verify(token, env.jwtAccessSecret);
  } catch {
    throw new AppError(401, "Access token is invalid or expired");
  }

  req.auth = {
    userId: payload.sub,
    role: payload.role,
    email: payload.email,
  };

  next();
});

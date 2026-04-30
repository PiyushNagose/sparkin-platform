import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const tokenService = {
  createAccessToken(payload) {
    return jwt.sign(payload, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessTtl,
    });
  },

  createRefreshToken(payload) {
    return jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshTtl,
    });
  },

  verifyAccessToken(token) {
    return jwt.verify(token, env.jwtAccessSecret);
  },

  verifyRefreshToken(token) {
    return jwt.verify(token, env.jwtRefreshSecret);
  },
};

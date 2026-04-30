import { AppError } from "../../common/errors/app-error.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { authRepository } from "./auth.repository.js";
import { tokenService } from "./token.service.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "Missing or invalid authorization header");
  }

  const token = authorization.replace("Bearer ", "").trim();
  let payload;

  try {
    payload = tokenService.verifyAccessToken(token);
  } catch {
    throw new AppError(401, "Access token is invalid or expired");
  }

  const user = await authRepository.findUserById(payload.sub);

  if (!user) {
    throw new AppError(401, "User session is no longer valid");
  }

  req.auth = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  next();
});

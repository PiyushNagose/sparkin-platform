import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { validate } from "../../common/middleware/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { usersController } from "./users.controller.js";
import { changePasswordSchema, updateAvatarSchema, updateProfileSchema } from "./users.schemas.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, asyncHandler(usersController.getMe));
usersRouter.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(usersController.updateMe),
);
usersRouter.patch(
  "/me/avatar",
  requireAuth,
  validate(updateAvatarSchema),
  asyncHandler(usersController.updateAvatar),
);
usersRouter.patch(
  "/me/password",
  requireAuth,
  validate(changePasswordSchema),
  asyncHandler(usersController.changePassword),
);

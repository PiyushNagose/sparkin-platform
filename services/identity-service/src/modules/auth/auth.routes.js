import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { validate } from "../../common/middleware/validate.js";
import { authController } from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register),
);
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRouter.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(authController.refresh),
);
authRouter.post(
  "/logout",
  validate(logoutSchema),
  asyncHandler(authController.logout),
);
authRouter.get("/me", requireAuth, asyncHandler(authController.me));

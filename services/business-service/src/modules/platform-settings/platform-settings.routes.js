import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { platformSettingsController } from "./platform-settings.controller.js";
import { updatePlatformSettingsSchema } from "./platform-settings.schemas.js";

export const platformSettingsRouter = Router();

platformSettingsRouter.get("/", asyncHandler(platformSettingsController.get));
platformSettingsRouter.patch(
  "/",
  requireAuth,
  validate(updatePlatformSettingsSchema),
  asyncHandler(platformSettingsController.update),
);

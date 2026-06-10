import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { platformSettingsController } from "./platform-settings.controller.js";
import { updatePlatformSettingsSchema } from "./platform-settings.schemas.js";

export const platformSettingsRouter = Router();

// Public: get all settings (including states + cities for dropdowns)
platformSettingsRouter.get("/", asyncHandler(platformSettingsController.get));

// Public: get states list (lightweight endpoint for dropdowns)
platformSettingsRouter.get(
  "/states",
  asyncHandler(platformSettingsController.getStates),
);

// Public: get cities for a specific state key
platformSettingsRouter.get(
  "/states/:stateKey/cities",
  asyncHandler(platformSettingsController.getCitiesForState),
);

// Protected: update settings (admin only — role check inside service)
platformSettingsRouter.patch(
  "/",
  requireAuth,
  validate(updatePlatformSettingsSchema),
  asyncHandler(platformSettingsController.update),
);

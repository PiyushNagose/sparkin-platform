import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { referralsController } from "./referrals.controller.js";
import {
  createReferralSchema,
  trackReferralBookingSchema,
  trackReferralSignupSchema,
  updateReferralSettingsSchema,
  updateRewardStatusSchema,
} from "./referrals.schemas.js";

export const referralsRouter = Router();

referralsRouter.use(requireAuth);
referralsRouter.get("/", asyncHandler(referralsController.dashboard));
referralsRouter.post("/", validate(createReferralSchema), asyncHandler(referralsController.create));
referralsRouter.post(
  "/track-signup",
  validate(trackReferralSignupSchema),
  asyncHandler(referralsController.trackSignup),
);
referralsRouter.post(
  "/track-booking",
  validate(trackReferralBookingSchema),
  asyncHandler(referralsController.trackBooking),
);

// Admin routes
referralsRouter.get("/admin/all", asyncHandler(referralsController.listAll));
referralsRouter.get("/admin/settings", asyncHandler(referralsController.getSettings));
referralsRouter.patch(
  "/admin/settings",
  validate(updateReferralSettingsSchema),
  asyncHandler(referralsController.updateSettings),
);
referralsRouter.patch(
  "/admin/:referralId/reward-status",
  validate(updateRewardStatusSchema),
  asyncHandler(referralsController.updateRewardStatus),
);

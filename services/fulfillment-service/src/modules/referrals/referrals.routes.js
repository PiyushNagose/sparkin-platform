import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { referralsController } from "./referrals.controller.js";
import { createReferralSchema } from "./referrals.schemas.js";

export const referralsRouter = Router();

referralsRouter.use(requireAuth);
referralsRouter.get("/", asyncHandler(referralsController.dashboard));
referralsRouter.post("/", validate(createReferralSchema), asyncHandler(referralsController.create));

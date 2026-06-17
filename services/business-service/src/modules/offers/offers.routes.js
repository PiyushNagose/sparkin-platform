import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { offersController } from "./offers.controller.js";
import {
  createOfferSchema,
  toggleStatusSchema,
  updateOfferSchema,
  validateCouponSchema,
} from "./offers.schemas.js";

export const offersRouter = Router();

offersRouter.get("/public", asyncHandler(offersController.listPublic));

// Public coupon validation — no auth required so booking page can validate before login
offersRouter.post(
  "/validate-coupon",
  validate(validateCouponSchema),
  asyncHandler(offersController.validateCoupon),
);

offersRouter.use(requireAuth);

// Stats summary (active count, total redemptions)
offersRouter.get("/stats", asyncHandler(offersController.getStats));

// Generate a unique coupon code
offersRouter.get("/generate-code", asyncHandler(offersController.generateCode));

// List all offers (paginated, filterable)
offersRouter.get("/", asyncHandler(offersController.list));

// Get single offer
offersRouter.get("/:offerId", asyncHandler(offersController.getById));

// Create offer
offersRouter.post(
  "/",
  validate(createOfferSchema),
  asyncHandler(offersController.create),
);

// Update offer
offersRouter.patch(
  "/:offerId",
  validate(updateOfferSchema),
  asyncHandler(offersController.update),
);

// Toggle status (active / disabled / draft)
offersRouter.patch(
  "/:offerId/status",
  validate(toggleStatusSchema),
  asyncHandler(offersController.toggleStatus),
);

// Delete offer
offersRouter.delete("/:offerId", asyncHandler(offersController.remove));

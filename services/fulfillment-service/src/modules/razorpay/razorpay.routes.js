import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { razorpayController } from "./razorpay.controller.js";
import { verifyPaymentSchema } from "./razorpay.schemas.js";

export const razorpayRouter = Router();

razorpayRouter.use(requireAuth);

// Create a Razorpay order for a pending payment
razorpayRouter.post(
  "/order/:paymentId",
  asyncHandler(razorpayController.createOrder),
);

// Verify payment signature and mark payment as paid
razorpayRouter.post(
  "/verify",
  validate(verifyPaymentSchema),
  asyncHandler(razorpayController.verifyPayment),
);

// Confirm COD for booking advance — customer-accessible
razorpayRouter.post(
  "/cod/:paymentId",
  asyncHandler(razorpayController.confirmCod),
);

import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { paymentsController } from "./payments.controller.js";
import { createPaymentInvoiceSchema } from "./payments.schemas.js";

export const paymentsRouter = Router();

paymentsRouter.use(requireAuth);
paymentsRouter.post("/", validate(createPaymentInvoiceSchema), asyncHandler(paymentsController.create));
paymentsRouter.get("/", asyncHandler(paymentsController.list));
paymentsRouter.get("/:paymentId", asyncHandler(paymentsController.getById));

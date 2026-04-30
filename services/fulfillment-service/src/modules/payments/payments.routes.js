import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { paymentsController } from "./payments.controller.js";

export const paymentsRouter = Router();

paymentsRouter.use(requireAuth);
paymentsRouter.get("/", asyncHandler(paymentsController.list));
paymentsRouter.get("/:paymentId", asyncHandler(paymentsController.getById));

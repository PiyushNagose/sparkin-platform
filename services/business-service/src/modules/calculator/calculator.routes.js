import { Router } from "express";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { calculatorController } from "./calculator.controller.js";
import { estimateSchema, serviceabilityQuerySchema } from "./calculator.schemas.js";

export const calculatorRouter = Router();

calculatorRouter.get(
  "/serviceability",
  validate(serviceabilityQuerySchema, "query"),
  asyncHandler(calculatorController.serviceability),
);
calculatorRouter.post("/estimate", validate(estimateSchema), asyncHandler(calculatorController.estimate));

import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { quotesController } from "./quotes.controller.js";
import { createQuoteSchema } from "./quotes.schemas.js";

export const quotesRouter = Router();

quotesRouter.use(requireAuth);
quotesRouter.get("/", asyncHandler(quotesController.list));
quotesRouter.get("/:quoteId", asyncHandler(quotesController.getById));
quotesRouter.post("/:quoteId/accept", asyncHandler(quotesController.accept));
quotesRouter.post("/leads/:leadId", validate(createQuoteSchema), asyncHandler(quotesController.createForLead));

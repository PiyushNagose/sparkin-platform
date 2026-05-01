import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { leadsController } from "./leads.controller.js";
import { createLeadSchema, updateLeadStatusSchema } from "./leads.schemas.js";

export const leadsRouter = Router();

leadsRouter.use(requireAuth);
leadsRouter.get("/", asyncHandler(leadsController.list));
leadsRouter.post("/", validate(createLeadSchema), asyncHandler(leadsController.create));
leadsRouter.get("/:leadId", asyncHandler(leadsController.getById));
leadsRouter.patch("/:leadId/status", validate(updateLeadStatusSchema), asyncHandler(leadsController.updateStatus));

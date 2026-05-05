import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { leadsController } from "./leads.controller.js";
import {
  assignLeadVendorsSchema,
  createLeadSchema,
  markCommitmentPaidSchema,
  updateLeadDetailsSchema,
  updateLeadStatusSchema,
} from "./leads.schemas.js";

export const leadsRouter = Router();

leadsRouter.use(requireAuth);
leadsRouter.get("/", asyncHandler(leadsController.list));
leadsRouter.post(
  "/",
  validate(createLeadSchema),
  asyncHandler(leadsController.create),
);
leadsRouter.get("/:leadId", asyncHandler(leadsController.getById));
leadsRouter.patch(
  "/:leadId/status",
  validate(updateLeadStatusSchema),
  asyncHandler(leadsController.updateStatus),
);
leadsRouter.patch(
  "/:leadId/details",
  validate(updateLeadDetailsSchema),
  asyncHandler(leadsController.updateDetails),
);
leadsRouter.patch(
  "/:leadId/commitment-paid",
  validate(markCommitmentPaidSchema),
  asyncHandler(leadsController.markCommitmentPaid),
);
leadsRouter.patch(
  "/:leadId/vendors",
  validate(assignLeadVendorsSchema),
  asyncHandler(leadsController.assignVendors),
);

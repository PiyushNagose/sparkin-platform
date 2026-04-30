import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { serviceRequestsController } from "./service-requests.controller.js";
import { createServiceRequestSchema, updateServiceRequestStatusSchema } from "./service-requests.schemas.js";

export const serviceRequestsRouter = Router();

serviceRequestsRouter.use(requireAuth);
serviceRequestsRouter.get("/", asyncHandler(serviceRequestsController.list));
serviceRequestsRouter.get("/:requestId", asyncHandler(serviceRequestsController.getById));
serviceRequestsRouter.post("/", validate(createServiceRequestSchema), asyncHandler(serviceRequestsController.create));
serviceRequestsRouter.patch(
  "/:requestId/status",
  validate(updateServiceRequestStatusSchema),
  asyncHandler(serviceRequestsController.updateStatus),
);

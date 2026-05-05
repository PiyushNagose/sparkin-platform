import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { broadcastsController } from "./broadcasts.controller.js";
import {
  createBroadcastSchema,
  saveDraftSchema,
} from "./broadcasts.schemas.js";

export const broadcastsRouter = Router();

broadcastsRouter.use(requireAuth);

// List all broadcasts (paginated, filterable by status)
broadcastsRouter.get("/", asyncHandler(broadcastsController.list));

// Get single broadcast by broadcastId
broadcastsRouter.get(
  "/:broadcastId",
  asyncHandler(broadcastsController.getById),
);

// Send broadcast immediately or schedule
broadcastsRouter.post(
  "/",
  validate(createBroadcastSchema),
  asyncHandler(broadcastsController.create),
);

// Save as draft
broadcastsRouter.post(
  "/draft",
  validate(saveDraftSchema),
  asyncHandler(broadcastsController.saveDraft),
);

// Cancel a scheduled or draft broadcast
broadcastsRouter.patch(
  "/:broadcastId/cancel",
  asyncHandler(broadcastsController.cancel),
);

// Delete a draft/scheduled/failed broadcast
broadcastsRouter.delete(
  "/:broadcastId",
  asyncHandler(broadcastsController.remove),
);

import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { ticketsController } from "./tickets.controller.js";
import {
  addMessageSchema,
  createTicketSchema,
  updateTicketSchema,
} from "./tickets.schemas.js";

export const ticketsRouter = Router();

ticketsRouter.use(requireAuth);

ticketsRouter.get("/", asyncHandler(ticketsController.list));
ticketsRouter.get("/:ticketId", asyncHandler(ticketsController.getById));
ticketsRouter.post(
  "/",
  validate(createTicketSchema),
  asyncHandler(ticketsController.create),
);
ticketsRouter.patch(
  "/:ticketId",
  validate(updateTicketSchema),
  asyncHandler(ticketsController.update),
);
ticketsRouter.post(
  "/:ticketId/messages",
  validate(addMessageSchema),
  asyncHandler(ticketsController.addMessage),
);
ticketsRouter.delete("/:ticketId", asyncHandler(ticketsController.remove));

import { Router } from "express";
import { requireDatabase } from "../common/database/database-health.js";
import { broadcastsRouter } from "../modules/broadcasts/broadcasts.routes.js";
import { calculatorRouter } from "../modules/calculator/calculator.routes.js";
import { createChatRouter } from "../modules/chat/chat.routes.js";
import { leadsRouter } from "../modules/leads/leads.routes.js";
import { offersRouter } from "../modules/offers/offers.routes.js";
import { platformSettingsRouter } from "../modules/platform-settings/platform-settings.routes.js";
import { quotesRouter } from "../modules/quotes/quotes.routes.js";
import { ticketsRouter } from "../modules/tickets/tickets.routes.js";
import { vendorsRouter } from "../modules/vendors/vendors.routes.js";

export function createApiRouter(io) {
  const apiRouter = Router();

  apiRouter.use(requireDatabase);

  apiRouter.use("/broadcasts", broadcastsRouter);
  apiRouter.use("/calculator", calculatorRouter);
  apiRouter.use("/chat", createChatRouter(io));
  apiRouter.use(
    "/leads",
    (req, res, next) => {
      req.io = io;
      next();
    },
    leadsRouter,
  );
  apiRouter.use("/offers", offersRouter);
  apiRouter.use("/platform-settings", platformSettingsRouter);
  apiRouter.use("/quotes", quotesRouter);
  apiRouter.use("/tickets", ticketsRouter);
  apiRouter.use("/vendors", vendorsRouter);

  return apiRouter;
}

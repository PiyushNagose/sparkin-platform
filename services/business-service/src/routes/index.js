import { Router } from "express";
import { calculatorRouter } from "../modules/calculator/calculator.routes.js";
import { createChatRouter } from "../modules/chat/chat.routes.js";
import { leadsRouter } from "../modules/leads/leads.routes.js";
import { quotesRouter } from "../modules/quotes/quotes.routes.js";
import { vendorsRouter } from "../modules/vendors/vendors.routes.js";

export function createApiRouter(io) {
  const apiRouter = Router();

  apiRouter.use("/calculator", calculatorRouter);
  apiRouter.use("/chat", createChatRouter(io));
  apiRouter.use("/leads", leadsRouter);
  apiRouter.use("/quotes", quotesRouter);
  apiRouter.use("/vendors", vendorsRouter);

  return apiRouter;
}

import { Router } from "express";
import { leadsRouter } from "../modules/leads/leads.routes.js";
import { quotesRouter } from "../modules/quotes/quotes.routes.js";

export const apiRouter = Router();

apiRouter.use("/leads", leadsRouter);
apiRouter.use("/quotes", quotesRouter);

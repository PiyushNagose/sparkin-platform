import { Router } from "express";
import { calculatorRouter } from "../modules/calculator/calculator.routes.js";
import { leadsRouter } from "../modules/leads/leads.routes.js";
import { quotesRouter } from "../modules/quotes/quotes.routes.js";
import { vendorsRouter } from "../modules/vendors/vendors.routes.js";

export const apiRouter = Router();

apiRouter.use("/calculator", calculatorRouter);
apiRouter.use("/leads", leadsRouter);
apiRouter.use("/quotes", quotesRouter);
apiRouter.use("/vendors", vendorsRouter);

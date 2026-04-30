import { Router } from "express";
import { paymentsRouter } from "../modules/payments/payments.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";
import { referralsRouter } from "../modules/referrals/referrals.routes.js";
import { serviceRequestsRouter } from "../modules/service-requests/service-requests.routes.js";

export const apiRouter = Router();

apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/referrals", referralsRouter);
apiRouter.use("/service-requests", serviceRequestsRouter);

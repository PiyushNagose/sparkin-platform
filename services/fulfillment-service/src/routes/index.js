import { Router } from "express";
import { requireDatabase } from "../common/database/database-health.js";
import { paymentsRouter } from "../modules/payments/payments.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";
import { razorpayRouter } from "../modules/razorpay/razorpay.routes.js";
import { referralsRouter } from "../modules/referrals/referrals.routes.js";
import { serviceRequestsRouter } from "../modules/service-requests/service-requests.routes.js";

export const apiRouter = Router();

apiRouter.use(requireDatabase);

// Razorpay must be registered before the generic payments router to avoid
// "razorpay" being matched as a :paymentId param
apiRouter.use("/payments/razorpay", razorpayRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/referrals", referralsRouter);
apiRouter.use("/service-requests", serviceRequestsRouter);

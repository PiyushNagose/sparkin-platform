import { Router } from "express";
import { requireDatabase } from "../common/database/database-health.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";

export const apiRouter = Router();

apiRouter.use(requireDatabase);

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);

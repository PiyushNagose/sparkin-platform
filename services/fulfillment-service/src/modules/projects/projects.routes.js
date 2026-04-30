import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { projectsController } from "./projects.controller.js";
import { createProjectSchema, submitProjectOnboardingSchema, updateProjectMilestoneSchema } from "./projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);
projectsRouter.get("/", asyncHandler(projectsController.list));
projectsRouter.get("/:projectId", asyncHandler(projectsController.getById));
projectsRouter.patch(
  "/:projectId/milestone",
  validate(updateProjectMilestoneSchema),
  asyncHandler(projectsController.updateMilestone),
);
projectsRouter.patch(
  "/:projectId/onboarding",
  validate(submitProjectOnboardingSchema),
  asyncHandler(projectsController.submitOnboarding),
);
projectsRouter.post("/from-accepted-quote", validate(createProjectSchema), asyncHandler(projectsController.createFromAcceptedQuote));

import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validate } from "../../common/middleware/validate.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { vendorsController } from "./vendors.controller.js";
import { updateVendorProfileSchema, uploadVendorDocumentSchema } from "./vendors.schemas.js";

export const vendorsRouter = Router();

vendorsRouter.get("/public/featured", asyncHandler(vendorsController.listFeatured));

vendorsRouter.get("/", requireAuth, asyncHandler(vendorsController.list));
vendorsRouter.get("/me", requireAuth, asyncHandler(vendorsController.getMe));
vendorsRouter.patch("/me", requireAuth, validate(updateVendorProfileSchema), asyncHandler(vendorsController.updateMe));
vendorsRouter.post(
  "/me/documents",
  requireAuth,
  validate(uploadVendorDocumentSchema),
  asyncHandler(vendorsController.uploadDocument),
);
vendorsRouter.delete("/me/documents/:documentId", requireAuth, asyncHandler(vendorsController.deleteDocument));
vendorsRouter.post("/me/submit", requireAuth, asyncHandler(vendorsController.submitApplication));

vendorsRouter.get("/:vendorId", asyncHandler(vendorsController.getByVendorId));

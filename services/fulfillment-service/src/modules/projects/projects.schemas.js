import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(2),
  landmark: z.string().nullable().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
});

export const createProjectSchema = z.object({
  lead: z.object({
    id: z.string().min(1),
    customerId: z.string().min(1),
    contact: z.object({
      fullName: z.string().min(2),
      phoneNumber: z.string().min(6),
      email: z.string().email().nullable().optional(),
    }),
    installationAddress: addressSchema,
  }),
  quote: z.object({
    id: z.string().min(1),
    vendorId: z.string().min(1),
    vendorEmail: z.string().email().nullable().optional(),
    pricing: z.object({
      totalPrice: z.coerce.number().nonnegative(),
      equipmentCost: z.coerce.number().nonnegative().nullable().optional(),
      laborCost: z.coerce.number().nonnegative().nullable().optional(),
      permittingCost: z.coerce.number().nonnegative().nullable().optional(),
    }),
    system: z.object({
      sizeKw: z.coerce.number().positive(),
      panelType: z.string().min(1),
      inverterType: z.string().min(1),
    }),
    timeline: z.object({
      installationWindow: z.string().min(1),
    }),
  }),
});

export const updateProjectMilestoneSchema = z.object({
  milestoneKey: z.enum(["site_visit", "design_approval", "installation", "inspection", "activation"]),
  status: z.enum(["pending", "in_progress", "completed"]),
});

export const submitProjectOnboardingSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  contactPhone: z.string().trim().min(6).max(20),
  siteAccessNotes: z.string().trim().max(500).optional().nullable(),
  preferredVisitWindow: z.enum(["morning", "afternoon", "evening"]).nullable().optional(),
});

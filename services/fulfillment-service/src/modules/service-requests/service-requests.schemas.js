import { z } from "zod";

export const createServiceRequestSchema = z.object({
  projectId: z.string().min(1).nullable().optional(),
  type: z.enum(["maintenance", "repair", "warranty"]),
  description: z.string().min(10).max(2000),
  preferredDate: z.string().trim().nullable().optional(),
  preferredTime: z.string().trim().nullable().optional(),
});

export const updateServiceRequestStatusSchema = z.object({
  status: z.enum(["requested", "under_review", "technician_assigned", "resolved", "cancelled"]),
  note: z.string().trim().max(1000).nullable().optional(),
});

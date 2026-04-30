import { z } from "zod";

export const createReferralSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phoneNumber: z.string().trim().max(30).nullable().optional(),
});

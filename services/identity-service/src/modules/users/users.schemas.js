import { z } from "zod";

export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    phoneNumber: z.string().trim().min(8).max(20).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field must be provided",
  });

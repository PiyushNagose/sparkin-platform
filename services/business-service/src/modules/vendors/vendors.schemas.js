import { z } from "zod";

const nullableString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

const optionalString = z.string().trim().max(180).optional();

export const updateVendorProfileSchema = z.object({
  account: z
    .object({
      fullName: z.string().trim().min(2).max(120),
      email: z.string().trim().email(),
      phoneNumber: nullableString,
    })
    .optional(),
  company: z
    .object({
      name: optionalString,
      businessType: optionalString,
      gstNumber: z.string().trim().max(32).optional(),
      address: z.string().trim().max(240).optional(),
      city: z.string().trim().max(80).optional(),
      state: z.string().trim().max(80).optional(),
      coverageArea: z.string().trim().max(120).optional(),
      experienceYears: z.coerce.number().min(0).max(80).optional(),
      projectsCompleted: z.coerce.number().min(0).max(100000).optional(),
      totalCapacityMw: z.coerce.number().min(0).max(100000).optional(),
    })
    .optional(),
  services: z
    .object({
      installation: z.boolean().optional(),
      maintenance: z.boolean().optional(),
      siteSurvey: z.boolean().optional(),
      consultation: z.boolean().optional(),
    })
    .optional(),
});

export const uploadVendorDocumentSchema = z.object({
  type: z.enum(["company", "certification"]),
  title: z.string().trim().min(2).max(120),
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
  data: z.string().min(100),
});

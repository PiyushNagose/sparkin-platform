import { z } from "zod";

const nullableTrimmedString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const createLeadSchema = z.object({
  contact: z.object({
    fullName: z.string().trim().min(2).max(120),
    phoneNumber: z.string().trim().min(8).max(20),
    email: z.string().trim().email().nullable().optional(),
  }),
  installationAddress: z.object({
    street: z.string().trim().min(3).max(180),
    landmark: nullableTrimmedString,
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().trim().min(4).max(12),
  }),
  inspection: z
    .object({
      preferredDate: nullableTrimmedString,
      preferredTimeSlot: z.enum(["morning", "afternoon", "evening"]).nullable().optional(),
    })
    .optional(),
  property: z.object({
    type: z.enum(["independent_house", "apartment", "commercial"]),
    roofType: z.enum(["flat", "sloped"]),
    ownership: z.enum(["owned", "rented"]),
    distributionCompany: nullableTrimmedString,
    connectionType: z.enum(["single_phase", "three_phase"]).nullable().optional(),
    consumerNumber: nullableTrimmedString,
    sanctionedLoadKw: z.coerce.number().min(0).nullable().optional(),
  }),
  roof: z.object({
    sizeRange: z.enum(["under_500", "500_1000", "over_1000"]),
    shadow: z.enum(["none", "partial", "heavy"]),
    condition: z.enum(["excellent", "average", "needs_repair"]),
  }),
  notes: nullableTrimmedString,
  specialInstructions: nullableTrimmedString,
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(["reviewing", "open_for_quotes", "closed"]),
});

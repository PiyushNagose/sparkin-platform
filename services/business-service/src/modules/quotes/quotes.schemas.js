import { z } from "zod";

const nullableAmount = z.coerce.number().min(0).nullable().optional();

export const createQuoteSchema = z.object({
  pricing: z.object({
    totalPrice: z.coerce.number().min(1),
    equipmentCost: nullableAmount,
    laborCost: nullableAmount,
    permittingCost: nullableAmount,
  }),
  system: z.object({
    sizeKw: z.coerce.number().min(0.1),
    panelType: z.enum(["monocrystalline", "polycrystalline", "bifacial"]),
    inverterType: z.string().trim().min(2).max(120),
  }),
  timeline: z.object({
    installationWindow: z.enum(["2_4_weeks", "4_6_weeks", "6_8_weeks"]),
  }),
  proposalNotes: z
    .string()
    .trim()
    .transform((value) => value || null)
    .nullable()
    .optional(),
});

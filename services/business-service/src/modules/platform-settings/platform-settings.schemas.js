import { z } from "zod";

const positiveNumber = z.coerce.number().positive();

export const updatePlatformSettingsSchema = z.object({
  pricing: z.object({
    standardCostPerKw: positiveNumber,
    minBidAmount: positiveNumber,
    maxBidAmount: positiveNumber,
  }),
  bidding: z.object({
    windowHours: positiveNumber,
    autoExtendMinutes: z.coerce.number().min(0),
    maxVendorsPerLead: positiveNumber,
  }),
  subsidy: z.object({
    centralPct: z.coerce.number().min(0).max(100),
    maxAmount: z.coerce.number().min(0),
    residentialOnly: z.boolean(),
  }),
  states: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        key: z.enum(["andhra_pradesh", "telangana", "karnataka"]),
        name: z.string().trim().min(2),
        rate: positiveNumber,
      }),
    )
    .min(3),
});

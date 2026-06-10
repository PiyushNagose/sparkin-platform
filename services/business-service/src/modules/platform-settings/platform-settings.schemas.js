import { z } from "zod";

const positiveNumber = z.coerce.number().positive();

// State key: lowercase letters, digits, underscores (e.g. "andhra_pradesh", "karnataka")
const stateKeySchema = z
  .string()
  .trim()
  .min(2)
  .regex(/^[a-z0-9_]+$/, {
    message: "State key must be lowercase letters, digits, or underscores",
  });

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
    for1Kw: z.coerce.number().min(0),
    for2Kw: z.coerce.number().min(0),
    above3Kw: z.coerce.number().min(0),
    residentialOnly: z.boolean(),
  }),
  states: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        key: stateKeySchema,
        name: z.string().trim().min(2),
        rate: positiveNumber,
        solarYieldPerKwYear: z.coerce.number().min(0).optional().default(1500),
        costPerKwResidential: z.coerce
          .number()
          .min(0)
          .optional()
          .default(55000),
        costPerKwCommercial: z.coerce.number().min(0).optional().default(50000),
        pincodePrefixes: z
          .array(z.string().trim().min(1))
          .optional()
          .default([]),
        cities: z
          .array(z.string().trim().min(1).max(80))
          .optional()
          .default([]),
      }),
    )
    .min(1),
  discoms: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        stateKey: stateKeySchema,
        name: z.string().trim().min(2),
        code: z.string().trim().min(2).max(24),
        status: z.enum(["active", "disabled"]),
      }),
    )
    .default([]),
});

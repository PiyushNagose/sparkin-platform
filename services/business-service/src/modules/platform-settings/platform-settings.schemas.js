import { z } from "zod";

const positiveNumber = z.coerce.number().positive();
const supportedStates = ["andhra_pradesh", "telangana", "karnataka"];

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
        key: z.enum(supportedStates),
        name: z.string().trim().min(2),
        rate: positiveNumber,
      }),
    )
    .min(3),
  discoms: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        stateKey: z.enum(supportedStates),
        name: z.string().trim().min(2),
        code: z.string().trim().min(2).max(24),
        status: z.enum(["active", "disabled"]),
      }),
    )
    .default([]),
});

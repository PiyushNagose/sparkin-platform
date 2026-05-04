import { z } from "zod";

export const supportedStates = ["andhra_pradesh", "telangana", "karnataka"];

export const serviceabilityQuerySchema = z.object({
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  state: z.enum(supportedStates).optional(),
});

export const estimateSchema = z.object({
  propertyType: z.enum(["residential", "commercial"]),
  state: z.enum(supportedStates),
  city: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  monthlyBill: z.coerce.number().min(500).max(500000),
  monthlyUnits: z.coerce.number().min(50).max(100000).optional().nullable(),
  roofAreaSqFt: z.coerce.number().min(100).max(100000).optional().nullable(),
  sanctionedLoadKw: z.coerce.number().min(1).max(10000).optional().nullable(),
  connectionType: z.enum(["single_phase", "three_phase", "lt", "ht"]).optional().nullable(),
  daytimeUsagePercent: z.coerce.number().min(20).max(100).optional().nullable(),
  desiredOffsetPercent: z.coerce.number().min(50).max(100).optional().nullable(),
});

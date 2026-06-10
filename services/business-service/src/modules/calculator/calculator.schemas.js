import { z } from "zod";

// State key: lowercase letters, digits, underscores — validated dynamically
// by the service (we no longer maintain a hardcoded enum here).
const stateKeySchema = z
  .string()
  .trim()
  .min(2)
  .regex(/^[a-z0-9_]+$/, {
    message: "State key must be lowercase letters, digits, or underscores",
  });

export const serviceabilityQuerySchema = z.object({
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  state: stateKeySchema.optional(),
});

export const estimateSchema = z.object({
  propertyType: z.enum(["residential", "commercial"]),
  state: stateKeySchema,
  city: z.string().trim().min(2).max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  monthlyBill: z.coerce.number().min(500).max(500000),
  monthlyUnits: z.coerce.number().min(50).max(100000).optional().nullable(),
  roofAreaSqFt: z.coerce.number().min(100).max(100000).optional().nullable(),
  systemSizeKw: z.coerce.number().min(1).max(10000).optional().nullable(),
  sanctionedLoadKw: z.coerce.number().min(1).max(10000).optional().nullable(),
  connectionType: z
    .enum(["single_phase", "three_phase", "lt", "ht"])
    .optional()
    .nullable(),
  daytimeUsagePercent: z.coerce.number().min(20).max(100).optional().nullable(),
  desiredOffsetPercent: z.coerce
    .number()
    .min(50)
    .max(100)
    .optional()
    .nullable(),
});

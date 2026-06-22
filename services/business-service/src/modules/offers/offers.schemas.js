import { z } from "zod";

const applicableUsersSchema = z.object({
  leads: z.boolean().default(false),
  customers: z.boolean().default(false),
  vendors: z.boolean().default(false),
  allUsers: z.boolean().default(false),
});

export const createOfferSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().trim().max(1000).optional().default(""),
  couponCode: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30)
    .regex(/^[A-Z0-9]+$/i, "Coupon code can only contain letters and numbers"),
  discountType: z.enum(["percentage", "flat", "credit"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minOrderValue: z.number().min(0).optional().default(0),
  maxDiscountCap: z.number().min(0).nullable().optional(),
  usageLimitPerUser: z.number().int().min(1).optional().default(1),
  totalUsageLimit: z.number().int().min(1).nullable().optional(),
  applicableUsers: applicableUsersSchema.optional(),
  validFrom: z.string().datetime({ offset: true }),
  validTo: z.string().datetime({ offset: true }),
  status: z.enum(["active", "draft", "disabled", "scheduled"]).optional(),
  campaignType: z
    .enum(["public", "private", "vendor_exclusive"])
    .optional()
    .default("public"),
  tags: z.array(z.string().trim()).optional().default([]),
  saveAsDraft: z.boolean().optional().default(false),
});

export const updateOfferSchema = createOfferSchema
  .partial()
  .omit({ saveAsDraft: true });

export const toggleStatusSchema = z.object({
  status: z.enum(["active", "disabled", "draft"]),
});

export const validateCouponSchema = z.object({
  couponCode: z.string().trim().min(3).max(30),
  estimatedCost: z.coerce.number().min(0).optional().default(0),
});

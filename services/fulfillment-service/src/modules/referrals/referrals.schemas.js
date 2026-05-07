import { z } from "zod";

export const createReferralSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phoneNumber: z.string().trim().max(30).nullable().optional(),
  channel: z
    .enum(["direct_invite", "social_share", "email_campaign"])
    .optional(),
});

export const updateRewardStatusSchema = z.object({
  rewardStatus: z.enum(["pending", "earned", "paid"]),
});

export const updateReferralSettingsSchema = z.object({
  rewardType: z.string().trim().min(2).max(120),
  rewardAmount: z.coerce.number().min(0).max(1000000),
  minimumPurchaseCondition: z.string().trim().min(2).max(180),
  referralExpiryDays: z.coerce.number().int().min(1).max(365),
  programActive: z.boolean(),
});

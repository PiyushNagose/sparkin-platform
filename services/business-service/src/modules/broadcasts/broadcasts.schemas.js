import { z } from "zod";

const audienceSchema = z.object({
  leads: z.boolean().default(false),
  customers: z.boolean().default(false),
  vendors: z.boolean().default(false),
  allUsers: z.boolean().default(false),
});

const channelsSchema = z.object({
  notification: z.boolean().default(true),
  email: z.boolean().default(false),
  sms: z.boolean().default(false),
});

export const createBroadcastSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  messageType: z.enum(["info", "alert", "reminder"]).default("info"),
  audience: audienceSchema,
  channels: channelsSchema,
  timing: z.enum(["now", "scheduled"]).default("now"),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const saveDraftSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  messageType: z.enum(["info", "alert", "reminder"]).optional(),
  audience: audienceSchema.optional(),
  channels: channelsSchema.optional(),
  timing: z.enum(["now", "scheduled"]).optional(),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
});

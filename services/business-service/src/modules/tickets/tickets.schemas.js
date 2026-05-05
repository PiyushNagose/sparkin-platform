import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(3).max(300),
  description: z.string().trim().min(10).max(5000),
  issueType: z.string().trim().min(2).max(100),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  customerId: z.string().trim().optional(),
  customerName: z.string().trim().min(1).max(200),
  customerEmail: z.string().email().nullable().optional(),
  customerType: z.string().trim().optional(),
  customerPlan: z.string().trim().optional(),
  customerLocation: z.string().trim().nullable().optional(),
  assignedAgentName: z.string().trim().optional(),
  category: z.string().trim().optional(),
  categoryNote: z.string().trim().nullable().optional(),
  satisfactionNote: z.string().trim().nullable().optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        size: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

export const updateTicketSchema = z.object({
  title: z.string().trim().min(3).max(300).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  issueType: z.string().trim().min(2).max(100).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z
    .enum(["open", "in_progress", "resolved", "closed", "cancelled"])
    .optional(),
  assignedAgentId: z.string().trim().nullable().optional(),
  assignedAgentName: z.string().trim().nullable().optional(),
  category: z.string().trim().optional(),
  categoryNote: z.string().trim().nullable().optional(),
  satisfactionPotential: z.string().trim().optional(),
  satisfactionNote: z.string().trim().nullable().optional(),
});

export const addMessageSchema = z.object({
  text: z.string().trim().min(1).max(5000),
  isInternal: z.boolean().default(false),
  senderName: z.string().trim().optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        size: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

import { z } from "zod";

export const createPaymentInvoiceSchema = z.object({
  projectId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive(),
  dueAt: z.string().trim().datetime().nullable().optional(),
  method: z
    .enum([
      "upi",
      "net_banking",
      "card",
      "bank_transfer",
      "cash",
      "razorpay",
      "cod",
      "not_recorded",
    ])
    .default("not_recorded"),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "cancelled"]),
  method: z
    .enum([
      "upi",
      "net_banking",
      "card",
      "bank_transfer",
      "cash",
      "razorpay",
      "cod",
      "not_recorded",
    ])
    .optional(),
  paidAt: z.string().trim().datetime().nullable().optional(),
});

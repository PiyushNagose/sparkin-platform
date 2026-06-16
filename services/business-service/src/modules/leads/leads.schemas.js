import { z } from "zod";

const nullableTrimmedString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

const attachmentSchema = z.object({
  category: z.enum(["roof_photo", "electricity_bill", "photo_id"]),
  fileName: z.string().trim().min(1).max(160),
  mimeType: z.string().trim().min(3).max(120),
  size: z.coerce
    .number()
    .min(1)
    .max(2 * 1024 * 1024),
  dataUrl: z.string().min(20).max(3_000_000),
  capturedAt: z.string().datetime().nullable().optional(),
  location: z
    .object({
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
    })
    .optional(),
});

const roofAnalysisSchema = z
  .object({
    status: z.enum(["ideal", "good", "needs_review", "limited"]),
    statusLabel: z.string().trim().min(2).max(80),
    accuracyPercent: z.coerce.number().min(0).max(100),
    potentialKw: z.coerce.number().min(0),
    message: z.string().trim().max(240),
    findings: z.array(z.string().trim().min(1).max(120)).max(8).default([]),
    image: z
      .object({
        fileName: z.string().trim().max(160).optional().default(""),
        mimeType: z.string().trim().max(120).optional().default(""),
        size: z.coerce.number().min(0).optional().default(0),
        capturedAt: z.string().datetime().nullable().optional(),
      })
      .optional(),
    evaluatedAt: z.string().datetime(),
  })
  .nullable()
  .optional();

export const createLeadSchema = z.object({
  contact: z.object({
    fullName: z.string().trim().min(2).max(120),
    phoneNumber: z.string().trim().min(8).max(20),
    email: z.string().trim().email().nullable().optional(),
  }),
  installationAddress: z.object({
    street: z.string().trim().min(3).max(180),
    landmark: nullableTrimmedString,
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().trim().min(4).max(12),
  }),
  inspection: z
    .object({
      preferredDate: nullableTrimmedString,
      preferredTimeSlot: z
        .enum(["morning", "afternoon", "evening"])
        .nullable()
        .optional(),
    })
    .optional(),
  property: z.object({
    type: z.enum(["independent_house", "apartment", "commercial"]),
    roofType: z.enum(["flat", "sloped"]),
    ownership: z.enum(["owned", "rented"]),
    distributionCompany: nullableTrimmedString,
    connectionType: z
      .enum(["single_phase", "three_phase"])
      .nullable()
      .optional(),
    consumerNumber: nullableTrimmedString,
    sanctionedLoadKw: z.coerce.number().min(0).nullable().optional(),
  }),
  roof: z.object({
    sizeRange: z.enum(["under_500", "500_1000", "over_1000"]),
    shadow: z.enum(["none", "partial", "heavy"]),
    condition: z.enum(["excellent", "average", "needs_repair"]),
  }),
  attachments: z
    .object({
      roofPhotos: z.array(attachmentSchema).max(5).optional().default([]),
      electricityBill: z.array(attachmentSchema).max(3).optional().default([]),
      photoId: z.array(attachmentSchema).max(2).optional().default([]),
    })
    .optional(),
  roofAnalysis: roofAnalysisSchema,
  calculatorEstimate: z.unknown().nullable().optional(),
  notes: nullableTrimmedString,
  specialInstructions: nullableTrimmedString,
});

export const analyzeRoofSchema = z.object({
  attachment: attachmentSchema,
  roof: z
    .object({
      sizeRange: z.enum(["under_500", "500_1000", "over_1000"]).optional(),
      shadow: z.enum(["none", "partial", "heavy"]).optional(),
      condition: z.enum(["excellent", "average", "needs_repair"]).optional(),
    })
    .optional(),
  property: z
    .object({
      roofType: z.enum(["flat", "sloped"]).optional(),
      sanctionedLoadKw: z.coerce.number().min(0).nullable().optional(),
    })
    .optional(),
  calculatorEstimate: z.unknown().nullable().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum([
    "reviewing",
    "verified",
    "open_for_quotes",
    "rejected",
    "closed",
  ]),
});

export const updateLeadDetailsSchema = z.object({
  adminSystemSizeKw: z.coerce.number().positive().optional(),
  estimatedCost: z.coerce.number().positive().optional(),
  bidRange: z
    .object({
      minAmount: z.coerce.number().positive(),
      maxAmount: z.coerce.number().positive(),
    })
    .optional(),
});

export const markCommitmentPaidSchema = z.object({
  paid: z.boolean(),
});

export const assignLeadVendorsSchema = z.object({
  vendorIds: z.array(z.string().trim().min(1)).min(1).max(25),
  selectAll: z.boolean().optional().default(false),
});

export const rejectLeadSchema = z.object({
  reason: z.string().trim().max(500).nullable().optional(),
});

export const reassignLeadSchema = z.object({
  vendorIds: z.array(z.string().trim().min(1)).min(1).max(25).optional(),
  selectAll: z.boolean().optional().default(false),
  reason: z.string().trim().max(500).nullable().optional(),
});

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, required: true },
    landmark: { type: String, trim: true, default: null },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true, index: true },
    quoteId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    vendorEmail: { type: String, trim: true, lowercase: true, default: null },
    customer: {
      fullName: { type: String, trim: true, required: true },
      phoneNumber: { type: String, trim: true, required: true },
      email: { type: String, trim: true, lowercase: true, default: null },
    },
    installationAddress: addressSchema,
    status: {
      type: String,
      enum: [
        "site_audit_pending",
        "design_approval_pending",
        "installation_scheduled",
        "installation_in_progress",
        "inspection_pending",
        "activated",
        "completed",
        "cancelled",
      ],
      default: "site_audit_pending",
      index: true,
    },
    system: {
      sizeKw: { type: Number, required: true, min: 0 },
      panelType: { type: String, trim: true, required: true },
      inverterType: { type: String, trim: true, required: true },
    },
    pricing: {
      totalPrice: { type: Number, required: true, min: 0 },
      equipmentCost: { type: Number, min: 0, default: null },
      laborCost: { type: Number, min: 0, default: null },
      permittingCost: { type: Number, min: 0, default: null },
    },
    timeline: {
      installationWindow: { type: String, trim: true, required: true },
      siteAuditDueAt: { type: Date, default: null },
    },
    milestones: [
      {
        key: { type: String, required: true },
        title: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed"],
          default: "pending",
        },
        completedAt: { type: Date, default: null },
      },
    ],
    onboarding: {
      contactName: { type: String, trim: true, default: null },
      contactPhone: { type: String, trim: true, default: null },
      siteAccessNotes: { type: String, trim: true, default: null },
      preferredVisitWindow: {
        type: String,
        enum: ["morning", "afternoon", "evening", null],
        default: null,
      },
      completedAt: { type: Date, default: null },
    },
    createdFromQuoteAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

export const ProjectModel = mongoose.models.Project ?? mongoose.model("Project", projectSchema);

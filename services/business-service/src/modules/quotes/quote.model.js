import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "Lead" },
    customerId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    vendorEmail: { type: String, trim: true, lowercase: true, default: null },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "accepted", "rejected", "withdrawn"],
      default: "submitted",
      index: true,
    },
    pricing: {
      totalPrice: { type: Number, required: true, min: 0 },
      equipmentCost: { type: Number, min: 0, default: null },
      laborCost: { type: Number, min: 0, default: null },
      permittingCost: { type: Number, min: 0, default: null },
    },
    system: {
      sizeKw: { type: Number, required: true, min: 0 },
      panelType: {
        type: String,
        enum: ["monocrystalline", "polycrystalline", "bifacial"],
        required: true,
      },
      inverterType: { type: String, trim: true, required: true },
    },
    timeline: {
      installationWindow: {
        type: String,
        enum: ["2_4_weeks", "4_6_weeks", "6_8_weeks"],
        required: true,
      },
    },
    proposalNotes: { type: String, trim: true, default: null },
    submittedAt: { type: Date, default: Date.now },
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

export const QuoteModel = mongoose.models.Quote ?? mongoose.model("Quote", quoteSchema);

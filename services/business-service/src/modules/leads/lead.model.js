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

const leadSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "open_for_quotes", "quote_selected", "closed"],
      default: "submitted",
      index: true,
    },
    contact: {
      fullName: { type: String, trim: true, required: true },
      phoneNumber: { type: String, trim: true, required: true },
      email: { type: String, trim: true, lowercase: true, default: null },
    },
    installationAddress: addressSchema,
    inspection: {
      preferredDate: { type: String, trim: true, default: null },
      preferredTimeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening", null],
        default: null,
      },
    },
    property: {
      type: {
        type: String,
        enum: ["independent_house", "apartment", "commercial"],
        required: true,
      },
      roofType: { type: String, enum: ["flat", "sloped"], required: true },
      ownership: { type: String, enum: ["owned", "rented"], required: true },
      distributionCompany: { type: String, trim: true, default: null },
      connectionType: { type: String, enum: ["single_phase", "three_phase", null], default: null },
      consumerNumber: { type: String, trim: true, default: null },
      sanctionedLoadKw: { type: Number, min: 0, default: null },
    },
    roof: {
      sizeRange: {
        type: String,
        enum: ["under_500", "500_1000", "over_1000"],
        required: true,
      },
      shadow: {
        type: String,
        enum: ["none", "partial", "heavy"],
        required: true,
      },
      condition: {
        type: String,
        enum: ["excellent", "average", "needs_repair"],
        required: true,
      },
    },
    notes: { type: String, trim: true, default: null },
    specialInstructions: { type: String, trim: true, default: null },
    selection: {
      quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "Quote", default: null },
      vendorId: { type: String, default: null },
      selectedAt: { type: Date, default: null },
    },
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
    toObject: {
      virtuals: true,
    },
  },
);

export const LeadModel = mongoose.models.Lead ?? mongoose.model("Lead", leadSchema);

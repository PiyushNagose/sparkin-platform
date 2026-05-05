import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offerId: { type: String, required: true, unique: true, index: true },
    createdBy: { type: String, required: true, index: true },
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, default: "" },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
      unique: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat", "credit"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, min: 0, default: 0 },
    maxDiscountCap: { type: Number, min: 0, default: null },
    usageLimitPerUser: { type: Number, min: 1, default: 1 },
    totalUsageLimit: { type: Number, min: 0, default: null },
    usedCount: { type: Number, min: 0, default: 0 },
    applicableUsers: {
      leads: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
      vendors: { type: Boolean, default: false },
      allUsers: { type: Boolean, default: false },
    },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "draft", "expired", "disabled", "scheduled"],
      default: "draft",
      index: true,
    },
    campaignType: {
      type: String,
      enum: ["public", "private", "vendor_exclusive"],
      default: "public",
    },
    tags: [{ type: String, trim: true }],
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

// Auto-expire: if validTo is in the past and status is active, mark expired
offerSchema.virtual("isExpired").get(function () {
  return this.validTo < new Date() && this.status === "active";
});

export const OfferModel =
  mongoose.models.Offer ?? mongoose.model("Offer", offerSchema);

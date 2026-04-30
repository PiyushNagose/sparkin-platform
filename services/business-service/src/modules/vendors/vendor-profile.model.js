import mongoose from "mongoose";

const vendorDocumentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["company", "certification"],
      required: true,
    },
    title: { type: String, trim: true, required: true },
    fileName: { type: String, trim: true, required: true },
    mimeType: { type: String, trim: true, required: true },
    size: { type: Number, min: 1, required: true },
    url: { type: String, trim: true, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const vendorProfileSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true, index: true },
    account: {
      fullName: { type: String, trim: true, required: true },
      email: { type: String, trim: true, lowercase: true, required: true },
      phoneNumber: { type: String, trim: true, default: null },
    },
    company: {
      name: { type: String, trim: true, default: "" },
      businessType: { type: String, trim: true, default: "EPC Contractor" },
      gstNumber: { type: String, trim: true, default: "" },
      address: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      coverageArea: { type: String, trim: true, default: "" },
      experienceYears: { type: Number, min: 0, default: 0 },
      projectsCompleted: { type: Number, min: 0, default: 0 },
      totalCapacityMw: { type: Number, min: 0, default: 0 },
    },
    services: {
      installation: { type: Boolean, default: true },
      maintenance: { type: Boolean, default: false },
      siteSurvey: { type: Boolean, default: true },
      consultation: { type: Boolean, default: false },
    },
    documents: [vendorDocumentSchema],
    verificationStatus: {
      type: String,
      enum: ["draft", "submitted", "verified", "rejected"],
      default: "draft",
      index: true,
    },
    onboardingSubmittedAt: { type: Date, default: null },
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

export const VendorProfileModel =
  mongoose.models.VendorProfile ?? mongoose.model("VendorProfile", vendorProfileSchema);

import mongoose from "mongoose";

const stateRateSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, required: true },
    key: {
      type: String,
      enum: ["andhra_pradesh", "telangana", "karnataka"],
      required: true,
    },
    name: { type: String, trim: true, required: true },
    rate: { type: Number, min: 0, required: true },
  },
  { _id: false },
);

const platformSettingsSchema = new mongoose.Schema(
  {
    settingsId: {
      type: String,
      default: "global",
      unique: true,
      index: true,
    },
    pricing: {
      standardCostPerKw: { type: Number, min: 1, required: true },
      minBidAmount: { type: Number, min: 1, required: true },
      maxBidAmount: { type: Number, min: 1, required: true },
    },
    bidding: {
      windowHours: { type: Number, min: 1, required: true },
      autoExtendMinutes: { type: Number, min: 0, required: true },
      maxVendorsPerLead: { type: Number, min: 1, required: true },
    },
    subsidy: {
      centralPct: { type: Number, min: 0, max: 100, required: true },
      maxAmount: { type: Number, min: 0, required: true },
      residentialOnly: { type: Boolean, default: true },
    },
    states: [stateRateSchema],
    updatedBy: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

export const PlatformSettingsModel =
  mongoose.models.PlatformSettings ??
  mongoose.model("PlatformSettings", platformSettingsSchema);

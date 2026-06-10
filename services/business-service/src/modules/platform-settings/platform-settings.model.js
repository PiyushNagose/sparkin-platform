import mongoose from "mongoose";

const stateRateSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, required: true },
    key: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    rate: { type: Number, min: 0, required: true },
    // Comma-separated or array of city names for this state
    cities: { type: [String], default: [] },
    // Solar yield per kW per year (kWh) — used by calculator
    solarYieldPerKwYear: { type: Number, min: 0, default: 1500 },
    // Cost per kW for residential and commercial (paise/W → ₹/kW)
    costPerKwResidential: { type: Number, min: 0, default: 55000 },
    costPerKwCommercial: { type: Number, min: 0, default: 50000 },
    // Pincode prefixes that belong to this state (for auto-detect)
    pincodePrefixes: { type: [String], default: [] },
  },
  { _id: false },
);

const discomSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, required: true },
    stateKey: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    code: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
      required: true,
    },
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
      for1Kw: { type: Number, min: 0, required: true },
      for2Kw: { type: Number, min: 0, required: true },
      above3Kw: { type: Number, min: 0, required: true },
      residentialOnly: { type: Boolean, default: true },
    },
    states: [stateRateSchema],
    discoms: [discomSchema],
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

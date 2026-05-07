import mongoose from "mongoose";

const referralSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      immutable: true,
    },
    rewardType: {
      type: String,
      trim: true,
      default: "Referral Reward",
    },
    rewardAmount: {
      type: Number,
      min: 0,
      default: 1000,
    },
    minimumPurchaseCondition: {
      type: String,
      trim: true,
      default: "Min. 5kW Solar Installation",
    },
    referralExpiryDays: {
      type: Number,
      min: 1,
      max: 365,
      default: 60,
    },
    programActive: {
      type: Boolean,
      default: true,
    },
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

export const ReferralSettingsModel =
  mongoose.models.ReferralSettings ??
  mongoose.model("ReferralSettings", referralSettingsSchema);

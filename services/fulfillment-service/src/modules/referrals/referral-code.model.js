import mongoose from "mongoose";

const referralCodeSchema = new mongoose.Schema(
  {
    referrerId: { type: String, required: true, unique: true, index: true },
    referrerEmail: { type: String, trim: true, lowercase: true, default: null },
    referralCode: { type: String, required: true, unique: true, index: true },
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

export const ReferralCodeModel =
  mongoose.models.ReferralCode ??
  mongoose.model("ReferralCode", referralCodeSchema);

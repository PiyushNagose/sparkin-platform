import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrerId: { type: String, required: true, index: true },
    referrerEmail: { type: String, trim: true, lowercase: true, default: null },
    referralCode: { type: String, required: true, index: true },
    referredUserId: { type: String, default: null, index: true },
    leadId: { type: String, default: null, index: true },
    signedUpAt: { type: Date, default: null },
    bookedAt: { type: Date, default: null },
    channel: {
      type: String,
      enum: ["direct_invite", "social_share", "email_campaign", "whatsapp", "qr", "copy_link"],
      default: "direct_invite",
      index: true,
    },
    friend: {
      fullName: { type: String, trim: true, required: true },
      email: { type: String, trim: true, lowercase: true, required: true },
      phoneNumber: { type: String, trim: true, default: null },
    },
    status: {
      type: String,
      enum: ["invited", "signed_up", "installed", "rewarded"],
      default: "invited",
      index: true,
    },
    rewardAmount: { type: Number, min: 0, default: 5000 },
    rewardStatus: {
      type: String,
      enum: ["pending", "earned", "paid"],
      default: "pending",
      index: true,
    },
    activity: [
      {
        title: { type: String, required: true },
        note: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
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

referralSchema.index({ referrerId: 1, "friend.email": 1 }, { unique: true });
referralSchema.index({ referrerId: 1, createdAt: -1 });
referralSchema.index({ status: 1, createdAt: -1 });
referralSchema.index({ rewardStatus: 1, createdAt: -1 });

export const ReferralModel = mongoose.models.Referral ?? mongoose.model("Referral", referralSchema);

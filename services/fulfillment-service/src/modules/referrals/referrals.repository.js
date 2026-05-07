import { ReferralModel } from "./referral.model.js";
import { ReferralCodeModel } from "./referral-code.model.js";

function normalizeReferral(referral) {
  const value = referral?.toObject ? referral.toObject() : referral;

  if (!value) return value;

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

function normalizeReferrals(referrals) {
  return referrals.map((referral) => normalizeReferral(referral));
}

export const referralsRepository = {
  async ensureReferralCode({ referrerId, referrerEmail, referralCode }) {
    const code = await ReferralCodeModel.findOneAndUpdate(
      { referrerId },
      {
        $setOnInsert: { referrerId, referralCode },
        $set: { referrerEmail: referrerEmail ?? null },
      },
      { upsert: true, new: true },
    ).lean({ virtuals: true });

    return normalizeReferral(code);
  },

  async findReferralCode(referralCode) {
    const code = await ReferralCodeModel.findOne({
      referralCode: referralCode.toUpperCase(),
    }).lean({ virtuals: true });
    return normalizeReferral(code);
  },

  async create(referral) {
    const created = await ReferralModel.create(referral);
    return normalizeReferral(created);
  },

  async findForCustomer(customerId) {
    const referrals = await ReferralModel.find({ referrerId: customerId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeReferrals(referrals);
  },

  async findByFriendEmail(customerId, email) {
    const referral = await ReferralModel.findOne({ referrerId: customerId, "friend.email": email.toLowerCase() }).lean({ virtuals: true });
    return normalizeReferral(referral);
  },

  async findByReferredUserId(referredUserId) {
    const referral = await ReferralModel.findOne({ referredUserId })
      .sort({ updatedAt: -1 })
      .lean({ virtuals: true });
    return normalizeReferral(referral);
  },

  async findByCodeAndFriendEmail(referralCode, email) {
    const referral = await ReferralModel.findOne({
      referralCode: referralCode.toUpperCase(),
      "friend.email": email.toLowerCase(),
    }).lean({ virtuals: true });
    return normalizeReferral(referral);
  },

  async upsertTrackedReferral({ codeRecord, user, channel = "direct_invite", status = "signed_up", leadId = null, rewardAmount }) {
    const now = new Date();
    const email = user.email?.toLowerCase();
    const update = {
      $set: {
        referredUserId: user.userId,
        referrerEmail: codeRecord.referrerEmail ?? null,
        channel,
        status,
        rewardStatus: status === "installed" ? "earned" : "pending",
        ...(leadId ? { leadId, bookedAt: now } : {}),
        ...(status === "signed_up" ? { signedUpAt: now } : {}),
        ...(status === "installed" ? { signedUpAt: now, bookedAt: now } : {}),
      },
      $setOnInsert: {
        referrerId: codeRecord.referrerId,
        referralCode: codeRecord.referralCode,
        friend: {
          fullName: email?.split("@")[0] || "Referred Customer",
          email,
          phoneNumber: null,
        },
        rewardAmount,
        activity: [],
      },
      $push: {
        activity: {
          title: status === "installed" ? "Referred customer completed booking" : "Referred customer signed up",
          note: leadId ? `Booking linked to lead ${leadId}.` : `Referral code ${codeRecord.referralCode} was used.`,
          createdAt: now,
        },
      },
    };

    const referral = await ReferralModel.findOneAndUpdate(
      {
        referralCode: codeRecord.referralCode,
        "friend.email": email,
      },
      update,
      { upsert: true, new: true },
    ).lean({ virtuals: true });

    return normalizeReferral(referral);
  },

  async findAll() {
    const referrals = await ReferralModel.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeReferrals(referrals);
  },

  async updateRewardStatus(referralId, rewardStatus) {
    const referral = await ReferralModel.findByIdAndUpdate(
      referralId,
      { $set: { rewardStatus } },
      { new: true },
    ).lean({ virtuals: true });
    return normalizeReferral(referral);
  },
};

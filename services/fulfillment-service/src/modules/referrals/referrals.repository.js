import { ReferralModel } from "./referral.model.js";

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
};

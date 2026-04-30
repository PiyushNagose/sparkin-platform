import crypto from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import { referralsRepository } from "./referrals.repository.js";

const referrerRewardAmount = 5000;
const friendDiscountAmount = 2000;

function canUseReferrals(user) {
  return user.role === "customer" || user.role === "admin";
}

function makeReferralCode(user) {
  const base = (user.email || user.userId || "SPARKIN").split("@")[0].replace(/[^a-z0-9]/gi, "").toUpperCase();
  const suffix = crypto.createHash("sha1").update(user.userId).digest("hex").slice(0, 5).toUpperCase();
  return `SPK-${base.slice(0, 8) || "SOLAR"}-${suffix}`;
}

function buildReferralLink(code) {
  return `https://sparkin.in/ref/${encodeURIComponent(code)}`;
}

function buildSummary(user, referrals) {
  const successfulReferrals = referrals.filter((referral) => ["installed", "rewarded"].includes(referral.status)).length;
  const pendingReferrals = referrals.filter((referral) => !["installed", "rewarded"].includes(referral.status)).length;
  const totalEarnings = referrals
    .filter((referral) => ["earned", "paid"].includes(referral.rewardStatus))
    .reduce((sum, referral) => sum + referral.rewardAmount, 0);
  const availableEarnings = referrals
    .filter((referral) => referral.rewardStatus === "earned")
    .reduce((sum, referral) => sum + referral.rewardAmount, 0);
  const referralCode = makeReferralCode(user);

  return {
    referralCode,
    referralLink: buildReferralLink(referralCode),
    rewardAmount: referrerRewardAmount,
    friendDiscountAmount,
    invitesSent: referrals.length,
    successfulReferrals,
    pendingReferrals,
    totalEarnings,
    availableEarnings,
  };
}

export const referralsService = {
  async getReferralDashboard(user) {
    if (!canUseReferrals(user)) {
      throw new AppError(403, "Only customers can use referrals");
    }

    const referrals = await referralsRepository.findForCustomer(user.userId);

    return {
      summary: buildSummary(user, referrals),
      referrals,
    };
  },

  async createReferral(user, input) {
    if (!canUseReferrals(user)) {
      throw new AppError(403, "Only customers can create referrals");
    }

    if (input.email.toLowerCase() === user.email?.toLowerCase()) {
      throw new AppError(400, "You cannot refer your own email address");
    }

    const existing = await referralsRepository.findByFriendEmail(user.userId, input.email);

    if (existing) {
      throw new AppError(409, "This friend has already been referred");
    }

    const referralCode = makeReferralCode(user);
    const referral = await referralsRepository.create({
      referrerId: user.userId,
      referrerEmail: user.email ?? null,
      referralCode,
      friend: {
        fullName: input.fullName,
        email: input.email,
        phoneNumber: input.phoneNumber ?? null,
      },
      status: "invited",
      rewardAmount: referrerRewardAmount,
      rewardStatus: "pending",
      activity: [
        {
          title: "Referral invite created",
          note: `${input.fullName} can use ${referralCode} for a solar consultation discount.`,
          createdAt: new Date(),
        },
      ],
    });

    const referrals = await referralsRepository.findForCustomer(user.userId);

    return {
      referral,
      summary: buildSummary(user, referrals),
    };
  },
};

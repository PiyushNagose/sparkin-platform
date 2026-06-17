import crypto from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import { referralSettingsRepository } from "./referral-settings.repository.js";
import { referralsRepository } from "./referrals.repository.js";

function canUseReferrals(user) {
  return user.role === "customer";
}

function makeReferralCode(user) {
  const base = (user.email || user.userId || "SPARKIN")
    .split("@")[0]
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();
  const suffix = crypto
    .createHash("sha1")
    .update(user.userId)
    .digest("hex")
    .slice(0, 5)
    .toUpperCase();
  return `SPK-${base.slice(0, 8) || "SOLAR"}-${suffix}`;
}

function buildReferralLink(code) {
  return `/ref/${encodeURIComponent(code)}`;
}

function buildSummary(user, referrals, settings) {
  const successfulReferrals = referrals.filter((referral) =>
    ["installed", "rewarded"].includes(referral.status),
  ).length;
  const pendingReferrals = referrals.filter(
    (referral) => !["installed", "rewarded"].includes(referral.status),
  ).length;
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
    rewardAmount: settings.rewardAmount,
    friendDiscountAmount: settings.rewardAmount,
    rewardType: settings.rewardType,
    minimumPurchaseCondition: settings.minimumPurchaseCondition,
    referralExpiryDays: settings.referralExpiryDays,
    programActive: settings.programActive,
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
      throw new AppError(
        403,
        "Only customers can access the referral dashboard",
      );
    }

    const settings = await referralSettingsRepository.getSettings();
    const referralCode = makeReferralCode(user);
    await referralsRepository.ensureReferralCode({
      referrerId: user.userId,
      referrerEmail: user.email ?? null,
      referralCode,
    });
    const referrals = await referralsRepository.findForCustomer(user.userId);

    return {
      summary: buildSummary(user, referrals, settings),
      referrals,
    };
  },

  // Admin: list all referrals across all users
  async listAllReferrals(user) {
    if (user.role !== "admin") {
      throw new AppError(403, "Admin access required");
    }
    return referralsRepository.findAll();
  },

  async getAdminReferralSettings(user) {
    if (user.role !== "admin") {
      throw new AppError(403, "Admin access required");
    }

    return referralSettingsRepository.getSettings();
  },

  async updateAdminReferralSettings(user, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Admin access required");
    }

    return referralSettingsRepository.updateSettings(input);
  },

  // Admin: update payout status for a referral
  async updateRewardStatus(user, referralId, rewardStatus) {
    if (user.role !== "admin") {
      throw new AppError(403, "Admin access required");
    }
    if (!/^[a-f\d]{24}$/i.test(referralId)) {
      throw new AppError(400, "Invalid referral ID");
    }
    const referral = await referralsRepository.updateRewardStatus(
      referralId,
      rewardStatus,
    );
    if (!referral) throw new AppError(404, "Referral not found");
    return referral;
  },

  async createReferral(user, input) {
    if (!canUseReferrals(user)) {
      throw new AppError(403, "Only customers can create referrals");
    }

    if (input.email.toLowerCase() === user.email?.toLowerCase()) {
      throw new AppError(400, "You cannot refer your own email address");
    }

    const existing = await referralsRepository.findByFriendEmail(
      user.userId,
      input.email,
    );

    if (existing) {
      throw new AppError(409, "This friend has already been referred");
    }

    const settings = await referralSettingsRepository.getSettings();

    if (!settings.programActive) {
      throw new AppError(409, "Referral program is currently inactive");
    }

    const referralCode = makeReferralCode(user);
    await referralsRepository.ensureReferralCode({
      referrerId: user.userId,
      referrerEmail: user.email ?? null,
      referralCode,
    });
    const referral = await referralsRepository.create({
      referrerId: user.userId,
      referrerEmail: user.email ?? null,
      referralCode,
      channel: input.channel || "email_campaign",
      friend: {
        fullName: input.fullName,
        email: input.email,
        phoneNumber: input.phoneNumber ?? null,
      },
      status: "invited",
      rewardAmount: settings.rewardAmount,
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
      summary: buildSummary(user, referrals, settings),
    };
  },

  async trackSignup(user, input) {
    if (user.role !== "customer") {
      throw new AppError(403, "Only customers can use referral links");
    }

    const settings = await referralSettingsRepository.getSettings();
    if (!settings.programActive) {
      throw new AppError(409, "Referral program is currently inactive");
    }

    const codeRecord = await referralsRepository.findReferralCode(
      input.referralCode,
    );
    if (!codeRecord) {
      throw new AppError(404, "Referral code not found");
    }

    if (codeRecord.referrerId === user.userId) {
      throw new AppError(400, "You cannot use your own referral code");
    }

    const existing = await referralsRepository.findByReferredUserId(
      user.userId,
    );
    if (
      ["installed", "rewarded"].includes(existing?.status) ||
      ["earned", "paid"].includes(existing?.rewardStatus)
    ) {
      return { referral: existing };
    }

    const referral = await referralsRepository.upsertTrackedReferral({
      codeRecord,
      user,
      channel: input.channel || "direct_invite",
      status: "signed_up",
      rewardAmount: settings.rewardAmount,
    });

    return { referral };
  },

  async trackBooking(user, input) {
    if (user.role !== "customer") {
      throw new AppError(403, "Only customers can complete referral bookings");
    }

    const settings = await referralSettingsRepository.getSettings();
    if (!settings.programActive) {
      throw new AppError(409, "Referral program is currently inactive");
    }

    const codeRecord = await referralsRepository.findReferralCode(
      input.referralCode,
    );
    if (!codeRecord) {
      throw new AppError(404, "Referral code not found");
    }

    if (codeRecord.referrerId === user.userId) {
      throw new AppError(400, "You cannot use your own referral code");
    }

    // Idempotency: if this user's referral is already rewarded or paid, return
    // the existing record without re-writing it (prevents duplicate activity entries).
    const existing = await referralsRepository.findByReferredUserId(
      user.userId,
    );
    if (
      ["rewarded"].includes(existing?.status) ||
      ["earned", "paid"].includes(existing?.rewardStatus)
    ) {
      return { referral: existing };
    }

    const referral = await referralsRepository.upsertTrackedReferral({
      codeRecord,
      user,
      channel: input.channel || "direct_invite",
      status: "installed",
      leadId: input.leadId,
      rewardAmount: settings.rewardAmount,
    });

    return { referral };
  },
};

import { ReferralSettingsModel } from "./referral-settings.model.js";

function normalizeSettings(settings) {
  const value = settings?.toObject ? settings.toObject() : settings;

  if (!value) return value;

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

const defaultSettings = {
  rewardType: "Referral Reward",
  rewardAmount: 1000,
  minimumPurchaseCondition: "Min. 5kW Solar Installation",
  referralExpiryDays: 60,
  programActive: true,
};

export const referralSettingsRepository = {
  defaultSettings,

  async getSettings() {
    const settings = await ReferralSettingsModel.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default", ...defaultSettings } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean({ virtuals: true });

    return normalizeSettings(settings);
  },

  async updateSettings(patch) {
    const settings = await ReferralSettingsModel.findOneAndUpdate(
      { key: "default" },
      { $set: patch, $setOnInsert: { key: "default", ...defaultSettings } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean({ virtuals: true });

    return normalizeSettings(settings);
  },
};

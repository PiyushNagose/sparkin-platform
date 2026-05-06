import { AppError } from "../../common/errors/app-error.js";
import { defaultPlatformSettings } from "./platform-settings.defaults.js";
import { platformSettingsRepository } from "./platform-settings.repository.js";

function mergeWithDefaults(settings) {
  if (!settings) return defaultPlatformSettings;

  return {
    ...defaultPlatformSettings,
    ...settings,
    pricing: { ...defaultPlatformSettings.pricing, ...settings.pricing },
    bidding: { ...defaultPlatformSettings.bidding, ...settings.bidding },
    subsidy: { ...defaultPlatformSettings.subsidy, ...settings.subsidy },
    states: settings.states?.length ? settings.states : defaultPlatformSettings.states,
  };
}

async function getSettings() {
  const settings = await platformSettingsRepository.findGlobal();
  return mergeWithDefaults(settings);
}

async function updateSettings(user, input) {
  if (user.role !== "admin") {
    throw new AppError(403, "Only admins can update platform settings");
  }

  if (Number(input.pricing.minBidAmount) >= Number(input.pricing.maxBidAmount)) {
    throw new AppError(400, "Minimum bid amount must be less than maximum bid amount");
  }

  const requiredStates = new Set(["andhra_pradesh", "telangana", "karnataka"]);
  const incomingStates = new Set(input.states.map((state) => state.key));
  const missing = [...requiredStates].filter((state) => !incomingStates.has(state));

  if (missing.length) {
    throw new AppError(400, "Platform settings must include Andhra Pradesh, Telangana, and Karnataka rates");
  }

  const settings = await platformSettingsRepository.upsertGlobal({
    ...input,
    updatedBy: user.userId,
  });

  return mergeWithDefaults(settings);
}

function getStateRate(settings, stateKey, propertyType = "residential") {
  const stateRate = settings.states.find((state) => state.key === stateKey);
  const baseRate = Number(stateRate?.rate) || 7;
  return propertyType === "commercial" ? Number((baseRate * 1.35).toFixed(2)) : baseRate;
}

export const platformSettingsService = {
  getSettings,
  updateSettings,
  getStateRate,
};

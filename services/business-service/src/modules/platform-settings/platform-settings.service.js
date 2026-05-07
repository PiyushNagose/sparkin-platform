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
    discoms: settings.discoms?.length ? settings.discoms : defaultPlatformSettings.discoms,
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

function calculateResidentialSubsidy(settings, systemSizeKw, propertyType = "residential") {
  if (propertyType === "commercial" && settings.subsidy.residentialOnly) {
    return 0;
  }

  const sizeKw = Number(systemSizeKw) || 0;

  if (sizeKw < 1) {
    return 0;
  }

  const amountFor1Kw = Number(settings.subsidy.for1Kw) || 0;
  const amountFor2Kw = Number(settings.subsidy.for2Kw) || amountFor1Kw;
  const amountAbove3Kw = Number(settings.subsidy.above3Kw) || amountFor2Kw;
  const tierOneRate = amountFor1Kw;
  const tierTwoRate = Math.max(0, amountFor2Kw - amountFor1Kw);
  const tierThreeRate = Math.max(0, amountAbove3Kw - amountFor2Kw);

  if (sizeKw <= 1) {
    return Math.round(sizeKw * tierOneRate);
  }

  if (sizeKw <= 2) {
    return Math.round(amountFor1Kw + (sizeKw - 1) * tierTwoRate);
  }

  if (sizeKw <= 3) {
    return Math.round(amountFor2Kw + (sizeKw - 2) * tierThreeRate);
  }

  return Math.round(amountAbove3Kw);
}

export const platformSettingsService = {
  getSettings,
  updateSettings,
  getStateRate,
  calculateResidentialSubsidy,
};

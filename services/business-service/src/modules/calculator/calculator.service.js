import { AppError } from "../../common/errors/app-error.js";
import { platformSettingsService } from "../platform-settings/platform-settings.service.js";

// ─── utilities ────────────────────────────────────────────────────────────────

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "_");
}

// ─── state resolution ────────────────────────────────────────────────────────

/**
 * Find a state config from the DB-driven settings list.
 * Matches by key (e.g. "andhra_pradesh") or display name.
 */
function resolveStateProfile(states, stateInput) {
  if (!stateInput || !states?.length) return null;
  const normalized = normalizeKey(stateInput);
  // exact key match first
  const byKey = states.find((s) => s.key === normalized);
  if (byKey) return byKey;
  // fallback: match on normalised name
  return states.find((s) => normalizeKey(s.name) === normalized) || null;
}

/**
 * Try to infer a state from a 6-digit pincode using the stored prefixes.
 */
function inferStateFromPincode(states, pincode) {
  if (!pincode || !states?.length) return null;
  const pin = String(pincode).trim();
  for (const state of states) {
    if (!state.pincodePrefixes?.length) continue;
    for (const prefix of state.pincodePrefixes) {
      if (pin.startsWith(prefix)) return state;
    }
  }
  return null;
}

// ─── serviceability ──────────────────────────────────────────────────────────

function getServiceability({ pincode, state, city }, settings) {
  const states = settings?.states || [];

  const selectedProfile = resolveStateProfile(states, state);
  const pincodeProfile = inferStateFromPincode(states, pincode);
  const resolvedProfile = selectedProfile || pincodeProfile;

  const supportedStateNames = states.map((s) => s.name);

  if (!resolvedProfile) {
    return {
      serviceable: false,
      reason: supportedStateNames.length
        ? `This location is outside the supported regions: ${supportedStateNames.join(", ")}.`
        : "No serviceable states have been configured yet. Please contact support.",
      pincode,
      selectedState: state || null,
      supportedStates: supportedStateNames,
    };
  }

  // If a specific state was requested but it doesn't match the pincode prefix, warn
  // but still allow (admin may not have configured prefixes for all states).
  const confidence =
    pincodeProfile?.key === resolvedProfile.key
      ? "pincode_match"
      : "state_selected";

  const cities = resolvedProfile.cities || [];
  const cityFallback = cities[0] || resolvedProfile.name;

  return {
    serviceable: true,
    state: resolvedProfile.key,
    stateName: resolvedProfile.name,
    city: city || cityFallback,
    discoms:
      (settings.discoms || [])
        .filter(
          (d) => d.stateKey === resolvedProfile.key && d.status !== "disabled",
        )
        .map((d) => d.code) || [],
    pincode,
    supportedCities: cities,
    confidence,
  };
}

// ─── EMI helper ──────────────────────────────────────────────────────────────

function calculateEmi(principal, annualRate = 0.0865, months = 60) {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 12;
  return Math.round(
    (principal * monthlyRate * (1 + monthlyRate) ** months) /
      ((1 + monthlyRate) ** months - 1),
  );
}

// ─── estimate ────────────────────────────────────────────────────────────────

async function buildEstimate(input) {
  const settings = await platformSettingsService.getSettings();

  const serviceability = getServiceability(input, settings);

  if (!serviceability.serviceable) {
    throw new AppError(422, serviceability.reason, { serviceability });
  }

  const profile = resolveStateProfile(settings.states, serviceability.state);
  const isCommercial = input.propertyType === "commercial";

  // Tariff — commercial gets a 35% premium over the base residential rate
  const tariff = platformSettingsService.getStateRate(
    settings,
    serviceability.state,
    input.propertyType,
  );

  // Solar generation assumptions from state profile (or safe defaults)
  const solarYieldPerKwYear = Number(profile.solarYieldPerKwYear) || 1500;
  const derateFactor = 0.82;

  // Cost per kW from state profile or global pricing setting
  const defaultCostPerKw =
    Number(settings.pricing.standardCostPerKw) ||
    (isCommercial
      ? Number(profile.costPerKwCommercial) || 50000
      : Number(profile.costPerKwResidential) || 55000);
  const costPerKw = isCommercial
    ? Number(profile.costPerKwCommercial) || defaultCostPerKw
    : Number(profile.costPerKwResidential) || defaultCostPerKw;

  const monthlyUnits = input.monthlyUnits || input.monthlyBill / tariff;
  const annualConsumption = monthlyUnits * 12;
  const desiredOffset =
    (input.desiredOffsetPercent || (isCommercial ? 75 : 90)) / 100;

  const billDrivenSystemSize =
    (annualConsumption * desiredOffset) / (solarYieldPerKwYear * derateFactor);

  const requestedSystemSize = Number(input.systemSizeKw || 0);
  const rawSystemSize =
    requestedSystemSize > 0 ? requestedSystemSize : billDrivenSystemSize;

  const sanctionedLimit = input.sanctionedLoadKw
    ? input.sanctionedLoadKw * 1.15
    : Infinity;
  const roofLimit = input.roofAreaSqFt ? input.roofAreaSqFt / 90 : Infinity;
  const recommendedSystemSizeKw = clamp(
    rawSystemSize,
    1,
    Math.min(roofLimit, sanctionedLimit, isCommercial ? 500 : 10),
  );
  const roundedSystemSizeKw = round(recommendedSystemSizeKw, 1);

  const annualGenerationKwh = Math.round(
    roundedSystemSizeKw * solarYieldPerKwYear * derateFactor,
  );
  const monthlyGenerationKwh = Math.round(annualGenerationKwh / 12);
  const requiredRoofAreaSqFt = Math.ceil(roundedSystemSizeKw * 90);
  const roofUtilizationPercent = input.roofAreaSqFt
    ? Math.min(
        100,
        Math.round((requiredRoofAreaSqFt / input.roofAreaSqFt) * 100),
      )
    : null;

  const firstYearSavings = Math.round(
    Math.min(annualGenerationKwh, annualConsumption) * tariff,
  );
  const monthlySavings = Math.round(firstYearSavings / 12);

  const grossCost = Math.round(roundedSystemSizeKw * costPerKw);
  const subsidy = platformSettingsService.calculateResidentialSubsidy(
    settings,
    roundedSystemSizeKw,
    input.propertyType,
  );
  const netCost = Math.max(0, grossCost - subsidy);
  const paybackYears = firstYearSavings
    ? round(netCost / firstYearSavings, 1)
    : null;

  const degradation = 0.01;
  const inflation = 0.03;
  const lifetimeYears = 25;
  const lifetimeSavings = Array.from({ length: lifetimeYears }).reduce(
    (sum, _, index) => {
      const generationMultiplier = (1 - degradation) ** index;
      const tariffMultiplier = (1 + inflation) ** index;
      return sum + firstYearSavings * generationMultiplier * tariffMultiplier;
    },
    0,
  );

  const co2OffsetKgYear = Math.round(annualGenerationKwh * 0.71);
  const treesEquivalent = Math.round(co2OffsetKgYear / 21);

  return {
    id: `calc_${Date.now()}`,
    createdAt: new Date().toISOString(),
    input: {
      ...input,
      monthlyUnits: Math.round(monthlyUnits),
      desiredOffsetPercent: Math.round(desiredOffset * 100),
      systemSizeKw: requestedSystemSize > 0 ? requestedSystemSize : null,
    },
    serviceability,
    assumptions: {
      tariffPerUnit: tariff,
      solarYieldPerKwYear,
      derateFactor,
      standardCostPerKw: costPerKw,
      annualPanelDegradationPercent: 1,
      annualElectricityInflationPercent: 3,
      roofAreaPerKwSqFt: 90,
      subsidyNote: isCommercial
        ? "Commercial projects are not eligible for residential PM Surya Ghar subsidy."
        : `Residential central subsidy estimated from platform settings slabs: 1kW ${settings.subsidy.for1Kw}, 2kW ${settings.subsidy.for2Kw}, 3kW+ ${settings.subsidy.above3Kw}.`,
    },
    system: {
      recommendedSizeKw: roundedSystemSizeKw,
      requiredRoofAreaSqFt,
      availableRoofAreaSqFt: input.roofAreaSqFt || null,
      roofUtilizationPercent,
      panelCount: Math.ceil((roundedSystemSizeKw * 1000) / 540),
      annualGenerationKwh,
      monthlyGenerationKwh,
      energyOffsetPercent: Math.min(
        100,
        Math.round((annualGenerationKwh / annualConsumption) * 100),
      ),
    },
    savings: {
      monthly: monthlySavings,
      annual: firstYearSavings,
      fiveYear: Math.round(lifetimeSavings * (5 / lifetimeYears)),
      lifetime: Math.round(lifetimeSavings),
      paybackYears,
      roiPercentAnnual: netCost
        ? round((firstYearSavings / netCost) * 100, 1)
        : null,
    },
    investment: {
      grossCost,
      subsidy,
      netCost,
      emi: calculateEmi(netCost),
      emiTenureMonths: 60,
      downPayment: isCommercial ? Math.round(netCost * 0.2) : 0,
    },
    governmentSupport: {
      schemeName: "PM Surya Ghar: Muft Bijli Yojana",
      totalSubsidy: subsidy,
      residentialOnly: settings.subsidy.residentialOnly,
      slabs: {
        for1Kw: Number(settings.subsidy.for1Kw) || 0,
        for2Kw: Number(settings.subsidy.for2Kw) || 0,
        above3Kw: Number(settings.subsidy.above3Kw) || 0,
      },
      benefitCards: [
        {
          title: "Subsidy Value",
          description:
            "Direct central government support based on your configured system size slab.",
        },
        {
          title: "Lowered Loan Load",
          description:
            "Reduced upfront project cost helps improve loan eligibility and EMI comfort.",
        },
        {
          title: "DBT / DISCOM Ready",
          description:
            "Designed to align with residential rooftop subsidy planning and approval workflows.",
        },
      ],
    },
    impact: {
      co2OffsetKgYear,
      treesEquivalent,
      equivalentKmAvoided: Math.round(co2OffsetKgYear * 4.1),
    },
  };
}

// ─── serviceability endpoint helper (uses live settings) ────────────────────

async function getServiceabilityLive(query) {
  const settings = await platformSettingsService.getSettings();
  return getServiceability(query, settings);
}

export const calculatorService = {
  getServiceability: getServiceabilityLive,
  buildEstimate,
};

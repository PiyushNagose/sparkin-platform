import { AppError } from "../../common/errors/app-error.js";

const stateProfiles = {
  andhra_pradesh: {
    label: "Andhra Pradesh",
    aliases: ["andhra pradesh", "ap"],
    pincodePrefixes: ["50", "51", "52", "53"],
    discoms: ["APSPDCL", "APEPDCL"],
    cityFallback: "Vijayawada",
    residentialTariff: 7.2,
    commercialTariff: 9.6,
    solarYieldPerKwYear: 1550,
    costPerWattResidential: 62000,
    costPerWattCommercial: 52000,
  },
  telangana: {
    label: "Telangana",
    aliases: ["telangana", "ts"],
    pincodePrefixes: ["50"],
    discoms: ["TSSPDCL", "TSNPDCL"],
    cityFallback: "Hyderabad",
    residentialTariff: 7.4,
    commercialTariff: 10.2,
    solarYieldPerKwYear: 1580,
    costPerWattResidential: 63000,
    costPerWattCommercial: 53000,
  },
  karnataka: {
    label: "Karnataka",
    aliases: ["karnataka", "ka"],
    pincodePrefixes: ["56", "57", "58", "59"],
    discoms: ["BESCOM", "MESCOM", "HESCOM", "GESCOM", "CESC"],
    cityFallback: "Bengaluru",
    residentialTariff: 7.8,
    commercialTariff: 10.8,
    solarYieldPerKwYear: 1520,
    costPerWattResidential: 64000,
    costPerWattCommercial: 54000,
  },
};

const stateByPincodeHints = [
  { test: (pin) => /^50[0-9]{4}$/.test(pin), state: "telangana" },
  { test: (pin) => /^5[1-3][0-9]{4}$/.test(pin), state: "andhra_pradesh" },
  { test: (pin) => /^5[6-9][0-9]{4}$/.test(pin), state: "karnataka" },
];

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeState(value) {
  const normalized = String(value || "").trim().toLowerCase().replaceAll(/\s+/g, "_");
  if (stateProfiles[normalized]) return normalized;

  return Object.entries(stateProfiles).find(([, profile]) => profile.aliases.includes(String(value || "").trim().toLowerCase()))?.[0] || null;
}

function inferStateFromPincode(pincode) {
  return stateByPincodeHints.find((hint) => hint.test(pincode))?.state || null;
}

function getServiceability({ pincode, state }) {
  const selectedState = normalizeState(state);
  const inferredState = inferStateFromPincode(pincode);
  const resolvedState = selectedState || inferredState;
  const profile = resolvedState ? stateProfiles[resolvedState] : null;

  if (!profile || (selectedState && inferredState !== selectedState)) {
    return {
      serviceable: false,
      reason: "This pincode is outside Sparkin's current calculator coverage.",
      pincode,
      selectedState: selectedState || null,
      inferredState: inferredState || null,
      supportedStates: Object.values(stateProfiles).map((item) => item.label),
    };
  }

  return {
    serviceable: true,
    state: resolvedState,
    stateName: profile.label,
    city: profile.cityFallback,
    discoms: profile.discoms,
    pincode,
    confidence: inferredState === resolvedState ? "pincode_match" : "state_selected",
  };
}

function calculateResidentialSubsidy(systemSizeKw) {
  if (systemSizeKw < 1) return 0;
  if (systemSizeKw <= 2) return Math.round(systemSizeKw * 30000);
  if (systemSizeKw <= 3) return Math.round(60000 + (systemSizeKw - 2) * 18000);
  return 78000;
}

function calculateEmi(principal, annualRate = 0.0865, months = 60) {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 12;
  return Math.round((principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1));
}

function buildEstimate(input) {
  const serviceability = getServiceability(input);

  if (!serviceability.serviceable) {
    throw new AppError(422, serviceability.reason, { serviceability });
  }

  const profile = stateProfiles[serviceability.state];
  const isCommercial = input.propertyType === "commercial";
  const tariff = isCommercial ? profile.commercialTariff : profile.residentialTariff;
  const monthlyUnits = input.monthlyUnits || input.monthlyBill / tariff;
  const annualConsumption = monthlyUnits * 12;
  const desiredOffset = (input.desiredOffsetPercent || (isCommercial ? 75 : 90)) / 100;
  const derateFactor = 0.82;
  const rawSystemSize = annualConsumption * desiredOffset / (profile.solarYieldPerKwYear * derateFactor);
  const sanctionedLimit = input.sanctionedLoadKw ? input.sanctionedLoadKw * 1.15 : Infinity;
  const roofLimit = input.roofAreaSqFt ? input.roofAreaSqFt / 90 : Infinity;
  const recommendedSystemSizeKw = clamp(rawSystemSize, 1, Math.min(roofLimit, sanctionedLimit, isCommercial ? 500 : 10));
  const roundedSystemSizeKw = round(recommendedSystemSizeKw, 1);
  const annualGenerationKwh = Math.round(roundedSystemSizeKw * profile.solarYieldPerKwYear * derateFactor);
  const monthlyGenerationKwh = Math.round(annualGenerationKwh / 12);
  const firstYearSavings = Math.round(Math.min(annualGenerationKwh, annualConsumption) * tariff);
  const monthlySavings = Math.round(firstYearSavings / 12);
  const grossCost = Math.round(roundedSystemSizeKw * (isCommercial ? profile.costPerWattCommercial : profile.costPerWattResidential));
  const subsidy = isCommercial ? 0 : calculateResidentialSubsidy(roundedSystemSizeKw);
  const netCost = Math.max(0, grossCost - subsidy);
  const paybackYears = firstYearSavings ? round(netCost / firstYearSavings, 1) : null;
  const degradation = 0.01;
  const inflation = 0.03;
  const lifetimeYears = 25;
  const lifetimeSavings = Array.from({ length: lifetimeYears }).reduce((sum, _, index) => {
    const generationMultiplier = (1 - degradation) ** index;
    const tariffMultiplier = (1 + inflation) ** index;
    return sum + firstYearSavings * generationMultiplier * tariffMultiplier;
  }, 0);
  const co2OffsetKgYear = Math.round(annualGenerationKwh * 0.71);
  const treesEquivalent = Math.round(co2OffsetKgYear / 21);

  return {
    id: `calc_${Date.now()}`,
    createdAt: new Date().toISOString(),
    input: {
      ...input,
      monthlyUnits: Math.round(monthlyUnits),
      desiredOffsetPercent: Math.round(desiredOffset * 100),
    },
    serviceability,
    assumptions: {
      tariffPerUnit: tariff,
      solarYieldPerKwYear: profile.solarYieldPerKwYear,
      derateFactor,
      annualPanelDegradationPercent: 1,
      annualElectricityInflationPercent: 3,
      roofAreaPerKwSqFt: 90,
      subsidyNote: isCommercial ? "Commercial projects are not eligible for residential PM Surya Ghar subsidy." : "Residential central subsidy estimated under PM Surya Ghar and capped at Rs 78,000.",
    },
    system: {
      recommendedSizeKw: roundedSystemSizeKw,
      requiredRoofAreaSqFt: Math.ceil(roundedSystemSizeKw * 90),
      panelCount: Math.ceil((roundedSystemSizeKw * 1000) / 540),
      annualGenerationKwh,
      monthlyGenerationKwh,
      energyOffsetPercent: Math.min(100, Math.round((annualGenerationKwh / annualConsumption) * 100)),
    },
    savings: {
      monthly: monthlySavings,
      annual: firstYearSavings,
      fiveYear: Math.round(lifetimeSavings * (5 / lifetimeYears)),
      lifetime: Math.round(lifetimeSavings),
      paybackYears,
      roiPercentAnnual: netCost ? round((firstYearSavings / netCost) * 100, 1) : null,
    },
    investment: {
      grossCost,
      subsidy,
      netCost,
      emi: calculateEmi(netCost),
      emiTenureMonths: 60,
      downPayment: isCommercial ? Math.round(netCost * 0.2) : 0,
    },
    impact: {
      co2OffsetKgYear,
      treesEquivalent,
      equivalentKmAvoided: Math.round(co2OffsetKgYear * 4.1),
    },
  };
}

export const calculatorService = {
  getServiceability,
  buildEstimate,
};

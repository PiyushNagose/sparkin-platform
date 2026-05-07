const defaultSubsidySettings = {
  for1Kw: 30000,
  for2Kw: 60000,
  above3Kw: 78000,
  residentialOnly: true,
};

export function normalizeSubsidySettings(subsidy = {}) {
  const normalized = {
    ...defaultSubsidySettings,
    ...subsidy,
  };

  if (subsidy?.centralPct || subsidy?.maxAmount) {
    normalized.for1Kw = defaultSubsidySettings.for1Kw;
    normalized.for2Kw = defaultSubsidySettings.for2Kw;
    normalized.above3Kw = Number(subsidy.maxAmount) || defaultSubsidySettings.above3Kw;
  }

  return {
    for1Kw: Number(normalized.for1Kw) || 0,
    for2Kw: Number(normalized.for2Kw) || 0,
    above3Kw: Number(normalized.above3Kw) || 0,
    residentialOnly: normalized.residentialOnly !== false,
  };
}

export function calculateSubsidyAmount(subsidySettings, systemSizeKw, propertyType = "residential") {
  const settings = normalizeSubsidySettings(subsidySettings);
  const sizeKw = Number(systemSizeKw) || 0;

  if (propertyType === "commercial" && settings.residentialOnly) {
    return 0;
  }

  if (sizeKw < 1) {
    return 0;
  }

  const amountFor1Kw = settings.for1Kw;
  const amountFor2Kw = settings.for2Kw || amountFor1Kw;
  const amountAbove3Kw = settings.above3Kw || amountFor2Kw;
  const tierTwoRate = Math.max(0, amountFor2Kw - amountFor1Kw);
  const tierThreeRate = Math.max(0, amountAbove3Kw - amountFor2Kw);

  if (sizeKw <= 1) {
    return Math.round(sizeKw * amountFor1Kw);
  }

  if (sizeKw <= 2) {
    return Math.round(amountFor1Kw + (sizeKw - 1) * tierTwoRate);
  }

  if (sizeKw <= 3) {
    return Math.round(amountFor2Kw + (sizeKw - 2) * tierThreeRate);
  }

  return Math.round(amountAbove3Kw);
}

export function buildGovernmentSupportSummary(subsidySettings, subsidyAmount) {
  const settings = normalizeSubsidySettings(subsidySettings);

  return {
    schemeName: "PM Surya Ghar: Muft Bijli Yojana",
    totalSubsidy: Number(subsidyAmount) || 0,
    slabs: settings,
    benefitCards: [
      {
        title: "Subsidy Value",
        description: "Direct benefit based on configured residential slab support.",
      },
      {
        title: "Lowered Loan Load",
        description: "Less financed amount keeps EMI and payback pressure lower.",
      },
      {
        title: "DBT / DISCOM Ready",
        description: "Reflects the platform subsidy configuration used in project planning.",
      },
    ],
  };
}

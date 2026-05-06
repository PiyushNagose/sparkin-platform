export const defaultPlatformSettings = {
  pricing: {
    standardCostPerKw: 55000,
    minBidAmount: 45000,
    maxBidAmount: 85000,
  },
  bidding: {
    windowHours: 48,
    autoExtendMinutes: 30,
    maxVendorsPerLead: 5,
  },
  subsidy: {
    centralPct: 40,
    maxAmount: 78000,
    residentialOnly: true,
  },
  states: [
    { id: "ap", key: "andhra_pradesh", name: "Andhra Pradesh", rate: 7.5 },
    { id: "ts", key: "telangana", name: "Telangana", rate: 6.2 },
    { id: "ka", key: "karnataka", name: "Karnataka", rate: 8.1 },
  ],
};

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
    for1Kw: 30000,
    for2Kw: 60000,
    above3Kw: 78000,
    residentialOnly: true,
  },
  states: [
    { id: "ap", key: "andhra_pradesh", name: "Andhra Pradesh", rate: 7.5 },
    { id: "ts", key: "telangana", name: "Telangana", rate: 6.2 },
    { id: "ka", key: "karnataka", name: "Karnataka", rate: 8.1 },
  ],
  discoms: [
    { id: "apspdcl", stateKey: "andhra_pradesh", name: "Southern Power Distribution Company of AP", code: "APSPDCL", status: "active" },
    { id: "apepdcl", stateKey: "andhra_pradesh", name: "Eastern Power Distribution Company of AP", code: "APEPDCL", status: "active" },
    { id: "tsspdcl", stateKey: "telangana", name: "Southern Power Distribution Company of Telangana", code: "TSSPDCL", status: "active" },
    { id: "tsnpdcl", stateKey: "telangana", name: "Northern Power Distribution Company of Telangana", code: "TSNPDCL", status: "active" },
    { id: "bescom", stateKey: "karnataka", name: "Bangalore Electricity Supply Company", code: "BESCOM", status: "active" },
    { id: "mescom", stateKey: "karnataka", name: "Mangalore Electricity Supply Company", code: "MESCOM", status: "active" },
    { id: "hescom", stateKey: "karnataka", name: "Hubli Electricity Supply Company", code: "HESCOM", status: "active" },
    { id: "gescom", stateKey: "karnataka", name: "Gulbarga Electricity Supply Company", code: "GESCOM", status: "active" },
    { id: "cesc", stateKey: "karnataka", name: "Chamundeshwari Electricity Supply Corporation", code: "CESC", status: "active" },
  ],
};

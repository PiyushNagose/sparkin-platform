const estimateKey = "sparkin_calculator_estimate";
const serviceabilityKey = "sparkin_calculator_serviceability";

function readJson(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export const calculatorStorage = {
  setEstimate(estimate) {
    sessionStorage.setItem(estimateKey, JSON.stringify(estimate));
  },

  getEstimate() {
    return readJson(estimateKey);
  },

  clearEstimate() {
    sessionStorage.removeItem(estimateKey);
  },

  setServiceability(serviceability) {
    sessionStorage.setItem(serviceabilityKey, JSON.stringify(serviceability));
  },

  getServiceability() {
    return readJson(serviceabilityKey);
  },
};

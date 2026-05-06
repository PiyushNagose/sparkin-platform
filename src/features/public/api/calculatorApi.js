import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet } from "@/shared/lib/http/requestCache";

export const calculatorApi = {
  async checkServiceability(params, options = {}) {
    const { data } = await cachedGet(businessClient, "/calculator/serviceability", {
      ...options,
      params,
      ttlMs: 30000,
    });
    return data.serviceability;
  },

  async createEstimate(payload) {
    const { data } = await businessClient.post("/calculator/estimate", payload);
    return data.estimate;
  },
};

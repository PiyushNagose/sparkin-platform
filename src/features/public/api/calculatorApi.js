import { businessClient } from "@/shared/lib/http/businessClient";

export const calculatorApi = {
  async checkServiceability(params) {
    const { data } = await businessClient.get("/calculator/serviceability", { params });
    return data.serviceability;
  },

  async createEstimate(payload) {
    const { data } = await businessClient.post("/calculator/estimate", payload);
    return data.estimate;
  },
};

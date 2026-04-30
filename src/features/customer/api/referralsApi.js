import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";

export const referralsApi = {
  async getDashboard() {
    const { data } = await fulfillmentClient.get("/referrals");
    return data;
  },

  async createReferral(payload) {
    const { data } = await fulfillmentClient.post("/referrals", payload);
    return data;
  },
};

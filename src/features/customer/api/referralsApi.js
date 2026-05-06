import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const referralsApi = {
  async getDashboard(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/referrals", options);
    return data;
  },

  async createReferral(payload) {
    const { data } = await fulfillmentClient.post("/referrals", payload);
    invalidateRequestCache("/referrals");
    return data;
  },
};

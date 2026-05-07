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

  async trackSignup(payload) {
    const { data } = await fulfillmentClient.post("/referrals/track-signup", payload);
    invalidateRequestCache("/referrals");
    return data.referral;
  },

  async trackBooking(payload) {
    const { data } = await fulfillmentClient.post("/referrals/track-booking", payload);
    invalidateRequestCache("/referrals");
    invalidateRequestCache("/referrals/admin/all");
    return data.referral;
  },
};

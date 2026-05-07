import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const adminReferralsApi = {
  async listAll(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/referrals/admin/all", options);
    return data.referrals;
  },

  async getSettings(options = {}) {
    const { data } = await cachedGet(
      fulfillmentClient,
      "/referrals/admin/settings",
      options,
    );
    return data.settings;
  },

  async updateSettings(payload) {
    const { data } = await fulfillmentClient.patch(
      "/referrals/admin/settings",
      payload,
    );
    invalidateRequestCache("/referrals/admin/settings");
    invalidateRequestCache("/referrals");
    return data.settings;
  },

  async updateRewardStatus(referralId, rewardStatus) {
    const { data } = await fulfillmentClient.patch(
      `/referrals/admin/${referralId}/reward-status`,
      { rewardStatus },
    );
    invalidateRequestCache("/referrals/admin/all");
    invalidateRequestCache("/referrals");
    return data.referral;
  },
};

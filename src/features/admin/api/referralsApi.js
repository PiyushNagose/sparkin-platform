import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const adminReferralsApi = {
  async listAll(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/referrals/admin/all", options);
    return data.referrals;
  },

  async updateRewardStatus(referralId, rewardStatus) {
    const { data } = await fulfillmentClient.patch(
      `/referrals/admin/${referralId}/reward-status`,
      { rewardStatus },
    );
    invalidateRequestCache("/referrals/admin/all");
    return data.referral;
  },
};

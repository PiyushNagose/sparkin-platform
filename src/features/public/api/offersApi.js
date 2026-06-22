import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet } from "@/shared/lib/http/requestCache";

export const publicOffersApi = {
  async list(params = {}, options = {}) {
    const { data } = await cachedGet(businessClient, "/offers/public", {
      ...options,
      params,
    });
    return data;
  },

  async validateCoupon(couponCode, estimatedCost = 0) {
    const { data } = await businessClient.post("/offers/validate-coupon", {
      couponCode,
      estimatedCost,
    });
    return data;
  },
};

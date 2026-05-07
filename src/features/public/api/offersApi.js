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
};

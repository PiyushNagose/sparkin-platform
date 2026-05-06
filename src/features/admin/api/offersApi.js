import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const offersApi = {
  /** Get stats: activeCount, totalCount, totalRedemptions */
  async getStats() {
    const { data } = await cachedGet(businessClient, "/offers/stats");
    return data; // { activeCount, totalCount, totalRedemptions }
  },

  /** Generate a unique coupon code */
  async generateCode() {
    const { data } = await cachedGet(businessClient, "/offers/generate-code", {
      force: true,
      ttlMs: 0,
    });
    return data.code; // string
  },

  /**
   * List offers with pagination and filters.
   * @param {{ page?: number, limit?: number, status?: string, search?: string }} params
   */
  async list(params = {}) {
    const { data } = await cachedGet(businessClient, "/offers", { params });
    return data; // { offers: [], total: number }
  },

  /** Get a single offer by offerId */
  async getById(offerId) {
    const { data } = await cachedGet(businessClient, `/offers/${offerId}`);
    return data.offer;
  },

  /** Create a new offer */
  async create(payload) {
    const { data } = await businessClient.post("/offers", payload);
    invalidateRequestCache("/offers");
    return data.offer;
  },

  /** Update an existing offer */
  async update(offerId, payload) {
    const { data } = await businessClient.patch(`/offers/${offerId}`, payload);
    invalidateRequestCache("/offers");
    return data.offer;
  },

  /** Toggle offer status: active | disabled | draft */
  async toggleStatus(offerId, status) {
    const { data } = await businessClient.patch(`/offers/${offerId}/status`, {
      status,
    });
    invalidateRequestCache("/offers");
    return data.offer;
  },

  /** Delete an offer */
  async remove(offerId) {
    await businessClient.delete(`/offers/${offerId}`);
    invalidateRequestCache("/offers");
  },
};

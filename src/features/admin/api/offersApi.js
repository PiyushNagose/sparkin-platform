import { businessClient } from "@/shared/lib/http/businessClient";

export const offersApi = {
  /** Get stats: activeCount, totalCount, totalRedemptions */
  async getStats() {
    const { data } = await businessClient.get("/offers/stats");
    return data; // { activeCount, totalCount, totalRedemptions }
  },

  /** Generate a unique coupon code */
  async generateCode() {
    const { data } = await businessClient.get("/offers/generate-code");
    return data.code; // string
  },

  /**
   * List offers with pagination and filters.
   * @param {{ page?: number, limit?: number, status?: string, search?: string }} params
   */
  async list(params = {}) {
    const { data } = await businessClient.get("/offers", { params });
    return data; // { offers: [], total: number }
  },

  /** Get a single offer by offerId */
  async getById(offerId) {
    const { data } = await businessClient.get(`/offers/${offerId}`);
    return data.offer;
  },

  /** Create a new offer */
  async create(payload) {
    const { data } = await businessClient.post("/offers", payload);
    return data.offer;
  },

  /** Update an existing offer */
  async update(offerId, payload) {
    const { data } = await businessClient.patch(`/offers/${offerId}`, payload);
    return data.offer;
  },

  /** Toggle offer status: active | disabled | draft */
  async toggleStatus(offerId, status) {
    const { data } = await businessClient.patch(`/offers/${offerId}/status`, {
      status,
    });
    return data.offer;
  },

  /** Delete an offer */
  async remove(offerId) {
    await businessClient.delete(`/offers/${offerId}`);
  },
};

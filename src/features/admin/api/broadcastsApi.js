import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const broadcastsApi = {
  /**
   * Send a broadcast immediately or schedule it.
   * @param {object} payload
   */
  async send(payload) {
    const { data } = await businessClient.post("/broadcasts", payload);
    invalidateRequestCache("/broadcasts");
    return data.broadcast;
  },

  /**
   * Save a broadcast as a draft.
   * @param {object} payload
   */
  async saveDraft(payload) {
    const { data } = await businessClient.post("/broadcasts/draft", payload);
    invalidateRequestCache("/broadcasts");
    return data.broadcast;
  },

  /**
   * List broadcasts with optional pagination and status filter.
   * @param {{ page?: number, limit?: number, status?: string }} params
   */
  async list(params = {}) {
    const { data } = await cachedGet(businessClient, "/broadcasts", { params });
    // returns { broadcasts: [], total: number }
    return data;
  },

  /**
   * Get a single broadcast by its broadcastId (e.g. "BRD-2024-123").
   * @param {string} broadcastId
   */
  async getById(broadcastId) {
    const { data } = await cachedGet(businessClient, `/broadcasts/${broadcastId}`);
    return data.broadcast;
  },

  /**
   * Cancel a scheduled or draft broadcast.
   * @param {string} broadcastId
   */
  async cancel(broadcastId) {
    const { data } = await businessClient.patch(
      `/broadcasts/${broadcastId}/cancel`,
    );
    invalidateRequestCache("/broadcasts");
    return data.broadcast;
  },

  /**
   * Delete a draft, scheduled, or failed broadcast.
   * @param {string} broadcastId
   */
  async remove(broadcastId) {
    await businessClient.delete(`/broadcasts/${broadcastId}`);
    invalidateRequestCache("/broadcasts");
  },
};

import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const ticketsApi = {
  /** List tickets with pagination and filters */
  async list(params = {}) {
    const { data } = await cachedGet(businessClient, "/tickets", { params });
    return data; // { tickets: [], total: number }
  },

  /** Get a single ticket by ticketId (e.g. "TK-1042") */
  async getById(ticketId) {
    const { data } = await cachedGet(businessClient, `/tickets/${ticketId}`);
    return data.ticket;
  },

  /** Create a new ticket */
  async create(payload) {
    const { data } = await businessClient.post("/tickets", payload);
    invalidateRequestCache("/tickets");
    return data.ticket;
  },

  /** Update ticket fields (status, priority, assignee, etc.) */
  async update(ticketId, payload) {
    const { data } = await businessClient.patch(
      `/tickets/${ticketId}`,
      payload,
    );
    invalidateRequestCache("/tickets");
    return data.ticket;
  },

  /** Add a reply or internal note to a ticket */
  async addMessage(ticketId, payload) {
    const { data } = await businessClient.post(
      `/tickets/${ticketId}/messages`,
      payload,
    );
    invalidateRequestCache("/tickets");
    return data.ticket;
  },

  /** Delete a ticket */
  async remove(ticketId) {
    await businessClient.delete(`/tickets/${ticketId}`);
    invalidateRequestCache("/tickets");
  },
};

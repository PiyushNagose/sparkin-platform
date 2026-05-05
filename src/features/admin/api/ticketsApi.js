import { businessClient } from "@/shared/lib/http/businessClient";

export const ticketsApi = {
  /** List tickets with pagination and filters */
  async list(params = {}) {
    const { data } = await businessClient.get("/tickets", { params });
    return data; // { tickets: [], total: number }
  },

  /** Get a single ticket by ticketId (e.g. "TK-1042") */
  async getById(ticketId) {
    const { data } = await businessClient.get(`/tickets/${ticketId}`);
    return data.ticket;
  },

  /** Create a new ticket */
  async create(payload) {
    const { data } = await businessClient.post("/tickets", payload);
    return data.ticket;
  },

  /** Update ticket fields (status, priority, assignee, etc.) */
  async update(ticketId, payload) {
    const { data } = await businessClient.patch(
      `/tickets/${ticketId}`,
      payload,
    );
    return data.ticket;
  },

  /** Add a reply or internal note to a ticket */
  async addMessage(ticketId, payload) {
    const { data } = await businessClient.post(
      `/tickets/${ticketId}/messages`,
      payload,
    );
    return data.ticket;
  },

  /** Delete a ticket */
  async remove(ticketId) {
    await businessClient.delete(`/tickets/${ticketId}`);
  },
};

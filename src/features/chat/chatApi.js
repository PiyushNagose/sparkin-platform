import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

const BASE = "/chat";

export const chatApi = {
  /** List all rooms for the current user */
  listRooms: () => cachedGet(businessClient, `${BASE}/rooms`, { ttlMs: 5000 }).then((r) => r.data),

  /** Get messages for a room */
  getMessages: (roomId, params = {}) =>
    cachedGet(businessClient, `${BASE}/rooms/${roomId}/messages`, {
      params,
      ttlMs: 3000,
    }).then((r) => r.data),

  /** Create or get a room with a target user */
  createRoom: (payload) =>
    businessClient.post(`${BASE}/rooms`, payload).then((r) => {
      invalidateRequestCache(`${BASE}/rooms`);
      return r.data;
    }),

  /** Mark room as read */
  markRead: (roomId) =>
    businessClient.patch(`${BASE}/rooms/${roomId}/read`).then((r) => {
      invalidateRequestCache(`${BASE}/rooms`);
      return r.data;
    }),

  /** Get the active admin's contact info (used by vendor/customer to start a chat) */
  getAdminContact: () =>
    cachedGet(businessClient, `${BASE}/admin-contact`).then((r) => r.data),

  /** Register the current admin's userId so vendors/customers can find them */
  registerAdmin: () =>
    businessClient.post(`${BASE}/register-admin`).then((r) => {
      invalidateRequestCache(`${BASE}/admin-contact`);
      return r.data;
    }),
};

import { businessClient } from "@/shared/lib/http/businessClient";

const BASE = "/chat";

export const chatApi = {
  /** List all rooms for the current user */
  listRooms: () => businessClient.get(`${BASE}/rooms`).then((r) => r.data),

  /** Get messages for a room */
  getMessages: (roomId, params = {}) =>
    businessClient.get(`${BASE}/rooms/${roomId}/messages`, { params }).then((r) => r.data),

  /** Create or get a room with a target user */
  createRoom: (payload) =>
    businessClient.post(`${BASE}/rooms`, payload).then((r) => r.data),

  /** Mark room as read */
  markRead: (roomId) =>
    businessClient.patch(`${BASE}/rooms/${roomId}/read`).then((r) => r.data),

  /** Get the active admin's contact info (used by vendor/customer to start a chat) */
  getAdminContact: () =>
    businessClient.get(`${BASE}/admin-contact`).then((r) => r.data),

  /** Register the current admin's userId so vendors/customers can find them */
  registerAdmin: () =>
    businessClient.post(`${BASE}/register-admin`).then((r) => r.data),
};

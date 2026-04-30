import { httpClient } from "@/shared/lib/http/client";

export const authApi = {
  async register(payload) {
    const { data } = await httpClient.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    const { data } = await httpClient.post("/auth/login", payload);
    return data;
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return { success: true };
    }

    const { data } = await httpClient.post("/auth/logout", { refreshToken });
    return data;
  },

  async refresh(refreshToken) {
    const { data } = await httpClient.post("/auth/refresh", { refreshToken });
    return data;
  },

  async getCurrentUser() {
    const { data } = await httpClient.get("/auth/me");
    return data.user;
  },

  async updateCurrentUser(payload) {
    const { data } = await httpClient.patch("/users/me", payload);
    return data.user;
  },

  async updateAvatar(payload) {
    const { data } = await httpClient.patch("/users/me/avatar", payload);
    return data.user;
  },

  async changePassword(payload) {
    const { data } = await httpClient.patch("/users/me/password", payload);
    return data;
  },
};

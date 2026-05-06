import { httpClient } from "@/shared/lib/http/client";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const authApi = {
  async register(payload) {
    const { data } = await httpClient.post("/auth/register", payload);
    invalidateRequestCache();
    return data;
  },

  async login(payload) {
    const { data } = await httpClient.post("/auth/login", payload);
    invalidateRequestCache();
    return data;
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return { success: true };
    }

    const { data } = await httpClient.post("/auth/logout", { refreshToken });
    invalidateRequestCache();
    return data;
  },

  async refresh(refreshToken) {
    const { data } = await httpClient.post("/auth/refresh", { refreshToken });
    invalidateRequestCache("/auth/me");
    return data;
  },

  async getCurrentUser() {
    const { data } = await cachedGet(httpClient, "/auth/me", { ttlMs: 5000 });
    return data.user;
  },

  async updateCurrentUser(payload) {
    const { data } = await httpClient.patch("/users/me", payload);
    invalidateRequestCache("/auth/me");
    return data.user;
  },

  async updateAvatar(payload) {
    const { data } = await httpClient.patch("/users/me/avatar", payload);
    invalidateRequestCache("/auth/me");
    return data.user;
  },

  async changePassword(payload) {
    const { data } = await httpClient.patch("/users/me/password", payload);
    invalidateRequestCache("/auth/me");
    return data;
  },
};

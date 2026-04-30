import axios from "axios";
import { authStorage } from "@/features/auth/authStorage";

let refreshPromise = null;

export function attachAuthInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = authStorage.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const shouldTryRefresh =
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !String(originalRequest.url).includes("/auth/refresh");

      if (!shouldTryRefresh) {
        return Promise.reject(error);
      }

      const refreshToken = authStorage.getRefreshToken();

      if (!refreshToken) {
        authStorage.clearSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const authBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1";
        refreshPromise ??= axios
          .post(`${authBaseUrl}/auth/refresh`, { refreshToken })
          .finally(() => {
            refreshPromise = null;
          });

        const { data } = await refreshPromise;

        authStorage.setSession(data);
        originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        if ([401, 403].includes(refreshError.response?.status)) {
          authStorage.clearSession();
        }

        return Promise.reject(refreshError);
      }
    },
  );
}

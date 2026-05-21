import axios from "axios";
import { authStorage } from "@/features/auth/authStorage";

let refreshPromise = null;

function getRequestPath(config) {
  const baseURL = config?.baseURL || window.location.origin;
  try {
    return new URL(config?.url || "", baseURL).pathname;
  } catch {
    return String(config?.url || "").split("?")[0];
  }
}

function canRefreshRequest(config) {
  const path = getRequestPath(config);
  if (path.endsWith("/auth/me")) {
    return true;
  }

  return !path.includes("/auth/");
}

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
        canRefreshRequest(originalRequest);

      if (!shouldTryRefresh) {
        return Promise.reject(error);
      }

      const refreshToken = authStorage.getRefreshToken();

      if (!refreshToken || authStorage.isRefreshTokenExpired()) {
        authStorage.clearSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const authBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
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

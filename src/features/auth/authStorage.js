const ACCESS_TOKEN_KEY = "sparkin.accessToken";
const REFRESH_TOKEN_KEY = "sparkin.refreshToken";
const USER_KEY = "sparkin.user";

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = window.atob(normalizedPayload);

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export const authStorage = {
  getAccessToken() {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isAccessTokenExpired(skewSeconds = 30) {
    const token = this.getAccessToken();

    if (!token) {
      return true;
    }

    const payload = decodeJwtPayload(token);

    if (!payload?.exp) {
      return true;
    }

    return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
  },

  getUser() {
    const value = window.localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      this.clearSession();
      return null;
    }
  },

  setSession({ user, tokens }) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  updateUser(user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};

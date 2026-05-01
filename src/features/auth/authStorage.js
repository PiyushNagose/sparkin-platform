const ACCESS_TOKEN_KEY = "sparkin.accessToken";
const REFRESH_TOKEN_KEY = "sparkin.refreshToken";
const USER_KEY = "sparkin.user";
const STORAGE_MODE_KEY = "sparkin.storageMode";

function getStorage() {
  if (window.localStorage.getItem(STORAGE_MODE_KEY) === "session") {
    return window.sessionStorage;
  }

  if (window.sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    return window.sessionStorage;
  }

  return window.localStorage;
}

function clearStorage(storage) {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(USER_KEY);
}

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
    return getStorage().getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return getStorage().getItem(REFRESH_TOKEN_KEY);
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
    const value = getStorage().getItem(USER_KEY);

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

  setSession({ user, tokens }, options = {}) {
    const persist = options.persist ?? true;
    const storage = persist ? window.localStorage : window.sessionStorage;

    clearStorage(window.localStorage);
    clearStorage(window.sessionStorage);
    window.localStorage.setItem(STORAGE_MODE_KEY, persist ? "local" : "session");

    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  updateUser(user) {
    getStorage().setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    clearStorage(window.localStorage);
    clearStorage(window.sessionStorage);
    window.localStorage.removeItem(STORAGE_MODE_KEY);
  },
};

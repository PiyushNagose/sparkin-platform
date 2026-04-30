import * as React from "react";
import { authApi } from "@/features/auth/authApi";
import { authStorage } from "@/features/auth/authStorage";

const AuthContext = React.createContext(null);
let bootstrapRefreshPromise = null;

function getRoleHome(role) {
  if (role === "vendor") {
    return "/vendor";
  }

  if (role === "admin") {
    return "/customer";
  }

  return "/customer";
}

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => authStorage.getUser());
  const [isBootstrapping, setIsBootstrapping] = React.useState(Boolean(authStorage.getAccessToken()));

  React.useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      if (!authStorage.getAccessToken()) {
        setIsBootstrapping(false);
        return;
      }

      try {
        if (authStorage.isAccessTokenExpired()) {
          const refreshToken = authStorage.getRefreshToken();

          if (!refreshToken) {
            throw Object.assign(new Error("Refresh token is missing"), {
              response: { status: 401 },
            });
          }

          bootstrapRefreshPromise ??= authApi.refresh(refreshToken).finally(() => {
            bootstrapRefreshPromise = null;
          });

          const session = await bootstrapRefreshPromise;
          authStorage.setSession(session);
        }

        const currentUser = await authApi.getCurrentUser();

        if (active) {
          authStorage.updateUser(currentUser);
          setUser(currentUser);
        }
      } catch (apiError) {
        const storedUser = authStorage.getUser();
        const status = apiError?.response?.status;
        const shouldClearSession = [401, 403].includes(status);

        if (shouldClearSession) {
          authStorage.clearSession();
        }

        if (active && shouldClearSession) {
          setUser(null);
        }

        if (active && !shouldClearSession && storedUser) {
          setUser(storedUser);
        }
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, []);

  const register = React.useCallback(async (payload) => {
    const session = await authApi.register(payload);
    authStorage.setSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const login = React.useCallback(async (payload) => {
    const session = await authApi.login(payload);
    authStorage.setSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = React.useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();
    authStorage.clearSession();
    setUser(null);

    try {
      await authApi.logout(refreshToken);
    } catch {
      return { success: true };
    }

    return { success: true };
  }, []);

  const updateUserProfile = React.useCallback(async (payload) => {
    const updatedUser = await authApi.updateCurrentUser(payload);
    authStorage.updateUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const updateUserAvatar = React.useCallback(async (payload) => {
    const updatedUser = await authApi.updateAvatar(payload);
    authStorage.updateUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      register,
      login,
      logout,
      updateUserProfile,
      updateUserAvatar,
      getRoleHome,
    }),
    [isBootstrapping, login, logout, register, updateUserAvatar, updateUserProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

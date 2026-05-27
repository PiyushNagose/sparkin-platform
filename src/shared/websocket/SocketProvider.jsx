import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/features/auth/AuthProvider";
import { authStorage } from "@/features/auth/authStorage";
import { invalidateRequestCache } from "@/shared/lib/http/requestCache";

const RESOURCE_MATCHERS = [
  { pattern: "/auth", match: "/auth" },
  { pattern: "/users", match: "/auth/me" },
  { pattern: "/vendors", match: "/vendors" },
  { pattern: "/leads", match: "/leads" },
  { pattern: "/quotes", match: "/quotes" },
  { pattern: "/projects", match: "/projects" },
  { pattern: "/payments", match: "/payments" },
  { pattern: "/service-requests", match: "/service-requests" },
  { pattern: "/referrals", match: "/referrals" },
  { pattern: "/tickets", match: "/tickets" },
  { pattern: "/broadcasts", match: "/broadcasts" },
  { pattern: "/platform-settings", match: "/platform-settings" },
];

function invalidateFromRefreshEvent(payload) {
  const path = payload?.path?.split("?")[0] || "";

  if (!path) {
    invalidateRequestCache();
    return;
  }

  const matches = RESOURCE_MATCHERS.filter(({ pattern }) =>
    path.includes(pattern),
  );

  if (!matches.length) {
    return;
  }

  invalidateRequestCache((key) =>
    matches.some(({ match }) => key.includes(match)),
  );
}

const SocketContext = createContext({
  connected: false,
  refreshKey: 0,
});

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated, isBootstrapping } = useAuth();
  const token = authStorage.getAccessToken();

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || !token) {
      setConnected(false);
      return undefined;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      window.location.origin;

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 20000,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("refresh:page", (payload) => {
      invalidateFromRefreshEvent(payload);
      setRefreshKey((current) => current + 1);
    });
    socket.on("connect_error", () => {
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("refresh:page");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [isAuthenticated, isBootstrapping, token]);

  const value = useMemo(
    () => ({ connected, refreshKey }),
    [connected, refreshKey],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}

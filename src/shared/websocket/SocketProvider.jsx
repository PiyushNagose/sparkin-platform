import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

function stripApiPath(url) {
  return url.replace(/\/api\/v1\/?$/, "");
}

function resolveSocketUrl() {
  const fallbackApiBase = import.meta.env.DEV
    ? "http://localhost:4000/api/v1"
    : window.location.origin;

  return stripApiPath(
    import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      fallbackApiBase,
  );
}

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
  const { isBootstrapping } = useAuth();
  const token = authStorage.getAccessToken();

  useEffect(() => {
    if (isBootstrapping) {
      setConnected(false);
      return undefined;
    }

    const socketUrl = resolveSocketUrl();

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
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
  }, [isBootstrapping, token]);

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

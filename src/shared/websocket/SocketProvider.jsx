import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const refreshTimerRef = useRef(null);
  const pendingRefreshPayloadsRef = useRef([]);
  const { isAuthenticated, isBootstrapping } = useAuth();
  const token = authStorage.getAccessToken();

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || !token) {
      setConnected(false);
      return undefined;
    }

    const socketUrl = resolveSocketUrl();

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: token ? { token } : undefined,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 10000,
      timeout: 8000,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("refresh:page", (payload) => {
      pendingRefreshPayloadsRef.current.push(payload);

      if (refreshTimerRef.current) {
        return;
      }

      refreshTimerRef.current = window.setTimeout(() => {
        const payloads = pendingRefreshPayloadsRef.current;
        pendingRefreshPayloadsRef.current = [];

        for (const pendingPayload of payloads) {
          invalidateFromRefreshEvent(pendingPayload);
        }

        refreshTimerRef.current = null;
        setRefreshKey((current) => current + 1);
      }, 750);
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

      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      pendingRefreshPayloadsRef.current = [];
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

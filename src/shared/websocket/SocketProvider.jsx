import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { authStorage } from "@/features/auth/authStorage";

const SocketContext = createContext({
  connected: false,
  refreshKey: 0,
});

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = authStorage.getAccessToken();

  useEffect(() => {
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
    socket.on("refresh:page", () => {
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
  }, [token]);

  const value = useMemo(
    () => ({ connected, refreshKey }),
    [connected, refreshKey],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}

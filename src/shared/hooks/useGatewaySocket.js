import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Connects to the API-gateway Socket.IO server and calls `onRefresh` whenever
 * any mutating API call succeeds (the gateway broadcasts `refresh:page` to the
 * `global` room after every POST/PUT/PATCH/DELETE that returns 2xx).
 *
 * @param {string|null} token     - JWT access token; pass null to stay disconnected
 * @param {function}    onRefresh - called with { path, method, timestamp } on each event
 *
 * Usage:
 *   useGatewaySocket(token, () => loadData());
 */

function stripApiPath(url) {
  return url.replace(/\/api\/v1\/?$/, "");
}

const GATEWAY_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_GATEWAY_URL ||
  stripApiPath(
    import.meta.env.VITE_BUSINESS_API_BASE_URL || "http://localhost:4000",
  );

export function useGatewaySocket(token, onRefresh) {
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (!token) return;

    const socket = io(GATEWAY_URL, {
      auth: { token },
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 8,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 15000,
      timeout: 8000,
    });

    socket.on("refresh:page", (payload) => {
      onRefreshRef.current?.(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);
}

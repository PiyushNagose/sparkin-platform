import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Socket traffic connects directly to business-service for realtime chat.
const SOCKET_URL =
  import.meta.env.VITE_BUSINESS_SOCKET_URL || "http://34-180-1-251.nip.io/";

/**
 * Hook that manages a Socket.io connection to the business-service chat.
 *
 * @param {string|null} token  - JWT access token (null = not connected)
 * @param {object} opts
 * @param {function} opts.onNewRoom     - called when a new room is created for this user
 * @param {function} opts.onRoomUpdated - called when a room's lastMessage changes
 */
export function useChatSocket(token, { onNewRoom, onRoomUpdated } = {}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState({}); // { [roomId]: Message[] }
  const [typing, setTyping] = useState({}); // { [roomId]: { userId, name }[] }

  // Keep callbacks in refs so the effect doesn't re-run when they change
  const onNewRoomRef = useRef(onNewRoom);
  const onRoomUpdatedRef = useRef(onRoomUpdated);
  useEffect(() => {
    onNewRoomRef.current = onNewRoom;
  }, [onNewRoom]);
  useEffect(() => {
    onRoomUpdatedRef.current = onRoomUpdated;
  }, [onRoomUpdated]);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // New message in a room
    socket.on("new:message", (message) => {
      setMessages((prev) => {
        const existing = prev[message.roomId] || [];
        if (existing.some((m) => m._id === message._id)) return prev;
        return { ...prev, [message.roomId]: [...existing, message] };
      });
    });

    // A new room was created that includes this user (e.g. vendor started chat with admin)
    socket.on("new:room", (room) => {
      onNewRoomRef.current?.(room);
    });

    // An existing room got a new message (sidebar needs to update lastMessage)
    socket.on("room:updated", (update) => {
      onRoomUpdatedRef.current?.(update);
    });

    socket.on("typing:start", ({ roomId, userId, name }) => {
      setTyping((prev) => {
        const current = (prev[roomId] || []).filter((t) => t.userId !== userId);
        return { ...prev, [roomId]: [...current, { userId, name }] };
      });
    });

    socket.on("typing:stop", ({ roomId, userId }) => {
      setTyping((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter((t) => t.userId !== userId),
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  const joinRoom = useCallback((roomId) => {
    socketRef.current?.emit("join:room", roomId);
  }, []);

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit("leave:room", roomId);
  }, []);

  const sendMessage = useCallback((roomId, text, attachment = null) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error("Not connected"));
        return;
      }
      socketRef.current.emit(
        "send:message",
        {
          roomId,
          text,
          attachmentUrl: attachment?.url || null,
          attachmentName: attachment?.name || null,
        },
        (ack) => {
          if (ack?.error) reject(new Error(ack.error));
          else resolve(ack);
        },
      );
    });
  }, []);

  const startTyping = useCallback((roomId) => {
    socketRef.current?.emit("typing:start", { roomId });
  }, []);

  const stopTyping = useCallback((roomId) => {
    socketRef.current?.emit("typing:stop", { roomId });
  }, []);

  const seedMessages = useCallback((roomId, msgs) => {
    setMessages((prev) => ({ ...prev, [roomId]: msgs }));
  }, []);

  return {
    connected,
    messages,
    typing,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    seedMessages,
  };
}


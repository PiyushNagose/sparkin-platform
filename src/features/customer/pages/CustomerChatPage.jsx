import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatWindow } from "@/features/chat/ChatWindow";
import {
  markChatRoomRead,
  sortChatRooms,
  upsertChatRoom,
} from "@/features/chat/chatRooms";
import { chatApi } from "@/features/chat/chatApi";
import { useChatSocket } from "@/features/chat/useChatSocket";
import { useAuth } from "@/features/auth/AuthProvider";
import { authStorage } from "@/features/auth/authStorage";

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function formatTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(value));
}

export default function CustomerChatPage() {
  const { user } = useAuth();
  const token = authStorage.getAccessToken?.() || null;
  const currentUserId = user?.id || user?._id || "";

  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  // mobile: "list" | "chat"
  const [mobileView, setMobileView] = useState("list");

  const handleRoomUpdated = useCallback((room) => {
    const nextRoom =
      room?.roomId === activeRoomId
        ? { ...room, unreadCount: { ...(room.unreadCount || {}), [currentUserId]: 0 } }
        : room;
    setRooms((prev) => upsertChatRoom(prev, nextRoom));
    if (room?.roomId === activeRoomId) {
      chatApi.markRead(room.roomId).catch(() => {});
    }
  }, [activeRoomId, currentUserId]);

  const {
    messages, typing, connected,
    joinRoom, leaveRoom, sendMessage,
    startTyping, stopTyping, seedMessages,
  } = useChatSocket(token, { onRoomUpdated: handleRoomUpdated });

  useEffect(() => {
    chatApi.listRooms().then((data) => setRooms(sortChatRooms(data))).catch(() => {});
  }, []);

  async function openRoom(room) {
    if (activeRoomId === room.roomId) {
      setMobileView("chat");
      return;
    }
    if (activeRoomId) leaveRoom(activeRoomId);
    setActiveRoomId(room.roomId);
    setMobileView("chat");
    setLoadingMessages(true);
    document.getElementById("portal-scroll-container")?.scrollTo({ top: 0, behavior: "instant" });
    try {
      const msgs = await chatApi.getMessages(room.roomId);
      seedMessages(room.roomId, msgs);
      setRooms((prev) => markChatRoomRead(prev, room.roomId, currentUserId));
      chatApi.markRead(room.roomId).catch(() => {});
    } finally {
      setLoadingMessages(false);
    }
    joinRoom(room.roomId);
  }

  async function handleStartChat() {
    setStartingChat(true);
    try {
      const { adminId, adminName } = await chatApi.getAdminContact();
      if (!adminId) {
        alert("Support is not available right now. Please try again later.");
        return;
      }
      const room = await chatApi.createRoom({
        targetUserId: adminId,
        targetRole: "admin",
        targetName: adminName,
      });
      const updated = await chatApi.listRooms();
      setRooms(sortChatRooms(updated));
      openRoom(room);
    } catch {
      // silently fail
    } finally {
      setStartingChat(false);
    }
  }

  function getOtherParticipant(room) {
    const otherIdx = room.participantIds?.findIndex((id) => id !== currentUserId);
    const name = room.participantNames?.[otherIdx] || "Sparkin Support";
    const role = room.participantRoles?.[otherIdx] || "admin";
    return { name, role };
  }

  const activeRoom = rooms.find((r) => r.roomId === activeRoomId);
  const otherParticipant = activeRoom ? getOtherParticipant(activeRoom) : { name: "Sparkin Support", role: "admin" };
  const roomMessages = (activeRoomId && messages[activeRoomId]) || [];
  const roomTyping = (activeRoomId && typing[activeRoomId]) || [];

  // ── Sidebar list ──────────────────────────────────────────────────────────
  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.8, borderBottom: "1px solid rgba(225,232,241,0.96)", flexShrink: 0 }}
      >
        <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>Conversations</Typography>
        <FilterListRoundedIcon sx={{ color: "#A0ACBA", fontSize: "1.1rem" }} />
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {rooms.length === 0 ? (
          <Box sx={{ p: 2.5, textAlign: "center" }}>
            <ChatOutlinedIcon sx={{ fontSize: "1.8rem", color: "#C8D4E4", mb: 0.8 }} />
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.82rem" }}>No conversations yet</Typography>
            <Typography sx={{ mt: 0.4, color: "#C8D4E4", fontSize: "0.72rem" }}>
              Click "Contact Support" to start
            </Typography>
          </Box>
        ) : null}

        {rooms.map((room) => {
          const { name, role } = getOtherParticipant(room);
          const isActive = room.roomId === activeRoomId;
          const unread = room.unreadCount?.[currentUserId] || 0;

          return (
            <Box
              key={room.roomId}
              onClick={() => openRoom(room)}
              sx={{
                px: 2,
                py: 1.6,
                cursor: "pointer",
                bgcolor: isActive ? "#EEF4FF" : "transparent",
                borderLeft: isActive ? "3px solid #0E56C8" : "3px solid transparent",
                "&:hover": { bgcolor: isActive ? "#EEF4FF" : "#F7F9FC" },
                borderBottom: "1px solid rgba(225,232,241,0.5)",
              }}
            >
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Avatar sx={{ width: 46, height: 46, bgcolor: "#132C58", fontSize: "0.88rem", fontWeight: 800, flexShrink: 0 }}>
                  {getInitials(name)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name}
                    </Typography>
                    <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem", flexShrink: 0, ml: 1 }}>
                      {formatTime(room.lastMessageAt)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.3 }}>
                    <Typography sx={{ color: "#7A8799", fontSize: "0.76rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {room.lastMessage || "No messages yet"}
                    </Typography>
                    {unread > 0 ? (
                      <Box sx={{ ml: 1, minWidth: 20, height: 20, borderRadius: "50%", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: "0.6rem", fontWeight: 900, flexShrink: 0 }}>
                        {unread}
                      </Box>
                    ) : null}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Page header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography sx={{ color: "#18253A", fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Support Chat
          </Typography>
          <Typography sx={{ mt: 0.5, color: "#6F7D8F", fontSize: "0.88rem" }}>
            Get help from the Sparkin support team.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={startingChat ? <CircularProgress size={14} color="inherit" /> : <ChatOutlinedIcon />}
          onClick={handleStartChat}
          disabled={startingChat}
          sx={{
            minHeight: 42,
            px: 2,
            borderRadius: "999px",
            bgcolor: "#0E56C8",
            fontSize: "0.84rem",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 8px 20px rgba(14,86,200,0.2)",
          }}
        >
          {startingChat ? "Starting..." : "Contact Support"}
        </Button>
      </Stack>

      {/* ── Desktop layout: side-by-side ── */}
      <Box
        sx={{
          display: { xs: "none", lg: "grid" },
          gridTemplateColumns: "280px 1fr",
          height: 600,
          minHeight: 600,
          borderRadius: "1.3rem",
          overflow: "hidden",
          border: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ borderRight: "1px solid rgba(225,232,241,0.96)" }}>
          {sidebarContent}
        </Box>

        {activeRoomId ? (
          <ChatWindow
            messages={roomMessages}
            currentUserId={currentUserId}
            otherUser={{ name: otherParticipant.name, role: "Sparkin Support", online: connected }}
            typingUsers={roomTyping}
            onSend={(text) => sendMessage(activeRoomId, text)}
            onTypingStart={() => startTyping(activeRoomId)}
            onTypingStop={() => stopTyping(activeRoomId)}
            loading={loadingMessages}
            accentColor="#0E56C8"
          />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", bgcolor: "#F7F9FC" }}>
            <Box sx={{ textAlign: "center" }}>
              <ChatOutlinedIcon sx={{ fontSize: "2.5rem", color: "#C8D4E4", mb: 1 }} />
              <Typography sx={{ color: "#A0ACBA", fontSize: "1rem", fontWeight: 700 }}>No conversation selected</Typography>
              <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.82rem" }}>Select a conversation or contact support</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Mobile layout: WhatsApp-style ── */}
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          borderRadius: "1.3rem",
          overflow: "hidden",
          border: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
          height: "calc(100dvh - 220px)",
          minHeight: 460,
        }}
      >
        {mobileView === "list" && sidebarContent}

        {mobileView === "chat" && activeRoomId && (
          <ChatWindow
            messages={roomMessages}
            currentUserId={currentUserId}
            otherUser={{ name: otherParticipant.name, role: "Sparkin Support", online: connected }}
            typingUsers={roomTyping}
            onSend={(text) => sendMessage(activeRoomId, text)}
            onTypingStart={() => startTyping(activeRoomId)}
            onTypingStop={() => stopTyping(activeRoomId)}
            onBack={() => setMobileView("list")}
            loading={loadingMessages}
            accentColor="#0E56C8"
          />
        )}
      </Box>
    </Box>
  );
}

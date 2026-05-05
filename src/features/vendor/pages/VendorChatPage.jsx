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
import { useCallback, useEffect, useState } from "react";
import { ChatWindow } from "@/features/chat/ChatWindow";
import { chatApi } from "@/features/chat/chatApi";
import { useChatSocket } from "@/features/chat/useChatSocket";
import { useAuth } from "@/features/auth/AuthProvider";
import { authStorage } from "@/features/auth/authStorage";
import {
  VendorPageHeader,
  VendorPageShell,
} from "@/features/vendor/components/VendorPortalUI";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

function formatTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value));
}

export default function VendorChatPage() {
  const { user } = useAuth();
  const token = authStorage.getAccessToken?.() || null;
  const currentUserId = user?.id || user?._id || "";
  const currentUserName = user?.fullName || user?.name || user?.email || "Vendor";

  const handleRoomUpdated = useCallback(({ roomId, lastMessage, lastMessageAt }) => {
    setRooms((prev) =>
      prev.map((r) => r.roomId === roomId ? { ...r, lastMessage, lastMessageAt } : r)
    );
  }, []);

  const {
    messages, typing, connected,
    joinRoom, leaveRoom, sendMessage,
    startTyping, stopTyping, seedMessages,
  } = useChatSocket(token, { onRoomUpdated: handleRoomUpdated });

  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    chatApi.listRooms().then(setRooms).catch(() => {});
  }, []);

  async function openRoom(room) {
    if (activeRoomId === room.roomId) return;
    if (activeRoomId) leaveRoom(activeRoomId);
    setActiveRoomId(room.roomId);
    setLoadingMessages(true);
    try {
      const msgs = await chatApi.getMessages(room.roomId);
      seedMessages(room.roomId, msgs);
      chatApi.markRead(room.roomId).catch(() => {});
    } finally {
      setLoadingMessages(false);
    }
    joinRoom(room.roomId);
  }

  async function handleStartChat() {
    setStartingChat(true);
    try {
      // Fetch the real admin contact first
      const { adminId, adminName } = await chatApi.getAdminContact();

      if (!adminId) {
        // Admin hasn't registered yet — show a friendly message
        alert("Admin support is not available yet. Please try again later.");
        return;
      }

      const room = await chatApi.createRoom({
        targetUserId: adminId,
        targetRole: "admin",
        targetName: adminName,
      });
      const updated = await chatApi.listRooms();
      setRooms(updated);
      openRoom(room);
    } catch {
      // silently fail
    } finally {
      setStartingChat(false);
    }
  }

  // Get the other participant's name from room metadata
  function getOtherParticipant(room) {
    const otherIdx = room.participantIds?.findIndex((id) => id !== currentUserId);
    const name = room.participantNames?.[otherIdx] || "Sparkin Admin";
    const role = room.participantRoles?.[otherIdx] || "admin";
    return { name, role };
  }

  const activeRoom = rooms.find((r) => r.roomId === activeRoomId);
  const otherParticipant = activeRoom ? getOtherParticipant(activeRoom) : { name: "Sparkin Admin", role: "admin" };
  const roomMessages = (activeRoomId && messages[activeRoomId]) || [];
  const roomTyping = (activeRoomId && typing[activeRoomId]) || [];

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Support Chat"
        subtitle="Chat directly with the Sparkin admin team for project and account support."
        actions={
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
            {startingChat ? "Starting..." : "Start Chat with Admin"}
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
          height: "calc(100vh - 260px)",
          minHeight: 500,
          borderRadius: "1.3rem",
          overflow: "hidden",
          border: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Sidebar */}
        <Box sx={{ borderRight: "1px solid rgba(225,232,241,0.96)", display: "flex", flexDirection: "column" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.8, borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
            <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>Conversations</Typography>
            <FilterListRoundedIcon sx={{ color: "#A0ACBA", fontSize: "1.1rem" }} />
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {rooms.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: "center" }}>
                <Typography sx={{ color: "#A0ACBA", fontSize: "0.82rem" }}>No conversations yet</Typography>
                <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.74rem" }}>
                  Click "Start Chat with Admin" above
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
                  <Stack direction="row" spacing={1.3} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#132C58",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: "#18253A", fontSize: "0.86rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {unread > 0 ? (
                            <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: "0.58rem", fontWeight: 900 }}>
                              {unread}
                            </Box>
                          ) : null}
                          <Typography sx={{ color: "#A0ACBA", fontSize: "0.66rem", flexShrink: 0 }}>
                            {formatTime(room.lastMessageAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography sx={{ color: "#7A8799", fontSize: "0.74rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mt: 0.2 }}>
                        {room.lastMessage || "No messages yet"}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: "inline-flex", px: 0.7, py: 0.15, borderRadius: "999px", bgcolor: "#EEF4FF", color: "#0E56C8", fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase" }}>
                        {role}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Chat area */}
        {activeRoomId ? (
          <ChatWindow
            messages={roomMessages}
            currentUserId={currentUserId}
            otherUser={{ name: otherParticipant.name, role: otherParticipant.role, online: connected }}
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
              <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.82rem" }}>
                Select a conversation or start a new one
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </VendorPageShell>
  );
}

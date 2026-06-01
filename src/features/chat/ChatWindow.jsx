import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { useEffect, useRef, useState } from "react";

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatDay(value) {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date).toUpperCase();
}

function getInitials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
}

/**
 * Reusable chat window component.
 *
 * Props:
 *  - messages: Message[]
 *  - currentUserId: string
 *  - otherUser: { name, role, online }
 *  - typingUsers: { userId, name }[]
 *  - onSend: (text) => Promise<void>
 *  - onTypingStart: () => void
 *  - onTypingStop: () => void
 *  - onBack: () => void  — mobile back button handler
 *  - loading: boolean
 *  - accentColor: string (default "#0E56C8")
 */
export function ChatWindow({
  messages = [],
  currentUserId,
  otherUser = {},
  typingUsers = [],
  onSend,
  onTypingStart,
  onTypingStop,
  onBack,
  loading = false,
  accentColor = "#0E56C8",
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  function handleTextChange(e) {
    setText(e.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop?.();
    }, 1500);
  }

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;
    onTypingStop?.();
    try {
      await onSend?.(trimmed);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group messages by day
  const grouped = [];
  let lastDay = null;
  for (const msg of messages) {
    const day = formatDay(msg.createdAt);
    if (day !== lastDay) {
      grouped.push({ type: "divider", day });
      lastDay = day;
    }
    grouped.push({ type: "message", msg });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: 1.8,
          borderBottom: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        {/* Back button — mobile only */}
        {onBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              display: { xs: "inline-flex", lg: "none" },
              color: accentColor,
              mr: 0.5,
            }}
          >
            <ArrowBackIosRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        )}
        <Box sx={{ position: "relative" }}>
          <Avatar sx={{ width: 42, height: 42, bgcolor: accentColor, fontSize: "0.9rem", fontWeight: 800 }}>
            {getInitials(otherUser.name)}
          </Avatar>
          {otherUser.online ? (
            <Box sx={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", bgcolor: "#43D66E", border: "2px solid #FFFFFF" }} />
          ) : null}
        </Box>
        <Box>
          <Typography sx={{ color: "#18253A", fontSize: "0.96rem", fontWeight: 800 }}>
            {otherUser.name || "Chat"}
          </Typography>
          {otherUser.role ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: otherUser.online ? "#43D66E" : "#C8D4E4" }} />
              <Typography sx={{ color: "#7A8799", fontSize: "0.72rem" }}>
                {otherUser.online ? "Online" : "Offline"} · {otherUser.role}
              </Typography>
            </Stack>
          ) : null}
        </Box>
      </Stack>

      {/* Messages */}
      <Box ref={messagesContainerRef} sx={{ flex: 1, overflowY: "auto", px: { xs: 1.5, md: 2.5 }, py: 2, bgcolor: "#F7F9FC", minHeight: 0 }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
            <CircularProgress size={28} />
          </Box>
        ) : null}

        {!loading && messages.length === 0 ? (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>No messages yet. Say hello!</Typography>
          </Box>
        ) : null}

        {grouped.map((item, idx) => {
          if (item.type === "divider") {
            return (
              <Box key={`div-${idx}`} sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 2 }}>
                <Box sx={{ flex: 1, height: 1, bgcolor: "rgba(225,232,241,0.96)" }} />
                <Typography sx={{ color: "#A0ACBA", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em" }}>{item.day}</Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: "rgba(225,232,241,0.96)" }} />
              </Box>
            );
          }

          const { msg } = item;
          const isMine = msg.senderId === currentUserId;

          return (
            <Stack
              key={msg._id || idx}
              direction="row"
              spacing={1}
              justifyContent={isMine ? "flex-end" : "flex-start"}
              alignItems="flex-end"
              sx={{ mb: 1.4 }}
            >
              {!isMine ? (
                <Avatar sx={{ width: 30, height: 30, bgcolor: "#E2E8F0", color: "#556478", fontSize: "0.62rem", fontWeight: 800, flexShrink: 0 }}>
                  {getInitials(msg.senderName)}
                </Avatar>
              ) : null}

              <Box sx={{ maxWidth: { xs: "80%", md: "68%" } }}>
                {msg.attachmentUrl ? (
                  <Box sx={{ borderRadius: "1rem", overflow: "hidden", mb: msg.text ? 0.5 : 0, border: "1px solid rgba(225,232,241,0.96)" }}>
                    <Box
                      component="img"
                      src={msg.attachmentUrl}
                      alt={msg.attachmentName || "attachment"}
                      sx={{ display: "block", maxWidth: 260, maxHeight: 200, objectFit: "cover" }}
                    />
                    {msg.attachmentName ? (
                      <Box sx={{ px: 1.2, py: 0.6, bgcolor: "#F7F9FC" }}>
                        <Typography sx={{ color: "#556478", fontSize: "0.68rem" }}>{msg.attachmentName}</Typography>
                      </Box>
                    ) : null}
                  </Box>
                ) : null}

                {msg.text ? (
                  <Box
                    sx={{
                      px: 1.6,
                      py: 1.1,
                      borderRadius: isMine ? "1.2rem 1.2rem 0.3rem 1.2rem" : "1.2rem 1.2rem 1.2rem 0.3rem",
                      bgcolor: isMine ? accentColor : "#FFFFFF",
                      color: isMine ? "#FFFFFF" : "#18253A",
                      boxShadow: isMine ? `0 8px 20px ${accentColor}30` : "0 4px 12px rgba(16,29,51,0.06)",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {msg.text}
                    </Typography>
                  </Box>
                ) : null}

                <Stack direction="row" spacing={0.5} justifyContent={isMine ? "flex-end" : "flex-start"} sx={{ mt: 0.4 }}>
                  <Typography sx={{ color: "#A0ACBA", fontSize: "0.62rem" }}>{formatTime(msg.createdAt)}</Typography>
                  {isMine ? <Typography sx={{ color: "#A0ACBA", fontSize: "0.62rem" }}>· Read</Typography> : null}
                </Stack>
              </Box>

              {isMine ? (
                <Avatar sx={{ width: 30, height: 30, bgcolor: accentColor, fontSize: "0.62rem", fontWeight: 800, flexShrink: 0 }}>
                  {getInitials(otherUser.name || "Me")}
                </Avatar>
              ) : null}
            </Stack>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: "#E2E8F0", color: "#556478", fontSize: "0.6rem" }}>
              {getInitials(typingUsers[0]?.name)}
            </Avatar>
            <Box sx={{ px: 1.4, py: 0.8, borderRadius: "1rem", bgcolor: "#FFFFFF", boxShadow: "0 4px 12px rgba(16,29,51,0.06)" }}>
              <Stack direction="row" spacing={0.4} alignItems="center">
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#A0ACBA",
                      animation: "bounce 1.2s infinite",
                      animationDelay: `${i * 0.2}s`,
                      "@keyframes bounce": {
                        "0%, 80%, 100%": { transform: "scale(0.8)", opacity: 0.5 },
                        "40%": { transform: "scale(1.2)", opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.7rem" }}>{typingUsers[0]?.name} is typing...</Typography>
          </Stack>
        ) : null}

        <div ref={bottomRef} style={{ height: 1 }} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          px: { xs: 1.5, md: 2 },
          py: 1.5,
          borderTop: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ px: 1.5, py: 0.8, borderRadius: "999px", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#F7F9FC" }}
        >
          <IconButton size="small" sx={{ color: "#A0ACBA" }}>
            <AddCircleOutlineRoundedIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
          <IconButton size="small" sx={{ color: "#A0ACBA", display: { xs: "none", sm: "inline-flex" } }}>
            <AttachFileRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <InputBase
            fullWidth
            multiline
            maxRows={4}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            sx={{ fontSize: "0.88rem", color: "#18253A" }}
          />
          <IconButton size="small" sx={{ color: "#A0ACBA", display: { xs: "none", sm: "inline-flex" } }}>
            <EmojiEmotionsOutlinedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <IconButton
            onClick={handleSend}
            disabled={!text.trim() || sending}
            sx={{
              bgcolor: accentColor,
              color: "#FFFFFF",
              borderRadius: "999px",
              px: { xs: 1, md: 1.5 },
              py: 0.8,
              "&:hover": { bgcolor: "#0B49AD" },
              "&.Mui-disabled": { bgcolor: "#C8D4E4", color: "#FFFFFF" },
            }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, display: { xs: "none", sm: "block" } }}>Send</Typography>
              <SendRoundedIcon sx={{ fontSize: "0.9rem" }} />
            </Stack>
          </IconButton>
        </Stack>
        <Typography sx={{ mt: 0.8, color: "#A0ACBA", fontSize: "0.62rem", textAlign: "center" }}>
          🔒 End-to-end encrypted support session
        </Typography>
      </Box>
    </Box>
  );
}

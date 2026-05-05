import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { ticketsApi } from "@/features/admin/api/ticketsApi";
import { useAuth } from "@/features/auth/AuthProvider";

// ─── constants ────────────────────────────────────────────────────────────────

const PRIORITY_META = {
  low: { label: "LOW", tone: "#239654", bg: "#DDF8E7" },
  medium: { label: "MEDIUM", tone: "#8A6200", bg: "#FFF4D6" },
  high: { label: "HIGH PRIORITY", tone: "#D94444", bg: "#FDECEC" },
  critical: { label: "CRITICAL", tone: "#7B0000", bg: "#FFD6D6" },
};

const STATUS_META = {
  open: { label: "OPEN", tone: "#239654", bg: "#DDF8E7" },
  in_progress: { label: "IN PROGRESS", tone: "#0E56C8", bg: "#EEF4FF" },
  resolved: { label: "RESOLVED", tone: "#556478", bg: "#EEF2F6" },
  closed: { label: "CLOSED", tone: "#8B97A8", bg: "#F2F5F8" },
  cancelled: { label: "CANCELLED", tone: "#D94444", bg: "#FDECEC" },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDay(value) {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function getSlaStatus(ticket) {
  if (!ticket?.createdAt || !ticket?.resolutionTargetHours)
    return "SLA Status: Unknown";
  const deadline =
    new Date(ticket.createdAt).getTime() +
    ticket.resolutionTargetHours * 3600000;
  const remaining = deadline - Date.now();
  if (ticket.status === "resolved" || ticket.status === "closed")
    return "SLA Status: Met";
  if (remaining < 0) return "SLA Status: Breached";
  if (remaining < 3600000 * 4) return "SLA Status: At Risk";
  return "SLA Status: Healthy";
}

// ─── sub-components ──────────────────────────────────────────────────────────

function Badge({ label, tone, bg }) {
  return (
    <Box
      sx={{
        px: 1.1,
        py: 0.35,
        borderRadius: "0.45rem",
        bgcolor: bg,
        color: tone,
        fontSize: "0.62rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </Box>
  );
}

function MessageBubble({ msg, currentUserId }) {
  const isAdmin = msg.senderId === currentUserId || msg.type === "admin";

  if (msg.isInternal || msg.type === "internal") {
    return (
      <Box sx={{ mx: 2, my: 1 }}>
        <Box
          sx={{
            p: 1.6,
            borderRadius: "0.9rem",
            bgcolor: "#FFFDE7",
            border: "1px solid #FFF176",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Typography
              sx={{
                color: "#7A6000",
                fontSize: "0.7rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              🔒 Internal Team Note
            </Typography>
            <Typography sx={{ color: "#A89040", fontSize: "0.68rem" }}>
              {formatDateTime(msg.createdAt)}
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: "#4A3800",
              fontSize: "0.84rem",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            {msg.text}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isAdmin) {
    return (
      <Box sx={{ mx: 2, my: 1, display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ maxWidth: "72%" }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={0.8}
            sx={{ mb: 0.4 }}
          >
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem" }}>
              {formatDateTime(msg.createdAt)}
            </Typography>
            <Typography
              sx={{ color: "#0E56C8", fontSize: "0.7rem", fontWeight: 900 }}
            >
              YOU (ADMIN)
            </Typography>
          </Stack>
          <Box
            sx={{
              p: 1.6,
              borderRadius: "1rem 1rem 0.2rem 1rem",
              bgcolor: "#0E56C8",
              color: "#FFFFFF",
            }}
          >
            <Typography sx={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
              {msg.text}
            </Typography>
          </Box>
          <Typography
            sx={{
              mt: 0.4,
              color: "#A0ACBA",
              fontSize: "0.64rem",
              textAlign: "right",
            }}
          >
            ✓ Sent by Admin
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2, my: 1 }}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#EEF2F6",
            color: "#667386",
            fontSize: "0.68rem",
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {getInitials(msg.sender)}
        </Avatar>
        <Box sx={{ maxWidth: "72%" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.4 }}
          >
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              {msg.sender}
            </Typography>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.68rem" }}>
              {formatDateTime(msg.createdAt)}
            </Typography>
          </Stack>
          <Box
            sx={{
              p: 1.6,
              borderRadius: "0.2rem 1rem 1rem 1rem",
              bgcolor: "#F4F7FB",
              border: "1px solid rgba(225,232,241,0.96)",
            }}
          >
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.84rem",
                lineHeight: 1.6,
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminTicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id || user?.userId || "";
  const messagesEndRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const result = await ticketsApi.getById(ticketId);
      setTicket(result);
      setDraftStatus(result.status);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load ticket.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [ticketId]);

  async function handleSend() {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const updated = await ticketsApi.addMessage(ticketId, {
        text: replyText.trim(),
        isInternal,
        senderName: user?.fullName || user?.name || "Admin",
      });
      setTicket(updated);
      setReplyText("");
      setToast({
        open: true,
        message: isInternal ? "Internal note added." : "Reply sent.",
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not send reply.",
        severity: "error",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleUpdateStatus() {
    if (draftStatus === ticket?.status) return;
    setIsUpdating(true);
    try {
      const updated = await ticketsApi.update(ticketId, {
        status: draftStatus,
      });
      setTicket(updated);
      setToast({
        open: true,
        message: `Status updated to ${draftStatus.replace("_", " ")}.`,
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update status.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (isLoading) return <AdminLoadingState />;
  if (error)
    return (
      <AdminPageShell>
        <Button
          onClick={() => navigate("/admin/help-desk")}
          sx={{
            mb: 2,
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
          }}
        >
          ← Back to Help Desk
        </Button>
        <AdminErrorState>{error}</AdminErrorState>
      </AdminPageShell>
    );
  if (!ticket) return null;

  const priorityDef = PRIORITY_META[ticket.priority] || PRIORITY_META.medium;
  const statusDef = STATUS_META[ticket.status] || STATUS_META.open;
  const slaStatus = getSlaStatus(ticket);
  const slaColor = slaStatus.includes("Breached")
    ? "#D94444"
    : slaStatus.includes("At Risk")
      ? "#D97706"
      : "#239654";

  // Group messages by day for dividers
  const groupedMessages = [];
  let lastDay = null;
  for (const msg of ticket.messages || []) {
    const day = formatDay(msg.createdAt);
    if (day !== lastDay) {
      groupedMessages.push({ type: "divider", day });
      lastDay = day;
    }
    groupedMessages.push({ type: "message", msg });
  }

  return (
    <AdminPageShell>
      {/* Back nav */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Button
          onClick={() => navigate("/admin/help-desk")}
          sx={{
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": {
              bgcolor: "transparent",
              color: adminUi.colors.primary,
            },
          }}
        >
          ← Back to Help Desk
        </Button>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={load}
            sx={{
              color: adminUi.colors.muted,
              border: "1px solid rgba(225,232,241,0.96)",
              borderRadius: "0.65rem",
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
          <IconButton size="small" sx={{ color: adminUi.colors.muted }}>
            <IosShareRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
          <IconButton size="small" sx={{ color: adminUi.colors.muted }}>
            <MoreVertRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Ticket header card */}
      <AdminPanel sx={{ p: { xs: 2, md: 2.8 }, mb: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          sx={{ mb: 1.5 }}
        >
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.78rem",
              fontWeight: 800,
            }}
          >
            #{ticket.ticketId}
          </Typography>
          <Badge
            label={priorityDef.label}
            tone={priorityDef.tone}
            bg={priorityDef.bg}
          />
          <Badge
            label={statusDef.label}
            tone={statusDef.tone}
            bg={statusDef.bg}
          />
        </Stack>

        <Typography
          sx={{
            color: adminUi.colors.text,
            fontSize: "1.35rem",
            fontWeight: 900,
            mb: 2,
          }}
        >
          {ticket.title}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Customer card */}
          <Box
            sx={{
              p: 1.8,
              borderRadius: "0.9rem",
              border: "1px solid rgba(225,232,241,0.96)",
              bgcolor: "#FAFBFC",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#EEF2F6",
                  color: "#667386",
                  fontSize: "0.82rem",
                  fontWeight: 900,
                }}
              >
                {getInitials(ticket.customerName)}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.96rem",
                    fontWeight: 900,
                  }}
                >
                  {ticket.customerName}
                </Typography>
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.74rem" }}
                >
                  {ticket.customerType}
                  {ticket.customerLocation
                    ? ` • ${ticket.customerLocation}`
                    : ""}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.4 }}>
                  <Box
                    sx={{
                      px: 0.8,
                      py: 0.2,
                      borderRadius: "999px",
                      bgcolor: "#EEF4FF",
                      color: "#0E56C8",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                    }}
                  >
                    {ticket.customerPlan}
                  </Box>
                  {ticket.customerEmail && (
                    <Typography
                      sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}
                    >
                      {ticket.customerEmail}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Meta */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
          >
            {[
              {
                label: "Requested On",
                value: formatDateTime(ticket.createdAt),
              },
              { label: "Issue Type", value: ticket.issueType },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Typography
                  sx={{
                    color: adminUi.colors.muted,
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 0.3,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography
                sx={{
                  color: adminUi.colors.muted,
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  mb: 0.3,
                }}
              >
                Assigned Agent
              </Typography>
              <Typography
                sx={{
                  color: adminUi.colors.primary,
                  fontSize: "0.82rem",
                  fontWeight: 800,
                }}
              >
                {ticket.assignedAgentName || "Unassigned"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description + Attachments */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mt: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: adminUi.colors.muted,
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 0.8,
              }}
            >
              Issue Description
            </Typography>
            <Typography
              sx={{ color: "#344155", fontSize: "0.84rem", lineHeight: 1.7 }}
            >
              {ticket.description}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: adminUi.colors.muted,
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 0.8,
              }}
            >
              Attachments ({(ticket.attachments || []).length})
            </Typography>
            {(ticket.attachments || []).length === 0 ? (
              <Typography sx={{ color: "#A0ACBA", fontSize: "0.8rem" }}>
                No attachments
              </Typography>
            ) : (
              <Stack spacing={0.8}>
                {ticket.attachments.map((file) => (
                  <Stack
                    key={file.name}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      p: 1.2,
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(225,232,241,0.96)",
                      bgcolor: "#FAFBFC",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#EEF4FF" },
                    }}
                  >
                    <PictureAsPdfOutlinedIcon
                      sx={{ color: "#D94444", fontSize: "1.3rem" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                        }}
                      >
                        {file.name}
                      </Typography>
                      {file.size && (
                        <Typography
                          sx={{
                            color: adminUi.colors.muted,
                            fontSize: "0.66rem",
                          }}
                        >
                          {file.size}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Quick status update */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 2.2, pt: 2, borderTop: "1px solid rgba(225,232,241,0.96)" }}
        >
          <TextField
            select
            size="small"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            sx={{
              minWidth: 180,
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.75rem",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              },
            }}
          >
            {Object.entries(STATUS_META).map(([v, m]) => (
              <MenuItem key={v} value={v}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            disabled={isUpdating || draftStatus === ticket.status}
            sx={{
              minHeight: 38,
              px: 2,
              borderRadius: "0.85rem",
              bgcolor: "#0E56C8",
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "none",
              "&:hover": { bgcolor: "#0B49AD" },
            }}
          >
            {isUpdating ? "Updating…" : "Update Status"}
          </Button>
        </Stack>
      </AdminPanel>

      {/* Communication History */}
      <AdminPanel sx={{ mb: 2.5, overflow: "hidden" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2.5,
            py: 1.8,
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                bgcolor: "#EEF4FF",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CampaignOutlinedIcon
                sx={{ color: "#0E56C8", fontSize: "1rem" }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1rem",
                  fontWeight: 900,
                }}
              >
                Communication History
              </Typography>
              <Typography
                sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}
              >
                All customer interactions and internal notes
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              px: 1.4,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "#DDF8E7",
              color: "#239654",
              fontSize: "0.68rem",
              fontWeight: 900,
            }}
          >
            + ACTIVE STREAM
          </Box>
        </Stack>

        {/* Messages */}
        <Box sx={{ py: 1.5, maxHeight: 480, overflowY: "auto" }}>
          {groupedMessages.length === 0 ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>
                No messages yet. Start the conversation.
              </Typography>
            </Box>
          ) : null}
          {groupedMessages.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <Box key={`div-${idx}`} sx={{ textAlign: "center", my: 1.5 }}>
                  <Typography
                    sx={{
                      color: "#A0ACBA",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.day}
                  </Typography>
                </Box>
              );
            }
            return (
              <MessageBubble
                key={item.msg._id || idx}
                msg={item.msg}
                currentUserId={currentUserId}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Reply box */}
        <Box
          sx={{
            px: 2.5,
            pb: 2,
            pt: 1,
            borderTop: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder={
              isInternal
                ? "Add internal note (not visible to customer)…"
                : "Type your reply or internal note here…"
            }
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              mb: 1.2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.9rem",
                bgcolor: isInternal ? "#FFFDE7" : "#F7F9FC",
                fontSize: "0.86rem",
                border: isInternal ? "1px solid #FFF176" : undefined,
              },
            }}
            InputProps={{
              endAdornment: (
                <Box sx={{ alignSelf: "flex-end", pb: 0.5 }}>
                  <IconButton
                    onClick={handleSend}
                    disabled={!replyText.trim() || isSending}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: replyText.trim() ? "#0E56C8" : "#E5EAF1",
                      color: replyText.trim() ? "#FFFFFF" : "#A0ACBA",
                      borderRadius: "0.7rem",
                      "&:hover": {
                        bgcolor: replyText.trim() ? "#0B49AD" : "#E5EAF1",
                      },
                    }}
                  >
                    {isSending ? (
                      <CircularProgress size={14} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      <SendRoundedIcon sx={{ fontSize: "0.9rem" }} />
                    )}
                  </IconButton>
                </Box>
              ),
            }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={
                  <AttachFileRoundedIcon sx={{ fontSize: "0.85rem" }} />
                }
                sx={{
                  color: adminUi.colors.muted,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 1,
                }}
              >
                Attach
              </Button>
              <Button
                size="small"
                startIcon={
                  <CampaignOutlinedIcon sx={{ fontSize: "0.85rem" }} />
                }
                sx={{
                  color: adminUi.colors.muted,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 1,
                }}
              >
                Canned Responses
              </Button>
            </Stack>
            <Button
              size="small"
              onClick={() => setIsInternal(!isInternal)}
              startIcon={
                <StickyNote2OutlinedIcon sx={{ fontSize: "0.85rem" }} />
              }
              sx={{
                px: 1.4,
                py: 0.5,
                borderRadius: "999px",
                bgcolor: isInternal ? "#FFFDE7" : "#F4F7FB",
                color: isInternal ? "#7A6000" : adminUi.colors.muted,
                fontSize: "0.74rem",
                fontWeight: 800,
                textTransform: "none",
                border: isInternal
                  ? "1px solid #FFF176"
                  : "1px solid transparent",
              }}
            >
              Post as Internal Note
            </Button>
          </Stack>
        </Box>
      </AdminPanel>

      {/* Bottom metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <AdminPanel sx={{ p: 2.2, bgcolor: "#EEF4FF" }}>
          <Typography
            sx={{
              color: "#7A96C8",
              fontSize: "0.6rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 0.6,
            }}
          >
            Resolution Target
          </Typography>
          <Typography
            sx={{
              color: "#0E56C8",
              fontSize: "1.6rem",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {ticket.resolutionTargetHours} Hours
          </Typography>
          <Box
            sx={{
              mt: 1,
              px: 1,
              py: 0.3,
              borderRadius: "999px",
              bgcolor: "#DDF8E7",
              color: slaColor,
              fontSize: "0.62rem",
              fontWeight: 900,
              display: "inline-flex",
            }}
          >
            {slaStatus}
          </Box>
        </AdminPanel>

        <AdminPanel sx={{ p: 2.2, bgcolor: "#FFFDE7" }}>
          <Typography
            sx={{
              color: "#A89040",
              fontSize: "0.6rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 0.6,
            }}
          >
            Satisfaction Potential
          </Typography>
          <Typography
            sx={{
              color: "#7A6000",
              fontSize: "1.6rem",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {ticket.satisfactionPotential || "Medium Impact"}
          </Typography>
          {ticket.satisfactionNote && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.3,
                borderRadius: "999px",
                bgcolor: "#FFF4D6",
                color: "#8A6200",
                fontSize: "0.62rem",
                fontWeight: 900,
                display: "inline-flex",
              }}
            >
              {ticket.satisfactionNote}
            </Box>
          )}
        </AdminPanel>

        <AdminPanel sx={{ p: 2.2, bgcolor: "#F4F7FB" }}>
          <Typography
            sx={{
              color: "#7A8799",
              fontSize: "0.6rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 0.6,
            }}
          >
            Ticket Category
          </Typography>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.6rem",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {ticket.category || "General"}
          </Typography>
          {ticket.categoryNote && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.3,
                borderRadius: "999px",
                bgcolor: "#E5EAF1",
                color: "#556478",
                fontSize: "0.62rem",
                fontWeight: 900,
                display: "inline-flex",
              }}
            >
              {ticket.categoryNote}
            </Box>
          )}
        </AdminPanel>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            borderRadius: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(16,29,51,0.14)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AdminPageShell>
  );
}

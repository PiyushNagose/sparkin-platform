import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { broadcastsApi } from "@/features/admin/api/broadcastsApi";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const MESSAGE_TYPES = [
  { value: "info", label: "Info", color: "#0E56C8", bg: "#EEF4FF" },
  { value: "alert", label: "Alert", color: "#D97706", bg: "#FFF4D6" },
  { value: "reminder", label: "Reminder", color: "#239654", bg: "#DDF8E7" },
];

const CHANNEL_DEFS = [
  {
    key: "notification",
    label: "In-App Notification",
    Icon: NotificationsNoneOutlinedIcon,
  },
  { key: "email", label: "Email", Icon: EmailOutlinedIcon },
  { key: "sms", label: "SMS", Icon: SmsOutlinedIcon },
];

const STATUS_META = {
  draft: { label: "DRAFT", tone: "#667386", bg: "#EEF2F6" },
  scheduled: { label: "SCHEDULED", tone: "#0E56C8", bg: "#EEF4FF" },
  sent: { label: "SENT", tone: "#239654", bg: "#DDF8E7" },
  failed: { label: "FAILED", tone: "#D94444", bg: "#FDECEC" },
  cancelled: { label: "CANCELLED", tone: "#8B97A8", bg: "#F2F5F8" },
};

const EMPTY_FORM = {
  title: "",
  description: "",
  messageType: "info",
  audience: { leads: false, customers: false, vendors: false, allUsers: false },
  channels: { notification: true, email: false, sms: false },
  timing: "now",
  scheduledAt: "",
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

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

function buildAudienceLabel(audience) {
  if (!audience) return "—";
  if (audience.allUsers) return "All Users";
  const parts = [];
  if (audience.leads) parts.push("Leads");
  if (audience.customers) parts.push("Customers");
  if (audience.vendors) parts.push("Vendors");
  return parts.join(", ") || "None";
}

function getActiveChannels(channels) {
  if (!channels) return [];
  return CHANNEL_DEFS.filter((c) => channels[c.key]);
}

function validateForm(form) {
  const errors = [];
  if (!form.title.trim() || form.title.trim().length < 3)
    errors.push("Title must be at least 3 characters");
  if (!form.description.trim() || form.description.trim().length < 10)
    errors.push("Description must be at least 10 characters");
  const hasAudience =
    form.audience.allUsers ||
    form.audience.leads ||
    form.audience.customers ||
    form.audience.vendors;
  if (!hasAudience) errors.push("Select at least one audience group");
  const hasChannel =
    form.channels.notification || form.channels.email || form.channels.sms;
  if (!hasChannel) errors.push("Select at least one delivery channel");
  if (form.timing === "scheduled") {
    if (!form.scheduledAt) errors.push("Select a scheduled date and time");
    else if (new Date(form.scheduledAt) <= new Date())
      errors.push("Scheduled time must be in the future");
  }
  return errors;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        color: adminUi.colors.muted,
        fontSize: "0.6rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        mb: 1.2,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Create Broadcast tab ─────────────────────────────────────────────────────

function CreateBroadcastTab({ onSent }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  function updateAudience(key) {
    setForm((f) => ({
      ...f,
      audience: { ...f.audience, [key]: !f.audience[key] },
    }));
  }

  function toggleChannel(key) {
    setForm((f) => ({
      ...f,
      channels: { ...f.channels, [key]: !f.channels[key] },
    }));
  }

  // Estimated recipient count
  const estimatedCount = useMemo(() => {
    if (form.audience.allUsers) return "~1,000+";
    let n = 0;
    if (form.audience.leads) n += 300;
    if (form.audience.customers) n += 450;
    if (form.audience.vendors) n += 80;
    return n > 0 ? `~${n.toLocaleString("en-IN")}` : "0";
  }, [form.audience]);

  async function handleSend() {
    const errors = validateForm(form);
    if (errors.length) {
      setFormError(errors[0]);
      return;
    }
    setFormError("");
    setIsSending(true);
    try {
      await broadcastsApi.send({
        title: form.title.trim(),
        description: form.description.trim(),
        messageType: form.messageType,
        audience: form.audience,
        channels: form.channels,
        timing: form.timing,
        scheduledAt:
          form.timing === "scheduled"
            ? new Date(form.scheduledAt).toISOString()
            : null,
      });
      setForm(EMPTY_FORM);
      setToast({
        open: true,
        message:
          form.timing === "scheduled"
            ? "Broadcast scheduled successfully."
            : "Broadcast sent successfully.",
        severity: "success",
      });
      onSent?.();
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not send broadcast.",
        severity: "error",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleSaveDraft() {
    setIsSavingDraft(true);
    setFormError("");
    try {
      await broadcastsApi.saveDraft({
        title: form.title.trim() || "Untitled Draft",
        description: form.description.trim(),
        messageType: form.messageType,
        audience: form.audience,
        channels: form.channels,
        timing: form.timing,
      });
      setForm(EMPTY_FORM);
      setToast({ open: true, message: "Draft saved.", severity: "success" });
      onSent?.();
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not save draft.",
        severity: "error",
      });
    } finally {
      setIsSavingDraft(false);
    }
  }

  const selectedType =
    MESSAGE_TYPES.find((t) => t.value === form.messageType) || MESSAGE_TYPES[0];

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <Stack spacing={2.5}>
          {/* Audience Selection */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.2 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#EEF4FF",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Groups2OutlinedIcon
                  sx={{ color: "#0E56C8", fontSize: "1.1rem" }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "1.05rem",
                    fontWeight: 900,
                  }}
                >
                  Audience Selection
                </Typography>
                {estimatedCount !== "0" && (
                  <Typography sx={{ color: "#8B97A8", fontSize: "0.72rem" }}>
                    Estimated reach:{" "}
                    <Box
                      component="span"
                      sx={{ color: "#0E56C8", fontWeight: 800 }}
                    >
                      {estimatedCount} recipients
                    </Box>
                  </Typography>
                )}
              </Box>
            </Stack>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Box>
                <SectionLabel>User Groups</SectionLabel>
                <Stack spacing={0.4}>
                  {[
                    ["leads", "Leads"],
                    ["vendors", "Vendors"],
                    ["customers", "Customers"],
                    ["allUsers", "All Users"],
                  ].map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={form.audience[key]}
                          onChange={() => updateAudience(key)}
                          size="small"
                          sx={{
                            color: "#C8D4E4",
                            "&.Mui-checked": { color: "#0E56C8" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "0.86rem",
                            fontWeight: 700,
                            color: adminUi.colors.text,
                          }}
                        >
                          {label}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <SectionLabel>Advanced Filters</SectionLabel>
                <Stack spacing={1}>
                  {["All Regions", "User Status"].map((filter) => (
                    <Box
                      key={filter}
                      sx={{
                        px: 1.4,
                        py: 0.9,
                        borderRadius: "0.7rem",
                        bgcolor: "#F4F7FB",
                        border: "1px solid rgba(225,232,241,0.96)",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#EEF4FF" },
                        transition: "background 0.15s",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#556478",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {filter}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </AdminPanel>

          {/* Message Configuration */}
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.2 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#FFFDE7",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <WarningAmberRoundedIcon
                  sx={{ color: "#D97706", fontSize: "1.1rem" }}
                />
              </Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.05rem",
                  fontWeight: 900,
                }}
              >
                Message Configuration
              </Typography>
            </Stack>

            <SectionLabel>Message Type</SectionLabel>
            <Stack direction="row" spacing={1} sx={{ mb: 2.4 }}>
              {MESSAGE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  onClick={() =>
                    setForm((f) => ({ ...f, messageType: type.value }))
                  }
                  sx={{
                    px: 1.6,
                    py: 0.5,
                    borderRadius: "999px",
                    bgcolor:
                      form.messageType === type.value ? type.bg : "#F4F7FB",
                    color:
                      form.messageType === type.value
                        ? type.color
                        : adminUi.colors.muted,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    textTransform: "none",
                    border: `1.5px solid ${form.messageType === type.value ? type.color + "40" : "transparent"}`,
                    "&:hover": { bgcolor: type.bg },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: type.color,
                      mr: 0.7,
                      display: "inline-block",
                    }}
                  />
                  {type.label}
                </Button>
              ))}
            </Stack>

            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.82rem",
                fontWeight: 800,
                mb: 0.6,
              }}
            >
              Broadcast Title *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g., System Maintenance Update"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.88rem",
                },
              }}
            />

            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.82rem",
                fontWeight: 800,
                mb: 0.6,
              }}
            >
              Message Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="Draft your detailed message here..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.88rem",
                },
              }}
            />
            <Typography
              sx={{
                mt: 0.5,
                color:
                  form.description.trim().length > 0 &&
                  form.description.trim().length < 10
                    ? "#E07B00"
                    : "#9AAABB",
                fontSize: "0.68rem",
              }}
            >
              {form.description.trim().length} / 5000 characters
            </Typography>

            {formError ? (
              <Alert severity="error" sx={{ mt: 1.5, borderRadius: "0.75rem" }}>
                {formError}
              </Alert>
            ) : null}
          </AdminPanel>
        </Stack>

        {/* Right column — Delivery & Schedule */}
        <Stack spacing={2.5}>
          <AdminPanel sx={{ p: 2.8 }}>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.2 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.65rem",
                  bgcolor: "#DDF8E7",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ color: "#239654", fontSize: "1.1rem" }}
                />
              </Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.05rem",
                  fontWeight: 900,
                }}
              >
                Delivery & Schedule
              </Typography>
            </Stack>

            <SectionLabel>Channels</SectionLabel>
            <Stack spacing={1.1} sx={{ mb: 2.6 }}>
              {CHANNEL_DEFS.map(({ key, label, Icon }) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 1.4,
                    py: 1,
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(225,232,241,0.96)",
                    bgcolor: form.channels[key] ? "#F0F5FF" : "#FAFBFC",
                    transition: "background 0.15s",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon
                      sx={{
                        fontSize: "1rem",
                        color: form.channels[key] ? "#0E56C8" : "#A0ACBA",
                      }}
                    />
                    <Typography
                      sx={{
                        color: form.channels[key]
                          ? adminUi.colors.text
                          : "#A0ACBA",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                  <Switch
                    checked={form.channels[key]}
                    onChange={() => toggleChannel(key)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#0E56C8",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { bgcolor: "#0E56C8" },
                    }}
                  />
                </Stack>
              ))}
            </Stack>

            <SectionLabel>Timing</SectionLabel>
            <RadioGroup
              value={form.timing}
              onChange={(e) =>
                setForm((f) => ({ ...f, timing: e.target.value }))
              }
            >
              <Stack spacing={1}>
                {[
                  {
                    value: "now",
                    label: "Send Now",
                    sub: "Immediate delivery to all channels",
                  },
                  {
                    value: "scheduled",
                    label: "Schedule for Later",
                    sub: "Pick a future date and time",
                  },
                ].map((opt) => (
                  <Box
                    key={opt.value}
                    onClick={() =>
                      setForm((f) => ({ ...f, timing: opt.value }))
                    }
                    sx={{
                      px: 1.6,
                      py: 1.2,
                      borderRadius: "0.85rem",
                      border: `2px solid ${form.timing === opt.value ? "#0E56C8" : "rgba(225,232,241,0.96)"}`,
                      bgcolor:
                        form.timing === opt.value ? "#EEF4FF" : "#FAFBFC",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Radio
                        value={opt.value}
                        size="small"
                        sx={{
                          p: 0,
                          mt: 0.1,
                          color: "#C8D4E4",
                          "&.Mui-checked": { color: "#0E56C8" },
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            color:
                              form.timing === opt.value
                                ? "#0E56C8"
                                : adminUi.colors.text,
                            fontSize: "0.86rem",
                            fontWeight: 800,
                          }}
                        >
                          {opt.label}
                        </Typography>
                        <Typography
                          sx={{
                            color: adminUi.colors.muted,
                            fontSize: "0.72rem",
                          }}
                        >
                          {opt.sub}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}

                {form.timing === "scheduled" && (
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayOutlinedIcon
                            sx={{ color: "#A0ACBA", fontSize: "0.9rem" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.75rem",
                        bgcolor: "#F7F9FC",
                        fontSize: "0.84rem",
                      },
                    }}
                  />
                )}
              </Stack>
            </RadioGroup>
          </AdminPanel>

          {/* Action buttons */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<SendRoundedIcon />}
            onClick={handleSend}
            disabled={isSending || isSavingDraft}
            sx={{
              minHeight: 50,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              fontSize: "0.92rem",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "0 10px 24px rgba(14,86,200,0.25)",
              "&:hover": { bgcolor: "#0B49AD" },
            }}
          >
            {isSending
              ? "Sending…"
              : form.timing === "scheduled"
                ? "Schedule Broadcast"
                : "Send Broadcast"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleSaveDraft}
            disabled={isSending || isSavingDraft}
            sx={{
              minHeight: 50,
              borderRadius: "0.9rem",
              borderColor: "rgba(225,232,241,0.96)",
              color: adminUi.colors.text,
              fontSize: "0.92rem",
              fontWeight: 800,
              textTransform: "none",
              bgcolor: "#F4F7FB",
              "&:hover": { bgcolor: "#E5EAF1", borderColor: "#C8D4E4" },
            }}
          >
            {isSavingDraft ? "Saving…" : "Save Draft"}
          </Button>
        </Stack>
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
    </>
  );
}

// ─── Broadcast History tab ────────────────────────────────────────────────────

function BroadcastHistoryTab() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  const load = useCallback(
    async (p = page, sf = statusFilter) => {
      setIsLoading(true);
      setError("");
      try {
        const result = await broadcastsApi.list({
          page: p,
          limit: PAGE_SIZE,
          ...(sf !== "all" ? { status: sf } : {}),
        });
        setBroadcasts(result.broadcasts || []);
        setTotal(result.total || 0);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Could not load broadcast history.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [page, statusFilter],
  );

  useEffect(() => {
    load(page, statusFilter);
  }, [page, statusFilter]);

  function changePage(newPage) {
    setPage(newPage);
  }

  function changeFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  async function handleCancel(broadcast) {
    setActionLoading(broadcast.broadcastId);
    try {
      await broadcastsApi.cancel(broadcast.broadcastId);
      setToast({
        open: true,
        message: `Broadcast "${broadcast.title}" cancelled.`,
        severity: "info",
      });
      load(page, statusFilter);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not cancel.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDelete(broadcast) {
    if (!window.confirm(`Delete "${broadcast.title}"? This cannot be undone.`))
      return;
    setActionLoading(broadcast.broadcastId);
    try {
      await broadcastsApi.remove(broadcast.broadcastId);
      setToast({
        open: true,
        message: `Broadcast deleted.`,
        severity: "success",
      });
      load(page, statusFilter);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not delete.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  const firstVisible = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisible = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

  return (
    <>
      {/* Filters */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.4}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2.2 }}
      >
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => changeFilter(e.target.value)}
          sx={{
            minWidth: 180,
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "999px",
              bgcolor: "#F6F8FB",
              fontSize: "0.8rem",
              fontWeight: 700,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListRoundedIcon
                  sx={{ color: "#9AAABB", fontSize: "0.95rem" }}
                />
              </InputAdornment>
            ),
          }}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <Tooltip title="Refresh">
          <IconButton
            onClick={() => load(page, statusFilter)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "0.85rem",
              bgcolor: "#EFF3F7",
              color: "#1F2C40",
              "&:hover": { bgcolor: "#E2E8F0" },
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Tooltip>

        <Typography
          sx={{
            ml: { md: "auto" },
            color: "#667386",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          {total === 0
            ? "No broadcasts"
            : `Showing ${firstVisible}–${lastVisible} of ${total} records`}
        </Typography>
      </Stack>

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}

      {isLoading ? (
        <AdminLoadingState minHeight={300} />
      ) : (
        <AdminPanel sx={{ overflow: "hidden" }}>
          {/* Table header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 0.9fr 0.8fr 1.3fr 0.7fr",
              gap: 1,
              px: 2.5,
              py: 1.6,
              bgcolor: "#F6F8FB",
              borderBottom: "1px solid rgba(225,232,241,0.96)",
            }}
          >
            {[
              "Broadcast Title",
              "Audience",
              "Channels",
              "Status",
              "Date Sent/Scheduled",
              "Actions",
            ].map((h) => (
              <Typography
                key={h}
                sx={{
                  color: "#738096",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </Typography>
            ))}
          </Box>

          {broadcasts.length === 0 ? (
            <Box sx={{ py: 4 }}>
              <AdminEmptyState
                title="No broadcasts found"
                subtitle={
                  statusFilter !== "all"
                    ? "Try a different status filter."
                    : "Create your first broadcast to get started."
                }
              />
            </Box>
          ) : null}

          {broadcasts.map((item, index) => {
            const statusDef = STATUS_META[item.status] || STATUS_META.draft;
            const activeChannels = getActiveChannels(item.channels);
            const isActioning = actionLoading === item.broadcastId;
            const canCancel = ["draft", "scheduled"].includes(item.status);
            const canDelete = [
              "draft",
              "scheduled",
              "failed",
              "cancelled",
            ].includes(item.status);
            const displayDate =
              item.status === "scheduled"
                ? formatDateTime(item.scheduledAt)
                : formatDateTime(item.sentAt || item.createdAt);

            return (
              <Box
                key={item.broadcastId}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 0.9fr 0.8fr 1.3fr 0.7fr",
                  gap: 1,
                  px: 2.5,
                  py: 2,
                  alignItems: "center",
                  borderTop:
                    index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)",
                  "&:hover": { bgcolor: "#F7F9FC" },
                  transition: "background 0.15s",
                }}
              >
                {/* Title */}
                <Box>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.88rem",
                      fontWeight: 900,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: adminUi.colors.muted,
                      fontSize: "0.7rem",
                      mt: 0.2,
                    }}
                  >
                    ID: {item.broadcastId}
                  </Typography>
                  {item.recipientCount > 0 && (
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.66rem" }}>
                      {item.recipientCount.toLocaleString("en-IN")} recipients
                    </Typography>
                  )}
                </Box>

                {/* Audience */}
                <Typography
                  sx={{
                    color: "#344155",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  {buildAudienceLabel(item.audience)}
                </Typography>

                {/* Channels */}
                <Stack direction="row" spacing={0.6} alignItems="center">
                  {activeChannels.map(({ key, Icon }) => (
                    <Tooltip key={key} title={key} placement="top">
                      <Icon sx={{ fontSize: "1rem", color: "#0E56C8" }} />
                    </Tooltip>
                  ))}
                  {activeChannels.length === 0 && (
                    <Typography sx={{ color: "#9AAABB", fontSize: "0.72rem" }}>
                      —
                    </Typography>
                  )}
                </Stack>

                {/* Status */}
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 0.9,
                    py: 0.4,
                    borderRadius: "0.5rem",
                    bgcolor: statusDef.bg,
                    color: statusDef.tone,
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    width: "fit-content",
                  }}
                >
                  {statusDef.label}
                </Box>

                {/* Date */}
                <Typography sx={{ color: "#667386", fontSize: "0.78rem" }}>
                  {displayDate}
                </Typography>

                {/* Actions */}
                <Stack direction="row" spacing={0.4} alignItems="center">
                  {canCancel && (
                    <Tooltip title="Cancel broadcast">
                      <IconButton
                        size="small"
                        disabled={isActioning}
                        onClick={() => handleCancel(item)}
                        sx={{
                          color: "#D97706",
                          bgcolor: "#FFF4D6",
                          borderRadius: "0.55rem",
                          "&:hover": { bgcolor: "#FFE9A0" },
                        }}
                      >
                        <CancelOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip title="Delete broadcast">
                      <IconButton
                        size="small"
                        disabled={isActioning}
                        onClick={() => handleDelete(item)}
                        sx={{
                          color: "#D94444",
                          bgcolor: "#FDECEC",
                          borderRadius: "0.55rem",
                          "&:hover": { bgcolor: "#FFCFCF" },
                        }}
                      >
                        <DeleteOutlineRoundedIcon
                          sx={{ fontSize: "0.95rem" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            );
          })}

          {/* Pagination */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.4}
            sx={{
              px: 2.5,
              py: 1.8,
              borderTop: "1px solid rgba(225,232,241,0.96)",
            }}
          >
            <Typography
              sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
            >
              {total === 0
                ? "No records"
                : `Showing ${firstVisible}–${lastVisible} of ${total} records`}
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                size="small"
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "0.6rem",
                  border: "1px solid #E2E8F0",
                  color: "#667386",
                  "&:disabled": { opacity: 0.4 },
                }}
              >
                <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>

              {pageNumbers.map((n, idx) => {
                const prev = pageNumbers[idx - 1];
                const showEllipsis = prev && n - prev > 1;
                return (
                  <Stack
                    key={n}
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                  >
                    {showEllipsis && (
                      <Typography
                        sx={{ color: "#8B97A8", fontSize: "0.72rem", px: 0.3 }}
                      >
                        …
                      </Typography>
                    )}
                    <Box
                      onClick={() => changePage(n)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "0.6rem",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        bgcolor: n === page ? "#0E56C8" : "transparent",
                        color: n === page ? "#FFFFFF" : "#223146",
                        border: n === page ? "none" : "1px solid #E2E8F0",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        transition: "all 0.15s",
                        "&:hover": {
                          bgcolor: n === page ? "#0B49AD" : "#EEF4FF",
                        },
                      }}
                    >
                      {n}
                    </Box>
                  </Stack>
                );
              })}

              <IconButton
                size="small"
                disabled={page === totalPages}
                onClick={() => changePage(page + 1)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "0.6rem",
                  border: "1px solid #E2E8F0",
                  color: "#667386",
                  "&:disabled": { opacity: 0.4 },
                }}
              >
                <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Stack>
          </Stack>
        </AdminPanel>
      )}

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
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <AdminPageShell>
      {/* Header + tab toggle */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: { xs: "1.9rem", md: "2.3rem" },
              fontWeight: 850,
              lineHeight: 1,
            }}
          >
            Broadcast
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              maxWidth: 480,
              color: adminUi.colors.muted,
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            Manage targeted communications and platform alerts to keep your
            solar ecosystem informed and efficient.
          </Typography>
        </Box>

        {/* Tab toggle — matches design exactly */}
        <Stack
          direction="row"
          sx={{
            border: "1px solid rgba(225,232,241,0.96)",
            borderRadius: "0.85rem",
            overflow: "hidden",
            flexShrink: 0,
            alignSelf: { xs: "flex-start", md: "center" },
          }}
        >
          {[
            { value: "create", label: "Create Broadcast" },
            { value: "history", label: "Broadcast History" },
          ].map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              sx={{
                px: 2.2,
                py: 1,
                borderRadius: 0,
                bgcolor: activeTab === tab.value ? "#0E56C8" : "#FFFFFF",
                color:
                  activeTab === tab.value ? "#FFFFFF" : adminUi.colors.muted,
                fontSize: "0.84rem",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  bgcolor: activeTab === tab.value ? "#0B49AD" : "#F4F7FB",
                },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      {activeTab === "create" ? (
        <CreateBroadcastTab onSent={() => setActiveTab("history")} />
      ) : (
        <BroadcastHistoryTab />
      )}
    </AdminPageShell>
  );
}

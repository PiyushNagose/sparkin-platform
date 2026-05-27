import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { adminVendorsApi } from "@/features/admin/api/adminApi";
import { ticketsApi } from "@/features/admin/api/ticketsApi";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  AdminPrimaryButton,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const PRIORITY_META = {
  low: { label: "LOW", tone: "#239654", bg: "#DDF8E7" },
  medium: { label: "MEDIUM", tone: "#8A6200", bg: "#FFF4D6" },
  high: { label: "HIGH", tone: "#D94444", bg: "#FDECEC" },
  critical: { label: "CRITICAL", tone: "#7B0000", bg: "#FFD6D6" },
};

const STATUS_META = {
  open: { label: "OPEN", tone: "#239654", bg: "#DDF8E7" },
  in_progress: { label: "IN PROGRESS", tone: "#0E56C8", bg: "#EEF4FF" },
  resolved: { label: "RESOLVED", tone: "#556478", bg: "#EEF2F6" },
  closed: { label: "CLOSED", tone: "#8B97A8", bg: "#F2F5F8" },
  cancelled: { label: "CANCELLED", tone: "#D94444", bg: "#FDECEC" },
};

const EMPTY_CREATE = {
  title: "",
  description: "",
  issueType: "",
  priority: "medium",
  customerName: "",
  customerEmail: "",
  customerType: "Residential User",
  customerPlan: "Standard Plan",
  customerLocation: "",
  category: "General",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

function formatTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(
    new Date(value),
  );
}

// ─── Tickets Tab ──────────────────────────────────────────────────────────────

function TicketsTab() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
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
    async (p = page, sf = statusFilter, pf = priorityFilter, sq = search) => {
      setIsLoading(true);
      setError("");
      try {
        const result = await ticketsApi.list({
          page: p,
          limit: PAGE_SIZE,
          ...(sf !== "all" ? { status: sf } : {}),
          ...(pf !== "all" ? { priority: pf } : {}),
          ...(sq.trim() ? { search: sq.trim() } : {}),
        });
        setTickets(result.tickets || []);
        setTotal(result.total || 0);
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load tickets.");
      } finally {
        setIsLoading(false);
      }
    },
    [page, statusFilter, priorityFilter, search],
  );

  useEffect(() => {
    load(page, statusFilter, priorityFilter, search);
  }, [page, statusFilter, priorityFilter]);

  // debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      load(1, statusFilter, priorityFilter, search);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  async function handleCreate() {
    if (
      !createForm.title.trim() ||
      !createForm.customerName.trim() ||
      !createForm.issueType.trim()
    ) {
      setCreateError("Title, customer name, and issue type are required.");
      return;
    }
    setIsCreating(true);
    setCreateError("");
    try {
      await ticketsApi.create(createForm);
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
      setToast({ open: true, message: "Ticket created.", severity: "success" });
      load(1, statusFilter, priorityFilter, search);
      setPage(1);
    } catch (err) {
      setCreateError(
        err?.response?.data?.message || "Could not create ticket.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  const firstVisible = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisible = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

  return (
    <>
      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={1.4}
        sx={{ mb: 2.2 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            size="small"
            placeholder="Search ticket, user, issue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "999px",
                bgcolor: "#F6F8FB",
                fontSize: "0.8rem",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "#9AAABB", fontSize: "1rem" }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => changeFilter(setStatusFilter, e.target.value)}
            sx={{
              minWidth: 150,
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
            <MenuItem value="all">All Statuses</MenuItem>
            {Object.entries(STATUS_META).map(([v, m]) => (
              <MenuItem key={v} value={v}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={priorityFilter}
            onChange={(e) => changeFilter(setPriorityFilter, e.target.value)}
            sx={{
              minWidth: 140,
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "999px",
                bgcolor: "#F6F8FB",
                fontSize: "0.8rem",
                fontWeight: 700,
              },
            }}
          >
            <MenuItem value="all">All Priorities</MenuItem>
            {Object.entries(PRIORITY_META).map(([v, m]) => (
              <MenuItem key={v} value={v}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => load(page, statusFilter, priorityFilter, search)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "0.85rem",
              bgcolor: "#EFF3F7",
              color: "#1F2C40",
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
          <AdminPrimaryButton
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: "999px", minHeight: 40, px: 2 }}
          >
            + New Ticket
          </AdminPrimaryButton>
        </Stack>
      </Stack>

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}

      {/* Table */}
      <AdminPanel sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1.4fr 1.2fr 0.7fr 0.9fr 0.8fr",
            gap: 1,
            px: 2.5,
            py: 1.6,
            bgcolor: "#F6F8FB",
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          {[
            "Ticket ID",
            "User",
            "Issue Type",
            "Priority",
            "Status",
            "Date",
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

        {isLoading ? <AdminLoadingState minHeight={200} /> : null}

        {!isLoading && tickets.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <AdminEmptyState
              title="No tickets found"
              subtitle={
                search || statusFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Create your first ticket to get started."
              }
            />
          </Box>
        ) : null}

        {tickets.map((ticket, index) => {
          const priorityDef =
            PRIORITY_META[ticket.priority] || PRIORITY_META.medium;
          const statusDef = STATUS_META[ticket.status] || STATUS_META.open;
          return (
            <Box
              key={ticket.ticketId}
              onClick={() => navigate(`/admin/help-desk/${ticket.ticketId}`)}
              sx={{
                display: "grid",
                gridTemplateColumns: "0.8fr 1.4fr 1.2fr 0.7fr 0.9fr 0.8fr",
                gap: 1,
                px: 2.5,
                py: 2,
                alignItems: "center",
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)",
                borderLeft:
                  ticket.priority === "high" || ticket.priority === "critical"
                    ? "3px solid #D94444"
                    : "3px solid transparent",
                cursor: "pointer",
                transition: "background 0.15s",
                "&:hover": { bgcolor: "#F0F5FF" },
              }}
            >
              <Typography
                sx={{ color: "#0E56C8", fontSize: "0.84rem", fontWeight: 900 }}
              >
                #{ticket.ticketId}
              </Typography>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#EEF2F6",
                    color: "#667386",
                    fontSize: "0.68rem",
                    fontWeight: 900,
                  }}
                >
                  {getInitials(ticket.customerName)}
                </Avatar>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.88rem",
                    fontWeight: 800,
                  }}
                >
                  {ticket.customerName}
                </Typography>
              </Stack>
              <Typography
                sx={{ color: "#344155", fontSize: "0.84rem", fontWeight: 700 }}
              >
                {ticket.issueType}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.9,
                  py: 0.4,
                  borderRadius: "0.5rem",
                  bgcolor: priorityDef.bg,
                  color: priorityDef.tone,
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  width: "fit-content",
                }}
              >
                {priorityDef.label}
              </Box>
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.9,
                  py: 0.4,
                  borderRadius: "0.5rem",
                  bgcolor: statusDef.bg,
                  color: statusDef.tone,
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  width: "fit-content",
                }}
              >
                {statusDef.label}
              </Box>
              <Typography sx={{ color: "#667386", fontSize: "0.8rem" }}>
                {formatDate(ticket.createdAt)}
              </Typography>
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
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>
            {total === 0
              ? "No tickets"
              : `Showing ${firstVisible}–${lastVisible} of ${total} tickets`}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage(n)}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create Ticket Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => {
          if (!isCreating) {
            setCreateOpen(false);
            setCreateError("");
            setCreateForm(EMPTY_CREATE);
          }
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "1.35rem",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 24px 52px rgba(16,29,51,0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#18253A",
            fontSize: "1.2rem",
            fontWeight: 800,
            pb: 1,
          }}
        >
          Create New Ticket
          <IconButton
            onClick={() => {
              if (!isCreating) {
                setCreateOpen(false);
                setCreateError("");
                setCreateForm(EMPTY_CREATE);
              }
            }}
            size="small"
            sx={{ color: "#8B97A8" }}
          >
            <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(229,234,241,0.95)" }}>
          <Stack spacing={1.8} sx={{ pt: 0.5 }}>
            {createError ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {createError}
              </Alert>
            ) : null}
            {[
              {
                label: "Title *",
                field: "title",
                placeholder: "e.g. Subsidy Disbursement Delay",
              },
              {
                label: "Customer Name *",
                field: "customerName",
                placeholder: "Full name",
              },
              {
                label: "Issue Type *",
                field: "issueType",
                placeholder: "e.g. Incentive / Subsidy Query",
              },
              {
                label: "Customer Email",
                field: "customerEmail",
                placeholder: "email@example.com",
              },
              {
                label: "Customer Location",
                field: "customerLocation",
                placeholder: "City, State",
              },
              {
                label: "Category",
                field: "category",
                placeholder: "e.g. Financial / Gov",
              },
            ].map(({ label, field, placeholder }) => (
              <Box key={field}>
                <Typography
                  sx={{
                    mb: 0.6,
                    color: "#8B97A8",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={placeholder}
                  value={createForm[field]}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.85rem",
                      bgcolor: "#F7F9FC",
                      fontSize: "0.88rem",
                    },
                  }}
                />
              </Box>
            ))}
            <Box>
              <Typography
                sx={{
                  mb: 0.6,
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Priority
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={createForm.priority}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, priority: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F7F9FC",
                    fontSize: "0.88rem",
                  },
                }}
              >
                {Object.entries(PRIORITY_META).map(([v, m]) => (
                  <MenuItem key={v} value={v}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <Typography
                sx={{
                  mb: 0.6,
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                size="small"
                placeholder="Describe the issue in detail…"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F7F9FC",
                    fontSize: "0.88rem",
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => {
              if (!isCreating) {
                setCreateOpen(false);
                setCreateError("");
                setCreateForm(EMPTY_CREATE);
              }
            }}
            disabled={isCreating}
            sx={{ textTransform: "none", fontWeight: 700, color: "#556478" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isCreating}
            sx={{
              minHeight: 40,
              px: 2.4,
              borderRadius: "999px",
              bgcolor: "#0E56C8",
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "0 10px 22px rgba(14,86,200,0.2)",
            }}
          >
            {isCreating ? "Creating…" : "Create Ticket"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ borderRadius: "0.9rem", fontWeight: 700 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────

function UserPickerDialog({ open, onClose, onSelect }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("vendors");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminVendorsApi
      .listVendors()
      .then(setVendors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  function getVendorName(v) {
    return (
      v.company?.name || v.account?.fullName || v.account?.email || "Vendor"
    );
  }
  function getVendorId(v) {
    return v.vendorId || v.id || v._id || "";
  }

  const filteredVendors = vendors.filter(
    (v) =>
      !query || getVendorName(v).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1.3rem",
          border: "1px solid rgba(225,232,241,0.96)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            color: adminUi.colors.text,
            fontSize: "1.1rem",
            fontWeight: 900,
          }}
        >
          Start New Chat
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#667386" }}>
          <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack
          direction="row"
          spacing={0}
          sx={{ borderBottom: "1px solid rgba(225,232,241,0.96)", mb: 2 }}
        >
          {["vendors", "customers"].map((t) => (
            <Button
              key={t}
              onClick={() => setTab(t)}
              sx={{
                minHeight: 36,
                px: 1.8,
                borderRadius: 0,
                borderBottom:
                  tab === t ? "2px solid #0E56C8" : "2px solid transparent",
                color: tab === t ? "#0E56C8" : "#6F7D8F",
                fontSize: "0.82rem",
                fontWeight: tab === t ? 800 : 600,
                textTransform: "capitalize",
                mb: "-1px",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </Stack>
        <TextField
          fullWidth
          size="small"
          placeholder={`Search ${tab}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon
                sx={{ color: "#A0ACBA", fontSize: "1rem", mr: 0.5 }}
              />
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { borderRadius: "0.85rem" },
          }}
        />
        {loading ? (
          <Box sx={{ py: 4, display: "grid", placeItems: "center" }}>
            <CircularProgress size={28} />
          </Box>
        ) : tab === "vendors" ? (
          filteredVendors.length === 0 ? (
            <Typography
              sx={{
                color: "#A0ACBA",
                fontSize: "0.84rem",
                textAlign: "center",
                py: 3,
              }}
            >
              {vendors.length === 0
                ? "No vendors found"
                : "No vendors match your search"}
            </Typography>
          ) : (
            <Stack spacing={0.8}>
              {filteredVendors.map((vendor) => {
                const name = getVendorName(vendor);
                const id = getVendorId(vendor);
                return (
                  <Box
                    key={id}
                    onClick={() => onSelect({ id, name, role: "vendor" })}
                    sx={{
                      p: 1.4,
                      borderRadius: "0.9rem",
                      border: "1px solid rgba(225,232,241,0.96)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.4,
                      "&:hover": { bgcolor: "#EEF4FF", borderColor: "#0E56C8" },
                      transition: "all 0.15s",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#0E56C8",
                        fontSize: "0.84rem",
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(name)}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.9rem",
                          fontWeight: 800,
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        sx={{ color: "#7A8799", fontSize: "0.72rem" }}
                      >
                        {vendor.company?.city ||
                          vendor.account?.email ||
                          "Vendor"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        ml: "auto",
                        px: 0.8,
                        py: 0.3,
                        borderRadius: "999px",
                        bgcolor: "#EEF4FF",
                        color: "#0E56C8",
                        fontSize: "0.62rem",
                        fontWeight: 800,
                      }}
                    >
                      {vendor.verificationStatus || "vendor"}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )
        ) : (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>
              Customer chat is initiated when a customer contacts support first.
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.76rem" }}>
              Their conversation will appear in Recent Chats automatically.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChatTab({ currentUserId, token }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const handleNewRoom = useCallback((room) => {
    setRooms((prev) => upsertChatRoom(prev, room));
  }, []);

  const handleRoomUpdated = useCallback((room) => {
    const nextRoom =
      room?.roomId === activeRoomId
        ? {
            ...room,
            unreadCount: {
              ...(room.unreadCount || {}),
              [currentUserId]: 0,
            },
          }
        : room;
    setRooms((prev) => upsertChatRoom(prev, nextRoom));
    if (room?.roomId === activeRoomId) {
      chatApi.markRead(room.roomId).catch(() => {});
    }
  }, [activeRoomId, currentUserId]);

  const {
    messages,
    typing,
    connected,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    seedMessages,
  } = useChatSocket(token, {
    onNewRoom: handleNewRoom,
    onRoomUpdated: handleRoomUpdated,
  });

  useEffect(() => {
    chatApi.registerAdmin().catch(() => {});
    chatApi
      .listRooms()
      .then((data) => setRooms(sortChatRooms(data.rooms || data || [])))
      .catch(() => {});
  }, []);

  async function openRoom(room) {
    if (activeRoomId === room.roomId) return;
    if (activeRoomId) leaveRoom(activeRoomId);
    setActiveRoomId(room.roomId);
    setLoadingMessages(true);
    try {
      const msgs = await chatApi.getMessages(room.roomId);
      seedMessages(
        room.roomId,
        Array.isArray(msgs) ? msgs : msgs.messages || [],
      );
      setRooms((prev) => markChatRoomRead(prev, room.roomId, currentUserId));
      chatApi.markRead(room.roomId).catch(() => {});
    } finally {
      setLoadingMessages(false);
    }
    joinRoom(room.roomId);
  }

  async function handleSelectVendor({ id, name, role }) {
    setPickerOpen(false);
    setStartingChat(true);
    try {
      const room = await chatApi.createRoom({
        targetUserId: id,
        targetRole: role,
        targetName: name,
      });
      const updated = await chatApi.listRooms();
      setRooms(sortChatRooms(updated.rooms || updated || []));
      openRoom(room.roomId ? room : { roomId: room.roomId || room.id });
    } finally {
      setStartingChat(false);
    }
  }

  function getOtherParticipant(room) {
    const otherIdx =
      room.participantIds?.findIndex((id) => id !== currentUserId) ?? 0;
    const name =
      room.participantNames?.[otherIdx] ||
      room.participantIds?.[otherIdx] ||
      "User";
    const role = room.participantRoles?.[otherIdx] || "vendor";
    const company = room.participantCompany?.[otherIdx] || null;
    return { name, role, company };
  }

  const activeRoom = rooms.find((r) => r.roomId === activeRoomId);
  const otherParticipant = activeRoom
    ? getOtherParticipant(activeRoom)
    : { name: "User", role: "vendor" };
  const roomMessages = (activeRoomId && messages[activeRoomId]) || [];
  const roomTyping = (activeRoomId && typing[activeRoomId]) || [];

  return (
    <>
      <UserPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectVendor}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" },
          height: "calc(100vh - 280px)",
          minHeight: 520,
          borderRadius: "1.3rem",
          overflow: "hidden",
          border: "1px solid rgba(225,232,241,0.96)",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            borderRight: "1px solid rgba(225,232,241,0.96)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.6,
              borderBottom: "1px solid rgba(225,232,241,0.96)",
            }}
          >
            <Stack direction="row" spacing={0.8} alignItems="center">
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1rem",
                  fontWeight: 900,
                }}
              >
                Recent Chats
              </Typography>
              {connected && (
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: "#43D66E",
                  }}
                />
              )}
            </Stack>
            <Button
              onClick={() => setPickerOpen(true)}
              disabled={startingChat}
              startIcon={
                startingChat ? (
                  <CircularProgress size={12} />
                ) : (
                  <AddRoundedIcon />
                )
              }
              sx={{
                minHeight: 32,
                px: 1.2,
                borderRadius: "999px",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              New Chat
            </Button>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {rooms.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: "center" }}>
                <ChatOutlinedIcon
                  sx={{ fontSize: "1.8rem", color: "#C8D4E4", mb: 0.8 }}
                />
                <Typography sx={{ color: "#A0ACBA", fontSize: "0.82rem" }}>
                  No chats yet
                </Typography>
                <Typography
                  sx={{ mt: 0.4, color: "#C8D4E4", fontSize: "0.72rem" }}
                >
                  Click "New Chat" to start
                </Typography>
              </Box>
            ) : null}

            {rooms.map((room) => {
              const { name, role, company } = getOtherParticipant(room);
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
                    borderLeft: isActive
                      ? "3px solid #0E56C8"
                      : "3px solid transparent",
                    "&:hover": { bgcolor: isActive ? "#EEF4FF" : "#F7F9FC" },
                    borderBottom: "1px solid rgba(225,232,241,0.5)",
                  }}
                >
                  <Stack direction="row" spacing={1.3} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: role === "vendor" ? "#0E56C8" : "#239654",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            color: adminUi.colors.text,
                            fontSize: "0.86rem",
                            fontWeight: 800,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {name}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {unread > 0 && (
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: "#0E56C8",
                                color: "#FFFFFF",
                                display: "grid",
                                placeItems: "center",
                                fontSize: "0.58rem",
                                fontWeight: 900,
                              }}
                            >
                              {unread}
                            </Box>
                          )}
                          <Typography
                            sx={{
                              color: "#A0ACBA",
                              fontSize: "0.66rem",
                              flexShrink: 0,
                            }}
                          >
                            {formatTime(room.lastMessageAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography
                        sx={{
                          color: "#7A8799",
                          fontSize: "0.74rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mt: 0.2,
                        }}
                      >
                        {room.lastMessage || "No messages yet"}
                      </Typography>
                      {company && (
                        <Typography
                          sx={{
                            mt: 0.3,
                            color: "#D97706",
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {company}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          mt: 0.4,
                          display: "inline-flex",
                          px: 0.7,
                          py: 0.15,
                          borderRadius: "999px",
                          bgcolor: role === "vendor" ? "#EEF4FF" : "#F0F5A8",
                          color: role === "vendor" ? "#0E56C8" : "#526000",
                          fontSize: "0.58rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
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
            otherUser={{
              name: otherParticipant.name,
              role: otherParticipant.role,
              online: connected,
            }}
            typingUsers={roomTyping}
            onSend={(text) => sendMessage(activeRoomId, text)}
            onTypingStart={() => startTyping(activeRoomId)}
            onTypingStop={() => stopTyping(activeRoomId)}
            loading={loadingMessages}
            accentColor="#0E56C8"
          />
        ) : (
          <Box
            sx={{ display: "grid", placeItems: "center", bgcolor: "#F7F9FC" }}
          >
            <Box sx={{ textAlign: "center" }}>
              <ChatOutlinedIcon
                sx={{ fontSize: "2.5rem", color: "#C8D4E4", mb: 1 }}
              />
              <Typography
                sx={{ color: "#A0ACBA", fontSize: "1rem", fontWeight: 700 }}
              >
                Select a conversation
              </Typography>
              <Typography
                sx={{ mt: 0.5, color: "#C8D4E4", fontSize: "0.82rem" }}
              >
                Choose a chat from the sidebar or start a new one
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminHelpDeskPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Tickets");
  const token = authStorage.getAccessToken?.() || null;
  const currentUserId = user?.id || user?._id || user?.userId || "";

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Help Desk"
        subtitle="Manage support tickets and live chat with vendors and customers."
      />

      {/* Tab bar + New Ticket button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Stack
          direction="row"
          spacing={0}
          sx={{
            border: "1px solid rgba(225,232,241,0.96)",
            borderRadius: "0.85rem",
            overflow: "hidden",
          }}
        >
          {["Tickets", "Chat"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                px: 2.4,
                py: 1,
                borderRadius: 0,
                bgcolor: activeTab === tab ? "#0E56C8" : "#FFFFFF",
                color: activeTab === tab ? "#FFFFFF" : adminUi.colors.muted,
                fontSize: "0.88rem",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  bgcolor: activeTab === tab ? "#0B49AD" : "#F4F7FB",
                },
              }}
            >
              {tab}
            </Button>
          ))}
        </Stack>
      </Stack>

      {activeTab === "Tickets" ? <TicketsTab /> : null}
      {activeTab === "Chat" ? (
        <ChatTab currentUserId={currentUserId} token={token} />
      ) : null}
    </AdminPageShell>
  );
}

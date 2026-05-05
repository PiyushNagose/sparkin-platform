import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

const STATUS_OPTIONS = [
  { value: "requested", label: "Requested" },
  { value: "under_review", label: "Under Review" },
  { value: "technician_assigned", label: "Technician Assigned" },
  { value: "resolved", label: "Resolved" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_META = {
  requested: { label: "Requested", tone: "#677487", bg: "#F2F5F8" },
  under_review: { label: "Under Review", tone: "#7C7A00", bg: "#F2F08E" },
  technician_assigned: {
    label: "Technician Assigned",
    tone: "#0E56C8",
    bg: "#E8F0FF",
  },
  resolved: { label: "Resolved", tone: "#239654", bg: "#DDF8E7" },
  cancelled: { label: "Cancelled", tone: "#B42318", bg: "#FFE9E6" },
};

const TYPE_META = {
  maintenance: {
    label: "Maintenance",
    Icon: BuildOutlinedIcon,
    tone: "#0E56C8",
    bg: "#EEF4FF",
  },
  repair: {
    label: "Repair",
    Icon: ManageSearchRoundedIcon,
    tone: "#7C7A00",
    bg: "#F4F1C9",
  },
  warranty: {
    label: "Warranty",
    Icon: SupportAgentRoundedIcon,
    tone: "#239654",
    bg: "#E4F7EA",
  },
};

const EMPTY_CREATE_FORM = {
  type: "maintenance",
  description: "",
  preferredDate: "",
  preferredTime: "",
  projectId: "",
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

function getKpis(requests) {
  return [
    {
      label: "Open Tickets",
      tone: "#4F89FF",
      bg: "#EEF4FF",
      value: requests.filter(
        (r) => !["resolved", "cancelled"].includes(r.status),
      ).length,
    },
    {
      label: "Under Review",
      tone: "#7C7A00",
      bg: "#F4F1C9",
      value: requests.filter((r) => r.status === "under_review").length,
    },
    {
      label: "Technician Assigned",
      tone: "#0E56C8",
      bg: "#E8F0FF",
      value: requests.filter((r) => r.status === "technician_assigned").length,
    },
    {
      label: "Resolved",
      tone: "#239654",
      bg: "#E4F7EA",
      value: requests.filter((r) => r.status === "resolved").length,
    },
  ];
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({ label, value, tone, bg }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        minHeight: 110,
        borderLeft: `4px solid ${tone}`,
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 36px rgba(16,29,51,0.1)",
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "0.85rem",
          bgcolor: bg,
          color: tone,
          display: "grid",
          placeItems: "center",
          mb: 1.2,
        }}
      >
        <HandymanOutlinedIcon sx={{ fontSize: "1.05rem" }} />
      </Box>
      <Typography
        sx={{
          color: "#596579",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.4,
          color: adminUi.colors.text,
          fontSize: "2rem",
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </AdminPanel>
  );
}

function ActivityLog({ activity }) {
  if (!activity?.length) return null;
  return (
    <Box
      sx={{ mt: 1.4, pt: 1.4, borderTop: "1px solid rgba(225,232,241,0.96)" }}
    >
      <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 1 }}>
        <HistoryRoundedIcon sx={{ color: "#8B97A8", fontSize: "0.9rem" }} />
        <Typography
          sx={{
            color: "#8B97A8",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Activity Log
        </Typography>
      </Stack>
      <Stack spacing={0.9}>
        {activity.slice(0, 4).map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#0E56C8",
                mt: 0.55,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </Typography>
              {item.note ? (
                <Typography
                  sx={{
                    mt: 0.15,
                    color: "#6B788A",
                    fontSize: "0.7rem",
                    lineHeight: 1.5,
                  }}
                >
                  {item.note}
                </Typography>
              ) : null}
              <Typography
                sx={{ mt: 0.15, color: "#9AAABB", fontSize: "0.64rem" }}
              >
                {formatDateTime(item.createdAt)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function ServiceCard({
  request,
  draftStatus,
  draftNote,
  isSaving,
  showActivity,
  onStatusChange,
  onNoteChange,
  onSave,
  onToggleActivity,
}) {
  const typeDef = TYPE_META[request.type] ?? TYPE_META.maintenance;
  const { Icon } = typeDef;
  const statusDef = STATUS_META[request.status] ?? STATUS_META.requested;

  return (
    <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        spacing={2.2}
      >
        {/* Left — ticket info */}
        <Stack
          direction="row"
          spacing={1.6}
          alignItems="flex-start"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "0.95rem",
              bgcolor: typeDef.bg,
              color: typeDef.tone,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: "1.15rem" }} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack
              direction="row"
              spacing={0.9}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 0.4 }}
            >
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1rem",
                  fontWeight: 900,
                }}
              >
                {typeDef.label}
              </Typography>
              <Box
                sx={{
                  px: 0.9,
                  py: 0.3,
                  borderRadius: 999,
                  bgcolor: statusDef.bg,
                  color: statusDef.tone,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {statusDef.label}
              </Box>
              <Chip
                label={typeDef.label}
                size="small"
                sx={{
                  height: 18,
                  bgcolor: typeDef.bg,
                  color: typeDef.tone,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  border: `1px solid ${typeDef.tone}30`,
                }}
              />
            </Stack>

            <Typography
              sx={{
                color: "#7D8797",
                fontSize: "0.74rem",
                fontWeight: 700,
                mb: 0.3,
              }}
            >
              #{request.ticketNumber} · Submitted{" "}
              {formatDate(request.createdAt)}
            </Typography>

            {request.project ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  sx={{
                    color: "#5F6C7E",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                  }}
                >
                  {request.project.customer?.fullName || "Customer"}
                </Typography>
                <Typography sx={{ color: "#9AAABB", fontSize: "0.7rem" }}>
                  ·
                </Typography>
                <Typography sx={{ color: "#5F6C7E", fontSize: "0.74rem" }}>
                  {request.project.installationAddress?.city || "—"},{" "}
                  {request.project.installationAddress?.state || ""}
                </Typography>
                <Typography sx={{ color: "#9AAABB", fontSize: "0.7rem" }}>
                  ·
                </Typography>
                <Typography sx={{ color: "#5F6C7E", fontSize: "0.74rem" }}>
                  {request.project.system?.sizeKw || "—"} kW
                </Typography>
              </Stack>
            ) : null}

            <Typography
              sx={{
                color: "#4F5F73",
                fontSize: "0.84rem",
                lineHeight: 1.65,
                mt: 0.4,
              }}
            >
              {request.description}
            </Typography>

            {request.preferredDate || request.preferredTime ? (
              <Typography
                sx={{ mt: 0.5, color: "#8B97A8", fontSize: "0.72rem" }}
              >
                Preferred slot:{" "}
                {request.preferredDate ? formatDate(request.preferredDate) : ""}
                {request.preferredTime ? ` · ${request.preferredTime}` : ""}
              </Typography>
            ) : null}

            <Button
              size="small"
              startIcon={
                <HistoryRoundedIcon sx={{ fontSize: "0.82rem !important" }} />
              }
              onClick={() => onToggleActivity(request.id)}
              sx={{
                mt: 0.8,
                px: 0,
                color: "#8B97A8",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
              }}
            >
              {showActivity
                ? "Hide activity"
                : `View activity (${request.activity?.length || 0})`}
            </Button>

            {showActivity ? <ActivityLog activity={request.activity} /> : null}
          </Box>
        </Stack>

        {/* Right — update controls */}
        <Stack
          spacing={0.9}
          sx={{ width: { xs: "100%", lg: 300 }, flexShrink: 0 }}
        >
          <TextField
            select
            size="small"
            label="Update Status"
            value={draftStatus}
            onChange={(e) => onStatusChange(request.id, e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Internal note"
            value={draftNote}
            onChange={(e) => onNoteChange(request.id, e.target.value)}
            placeholder="Add note visible in activity log"
            multiline
            minRows={2}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          />

          <Button
            variant="contained"
            disabled={
              isSaving || (draftStatus === request.status && !draftNote.trim())
            }
            onClick={() => onSave(request)}
            startIcon={
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
            }
            sx={{
              minHeight: 40,
              borderRadius: "0.85rem",
              bgcolor: "#0E56C8",
              textTransform: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "#0B49AD" },
            }}
          >
            {isSaving ? "Updating…" : "Update Ticket"}
          </Button>
        </Stack>
      </Stack>
    </AdminPanel>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  // data
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // per-card draft state
  const [draftStatuses, setDraftStatuses] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [savingId, setSavingId] = useState("");
  const [expandedActivity, setExpandedActivity] = useState({});
  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  // create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  // toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ── load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async (active = true) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await serviceRequestsApi.listRequests();
      if (active) {
        setRequests(result);
        setDraftStatuses(
          Object.fromEntries(result.map((r) => [r.id, r.status])),
        );
        setPage(1);
      }
    } catch (err) {
      if (active)
        setError(
          err?.response?.data?.message || "Could not load service requests.",
        );
    } finally {
      if (active) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    load(active);
    return () => {
      active = false;
    };
  }, [load]);

  // ── derived ───────────────────────────────────────────────────────────────

  const kpis = useMemo(() => getKpis(requests), [requests]);

  const filteredRequests = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return requests
      .filter((r) => {
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchType = typeFilter === "all" || r.type === typeFilter;
        const matchSearch =
          !q ||
          [
            r.ticketNumber,
            r.type,
            r.status,
            r.description,
            r.project?.customer?.fullName,
            r.project?.installationAddress?.city,
            r.project?.installationAddress?.state,
          ].some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(q),
          );
        return matchStatus && matchType && matchSearch;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / PAGE_SIZE),
  );
  const visibleRequests = filteredRequests.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const firstVisible = filteredRequests.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastVisible = filteredRequests.length
    ? firstVisible + visibleRequests.length - 1
    : 0;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  // ── handlers ──────────────────────────────────────────────────────────────

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function toggleActivity(id) {
    setExpandedActivity((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSave(request) {
    setSavingId(request.id);
    setError("");
    try {
      const updated = await serviceRequestsApi.updateStatus(request.id, {
        status: draftStatuses[request.id] ?? request.status,
        note: draftNotes[request.id]?.trim() || null,
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      setDraftStatuses((prev) => ({ ...prev, [updated.id]: updated.status }));
      setDraftNotes((prev) => ({ ...prev, [updated.id]: "" }));
      setToast({
        open: true,
        message: `Ticket #${updated.ticketNumber} updated.`,
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update ticket.",
        severity: "error",
      });
    } finally {
      setSavingId("");
    }
  }

  function closeCreate() {
    if (isCreating) return;
    setCreateOpen(false);
    setCreateError("");
    setCreateForm(EMPTY_CREATE_FORM);
  }

  async function handleCreate() {
    if (
      !createForm.description.trim() ||
      createForm.description.trim().length < 10
    ) {
      setCreateError("Description must be at least 10 characters.");
      return;
    }
    setIsCreating(true);
    setCreateError("");
    try {
      const created = await serviceRequestsApi.createRequest({
        type: createForm.type,
        description: createForm.description.trim(),
        preferredDate: createForm.preferredDate || null,
        preferredTime: createForm.preferredTime || null,
        projectId: createForm.projectId.trim() || null,
      });
      setRequests((prev) => [created, ...prev]);
      setDraftStatuses((prev) => ({ ...prev, [created.id]: created.status }));
      closeCreate();
      setToast({
        open: true,
        message: `Ticket #${created.ticketNumber} created.`,
        severity: "success",
      });
    } catch (err) {
      setCreateError(
        err?.response?.data?.message || "Could not create service request.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  if (isLoading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Service Requests"
        subtitle="Manage all customer service tickets across active Sparkin projects."
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh tickets">
              <IconButton
                onClick={() => load()}
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
            <AdminPrimaryButton
              startIcon={<AddRoundedIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{ borderRadius: "999px", minHeight: 40, px: 2 }}
            >
              New Ticket
            </AdminPrimaryButton>
          </Stack>
        }
      />

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {kpis.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </Box>

      {/* Filters */}
      <AdminPanel sx={{ p: { xs: 1.6, md: 2 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.4}
          alignItems={{ xs: "stretch", md: "center" }}
          flexWrap="wrap"
        >
          <TextField
            size="small"
            placeholder="Search ticket, customer, description…"
            value={searchTerm}
            onChange={(e) => changeFilter(setSearchTerm, e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 280 },
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
                  <TuneRoundedIcon
                    sx={{ color: "#9AAABB", fontSize: "0.95rem" }}
                  />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            value={typeFilter}
            onChange={(e) => changeFilter(setTypeFilter, e.target.value)}
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "999px",
                bgcolor: "#F6F8FB",
                fontSize: "0.8rem",
                fontWeight: 700,
              },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {Object.entries(TYPE_META).map(([v, m]) => (
              <MenuItem key={v} value={v}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography
            sx={{
              ml: { md: "auto" },
              color: "#667386",
              fontSize: "0.78rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {filteredRequests.length === 0
              ? "No tickets"
              : `Showing ${firstVisible}–${lastVisible} of ${filteredRequests.length} tickets`}
          </Typography>
        </Stack>
      </AdminPanel>

      {/* Ticket cards */}
      <Stack spacing={1.8}>
        {!filteredRequests.length ? (
          <AdminPanel sx={{ p: 4 }}>
            <AdminEmptyState
              title="No service requests found"
              subtitle={
                searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Service tickets will appear once customers submit requests from their portal."
              }
            />
          </AdminPanel>
        ) : null}

        {visibleRequests.map((request) => (
          <ServiceCard
            key={request.id}
            request={request}
            draftStatus={draftStatuses[request.id] ?? request.status}
            draftNote={draftNotes[request.id] ?? ""}
            isSaving={savingId === request.id}
            showActivity={Boolean(expandedActivity[request.id])}
            onStatusChange={(id, val) =>
              setDraftStatuses((prev) => ({ ...prev, [id]: val }))
            }
            onNoteChange={(id, val) =>
              setDraftNotes((prev) => ({ ...prev, [id]: val }))
            }
            onSave={handleSave}
            onToggleActivity={toggleActivity}
          />
        ))}

        {/* Pagination */}
        {filteredRequests.length > PAGE_SIZE ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.4}
            sx={{ pt: 0.5 }}
          >
            <Typography
              sx={{ color: "#667386", fontSize: "0.78rem", fontWeight: 700 }}
            >
              Page {page} of {totalPages}
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
        ) : null}
      </Stack>

      {/* Create Ticket Dialog */}
      <Dialog
        open={createOpen}
        onClose={closeCreate}
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
            fontSize: "1.25rem",
            fontWeight: 800,
            pb: 1,
          }}
        >
          Create Service Request
          <IconButton
            onClick={closeCreate}
            disabled={isCreating}
            size="small"
            sx={{ color: "#8B97A8" }}
          >
            <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(229,234,241,0.95)" }}>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            {createError ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {createError}
              </Alert>
            ) : null}

            <Box>
              <Typography
                sx={{
                  mb: 0.7,
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Request Type *
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={createForm.type}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, type: e.target.value }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F7F9FC",
                  },
                }}
              >
                {Object.entries(TYPE_META).map(([v, m]) => (
                  <MenuItem key={v} value={v}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 0.7,
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Description * (min 10 characters)
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                size="small"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the issue in detail…"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F7F9FC",
                  },
                }}
              />
              <Typography
                sx={{
                  mt: 0.5,
                  color:
                    createForm.description.trim().length < 10 &&
                    createForm.description.length > 0
                      ? "#E07B00"
                      : "#9AAABB",
                  fontSize: "0.68rem",
                }}
              >
                {createForm.description.trim().length} / 2000 characters
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(225,232,241,0.96)" }} />

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              <Box>
                <Typography
                  sx={{
                    mb: 0.7,
                    color: "#8B97A8",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Preferred Date
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={createForm.preferredDate}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      preferredDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.85rem",
                      bgcolor: "#F7F9FC",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    mb: 0.7,
                    color: "#8B97A8",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Preferred Time
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Morning, 10 AM"
                  value={createForm.preferredTime}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      preferredTime: e.target.value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.85rem",
                      bgcolor: "#F7F9FC",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 0.7,
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Project ID (optional)
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={createForm.projectId}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, projectId: e.target.value }))
                }
                placeholder="Link to a project ID"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F7F9FC",
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={closeCreate}
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

      {/* Toast */}
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

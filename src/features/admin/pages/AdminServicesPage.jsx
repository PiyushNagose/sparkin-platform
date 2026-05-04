import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { useEffect, useMemo, useState } from "react";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

const statusOptions = [
  { value: "requested", label: "Requested" },
  { value: "under_review", label: "Under Review" },
  { value: "technician_assigned", label: "Technician Assigned" },
  { value: "resolved", label: "Resolved" },
  { value: "cancelled", label: "Cancelled" },
];

const statusMeta = {
  requested: { label: "Requested", tone: "#677487", bg: "#F2F5F8" },
  under_review: { label: "Under Review", tone: "#7C7A00", bg: "#F2F08E" },
  technician_assigned: { label: "Technician Assigned", tone: "#0E56C8", bg: "#E8F0FF" },
  resolved: { label: "Resolved", tone: "#239654", bg: "#DDF8E7" },
  cancelled: { label: "Cancelled", tone: "#B42318", bg: "#FFE9E6" },
};

const typeMeta = {
  maintenance: { label: "Maintenance", icon: BuildOutlinedIcon },
  repair: { label: "Repair", icon: ManageSearchRoundedIcon },
  warranty: { label: "Warranty", icon: SupportAgentRoundedIcon },
};

const pageSize = 8;

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function getRequestTitle(request) {
  return typeMeta[request.type]?.label ?? "Service Request";
}

function getKpis(requests) {
  return [
    { label: "Open Tickets", tone: "#4F89FF", bg: "#EEF4FF", value: requests.filter((r) => r.status !== "resolved" && r.status !== "cancelled").length },
    { label: "Under Review", tone: "#7C7A00", bg: "#F4F1C9", value: requests.filter((r) => r.status === "under_review").length },
    { label: "Assigned", tone: "#0E56C8", bg: "#E8F0FF", value: requests.filter((r) => r.status === "technician_assigned").length },
    { label: "Resolved", tone: "#239654", bg: "#E4F7EA", value: requests.filter((r) => r.status === "resolved").length },
  ];
}

function ServiceCard({ request, draftStatus, draftNote, isSaving, onStatusChange, onNoteChange, onSave }) {
  const StatusIcon = typeMeta[request.type]?.icon ?? SupportAgentRoundedIcon;
  const status = statusMeta[request.status] ?? statusMeta.requested;

  return (
    <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: "0.9rem", bgcolor: "#EEF4FF", color: "#0E56C8", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <StatusIcon sx={{ fontSize: "1.1rem" }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900 }}>
                {getRequestTitle(request)}
              </Typography>
              <Box sx={{ px: 0.9, py: 0.32, borderRadius: 999, bgcolor: status.bg, color: status.tone, fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase" }}>
                {status.label}
              </Box>
            </Stack>
            <Typography sx={{ mt: 0.3, color: "#7D8797", fontSize: "0.74rem", fontWeight: 700 }}>
              #{request.ticketNumber} · Submitted {formatDate(request.createdAt)}
            </Typography>
            {request.project ? (
              <Typography sx={{ mt: 0.4, color: "#5F6C7E", fontSize: "0.74rem", fontWeight: 700 }}>
                {request.project.customer?.fullName || "Customer"} · {request.project.installationAddress?.city || "Location"} · {request.project.system?.sizeKw || "—"} kW
              </Typography>
            ) : null}
            <Typography sx={{ mt: 0.7, color: "#4F5F73", fontSize: "0.84rem", lineHeight: 1.6 }}>
              {request.description}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={0.9} sx={{ width: { xs: "100%", md: 290 }, flexShrink: 0 }}>
          <TextField
            select
            size="small"
            label="Status"
            value={draftStatus}
            onChange={(e) => onStatusChange(request.id, e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Update note"
            value={draftNote}
            onChange={(e) => onNoteChange(request.id, e.target.value)}
            placeholder="Add internal note"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          />
          <Button
            variant="contained"
            disabled={isSaving || (draftStatus === request.status && !draftNote.trim())}
            onClick={() => onSave(request)}
            startIcon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />}
            sx={{ minHeight: 40, borderRadius: "0.85rem", bgcolor: "#0E56C8", textTransform: "none", fontSize: "0.82rem", fontWeight: 700, boxShadow: "none" }}
          >
            {isSaving ? "Updating..." : "Update Ticket"}
          </Button>
        </Stack>
      </Stack>
    </AdminPanel>
  );
}

export default function AdminServicesPage() {
  const [requests, setRequests] = useState([]);
  const [draftStatuses, setDraftStatuses] = useState({});
  const [draftNotes, setDraftNotes] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [savingId, setSavingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const result = await serviceRequestsApi.listRequests();
        if (active) {
          setRequests(result);
          setDraftStatuses(Object.fromEntries(result.map((r) => [r.id, r.status])));
          setPage(1);
        }
      } catch (err) {
        if (active) setError(err?.response?.data?.message || "Could not load service requests.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const kpis = useMemo(() => getKpis(requests), [requests]);

  const filteredRequests = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return requests
      .filter((r) => {
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchType = typeFilter === "all" || r.type === typeFilter;
        const matchSearch = !q || [r.ticketNumber, r.type, r.status, r.description, r.project?.customer?.fullName].some((v) => String(v || "").toLowerCase().includes(q));
        return matchStatus && matchType && matchSearch;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const visibleRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);
  const firstVisible = filteredRequests.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisible = filteredRequests.length ? firstVisible + visibleRequests.length - 1 : 0;

  async function handleSave(request) {
    setSavingId(request.id);
    setError("");
    setSuccess("");
    try {
      const updated = await serviceRequestsApi.updateStatus(request.id, {
        status: draftStatuses[request.id] ?? request.status,
        note: draftNotes[request.id]?.trim() || null,
      });
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setDraftStatuses((prev) => ({ ...prev, [updated.id]: updated.status }));
      setDraftNotes((prev) => ({ ...prev, [updated.id]: "" }));
      setSuccess(`Ticket #${updated.ticketNumber} updated.`);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update ticket.");
    } finally {
      setSavingId("");
    }
  }

  if (isLoading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Service Requests"
        subtitle="Manage all customer service tickets across active Sparkin projects."
      />

      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.2, mb: 3 }}>
        {kpis.map((card) => (
          <AdminPanel key={card.label} sx={{ p: { xs: 2, md: 2.4 }, minHeight: 110, borderLeft: `4px solid ${card.tone}` }}>
            <Typography sx={{ color: "#596579", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em" }}>{card.label}</Typography>
            <Typography sx={{ mt: 0.5, color: adminUi.colors.text, fontSize: "1.9rem", fontWeight: 950, lineHeight: 1 }}>{card.value}</Typography>
          </AdminPanel>
        ))}
      </Box>

      {/* Filters */}
      <AdminPanel sx={{ p: { xs: 1.6, md: 2 }, mb: 2.5 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }} flexWrap="wrap">
          <TextField
            size="small"
            label="Search"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            sx={{ minWidth: 220, "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {statusOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
          <TextField
            select
            size="small"
            label="Type"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {Object.entries(typeMeta).map(([v, m]) => <MenuItem key={v} value={v}>{m.label}</MenuItem>)}
          </TextField>
          <Typography sx={{ ml: { md: "auto" }, color: "#667386", fontSize: "0.8rem", fontWeight: 700 }}>
            Showing {firstVisible === 0 ? "0" : `${firstVisible}–${lastVisible}`} of {filteredRequests.length} tickets
          </Typography>
        </Stack>
      </AdminPanel>

      {/* Alerts */}
      {error ? <AdminErrorState>{error}</AdminErrorState> : null}
      {success ? <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }}>{success}</Alert> : null}

      {/* Cards */}
      <Stack spacing={1.6}>
        {!filteredRequests.length ? (
          <AdminPanel sx={{ p: 3 }}>
            <AdminEmptyState icon={HandymanOutlinedIcon} title="No service requests" subtitle="Service tickets will appear once customers submit requests." />
          </AdminPanel>
        ) : null}

        {visibleRequests.map((request) => (
          <ServiceCard
            key={request.id}
            request={request}
            draftStatus={draftStatuses[request.id] ?? request.status}
            draftNote={draftNotes[request.id] ?? ""}
            isSaving={savingId === request.id}
            onStatusChange={(id, val) => setDraftStatuses((prev) => ({ ...prev, [id]: val }))}
            onNoteChange={(id, val) => setDraftNotes((prev) => ({ ...prev, [id]: val }))}
            onSave={handleSave}
          />
        ))}

        {filteredRequests.length > pageSize ? (
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            <Button variant="outlined" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ borderRadius: "0.8rem", textTransform: "none", fontWeight: 700 }}>Previous</Button>
            <Typography sx={{ color: "#556478", fontSize: "0.8rem", fontWeight: 700 }}>Page {page} of {totalPages}</Typography>
            <Button variant="outlined" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ borderRadius: "0.8rem", textTransform: "none", fontWeight: 700 }}>Next</Button>
          </Stack>
        ) : null}
      </Stack>
    </AdminPageShell>
  );
}

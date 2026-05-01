import { useEffect, useMemo, useState } from "react";
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
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { useLocation } from "react-router-dom";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";
import { VendorPageHeader, VendorPageShell } from "@/features/vendor/components/VendorPortalUI";

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
const pageSize = 6;

function formatDate(value) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getRequestTitle(request) {
  return typeMeta[request.type]?.label ?? "Service Request";
}

function getKpis(requests) {
  return [
    { label: "Open Tickets", value: requests.filter((item) => item.status !== "resolved" && item.status !== "cancelled").length },
    { label: "Under Review", value: requests.filter((item) => item.status === "under_review").length },
    { label: "Assigned", value: requests.filter((item) => item.status === "technician_assigned").length },
    { label: "Resolved", value: requests.filter((item) => item.status === "resolved").length },
  ];
}

function ServiceRequestCard({
  request,
  draftStatus,
  draftNote,
  isSaving,
  onStatusChange,
  onNoteChange,
  onSave,
}) {
  const StatusIcon = typeMeta[request.type]?.icon ?? SupportAgentRoundedIcon;
  const status = statusMeta[request.status] ?? statusMeta.requested;

  return (
    <Box
      sx={{
        p: { xs: 1.4, md: 1.55 },
        borderRadius: "1.25rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.4}>
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "0.9rem",
              bgcolor: "#EEF4FF",
              color: "#0E56C8",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <StatusIcon sx={{ fontSize: "1rem" }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                {getRequestTitle(request)}
              </Typography>
              <Box
                sx={{
                  px: 0.8,
                  py: 0.32,
                  borderRadius: 999,
                  bgcolor: status.bg,
                  color: status.tone,
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {status.label}
              </Box>
            </Stack>
            <Typography sx={{ mt: 0.25, color: "#7D8797", fontSize: "0.72rem", fontWeight: 700 }}>
              #{request.ticketNumber} | Submitted {formatDate(request.createdAt)}
            </Typography>
            {request.project ? (
              <Typography sx={{ mt: 0.35, color: "#5F6C7E", fontSize: "0.72rem", fontWeight: 700 }}>
                {request.project.customer?.fullName || "Customer"} | {request.project.installationAddress?.city || "Location"} |{" "}
                {request.project.system?.sizeKw || "-"} kW
              </Typography>
            ) : null}
            <Typography sx={{ mt: 0.65, color: "#4F5F73", fontSize: "0.8rem", lineHeight: 1.6 }}>
              {request.description}
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#7D8797", fontSize: "0.72rem" }}>
              Preferred slot: {request.preferredDate ? `${formatDate(request.preferredDate)}${request.preferredTime ? `, ${request.preferredTime}` : ""}` : "Not selected"}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={0.75} sx={{ width: { xs: "100%", md: 280 }, flexShrink: 0 }}>
          <TextField
            select
            size="small"
            label="Status"
            value={draftStatus}
            onChange={(event) => onStatusChange(request.id, event.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Update note"
            value={draftNote}
            onChange={(event) => onNoteChange(request.id, event.target.value)}
            placeholder="Add internal/customer-facing note"
          />
          <Button
            variant="contained"
            disabled={isSaving || (draftStatus === request.status && !draftNote.trim())}
            onClick={() => onSave(request)}
            startIcon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />}
            sx={{
              minHeight: 36,
              borderRadius: "0.85rem",
              bgcolor: "#0E56C8",
              textTransform: "none",
              fontSize: "0.76rem",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            {isSaving ? "Updating..." : "Update Ticket"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function VendorServiceRequestsPage() {
  const location = useLocation();
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

    async function loadRequests() {
      setIsLoading(true);
      setError("");

      try {
        const result = await serviceRequestsApi.listRequests();

        if (active) {
          setRequests(result);
          setDraftStatuses(Object.fromEntries(result.map((request) => [request.id, request.status])));
          setPage(1);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError?.response?.data?.message || "Could not load service requests.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    setSearchTerm(incomingSearch);
    setPage(1);
  }, [location.state]);

  const kpis = useMemo(() => getKpis(requests), [requests]);
  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const rows = requests.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesType = typeFilter === "all" || request.type === typeFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          request.ticketNumber,
          request.type,
          request.status,
          request.description,
          request.project?.customer?.fullName,
          request.project?.installationAddress?.city,
        ].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
      return matchesStatus && matchesType && matchesSearch;
    });

    return [...rows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [requests, searchTerm, statusFilter, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const visibleRequests = filteredRequests.slice((page - 1) * pageSize, page * pageSize);
  const firstVisibleRequest = filteredRequests.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisibleRequest = filteredRequests.length ? firstVisibleRequest + visibleRequests.length - 1 : 0;

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function handleStatusChange(requestId, status) {
    setDraftStatuses((current) => ({ ...current, [requestId]: status }));
  }

  function handleNoteChange(requestId, note) {
    setDraftNotes((current) => ({ ...current, [requestId]: note }));
  }

  async function handleSave(request) {
    setSavingId(request.id);
    setError("");
    setSuccess("");

    try {
      const updated = await serviceRequestsApi.updateStatus(request.id, {
        status: draftStatuses[request.id] ?? request.status,
        note: draftNotes[request.id]?.trim() || null,
      });

      setRequests((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setDraftStatuses((current) => ({ ...current, [updated.id]: updated.status }));
      setDraftNotes((current) => ({ ...current, [updated.id]: "" }));
      setSuccess(`Ticket #${updated.ticketNumber} updated.`);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not update this service request.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Service Requests"
        subtitle="Manage customer service tickets attached to your active Sparkin projects."
        sx={{ mb: 0 }}
      />

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
          gap: 1.2,
        }}
      >
        {kpis.map((item) => (
          <Box
            key={item.label}
            sx={{
              p: 1.25,
              borderRadius: "1rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
            }}
          >
            <Typography sx={{ color: "#7D8797", fontSize: "0.7rem", fontWeight: 700 }}>
              {item.label}
            </Typography>
            <Typography sx={{ mt: 0.35, color: "#18253A", fontSize: "1.55rem", fontWeight: 800 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{
          mt: 1.6,
          p: 1.2,
          borderRadius: "1rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            size="small"
            label="Search"
            value={searchTerm}
            onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
            sx={{ minWidth: 220 }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(event) => updateFilter(setStatusFilter, event.target.value)}
            sx={{ minWidth: 190 }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Type"
            value={typeFilter}
            onChange={(event) => updateFilter(setTypeFilter, event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {Object.entries(typeMeta).map(([value, meta]) => (
              <MenuItem key={value} value={value}>
                {meta.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Typography sx={{ color: "#7D8797", fontSize: "0.74rem", fontWeight: 700 }}>
          Showing {firstVisibleRequest === 0 ? "0" : `${firstVisibleRequest}-${lastVisibleRequest}`} of{" "}
          {filteredRequests.length} tickets
        </Typography>
      </Stack>

      <Stack spacing={1.2} sx={{ mt: 1.6 }}>
        {error ? <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>{error}</Alert> : null}
        {success ? <Alert severity="success" sx={{ borderRadius: "0.9rem" }}>{success}</Alert> : null}

        {isLoading ? (
          <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : null}

        {!isLoading && !error && filteredRequests.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
            No service requests are attached to your projects yet.
          </Alert>
        ) : null}

        {visibleRequests.map((request) => (
          <ServiceRequestCard
            key={request.id}
            request={request}
            draftStatus={draftStatuses[request.id] ?? request.status}
            draftNote={draftNotes[request.id] ?? ""}
            isSaving={savingId === request.id}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onSave={handleSave}
          />
        ))}

        {!isLoading && !error && filteredRequests.length > pageSize ? (
          <Stack direction="row" spacing={0.8} justifyContent="flex-end" alignItems="center">
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              sx={{ borderRadius: "0.8rem", textTransform: "none", fontWeight: 700 }}
            >
              Previous
            </Button>
            <Typography sx={{ color: "#556478", fontSize: "0.78rem", fontWeight: 700 }}>
              Page {page} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              sx={{ borderRadius: "0.8rem", textTransform: "none", fontWeight: 700 }}
            >
              Next
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </VendorPageShell>
  );
}

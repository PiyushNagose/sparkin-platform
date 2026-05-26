import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
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
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import { projectsApi } from "@/features/public/api/projectsApi";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;
const TABS = ["All", "Active", "In Progress", "Completed"];

const kpiDefs = [
  {
    label: "Active Projects",
    Icon: AssignmentOutlinedIcon,
    tone: "#4F89FF",
    bg: "#EEF4FF",
    filter: (p) => !["activated", "completed", "cancelled"].includes(p.status),
  },
  {
    label: "Installation in Progress",
    Icon: BuildOutlinedIcon,
    tone: "#7D7B00",
    bg: "#F4F1C9",
    filter: (p) =>
      [
        "installation_scheduled",
        "installation_in_progress",
        "inspection_pending",
      ].includes(p.status),
  },
  {
    label: "Pending Start",
    Icon: PendingActionsOutlinedIcon,
    tone: "#8F98A7",
    bg: "#F2F5F8",
    filter: (p) =>
      ["site_audit_pending", "design_approval_pending"].includes(p.status),
  },
  {
    label: "Completed",
    Icon: CheckCircleOutlineRoundedIcon,
    tone: "#239654",
    bg: "#E4F7EA",
    filter: (p) => ["activated", "completed"].includes(p.status),
  },
];

const emptyCreateForm = {
  fullName: "",
  phoneNumber: "",
  email: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  sizeKw: "",
  panelType: "monocrystalline",
  inverterType: "",
  totalPrice: "",
  equipmentCost: "",
  laborCost: "",
  permittingCost: "",
  installationWindow: "4_6_weeks",
  vendorId: "",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatLocation(address) {
  return [address?.city, address?.state].filter(Boolean).join(", ") || "—";
}

function getStatusMeta(status) {
  if (["activated", "completed"].includes(status))
    return { label: "Completed", tone: "#239654", bg: "#DDF8E7" };
  if (
    [
      "installation_scheduled",
      "installation_in_progress",
      "inspection_pending",
    ].includes(status)
  )
    return { label: "In Progress", tone: "#1FA453", bg: "#E8FAEF" };
  if (
    [
      "design_approval_pending",
      "site_audit_pending",
      "site_audit_scheduled",
    ].includes(status)
  )
    return { label: "Active", tone: "#7C7A00", bg: "#F2F08E" };
  if (status === "cancelled")
    return { label: "Cancelled", tone: "#C62828", bg: "#FDECEA" };
  return { label: "Pending", tone: "#6F7D8F", bg: "#EDF1F5" };
}

function getProgress(project) {
  if (["activated", "completed"].includes(project.status)) return 100;
  const milestones = project.milestones || [];
  if (!milestones.length) return 0;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.some((m) => m.status === "in_progress")
    ? 0.5
    : 0;
  return Math.min(
    99,
    Math.round(((completed + inProgress) / milestones.length) * 100),
  );
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PR"
  );
}

function getVendorName(project, vendors) {
  const vendorId = project.vendorId || project.assignedVendorId;
  if (!vendorId) return "Unassigned";
  const vendor = vendors.find(
    (v) => v.vendorId === vendorId || v.id === vendorId,
  );
  return vendor?.company?.name || vendor?.account?.fullName || "Vendor";
}

function getStageName(project) {
  const active = project.milestones?.find((m) => m.status === "in_progress");
  const next = project.milestones?.find((m) => m.status !== "completed");
  return active?.title || next?.title || "Project Started";
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({ card }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        minHeight: 120,
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 36px rgba(16,29,51,0.1)",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "0.9rem",
          bgcolor: card.bg,
          color: card.tone,
          display: "grid",
          placeItems: "center",
        }}
      >
        <card.Icon sx={{ fontSize: "1.2rem" }} />
      </Box>
      <Typography
        sx={{
          mt: 1.4,
          color: "#596579",
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {card.label}
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
        {card.value}
      </Typography>
    </AdminPanel>
  );
}

function FormSection({ title, children }) {
  return (
    <Box>
      <Typography
        sx={{ mb: 1.1, color: "#18253A", fontSize: "0.88rem", fontWeight: 800 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" },
          gap: 1.2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function FormField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  wide = false,
}) {
  return (
    <TextField
      label={required ? `${label} *` : label}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        gridColumn: wide ? { xs: "auto", md: "1 / -1" } : "auto",
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.85rem",
          bgcolor: "#FAFBFC",
          fontSize: "0.82rem",
        },
        "& .MuiInputLabel-root": { fontSize: "0.78rem", fontWeight: 700 },
      }}
    />
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.85rem",
          bgcolor: "#FAFBFC",
          fontSize: "0.82rem",
        },
        "& .MuiInputLabel-root": { fontSize: "0.78rem", fontWeight: 700 },
      }}
    >
      {options.map(([v, l]) => (
        <MenuItem key={v} value={v}>
          {l}
        </MenuItem>
      ))}
    </TextField>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminProjectsPage() {
  // data
  const [state, setState] = useState({ loading: true, error: "", data: null });
  // ui
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  // create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // ── load ──────────────────────────────────────────────────────────────────

  async function load(active = true) {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await getAdminDashboardData();
      if (active) setState({ loading: false, error: "", data });
    } catch (err) {
      if (active)
        setState({
          loading: false,
          error:
            err?.response?.data?.message ||
            err.message ||
            "Unable to load projects",
          data: null,
        });
    }
  }

  useEffect(() => {
    let active = true;
    load(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived data ──────────────────────────────────────────────────────────

  const projects = state.data?.projects || [];
  const vendors = state.data?.vendors || [];

  const kpis = useMemo(
    () =>
      kpiDefs.map((k) => ({ ...k, value: projects.filter(k.filter).length })),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return projects
      .filter((p) => {
        if (activeTab === "Active")
          return !["activated", "completed", "cancelled"].includes(p.status);
        if (activeTab === "In Progress")
          return [
            "installation_scheduled",
            "installation_in_progress",
            "inspection_pending",
          ].includes(p.status);
        if (activeTab === "Completed")
          return ["activated", "completed"].includes(p.status);
        return true;
      })
      .filter((p) => {
        if (statusFilter !== "all") return p.status === statusFilter;
        return true;
      })
      .filter((p) => {
        if (!q) return true;
        const vendorName = getVendorName(p, vendors).toLowerCase();
        return [
          p.id,
          p.customer?.fullName,
          p.customer?.phoneNumber,
          p.customer?.email,
          formatLocation(p.installationAddress),
          p.installationAddress?.city,
          p.installationAddress?.state,
          p.installationAddress?.pincode,
          String(p.system?.sizeKw || ""),
          vendorName,
        ].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q),
        );
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [projects, vendors, activeTab, statusFilter, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE),
  );
  const visibleProjects = filteredProjects.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  // ── handlers ──────────────────────────────────────────────────────────────

  function changeTab(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  function changeSearch(value) {
    setSearchTerm(value);
    setPage(1);
  }

  function changeStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function updateForm(field, value) {
    setCreateForm((f) => ({ ...f, [field]: value }));
  }

  function closeCreate() {
    if (isCreating) return;
    setCreateOpen(false);
    setCreateError("");
    setCreateForm(emptyCreateForm);
  }

  function validateCreate() {
    const required = [
      ["fullName", "Customer name"],
      ["phoneNumber", "Phone number"],
      ["street", "Street address"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "Pincode"],
      ["sizeKw", "System size"],
      ["inverterType", "Inverter type"],
      ["totalPrice", "Project value"],
    ];
    return required
      .filter(([f]) => !String(createForm[f] || "").trim())
      .map(([, l]) => l);
  }

  async function handleCreate() {
    const missing = validateCreate();
    if (missing.length) {
      setCreateError(`Please complete: ${missing.join(", ")}.`);
      return;
    }
    setIsCreating(true);
    setCreateError("");
    try {
      const n = (v) => (v === "" ? null : Number(v));
      await projectsApi.createManualProjectAdmin({
        customer: {
          fullName: createForm.fullName.trim(),
          phoneNumber: createForm.phoneNumber.trim(),
          email: createForm.email.trim() || null,
        },
        installationAddress: {
          street: createForm.street.trim(),
          landmark: createForm.landmark.trim() || null,
          city: createForm.city.trim(),
          state: createForm.state.trim(),
          pincode: createForm.pincode.trim(),
        },
        system: {
          sizeKw: Number(createForm.sizeKw),
          panelType: createForm.panelType,
          inverterType: createForm.inverterType.trim(),
        },
        pricing: {
          totalPrice: Number(createForm.totalPrice),
          equipmentCost: n(createForm.equipmentCost),
          laborCost: n(createForm.laborCost),
          permittingCost: n(createForm.permittingCost),
        },
        timeline: { installationWindow: createForm.installationWindow },
        vendorId: createForm.vendorId.trim() || undefined,
      });
      closeCreate();
      load();
    } catch (err) {
      setCreateError(
        err?.response?.data?.message || "Could not create project.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Projects"
        subtitle="Manage your ongoing solar installations"
        actions={
          <AdminPrimaryButton
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: "999px", minHeight: 42, px: 2.2 }}
          >
            Create New Project
          </AdminPrimaryButton>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

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
          <KpiCard key={card.label} card={card} />
        ))}
      </Box>

      {/* Table panel */}
      <AdminPanel sx={{ overflow: "hidden" }}>
        {/* Tab bar + filters */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{
            px: { xs: 1.4, md: 2 },
            pt: 1.6,
            pb: 0,
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
          spacing={1.2}
        >
          {/* Tabs */}
          <Stack direction="row" spacing={0} sx={{ mb: "-1px" }}>
            {TABS.map((tab) => (
              <Button
                key={tab}
                onClick={() => changeTab(tab)}
                sx={{
                  minHeight: 44,
                  px: 1.6,
                  borderRadius: 0,
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #0E56C8"
                      : "2px solid transparent",
                  color: activeTab === tab ? "#0E56C8" : "#6F7D8F",
                  fontSize: "0.82rem",
                  fontWeight: activeTab === tab ? 800 : 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
                }}
              >
                {tab}
              </Button>
            ))}
          </Stack>

          {/* Search + filter */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ pb: 1.2 }}
          >
            <TextField
              size="small"
              placeholder="Search customer, location, vendor…"
              value={searchTerm}
              onChange={(e) => changeSearch(e.target.value)}
              sx={{
                minWidth: { xs: "100%", md: 260 },
                "& .MuiOutlinedInput-root": {
                  height: 38,
                  borderRadius: "999px",
                  bgcolor: "#F6F8FB",
                  fontSize: "0.78rem",
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
              onChange={(e) => changeStatusFilter(e.target.value)}
              sx={{
                minWidth: 148,
                "& .MuiOutlinedInput-root": {
                  height: 38,
                  borderRadius: "999px",
                  bgcolor: "#F6F8FB",
                  fontSize: "0.78rem",
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
              <MenuItem value="site_audit_pending">Site Audit Pending</MenuItem>
              <MenuItem value="design_approval_pending">
                Design Approval
              </MenuItem>
              <MenuItem value="installation_scheduled">
                Installation Scheduled
              </MenuItem>
              <MenuItem value="installation_in_progress">
                Installation In Progress
              </MenuItem>
              <MenuItem value="inspection_pending">Inspection Pending</MenuItem>
              <MenuItem value="activated">Activated</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {[
                  "Customer",
                  "Assigned Vendor",
                  "System Size",
                  "Status",
                  "Stage Progression",
                  "Actions",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#738096",
                      fontSize: "0.64rem",
                      fontWeight: 900,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      py: 1.8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleProjects.length ? (
                visibleProjects.map((project) => {
                  const status = getStatusMeta(project.status);
                  const progress = getProgress(project);
                  const stageName = getStageName(project);
                  const vendorName = getVendorName(project, vendors);
                  const siteVisitReminderCount =
                    project.siteVisitFollowUp?.reminders?.length || 0;
                  const needsReassignment = Boolean(
                    project.siteVisitFollowUp?.reassignmentRequired,
                  );

                  return (
                    <TableRow
                      key={project.id}
                      hover
                      sx={{
                        "& td": { borderColor: "#EEF2F6", py: 2 },
                        cursor: "pointer",
                      }}
                    >
                      {/* Customer */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#EEF2F6",
                              color: "#667386",
                              fontSize: "0.72rem",
                              fontWeight: 900,
                            }}
                          >
                            {getInitials(project.customer?.fullName)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                color: adminUi.colors.text,
                                fontSize: "0.88rem",
                                fontWeight: 800,
                                lineHeight: 1.2,
                              }}
                            >
                              {project.customer?.fullName || "Customer"}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.4}
                              alignItems="center"
                              sx={{ mt: 0.25 }}
                            >
                              <LocationOnOutlinedIcon
                                sx={{ color: "#9AAABB", fontSize: "0.72rem" }}
                              />
                              <Typography
                                sx={{ color: "#8A96A8", fontSize: "0.7rem" }}
                              >
                                {formatLocation(project.installationAddress)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell
                        sx={{
                          color: "#344155",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {vendorName}
                      </TableCell>

                      {/* System size */}
                      <TableCell>
                        <Stack spacing={0.3}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              px: 0.9,
                              py: 0.35,
                              borderRadius: "999px",
                              bgcolor: "#F0F5A8",
                              color: "#526000",
                              fontSize: "0.72rem",
                              fontWeight: 900,
                              width: "fit-content",
                            }}
                          >
                            {project.system?.sizeKw || "—"} kW
                          </Box>
                          <Box
                            sx={{
                              display: "inline-flex",
                              px: 0.7,
                              py: 0.2,
                              borderRadius: "0.3rem",
                              bgcolor: "#F1F4F8",
                              color: "#6E7B8C",
                              fontSize: "0.56rem",
                              fontWeight: 800,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              width: "fit-content",
                            }}
                          >
                            {project.system?.panelType || "—"}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Stack spacing={0.55} alignItems="flex-start">
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1,
                              py: 0.4,
                              borderRadius: "999px",
                              bgcolor: status.bg,
                              color: status.tone,
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box
                              sx={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                bgcolor: status.tone,
                                flexShrink: 0,
                              }}
                            />
                            {status.label}
                          </Box>
                          {needsReassignment || siteVisitReminderCount > 0 ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                px: 0.8,
                                py: 0.28,
                                borderRadius: "999px",
                                bgcolor: needsReassignment
                                  ? "#FFF1F1"
                                  : "#FFF8E1",
                                color: needsReassignment
                                  ? "#C62828"
                                  : "#8A6500",
                                fontSize: "0.58rem",
                                fontWeight: 900,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {needsReassignment
                                ? "Reassignment Required"
                                : `${siteVisitReminderCount}/3 Site Visit Reminders`}
                            </Box>
                          ) : null}
                        </Stack>
                      </TableCell>

                      {/* Stage progression */}
                      <TableCell sx={{ minWidth: 190 }}>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "0.58rem",
                            fontWeight: 800,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            mb: 0.55,
                          }}
                        >
                          {stageName}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                        >
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              flex: 1,
                              height: 5,
                              borderRadius: "999px",
                              bgcolor: "#E7ECF2",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: "999px",
                                bgcolor: "#0F6A38",
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              color: "#223146",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              minWidth: 32,
                            }}
                          >
                            {progress}%
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.6}
                          alignItems="center"
                        >
                          <IconButton
                            component={NavLink}
                            to={`/admin/customers-projects/${project.id}`}
                            size="small"
                            sx={{
                              color: "#0E56C8",
                              bgcolor: "#EEF4FF",
                              borderRadius: "0.6rem",
                              "&:hover": { bgcolor: "#DCE9FF" },
                            }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                          <Button
                            component={NavLink}
                            to={`/admin/customers-projects/${project.id}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              minHeight: 30,
                              px: 1.1,
                              borderRadius: "0.7rem",
                              borderColor: "rgba(225,232,241,0.96)",
                              bgcolor: "#F6F8FB",
                              color: "#223146",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              textTransform: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Update
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <AdminEmptyState
                      title="No projects found"
                      subtitle={
                        searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search or filters."
                          : "Projects will appear once customers accept vendor quotes."
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{
            px: { xs: 1.4, md: 2 },
            py: 1.8,
            borderTop: "1px solid #EEF2F6",
          }}
        >
          <Typography
            sx={{ color: "#667386", fontSize: "0.78rem", fontWeight: 700 }}
          >
            Showing{" "}
            {filteredProjects.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filteredProjects.length)} of{" "}
            {filteredProjects.length} active projects
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

      {/* Create Project Dialog */}
      <Dialog
        open={createOpen}
        onClose={closeCreate}
        fullWidth
        maxWidth="md"
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
            fontSize: "1.3rem",
            fontWeight: 800,
            pb: 1,
          }}
        >
          Create New Project
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
          <Stack spacing={2.4} sx={{ pt: 0.5 }}>
            {createError ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {createError}
              </Alert>
            ) : null}

            <FormSection title="Customer Details">
              <FormField
                label="Customer Name"
                value={createForm.fullName}
                onChange={(v) => updateForm("fullName", v)}
                required
              />
              <FormField
                label="Phone Number"
                value={createForm.phoneNumber}
                onChange={(v) => updateForm("phoneNumber", v)}
                required
              />
              <FormField
                label="Email"
                value={createForm.email}
                onChange={(v) => updateForm("email", v)}
                type="email"
              />
            </FormSection>

            <FormSection title="Installation Address">
              <FormField
                label="Street Address"
                value={createForm.street}
                onChange={(v) => updateForm("street", v)}
                required
                wide
              />
              <FormField
                label="Landmark"
                value={createForm.landmark}
                onChange={(v) => updateForm("landmark", v)}
              />
              <FormField
                label="City"
                value={createForm.city}
                onChange={(v) => updateForm("city", v)}
                required
              />
              <FormField
                label="State"
                value={createForm.state}
                onChange={(v) => updateForm("state", v)}
                required
              />
              <FormField
                label="Pincode"
                value={createForm.pincode}
                onChange={(v) => updateForm("pincode", v)}
                required
              />
            </FormSection>

            <FormSection title="System & Pricing">
              <FormField
                label="System Size (kW)"
                value={createForm.sizeKw}
                onChange={(v) => updateForm("sizeKw", v)}
                type="number"
                required
              />
              <FormSelect
                label="Panel Type"
                value={createForm.panelType}
                onChange={(v) => updateForm("panelType", v)}
                options={[
                  ["monocrystalline", "Monocrystalline"],
                  ["polycrystalline", "Polycrystalline"],
                  ["bifacial", "Bifacial"],
                ]}
              />
              <FormField
                label="Inverter Type"
                value={createForm.inverterType}
                onChange={(v) => updateForm("inverterType", v)}
                required
              />
              <FormField
                label="Project Value (₹)"
                value={createForm.totalPrice}
                onChange={(v) => updateForm("totalPrice", v)}
                type="number"
                required
              />
              <FormField
                label="Equipment Cost (₹)"
                value={createForm.equipmentCost}
                onChange={(v) => updateForm("equipmentCost", v)}
                type="number"
              />
              <FormField
                label="Labor Cost (₹)"
                value={createForm.laborCost}
                onChange={(v) => updateForm("laborCost", v)}
                type="number"
              />
              <FormField
                label="Permitting Cost (₹)"
                value={createForm.permittingCost}
                onChange={(v) => updateForm("permittingCost", v)}
                type="number"
              />
              <FormSelect
                label="Installation Window"
                value={createForm.installationWindow}
                onChange={(v) => updateForm("installationWindow", v)}
                options={[
                  ["2_4_weeks", "2–4 Weeks"],
                  ["4_6_weeks", "4–6 Weeks"],
                  ["6_8_weeks", "6–8 Weeks"],
                ]}
              />
            </FormSection>

            <FormSection title="Assignment (Optional)">
              <FormField
                label="Vendor ID"
                value={createForm.vendorId}
                onChange={(v) => updateForm("vendorId", v)}
              />
            </FormSection>
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
            {isCreating ? "Creating…" : "Create Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminPageShell>
  );
}

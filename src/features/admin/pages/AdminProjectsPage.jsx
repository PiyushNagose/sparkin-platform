import {
  Avatar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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

function formatLocation(address) {
  return [address?.city, address?.state].filter(Boolean).join(", ") || "Location pending";
}

function getStatusMeta(status) {
  if (["activated", "completed"].includes(status)) return { label: "Completed", tone: "#239654", bg: "#DDF8E7" };
  if (["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(status))
    return { label: "In Progress", tone: "#1FA453", bg: "#E8FAEF" };
  if (["design_approval_pending", "site_audit_pending", "site_audit_scheduled"].includes(status))
    return { label: "Active", tone: "#7C7A00", bg: "#F2F08E" };
  return { label: "Pending", tone: "#6F7D8F", bg: "#EDF1F5" };
}

function getProgress(project) {
  if (["activated", "completed"].includes(project.status)) return 100;
  const milestones = project.milestones || [];
  if (!milestones.length) return 0;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.some((m) => m.status === "in_progress") ? 0.5 : 0;
  return Math.min(99, Math.round(((completed + inProgress) / milestones.length) * 100));
}

function getInitials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "PR";
}

function getVendorName(project, vendors) {
  const vendorId = project.vendorId || project.assignedVendorId;
  if (!vendorId) return "Unassigned";
  const vendor = vendors.find((v) => v.vendorId === vendorId || v.id === vendorId);
  return vendor?.company?.name || vendor?.account?.fullName || "Vendor";
}

const kpiDefs = [
  { label: "Active Projects", Icon: AssignmentOutlinedIcon, tone: "#4F89FF", bg: "#EEF4FF", filter: (p) => !["activated", "completed", "cancelled"].includes(p.status) },
  { label: "In Progress", Icon: BuildOutlinedIcon, tone: "#7D7B00", bg: "#F4F1C9", filter: (p) => ["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(p.status) },
  { label: "Pending Start", Icon: PendingActionsOutlinedIcon, tone: "#8F98A7", bg: "#F2F5F8", filter: (p) => ["site_audit_pending", "design_approval_pending"].includes(p.status) },
  { label: "Completed", Icon: CheckCircleOutlineRoundedIcon, tone: "#239654", bg: "#E4F7EA", filter: (p) => ["activated", "completed"].includes(p.status) },
];

const TABS = ["All", "Active", "In Progress", "Completed"];

export default function AdminProjectsPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAdminDashboardData();
        if (active) setState({ loading: false, error: "", data });
      } catch (err) {
        if (active) setState({ loading: false, error: err?.response?.data?.message || err.message || "Unable to load projects", data: null });
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const projects = state.data?.projects || [];
  const vendors = state.data?.vendors || [];

  const kpis = useMemo(() => kpiDefs.map((k) => ({ ...k, value: projects.filter(k.filter).length })), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeTab === "Active") return !["activated", "completed", "cancelled"].includes(p.status);
      if (activeTab === "In Progress") return ["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(p.status);
      if (activeTab === "Completed") return ["activated", "completed"].includes(p.status);
      return true;
    });
  }, [projects, activeTab]);

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Customers / Projects"
        subtitle="Monitor all active solar installation projects across the platform."
        actions={
          <AdminPrimaryButton startIcon={<AddRoundedIcon />} sx={{ borderRadius: "999px", minHeight: 42 }}>
            New Project
          </AdminPrimaryButton>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.2, mb: 3 }}>
        {kpis.map((card) => (
          <AdminPanel key={card.label} sx={{ p: { xs: 2, md: 2.4 }, minHeight: 120, borderLeft: `4px solid ${card.tone}`, transition: "transform 0.18s", "&:hover": { transform: "translateY(-2px)" } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ width: 38, height: 38, borderRadius: "0.85rem", bgcolor: card.bg, color: card.tone, display: "grid", placeItems: "center" }}>
                <card.Icon sx={{ fontSize: "1.15rem" }} />
              </Box>
            </Stack>
            <Typography sx={{ mt: 1.3, color: "#596579", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.04em" }}>{card.label}</Typography>
            <Typography sx={{ mt: 0.4, color: adminUi.colors.text, fontSize: "1.8rem", fontWeight: 950, lineHeight: 1 }}>{card.value}</Typography>
          </AdminPanel>
        ))}
      </Box>

      {/* Tab bar */}
      <AdminPanel sx={{ overflow: "hidden" }}>
        <Stack direction="row" sx={{ borderBottom: "1px solid rgba(225,232,241,0.96)", px: 1 }}>
          {TABS.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                minHeight: 44,
                px: 1.8,
                borderRadius: 0,
                borderBottom: activeTab === tab ? "2px solid #0E56C8" : "2px solid transparent",
                color: activeTab === tab ? "#0E56C8" : "#6F7D8F",
                fontSize: "0.82rem",
                fontWeight: activeTab === tab ? 800 : 600,
                textTransform: "none",
                mb: "-1px",
                "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
              }}
            >
              {tab}
            </Button>
          ))}
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {["Customer", "Location", "System Size", "Vendor", "Status", "Stage Progression", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ color: "#738096", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", py: 1.8 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.length ? (
                filteredProjects.map((project) => {
                  const status = getStatusMeta(project.status);
                  const progress = getProgress(project);
                  const activeMilestone = project.milestones?.find((m) => m.status === "in_progress");
                  const nextMilestone = project.milestones?.find((m) => m.status !== "completed");
                  const stageName = activeMilestone?.title || nextMilestone?.title || "Project Started";

                  return (
                    <TableRow key={project.id} hover sx={{ "& td": { borderColor: "#EEF2F6", py: 2 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.3} alignItems="center">
                          <Avatar sx={{ width: 36, height: 36, bgcolor: "#EEF2F6", color: "#667386", fontSize: "0.72rem", fontWeight: 900 }}>
                            {getInitials(project.customer?.fullName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 900 }}>
                              {project.customer?.fullName || "Customer"}
                            </Typography>
                            <Typography sx={{ color: "#8A96A8", fontSize: "0.7rem" }}>
                              {project.customer?.phoneNumber || ""}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: "#344155", fontSize: "0.82rem", fontWeight: 700 }}>
                        {formatLocation(project.installationAddress)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "999px", bgcolor: "#F0F5A8", color: "#526000", fontSize: "0.7rem", fontWeight: 900 }}>
                          {project.system?.sizeKw || "—"} kW
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#344155", fontSize: "0.82rem", fontWeight: 700 }}>
                        {getVendorName(project, vendors)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: "999px", bgcolor: status.bg, color: status.tone, fontSize: "0.68rem", fontWeight: 800 }}>
                          <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: status.tone }} />
                          {status.label}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ minWidth: 180 }}>
                        <Typography sx={{ color: "#0E56C8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>
                          {stageName}
                        </Typography>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ flex: 1, height: 5, borderRadius: "999px", bgcolor: "#E7ECF2", "& .MuiLinearProgress-bar": { borderRadius: "999px", bgcolor: "#0F6A38" } }}
                          />
                          <Typography sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 700 }}>{progress}%</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton component={NavLink} to={`/admin/customers-projects/${project.id}`} size="small"
                            sx={{ color: "#0E56C8", bgcolor: "#EEF4FF", borderRadius: "0.6rem", "&:hover": { bgcolor: "#DCE9FF" } }}>
                            <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                          <IconButton component={NavLink} to={`/admin/customers-projects/${project.id}`} size="small"
                            sx={{ color: "#10985E", bgcolor: "#E7F8EF", borderRadius: "0.6rem", "&:hover": { bgcolor: "#D0F2E3" } }}>
                            <EditOutlinedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <AdminEmptyState title="No projects found" subtitle="Projects will appear once customers accept vendor quotes." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ px: 2, py: 1.8, borderTop: "1px solid #EEF2F6" }}>
          <Typography sx={{ color: "#667386", fontSize: "0.8rem", fontWeight: 700 }}>
            Showing {filteredProjects.length} of {projects.length} projects
          </Typography>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Box sx={{ width: 32, height: 32, borderRadius: "0.6rem", border: "1px solid #E2E8F0", display: "grid", placeItems: "center", color: "#667386", cursor: "pointer" }}>‹</Box>
            <Box sx={{ width: 32, height: 32, borderRadius: "0.6rem", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: "0.8rem", fontWeight: 900 }}>1</Box>
            <Box sx={{ width: 32, height: 32, borderRadius: "0.6rem", border: "1px solid #E2E8F0", display: "grid", placeItems: "center", color: "#667386", cursor: "pointer" }}>›</Box>
          </Stack>
        </Stack>
      </AdminPanel>
    </AdminPageShell>
  );
}

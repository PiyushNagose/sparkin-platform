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
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { projectsApi } from "@/features/public/api/projectsApi";
import {
  VendorPageHeader,
  VendorPageShell,
  VendorPrimaryButton,
  VendorEmptyState,
  VendorStatusPill,
} from "@/features/vendor/components/VendorPortalUI";

const kpiCards = [
  {
    label: "Active Projects",
    value: "24",
    tone: "#4F89FF",
    bg: "#EEF4FF",
    Icon: AssignmentOutlinedIcon,
  },
  {
    label: "Installation in Progress",
    value: "8",
    tone: "#7D7B00",
    bg: "#F4F1C9",
    Icon: BuildOutlinedIcon,
  },
  {
    label: "Pending Start",
    value: "6",
    tone: "#8F98A7",
    bg: "#F2F5F8",
    Icon: PendingActionsOutlinedIcon,
  },
  {
    label: "Completed",
    value: "112",
    tone: "#239654",
    bg: "#E4F7EA",
    Icon: CheckCircleOutlineRoundedIcon,
  },
];

const tabs = ["All", "Active", "In Progress", "Completed"];

const columns = [
  "Customer",
  "System Size",
  "Status",
  "Stage Progression",
  "Actions",
];

const pageSize = 8;
const emptyManualProjectForm = {
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
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusMeta(status) {
  if (["activated", "completed"].includes(status)) {
    return { label: "Completed", tone: "#239654", bg: "#DDF8E7" };
  }

  if (["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(status)) {
    return { label: "In Progress", tone: "#1FA453", bg: "#E8FAEF" };
  }

  if (["design_approval_pending", "site_audit_pending", "site_audit_scheduled"].includes(status)) {
    return { label: "Active", tone: "#7C7A00", bg: "#F2F08E" };
  }

  return { label: "Pending", tone: "#6F7D8F", bg: "#EDF1F5" };
}

function formatLocation(address) {
  if (!address) {
    return "Location pending";
  }

  return [address.city, address.state].filter(Boolean).join(", ");
}

function getProjectProgress(project) {
  if (["activated", "completed"].includes(project.status)) {
    return 100;
  }

  const milestones = project.milestones || [];
  if (!milestones.length) {
    return 0;
  }

  const completed = milestones.filter((milestone) => milestone.status === "completed").length;
  const inProgress = milestones.some((milestone) => milestone.status === "in_progress") ? 0.5 : 0;

  return Math.min(99, Math.round(((completed + inProgress) / milestones.length) * 100));
}

function toVendorProject(project) {
  const statusMeta = getStatusMeta(project.status);
  const activeMilestone = project.milestones?.find((milestone) => milestone.status === "in_progress");
  const nextMilestone = project.milestones?.find((milestone) => milestone.status !== "completed");

  return {
    initials: getInitials(project.customer.fullName),
    id: project.id,
    rawStatus: project.status,
    createdAt: project.createdAt || project.createdFromQuoteAt,
    name: project.customer.fullName,
    location: formatLocation(project.installationAddress),
    systemSize: `${project.system.sizeKw} kW`,
    systemType: project.system.panelType,
    status: statusMeta.label,
    statusTone: statusMeta.tone,
    statusBg: statusMeta.bg,
    stage: activeMilestone?.title || nextMilestone?.title || "Project Started",
    progress: getProjectProgress(project),
  };
}

function KpiIcon({ tone, bg, Icon }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "0.85rem",
        bgcolor: bg,
        color: tone,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ fontSize: "1.15rem" }} />
    </Box>
  );
}

function ManualProjectSection({ title, children }) {
  return (
    <Box>
      <Typography sx={{ mb: 1.1, color: "#18253A", fontSize: "0.9rem", fontWeight: 800 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function ManualProjectField({ label, value, onChange, required = false, type = "text", wide = false }) {
  return (
    <TextField
      label={required ? `${label} *` : label}
      value={value}
      type={type}
      onChange={(event) => onChange(event.target.value)}
      sx={{
        gridColumn: wide ? { xs: "auto", md: "1 / -1" } : "auto",
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.85rem",
          bgcolor: "#FFFFFF",
          fontSize: "0.82rem",
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.78rem",
          fontWeight: 700,
        },
      }}
    />
  );
}

function ManualProjectSelect({ label, value, onChange, options }) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.85rem",
          bgcolor: "#FFFFFF",
          fontSize: "0.82rem",
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.78rem",
          fontWeight: 700,
        },
      }}
    >
      {options.map(([optionValue, optionLabel]) => (
        <MenuItem key={optionValue} value={optionValue}>
          {optionLabel}
        </MenuItem>
      ))}
    </TextField>
  );
}

function ProjectRow({ project, mobile = false }) {
  const customerBlock = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar
        sx={{
          width: 30,
          height: 30,
          bgcolor: "#EEF2F8",
          color: "#5D6B80",
          fontSize: "0.68rem",
          fontWeight: 800,
        }}
      >
        {project.initials}
      </Avatar>
      <Box>
        <Typography
          sx={{
            color: "#223146",
            fontSize: "0.86rem",
            fontWeight: 700,
            lineHeight: 1.16,
          }}
        >
          {project.name}
        </Typography>
        <Typography
          sx={{
            mt: 0.14,
            color: "#7A8799",
            fontSize: "0.68rem",
            lineHeight: 1.35,
          }}
        >
          {project.location}
        </Typography>
      </Box>
    </Stack>
  );

  const sizeBlock = (
    <Box>
      <Typography sx={{ color: "#223146", fontSize: "0.84rem", fontWeight: 700 }}>
        {project.systemSize}
      </Typography>
      <Box
        sx={{
          mt: 0.45,
          display: "inline-flex",
          px: 0.62,
          py: 0.16,
          borderRadius: "999px",
          bgcolor: "#F1F4F8",
          color: "#6E7B8C",
          fontSize: "0.5rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {project.systemType}
      </Box>
    </Box>
  );

  const statusBlock = (
    <VendorStatusPill tone={project.statusTone} bg={project.statusBg}>
      {project.status}
    </VendorStatusPill>
  );

  const progressBlock = (
    <Stack spacing={0.45} sx={{ minWidth: 0, width: "100%" }}>
      <Typography
        sx={{
          color: "#0E56C8",
          fontSize: "0.48rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {project.stage}
      </Typography>
      <Stack direction="row" spacing={0.8} alignItems="center">
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: "999px",
            bgcolor: "#E7ECF2",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              bgcolor: "#0F6A38",
            },
          }}
        />
        <Typography sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 700 }}>
          {project.progress}%
        </Typography>
      </Stack>
    </Stack>
  );

  const actionBlock = (
    <Stack direction="row" spacing={0.7} alignItems="center">
      <Button
        component={RouterLink}
        to={`/vendor/projects/${project.id}`}
        sx={{
          minWidth: 28,
          width: 28,
          height: 28,
          p: 0,
          borderRadius: "50%",
          color: "#0E56C8",
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: "0.92rem" }} />
      </Button>
      <Button
        component={RouterLink}
        to={`/vendor/projects/${project.id}`}
        variant="outlined"
        sx={{
          minHeight: 29,
          px: 1.05,
          borderRadius: "0.8rem",
          borderColor: "rgba(225,232,241,0.96)",
          bgcolor: "#F7F9FC",
          color: "#223146",
          fontSize: "0.66rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Update
      </Button>
    </Stack>
  );

  if (mobile) {
    return (
      <Stack spacing={1.15}>
        {customerBlock}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              System Size
            </Typography>
            <Box sx={{ mt: 0.3 }}>{sizeBlock}</Box>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Status
            </Typography>
            <Box sx={{ mt: 0.32 }}>{statusBlock}</Box>
          </Box>
        </Box>
        {progressBlock}
        {actionBlock}
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1.28fr 0.9fr 0.86fr 1.24fr 0.72fr",
        gap: 1,
        alignItems: "center",
      }}
    >
      {customerBlock}
      {sizeBlock}
      {statusBlock}
      {progressBlock}
      {actionBlock}
    </Box>
  );
}

export default function VendorProjectsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectRecords, setProjectRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [manualProjectForm, setManualProjectForm] = useState(emptyManualProjectForm);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [manualProjectError, setManualProjectError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    setSearchTerm(incomingSearch);
    setPage(1);
    if (location.state?.openCreateProject) {
      setIsCreateProjectOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const projects = useMemo(() => projectRecords.map(toVendorProject), [projectRecords]);
  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const rows = projects.filter((project) => {
      if (activeTab === "Active") return !["activated", "completed", "cancelled"].includes(project.rawStatus);
      if (activeTab === "In Progress") {
        return ["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(project.rawStatus);
      }
      if (activeTab === "Completed") return ["activated", "completed"].includes(project.rawStatus);
      return true;
    }).filter((project) => {
      if (!normalizedSearch) return true;
      return [project.id, project.name, project.location, project.systemSize, project.systemType, project.status, project.stage]
        .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
    });

    return [...rows].sort((a, b) => {
      const first = new Date(a.createdAt || 0).getTime();
      const second = new Date(b.createdAt || 0).getTime();
      return sortNewestFirst ? second - first : first - second;
    });
  }, [activeTab, projects, searchTerm, sortNewestFirst]);
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const visibleProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize);
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);
  const firstVisibleProject = filteredProjects.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisibleProject = filteredProjects.length ? firstVisibleProject + visibleProjects.length - 1 : 0;
  const dashboardKpis = useMemo(
    () => [
      {
        ...kpiCards[0],
        value: String(projectRecords.filter((project) => !["activated", "completed", "cancelled"].includes(project.status)).length),
      },
      {
        ...kpiCards[1],
        value: String(
          projectRecords.filter((project) =>
            ["installation_scheduled", "installation_in_progress", "inspection_pending"].includes(project.status),
          ).length,
        ),
      },
      {
        ...kpiCards[2],
        value: String(
          projectRecords.filter((project) =>
            ["site_audit_pending", "design_approval_pending"].includes(project.status),
          ).length,
        ),
      },
      {
        ...kpiCards[3],
        value: String(projectRecords.filter((project) => ["activated", "completed"].includes(project.status)).length),
      },
    ],
    [projectRecords],
  );

  function updateTab(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  function resetFilters() {
    setActiveTab("All");
    setSortNewestFirst(true);
    setPage(1);
  }

  async function loadProjects() {
    setIsLoading(true);
    setError("");

    try {
      const result = await projectsApi.listProjects();
      setProjectRecords(result);
      setPage(1);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateManualProject(field, value) {
    setManualProjectForm((current) => ({ ...current, [field]: value }));
  }

  function closeCreateProjectDialog() {
    if (isCreatingProject) return;
    setIsCreateProjectOpen(false);
    setManualProjectError("");
  }

  function validateManualProject() {
    const requiredFields = [
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
    const missing = requiredFields
      .filter(([field]) => !String(manualProjectForm[field] || "").trim())
      .map(([, label]) => label);

    if (manualProjectForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manualProjectForm.email.trim())) {
      missing.push("Valid email");
    }

    return missing;
  }

  function numberOrNull(value) {
    return value === "" ? null : Number(value);
  }

  function buildManualProjectPayload() {
    return {
      customer: {
        fullName: manualProjectForm.fullName.trim(),
        phoneNumber: manualProjectForm.phoneNumber.trim(),
        email: manualProjectForm.email.trim() || null,
      },
      installationAddress: {
        street: manualProjectForm.street.trim(),
        landmark: manualProjectForm.landmark.trim() || null,
        city: manualProjectForm.city.trim(),
        state: manualProjectForm.state.trim(),
        pincode: manualProjectForm.pincode.trim(),
      },
      system: {
        sizeKw: Number(manualProjectForm.sizeKw),
        panelType: manualProjectForm.panelType,
        inverterType: manualProjectForm.inverterType.trim(),
      },
      pricing: {
        totalPrice: Number(manualProjectForm.totalPrice),
        equipmentCost: numberOrNull(manualProjectForm.equipmentCost),
        laborCost: numberOrNull(manualProjectForm.laborCost),
        permittingCost: numberOrNull(manualProjectForm.permittingCost),
      },
      timeline: {
        installationWindow: manualProjectForm.installationWindow,
      },
    };
  }

  async function createManualProject() {
    const missing = validateManualProject();

    if (missing.length) {
      setManualProjectError(`Please complete: ${missing.join(", ")}.`);
      return;
    }

    setIsCreatingProject(true);
    setManualProjectError("");

    try {
      const project = await projectsApi.createManualProject(buildManualProjectPayload());
      setManualProjectForm(emptyManualProjectForm);
      setIsCreateProjectOpen(false);
      await loadProjects();
      navigate(`/vendor/projects/${project.id}`);
    } catch (apiError) {
      setManualProjectError(apiError?.response?.data?.message || "Could not create project.");
    } finally {
      setIsCreatingProject(false);
    }
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Projects"
        subtitle="Manage your ongoing solar installations"
        actions={
          <VendorPrimaryButton
          startIcon={<AddRoundedIcon />}
          onClick={() => setIsCreateProjectOpen(true)}
          disabled={isLoading || isCreatingProject}
        >
          Create New Project
          </VendorPrimaryButton>
        }
      />

      <Dialog
        open={isCreateProjectOpen}
        onClose={closeCreateProjectDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "1.35rem",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 22px 48px rgba(16,29,51,0.16)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#18253A", fontSize: "1.35rem", fontWeight: 800 }}>
          Create New Project
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(229,234,241,0.95)" }}>
          <Stack spacing={2.2} sx={{ pt: 0.5 }}>
            {manualProjectError ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {manualProjectError}
              </Alert>
            ) : null}

            <ManualProjectSection title="Customer Details">
              <ManualProjectField label="Customer Name" value={manualProjectForm.fullName} onChange={(value) => updateManualProject("fullName", value)} required />
              <ManualProjectField label="Phone Number" value={manualProjectForm.phoneNumber} onChange={(value) => updateManualProject("phoneNumber", value)} required />
              <ManualProjectField label="Email" value={manualProjectForm.email} onChange={(value) => updateManualProject("email", value)} type="email" />
            </ManualProjectSection>

            <ManualProjectSection title="Installation Address">
              <ManualProjectField label="Street Address" value={manualProjectForm.street} onChange={(value) => updateManualProject("street", value)} required wide />
              <ManualProjectField label="Landmark" value={manualProjectForm.landmark} onChange={(value) => updateManualProject("landmark", value)} />
              <ManualProjectField label="City" value={manualProjectForm.city} onChange={(value) => updateManualProject("city", value)} required />
              <ManualProjectField label="State" value={manualProjectForm.state} onChange={(value) => updateManualProject("state", value)} required />
              <ManualProjectField label="Pincode" value={manualProjectForm.pincode} onChange={(value) => updateManualProject("pincode", value)} required />
            </ManualProjectSection>

            <ManualProjectSection title="System & Pricing">
              <ManualProjectField label="System Size (kW)" value={manualProjectForm.sizeKw} onChange={(value) => updateManualProject("sizeKw", value)} type="number" required />
              <ManualProjectSelect label="Panel Type" value={manualProjectForm.panelType} onChange={(value) => updateManualProject("panelType", value)} options={[["monocrystalline", "Monocrystalline"], ["polycrystalline", "Polycrystalline"], ["bifacial", "Bifacial"]]} />
              <ManualProjectField label="Inverter Type" value={manualProjectForm.inverterType} onChange={(value) => updateManualProject("inverterType", value)} required />
              <ManualProjectField label="Project Value" value={manualProjectForm.totalPrice} onChange={(value) => updateManualProject("totalPrice", value)} type="number" required />
              <ManualProjectField label="Equipment Cost" value={manualProjectForm.equipmentCost} onChange={(value) => updateManualProject("equipmentCost", value)} type="number" />
              <ManualProjectField label="Labor Cost" value={manualProjectForm.laborCost} onChange={(value) => updateManualProject("laborCost", value)} type="number" />
              <ManualProjectField label="Permitting Cost" value={manualProjectForm.permittingCost} onChange={(value) => updateManualProject("permittingCost", value)} type="number" />
              <ManualProjectSelect label="Installation Window" value={manualProjectForm.installationWindow} onChange={(value) => updateManualProject("installationWindow", value)} options={[["2_4_weeks", "2-4 Weeks"], ["4_6_weeks", "4-6 Weeks"], ["6_8_weeks", "6-8 Weeks"]]} />
            </ManualProjectSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeCreateProjectDialog} disabled={isCreatingProject} sx={{ textTransform: "none", fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={createManualProject}
            disabled={isCreatingProject}
            sx={{ minHeight: 38, borderRadius: "999px", px: 2.3, bgcolor: "#0E56C8", textTransform: "none", fontWeight: 800 }}
          >
            {isCreatingProject ? "Creating..." : "Create Project"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.35, md: 2.7 },
        }}
      >
        {dashboardKpis.map((card) => (
          <Box
            key={card.label}
            sx={{
              p: 1.65,
              minHeight: 104,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 4px 16px rgba(16,29,51,0.06)",
              transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(16,29,51,0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <KpiIcon tone={card.tone} bg={card.bg} Icon={card.Icon} />
            <Typography
              sx={{
                mt: 1.1,
                color: "#6F7D8F",
                fontSize: "0.76rem",
                fontWeight: 500,
                lineHeight: 1.45,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                color: "#18253A",
                fontSize: "1.9rem",
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          borderRadius: "1.55rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
          overflow: "hidden",
          mb: { xs: 2.45, md: 2.75 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.7, pt: 1.5, borderBottom: "1px solid rgba(234,239,245,0.95)" }}
        >
          <Stack direction="row" spacing={0}>
            {tabs.map((tab) => (
              <Button
                key={tab}
                onClick={() => updateTab(tab)}
                sx={{
                  minHeight: 38,
                  px: 1.4,
                  borderRadius: 0,
                  borderBottom: activeTab === tab ? "2px solid #0E56C8" : "2px solid transparent",
                  color: activeTab === tab ? "#0E56C8" : "#6F7D8F",
                  fontSize: "0.76rem",
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

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Button
              onClick={resetFilters}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                p: 0,
                borderRadius: "0.6rem",
                color: "#7A8799",
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <TuneRoundedIcon sx={{ fontSize: "0.88rem" }} />
            </Button>
            <Button
              onClick={() => {
                setSortNewestFirst((currentValue) => !currentValue);
                setPage(1);
              }}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                p: 0,
                borderRadius: "0.6rem",
                color: "#7A8799",
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <SortRoundedIcon sx={{ fontSize: "0.92rem" }} />
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.7, pt: 1.3, pb: 0.6 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.28fr 0.9fr 0.86fr 1.24fr 0.72fr",
              gap: 1,
            }}
          >
            {columns.map((column) => (
              <Typography
                key={column}
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {column}
              </Typography>
            ))}
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : null}

        {!isLoading && error ? (
          <Box sx={{ px: { xs: 1.2, md: 1.7 }, py: 1.4 }}>
            <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
              {error}
            </Alert>
          </Box>
        ) : null}

        {!isLoading && !error && filteredProjects.length === 0 ? (
          <Box sx={{ px: { xs: 1.2, md: 1.7 }, py: 2.2 }}>
            <VendorEmptyState
              icon={ApartmentRoundedIcon}
              title="No assigned projects yet"
              subtitle="Create a manual project or wait for customers to accept your quotes."
              actionLabel="Create New Project"
              actionOnClick={() => setIsCreateProjectOpen(true)}
            />
          </Box>
        ) : null}

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 1.7 }, pb: 1.1 }}>
          {visibleProjects.map((project, index) => (
            <Box
              key={project.id}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.55 },
                borderRadius: "0.75rem",
                transition: "background 0.15s",
                "&:hover": { bgcolor: "#F4F7FF" },
              }}
            >
              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <ProjectRow project={project} />
              </Box>
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <ProjectRow project={project} mobile />
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.4}
          sx={{
            px: { xs: 1.2, md: 1.7 },
            py: 1.25,
            borderTop: "1px solid rgba(234,239,245,0.95)",
          }}
        >
          <Typography sx={{ color: "#738094", fontSize: "0.72rem", fontWeight: 500 }}>
            Showing {firstVisibleProject === 0 ? "0" : `${firstVisibleProject}-${lastVisibleProject}`} of{" "}
            {filteredProjects.length} active projects
          </Typography>

          <Stack direction="row" spacing={0.45} alignItems="center">
            <Button
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
            {pageNumbers.map((pageNumber, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev && pageNumber - prev > 1;
              return (
                <Box key={pageNumber} sx={{ display: "flex", alignItems: "center", gap: 0.45 }}>
                  {showEllipsis && (
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.7rem", px: 0.3 }}>…</Typography>
                  )}
                  <Button
                    onClick={() => setPage(pageNumber)}
                    sx={{
                      minWidth: 30,
                      width: 30,
                      height: 30,
                      borderRadius: "0.6rem",
                      p: 0,
                      color: pageNumber === page ? "#FFFFFF" : "#223146",
                      bgcolor: pageNumber === page ? "#0E56C8" : "#FFFFFF",
                      border: pageNumber === page ? "none" : "1px solid rgba(225,232,241,0.96)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {pageNumber}
                  </Button>
                </Box>
              );
            })}
            <Button
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              disabled={page === totalPages}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          p: { xs: 1.5, md: 1.8 },
          borderRadius: "1.45rem",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,247,255,0.95) 52%, rgba(243,249,252,0.95) 100%)",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" },
          gap: 1.8,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#0E56C8", fontSize: "1.08rem", fontWeight: 800 }}>
            Project Efficiency Insights
          </Typography>
          <Typography
            sx={{
              mt: 1,
              maxWidth: 420,
              color: "#5E6A7D",
              fontSize: "0.84rem",
              lineHeight: 1.72,
            }}
          >
            Your installation cycle has improved by{" "}
            <Box component="span" sx={{ color: "#239654", fontWeight: 800 }}>
              12%
            </Box>{" "}
            this month. Complete 4 more projects by Friday to reach your
            quarterly bonus tier.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
            minHeight: 96,
          }}
        >
          <Box sx={{ position: "relative", width: 118, height: 84 }}>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 78,
                height: 58,
                borderRadius: "0.95rem",
                background:
                  "linear-gradient(180deg, #E5F2FF 0%, #8FC3FF 48%, #1A5BB5 100%)",
                boxShadow: "0 10px 20px rgba(15,47,95,0.14)",
                border: "3px solid #FFFFFF",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 8,
                top: 2,
                width: 86,
                height: 62,
                borderRadius: "1rem",
                background:
                  "linear-gradient(180deg, #A8D7FF 0%, #5CA4E8 42%, #0E56C8 100%)",
                boxShadow: "0 14px 26px rgba(14,86,200,0.16)",
                border: "3px solid #FFFFFF",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  background:
                    "linear-gradient(140deg, transparent 0%, transparent 32%, rgba(255,255,255,0.78) 33%, transparent 35%, transparent 58%, rgba(255,255,255,0.56) 59%, transparent 61%)",
                  opacity: 0.65,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </VendorPageShell>
  );
}

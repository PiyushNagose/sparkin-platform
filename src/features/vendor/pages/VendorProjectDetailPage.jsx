import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import { projectsApi } from "@/features/public/api/projectsApi";
import LocationMapPreview from "@/shared/components/LocationMapPreview";

const statCards = [
  { label: "System Size", value: "Pending" },
  { label: "Total Price", value: "Pending", highlight: true },
  { label: "Start Date", value: "Pending" },
  { label: "Project Status", value: "Pending" },
];

const milestones = [
  { label: "Site Visit", date: "Pending", state: "upcoming" },
  { label: "Bank Loan", date: "Pending", state: "upcoming" },
  { label: "Installation", state: "upcoming" },
  { label: "Inspection", state: "upcoming" },
  { label: "Activation", state: "upcoming" },
];

const timeline = [
  {
    title: "Project activity will appear here",
    meta: "Waiting for project updates",
    tone: "#95B9F0",
    bg: "#EFF5FF",
  },
];

const technicalSpecs = [
  ["Panel Type", "Pending"],
  ["Inverter", "Pending"],
  ["Install Window", "Pending"],
  ["Total Cost", "Pending"],
];

const tabs = ["Installation Details", "Customer Info", "Documents"];

const customerInfoBlocks = [
  { title: "Primary Contact", rows: ["Pending", "Pending", "Pending"] },
  { title: "Installation Address", rows: ["Pending"] },
  { title: "Project Ownership", rows: ["Pending"] },
  { title: "Current Stage", rows: ["Pending"] },
];

const fulfillmentOrigin = (
  import.meta.env.VITE_FULFILLMENT_API_BASE_URL ||
  "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatAddress(address) {
  if (!address) {
    return ["Location pending"];
  }

  return [
    address.street,
    address.landmark,
    `${address.city}, ${address.state} ${address.pincode}`,
  ].filter(Boolean);
}

function toMilestoneNode(milestone) {
  return {
    key: milestone.key,
    label: milestone.title,
    date:
      milestone.status === "completed"
        ? formatDate(milestone.completedAt)
        : milestone.status === "in_progress"
          ? "In Progress"
          : "Pending",
    state:
      milestone.status === "completed"
        ? "completed"
        : milestone.status === "in_progress"
          ? "active"
          : "upcoming",
  };
}

function getProjectView(project) {
  if (!project) {
    return null;
  }

  return {
    title: `${project.customer.fullName} Solar Project`,
    subtitle: `${project.installationAddress.city}, ${project.installationAddress.state} - Project ID: ${project.id}`,
    statCards: [
      { label: "System Size", value: `${project.system.sizeKw} kW` },
      {
        label: "Total Price",
        value: formatPrice(project.pricing.totalPrice),
        highlight: true,
      },
      { label: "Start Date", value: formatDate(project.createdAt) },
      {
        label: "Project Status",
        value:
          project.status === "cancelled"
            ? "Cancelled"
            : project.status.replaceAll("_", " "),
      },
    ],
    milestones: project.milestones.map(toMilestoneNode),
    technicalSpecs: [
      ["Panel Type", project.system.panelType],
      ["Inverter", project.system.inverterType],
      [
        "Install Window",
        project.timeline.installationWindow.replaceAll("_", "-"),
      ],
      ["Total Cost", formatPrice(project.pricing.totalPrice)],
    ],
    customerInfoBlocks: [
      {
        title: "Primary Contact",
        rows: [
          project.customer.fullName,
          project.customer.phoneNumber,
          project.customer.email || "Email not provided",
        ],
      },
      {
        title: "Installation Address",
        rows: formatAddress(project.installationAddress),
      },
      {
        title: "Project Ownership",
        rows: [
          `Customer ID: ${project.customerId}`,
          `Quote ID: ${project.quoteId}`,
        ],
      },
      {
        title: "Current Stage",
        rows: [
          project.status === "cancelled"
            ? "Cancelled"
            : project.status.replaceAll("_", " "),
        ],
      },
    ],
    activeMilestone: project.milestones.find(
      (milestone) => milestone.status === "in_progress",
    ),
    documents: (project.documents || []).map((document) => ({
      name: document.title || document.fileName,
      meta: `Uploaded ${formatDate(document.uploadedAt)} • ${formatFileSize(document.size)}`,
      tone: document.mimeType === "application/pdf" ? "#FF6B6B" : "#4F89FF",
      bg: document.mimeType === "application/pdf" ? "#FFF1F1" : "#EEF4FF",
      icon: document.mimeType === "application/pdf" ? "pdf" : "image",
      url: document.url?.startsWith("http")
        ? document.url
        : `${fulfillmentOrigin}${document.url}`,
    })),
    timeline: [
      ...(project.siteVisitFollowUp?.reminders || []).map((reminder) => ({
        title: `Site Visit Reminder ${reminder.attempt}`,
        meta: `${formatDateTime(reminder.sentAt)} - Admin Reminder`,
        tone: reminder.attempt >= 3 ? "#D32F2F" : "#D89A00",
        bg: reminder.attempt >= 3 ? "#FFF1F1" : "#FFF8E1",
        note: reminder.message,
      })),
      ...(project.milestones || [])
        .filter((milestone) => milestone.completedAt)
        .map((milestone) => ({
          title: `${milestone.title} Completed`,
          meta: `${formatDateTime(milestone.completedAt)} • Project Update`,
          tone: "#0E56C8",
          bg: "#EAF1FF",
        })),
      {
        title: "Project Created",
        meta: `${formatDateTime(project.createdAt || project.createdFromQuoteAt)} • Portal`,
        tone: "#95B9F0",
        bg: "#EFF5FF",
      },
    ],
  };
}

function MilestoneNode({ milestone, isFirst, isLast }) {
  const completed = milestone.state === "completed";
  const active = milestone.state === "active";

  return (
    <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
      {!isFirst && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "-50%",
            width: "100%",
            height: 2,
            bgcolor: completed || active ? "#0E56C8" : "#E3E8EF",
          }}
        />
      )}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "50%",
            width: "100%",
            height: 2,
            bgcolor: completed ? "#0E56C8" : "#E3E8EF",
          }}
        />
      )}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: completed ? "#0E56C8" : active ? "#FFFFFF" : "#EEF2F7",
            border: active ? "3px solid #0E56C8" : "none",
            color: completed ? "#FFFFFF" : active ? "#0E56C8" : "#8E99A8",
            display: "grid",
            placeItems: "center",
            fontSize: "0.78rem",
            fontWeight: 800,
            boxShadow: completed ? "0 10px 18px rgba(14,86,200,0.16)" : "none",
          }}
        >
          {completed ? "✓" : active ? "•" : "◌"}
        </Box>
        <Typography
          sx={{
            mt: 1,
            color: active ? "#0E56C8" : "#223146",
            fontSize: "0.74rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {milestone.label}
        </Typography>
        {milestone.date ? (
          <Typography
            sx={{
              mt: 0.3,
              color: active ? "#0E56C8" : "#7C8797",
              fontSize: "0.62rem",
              fontWeight: active ? 800 : 500,
              textTransform: active ? "uppercase" : "none",
              letterSpacing: active ? "0.05em" : "normal",
              textAlign: "center",
            }}
          >
            {milestone.date}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function VendorProjectDetailPage() {
  const { projectId } = useParams();
  const documentInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Installation Details");
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const projectView = useMemo(() => getProjectView(project), [project]);
  const displayTitle = projectView?.title ?? "Project Details";
  const displaySubtitle = projectView?.subtitle ?? "Loading project details";
  const displayStatCards = projectView?.statCards ?? statCards;
  const displayMilestones = projectView?.milestones ?? milestones;
  const displayTechnicalSpecs = projectView?.technicalSpecs ?? technicalSpecs;
  const displayCustomerInfoBlocks =
    projectView?.customerInfoBlocks ?? customerInfoBlocks;
  const displayDocuments = projectView?.documents || [];
  const displayTimeline = projectView?.timeline?.length
    ? projectView.timeline
    : timeline;
  const siteVisitReminders = project?.siteVisitFollowUp?.reminders || [];
  const reassignmentRequired = Boolean(
    project?.siteVisitFollowUp?.reassignmentRequired,
  );
  const siteVisitCompleted = project?.milestones?.some(
    (milestone) =>
      milestone.key === "site_visit" && milestone.status === "completed",
  );
  useEffect(() => {
    let active = true;

    async function loadProject() {
      setIsLoading(true);
      setError("");

      try {
        const result = await projectsApi.getProject(projectId);
        if (active) setProject(result);
      } catch (apiError) {
        if (active)
          setError(
            apiError?.response?.data?.message || "Could not load this project.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  async function handleCompleteActiveStep() {
    if (!projectView?.activeMilestone) {
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updatedProject = await projectsApi.updateProjectMilestone(
        projectId,
        {
          milestoneKey: projectView.activeMilestone.key,
          status: "completed",
        },
      );
      setProject(updatedProject);
      setSuccess("Project status updated.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Could not update project status.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleScheduleVisit() {
    if (!project?.milestones?.length) {
      return;
    }

    const siteVisit = project.milestones.find(
      (milestone) => milestone.key === "site_visit",
    );
    if (siteVisit?.status === "completed") {
      setError("");
      setSuccess("Project status updated.");
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updatedProject = await projectsApi.updateProjectMilestone(
        projectId,
        {
          milestoneKey: "site_visit",
          status: "in_progress",
        },
      );
      setProject(updatedProject);
      setSuccess("Project status updated.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Could not update project status.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDocumentSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (
      !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Please upload a PDF, JPG, PNG, or WEBP document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Document must be smaller than 5MB.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const data = await readFileAsDataUrl(file);
      const updatedProject = await projectsApi.uploadDocument(projectId, {
        title: file.name,
        fileName: file.name,
        mimeType: file.type,
        data,
      });
      setProject(updatedProject);
      setActiveTab("Documents");
      setSuccess("Document uploaded.");
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Could not upload document.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  const renderDocumentIcon = (item) => {
    if (item.icon === "zip") {
      return <ImageOutlinedIcon sx={{ fontSize: "0.95rem" }} />;
    }

    return <DescriptionOutlinedIcon sx={{ fontSize: "0.95rem" }} />;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <input
        ref={documentInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        hidden
        onChange={handleDocumentSelected}
      />

      <Button
        component={RouterLink}
        to="/vendor/projects"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
        sx={{
          mb: 2.1,
          px: 0,
          minHeight: 28,
          color: "#556478",
          fontSize: "0.78rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Projects
      </Button>

      {isLoading ? (
        <Box sx={{ py: 4, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {success}
        </Alert>
      ) : null}

      {siteVisitReminders.length > 0 && !siteVisitCompleted ? (
        <Box
          sx={{
            mb: 2.5,
            borderRadius: "1.35rem",
            overflow: "hidden",
            boxShadow: reassignmentRequired
              ? "0 8px 32px rgba(211,47,47,0.18)"
              : "0 8px 32px rgba(216,154,0,0.16)",
            border: reassignmentRequired
              ? "1.5px solid #FFCDD2"
              : "1.5px solid #FFE082",
          }}
        >
          {/* Top gradient strip */}
          <Box
            sx={{
              height: 5,
              background: reassignmentRequired
                ? "linear-gradient(90deg, #D32F2F 0%, #FF5252 50%, #D32F2F 100%)"
                : "linear-gradient(90deg, #F57F17 0%, #FFD600 50%, #F57F17 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.4s linear infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />

          <Box
            sx={{
              p: { xs: 1.8, md: 2.2 },
              bgcolor: reassignmentRequired ? "#FFF5F5" : "#FFFDE7",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              {/* Left: icon + text */}
              <Stack direction="row" spacing={1.6} alignItems="flex-start">
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "1rem",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: reassignmentRequired ? "#FFEBEE" : "#FFF8E1",
                    border: reassignmentRequired
                      ? "1.5px solid #FFCDD2"
                      : "1.5px solid #FFE082",
                    boxShadow: reassignmentRequired
                      ? "0 4px 12px rgba(211,47,47,0.14)"
                      : "0 4px 12px rgba(255,193,7,0.18)",
                  }}
                >
                  {reassignmentRequired ? (
                    <ErrorOutlineRoundedIcon
                      sx={{ color: "#D32F2F", fontSize: "1.4rem" }}
                    />
                  ) : (
                    <NotificationsActiveRoundedIcon
                      sx={{
                        color: "#F57F17",
                        fontSize: "1.4rem",
                        animation: "bell-shake 1.8s ease-in-out infinite",
                        "@keyframes bell-shake": {
                          "0%, 100%": { transform: "rotate(0deg)" },
                          "10%": { transform: "rotate(-14deg)" },
                          "20%": { transform: "rotate(14deg)" },
                          "30%": { transform: "rotate(-10deg)" },
                          "40%": { transform: "rotate(10deg)" },
                          "50%": { transform: "rotate(0deg)" },
                        },
                      }}
                    />
                  )}
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.4 }}
                  >
                    <Typography
                      sx={{
                        color: reassignmentRequired ? "#B71C1C" : "#E65100",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      {reassignmentRequired
                        ? "Action Required — Vendor Reassignment"
                        : `Site Visit Reminder ${siteVisitReminders.length > 1 ? `(${siteVisitReminders.length}/3)` : ""}`}
                    </Typography>
                    <Box
                      sx={{
                        px: 0.75,
                        py: 0.2,
                        borderRadius: "999px",
                        bgcolor: reassignmentRequired ? "#D32F2F" : "#F57F17",
                        color: "#FFFFFF",
                        fontSize: "0.52rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        lineHeight: 1,
                      }}
                    >
                      {reassignmentRequired ? "Critical" : "Urgent"}
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      color: reassignmentRequired ? "#C62828" : "#BF6000",
                      fontSize: "0.82rem",
                      lineHeight: 1.55,
                      maxWidth: 520,
                    }}
                  >
                    {reassignmentRequired
                      ? "Final site visit reminder was missed. This project has been flagged for admin reassignment. Please contact Sparkin support immediately."
                      : `Admin has sent ${siteVisitReminders.length} of 3 site visit reminder${siteVisitReminders.length === 1 ? "" : "s"}. Complete the site visit to keep this assignment active.`}
                  </Typography>

                  {/* Reminder history pills */}
                  {siteVisitReminders.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={0.7}
                      flexWrap="wrap"
                      sx={{ mt: 1.1 }}
                    >
                      {siteVisitReminders.map((reminder) => (
                        <Stack
                          key={reminder.attempt}
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{
                            px: 0.9,
                            py: 0.35,
                            borderRadius: "999px",
                            bgcolor:
                              reminder.attempt >= 3 ? "#FFEBEE" : "#FFF3E0",
                            border:
                              reminder.attempt >= 3
                                ? "1px solid #FFCDD2"
                                : "1px solid #FFE0B2",
                          }}
                        >
                          <CalendarMonthOutlinedIcon
                            sx={{
                              fontSize: "0.7rem",
                              color:
                                reminder.attempt >= 3 ? "#D32F2F" : "#E65100",
                            }}
                          />
                          <Typography
                            sx={{
                              color:
                                reminder.attempt >= 3 ? "#D32F2F" : "#E65100",
                              fontSize: "0.62rem",
                              fontWeight: 800,
                            }}
                          >
                            Reminder {reminder.attempt}
                            {reminder.sentAt
                              ? ` · ${new Date(reminder.sentAt).toLocaleDateString("en-IN")}`
                              : ""}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Stack>

              {/* Right: CTA */}
              {!reassignmentRequired && (
                <Button
                  component={RouterLink}
                  to={`/vendor/projects/${projectId}`}
                  variant="contained"
                  sx={{
                    minHeight: 40,
                    px: 2,
                    borderRadius: "0.9rem",
                    bgcolor: "#F57F17",
                    boxShadow: "0 8px 20px rgba(245,127,23,0.28)",
                    color: "#FFFFFF",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: "#E65100",
                      boxShadow: "0 10px 24px rgba(245,127,23,0.36)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Mark Site Visit Done
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.78fr" },
          gap: 1.8,
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.9rem", md: "2.2rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            {displayTitle}
          </Typography>

          <Stack
            direction="row"
            spacing={0.7}
            alignItems="center"
            flexWrap="wrap"
            sx={{ mt: 0.65, color: "#5F6C7E" }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
              {displaySubtitle}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.25,
              mt: 2.2,
            }}
          >
            {displayStatCards.map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.45,
                  minHeight: 86,
                  borderRadius: "1rem",
                  bgcolor: "#FBFCFE",
                  border: "1px solid rgba(230,235,242,0.95)",
                }}
              >
                <Typography
                  sx={{
                    color: "#7D8797",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.05,
                    color: item.highlight ? "#0E56C8" : "#223146",
                    fontSize: item.highlight ? "1.48rem" : "1.4rem",
                    fontWeight: 800,
                    lineHeight: 1.06,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 2.3,
              p: { xs: 1.4, md: 1.7 },
              borderRadius: "1.35rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Project Milestones
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 0 }}
              sx={{ mt: 2.2 }}
            >
              {displayMilestones.map((milestone, index) => (
                <MilestoneNode
                  key={milestone.label}
                  milestone={milestone}
                  isFirst={index === 0}
                  isLast={index === displayMilestones.length - 1}
                />
              ))}
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={2.2}
            sx={{ mt: 2.2, borderBottom: "1px solid #E7ECF2" }}
          >
            {tabs.map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  pb: 1,
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #0E56C8"
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    color: activeTab === tab ? "#0E56C8" : "#556478",
                    fontSize: "0.78rem",
                    fontWeight: activeTab === tab ? 800 : 600,
                  }}
                >
                  {tab}
                </Typography>
              </Box>
            ))}
          </Stack>

          {activeTab === "Installation Details" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
                mt: 1.6,
              }}
            >
              <Box
                sx={{
                  p: 1.45,
                  borderRadius: "1rem",
                  bgcolor: "#F8FAFD",
                  border: "1px solid rgba(230,235,242,0.95)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.9}
                  alignItems="center"
                  sx={{ mb: 1.35 }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.8rem",
                      bgcolor: "#EAF1FF",
                      color: "#0E56C8",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                    }}
                  >
                    Technical Specs
                  </Typography>
                </Stack>

                <Stack spacing={1.15}>
                  {displayTechnicalSpecs.map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ color: "#223146" }}
                    >
                      <Typography
                        sx={{ color: "#657286", fontSize: "0.77rem" }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.77rem",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 1.45,
                    borderRadius: "1rem",
                    bgcolor: "#F8FAFD",
                    border: "1px solid rgba(230,235,242,0.95)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "0.8rem",
                        bgcolor: "#F1F5FF",
                        color: "#0E56C8",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <GroupOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                      }}
                    >
                      Team Assigned
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Stack direction="row" spacing={-0.6}>
                      {["A", "V", "+2"].map((label, index) => (
                        <Avatar
                          key={label}
                          sx={{
                            width: 28,
                            height: 28,
                            border: "2px solid #FFFFFF",
                            bgcolor: index === 2 ? "#EAF1FF" : "#223146",
                            color: index === 2 ? "#0E56C8" : "#FFFFFF",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                          }}
                        >
                          {label}
                        </Avatar>
                      ))}
                    </Stack>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      Sparkin Install Team B
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 1.45,
                    borderRadius: "1rem",
                    bgcolor: "#F8FAFD",
                    border: "1px solid rgba(230,235,242,0.95)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.1 }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "0.8rem",
                          bgcolor: "#F1F5FF",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <FactCheckOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      </Box>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                        }}
                      >
                        Equipment Status
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: "#667388",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                      }}
                    >
                      View Manifest
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1,
                      py: 0.38,
                      borderRadius: "999px",
                      bgcolor: "#E7F318",
                      color: "#6C7300",
                      fontSize: "0.64rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    All Delivered
                  </Box>
                </Box>
              </Stack>
            </Box>
          ) : null}

          {activeTab === "Customer Info" ? (
            <Box
              sx={{
                mt: 1.6,
                p: 1.45,
                borderRadius: "1rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(230,235,242,0.95)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.8,
                }}
              >
                {displayCustomerInfoBlocks.map((block, index) => (
                  <Box key={block.title}>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ mb: 0.95 }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "0.75rem",
                          bgcolor: "#EFF4FB",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {index < 2 ? (
                          <ContactPhoneOutlinedIcon
                            sx={{ fontSize: "0.9rem" }}
                          />
                        ) : (
                          <PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: "#7A8799",
                          fontSize: "0.58rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {block.title}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.38}>
                      {block.rows.map((row, rowIndex) => (
                        <Typography
                          key={row}
                          sx={{
                            color: rowIndex === 0 ? "#223146" : "#5F6C7E",
                            fontSize: rowIndex === 0 ? "0.86rem" : "0.76rem",
                            fontWeight: rowIndex === 0 ? 700 : 500,
                            lineHeight: 1.55,
                          }}
                        >
                          {row}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}

          {activeTab === "Documents" ? (
            <Box
              sx={{
                mt: 1.6,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.2,
              }}
            >
              {displayDocuments.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{ gridColumn: "1 / -1", borderRadius: "0.9rem" }}
                >
                  No documents have been uploaded for this project yet.
                </Alert>
              ) : null}
              {displayDocuments.map((item) => (
                <Stack
                  key={item.name}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    p: 1.15,
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(230,235,242,0.95)",
                    boxShadow: "0 10px 20px rgba(16,29,51,0.03)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "0.8rem",
                        bgcolor: item.bg,
                        color: item.tone,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {renderDocumentIcon(item)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.14,
                          color: "#7A8799",
                          fontSize: "0.62rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {item.meta}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    component={item.url ? "a" : "button"}
                    href={item.url || undefined}
                    target={item.url ? "_blank" : undefined}
                    rel={item.url ? "noreferrer" : undefined}
                    sx={{
                      minWidth: 28,
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: "50%",
                      color: "#556478",
                      flexShrink: 0,
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: "0.92rem" }} />
                  </Button>
                </Stack>
              ))}
            </Box>
          ) : null}
        </Box>

        <Stack spacing={1.6}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "1.35rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Activity Timeline
            </Typography>

            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {displayTimeline.map((item, index) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.1}
                  alignItems="flex-start"
                >
                  <Stack alignItems="center" sx={{ pt: 0.1 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: item.bg,
                        color: item.tone,
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                      }}
                    >
                      {index < 3 ? "■" : "+"}
                    </Box>
                    {index !== displayTimeline.length - 1 ? (
                      <Box
                        sx={{
                          width: 2,
                          height: 42,
                          bgcolor: "#E5EAF1",
                          mt: 0.5,
                        }}
                      />
                    ) : null}
                  </Stack>

                  <Box sx={{ pt: 0.05 }}>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.15,
                        color: "#6B788A",
                        fontSize: "0.7rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.meta}
                    </Typography>
                    {item.note ? (
                      <Box
                        sx={{
                          mt: 0.7,
                          p: 0.95,
                          borderRadius: "0.95rem",
                          bgcolor: "#F9FBFD",
                          border: "1px solid rgba(232,237,244,0.95)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#6B788A",
                            fontSize: "0.72rem",
                            lineHeight: 1.55,
                            fontStyle: "italic",
                          }}
                        >
                          "{item.note}"
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          <LocationMapPreview
            address={project?.installationAddress}
            label="Project Site Location"
            buttonLabel="Map View"
            height={186}
            sx={{ borderRadius: "1.25rem" }}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 2.1,
          p: 1.2,
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          spacing={1.2}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0.9}
            flexWrap="wrap"
          >
            <Button
              startIcon={<SettingsOutlinedIcon />}
              variant="outlined"
              onClick={handleCompleteActiveStep}
              disabled={
                isUpdating || isLoading || !projectView?.activeMilestone
              }
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Update Status
            </Button>
            <Button
              startIcon={<EventAvailableOutlinedIcon />}
              variant="outlined"
              onClick={handleScheduleVisit}
              disabled={isUpdating || isLoading || !project}
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Schedule Visit
            </Button>
            <Button
              startIcon={<UploadFileOutlinedIcon />}
              variant="outlined"
              onClick={() => documentInputRef.current?.click()}
              disabled={isUploading || isLoading || !project}
              sx={{
                minHeight: 38,
                px: 1.3,
                borderRadius: "0.9rem",
                borderColor: "rgba(225,232,241,0.96)",
                bgcolor: "#F6F8FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </Stack>

          <Button
            variant="contained"
            onClick={handleCompleteActiveStep}
            disabled={isUpdating || isLoading || !projectView?.activeMilestone}
            sx={{
              minHeight: 40,
              px: 2.2,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 14px 26px rgba(14,86,200,0.18)",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {isUpdating ? "Updating..." : "Mark Step Complete"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

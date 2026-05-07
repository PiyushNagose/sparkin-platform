import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { projectsApi } from "@/features/public/api/projectsApi";
import projectMapPlaceholder from "@/shared/assets/images/vendor/project/vendor-project-map-placeholder.png";

const fulfillmentOrigin = (
  import.meta.env.VITE_FULFILLMENT_API_BASE_URL ||
  "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const TABS = ["Installation Details", "Customer Info", "Documents"];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "Pending";
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
  if (!address) return ["Location pending"];
  return [
    address.street,
    address.landmark,
    `${address.city}, ${address.state} ${address.pincode}`,
  ].filter(Boolean);
}

function getMapUrl(address) {
  const query = formatAddress(address).join(" ");
  return query && query !== "Location pending"
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : "";
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
  if (!project) return null;
  return {
    title: `${project.customer.fullName} Solar Project`,
    subtitle: `${project.installationAddress.city}, ${project.installationAddress.state} — Project ID: ${project.id}`,
    statCards: [
      { label: "System Size", value: `${project.system.sizeKw} kW` },
      {
        label: "Total Price",
        value: formatPrice(project.pricing.totalPrice),
        highlight: true,
      },
      { label: "Start Date", value: formatDate(project.createdAt) },
      { label: "Project Status", value: project.status.replaceAll("_", " ") },
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
      { title: "Current Stage", rows: [project.status.replaceAll("_", " ")] },
    ],
    activeMilestone: project.milestones.find((m) => m.status === "in_progress"),
    documents: (project.documents || []).map((doc) => ({
      name: doc.title || doc.fileName,
      meta: `Uploaded ${formatDate(doc.uploadedAt)} · ${formatFileSize(doc.size)}`,
      tone: doc.mimeType === "application/pdf" ? "#FF6B6B" : "#4F89FF",
      bg: doc.mimeType === "application/pdf" ? "#FFF1F1" : "#EEF4FF",
      icon: doc.mimeType === "application/pdf" ? "pdf" : "image",
      url: doc.url?.startsWith("http")
        ? doc.url
        : `${fulfillmentOrigin}${doc.url}`,
    })),
    timeline: [
      ...(project.milestones || [])
        .filter((m) => m.completedAt)
        .map((m) => ({
          title: `${m.title} Completed`,
          meta: `${formatDateTime(m.completedAt)} · Project Update`,
          tone: "#0E56C8",
          bg: "#EAF1FF",
        })),
      {
        title: "Project Created",
        meta: `${formatDateTime(project.createdAt || project.createdFromQuoteAt)} · Portal`,
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
            width: 30,
            height: 30,
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
            color: active ? "#0E56C8" : adminUi.colors.text,
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

export default function AdminProjectDetailPage() {
  const { projectId } = useParams();
  const documentInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Installation Details");
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const projectView = useMemo(() => getProjectView(project), [project]);
  const displayTitle = projectView?.title ?? "Project Details";
  const displaySubtitle = projectView?.subtitle ?? "Loading project details";
  const displayStatCards = projectView?.statCards ?? [
    { label: "System Size", value: "Pending" },
    { label: "Total Price", value: "Pending", highlight: true },
    { label: "Start Date", value: "Pending" },
    { label: "Project Status", value: "Pending" },
  ];
  const displayMilestones = projectView?.milestones ?? [];
  const displayTechnicalSpecs = projectView?.technicalSpecs ?? [];
  const displayCustomerInfoBlocks = projectView?.customerInfoBlocks ?? [];
  const displayDocuments = projectView?.documents || [];
  const displayTimeline = projectView?.timeline?.length
    ? projectView.timeline
    : [
        {
          title: "Project activity will appear here",
          meta: "Waiting for project updates",
          tone: "#95B9F0",
          bg: "#EFF5FF",
        },
      ];
  const mapUrl = project ? getMapUrl(project.installationAddress) : "";

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const result = await projectsApi.getProject(projectId);
        if (active) setProject(result);
      } catch (err) {
        if (active)
          setError(
            err?.response?.data?.message || "Could not load this project.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [projectId]);

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
      const updated = await projectsApi.uploadDocument(projectId, {
        title: file.name,
        fileName: file.name,
        mimeType: file.type,
        data,
      });
      setProject(updated);
      setActiveTab("Documents");
      setSuccess("Document uploaded.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not upload document.");
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <input
        ref={documentInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        hidden
        onChange={handleDocumentSelected}
      />

      <Button
        component={RouterLink}
        to="/admin/customers-projects"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
        sx={{
          mb: 2.5,
          px: 0,
          minHeight: 28,
          color: "#0E56C8",
          fontSize: "0.82rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to Projects
      </Button>

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}
      {success ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {success}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.78fr" },
          gap: 2.2,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: { xs: "1.9rem", md: "2.2rem" },
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
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

          {/* Stat cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.4,
              mt: 2.4,
            }}
          >
            {displayStatCards.map((item) => (
              <AdminPanel key={item.label} sx={{ p: 1.6, minHeight: 90 }}>
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
                    mt: 1,
                    color: item.highlight ? "#0E56C8" : adminUi.colors.text,
                    fontSize: item.highlight ? "1.45rem" : "1.35rem",
                    fontWeight: 900,
                    lineHeight: 1.06,
                  }}
                >
                  {item.value}
                </Typography>
              </AdminPanel>
            ))}
          </Box>

          {/* Milestones */}
          <AdminPanel sx={{ mt: 2.2, p: { xs: 1.8, md: 2.2 } }}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
                mb: 2.2,
              }}
            >
              Project Milestones
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 0 }}
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
          </AdminPanel>

          {/* Tabs */}
          <Stack
            direction="row"
            spacing={2.2}
            sx={{ mt: 2.2, borderBottom: "1px solid #E7ECF2" }}
          >
            {TABS.map((tab) => (
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
                    fontSize: "0.82rem",
                    fontWeight: activeTab === tab ? 800 : 600,
                  }}
                >
                  {tab}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Installation Details tab */}
          {activeTab === "Installation Details" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
                mt: 1.8,
              }}
            >
              <AdminPanel sx={{ p: 1.8 }}>
                <Stack
                  direction="row"
                  spacing={0.9}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "0.8rem",
                      bgcolor: "#EAF1FF",
                      color: "#0E56C8",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <BoltRoundedIcon sx={{ fontSize: "1rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.95rem",
                      fontWeight: 900,
                    }}
                  >
                    Technical Specs
                  </Typography>
                </Stack>
                <Stack spacing={1.2}>
                  {displayTechnicalSpecs.map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Typography sx={{ color: "#657286", fontSize: "0.8rem" }}>
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </AdminPanel>

              <Stack spacing={1.5}>
                <AdminPanel sx={{ p: 1.8 }}>
                  <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "0.8rem",
                        bgcolor: "#F1F5FF",
                        color: "#0E56C8",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <GroupOutlinedIcon sx={{ fontSize: "1rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        color: adminUi.colors.text,
                        fontSize: "0.95rem",
                        fontWeight: 900,
                      }}
                    >
                      Team Assigned
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Stack direction="row" spacing={-0.6}>
                      {["A", "V", "+2"].map((label, i) => (
                        <Avatar
                          key={label}
                          sx={{
                            width: 28,
                            height: 28,
                            border: "2px solid #FFFFFF",
                            bgcolor: i === 2 ? "#EAF1FF" : "#223146",
                            color: i === 2 ? "#0E56C8" : "#FFFFFF",
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
                        color: adminUi.colors.text,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                      }}
                    >
                      Sparkin Install Team B
                    </Typography>
                  </Stack>
                </AdminPanel>

                <AdminPanel sx={{ p: 1.8 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1.1 }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "0.8rem",
                          bgcolor: "#F1F5FF",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <FactCheckOutlinedIcon sx={{ fontSize: "1rem" }} />
                      </Box>
                      <Typography
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.95rem",
                          fontWeight: 900,
                        }}
                      >
                        Equipment Status
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: "#667388",
                        fontSize: "0.7rem",
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
                      fontSize: "0.66rem",
                      fontWeight: 800,
                    }}
                  >
                    All Delivered
                  </Box>
                </AdminPanel>
              </Stack>
            </Box>
          ) : null}

          {/* Customer Info tab */}
          {activeTab === "Customer Info" ? (
            <AdminPanel sx={{ mt: 1.8, p: { xs: 1.8, md: 2.2 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {displayCustomerInfoBlocks.map((block, index) => (
                  <Box key={block.title}>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ mb: 1 }}
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
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {block.title}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.4}>
                      {block.rows.map((row, ri) => (
                        <Typography
                          key={row}
                          sx={{
                            color: ri === 0 ? adminUi.colors.text : "#5F6C7E",
                            fontSize: ri === 0 ? "0.88rem" : "0.78rem",
                            fontWeight: ri === 0 ? 700 : 500,
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
            </AdminPanel>
          ) : null}

          {/* Documents tab */}
          {activeTab === "Documents" ? (
            <Box
              sx={{
                mt: 1.8,
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
                  No documents uploaded for this project yet.
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
                    p: 1.3,
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
                        width: 32,
                        height: 32,
                        borderRadius: "0.8rem",
                        bgcolor: item.bg,
                        color: item.tone,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon === "pdf" ? (
                        <DescriptionOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      ) : (
                        <ImageOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{ mt: 0.14, color: "#7A8799", fontSize: "0.64rem" }}
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

        {/* Right column */}
        <Stack spacing={2}>
          {/* Activity Timeline */}
          <AdminPanel sx={{ p: { xs: 1.8, md: 2.2 } }}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
                mb: 1.8,
              }}
            >
              Activity Timeline
            </Typography>
            <Stack spacing={1.4}>
              {displayTimeline.map((item, index) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.2}
                  alignItems="flex-start"
                >
                  <Stack alignItems="center" sx={{ pt: 0.1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
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
                          height: 40,
                          bgcolor: "#E5EAF1",
                          mt: 0.5,
                        }}
                      />
                    ) : null}
                  </Stack>
                  <Box sx={{ pt: 0.05 }}>
                    <Typography
                      sx={{
                        color: adminUi.colors.text,
                        fontSize: "0.84rem",
                        fontWeight: 800,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.15,
                        color: "#6B788A",
                        fontSize: "0.72rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.meta}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </AdminPanel>

          {/* Map */}
          <AdminPanel sx={{ overflow: "hidden" }}>
            <Box
              component="img"
              src={projectMapPlaceholder}
              alt="Project site location"
              sx={{
                display: "block",
                width: "100%",
                height: 186,
                objectFit: "cover",
              }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.4, py: 1.1 }}
            >
              <Typography sx={{ color: "#6C788B", fontSize: "0.72rem" }}>
                Location Preview
              </Typography>
              <Button
                component={mapUrl ? "a" : "button"}
                href={mapUrl || undefined}
                target={mapUrl ? "_blank" : undefined}
                rel={mapUrl ? "noreferrer" : undefined}
                disabled={!mapUrl}
                size="small"
                startIcon={<PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{
                  minHeight: 30,
                  px: 1.1,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  color: "#223146",
                  fontSize: "0.66rem",
                  fontWeight: 800,
                  textTransform: "none",
                  boxShadow: "0 8px 16px rgba(16,29,51,0.08)",
                }}
              >
                Map View
              </Button>
            </Stack>
          </AdminPanel>
        </Stack>
      </Box>

      {/* Action bar — read-only for admin, vendor manages project updates */}
      <AdminPanel sx={{ mt: 2.5, p: { xs: 1.6, md: 2 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                px: 1.2,
                py: 0.5,
                borderRadius: "0.65rem",
                bgcolor: "#F0F4F8",
                border: "1px solid #DDE3EC",
              }}
            >
              <Typography
                sx={{ color: "#667386", fontSize: "0.74rem", fontWeight: 700 }}
              >
                📋 Project updates are managed by the assigned vendor
              </Typography>
            </Box>
          </Stack>
          <Button
            startIcon={<UploadFileOutlinedIcon />}
            variant="outlined"
            onClick={() => documentInputRef.current?.click()}
            disabled={isUploading || isLoading || !project}
            sx={{
              minHeight: 42,
              px: 1.6,
              borderRadius: "0.9rem",
              borderColor: "rgba(225,232,241,0.96)",
              bgcolor: "#F6F8FB",
              color: "#223146",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </Stack>
      </AdminPanel>
    </AdminPageShell>
  );
}

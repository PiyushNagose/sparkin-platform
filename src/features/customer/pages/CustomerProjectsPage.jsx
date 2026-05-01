import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { projectsApi } from "@/features/public/api/projectsApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getVendorInitials(vendorEmail) {
  const name = vendorEmail ? vendorEmail.split("@")[0] : "vendor";
  return name.slice(0, 2).toUpperCase();
}

function getVendorName(vendorEmail) {
  return vendorEmail ? vendorEmail.split("@")[0] : "Assigned Vendor";
}

// Human-readable project status badge
function getStatusConfig(status) {
  switch (status) {
    case "site_audit_pending":
      return { label: "Site Audit Pending", tone: "#8B8600", bg: "#F4F1C9" };
    case "design_approval_pending":
      return { label: "Design Approval", tone: "#4F89FF", bg: "#EEF4FF" };
    case "installation_scheduled":
      return { label: "Scheduled", tone: "#0E56C8", bg: "#EEF4FF" };
    case "installation_in_progress":
      return { label: "Installing", tone: "#6C7300", bg: "#E7F318" };
    case "inspection_pending":
      return { label: "Inspection", tone: "#C47A00", bg: "#FFF4E8" };
    case "activated":
      return { label: "Activated", tone: "#239654", bg: "#E8FAEF" };
    case "completed":
      return { label: "Completed", tone: "#239654", bg: "#E8FAEF" };
    case "cancelled":
      return { label: "Cancelled", tone: "#8F98A7", bg: "#F2F5F8" };
    default:
      return { label: "In Progress", tone: "#6C7300", bg: "#E7F318" };
  }
}

// Icon per milestone key
const MILESTONE_ICONS = {
  site_visit: CalendarMonthOutlinedIcon,
  design_approval: DesignServicesOutlinedIcon,
  installation: HandymanOutlinedIcon,
  inspection: SearchOutlinedIcon,
  activation: BoltOutlinedIcon,
};

function toMilestoneStep(milestone) {
  const done = milestone.status === "completed";
  const active = milestone.status === "in_progress";
  return {
    key: milestone.key,
    label: milestone.title,
    meta: done
      ? formatDate(milestone.completedAt)
      : active
        ? "In Progress"
        : "Pending",
    state: done ? "completed" : active ? "active" : "upcoming",
    Icon: MILESTONE_ICONS[milestone.key] || BoltOutlinedIcon,
  };
}

function toProjectCard(project) {
  const statusConfig = getStatusConfig(project.status);
  const isActive =
    project.status !== "completed" && project.status !== "cancelled";

  return {
    id: project.id,
    status: project.status,
    ...statusConfig,
    isActive,
    title: `${project.installationAddress.city}, ${project.installationAddress.state}`,
    subtitle: `${project.system.sizeKw}kW ${project.system.panelType} Solar System`,
    vendorInitials: getVendorInitials(project.vendorEmail),
    vendorName: getVendorName(project.vendorEmail),
    steps: project.milestones.map(toMilestoneStep),
    trackTo: `/project/installation?projectId=${project.id}`,
    serviceTo: `/service-support/request?projectId=${project.id}`,
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function MilestoneStep({ step, isFirst, isLast }) {
  const done = step.state === "completed";
  const active = step.state === "active";
  const { Icon } = step;

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
            bgcolor: done || active ? "#0E56C8" : "#D9E0EA",
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
            bgcolor: done ? "#0E56C8" : "#D9E0EA",
          }}
        />
      )}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: done || active ? "#0E56C8" : "#EEF2F7",
            color: done || active ? "#FFFFFF" : "#8E99A8",
            border: active ? "3px solid #0E56C8" : "none",
            boxShadow: done ? "0 8px 16px rgba(14,86,200,0.18)" : "none",
            display: "grid",
            placeItems: "center",
          }}
        >
          {done ? (
            <CheckRoundedIcon sx={{ fontSize: "0.82rem" }} />
          ) : (
            <Icon sx={{ fontSize: "0.82rem" }} />
          )}
        </Box>
        <Typography
          sx={{
            mt: 0.9,
            color: active ? "#0E56C8" : "#223146",
            fontSize: "0.72rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.28,
          }}
        >
          {step.label}
        </Typography>
        <Typography
          sx={{
            mt: 0.18,
            color: active ? "#0E56C8" : "#8C97A7",
            fontSize: "0.56rem",
            fontWeight: active ? 800 : 500,
            textAlign: "center",
            textTransform: active ? "uppercase" : "none",
          }}
        >
          {step.meta}
        </Typography>
      </Stack>
    </Box>
  );
}

function ProjectCard({ item }) {
  return (
    <Box
      sx={{
        p: { xs: 1.35, md: 1.6 },
        borderRadius: "1.35rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        opacity: item.status === "cancelled" ? 0.65 : 1,
        transition: "box-shadow 0.18s",
        "&:hover": { boxShadow: "0 18px 36px rgba(16,29,51,0.08)" },
      }}
    >
      <Stack
        direction={{ xs: "column", xl: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", xl: "center" }}
      >
        {/* Left — identity */}
        <Stack spacing={1.4} sx={{ minWidth: 0, flex: 1 }}>
          <Box>
            <Stack
              direction="row"
              spacing={0.55}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.78,
                  py: 0.32,
                  borderRadius: "999px",
                  bgcolor: item.bg,
                  color: item.tone,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Box>
              <Typography
                sx={{ color: "#6F7D8F", fontSize: "0.72rem", fontWeight: 600 }}
              >
                #{item.id.slice(-6).toUpperCase()}
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 0.8,
                color: "#223146",
                fontSize: { xs: "1.45rem", md: "1.65rem" },
                fontWeight: 800,
                lineHeight: 1.08,
              }}
            >
              {item.title}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 0.5, color: "#6F7D8F" }}
            >
              <HomeWorkOutlinedIcon sx={{ fontSize: "0.82rem" }} />
              <Typography sx={{ fontSize: "0.84rem", lineHeight: 1.55 }}>
                {item.subtitle}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Assigned Vendor
            </Typography>
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              sx={{ mt: 0.7 }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "0.72rem",
                  bgcolor: "#E8EEFF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {item.vendorInitials}
              </Box>
              <Typography
                sx={{ color: "#223146", fontSize: "0.95rem", fontWeight: 700 }}
              >
                {item.vendorName}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Centre — milestone stepper */}
        <Box sx={{ flex: 1.1, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 0 }}
            sx={{ pr: { xl: 1.5 } }}
          >
            {item.steps.map((step, index) => (
              <MilestoneStep
                key={step.key}
                step={step}
                isFirst={index === 0}
                isLast={index === item.steps.length - 1}
              />
            ))}
          </Stack>
        </Box>

        {/* Right — actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "stretch", xl: "flex-end" },
          }}
        >
          <Stack spacing={0.7} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button
              component={RouterLink}
              to={item.trackTo}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
              sx={{
                minHeight: 38,
                px: 1.5,
                width: { xs: "100%", sm: "auto" },
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Track Project
            </Button>
            <Button
              component={RouterLink}
              to={item.serviceTo}
              variant="outlined"
              startIcon={
                <SupportAgentRoundedIcon sx={{ fontSize: "0.92rem" }} />
              }
              sx={{
                minHeight: 36,
                px: 1.5,
                width: { xs: "100%", sm: "auto" },
                borderRadius: "0.95rem",
                bgcolor: "#FFFFFF",
                color: "#0E56C8",
                borderColor: "#CFE0F8",
                boxShadow: "none",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Request Service
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function PromoCard({
  title,
  description,
  buttonLabel,
  to,
  tone = "blue",
  icon,
}) {
  const isGreen = tone === "green";
  return (
    <Box
      sx={{
        p: 1.55,
        borderRadius: "1.25rem",
        bgcolor: isGreen ? "#087A2D" : "#0E56C8",
        color: "#FFFFFF",
        boxShadow: isGreen
          ? "0 16px 28px rgba(8,122,45,0.18)"
          : "0 16px 28px rgba(14,86,200,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -8,
          bottom: -18,
          opacity: 0.12,
          transform: "scale(1.25)",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: "1.05rem",
          fontWeight: 800,
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.55,
          maxWidth: 300,
          color: "rgba(255,255,255,0.82)",
          fontSize: "0.78rem",
          lineHeight: 1.65,
          position: "relative",
          zIndex: 1,
        }}
      >
        {description}
      </Typography>
      <Button
        component={RouterLink}
        to={to}
        sx={{
          mt: 1.35,
          minHeight: 34,
          px: 1.35,
          borderRadius: "0.85rem",
          bgcolor: isGreen ? "rgba(255,255,255,0.15)" : "#FFFFFF",
          color: isGreen ? "#FFFFFF" : "#0E56C8",
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            bgcolor: isGreen ? "rgba(255,255,255,0.22)" : "#F0F5FF",
          },
          position: "relative",
          zIndex: 1,
        }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerProjectsPage() {
  const [projectRecords, setProjectRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setIsLoading(true);
      setError("");

      try {
        const result = await projectsApi.listProjects();
        if (!active) return;
        setProjectRecords(result);
      } catch (apiError) {
        if (active) {
          setError(
            apiError?.response?.data?.message || "Could not load projects.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  const projectCards = useMemo(
    () => projectRecords.map(toProjectCard),
    [projectRecords],
  );

  const activeCount = projectRecords.filter(
    (p) => p.status !== "completed" && p.status !== "cancelled",
  ).length;

  const completedCount = projectRecords.filter(
    (p) => p.status === "completed",
  ).length;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.05rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            My Projects
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Track your solar installation progress and manage milestones.
          </Typography>
        </Box>

        {/* Summary pills */}
        {!isLoading && !error && projectRecords.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Box
              sx={{
                px: 1.1,
                py: 0.55,
                borderRadius: "0.85rem",
                bgcolor: "#E7F318",
                color: "#6C7300",
                fontSize: "0.72rem",
                fontWeight: 800,
              }}
            >
              {activeCount} Active
            </Box>
            <Box
              sx={{
                px: 1.1,
                py: 0.55,
                borderRadius: "0.85rem",
                bgcolor: "#E8FAEF",
                color: "#239654",
                fontSize: "0.72rem",
                fontWeight: 800,
              }}
            >
              {completedCount} Completed
            </Box>
          </Stack>
        )}
      </Stack>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ mt: 2, py: 5, display: "grid", placeItems: "center" }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Alert severity="error" sx={{ mt: 1.85, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!isLoading && !error && projectCards.length === 0 && (
        <Box
          sx={{
            mt: 1.85,
            py: 5,
            px: 2,
            borderRadius: "1.2rem",
            bgcolor: "#F8FAFD",
            border: "1px solid rgba(225,232,241,0.9)",
            textAlign: "center",
          }}
        >
          <ApartmentRoundedIcon
            sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }}
          />
          <Typography
            sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
          >
            No projects yet
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: "#6F7D8F",
              fontSize: "0.84rem",
              lineHeight: 1.65,
              maxWidth: 360,
              mx: "auto",
            }}
          >
            Projects are created automatically when you accept a vendor quote
            from your tenders.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/customer/tenders"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{
              mt: 1.8,
              minHeight: 38,
              px: 1.65,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            View My Tenders
          </Button>
        </Box>
      )}

      {/* Project cards */}
      {!isLoading && !error && projectCards.length > 0 && (
        <Stack spacing={1.6} sx={{ mt: 1.85 }}>
          {projectCards.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </Stack>
      )}

      {/* Bottom promo cards */}
      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 1.45,
        }}
      >
        <PromoCard
          title="Refer a friend, earn ₹5,000"
          description="Earn credits on your installation by sharing Sparkin Solar with your network."
          buttonLabel="Get Referral Code"
          to="/customer/referrals"
          icon={<RedeemRoundedIcon sx={{ fontSize: "5rem" }} />}
        />
        <PromoCard
          title="Need Help?"
          description="Connect with your project manager for any technical queries or delays."
          buttonLabel="Contact Support"
          to="/service-support"
          tone="green"
          icon={<SupportAgentRoundedIcon sx={{ fontSize: "5rem" }} />}
        />
      </Box>
    </Box>
  );
}

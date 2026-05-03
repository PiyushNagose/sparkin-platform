import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import customerServicesGuidePlaceholder from "@/shared/assets/images/customer/services/customer-services-guide-placeholder.png";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// Every status the DB can return
function getStatusConfig(status) {
  switch (status) {
    case "technician_assigned":
      return { label: "In Progress", bg: "#E7F318", tone: "#6C7300" };
    case "under_review":
      return { label: "Under Review", bg: "#EEF4FF", tone: "#4F89FF" };
    case "resolved":
      return { label: "Resolved", bg: "#E8FAEF", tone: "#239654" };
    case "cancelled":
      return { label: "Cancelled", bg: "#F2F5F8", tone: "#8F98A7" };
    default:
      // requested
      return { label: "Requested", bg: "#F2F5F8", tone: "#677487" };
  }
}

// Progress label shown inside the card's status row
function getProgressLabel(status) {
  const map = {
    requested: "Awaiting review",
    under_review: "Support team reviewing",
    technician_assigned: "Technician assigned",
    resolved: "Issue resolved",
    cancelled: "Request cancelled",
  };
  return map[status] || status.replaceAll("_", " ");
}

// Icon + colour per request type
function getTypeStyle(type) {
  switch (type) {
    case "maintenance":
      return {
        Icon: HandymanOutlinedIcon,
        iconBg: "#EEF4FF",
        iconTone: "#0E56C8",
        title: "Maintenance",
      };
    case "repair":
      return {
        Icon: BuildOutlinedIcon,
        iconBg: "#FFF4E8",
        iconTone: "#C47A00",
        title: "Repair",
      };
    case "warranty":
      return {
        Icon: ShieldOutlinedIcon,
        iconBg: "#E8FAEF",
        iconTone: "#239654",
        title: "Warranty",
      };
    default:
      return {
        Icon: SupportAgentRoundedIcon,
        iconBg: "#F4F1C9",
        iconTone: "#8B8600",
        title: type
          .replaceAll("_", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
  }
}

// Progress icon per status
function getProgressIcon(status) {
  if (status === "resolved")
    return <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />;
  if (status === "technician_assigned")
    return <ManageSearchRoundedIcon sx={{ fontSize: "0.95rem" }} />;
  return <ScheduleOutlinedIcon sx={{ fontSize: "0.95rem" }} />;
}

function isActiveRequest(status) {
  return status !== "resolved" && status !== "cancelled";
}

function toServiceCard(request) {
  const statusConfig = getStatusConfig(request.status);
  const typeStyle = getTypeStyle(request.type);

  return {
    id: request.id,
    Icon: typeStyle.Icon,
    iconBg: typeStyle.iconBg,
    iconTone: typeStyle.iconTone,
    title: typeStyle.title,
    ticket: `#${request.ticketNumber}`,
    description: request.description,
    status: request.status,
    statusLabel: statusConfig.label,
    statusBg: statusConfig.bg,
    statusTone: statusConfig.tone,
    progressIcon: getProgressIcon(request.status),
    progressLabel: getProgressLabel(request.status),
    date: formatDate(request.createdAt),
    to: `/service-support/track?requestId=${request.id}`,
    isActive: isActiveRequest(request.status),
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function TabBar({ activeTab, onTabChange, activeCount, historyCount }) {
  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "history", label: "History", count: historyCount },
  ];

  return (
    <Stack
      direction="row"
      spacing={0.45}
      sx={{
        p: 0.45,
        borderRadius: "1rem",
        bgcolor: "#F4F7FB",
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.key;
        return (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            sx={{
              minHeight: 34,
              px: 1.6,
              borderRadius: "0.85rem",
              bgcolor: selected ? "#FFFFFF" : "transparent",
              color: selected ? "#0E56C8" : "#4E5D70",
              boxShadow: selected ? "0 8px 18px rgba(16,29,51,0.06)" : "none",
              fontSize: "0.78rem",
              fontWeight: selected ? 700 : 500,
              textTransform: "none",
              "&:hover": { bgcolor: selected ? "#FFFFFF" : "transparent" },
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 0.55,
                  px: 0.55,
                  py: 0.1,
                  borderRadius: "999px",
                  bgcolor: selected ? "#EEF4FF" : "#E8EDF5",
                  color: selected ? "#0E56C8" : "#647387",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  lineHeight: 1.6,
                }}
              >
                {tab.count}
              </Box>
            )}
          </Button>
        );
      })}
    </Stack>
  );
}

function ServiceCard({ item }) {
  const { Icon } = item;

  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.3rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        opacity: item.isActive ? 1 : 0.72,
        transition: "box-shadow 0.18s",
        "&:hover": { boxShadow: "0 18px 36px rgba(16,29,51,0.08)" },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "0.92rem",
            bgcolor: item.iconBg,
            color: item.iconTone,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: "1rem" }} />
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            px: 0.82,
            py: 0.34,
            borderRadius: "999px",
            bgcolor: item.statusBg,
            color: item.statusTone,
            fontSize: "0.56rem",
            fontWeight: 800,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {item.statusLabel}
        </Box>
      </Stack>

      <Typography
        sx={{ mt: 1.1, color: "#B0B8C5", fontSize: "0.72rem", fontWeight: 500 }}
      >
        Ticket {item.ticket}
      </Typography>

      <Typography
        sx={{
          mt: 0.35,
          color: "#223146",
          fontSize: "1rem",
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {item.title}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,
          color: "#647387",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          minHeight: 56,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.description}
      </Typography>

      <Box
        sx={{ mt: 1.15, p: 0.92, borderRadius: "0.95rem", bgcolor: "#F3F6FB" }}
      >
        <Stack direction="row" spacing={0.6} alignItems="center">
          <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>
            {item.progressIcon}
          </Box>
          <Typography
            sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 500 }}
          >
            {item.progressLabel}
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.2 }}
      >
        <Typography
          sx={{ color: "#B0B8C5", fontSize: "0.68rem", fontWeight: 500 }}
        >
          {item.date}
        </Typography>
        <Button
          component={RouterLink}
          to={item.to}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          sx={{
            minHeight: 28,
            px: 0,
            color: "#0E56C8",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          Track Service
        </Button>
      </Stack>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerServicesPage() {
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  async function loadData(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [requestResult, projectResult] = await Promise.all([
        serviceRequestsApi.listRequests(),
        projectsApi.listProjects(),
      ]);

      if (!active) return;
      setRequests(requestResult);
      setProjects(projectResult);
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load service requests.");
      }
    } finally {
      if (active) setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadData(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived state ──────────────────────────────────────────────────────────

  const allCards = useMemo(() => requests.map(toServiceCard), [requests]);
  const activeCards = useMemo(
    () => allCards.filter((c) => c.isActive),
    [allCards],
  );
  const historyCards = useMemo(
    () => allCards.filter((c) => !c.isActive),
    [allCards],
  );
  const visibleCards = activeTab === "active" ? activeCards : historyCards;

  // CO₂ offset derived from installed project capacity
  const totalKw = projects.reduce(
    (sum, p) => sum + (Number(p.system?.sizeKw) || 0),
    0,
  );
  const co2Tons = parseFloat((totalKw * 0.5).toFixed(1));
  // Progress toward a 10-ton annual goal
  const co2Progress = Math.min(100, Math.round((co2Tons / 10) * 100));

  // ── render ─────────────────────────────────────────────────────────────────

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
            My Services
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#4F5F73",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              maxWidth: 430,
            }}
          >
            Track your service requests and history in real-time.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeCount={activeCards.length}
            historyCount={historyCards.length}
          />
          <Button
            variant="contained"
            component={RouterLink}
            to="/service-support/request"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{
              minHeight: 38,
              px: 1.55,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            New Request
          </Button>
        </Stack>
      </Stack>

      {/* Loading */}
      {isLoading && <CustomerLoadingBlock />}

      {/* Error */}
      {!isLoading && error && <CustomerErrorBlock message={error} onRetry={() => loadData(true)} mt={2} />}

      {/* Cards grid */}
      {!isLoading && !error && (
        <>
          {visibleCards.length === 0 ? (
            <Box
              sx={{
                mt: 2,
                py: 5,
                px: 2,
                borderRadius: "1.2rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(225,232,241,0.9)",
                textAlign: "center",
              }}
            >
              <HandymanOutlinedIcon
                sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }}
              />
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                {activeTab === "active"
                  ? "No active service requests"
                  : "No service history yet"}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#6F7D8F",
                  fontSize: "0.84rem",
                  lineHeight: 1.65,
                  maxWidth: 340,
                  mx: "auto",
                }}
              >
                {activeTab === "active"
                  ? "Raise a request when you need maintenance, repair, or warranty support."
                  : "Resolved and cancelled requests will appear here."}
              </Typography>
              {activeTab === "active" && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/service-support/request"
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
                  Request Service
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  xl: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {visibleCards.map((item) => (
                <ServiceCard key={item.id} item={item} />
              ))}
            </Box>
          )}

          {/* Bottom info cards */}
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.95fr 0.95fr" },
              gap: 1.5,
            }}
          >
            {/* Performance guide */}
            <Box
              sx={{
                p: 1.55,
                borderRadius: "1.35rem",
                color: "#FFFFFF",
                background:
                  "linear-gradient(135deg, rgba(34,76,151,0.96) 0%, rgba(27,57,114,0.94) 100%)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.08)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={customerServicesGuidePlaceholder}
                alt="Performance guide"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.78,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(25,54,109,0.42) 0%, rgba(18,38,78,0.22) 100%)",
                }}
              />
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Maximize Your Savings
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  maxWidth: 340,
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.8rem",
                  lineHeight: 1.68,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Learn how regular maintenance can increase your energy output by
                up to 25%.
              </Typography>
              <Button
                component={RouterLink}
                to="/resources"
                sx={{
                  mt: 1.45,
                  minHeight: 34,
                  px: 1.35,
                  borderRadius: "0.85rem",
                  bgcolor: "#FFFFFF",
                  color: "#0E56C8",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#F0F5FF" },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Read Performance Guide
              </Button>
            </Box>

            {/* Carbon offset — driven by real project data */}
            <Box
              sx={{
                p: 1.55,
                borderRadius: "1.35rem",
                bgcolor: "#E7F318",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <LocalFloristOutlinedIcon
                sx={{ color: "#6C7300", fontSize: "1.45rem" }}
              />
              <Typography
                sx={{
                  mt: 1.05,
                  color: "#4F5600",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                }}
              >
                Carbon Offset
              </Typography>
              <Typography
                sx={{
                  mt: 0.55,
                  color: "#677100",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  maxWidth: 220,
                }}
              >
                {totalKw > 0
                  ? `Your ${totalKw}kW system has offset an estimated ${co2Tons} metric tons of CO₂.`
                  : "Your CO₂ offset will appear once your installation project is active."}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  height: 6,
                  borderRadius: "999px",
                  bgcolor: "rgba(108,115,0,0.14)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${co2Progress}%`,
                    height: "100%",
                    borderRadius: "999px",
                    bgcolor: "#6C7300",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
              {totalKw > 0 && (
                <Typography
                  sx={{
                    mt: 0.6,
                    color: "#6C7300",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                  }}
                >
                  {co2Progress}% toward 10t annual goal
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

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
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";
import customerSolarTipPlaceholder from "@/shared/assets/images/customer/dashboard/customer-solar-tip-placeholder.png";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

// ─── helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(user) {
  return user?.fullName?.split(" ")?.[0]?.trim() || "there";
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatCompact(value) {
  const n = Number(value) || 0;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return formatPrice(n);
}

// Derive savings model from installed system capacity
function getSavingsModel(projects) {
  const totalKw = projects.reduce(
    (sum, p) => sum + (Number(p.system?.sizeKw) || 0),
    0,
  );
  const monthly = Math.round(totalKw * 1500);
  const annual = monthly * 12;
  const lifetime = annual * 25;
  const co2Tons = parseFloat((totalKw * 0.5).toFixed(1));
  return { totalKw, monthly, annual, lifetime, co2Tons };
}

// Map a project milestone to the stepper shape
function toStepperMilestone(milestone) {
  const done = milestone.status === "completed";
  const active = milestone.status === "in_progress";
  return {
    label: milestone.title,
    meta: done ? "Completed" : active ? "In Progress" : "Pending",
    state: done ? "completed" : active ? "active" : "upcoming",
  };
}

// Fallback milestones when no real project exists
const PLACEHOLDER_MILESTONES = [
  { label: "Site Visit", meta: "Pending", state: "upcoming" },
  { label: "Installation", meta: "Pending", state: "upcoming" },
  { label: "Inspection", meta: "Pending", state: "upcoming" },
  { label: "Activation", meta: "Pending", state: "upcoming" },
];

// Status label for the most recent service request
function getServiceStatusLabel(status) {
  const map = {
    requested: "Requested",
    under_review: "Under Review",
    technician_assigned: "Technician Assigned",
    resolved: "Resolved",
    cancelled: "Cancelled",
  };
  return map[status] || status?.replaceAll("_", " ") || "Active";
}

// ─── sub-components ─────────────────────────────────────────────────────────

function MilestoneStep({ item, isFirst, isLast }) {
  const done = item.state === "completed";
  const active = item.state === "active";

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
            bgcolor: done || active ? "#0E56C8" : "#E2E8F0",
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
            bgcolor: done ? "#0E56C8" : "#E2E8F0",
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
            fontSize: "0.76rem",
            fontWeight: 800,
            transition: "all 0.2s",
          }}
        >
          {done ? "✓" : active ? "⚡" : "◌"}
        </Box>
        <Typography
          sx={{
            mt: 0.9,
            color: active ? "#0E56C8" : "#223146",
            fontSize: "0.72rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          sx={{
            mt: 0.2,
            color: active ? "#0E56C8" : "#7C8797",
            fontSize: "0.6rem",
            fontWeight: active ? 800 : 500,
            textAlign: "center",
          }}
        >
          {item.meta}
        </Typography>
      </Stack>
    </Box>
  );
}

function StatPill({ icon, label, value, tone, bg }) {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: "1rem",
        bgcolor: "rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 0.4,
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box
          sx={{
            color: tone || "rgba(255,255,255,0.7)",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.58rem",
            fontWeight: 800,
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [leadResult, quoteResult, projectResult, serviceResult] =
        await Promise.all([
          leadsApi.listLeads(),
          quotesApi.listQuotes(),
          projectsApi.listProjects(),
          serviceRequestsApi.listRequests(),
        ]);

      if (!active) return;
      setLeads(leadResult);
      setQuotes(quoteResult);
      setProjects(projectResult);
      setServiceRequests(serviceResult);
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load dashboard.");
      }
    } finally {
      if (active) setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadDashboard(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived state ──────────────────────────────────────────────────────────

  const activeLead =
    leads.find((l) => l.status === "open_for_quotes") ?? leads[0] ?? null;

  const activeProject = projects[0] ?? null;

  const leadQuotes = useMemo(
    () =>
      activeLead
        ? quotes.filter((q) => String(q.leadId) === String(activeLead.id))
        : [],
    [activeLead, quotes],
  );

  const bestQuote = leadQuotes.length
    ? Math.min(...leadQuotes.map((q) => Number(q.pricing?.totalPrice) || 0))
    : null;

  const savings = useMemo(() => getSavingsModel(projects), [projects]);

  const milestones = useMemo(
    () =>
      activeProject?.milestones?.length
        ? activeProject.milestones.map(toStepperMilestone)
        : PLACEHOLDER_MILESTONES,
    [activeProject],
  );

  // Most recent non-resolved service request
  const activeServiceRequest = useMemo(
    () =>
      serviceRequests.find(
        (r) => r.status !== "resolved" && r.status !== "cancelled",
      ) ??
      serviceRequests[0] ??
      null,
    [serviceRequests],
  );

  const projectLocation = activeProject
    ? `${activeProject.installationAddress.city}, ${activeProject.installationAddress.state}`
    : null;

  const greeting = getGreeting();
  const firstName = getFirstName(user);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      {/* Page header */}
      <Box>
        <Typography
          sx={{
            color: "#18253A",
            fontSize: { xs: "1.9rem", md: "2.05rem" },
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
          }}
        >
          {greeting}, {firstName}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: "#6F7D8F",
            fontSize: "0.92rem",
            lineHeight: 1.6,
          }}
        >
          {projects.length > 0
            ? "Your solar project is connected to live progress tracking."
            : "Your booking and quote activity will appear here as vendors respond."}
        </Typography>
      </Box>

      {/* Loading */}
      {isLoading && <CustomerLoadingBlock py={4} />}

      {/* Error */}
      {!isLoading && error && <CustomerErrorBlock message={error} onRetry={() => loadDashboard(true)} mt={1.5} />}

      {/* Content — only render once data is ready */}
      {!isLoading && !error && (
        <>
          {/* Referral banner */}
          <Box
            sx={{
              mt: 1.8,
              p: 1.55,
              borderRadius: "1.2rem",
              bgcolor: "#0E56C8",
              color: "#FFFFFF",
              boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 90% 50%, rgba(255,255,255,0.08), transparent 40%)",
                pointerEvents: "none",
              }}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box>
                <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
                  Refer a friend, earn ₹5,000
                </Typography>
                <Typography
                  sx={{
                    mt: 0.4,
                    maxWidth: 480,
                    color: "rgba(255,255,255,0.78)",
                    fontSize: "0.76rem",
                    lineHeight: 1.65,
                  }}
                >
                  Share your unique referral code and earn credits on every
                  successful solar installation.
                </Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/customer/referrals"
                variant="contained"
                startIcon={<CardGiftcardRoundedIcon />}
                sx={{
                  minHeight: 34,
                  px: 1.35,
                  flexShrink: 0,
                  borderRadius: "0.85rem",
                  bgcolor: "#FFFFFF",
                  color: "#0E56C8",
                  boxShadow: "none",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#F0F5FF" },
                }}
              >
                Get Referral Code
              </Button>
            </Stack>
          </Box>

          {/* Savings hero + tender + service cards */}
          <Box
            sx={{
              mt: 1.5,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.95fr" },
              gap: 1.5,
            }}
          >
            {/* Savings hero */}
            <Box
              sx={{
                p: 1.55,
                borderRadius: "1.25rem",
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 78% 38%, rgba(255,255,255,0.14), transparent 18%), radial-gradient(circle at 85% 55%, rgba(255,255,255,0.1), transparent 20%), radial-gradient(circle at 72% 72%, rgba(255,255,255,0.08), transparent 22%)",
                  pointerEvents: "none",
                }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
                  gap: 1.3,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.68)",
                      fontSize: "0.56rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Lifetime Savings
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.75,
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      lineHeight: 1.02,
                    }}
                  >
                    {formatCompact(savings.lifetime)}
                    <Box
                      component="span"
                      sx={{
                        ml: 0.45,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        opacity: 0.82,
                      }}
                    >
                      projected
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.95,
                      color: "#80F0A8",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                    }}
                  >
                    {savings.totalKw > 0
                      ? `Based on ${savings.totalKw}kW installed capacity`
                      : "Savings will appear after your project starts"}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/customer/savings"
                    endIcon={
                      <ArrowForwardRoundedIcon sx={{ fontSize: "0.85rem" }} />
                    }
                    sx={{
                      mt: 1.35,
                      minHeight: 30,
                      px: 0,
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: "transparent", color: "#FFFFFF" },
                    }}
                  >
                    View full savings report
                  </Button>
                </Box>

                <Stack spacing={0.95}>
                  <StatPill
                    icon={<SavingsOutlinedIcon sx={{ fontSize: "0.82rem" }} />}
                    label="Monthly Savings"
                    value={formatPrice(savings.monthly)}
                  />
                  <StatPill
                    icon={<Co2OutlinedIcon sx={{ fontSize: "0.82rem" }} />}
                    label="Carbon Offset"
                    value={`${savings.co2Tons} t CO₂`}
                  />
                  <StatPill
                    icon={
                      <SolarPowerOutlinedIcon sx={{ fontSize: "0.82rem" }} />
                    }
                    label="Annual Generation"
                    value={`${Math.round(savings.totalKw * 1450)} kWh`}
                  />
                </Stack>
              </Box>
            </Box>

            {/* Tender + service cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "1fr" },
                gap: 1.3,
              }}
            >
              {/* Active tender card */}
              <Box
                sx={{
                  p: 1.35,
                  borderRadius: "1.15rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 0.82,
                      py: 0.34,
                      borderRadius: "999px",
                      bgcolor:
                        activeLead?.status === "open_for_quotes"
                          ? "#E7F318"
                          : "#EEF4FF",
                      color:
                        activeLead?.status === "open_for_quotes"
                          ? "#6C7300"
                          : "#4F89FF",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {activeLead?.status === "open_for_quotes"
                      ? "Bidding Live"
                      : activeLead
                        ? "Tender Active"
                        : "No Tender Yet"}
                  </Box>
                  <GavelRoundedIcon
                    sx={{ color: "#7A8799", fontSize: "1rem" }}
                  />
                </Stack>

                <Typography
                  sx={{
                    mt: 1.05,
                    color: "#223146",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  {activeLead ? "Active Solar Tender" : "Start a Tender"}
                </Typography>

                <Stack spacing={0.7} sx={{ mt: 1 }}>
                  <Box
                    sx={{ p: 0.9, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        sx={{ color: "#6F7D8F", fontSize: "0.72rem" }}
                      >
                        Bids Received
                      </Typography>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                        }}
                      >
                        {leadQuotes.length}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{ p: 0.9, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        sx={{ color: "#6F7D8F", fontSize: "0.72rem" }}
                      >
                        Best Offer
                      </Typography>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.9rem",
                          fontWeight: 800,
                        }}
                      >
                        {bestQuote ? formatPrice(bestQuote) : "Waiting"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  component={RouterLink}
                  to={
                    leadQuotes.length > 0
                      ? "/customer/tenders"
                      : "/customer/bookings"
                  }
                  fullWidth
                  sx={{
                    mt: 1.05,
                    minHeight: 36,
                    borderRadius: "0.9rem",
                    bgcolor: "#0E56C8",
                    boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {leadQuotes.length > 0
                    ? "View All Bids"
                    : activeLead
                      ? "Track Tender"
                      : "New Booking"}
                </Button>
              </Box>

              {/* Service request card */}
              <Box
                sx={{
                  p: 1.35,
                  borderRadius: "1.15rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 0.82,
                      py: 0.34,
                      borderRadius: "999px",
                      bgcolor: activeServiceRequest ? "#DDF8E7" : "#F2F5F8",
                      color: activeServiceRequest ? "#239654" : "#677487",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {activeServiceRequest
                      ? "Support Active"
                      : "No Active Ticket"}
                  </Box>
                  <BuildCircleOutlinedIcon
                    sx={{ color: "#7A8799", fontSize: "1rem" }}
                  />
                </Stack>

                <Typography
                  sx={{
                    mt: 1.05,
                    color: "#223146",
                    fontSize: "1rem",
                    fontWeight: 800,
                  }}
                >
                  {activeServiceRequest
                    ? activeServiceRequest.type
                        .replaceAll("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "Maintenance Service"}
                </Typography>

                <Box
                  sx={{
                    mt: 1,
                    p: 0.95,
                    borderRadius: "0.95rem",
                    bgcolor: "#F8FAFD",
                  }}
                >
                  {activeServiceRequest ? (
                    <>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography
                          sx={{ color: "#6F7D8F", fontSize: "0.68rem" }}
                        >
                          Ticket ID
                        </Typography>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                          }}
                        >
                          #{activeServiceRequest.ticketNumber}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          mt: 0.75,
                          color: "#223146",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                        }}
                      >
                        {getServiceStatusLabel(activeServiceRequest.status)}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.18,
                          color: "#6F7D8F",
                          fontSize: "0.7rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {activeServiceRequest.description.length > 60
                          ? `${activeServiceRequest.description.slice(0, 60)}…`
                          : activeServiceRequest.description}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        color: "#6F7D8F",
                        fontSize: "0.74rem",
                        lineHeight: 1.55,
                      }}
                    >
                      No active service requests. Raise a ticket if you need
                      maintenance or support.
                    </Typography>
                  )}
                </Box>

                <Button
                  component={RouterLink}
                  to={
                    activeServiceRequest
                      ? `/service-support/track?requestId=${activeServiceRequest.id}`
                      : "/customer/services"
                  }
                  fullWidth
                  sx={{
                    mt: 1.05,
                    minHeight: 36,
                    borderRadius: "0.9rem",
                    bgcolor: "#F3F6FB",
                    color: "#223146",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {activeServiceRequest ? "Track Service ↗" : "Request Service"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Project milestone tracker */}
          <Box
            sx={{
              mt: 1.55,
              p: 1.45,
              borderRadius: "1.2rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", lg: "center" }}
              spacing={1.3}
            >
              <Stack direction="row" spacing={0.95} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "0.9rem",
                    bgcolor: "#EEF4FF",
                    color: "#0E56C8",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <ApartmentRoundedIcon sx={{ fontSize: "1rem" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "1.02rem",
                      fontWeight: 800,
                    }}
                  >
                    {activeProject
                      ? `Active Project — ${activeProject.system.sizeKw}kW Rooftop`
                      : "No active project yet"}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.74rem" }}
                  >
                    {activeProject
                      ? `Residential Installation · ${projectLocation}`
                      : "Select a vendor quote to begin installation tracking"}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                component={RouterLink}
                to={activeProject ? `/customer/projects` : "/customer/bookings"}
                endIcon={
                  <ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />
                }
                sx={{
                  minHeight: 36,
                  px: 1.45,
                  flexShrink: 0,
                  borderRadius: "999px",
                  bgcolor: "#0E56C8",
                  boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {activeProject ? "Track Installation" : "View Bookings"}
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 0 }}
              sx={{ mt: 1.8 }}
            >
              {milestones.map((item, index) => (
                <MilestoneStep
                  key={item.label}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === milestones.length - 1}
                />
              ))}
            </Stack>
          </Box>

          {/* Quick nav cards */}
          <Box
            sx={{
              mt: 1.5,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                xl: "repeat(4, 1fr)",
              },
              gap: 1.3,
            }}
          >
            {[
              {
                icon: <BoltOutlinedIcon sx={{ fontSize: "1rem" }} />,
                iconBg: "#EEF4FF",
                iconTone: "#0E56C8",
                label: "My Projects",
                value: String(projects.length),
                sub: "installation projects",
                to: "/customer/projects",
              },
              {
                icon: <GavelRoundedIcon sx={{ fontSize: "1rem" }} />,
                iconBg: "#F4F1C9",
                iconTone: "#8B8600",
                label: "My Tenders",
                value: String(leads.length),
                sub: "active requests",
                to: "/customer/tenders",
              },
              {
                icon: <SavingsOutlinedIcon sx={{ fontSize: "1rem" }} />,
                iconBg: "#E8FAEF",
                iconTone: "#239654",
                label: "Savings",
                value: formatCompact(savings.annual),
                sub: "estimated per year",
                to: "/customer/savings",
              },
              {
                icon: <CardGiftcardRoundedIcon sx={{ fontSize: "1rem" }} />,
                iconBg: "#FFF4E8",
                iconTone: "#C47A00",
                label: "Refer & Earn",
                value: "₹5,000",
                sub: "per referral",
                to: "/customer/referrals",
              },
            ].map((card) => (
              <Box
                key={card.label}
                component={RouterLink}
                to={card.to}
                sx={{
                  p: 1.35,
                  borderRadius: "1.15rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                  textDecoration: "none",
                  display: "block",
                  transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    boxShadow: "0 18px 36px rgba(16,29,51,0.08)",
                    transform: "translateY(-2px)",
                    borderColor: "rgba(14,86,200,0.18)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "0.82rem",
                      bgcolor: card.iconBg,
                      color: card.iconTone,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <ArrowForwardRoundedIcon
                    sx={{ color: "#C8D0DC", fontSize: "0.9rem", mt: 0.2 }}
                  />
                </Stack>
                <Typography
                  sx={{
                    mt: 1.1,
                    color: "#18253A",
                    fontSize: "1.55rem",
                    fontWeight: 800,
                    lineHeight: 1.05,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.3,
                    color: "#223146",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{ mt: 0.15, color: "#7A8799", fontSize: "0.7rem" }}
                >
                  {card.sub}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Solar tip */}
          <Box
            sx={{
              mt: 1.55,
              p: 1.35,
              borderRadius: "1.2rem",
              background: "linear-gradient(90deg, #F2F47D 0%, #F0F7A6 100%)",
              border: "1px solid rgba(227,233,167,0.95)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.25}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Box
                component="img"
                src={customerSolarTipPlaceholder}
                alt="Solar tip"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  sx={{ color: "#4C5A00", fontSize: "1rem", fontWeight: 800 }}
                >
                  Solar Pro-Tip: Optimize your morning usage
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    color: "#5D6A16",
                    fontSize: "0.76rem",
                    lineHeight: 1.68,
                    maxWidth: 720,
                  }}
                >
                  Your panels reach peak efficiency between 10:00 AM and 2:00
                  PM. Schedule heavy appliances like your dishwasher or washing
                  machine during this window to maximize direct consumption and
                  save an additional ₹400 monthly.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}

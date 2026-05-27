import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";
import customerSolarTipPlaceholder from "@/shared/assets/images/customer/dashboard/customer-solar-tip-placeholder.png";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

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
  const amount = Number(value) || 0;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lakhs`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}K`;
  return formatPrice(amount);
}

function getSavingsModel(projects) {
  const totalKw = projects.reduce(
    (sum, project) => sum + (Number(project.system?.sizeKw) || 0),
    0,
  );
  const monthly = Math.round(totalKw * 1500);
  const annual = monthly * 12;
  const lifetime = annual * 25;
  const co2Tons = parseFloat((totalKw * 0.5).toFixed(1));
  return { totalKw, monthly, annual, lifetime, co2Tons };
}

function toStepperMilestone(milestone) {
  const done = milestone.status === "completed";
  const active = milestone.status === "in_progress";
  return {
    label: milestone.title,
    meta: done ? "Completed" : active ? "In Progress" : "Pending",
    state: done ? "completed" : active ? "active" : "upcoming",
  };
}

const PLACEHOLDER_MILESTONES = [
  { label: "Site Visit", meta: "Completed 02 T2", state: "completed" },
  { label: "Installation", meta: "In Progress", state: "active" },
  { label: "Inspection", meta: "Pending", state: "upcoming" },
  { label: "Activation", meta: "Estimated Nov 05", state: "upcoming" },
];

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

function CardShell({ children, sx }) {
  return (
    <Box
      sx={{
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.9)",
        boxShadow: "0 18px 42px rgba(17,32,49,0.055)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function StatusPill({ label, color = "#0E56C8", bg = "#EEF4FF" }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 0.85,
        py: 0.36,
        borderRadius: "999px",
        bgcolor: bg,
        color,
        fontSize: "0.58rem",
        fontWeight: 900,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        lineHeight: 1,
      }}
    >
      {label}
    </Box>
  );
}

function MetricGlass({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1rem",
        bgcolor: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Typography
        sx={{
          color: "rgba(255,255,255,0.74)",
          fontSize: "0.66rem",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#FFFFFF", fontSize: "1.15rem", fontWeight: 900 }}>
        {value}
      </Typography>
    </Box>
  );
}

function SavingsChart() {
  return (
    <Box
      sx={{
        position: "relative",
        height: 170,
        display: { xs: "none", lg: "block" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.14)",
          transform: "translate(18px, 6px) scale(1.05)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 10,
          bottom: 30,
          width: 190,
          height: 96,
          borderRadius: "1.1rem",
          bgcolor: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "flex-end",
          gap: 1.2,
          px: 1.2,
          py: 1,
        }}
      >
        {[34, 54, 42, 68, 92].map((height, index) => (
          <Box
            key={height}
            sx={{
              flex: 1,
              height,
              borderRadius: "0.35rem 0.35rem 0 0",
              bgcolor: index === 4 ? "#36C976" : "rgba(54,201,118,0.45)",
            }}
          />
        ))}
      </Box>
      <Typography
        sx={{
          position: "absolute",
          right: 18,
          bottom: 8,
          color: "rgba(255,255,255,0.58)",
          fontSize: "0.58rem",
          fontWeight: 800,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
        }}
      >
        Efficiency trend - last 30 days
      </Typography>
    </Box>
  );
}

function MilestoneStep({ item, isFirst, isLast }) {
  const done = item.state === "completed";
  const active = item.state === "active";
  const upcoming = item.state === "upcoming";

  return (
    <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
      {!isFirst ? (
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: "-50%",
            width: "100%",
            height: 3,
            bgcolor: done || active ? "#0E56C8" : "#DCE3EB",
          }}
        />
      ) : null}
      {!isLast ? (
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: "50%",
            width: "100%",
            height: 3,
            bgcolor: done ? "#0E56C8" : "#DCE3EB",
          }}
        />
      ) : null}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: done || active ? "#0E56C8" : "#DDE5EE",
            color: done || active ? "#FFFFFF" : "#98A3B2",
            display: "grid",
            placeItems: "center",
            boxShadow: active ? "0 10px 20px rgba(14,86,200,0.22)" : "none",
          }}
        >
          {done ? (
            <CheckRoundedIcon sx={{ fontSize: "0.92rem" }} />
          ) : active ? (
            <FlashOnRoundedIcon sx={{ fontSize: "0.92rem" }} />
          ) : (
            <PendingRoundedIcon sx={{ fontSize: "0.92rem" }} />
          )}
        </Box>
        <Typography
          sx={{
            mt: 0.8,
            color: active ? "#0E56C8" : "#26364B",
            fontSize: "0.68rem",
            fontWeight: 850,
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          sx={{
            mt: 0.18,
            color: upcoming ? "#8894A5" : active ? "#0E56C8" : "#647387",
            fontSize: "0.56rem",
            fontWeight: active ? 900 : 650,
            textAlign: "center",
          }}
        >
          {item.meta}
        </Typography>
      </Stack>
    </Box>
  );
}

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
        await Promise.allSettled([
          leadsApi.listLeads(),
          quotesApi.listQuotes(),
          projectsApi.listProjects(),
          serviceRequestsApi.listRequests(),
        ]);

      if (!active) return;

      setLeads(leadResult.status === "fulfilled" ? leadResult.value || [] : []);
      setQuotes(quoteResult.status === "fulfilled" ? quoteResult.value || [] : []);
      setProjects(
        projectResult.status === "fulfilled" ? projectResult.value || [] : [],
      );
      setServiceRequests(
        serviceResult.status === "fulfilled" ? serviceResult.value || [] : [],
      );

      if (
        leadResult.status === "rejected" &&
        quoteResult.status === "rejected" &&
        projectResult.status === "rejected" &&
        serviceResult.status === "rejected"
      ) {
        setError("Could not load dashboard.");
      }
    } catch {
      if (active) setError("Could not load dashboard.");
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

  const activeLead =
    leads.find((lead) => lead.status === "open_for_quotes") ?? leads[0] ?? null;

  const activeProject = projects[0] ?? null;

  const leadQuotes = useMemo(
    () =>
      activeLead
        ? quotes.filter((quote) => String(quote.leadId) === String(activeLead.id))
        : [],
    [activeLead, quotes],
  );

  const bestQuote = leadQuotes.length
    ? Math.min(...leadQuotes.map((quote) => Number(quote.pricing?.totalPrice) || 0))
    : null;

  const savings = useMemo(() => getSavingsModel(projects), [projects]);

  const milestones = useMemo(
    () =>
      activeProject?.milestones?.length
        ? activeProject.milestones.map(toStepperMilestone)
        : PLACEHOLDER_MILESTONES,
    [activeProject],
  );

  const activeServiceRequest = useMemo(
    () =>
      serviceRequests.find(
        (request) => request.status !== "resolved" && request.status !== "cancelled",
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

  return (
    <Box sx={{ width: "100%", maxWidth: 1180, mx: "auto" }}>
      <Box sx={{ mb: 2.6 }}>
        <Typography
          sx={{
            color: "#151B22",
            fontSize: { xs: "1.8rem", md: "2.25rem" },
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
          }}
        >
          {greeting}, {firstName}
        </Typography>
        <Typography sx={{ mt: 0.45, color: "#536171", fontSize: "0.94rem", lineHeight: 1.55 }}>
          {projects.length > 0
            ? "Your solar ecosystem is performing at peak efficiency today."
            : "Your booking and quote activity will appear here as vendors respond."}
        </Typography>
      </Box>

      {isLoading ? <CustomerLoadingBlock py={4} /> : null}

      {!isLoading && error ? (
        <CustomerErrorBlock message={error} onRetry={() => loadDashboard(true)} mt={1.5} />
      ) : null}

      {!isLoading && !error ? (
        <Stack spacing={2.4}>
          <Box
            sx={{
              p: { xs: 2, md: 2.3 },
              borderRadius: "0.8rem",
              bgcolor: "#0E56C8",
              color: "#FFFFFF",
              boxShadow: "0 18px 40px rgba(14,86,200,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                right: -26,
                bottom: -48,
                color: "rgba(255,255,255,0.12)",
                fontSize: 150,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              %
            </Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 900 }}>
              Refer a friend, save INR 5000
            </Typography>
            <Typography sx={{ mt: 0.4, color: "rgba(255,255,255,0.78)", fontSize: "0.76rem", lineHeight: 1.55 }}>
              Earn credits on your installation by sharing Sparkin Solar with your network.
            </Typography>
            <Button
              component={RouterLink}
              to="/customer/referrals"
              variant="contained"
              sx={{
                mt: 1.5,
                minHeight: 34,
                px: 1.35,
                borderRadius: "0.45rem",
                bgcolor: "#FFFFFF",
                color: "#0E56C8",
                boxShadow: "none",
                fontSize: "0.68rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#F0F5FF" },
              }}
            >
              Get Referral Code
            </Button>
          </Box>

          <Box
            sx={{
              p: { xs: 2, md: 2.6 },
              minHeight: { lg: 250 },
              borderRadius: "1rem",
              bgcolor: "#0E56C8",
              color: "#FFFFFF",
              boxShadow: "0 20px 46px rgba(14,86,200,0.22)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 72% 52%, rgba(255,255,255,0.16), transparent 23%), radial-gradient(circle at 88% 76%, rgba(255,255,255,0.12), transparent 18%)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 0.8fr 1fr" },
                gap: { xs: 2, lg: 2.4 },
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.64)",
                    fontSize: "0.58rem",
                    fontWeight: 850,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Total Lifetime Savings
                </Typography>
                <Typography sx={{ mt: 0.7, fontSize: { xs: "2.15rem", md: "3.15rem" }, fontWeight: 950, lineHeight: 1 }}>
                  {formatCompact(savings.lifetime)}
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#83F1A7", fontSize: "0.7rem", fontWeight: 900 }}>
                  {savings.totalKw > 0
                    ? `Based on ${savings.totalKw}kW installed capacity`
                    : "Savings will appear after your project starts"}
                </Typography>
              </Box>

              <Stack spacing={1.1}>
                <MetricGlass label="Monthly Savings" value={formatPrice(savings.monthly)} />
                <MetricGlass label="Carbon Offset" value={`${savings.co2Tons} Tons CO2`} />
              </Stack>

              <SavingsChart />
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.2,
            }}
          >
            <CardShell sx={{ p: { xs: 2, md: 2.3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <StatusPill
                  label={activeLead?.status === "open_for_quotes" ? "Status: Live" : activeLead ? "Tender Active" : "No Tender"}
                  color={activeLead?.status === "open_for_quotes" ? "#596100" : "#0E56C8"}
                  bg={activeLead?.status === "open_for_quotes" ? "#E7F318" : "#EEF4FF"}
                />
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "#F3F7FC", display: "grid", placeItems: "center", color: "#0E56C8" }}>
                  <GavelRoundedIcon sx={{ fontSize: "1rem" }} />
                </Box>
              </Stack>

              <Typography sx={{ mt: 1.2, color: "#151B22", fontSize: "1.05rem", fontWeight: 900 }}>
                {activeLead ? "Active Solar Tender" : "Start a Tender"}
              </Typography>

              <Stack spacing={1.1} sx={{ mt: 1.6 }}>
                <Box sx={{ p: 1.3, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#536171", fontSize: "0.76rem" }}>Bids Received</Typography>
                    <Typography sx={{ color: "#0E56C8", fontSize: "0.82rem", fontWeight: 900 }}>{leadQuotes.length}</Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 1.3, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#536171", fontSize: "0.76rem" }}>Best Offer Price</Typography>
                    <Typography sx={{ color: "#151B22", fontSize: "0.86rem", fontWeight: 900 }}>
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
                    ? `/quotes/compare?leadId=${activeLead?.id}`
                    : activeLead
                      ? `/tenders/live?leadId=${activeLead.id}`
                      : "/booking"
                }
                fullWidth
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{
                  mt: 1.6,
                  minHeight: 42,
                  borderRadius: "0.85rem",
                  bgcolor: "#0E56C8",
                  boxShadow: "0 14px 26px rgba(14,86,200,0.16)",
                  fontSize: "0.76rem",
                  fontWeight: 850,
                  textTransform: "none",
                }}
              >
                {leadQuotes.length > 0 ? "View All Bids" : activeLead ? "Track Tender" : "New Booking"}
              </Button>
            </CardShell>

            <CardShell sx={{ p: { xs: 2, md: 2.3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <StatusPill
                  label={activeServiceRequest ? "Support Active" : "No Active Ticket"}
                  color={activeServiceRequest ? "#11965A" : "#647387"}
                  bg={activeServiceRequest ? "#DDF8E7" : "#EEF2F6"}
                />
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "#F3F7FC", display: "grid", placeItems: "center", color: "#11965A" }}>
                  <PhoneInTalkRoundedIcon sx={{ fontSize: "1rem" }} />
                </Box>
              </Stack>

              <Typography sx={{ mt: 1.2, color: "#151B22", fontSize: "1.05rem", fontWeight: 900 }}>
                {activeServiceRequest
                  ? activeServiceRequest.type.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
                  : "Maintenance Service"}
              </Typography>

              <Box sx={{ mt: 1.6, p: 1.35, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}>
                {activeServiceRequest ? (
                  <>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: "#536171", fontSize: "0.68rem", fontWeight: 850, textTransform: "uppercase" }}>
                        Ticket ID
                      </Typography>
                      <Typography sx={{ color: "#0E56C8", fontSize: "0.68rem", fontWeight: 900 }}>
                        {activeServiceRequest.ticketNumber}
                      </Typography>
                    </Stack>
                    <Typography sx={{ mt: 0.65, color: "#151B22", fontSize: "0.82rem", fontWeight: 900 }}>
                      {getServiceStatusLabel(activeServiceRequest.status)}
                    </Typography>
                    <Typography sx={{ mt: 0.15, color: "#536171", fontSize: "0.72rem", lineHeight: 1.5 }}>
                      {activeServiceRequest.description.length > 70
                        ? `${activeServiceRequest.description.slice(0, 70)}...`
                        : activeServiceRequest.description}
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: "#536171", fontSize: "0.74rem", lineHeight: 1.55 }}>
                    No active service requests. Raise a ticket if you need maintenance or support.
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
                  mt: 1.6,
                  minHeight: 42,
                  borderRadius: "0.85rem",
                  bgcolor: "#E5EAEE",
                  color: "#151B22",
                  fontSize: "0.76rem",
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#DCE3EA" },
                }}
              >
                {activeServiceRequest ? "View Service History" : "Request Service"}
              </Button>
            </CardShell>
          </Box>

          <CardShell sx={{ p: { xs: 2, md: 2.6 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1.8}
            >
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Box sx={{ width: 46, height: 46, borderRadius: "1rem", bgcolor: "#EAF1FF", color: "#0E56C8", display: "grid", placeItems: "center" }}>
                  <ApartmentRoundedIcon sx={{ fontSize: "1.25rem" }} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#151B22", fontSize: "1.12rem", fontWeight: 900 }}>
                    {activeProject
                      ? `Active Project: ${activeProject.system.sizeKw}kW Rooftop`
                      : "No active project yet"}
                  </Typography>
                  <Typography sx={{ mt: 0.18, color: "#647387", fontSize: "0.76rem" }}>
                    {activeProject
                      ? `Residential Installation - ${projectLocation}`
                      : "Select a vendor quote to begin installation tracking"}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                component={RouterLink}
                to={activeProject ? "/customer/projects" : "/customer/bookings"}
                sx={{
                  minHeight: 38,
                  px: 2.2,
                  borderRadius: "999px",
                  bgcolor: "#0E56C8",
                  boxShadow: "0 14px 26px rgba(14,86,200,0.16)",
                  fontSize: "0.74rem",
                  fontWeight: 850,
                  textTransform: "none",
                }}
              >
                {activeProject ? "Track Installation" : "View Bookings"}
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 0 }} sx={{ mt: 2.7 }}>
              {milestones.map((item, index) => (
                <MilestoneStep
                  key={item.label}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === milestones.length - 1}
                />
              ))}
            </Stack>
          </CardShell>

          <Box
            sx={{
              p: { xs: 1.8, md: 2.2 },
              borderRadius: "1.2rem",
              background: "linear-gradient(90deg, #F2F47D 0%, #F0F7A6 100%)",
              border: "1px solid rgba(227,233,167,0.95)",
              boxShadow: "0 18px 42px rgba(17,32,49,0.055)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.8} alignItems={{ xs: "flex-start", md: "center" }}>
              <Box
                component="img"
                src={customerSolarTipPlaceholder}
                alt="Solar tip"
                sx={{ width: 92, height: 92, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <Box>
                <Typography sx={{ color: "#596800", fontSize: "1rem", fontWeight: 900 }}>
                  Solar Pro-Tip: Optimize your morning usage
                </Typography>
                <Typography sx={{ mt: 0.45, color: "#6B761E", fontSize: "0.8rem", lineHeight: 1.7, maxWidth: 760 }}>
                  Your panels reach peak efficiency between 10:00 AM and 2:00 PM. Schedule heavy appliances
                  like your dishwasher or washing machine during this window to maximize direct consumption
                  and save an additional INR 400 monthly.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </Box>
  );
}

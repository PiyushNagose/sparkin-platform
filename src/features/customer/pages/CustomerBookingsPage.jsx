import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import bookingHouseModern from "@/shared/assets/images/customer/bookings/booking-house-modern-placeholder.png";
import bookingHouseClassic from "@/shared/assets/images/customer/bookings/booking-house-classic-placeholder.png";
import bookingSolarFacility from "@/shared/assets/images/customer/bookings/booking-solar-facility-placeholder.png";
import bookingHouseUnderConstruction from "@/shared/assets/images/customer/bookings/booking-house-underconstruction-placeholder.png";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

// ─── constants ───────────────────────────────────────────────────────────────

const IMAGE_POOL = [
  bookingHouseModern,
  bookingHouseClassic,
  bookingSolarFacility,
  bookingHouseUnderConstruction,
];

const PAGE_SIZE = 6;

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

// Human-readable property type from the enum stored in DB
function formatPropertyType(type) {
  const map = {
    independent_house: "Independent House",
    apartment: "Apartment",
    commercial: "Commercial",
  };
  return map[type] || "Solar Request";
}

// Human-readable roof size range
function formatRoofSize(sizeRange) {
  const map = {
    under_500: "Under 500 sq ft",
    "500_1000": "500–1000 sq ft",
    over_1000: "Over 1000 sq ft",
  };
  return map[sizeRange] || "Shared after survey";
}

// Human-readable project status
function formatProjectStatus(status) {
  const map = {
    site_audit_pending: "Site Audit Pending",
    design_approval_pending: "Design Approval",
    installation_scheduled: "Installation Scheduled",
    installation_in_progress: "Installation In Progress",
    inspection_pending: "Inspection Pending",
    activated: "Activated",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] || status?.replaceAll("_", " ") || "In Progress";
}

// Status badge + CTA config driven by lead status
function getStatusConfig(lead, matchingProject, quoteCount) {
  if (lead.status === "quote_selected" || lead.status === "closed") {
    return {
      badge: "Project Created",
      badgeTone: "#239654",
      badgeBg: "#E8FAEF",
      action: "Track Project",
      actionPrimary: true,
      to: "/customer/projects",
    };
  }

  if (lead.status === "open_for_quotes") {
    return {
      badge: "Bidding Live",
      badgeTone: "#6C7300",
      badgeBg: "#E7F318",
      action: quoteCount > 0 ? "View Quotes" : "Track Tender",
      actionPrimary: true,
      to: "/customer/tenders",
    };
  }

  if (lead.status === "reviewing") {
    return {
      badge: "Under Review",
      badgeTone: "#4F89FF",
      badgeBg: "#EEF4FF",
      action: "View Details",
      actionPrimary: false,
      to: "/customer/tenders",
    };
  }

  // submitted — just created
  return {
    badge: "Submitted",
    badgeTone: "#8F98A7",
    badgeBg: "#F2F5F8",
    action: "View Details",
    actionPrimary: false,
    to: "/customer/tenders",
  };
}

// Build the card data object from raw API records
function toBookingCard(lead, allQuotes, allProjects, index) {
  const leadQuotes = allQuotes.filter(
    (q) => String(q.leadId) === String(lead.id),
  );
  const matchingProject = allProjects.find(
    (p) => String(p.leadId) === String(lead.id),
  );
  const statusConfig = getStatusConfig(
    lead,
    matchingProject,
    leadQuotes.length,
  );
  const bestQuote = leadQuotes.length
    ? Math.min(...leadQuotes.map((q) => Number(q.pricing?.totalPrice) || 0))
    : null;

  return {
    id: lead.id,
    image: IMAGE_POOL[index % IMAGE_POOL.length],
    title: `${lead.installationAddress?.city || "Location"} — ${formatPropertyType(lead.property?.type)}`,
    location: `${lead.installationAddress?.city || ""}, ${lead.installationAddress?.state || ""}`,
    submittedAt: formatDate(lead.createdAt || lead.submittedAt),
    // left column
    roofSize: formatRoofSize(lead.roof?.sizeRange),
    propertyType: formatPropertyType(lead.property?.type),
    sanctionedLoad: lead.property?.sanctionedLoadKw
      ? `${lead.property.sanctionedLoadKw} kW`
      : "Not specified",
    // right column
    quoteCount: leadQuotes.length,
    bestQuote,
    projectStatus: matchingProject
      ? formatProjectStatus(matchingProject.status)
      : null,
    ...statusConfig,
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, subtitle, tone, bg }) {
  return (
    <Box
      sx={{
        p: 1.45,
        minHeight: 104,
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
            width: 30,
            height: 30,
            borderRadius: "0.8rem",
            bgcolor: bg,
            color: tone,
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            color: tone,
            fontSize: "0.56rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 1.05,
          color: "#18253A",
          fontSize: "1.65rem",
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#6F7D8F", fontSize: "0.74rem" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

function DataField({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#98A3B2",
          fontSize: "0.56rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.28,
          color: "#223146",
          fontSize: "0.82rem",
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function BookingCard({ item }) {
  return (
    <Box
      sx={{
        p: 1.35,
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        transition: "box-shadow 0.18s",
        "&:hover": { boxShadow: "0 18px 36px rgba(16,29,51,0.08)" },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.25}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
      >
        {/* Left — image + details */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.1}
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Box
            component="img"
            src={item.image}
            alt={item.title}
            sx={{
              width: { xs: "100%", sm: 96 },
              height: { xs: 148, sm: 64 },
              borderRadius: "0.85rem",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#223146",
                fontSize: "1rem",
                fontWeight: 800,
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </Typography>

            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{ mt: 0.25, color: "#7A8799" }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: "0.82rem" }} />
              <Typography sx={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
                {item.location} · Submitted {item.submittedAt}
              </Typography>
            </Stack>

            <Box
              sx={{
                mt: 1,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 0.85,
              }}
            >
              <DataField label="Roof Size" value={item.roofSize} />
              <DataField label="Property" value={item.propertyType} />
              <DataField
                label={item.projectStatus ? "Project Stage" : "Bids Received"}
                value={
                  item.projectStatus
                    ? item.projectStatus
                    : item.quoteCount > 0
                      ? `${item.quoteCount} received`
                      : "Awaiting bids"
                }
              />
            </Box>

            {/* Best quote pill — only when quotes exist and no project yet */}
            {item.bestQuote && !item.projectStatus ? (
              <Box
                sx={{
                  mt: 0.95,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 0.9,
                  py: 0.32,
                  borderRadius: "999px",
                  bgcolor: "#E8FAEF",
                  color: "#239654",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                }}
              >
                Best offer: {formatPrice(item.bestQuote)}
              </Box>
            ) : null}
          </Box>
        </Stack>

        {/* Right — badge + CTA */}
        <Stack
          spacing={1}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          sx={{ flexShrink: 0 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              px: 0.85,
              py: 0.34,
              borderRadius: "999px",
              bgcolor: item.badgeBg,
              color: item.badgeTone,
              fontSize: "0.6rem",
              fontWeight: 800,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {item.badge}
          </Box>

          <Button
            component={RouterLink}
            to={item.to}
            variant={item.actionPrimary ? "contained" : "outlined"}
            endIcon={
              item.actionPrimary ? (
                <ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />
              ) : null
            }
            sx={{
              minHeight: 34,
              px: 1.35,
              alignSelf: { xs: "stretch", sm: "flex-start", md: "auto" },
              borderRadius: "0.85rem",
              bgcolor: item.actionPrimary ? "#0E56C8" : "#F5F7FB",
              borderColor: "rgba(225,232,241,0.96)",
              color: item.actionPrimary ? "#FFFFFF" : "#223146",
              boxShadow: item.actionPrimary
                ? "0 12px 24px rgba(14,86,200,0.14)"
                : "none",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {item.action}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, onPage }) {
  if (totalPages <= 1) return null;

  return (
    <Stack
      direction="row"
      spacing={0.45}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 1.85 }}
    >
      <Button
        onClick={onPrev}
        disabled={page === 1}
        sx={{
          minWidth: 30,
          width: 30,
          height: 30,
          borderRadius: "50%",
          color: "#647387",
          p: 0,
          "&:disabled": { opacity: 0.35 },
        }}
      >
        <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1rem" }} />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          onClick={() => onPage(n)}
          sx={{
            minWidth: 30,
            width: 30,
            height: 30,
            borderRadius: "50%",
            p: 0,
            color: n === page ? "#FFFFFF" : "#223146",
            bgcolor: n === page ? "#0E56C8" : "#FFFFFF",
            border: n === page ? "none" : "1px solid rgba(225,232,241,0.96)",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          {n}
        </Button>
      ))}

      <Button
        onClick={onNext}
        disabled={page === totalPages}
        sx={{
          minWidth: 30,
          width: 30,
          height: 30,
          borderRadius: "50%",
          color: "#647387",
          p: 0,
          "&:disabled": { opacity: 0.35 },
        }}
      >
        <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
      </Button>
    </Stack>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerBookingsPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  async function loadBookings(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [leadResult, quoteResult, projectResult] = await Promise.all([
        leadsApi.listLeads(),
        quotesApi.listQuotes(),
        projectsApi.listProjects(),
      ]);

      if (!active) return;
      setLeads(leadResult);
      setQuotes(quoteResult);
      setProjects(projectResult);
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load bookings.");
      }
    } finally {
      if (active) setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadBookings(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived state ──────────────────────────────────────────────────────────

  const allCards = useMemo(
    () => leads.map((lead, i) => toBookingCard(lead, quotes, projects, i)),
    [leads, quotes, projects],
  );

  const totalPages = Math.max(1, Math.ceil(allCards.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleCards = allCards.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // KPI values — all derived from real data
  const liveCount = leads.filter((l) => l.status === "open_for_quotes").length;
  const projectCount = projects.length;
  const totalKw = projects.reduce(
    (sum, p) => sum + (Number(p.system?.sizeKw) || 0),
    0,
  );
  const lifetimeSavings = Math.round(totalKw * 1500 * 12 * 25);

  // ── handlers ──────────────────────────────────────────────────────────────

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

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
            My Bookings
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            All your solar requests in one place — track status, bids, and
            project progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={RouterLink}
          to="/booking"
          startIcon={<AddRoundedIcon />}
          sx={{
            minHeight: 38,
            px: 1.65,
            alignSelf: { xs: "stretch", sm: "flex-start" },
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          New Booking
        </Button>
      </Stack>

      {/* KPI strip — always visible, shows zeros while loading */}
      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            xl: "repeat(4, 1fr)",
          },
          gap: 1.3,
        }}
      >
        <KpiCard
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          label="Total"
          value={String(leads.length).padStart(2, "0")}
          subtitle="Solar requests"
          tone="#8B8600"
          bg="#F4F1C9"
        />
        <KpiCard
          icon={<TrackChangesRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          label="Live"
          value={String(liveCount).padStart(2, "0")}
          subtitle="Bidding active"
          tone="#4F89FF"
          bg="#EEF4FF"
        />
        <KpiCard
          icon={<SavingsOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          label="Savings"
          value={lifetimeSavings > 0 ? formatCompact(lifetimeSavings) : "—"}
          subtitle="Est. 25-year value"
          tone="#239654"
          bg="#E8FAEF"
        />
        <KpiCard
          icon={<BoltOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          label="Capacity"
          value={totalKw > 0 ? `${totalKw}kW` : "—"}
          subtitle="Selected system size"
          tone="#8F98A7"
          bg="#F2F5F8"
        />
      </Box>

      {/* Booking list */}
      <Stack spacing={1.35} sx={{ mt: 1.8 }}>
        {isLoading && <CustomerLoadingBlock mt={0} />}

        {!isLoading && error && <CustomerErrorBlock message={error} onRetry={() => loadBookings(true)} mt={0} />}

        {!isLoading && !error && allCards.length === 0 && (
          <Box
            sx={{
              py: 5,
              px: 2,
              borderRadius: "1.2rem",
              bgcolor: "#F8FAFD",
              border: "1px solid rgba(225,232,241,0.9)",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              No bookings yet
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
              Create your first solar request and start receiving quotes from
              verified vendors.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/booking"
              startIcon={<AddRoundedIcon />}
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
              Create Booking
            </Button>
          </Box>
        )}

        {!isLoading &&
          !error &&
          visibleCards.map((item) => <BookingCard key={item.id} item={item} />)}
      </Stack>

      {/* Pagination */}
      {!isLoading && !error && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
          onPage={setPage}
        />
      )}
    </Box>
  );
}

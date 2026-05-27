import { Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  CustomerErrorBlock,
  CustomerLoadingBlock,
} from "@/features/customer/components/CustomerPageStates";
import {
  buildBookingDetailsPath,
  formatDate,
  formatPrice,
  formatProjectStatus,
  formatPropertyType,
  formatRoofSize,
  getLeadQuotes,
  getLeadStatusMeta,
  getPrimaryLeadAction,
  getRelevantProject,
} from "@/features/customer/lib/customerLeadFlow";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import bookingHouseClassic from "@/shared/assets/images/customer/bookings/booking-house-classic-placeholder.png";
import bookingHouseModern from "@/shared/assets/images/customer/bookings/booking-house-modern-placeholder.png";
import bookingHouseUnderConstruction from "@/shared/assets/images/customer/bookings/booking-house-underconstruction-placeholder.png";
import bookingSolarFacility from "@/shared/assets/images/customer/bookings/booking-solar-facility-placeholder.png";

const IMAGE_POOL = [
  bookingHouseModern,
  bookingHouseClassic,
  bookingSolarFacility,
  bookingHouseUnderConstruction,
];

const PAGE_SIZE = 6;

function formatCompact(value) {
  const n = Number(value) || 0;
  if (n >= 100000) return `Rs${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `Rs${(n / 1000).toFixed(0)}K`;
  return formatPrice(n);
}

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
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
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

function toBookingCard(lead, allQuotes, allProjects, index) {
  const leadQuotes = getLeadQuotes(allQuotes, lead.id, { activeOnly: true });
  const matchingProject = getRelevantProject(allProjects, lead.id);
  const statusMeta = getLeadStatusMeta(lead);
  const primaryAction = getPrimaryLeadAction(lead, allQuotes, allProjects);
  const bestQuote = leadQuotes.length
    ? Math.min(...leadQuotes.map((quote) => Number(quote.pricing?.totalPrice) || 0))
    : null;

  return {
    id: lead.id,
    image: IMAGE_POOL[index % IMAGE_POOL.length],
    title: `${lead.installationAddress?.city || "Location"} - ${formatPropertyType(lead.property?.type)}`,
    location: [lead.installationAddress?.city, lead.installationAddress?.state]
      .filter(Boolean)
      .join(", "),
    submittedAt: formatDate(lead.createdAt || lead.submittedAt),
    roofSize: formatRoofSize(lead.roof?.sizeRange),
    propertyType: formatPropertyType(lead.property?.type),
    quoteCount: leadQuotes.length,
    bestQuote,
    projectStatus: matchingProject ? formatProjectStatus(matchingProject.status) : null,
    badge: statusMeta.label,
    badgeTone: statusMeta.tone,
    badgeBg: statusMeta.bg,
    detailsTo: buildBookingDetailsPath(lead.id),
    action: primaryAction.label,
    actionPrimary: primaryAction.primary,
    to: primaryAction.to,
    hideDetailsAction: buildBookingDetailsPath(lead.id) === primaryAction.to,
  };
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
              height: { xs: 148, sm: 96 },
              borderRadius: "0.85rem",
              objectFit: "cover",
              objectPosition: "center center",
              flexShrink: 0,
              display: "block",
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

          <Stack
            direction={{ xs: "column", sm: "row", md: "column" }}
            spacing={0.8}
            alignItems={{ xs: "stretch", md: "flex-end" }}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            {!item.hideDetailsAction ? (
              <Button
                component={RouterLink}
                to={item.detailsTo}
                variant="outlined"
                sx={{
                  minHeight: 36,
                  height: 36,
                  width: { md: 148 },
                  px: 1.35,
                  borderRadius: "0.85rem",
                  borderColor: "rgba(225,232,241,0.96)",
                  color: "#223146",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                View Details
              </Button>
            ) : null}
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
                minHeight: 36,
                height: 36,
                width: { md: 148 },
                px: 1.35,
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
                whiteSpace: "nowrap",
              }}
            >
              {item.action}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

function Pagination({ page, totalPages, onPrev, onNext, onPage }) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        marginTop: "24px",
      }}
    >
      {/* Prev arrow */}
      <button
        onClick={onPrev}
        disabled={page === 1}
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          borderRadius: "50%",
          border: "1px solid rgba(225,232,241,0.96)",
          background: "#FFFFFF",
          cursor: page === 1 ? "not-allowed" : "pointer",
          opacity: page === 1 ? 0.35 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <KeyboardArrowLeftRoundedIcon style={{ fontSize: "1rem", color: "#647387" }} />
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          style={{
            width: 32,
            height: 32,
            minWidth: 32,
            borderRadius: "50%",
            border: n === page ? "none" : "1px solid rgba(225,232,241,0.96)",
            background: n === page ? "#0E56C8" : "#FFFFFF",
            color: n === page ? "#FFFFFF" : "#223146",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            flexShrink: 0,
            lineHeight: 1,
            fontFamily: "inherit",
          }}
        >
          {n}
        </button>
      ))}

      {/* Next arrow */}
      <button
        onClick={onNext}
        disabled={page === totalPages}
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          borderRadius: "50%",
          border: "1px solid rgba(225,232,241,0.96)",
          background: "#FFFFFF",
          cursor: page === totalPages ? "not-allowed" : "pointer",
          opacity: page === totalPages ? 0.35 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          flexShrink: 0,
        }}
      >
        <KeyboardArrowRightRoundedIcon style={{ fontSize: "1rem", color: "#647387" }} />
      </button>
    </div>
  );
}

export default function CustomerBookingsPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  async function loadBookings(active = true, force = false) {
    setIsLoading(true);
    setError("");

    const opts = force ? { force: true } : {};

    try {
      const results = await Promise.allSettled([
        leadsApi.listLeads(opts),
        quotesApi.listQuotes({}, opts),
        projectsApi.listProjects(opts),
      ]);

      if (!active) return;

      const [leadResult, quoteResult, projectResult] = results;

      setLeads(leadResult.status === "fulfilled" ? leadResult.value || [] : []);
      setQuotes(quoteResult.status === "fulfilled" ? quoteResult.value || [] : []);
      setProjects(
        projectResult.status === "fulfilled" ? projectResult.value || [] : [],
      );

      if (
        leadResult.status === "rejected" &&
        quoteResult.status === "rejected" &&
        projectResult.status === "rejected"
      ) {
        setError("Could not load bookings. Please try again.");
      }
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

  const allCards = useMemo(
    () => leads.map((lead, index) => toBookingCard(lead, quotes, projects, index)),
    [leads, quotes, projects],
  );

  const totalPages = Math.max(1, Math.ceil(allCards.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleCards = allCards.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const liveCount = leads.filter((lead) => lead.status === "open_for_quotes").length;
  const totalKw = projects
    .filter((project) => project.status !== "cancelled")
    .reduce((sum, project) => sum + (Number(project.system?.sizeKw) || 0), 0);
  const lifetimeSavings = Math.round(totalKw * 1500 * 12 * 25);

  return (
    <Box sx={{ width: "100%" }}>
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
            All your solar requests in one place - review submitted details, watch
            bidding go live, and jump into project tracking when the system is ready.
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

      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", xl: "repeat(4, 1fr)" },
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
          value={lifetimeSavings > 0 ? formatCompact(lifetimeSavings) : "-"}
          subtitle="Est. 25-year value"
          tone="#239654"
          bg="#E8FAEF"
        />
        <KpiCard
          icon={<BoltOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          label="Capacity"
          value={totalKw > 0 ? `${totalKw}kW` : "-"}
          subtitle="Selected system size"
          tone="#8F98A7"
          bg="#F2F5F8"
        />
      </Box>

      <Stack spacing={1.35} sx={{ mt: 1.8 }}>
        {isLoading && <CustomerLoadingBlock mt={0} />}

        {!isLoading && error ? (
          <CustomerErrorBlock
            message={error}
            onRetry={() => loadBookings(true, true)}
            mt={0}
          />
        ) : null}

        {!isLoading && !error && allCards.length === 0 ? (
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
        ) : null}

        {!isLoading && !error
          ? visibleCards.map((item) => <BookingCard key={item.id} item={item} />)
          : null}
      </Stack>

      {!isLoading && !error ? (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPrev={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
          onPage={setPage}
        />
      ) : null}
    </Box>
  );
}

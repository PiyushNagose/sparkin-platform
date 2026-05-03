import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// Build a human-readable title from lead data — never shows "null kW"
function buildTenderTitle(lead) {
  const kw = lead.property?.sanctionedLoadKw;
  const type = lead.property?.type;

  const typeLabel =
    {
      independent_house: "Residential",
      apartment: "Apartment",
      commercial: "Commercial",
    }[type] || "Solar";

  if (kw) return `${kw}kW ${typeLabel} Solar System`;
  return `${typeLabel} Solar System`;
}

// Status badge config for every possible lead status
function getStatusConfig(status) {
  switch (status) {
    case "open_for_quotes":
      return { label: "Bidding Live", tone: "#239654", bg: "#E8FAEF" };
    case "quote_selected":
      return { label: "Vendor Selected", tone: "#0E56C8", bg: "#EEF4FF" };
    case "closed":
      return { label: "Closed", tone: "#596579", bg: "#EEF2F6" };
    case "reviewing":
      return { label: "Under Review", tone: "#8B8600", bg: "#F4F1C9" };
    default:
      // submitted
      return { label: "Submitted", tone: "#8F98A7", bg: "#F2F5F8" };
  }
}

// Whether a lead counts as "active" for the tab filter
function isActiveLead(lead) {
  return lead.status !== "closed" && lead.status !== "quote_selected";
}

// Build the full card data object from raw API records
function toTenderCard(lead, allQuotes) {
  const leadQuotes = allQuotes.filter(
    (q) => String(q.leadId) === String(lead.id),
  );

  // Only count non-withdrawn, non-rejected quotes as real bids
  const activeBids = leadQuotes.filter(
    (q) => q.status !== "withdrawn" && q.status !== "rejected",
  );

  const acceptedQuote = leadQuotes.find((q) => q.status === "accepted");

  const bestPrice = activeBids.length
    ? Math.min(...activeBids.map((q) => Number(q.pricing?.totalPrice) || 0))
    : null;

  const statusConfig = getStatusConfig(lead.status);

  // CTA destination — quote comparison for live tenders, projects for selected
  let to = "/tenders/live";
  if (lead.status === "open_for_quotes" && activeBids.length > 0) {
    to = "/quotes/compare";
  } else if (lead.status === "quote_selected" || lead.status === "closed") {
    to = "/customer/projects";
  }

  const ctaLabel =
    lead.status === "open_for_quotes" && activeBids.length > 0
      ? "Compare Bids"
      : lead.status === "quote_selected"
        ? "Track Project"
        : lead.status === "open_for_quotes"
          ? "View Tender"
          : "View Details";

  return {
    id: lead.id,
    title: buildTenderTitle(lead),
    city: lead.installationAddress?.city || "",
    state: lead.installationAddress?.state || "",
    submittedAt: formatDate(lead.createdAt || lead.submittedAt),
    bidCount: activeBids.length,
    bestPrice,
    acceptedVendor: acceptedQuote
      ? acceptedQuote.vendorEmail?.split("@")[0] || "Assigned Vendor"
      : null,
    acceptedPrice: acceptedQuote
      ? formatPrice(acceptedQuote.pricing?.totalPrice)
      : null,
    status: lead.status,
    ...statusConfig,
    to,
    ctaLabel,
    isPrimary:
      lead.status === "open_for_quotes" || lead.status === "quote_selected",
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

// The sun orb icon used on each tender card
function SunOrb() {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 50%, #FFD44C 0%, #FFAE18 28%, #FF6A00 52%, #682000 78%, #271002 100%)",
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,0.16), 0 10px 18px rgba(255,124,0,0.22)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 9,
          borderRadius: "50%",
          border: "1px solid rgba(255,245,214,0.65)",
        }}
      />
    </Box>
  );
}

function MetricBox({ label, value, valueTone = "#223146" }) {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: "0.95rem",
        bgcolor: "#F7F9FC",
      }}
    >
      <Typography
        sx={{
          color: "#98A3B2",
          fontSize: "0.52rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.4,
          color: valueTone,
          fontSize: "1.05rem",
          fontWeight: 800,
          lineHeight: 1.15,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function TenderCard({ item }) {
  const isSelected = item.status === "quote_selected";
  const isClosed = item.status === "closed";

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "1.35rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        transition: "box-shadow 0.18s",
        "&:hover": { boxShadow: "0 18px 36px rgba(16,29,51,0.08)" },
        opacity: isClosed ? 0.72 : 1,
      }}
    >
      {/* Header row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.15}
      >
        <Stack
          direction="row"
          spacing={1.05}
          alignItems="flex-start"
          sx={{ minWidth: 0 }}
        >
          <SunOrb />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#223146",
                fontSize: "1.01rem",
                fontWeight: 800,
                lineHeight: 1.28,
              }}
            >
              {item.title}
            </Typography>
            <Stack
              direction="row"
              spacing={0.35}
              alignItems="center"
              sx={{ mt: 0.28, color: "#7A8799" }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: "0.8rem" }} />
              <Typography sx={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
                {item.city}, {item.state} · Submitted {item.submittedAt}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "inline-flex",
            px: 0.88,
            py: 0.38,
            borderRadius: "999px",
            bgcolor: item.bg,
            color: item.tone,
            fontSize: "0.58rem",
            fontWeight: 800,
            lineHeight: 1.1,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          {item.label}
        </Box>
      </Stack>

      {/* Metrics */}
      {isSelected && item.acceptedVendor ? (
        // Vendor selected — show accepted vendor info instead of bid metrics
        <Box
          sx={{
            mt: 1.25,
            p: 1.1,
            borderRadius: "1rem",
            bgcolor: "#EEF4FF",
            border: "1px solid rgba(14,86,200,0.1)",
          }}
        >
          <Stack direction="row" spacing={0.7} alignItems="center">
            <CheckCircleOutlinedIcon
              sx={{ color: "#0E56C8", fontSize: "1rem" }}
            />
            <Box>
              <Typography
                sx={{ color: "#0E56C8", fontSize: "0.72rem", fontWeight: 800 }}
              >
                Vendor Selected: {item.acceptedVendor}
              </Typography>
              {item.acceptedPrice && (
                <Typography
                  sx={{ mt: 0.15, color: "#4F5F73", fontSize: "0.68rem" }}
                >
                  Accepted quote: {item.acceptedPrice}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1.25,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 0.9,
          }}
        >
          <MetricBox
            label="Bids Received"
            value={item.bidCount > 0 ? String(item.bidCount) : "Awaiting"}
          />
          <MetricBox
            label="Best Price"
            value={item.bestPrice ? formatPrice(item.bestPrice) : "Waiting"}
            valueTone={item.bestPrice ? "#239654" : "#8F98A7"}
          />
          <MetricBox label="Status" value={item.label} valueTone={item.tone} />
        </Box>
      )}

      {/* CTA */}
      <Button
        component={RouterLink}
        to={item.to}
        fullWidth
        variant={item.isPrimary ? "contained" : "text"}
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
        sx={{
          mt: 1.3,
          minHeight: 38,
          borderRadius: "0.95rem",
          bgcolor: item.isPrimary ? "#0E56C8" : "#E3E8EF",
          color: item.isPrimary ? "#FFFFFF" : "#223146",
          boxShadow: item.isPrimary
            ? "0 12px 24px rgba(14,86,200,0.14)"
            : "none",
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            bgcolor: item.isPrimary ? "#0B49AD" : "#D5DCE6",
          },
        }}
      >
        {item.ctaLabel}
      </Button>
    </Box>
  );
}

// Tab bar — clickable, drives the filter
function TabBar({ activeTab, onTabChange, activeCount, closedCount }) {
  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "closed", label: "Closed", count: closedCount },
  ];

  return (
    <Stack direction="row" spacing={2.9} sx={{ mt: 2.05, pb: 0.55 }}>
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.key;
        return (
          <Box
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            sx={{ position: "relative", pb: 0.85, cursor: "pointer" }}
          >
            <Typography
              sx={{
                color: isSelected ? "#223146" : "#647387",
                fontSize: "0.78rem",
                fontWeight: isSelected ? 800 : 500,
                userSelect: "none",
              }}
            >
              {tab.label}{" "}
              <Box
                component="span"
                sx={{
                  color: isSelected ? "#0E56C8" : "#98A3B2",
                  fontWeight: 700,
                }}
              >
                ({tab.count})
              </Box>
            </Typography>
            {isSelected && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  borderRadius: "999px",
                  bgcolor: "#0E56C8",
                }}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerTendersPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  async function loadTenders(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [leadResult, quoteResult] = await Promise.all([
        leadsApi.listLeads(),
        quotesApi.listQuotes(),
      ]);

      if (!active) return;
      setLeads(leadResult);
      setQuotes(quoteResult);
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load tenders.");
      }
    } finally {
      if (active) setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadTenders(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived state ──────────────────────────────────────────────────────────

  const allCards = useMemo(
    () => leads.map((lead) => toTenderCard(lead, quotes)),
    [leads, quotes],
  );

  const activeCards = useMemo(
    () =>
      allCards.filter((c) =>
        isActiveLead(leads.find((l) => l.id === c.id) || {}),
      ),
    [allCards, leads],
  );

  const closedCards = useMemo(
    () =>
      allCards.filter(
        (c) => !isActiveLead(leads.find((l) => l.id === c.id) || {}),
      ),
    [allCards, leads],
  );

  const visibleCards = activeTab === "active" ? activeCards : closedCards;

  const totalBids = quotes.filter(
    (q) => q.status !== "withdrawn" && q.status !== "rejected",
  ).length;

  const liveTenders = leads.filter(
    (l) => l.status === "open_for_quotes",
  ).length;

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
            My Tenders
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Track your live bidding processes and compare vendor proposals.
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
          New Tender
        </Button>
      </Stack>

      {/* Summary strip — visible while loading too, shows zeros */}
      {!error && (
        <Box
          sx={{
            mt: 1.75,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 1.2,
          }}
        >
          {[
            {
              label: "Total Tenders",
              value: String(leads.length).padStart(2, "0"),
              tone: "#8B8600",
              bg: "#F4F1C9",
            },
            {
              label: "Live Bidding",
              value: String(liveTenders).padStart(2, "0"),
              tone: "#239654",
              bg: "#E8FAEF",
            },
            {
              label: "Total Bids",
              value: String(totalBids).padStart(2, "0"),
              tone: "#0E56C8",
              bg: "#EEF4FF",
            },
            {
              label: "Vendor Selected",
              value: String(
                leads.filter((l) => l.status === "quote_selected").length,
              ).padStart(2, "0"),
              tone: "#596579",
              bg: "#EEF2F6",
            },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                p: 1.35,
                borderRadius: "1.1rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.7,
                  py: 0.28,
                  borderRadius: "999px",
                  bgcolor: stat.bg,
                  color: stat.tone,
                  fontSize: "0.52rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  mb: 0.9,
                }}
              >
                {stat.label}
              </Box>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: "1.65rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                {isLoading ? "—" : stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Tab bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeCards.length}
        closedCount={closedCards.length}
      />

      {/* Loading */}
      {isLoading && <CustomerLoadingBlock mt={0} />}

      {/* Error */}
      {!isLoading && error && <CustomerErrorBlock message={error} onRetry={() => loadTenders(true)} mt={1.2} />}

      {/* Empty state */}
      {!isLoading && !error && visibleCards.length === 0 && (
        <Box
          sx={{
            mt: 1.2,
            py: 5,
            px: 2,
            borderRadius: "1.2rem",
            bgcolor: "#F8FAFD",
            border: "1px solid rgba(225,232,241,0.9)",
            textAlign: "center",
          }}
        >
          {activeTab === "active" ? (
            <>
              <GavelRoundedIcon
                sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }}
              />
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                No active tenders
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
                Create a booking to broadcast your solar requirement to our
                verified vendor network.
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
            </>
          ) : (
            <>
              <CheckCircleOutlinedIcon
                sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }}
              />
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                No closed tenders yet
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
                Tenders move here once a vendor is selected or the request is
                closed.
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Tender grid */}
      {!isLoading && !error && visibleCards.length > 0 && (
        <Box
          sx={{
            mt: 1.2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
            gap: 1.55,
          }}
        >
          {visibleCards.map((item) => (
            <TenderCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}

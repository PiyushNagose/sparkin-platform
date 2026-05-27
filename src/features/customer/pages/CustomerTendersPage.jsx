import { Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  CustomerErrorBlock,
  CustomerLoadingBlock,
} from "@/features/customer/components/CustomerPageStates";
import {
  buildTenderDetailsPath,
  formatDate,
  formatPrice,
  getLeadQuotes,
  getLeadStatusMeta,
  isLeadBiddingExpired,
  getRelevantProject,
} from "@/features/customer/lib/customerLeadFlow";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";

function buildTenderTitle(lead) {
  const kw = lead.property?.sanctionedLoadKw;
  const type = lead.property?.type;
  const typeLabel =
    {
      independent_house: "Residential",
      apartment: "Apartment",
      commercial: "Commercial",
    }[type] || "Solar";

  return kw ? `${kw}kW ${typeLabel} Solar System` : `${typeLabel} Solar System`;
}

function isActiveLead(lead) {
  if (isLeadBiddingExpired(lead)) return false;
  return lead.status !== "closed" && lead.status !== "quote_selected";
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

function toTenderCard(lead, allQuotes, allProjects) {
  const leadQuotes = getLeadQuotes(allQuotes, lead.id, { activeOnly: true });
  const matchingProject = getRelevantProject(allProjects, lead.id);
  const acceptedQuote = leadQuotes.find((quote) => quote.status === "accepted");
  const bestPrice = leadQuotes.length
    ? Math.min(...leadQuotes.map((quote) => Number(quote.pricing?.totalPrice) || 0))
    : null;
  const statusMeta = getLeadStatusMeta(lead);

  return {
    id: lead.id,
    title: buildTenderTitle(lead),
    city: lead.installationAddress?.city || "",
    state: lead.installationAddress?.state || "",
    submittedAt: formatDate(lead.createdAt || lead.submittedAt),
    bidCount: leadQuotes.length,
    bestPrice,
    acceptedVendor: acceptedQuote
      ? acceptedQuote.vendorEmail?.split("@")[0] || "Assigned Vendor"
      : null,
    acceptedPrice: acceptedQuote ? formatPrice(acceptedQuote.pricing?.totalPrice) : null,
    status: lead.status,
    label: statusMeta.label,
    tone: statusMeta.tone,
    bg: statusMeta.bg,
    detailsTo: buildTenderDetailsPath(lead.id),
    projectStatus: matchingProject?.status || null,
  };
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.15}
      >
        <Stack direction="row" spacing={1.05} alignItems="flex-start" sx={{ minWidth: 0 }}>
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

      {isSelected && item.acceptedVendor ? (
        <Box
          sx={{
            mt: 1.25,
            p: 1.1,
            borderRadius: "1rem",
            bgcolor: "#EEF4FF",
            border: "1px solid rgba(14,86,200,0.1)",
          }}
        >
          <Typography sx={{ color: "#0E56C8", fontSize: "0.72rem", fontWeight: 800 }}>
            Vendor Selected: {item.acceptedVendor}
          </Typography>
          {item.acceptedPrice ? (
            <Typography sx={{ mt: 0.15, color: "#4F5F73", fontSize: "0.68rem" }}>
              Accepted quote: {item.acceptedPrice}
            </Typography>
          ) : null}
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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={0.9} sx={{ mt: 1.3 }}>
        <Button
          component={RouterLink}
          to={item.detailsTo}
          fullWidth
          variant="outlined"
          sx={{
            minHeight: 38,
            borderRadius: "0.95rem",
            borderColor: "#D5DCE6",
            color: "#223146",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          View Details
        </Button>
      </Stack>
    </Box>
  );
}

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
            {isSelected ? (
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
            ) : null}
          </Box>
        );
      })}
    </Stack>
  );
}

export default function CustomerTendersPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  async function loadTenders(active = true, force = false) {
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
        setError("Could not load tenders. Please try again.");
      }
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
    loadTenders(active, true);

    const intervalId = window.setInterval(() => {
      loadTenders(active, true);
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const allCards = useMemo(
    () => leads.map((lead) => toTenderCard(lead, quotes, projects)),
    [leads, quotes, projects],
  );

  const activeCards = useMemo(
    () =>
      allCards.filter((card) =>
        isActiveLead(leads.find((lead) => lead.id === card.id) || {}),
      ),
    [allCards, leads],
  );

  const closedCards = useMemo(
    () =>
      allCards.filter(
        (card) => !isActiveLead(leads.find((lead) => lead.id === card.id) || {}),
      ),
    [allCards, leads],
  );

  const visibleCards = activeTab === "active" ? activeCards : closedCards;
  const totalBids = quotes.filter(
    (quote) => !["withdrawn", "rejected"].includes(quote.status),
  ).length;
  const liveTenders = leads.filter((lead) => lead.status === "open_for_quotes").length;

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
            Track your live bidding processes, review tender details, and jump to
            vendor comparison the moment bids arrive.
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

      {!error ? (
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
                leads.filter((lead) => lead.status === "quote_selected").length,
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
                {isLoading ? "-" : stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeCards.length}
        closedCount={closedCards.length}
      />

      {isLoading ? <CustomerLoadingBlock mt={0} /> : null}

      {!isLoading && error ? (
        <CustomerErrorBlock message={error} onRetry={() => loadTenders(true, true)} mt={1.2} />
      ) : null}

      {!isLoading && !error && visibleCards.length === 0 ? (
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
              <GavelRoundedIcon sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }} />
              <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
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
                Create a booking to broadcast your solar requirement to our verified
                vendor network.
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
              <CheckCircleOutlinedIcon sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }} />
              <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
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
                Tenders move here once a vendor is selected or the request is closed.
              </Typography>
            </>
          )}
        </Box>
      ) : null}

      {!isLoading && !error && visibleCards.length > 0 ? (
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
      ) : null}
    </Box>
  );
}

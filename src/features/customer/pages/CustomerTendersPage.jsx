import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";

const tabs = [
  { label: "Active", count: 4, active: true },
  { label: "Closed", count: 12, active: false },
];

const tenders = [
  {
    title: "5kW Rooftop Solar System",
    meta: "Gurgaon, Sector 45 - User Arjun Mehta",
    bids: "12",
    bestPrice: "\u20B92,85,000",
    timeRemaining: "24h left",
    status: "Bidding Live",
    statusTone: "#239654",
    statusBg: "#E8FAEF",
    timeTone: "#223146",
  },
  {
    title: "10kW Commercial Array",
    meta: "Noida, Sector 62 - User Rajesh Kumar",
    bids: "8",
    bestPrice: "\u20B95,12,000",
    timeRemaining: "3h left",
    status: "Closing Soon",
    statusTone: "#D92D20",
    statusBg: "#FFF0EE",
    timeTone: "#D92D20",
  },
  {
    title: "3kW Residential Setup",
    meta: "Bangalore, Indiranagar - User Ramesh",
    bids: "21",
    bestPrice: "\u20B91,95,000",
    timeRemaining: "2d left",
    status: "Bidding Live",
    statusTone: "#239654",
    statusBg: "#E8FAEF",
    timeTone: "#223146",
  },
  {
    title: "7kW Hybrid System",
    meta: "Pune, Baner - User Rahul",
    bids: "15",
    bestPrice: "\u20B93,40,000",
    timeRemaining: "18h left",
    status: "Bidding Live",
    statusTone: "#239654",
    statusBg: "#E8FAEF",
    timeTone: "#223146",
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toTenderCard(lead, quotes) {
  const leadQuotes = quotes.filter((quote) => String(quote.leadId) === String(lead.id));
  const bestPrice = leadQuotes.length
    ? Math.min(...leadQuotes.map((quote) => Number(quote.pricing.totalPrice)))
    : null;
  const live = lead.status === "open_for_quotes";

  return {
    id: lead.id,
    title: `${lead.property?.sanctionedLoadKw || "Solar"} kW Rooftop Solar System`,
    meta: `${lead.installationAddress.city}, ${lead.installationAddress.state} - ${lead.contact.fullName}`,
    bids: String(leadQuotes.length),
    bestPrice: bestPrice ? formatPrice(bestPrice) : "Waiting",
    timeRemaining: live ? "Live" : lead.status.replaceAll("_", " "),
    status: live ? "Bidding Live" : lead.status === "quote_selected" ? "Vendor Selected" : "Request Active",
    statusTone: live ? "#239654" : "#4F89FF",
    statusBg: live ? "#E8FAEF" : "#EEF4FF",
    timeTone: live ? "#223146" : "#4F89FF",
    to: leadQuotes.length > 0 ? "/quotes/compare" : "/tenders/live",
  };
}

function TenderSunBadge() {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 50%, #FFD44C 0%, #FFAE18 28%, #FF6A00 52%, #682000 78%, #271002 100%)",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.16), 0 10px 18px rgba(255,124,0,0.22)",
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

function TenderMetric({ label, value, valueTone = "#223146" }) {
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

export default function CustomerTendersPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTenders() {
      setIsLoading(true);
      setError("");

      try {
        const [leadResult, quoteResult] = await Promise.all([
          leadsApi.listLeads(),
          quotesApi.listQuotes(),
        ]);

        if (active) {
          setLeads(leadResult);
          setQuotes(quoteResult);
        }
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load tenders.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadTenders();

    return () => {
      active = false;
    };
  }, []);

  const tenderCards = useMemo(() => leads.map((lead) => toTenderCard(lead, quotes)), [leads, quotes]);
  const activeCount = leads.filter((lead) => lead.status !== "closed").length;
  const closedCount = leads.filter((lead) => lead.status === "closed").length;
  const tabItems = [
    { label: "Active", count: activeCount, active: true },
    { label: "Closed", count: closedCount, active: false },
  ];

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
            Track your ongoing and completed bidding processes
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
          Create New Tender
        </Button>
      </Stack>

      <Stack direction="row" spacing={2.9} sx={{ mt: 2.05, pb: 0.55 }}>
        {tabItems.map((tab) => (
          <Box
            key={tab.label}
            sx={{
              position: "relative",
              pb: 0.85,
            }}
          >
            <Typography
              sx={{
                color: tab.active ? "#223146" : "#647387",
                fontSize: "0.78rem",
                fontWeight: tab.active ? 800 : 500,
              }}
            >
              {tab.label} ({tab.count})
            </Typography>
            {tab.active && (
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
        ))}
      </Stack>

      <Box
        sx={{
          mt: 1.2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
          gap: 1.55,
        }}
      >
        {isLoading ? (
          <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : null}

        {!isLoading && error ? (
          <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
            {error}
          </Alert>
        ) : null}

        {!isLoading && !error && tenderCards.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
            No tenders yet. Create a booking to broadcast your requirement to vendors.
          </Alert>
        ) : null}

        {tenderCards.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 1.5,
              borderRadius: "1.35rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.15}
            >
              <Stack direction="row" spacing={1.05} sx={{ minWidth: 0 }}>
                <TenderSunBadge />
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
                      {item.meta}
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
                  bgcolor: item.statusBg,
                  color: item.statusTone,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {item.status}
              </Box>
            </Stack>

            <Box
              sx={{
                mt: 1.25,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                gap: 0.9,
              }}
            >
              <TenderMetric label="Bids Received" value={item.bids} />
              <TenderMetric label="Best Price" value={item.bestPrice} valueTone="#239654" />
              <TenderMetric label="Time Remaining" value={item.timeRemaining} valueTone={item.timeTone} />
            </Box>

            <Button
              component={RouterLink}
              to={item.to}
              fullWidth
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
              sx={{
                mt: 1.3,
                minHeight: 38,
                borderRadius: "0.95rem",
                bgcolor: "#E3E8EF",
                color: "#223146",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              View Bids
            </Button>
          </Box>
        ))}
      </Box>

      <Button
        sx={{
          mt: 2.35,
          mx: "auto",
          display: "flex",
          color: "#223146",
          fontSize: "0.92rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Load More Tenders
      </Button>
    </Box>
  );
}

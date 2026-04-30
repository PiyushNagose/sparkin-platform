import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import quoteAnalysisPlaceholder from "@/shared/assets/images/public/quotes/quote-analysis-placeholder.png";
import quoteBiddingBannerPlaceholder from "@/shared/assets/images/public/quotes/quote-bidding-banner-placeholder.png";
import LiveBiddingPage from "@/features/public/pages/LiveBiddingPage";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import { quotesApi } from "@/features/public/api/leadsApi";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatWindow(value) {
  const labels = {
    "2_4_weeks": "2-4 Weeks",
    "4_6_weeks": "4-6 Weeks",
    "6_8_weeks": "6-8 Weeks",
  };

  return labels[value] || "Timeline shared";
}

function toQuoteCard(quote, index) {
  const vendorName = quote.vendorEmail ? quote.vendorEmail.split("@")[0] : `Vendor ${index + 1}`;

  return {
    id: quote.id,
    vendor: vendorName,
    rating: "New",
    reviews: "Verified vendor",
    price: formatPrice(quote.pricing.totalPrice),
    note: quote.proposalNotes || "Proposal submitted for your requirement",
    badge: index === 0 ? "Latest" : "Proposal",
    badgeTone: index === 0 ? "#DDF6E8" : "#EEF3FF",
    badgeColor: index === 0 ? "#178146" : "#1A57C8",
    system: `${quote.system.sizeKw}kW System`,
    warranty: quote.system.panelType,
    delivery: formatWindow(quote.timeline.installationWindow),
    detailsTo: `/quotes/${quote.id}/confirm`,
  };
}

function QuoteCard({
  vendor,
  rating,
  reviews,
  price,
  note,
  badge,
  badgeTone,
  badgeColor,
  system,
  warranty,
  delivery,
  detailsTo,
}) {
  return (
    <Box
      sx={{
        p: 1.8,
        borderRadius: "1.35rem",
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid #E9EEF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.06)",
        height: "100%",
      }}
    >
      <Stack spacing={1.45} sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.65rem",
                bgcolor: "#10243E",
                color: "#F5B92F",
                display: "grid",
                placeItems: "center",
              }}
            >
              <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#202938",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {vendor}
              </Typography>
              <Stack direction="row" spacing={0.35} alignItems="center">
                <StarRoundedIcon sx={{ fontSize: "0.76rem", color: "#F2B12A" }} />
                <Typography
                  sx={{ color: "#495669", fontSize: "0.58rem", fontWeight: 700 }}
                >
                  {rating}
                </Typography>
                <Typography sx={{ color: "#7E899A", fontSize: "0.56rem" }}>
                  ({reviews})
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Box
            sx={{
              px: 0.65,
              py: 0.22,
              borderRadius: 999,
              bgcolor: badgeTone,
              color: badgeColor,
              fontSize: "0.46rem",
              fontWeight: 800,
              letterSpacing: 0.38,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </Box>
        </Stack>

        <Box>
          <Stack direction="row" spacing={0.5} alignItems="baseline">
            <Typography
              sx={{
                color: "#0E56C8",
                fontSize: "1.85rem",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {price}
            </Typography>
            <Typography sx={{ color: "#667084", fontSize: "0.62rem" }}>
              Total Cost
            </Typography>
          </Stack>
          <Typography sx={{ color: "#8A95A6", fontSize: "0.52rem", mt: 0.18 }}>
            {note}
          </Typography>
        </Box>

        <Grid container spacing={0.8}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 0.95, borderRadius: "0.8rem", bgcolor: "#F5F7FB" }}>
              <Typography
                sx={{
                  color: "#8C96A6",
                  fontSize: "0.46rem",
                  fontWeight: 800,
                  letterSpacing: 0.28,
                  textTransform: "uppercase",
                }}
              >
                System Size
              </Typography>
              <Typography
                sx={{ color: "#223043", fontSize: "0.64rem", fontWeight: 700, mt: 0.42 }}
              >
                {system}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 0.95, borderRadius: "0.8rem", bgcolor: "#F5F7FB" }}>
              <Typography
                sx={{
                  color: "#8C96A6",
                  fontSize: "0.46rem",
                  fontWeight: 800,
                  letterSpacing: 0.28,
                  textTransform: "uppercase",
                }}
              >
                Warranty
              </Typography>
              <Typography
                sx={{ color: "#223043", fontSize: "0.64rem", fontWeight: 700, mt: 0.42 }}
              >
                {warranty}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 0.95, borderRadius: "0.8rem", bgcolor: "#F5F7FB" }}>
              <Typography
                sx={{
                  color: "#8C96A6",
                  fontSize: "0.46rem",
                  fontWeight: 800,
                  letterSpacing: 0.28,
                  textTransform: "uppercase",
                }}
              >
                Delivery
              </Typography>
              <Typography
                sx={{ color: "#223043", fontSize: "0.64rem", fontWeight: 700, mt: 0.42 }}
              >
                {delivery}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1.1} sx={{ mt: "auto" }}>
          <Button
            component={RouterLink}
            to={detailsTo}
            fullWidth
            sx={{
              minHeight: 38,
              borderRadius: "0.8rem",
              color: "#0E56C8",
              fontWeight: 700,
              fontSize: "0.72rem",
              textTransform: "none",
            }}
          >
            View Details
          </Button>
          <Button
            component={RouterLink}
            to={detailsTo}
            fullWidth
            variant="contained"
            sx={{
              minHeight: 38,
              borderRadius: "0.8rem",
              fontWeight: 700,
              fontSize: "0.72rem",
              textTransform: "none",
              background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
              boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
            }}
          >
            Select Vendor
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function QuoteComparisonPage() {
  const [submittedQuotes, setSubmittedQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadQuotes() {
      setIsLoading(true);
      setError("");

      try {
        const result = await quotesApi.listQuotes();
        if (active) setSubmittedQuotes(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load quotes.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadQuotes();

    return () => {
      active = false;
    };
  }, []);

  const quoteCards = useMemo(() => submittedQuotes.map(toQuoteCard), [submittedQuotes]);

  if (!isLoading && !error && quoteCards.length === 0) {
    return <LiveBiddingPage />;
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.72) 0%, rgba(247,250,252,0.98) 22%, #F9FBFD 66%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack spacing={{ xs: 5.25, md: 6.5 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box sx={{ maxWidth: 450 }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#20242B",
                    ...publicTypography.heroTitle,
                    fontSize: { xs: "2.45rem", md: "3.35rem" },
                    maxWidth: 420,
                  }}
                >
                  Compare solar quotes from{" "}
                  <Box component="span" sx={{ color: "#0E56C8" }}>
                    top vendors
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    mt: 1.1,
                    color: "#667084",
                    fontSize: "0.94rem",
                    lineHeight: 1.6,
                    maxWidth: 360,
                  }}
                >
                Verified vendors submit proposals here as soon as they quote your booking request.
                </Typography>
              </Box>

              <Box
                sx={{
                  alignSelf: { xs: "flex-start", md: "flex-end" },
                  px: 0.9,
                  py: 0.32,
                  borderRadius: 999,
                  bgcolor: "#21C27B",
                  color: "white",
                  fontSize: "0.54rem",
                  fontWeight: 800,
                  letterSpacing: 0.35,
                  textTransform: "uppercase",
                }}
              >
                verified {quoteCards.length} proposal{quoteCards.length === 1 ? "" : "s"} received
              </Box>
            </Stack>

            <Box
              sx={{
                px: { xs: 2, md: 2.4 },
                py: { xs: 1.7, md: 1.9 },
                minHeight: 84,
                borderRadius: "1rem",
                backgroundImage: `linear-gradient(135deg, rgba(52,32,13,0.92) 0%, rgba(75,39,8,0.88) 45%, rgba(36,28,23,0.94) 100%), url(${quoteBiddingBannerPlaceholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 16px 30px rgba(33,22,14,0.12)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ height: "100%" }}
              >
                <Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#18B86A",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#C6A85B",
                        fontSize: "0.52rem",
                        fontWeight: 800,
                        letterSpacing: 0.45,
                        textTransform: "uppercase",
                      }}
                    >
                      Bidding In Progress
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.52)", fontSize: "0.56rem", mt: 0.25 }}
                  >
                    Real-time updates
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#D99113",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                  }}
                >
                  22h 14m 30s
                </Typography>
              </Stack>
            </Box>

            {isLoading ? (
              <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : null}

            {error ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {error} Please make sure you are logged in as the customer who created the booking.
              </Alert>
            ) : null}

            <Grid container spacing={{ xs: 2.2, md: 2.4 }}>
              {quoteCards.map((quote) => (
                <Grid key={quote.id} size={{ xs: 12, md: 6 }}>
                  <QuoteCard {...quote} />
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                p: { xs: 2.4, md: 3.2 },
                borderRadius: "1.55rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #EEF2F7",
                boxShadow: "0 18px 38px rgba(17,31,54,0.05)",
              }}
            >
              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1.35} sx={{ maxWidth: 330 }}>
                    <Typography
                      sx={{
                        color: "#202938",
                        fontSize: { xs: "1.7rem", md: "2.05rem" },
                        fontWeight: 800,
                        lineHeight: 1.12,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      Need a customized analysis for your rooftop?
                    </Typography>
                    <Typography
                      sx={{
                        color: "#667084",
                        fontSize: "0.84rem",
                        lineHeight: 1.65,
                      }}
                    >
                      Our experts can help you compare these quotes line-by-line to find hidden costs and technical advantages.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        width: "fit-content",
                        minHeight: 38,
                        px: 1.55,
                        borderRadius: "0.8rem",
                        bgcolor: "#12161F",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        textTransform: "none",
                        boxShadow: "0 12px 24px rgba(12,18,26,0.16)",
                      }}
                    >
                      Request Expert Consultation
                    </Button>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        minHeight: 210,
                        borderRadius: "1.4rem",
                        overflow: "hidden",
                        backgroundImage: `url(${quoteAnalysisPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 18px 36px rgba(17,31,54,0.12)",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 14,
                          right: 14,
                          bottom: 14,
                          px: 1.15,
                          py: 1,
                          borderRadius: "1rem",
                          bgcolor: "rgba(244,246,250,0.96)",
                          boxShadow: "0 12px 26px rgba(17,31,54,0.16)",
                        }}
                      >
                        <Stack direction="row" spacing={1.1} alignItems="center">
                          <Box
                            sx={{
                              px: 0.7,
                              py: 0.22,
                              borderRadius: 999,
                              bgcolor: "#21C27B",
                              color: "white",
                              fontSize: "0.46rem",
                              fontWeight: 800,
                              letterSpacing: 0.3,
                              textTransform: "lowercase",
                            }}
                          >
                            bot
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#7A8494",
                                fontSize: "0.44rem",
                                fontWeight: 800,
                                letterSpacing: 0.32,
                                textTransform: "uppercase",
                              }}
                            >
                              Avg. Annual Savings
                            </Typography>
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: "1.05rem",
                                fontWeight: 800,
                                lineHeight: 1.15,
                              }}
                            >
                              ₹1,14,200
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

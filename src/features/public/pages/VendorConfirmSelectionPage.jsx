import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { quotesApi } from "@/features/public/api/leadsApi";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

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

export default function VendorConfirmSelectionPage() {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadQuote() {
      setIsLoading(true);
      setError("");

      try {
        const result = await quotesApi.getQuote(quoteId);
        if (active) setQuote(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load this quote.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadQuote();

    return () => {
      active = false;
    };
  }, [quoteId]);

  const vendorName = quote?.vendorEmail ? quote.vendorEmail.split("@")[0] : "Selected Vendor";
  const metricCards = useMemo(
    () => [
      {
        icon: <SolarPowerRoundedIcon sx={{ fontSize: "0.95rem" }} />,
        label: "System Size",
        value: quote ? `${quote.system.sizeKw}kW` : "-",
      },
      {
        icon: <ShieldOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
        label: "Panel Type",
        value: quote?.system.panelType || "-",
      },
      {
        icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
        label: "Installation",
        value: quote ? formatWindow(quote.timeline.installationWindow) : "-",
      },
    ],
    [quote],
  );

  async function handleConfirm() {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await quotesApi.acceptQuote(quoteId);
      if (result.project?.id) {
        navigate(`/project/installation?projectId=${result.project.id}`, { replace: true });
        return;
      }
      navigate("/project/installation", { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not confirm this vendor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.72) 0%, rgba(247,250,252,0.98) 24%, #F9FBFD 68%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Stack spacing={{ xs: 4.4, md: 4.8 }} alignItems="center">
            <Stack spacing={1.15} alignItems="center" sx={{ maxWidth: 520, textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{
                  color: "#20242B",
                  ...publicTypography.heroTitle,
                  whiteSpace: { md: "nowrap" },
                }}
              >
                Confirm your selection
              </Typography>
              <Typography
                sx={{
                  color: "#667084",
                  ...publicTypography.body,
                  maxWidth: 420,
                }}
              >
                You&apos;re about to proceed with this vendor for your solar installation.
              </Typography>
            </Stack>

            <Box
              sx={{
                width: "100%",
                maxWidth: 760,
                p: { xs: 2.3, md: 2.8 },
                borderRadius: "1.65rem",
                bgcolor: "rgba(255,255,255,0.95)",
                border: "1px solid #E9EEF5",
                boxShadow: "0 20px 40px rgba(17,31,54,0.07)",
              }}
            >
              {isLoading ? (
                <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
                  <CircularProgress />
                </Box>
              ) : null}

              {!isLoading && error ? (
                <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                  {error}
                </Alert>
              ) : null}

              {!isLoading && quote ? (
                <Stack spacing={{ xs: 2.2, md: 2.45 }}>
                  <Grid container spacing={{ xs: 1.6, md: 2 }} alignItems="center">
                    <Grid size={{ xs: 12, md: 7.2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "0.95rem",
                            bgcolor: "#18498E",
                            color: "white",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.52rem",
                            fontWeight: 800,
                            textAlign: "center",
                            lineHeight: 1.2,
                            boxShadow: "0 12px 24px rgba(24,73,142,0.22)",
                          }}
                        >
                          {vendorName.slice(0, 4).toUpperCase()}
                        </Box>

                        <Box>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={0.9}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            flexWrap="wrap"
                          >
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: { xs: "1.25rem", md: "1.45rem" },
                                fontWeight: 800,
                                lineHeight: 1.18,
                              }}
                            >
                              {vendorName}
                            </Typography>
                            <Chip
                              label="Selected Quote"
                              sx={{
                                height: 23,
                                px: 0.2,
                                borderRadius: 999,
                                bgcolor: "#39D290",
                                color: "white",
                                fontSize: "0.54rem",
                                fontWeight: 800,
                                letterSpacing: 0.34,
                                textTransform: "uppercase",
                              }}
                            />
                          </Stack>
                          <Stack direction="row" spacing={0.25} alignItems="center" sx={{ mt: 0.45 }}>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <StarRoundedIcon key={index} sx={{ fontSize: "0.82rem", color: "#F2B12A" }} />
                            ))}
                            <Typography
                              sx={{ color: "#2B3545", fontSize: "0.78rem", fontWeight: 700, ml: 0.35 }}
                            >
                              Verified
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4.8 }}>
                      <Stack
                        spacing={0.45}
                        alignItems={{ xs: "flex-start", md: "flex-end" }}
                        sx={{ textAlign: { xs: "left", md: "right" } }}
                      >
                        <Typography
                          sx={{
                            color: "#8A93A4",
                            fontSize: "0.58rem",
                            fontWeight: 800,
                            letterSpacing: 0.4,
                            textTransform: "uppercase",
                          }}
                        >
                          Total Project Value
                        </Typography>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: { xs: "1.9rem", md: "2.4rem" },
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: "-0.045em",
                          }}
                        >
                          {formatPrice(quote.pricing.totalPrice)}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ xs: 1.35, md: 1.5 }}>
                    {metricCards.map((card) => (
                      <Grid key={card.label} size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            p: 1.55,
                            borderRadius: "1.15rem",
                            bgcolor: "#F7F9FC",
                            border: "1px solid #EBF0F6",
                            height: "100%",
                          }}
                        >
                          <Stack spacing={0.78}>
                            <Stack direction="row" spacing={0.65} alignItems="center">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "0.7rem",
                                  bgcolor: "#EEF4FF",
                                  color: "#5C6D83",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                {card.icon}
                              </Box>
                              <Typography
                                sx={{
                                  color: "#5E6879",
                                  fontSize: "0.62rem",
                                  fontWeight: 800,
                                  letterSpacing: 0.34,
                                  textTransform: "uppercase",
                                }}
                              >
                                {card.label}
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: { xs: "1.45rem", md: "1.7rem" },
                                fontWeight: 800,
                                lineHeight: 1.05,
                                textTransform: "capitalize",
                              }}
                            >
                              {card.value}
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box
                    sx={{
                      px: { xs: 1.3, md: 1.5 },
                      py: { xs: 1.2, md: 1.35 },
                      borderRadius: "1rem",
                      bgcolor: "#F1F5FB",
                    }}
                  >
                    <Stack direction="row" spacing={1.05} alignItems="flex-start">
                      <InfoOutlinedIcon sx={{ mt: 0.08, fontSize: "1rem", color: "#0E56C8" }} />
                      <Typography
                        sx={{
                          color: "#364252",
                          fontSize: "0.78rem",
                          lineHeight: 1.7,
                          maxWidth: 560,
                        }}
                      >
                        Once confirmed, this quote will be marked accepted, competing quotes for
                        the same booking will be closed, and the project will move to installation.
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ) : null}
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.4}
              sx={{
                width: "100%",
                maxWidth: 540,
                justifyContent: "center",
                alignItems: "center",
                pt: 0.25,
              }}
            >
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!quote || isSubmitting}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: 200,
                  minHeight: 46,
                  px: 2.1,
                  borderRadius: "0.9rem",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                  boxShadow: "0 14px 24px rgba(14,86,200,0.18)",
                }}
              >
                {isSubmitting ? "Confirming..." : "Confirm & Proceed"}
              </Button>
              <Button
                component={RouterLink}
                to="/quotes/compare"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: 164,
                  minHeight: 46,
                  px: 2,
                  borderRadius: "0.9rem",
                  bgcolor: "#EFF2F6",
                  color: "#2A3444",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Back to Compare
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

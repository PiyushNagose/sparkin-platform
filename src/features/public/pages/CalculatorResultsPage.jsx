import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { calculatorStorage } from "@/features/public/calculator/calculatorStorage";
import resultBannerImage from "@/shared/assets/images/public/calculator/calculator-results-banner-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing, publicTypography } from "@/features/public/pages/publicPageStyles";

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function MetricCard({ title, value, text, icon, highlight = false }) {
  return (
    <Box
      sx={{
        p: { xs: 1.85, md: 2.05 },
        height: "100%",
        borderRadius: "1rem",
        bgcolor: highlight ? "#EEF8ED" : "rgba(255,255,255,0.96)",
        border: "1px solid rgba(220,228,239,0.96)",
        boxShadow: "0 16px 34px rgba(20,34,56,0.06)",
      }}
    >
      <Box sx={{ width: 34, height: 34, borderRadius: "0.8rem", bgcolor: highlight ? "#DDF5E9" : "#EEF4FF", color: highlight ? "#0A7A3B" : "#165BCA", display: "grid", placeItems: "center", mb: 1.35 }}>
        {icon}
      </Box>
      <Typography sx={{ color: "#6F7D8F", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</Typography>
      <Typography sx={{ mt: 0.6, color: "#18253A", fontSize: "1.55rem", fontWeight: 800, lineHeight: 1.05 }}>{value}</Typography>
      <Typography sx={{ mt: 0.75, color: "#6C7990", fontSize: "0.82rem", lineHeight: 1.6 }}>{text}</Typography>
    </Box>
  );
}

export default function CalculatorResultsPage() {
  const navigate = useNavigate();
  const estimate = calculatorStorage.getEstimate();

  useEffect(() => {
    if (!estimate) navigate("/calculator", { replace: true });
  }, [estimate, navigate]);

  if (!estimate) return null;

  const isCommercial = estimate.input.propertyType === "commercial";
  const subsidyText = isCommercial
    ? "Commercial estimate excludes residential subsidy and focuses on investment payback."
    : `Includes estimated central subsidy of ${formatMoney(estimate.investment.subsidy)}.`;

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background: "radial-gradient(circle at top center, rgba(214,229,246,0.84) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.compactContainer}>
          <Stack spacing={{ xs: 2.6, md: 3.15 }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2.2}>
              <Box>
                <Typography variant="h1" sx={{ ...publicTypography.pageTitle, color: "#18253A" }}>
                  Your Solar Potential
                </Typography>
                <Typography sx={{ mt: 0.8, maxWidth: 560, color: "#697790", ...publicTypography.body }}>
                  Estimate for {estimate.input.city}, {estimate.serviceability.stateName} based on a monthly bill of {formatMoney(estimate.input.monthlyBill)}.
                </Typography>
              </Box>
              <Button component={RouterLink} to="/booking" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: { md: "center" }, minHeight: 44, px: 2.2, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontWeight: 800, textTransform: "none" }}>
                Get Vendor Quotes
              </Button>
            </Stack>

            <Grid container spacing={{ xs: 2, md: 2.1 }} alignItems="stretch">
              <Grid size={{ xs: 12, md: 8.2 }}>
                <Box sx={{ minHeight: 230, p: { xs: 2.35, md: 2.75 }, borderRadius: "1.2rem", bgcolor: "rgba(255,255,255,0.95)", border: "1px solid rgba(220,228,239,0.96)", boxShadow: "0 18px 46px rgba(20,34,56,0.08)", position: "relative", overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", top: -18, right: 24, width: 170, height: 170, background: "radial-gradient(circle, rgba(245,239,120,0.9) 0%, rgba(245,239,120,0) 70%)" }} />
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ px: 0.95, py: 0.34, borderRadius: 999, bgcolor: "#18BF73", color: "white", fontSize: "0.54rem", fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", display: "inline-flex" }}>
                      Estimated Savings
                    </Box>

                    <Typography sx={{ mt: 1.1, color: "#0E56C8", fontWeight: 800, fontSize: { xs: "2rem", md: "2.55rem" }, lineHeight: 1, letterSpacing: "-0.05em" }}>
                      {formatMoney(estimate.savings.monthly)}/month
                    </Typography>
                    <Typography sx={{ mt: 0.45, color: "#5E6C81", fontSize: "0.86rem", lineHeight: 1.58 }}>
                      First-year annual savings estimated at {formatMoney(estimate.savings.annual)}.
                    </Typography>

                    <Grid container spacing={{ xs: 1.4, md: 1.6 }} sx={{ mt: 2.55 }}>
                      {[
                        ["System Size", `${estimate.system.recommendedSizeKw} kW`],
                        ["Roof Area", `${formatNumber(estimate.system.requiredRoofAreaSqFt)} sq. ft.`],
                        ["Payback", `${estimate.savings.paybackYears || "-"} years`],
                        ["Panels", `${estimate.system.panelCount} modules`],
                      ].map(([label, value]) => (
                        <Grid key={label} size={{ xs: 6, sm: 3 }}>
                          <Typography sx={{ color: "#7B889B", fontSize: "0.6rem", fontWeight: 700 }}>{label}</Typography>
                          <Typography sx={{ mt: 0.4, color: "#19263A", fontWeight: 800, fontSize: "1rem" }}>{value}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 3.7 }}>
                <Stack spacing={{ xs: 2, md: 2.2 }} sx={{ height: "100%" }}>
                  <Box sx={{ p: { xs: 1.95, md: 2.1 }, borderRadius: "1rem", background: "linear-gradient(180deg, #066728 0%, #05571F 100%)", color: "white", minHeight: 148 }}>
                    <Stack direction="row" spacing={0.72} alignItems="center">
                      <SpaRoundedIcon sx={{ fontSize: "0.96rem" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.96rem" }}>Eco-Impact</Typography>
                    </Stack>
                    <Typography sx={{ mt: 0.95, color: "rgba(238,248,241,0.82)", fontSize: "0.75rem", lineHeight: 1.56 }}>
                      Your system can offset about {formatNumber(estimate.impact.co2OffsetKgYear)} kg CO2 yearly.
                    </Typography>
                    <Typography sx={{ mt: 1.05, fontWeight: 800, fontSize: { xs: "1.85rem", md: "2rem" }, lineHeight: 1 }}>
                      {formatNumber(estimate.impact.treesEquivalent)} Trees
                    </Typography>
                  </Box>

                  <Box sx={{ p: { xs: 1.95, md: 2.1 }, borderRadius: "1rem", bgcolor: "rgba(255,255,255,0.95)", border: "1px solid rgba(220,228,239,0.96)", boxShadow: "0 18px 46px rgba(20,34,56,0.06)", minHeight: 124, textAlign: "center" }}>
                    <Box sx={{ width: 74, height: 74, mx: "auto", borderRadius: "50%", border: "4px solid #C7D22A", display: "grid", placeItems: "center", color: "#233040", fontWeight: 800, fontSize: "1.05rem" }}>
                      {estimate.system.energyOffsetPercent}%
                    </Box>
                    <Typography sx={{ mt: 1.05, color: "#223041", fontWeight: 700, fontSize: "0.94rem" }}>Energy Offset</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <MetricCard title="Annual Savings" value={formatMoney(estimate.savings.annual)} text="Estimated first-year bill reduction." icon={<CreditCardRoundedIcon sx={{ fontSize: "0.92rem" }} />} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <MetricCard title="Lifetime Savings" value={formatMoney(estimate.savings.lifetime)} text="25-year projection with degradation and tariff inflation." icon={<TrendingUpRoundedIcon sx={{ fontSize: "0.92rem" }} />} highlight />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <MetricCard title="Net Cost" value={formatMoney(estimate.investment.netCost)} text={subsidyText} icon={<ReceiptLongRoundedIcon sx={{ fontSize: "0.92rem" }} />} />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2.2, borderRadius: "1rem", bgcolor: "rgba(255,255,255,0.95)", border: "1px solid rgba(220,228,239,0.96)" }}>
                  <Typography sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}>Investment Breakdown</Typography>
                  <Stack spacing={1.1} sx={{ mt: 1.6 }}>
                    {[
                      ["Total plant cost", formatMoney(estimate.investment.grossCost)],
                      ["Estimated subsidy", `-${formatMoney(estimate.investment.subsidy)}`],
                      ["Net cost", formatMoney(estimate.investment.netCost)],
                      ["Estimated EMI", `${formatMoney(estimate.investment.emi)} / month`],
                    ].map(([label, value]) => (
                      <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                        <Typography sx={{ color: "#6F7D8F", fontSize: "0.84rem" }}>{label}</Typography>
                        <Typography sx={{ color: "#18253A", fontSize: "0.86rem", fontWeight: 800 }}>{value}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ minHeight: "100%", borderRadius: "1rem", overflow: "hidden", backgroundImage: `linear-gradient(180deg, rgba(5,16,28,0.05) 0%, rgba(8,17,28,0.72) 86%), url(${resultBannerImage})`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
                  <Box sx={{ p: { xs: 2.2, md: 2.55 }, color: "white", maxWidth: 420 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.28rem", md: "1.5rem" } }}>Ready for a verified quote?</Typography>
                    <Typography sx={{ mt: 0.7, color: "rgba(239,244,249,0.84)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                      Calculator estimates are indicative. Final pricing depends on roof structure, shadow, DISCOM approvals, equipment brand, and site survey.
                    </Typography>
                    <Button component={RouterLink} to="/booking" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 1.2, color: "white", px: 0, fontWeight: 800, textTransform: "none" }}>
                      Start booking
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ p: 1.6, borderRadius: "1rem", bgcolor: "#F3F7FC", border: "1px solid rgba(220,228,239,0.96)" }}>
              <Stack direction="row" spacing={1.1} alignItems="flex-start">
                <AccountBalanceRoundedIcon sx={{ color: "#0E56C8", fontSize: "1.05rem", mt: 0.15 }} />
                <Typography sx={{ color: "#627084", fontSize: "0.78rem", lineHeight: 1.65 }}>
                  Assumptions: tariff {formatMoney(estimate.assumptions.tariffPerUnit)}/unit, {estimate.assumptions.solarYieldPerKwYear} kWh/kW/year yield, 1% annual panel degradation, and 3% annual electricity inflation.
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

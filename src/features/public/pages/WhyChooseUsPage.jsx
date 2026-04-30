import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import serviceSystemImage from "@/shared/assets/images/public/support/service-system-placeholder.png";

const proofStats = [
  { value: "350+", label: "verified installers" },
  { value: "4.8/5", label: "average customer rating" },
  { value: "72 hrs", label: "quote comparison window" },
  { value: "100+", label: "cities covered" },
];

const reasons = [
  {
    title: "Verified vendor network",
    text: "Every installer is checked for certifications, past delivery, service capability, and transparent pricing behavior.",
    icon: <VerifiedOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#EAF1FF", fg: "#0E56C8" },
  },
  {
    title: "Clear cost comparisons",
    text: "Compare quotes side by side with equipment, warranties, subsidies, timelines, and service inclusions laid out clearly.",
    icon: <CurrencyRupeeRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F4F7A8", fg: "#707600" },
  },
  {
    title: "Guided project support",
    text: "From roof assessment to net metering, Sparkin keeps every milestone visible so your solar project stays on track.",
    icon: <HandshakeOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#DDF8E8", fg: "#12A765" },
  },
];

const promises = [
  "No hidden platform charges during quote discovery",
  "Subsidy and financing guidance before commitment",
  "Installer accountability through milestone tracking",
  "Post-installation support for service and maintenance",
];

export default function WhyChooseUsPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 64%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Grid
          container
          spacing={{ xs: 3.2, md: 4.2 }}
          alignItems="center"
          sx={{ mb: { xs: 5.8, md: 6.8 } }}
          className={layoutStyles.revealUp}
        >
          <Grid size={{ xs: 12, md: 6.4 }}>
            <Chip
              label="Why Sparkin"
              sx={{
                height: 30,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#566000",
                fontSize: "0.64rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                mt: 1.25,
                ...publicTypography.heroTitle,
                color: "#18253A",
                maxWidth: 720,
              }}
            >
              Solar decisions made
              <Box component="span" sx={{ color: "#0E56C8" }}>
                {" "}
                transparent, trusted, and simple.
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 540,
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
              }}
            >
              Sparkin brings verified installers, competitive quotes, financing
              support, and lifetime service into one clean workflow for homes and
              businesses.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
              <Button
                component={RouterLink}
                to="/calculator"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 46,
                  px: 2.4,
                  borderRadius: "0.72rem",
                  fontSize: "0.86rem",
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                  boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                }}
              >
                Calculate Savings
              </Button>
              <Button
                component={RouterLink}
                to="/vendors"
                variant="contained"
                sx={{
                  minHeight: 46,
                  px: 2.2,
                  borderRadius: "0.72rem",
                  bgcolor: "white",
                  color: "#18253A",
                  border: "1px solid #DCE6F3",
                  boxShadow: "0 10px 24px rgba(16,29,51,0.05)",
                  fontSize: "0.86rem",
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Explore Vendors
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5.6 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                ml: { md: "auto" },
                maxWidth: 470,
                minHeight: { xs: 330, md: 390 },
                borderRadius: "2rem",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(6,19,47,0.08) 0%, rgba(6,19,47,0.48) 100%), url(${serviceSystemImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 24px 52px rgba(16,29,51,0.16)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: 24,
                  p: 2.2,
                  borderRadius: "1.3rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  boxShadow: "0 14px 30px rgba(12,29,56,0.18)",
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "1rem",
                      bgcolor: "#EAF1FF",
                      color: "#0E56C8",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <ShieldOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#18253A", fontWeight: 800 }}>
                      Protected solar journey
                    </Typography>
                    <Typography sx={{ mt: 0.3, color: "#6E7B8E", fontSize: "0.82rem" }}>
                      From quote validation to service tracking.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {proofStats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Box
                className={layoutStyles.interactiveSurface}
                sx={{
                  p: { xs: 1.5, md: 1.8 },
                  borderRadius: "1.15rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "#0E56C8", fontSize: { xs: "1.25rem", md: "1.55rem" }, fontWeight: 800 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ mt: 0.45, color: "#6E7B8E", fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2, md: 2.4 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {reasons.map((reason) => (
            <Grid key={reason.title} size={{ xs: 12, md: 4 }}>
              <Box
                className={`${layoutStyles.interactiveSurface} ${layoutStyles.revealUpSlow}`}
                sx={{
                  height: "100%",
                  p: { xs: 2.2, md: 2.6 },
                  minHeight: 244,
                  borderRadius: "1.5rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 14px 32px rgba(16,29,51,0.06)",
                }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: "0.9rem", bgcolor: reason.tone.bg, color: reason.tone.fg, display: "grid", placeItems: "center", mb: 1.55 }}>
                  {reason.icon}
                </Box>
                <Typography sx={{ color: "#18253A", fontSize: "1.1rem", fontWeight: 800 }}>
                  {reason.title}
                </Typography>
                <Typography sx={{ mt: 1, color: "#6E7B8E", fontSize: "0.9rem", lineHeight: 1.78 }}>
                  {reason.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2.5, md: 3.5 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                height: "100%",
                p: { xs: 2.5, md: 3.2 },
                borderRadius: "1.8rem",
                background: "linear-gradient(180deg, #121C32 0%, #182641 100%)",
                color: "white",
                boxShadow: "0 22px 46px rgba(15,22,33,0.18)",
              }}
            >
              <InsightsOutlinedIcon sx={{ color: "#DDF509", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.8, fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
                Built for confident solar comparison.
              </Typography>
              <Typography sx={{ mt: 1.25, color: "rgba(235,241,248,0.72)", fontSize: "0.92rem", lineHeight: 1.8 }}>
                We translate technical proposals into clear choices, helping you
                understand generation, payback, brand quality, and service risk.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                height: "100%",
                p: { xs: 2.4, md: 3.2 },
                borderRadius: "1.8rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(223,231,241,0.92)",
              }}
            >
              <Typography sx={{ color: "#18253A", fontSize: "1.25rem", fontWeight: 800 }}>
                The Sparkin promise
              </Typography>
              <Grid container spacing={1.5} sx={{ mt: 2.2 }}>
                {promises.map((promise) => (
                  <Grid key={promise} size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1.1} alignItems="flex-start">
                      <EnergySavingsLeafOutlinedIcon sx={{ mt: 0.15, color: "#13C784", fontSize: "1rem" }} />
                      <Typography sx={{ color: "#4E5A6F", fontSize: "0.9rem", lineHeight: 1.65, fontWeight: 700 }}>
                        {promise}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

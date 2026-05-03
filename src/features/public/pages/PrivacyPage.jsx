import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";

const dataUsageCards = [
  {
    title: "Performance Optimization",
    text: "Using historical generation data to predict future yields and suggest panel maintenance schedules.",
  },
  {
    title: "Service Maintenance",
    text: "Proactively monitoring your hardware to prevent downtime and ensure maximum energy efficiency.",
  },
];

const securityItems = [
  { title: "AES-256 Encryption", icon: <LockOutlinedIcon sx={{ fontSize: "1rem" }} /> },
  { title: "SOC2 Compliant", icon: <Inventory2OutlinedIcon sx={{ fontSize: "1rem" }} /> },
  { title: "Continuous Audits", icon: <ShieldOutlinedIcon sx={{ fontSize: "1rem" }} /> },
];

const rightsCards = [
  { title: "The Right to Access", text: "Download a full archive of your data at any time." },
  { title: "The Right to Rectify", text: "Update inaccurate personal or installation details instantly." },
  { title: "The Right to Erasure", text: "Request permanent deletion of your account and related metadata." },
  { title: "The Right to Object", text: "Withdraw consent for specific non-essential data processing." },
];

export default function PrivacyPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={{ xs: 2.2, md: 3.2 }}
          sx={{ mb: { xs: 5.6, md: 6.6 } }}
          className={layoutStyles.revealUp}
        >
          <Box sx={{ maxWidth: 660 }}>
            <Box
              sx={{
                width: "fit-content",
                px: 0.75,
                py: 0.32,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#566000",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Privacy & Safety
            </Box>

            <Typography
              variant="h1"
              sx={{
                mt: 1.2,
                ...publicTypography.heroTitle,
                color: "#18253A",
              }}
            >
              Privacy Policy
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#6E7B8E",
                ...publicTypography.body,
                maxWidth: { xs: "100%", md: 460 },
              }}
            >
              Your privacy is our priority. Learn how we handle and protect your
              data with atmospheric precision.
            </Typography>
          </Box>

          <Typography
            sx={{
              pt: { xs: 0.4, md: 2.1 },
              color: "#9AA4B4",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
            }}
          >
            Last Updated: October 24, 2024
          </Typography>
        </Stack>

        <Stack spacing={{ xs: 4.6, md: 5.8 }}>
          <Box>
            <Typography sx={{ color: "#18253A", fontSize: { xs: "1.35rem", md: "1.55rem" }, fontWeight: 800 }}>
              Information Collected
            </Typography>
            <Typography
              sx={{
                mt: 1.65,
                color: "#6E7B8E",
                fontSize: { xs: "0.88rem", md: "0.92rem" },
                lineHeight: 1.88,
                maxWidth: 1040,
              }}
            >
              To provide our solar management services, Sparkin Solar collects
              information that identifies, relates to, or could reasonably be
              linked with you. This data helps us optimize your energy output and
              manage your hardware infrastructure effectively.
            </Typography>

            <Stack spacing={{ xs: 1.25, md: 1.35 }} sx={{ mt: 2.35, maxWidth: 1080 }}>
              {[
                "Personal Information: Name, email address, billing information, and physical address associated with solar installations.",
                "Technical Solar Data: Real-time power generation metrics, panel health status, and regional meteorological conditions.",
                "Usage Metadata: Information about how you interact with our SaaS platform, including access times and feature preferences.",
              ].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "#304054",
                    fontSize: { xs: "0.86rem", md: "0.9rem" },
                    lineHeight: 1.82,
                    pl: 2.1,
                    position: "relative",
                    "&::before": {
                      content: '"-"',
                      position: "absolute",
                      left: 0,
                      top: -1,
                      color: "#0E56C8",
                      fontSize: "0.82rem",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ color: "#18253A", fontSize: { xs: "1.35rem", md: "1.55rem" }, fontWeight: 800 }}>
              Data Usage
            </Typography>
            <Typography
              sx={{
                mt: 1.35,
                color: "#6E7B8E",
                fontSize: { xs: "0.88rem", md: "0.92rem" },
                lineHeight: 1.86,
                maxWidth: 760,
              }}
            >
              We process your information under the principle of minimal necessity.
              Primary uses include:
            </Typography>

            <Grid container spacing={{ xs: 2.1, md: 2.5 }} sx={{ mt: 1.9 }}>
              {dataUsageCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                  <Box
                    className={layoutStyles.interactiveSurface}
                    sx={{
                      p: { xs: 1.7, md: 2 },
                      borderRadius: "1rem",
                      bgcolor: "rgba(255,255,255,0.95)",
                      border: "1px solid rgba(229,235,243,0.92)",
                      boxShadow: "0 12px 28px rgba(16,29,51,0.04)",
                    }}
                  >
                    <Typography sx={{ color: "#18253A", fontSize: { xs: "0.86rem", md: "0.9rem" }, fontWeight: 800 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ mt: 0.75, color: "#6E7B8E", fontSize: { xs: "0.8rem", md: "0.84rem" }, lineHeight: 1.76 }}>
                      {card.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography sx={{ color: "#18253A", fontSize: { xs: "1.35rem", md: "1.55rem" }, fontWeight: 800 }}>
              Data Sharing
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                color: "#6E7B8E",
                fontSize: { xs: "0.88rem", md: "0.92rem" },
                lineHeight: 1.86,
                maxWidth: 1040,
              }}
            >
              Sparkin Solar does not sell your personal data to third parties. We
              share information only with trusted partners necessary for service
              delivery.
            </Typography>
            <Typography sx={{ mt: 1.2, color: "#304054", fontSize: { xs: "0.86rem", md: "0.9rem" }, lineHeight: 1.84 }}>
              Utility Partners: Information required to synchronize your solar feed
              with the local grid infrastructure.
            </Typography>
            <Typography sx={{ mt: 0.85, color: "#304054", fontSize: { xs: "0.86rem", md: "0.9rem" }, lineHeight: 1.84 }}>
              Service Providers: Cloud hosting and analytics partners who operate
              under strict non-disclosure and data protection agreements.
            </Typography>

            <Box
              sx={{
                mt: 2.35,
                p: { xs: 1.2, md: 1.35 },
                borderRadius: "0.95rem",
                bgcolor: "#EEF2F7",
                borderLeft: "3px solid #C8D1DD",
              }}
            >
              <Typography sx={{ color: "#506073", fontSize: { xs: "0.78rem", md: "0.82rem" }, lineHeight: 1.74 }}>
                "We treat your energy footprint with the same sanctity as your financial records."
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ color: "#18253A", fontSize: { xs: "1.35rem", md: "1.55rem" }, fontWeight: 800 }}>
              Security Measures
            </Typography>
            <Typography
              sx={{
                mt: 1.35,
                color: "#6E7B8E",
                fontSize: { xs: "0.88rem", md: "0.92rem" },
                lineHeight: 1.86,
                maxWidth: 900,
              }}
            >
              We employ enterprise-grade security protocols to safeguard your
              atmospheric and personal data:
            </Typography>

            <Grid container spacing={{ xs: 2.2, md: 2.7 }} sx={{ mt: 1.9 }}>
              {securityItems.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <Box className={layoutStyles.interactiveSurface} sx={{ textAlign: "center", py: { xs: 0.5, md: 1 }, borderRadius: "1rem" }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "0.95rem",
                        bgcolor: "#EFF4FF",
                        color: "#0E56C8",
                        display: "grid",
                        placeItems: "center",
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography sx={{ color: "#18253A", fontSize: { xs: "0.8rem", md: "0.84rem" }, fontWeight: 800 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography sx={{ color: "#18253A", fontSize: { xs: "1.35rem", md: "1.55rem" }, fontWeight: 800 }}>
              User Rights
            </Typography>
            <Typography
              sx={{
                mt: 1.35,
                color: "#6E7B8E",
                fontSize: { xs: "0.88rem", md: "0.92rem" },
                lineHeight: 1.86,
                maxWidth: 900,
              }}
            >
              Regardless of your geographic location, Sparkin Solar offers universal
              privacy rights to all users:
            </Typography>

            <Grid container spacing={{ xs: 2.15, md: 2.5 }} sx={{ mt: 2 }}>
              {rightsCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                  <Box
                    className={layoutStyles.interactiveSurface}
                    sx={{
                      p: { xs: 1.6, md: 1.9 },
                      borderRadius: "1rem",
                      bgcolor: "rgba(248,250,253,0.92)",
                      border: "1px solid rgba(230,236,244,0.9)",
                    }}
                  >
                    <Typography sx={{ color: "#18253A", fontSize: { xs: "0.86rem", md: "0.9rem" }, fontWeight: 800 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ mt: 0.72, color: "#6E7B8E", fontSize: { xs: "0.8rem", md: "0.84rem" }, lineHeight: 1.76 }}>
                      {card.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}


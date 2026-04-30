import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import serviceNetworkImage from "@/shared/assets/images/public/support/service-network-placeholder.png";
import quoteAnalysisImage from "@/shared/assets/images/public/quotes/quote-analysis-placeholder.png";

const supportCards = [
  {
    title: "Contact Us",
    text: "Reach our solar experts for project questions, vendor support, financing guidance, or service help.",
    href: "/contact",
    action: "Talk to support",
    icon: <ContactSupportOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#EAF1FF", fg: "#0E56C8" },
  },
  {
    title: "FAQs",
    text: "Get quick answers about installation timelines, savings, subsidies, maintenance, and quote comparison.",
    href: "/faq",
    action: "Read answers",
    icon: <HelpOutlineRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#DDF8E8", fg: "#12A765" },
  },
  {
    title: "Terms",
    text: "Understand platform responsibilities, bookings, vendor agreements, payments, and service boundaries.",
    href: "/terms",
    action: "View terms",
    icon: <GavelRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F4F7A8", fg: "#707600" },
  },
  {
    title: "Privacy",
    text: "Learn how Sparkin handles personal information, solar data, security controls, and user rights.",
    href: "/privacy",
    action: "View policy",
    icon: <LockOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#EEF4FF", fg: "#285DDE" },
  },
];

const resourceHighlights = [
  "Solar quote comparison guides",
  "Subsidy and documentation support",
  "Project milestone explanations",
  "Post-install service best practices",
];

const trustItems = [
  { value: "2 hrs", label: "support response target" },
  { value: "24/7", label: "project status visibility" },
  { value: "4", label: "key support sections" },
];

export default function ResourcesPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageYCompact,
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
          <Grid size={{ xs: 12, md: 6.3 }}>
            <Chip
              label="Resources"
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
                maxWidth: 760,
              }}
            >
              Everything you need to move through solar with confidence.
            </Typography>
            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 560,
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
              }}
            >
              Find support, answers, legal details, privacy information, and
              practical solar learning resources in one clean hub.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 46,
                  px: 2.3,
                  borderRadius: "0.72rem",
                  fontSize: "0.86rem",
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                  boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                }}
              >
                Contact Support
              </Button>
              <Button
                component={RouterLink}
                to="/articles"
                variant="contained"
                sx={{
                  minHeight: 46,
                  px: 2.1,
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
                Read Articles
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5.7 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                minHeight: { xs: 320, md: 390 },
                borderRadius: "2rem",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.08) 0%, rgba(7,22,55,0.5) 100%), url(${serviceNetworkImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 24px 52px rgba(16,29,51,0.14)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: 24,
                  p: 2.15,
                  borderRadius: "1.3rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  boxShadow: "0 14px 30px rgba(12,29,56,0.18)",
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
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
                    <SupportAgentOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#18253A", fontWeight: 800 }}>
                      Support hub online
                    </Typography>
                    <Typography sx={{ mt: 0.25, color: "#6E7B8E", fontSize: "0.82rem" }}>
                      Guidance across buying, service, and policy.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {trustItems.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }}>
              <Box
                className={layoutStyles.interactiveSurface}
                sx={{
                  p: { xs: 1.8, md: 2.1 },
                  borderRadius: "1.25rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "#0E56C8", fontSize: { xs: "1.45rem", md: "1.8rem" }, fontWeight: 800 }}>
                  {item.value}
                </Typography>
                <Typography sx={{ mt: 0.4, color: "#6E7B8E", fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2, md: 2.4 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {supportCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, md: 6 }}>
              <Box
                component={RouterLink}
                to={card.href}
                className={`${layoutStyles.interactiveSurface} ${layoutStyles.revealUpSlow}`}
                sx={{
                  height: "100%",
                  minHeight: 220,
                  p: { xs: 2.15, md: 2.45 },
                  borderRadius: "1.45rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 12px 28px rgba(16,29,51,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                }}
              >
                <Box sx={{ width: 40, height: 40, borderRadius: "0.95rem", bgcolor: card.tone.bg, color: card.tone.fg, display: "grid", placeItems: "center", mb: 1.35 }}>
                  {card.icon}
                </Box>
                <Typography sx={{ color: "#18253A", fontSize: "1.12rem", fontWeight: 800 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ mt: 0.85, color: "#6E7B8E", fontSize: "0.9rem", lineHeight: 1.74, flex: 1 }}>
                  {card.text}
                </Typography>
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 1.5, color: "#0E56C8" }}>
                  <Typography sx={{ fontSize: "0.84rem", fontWeight: 800 }}>
                    {card.action}
                  </Typography>
                  <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
                </Stack>
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
                p: { xs: 2.5, md: 3 },
                borderRadius: "1.8rem",
                background: "linear-gradient(180deg, #121C32 0%, #182641 100%)",
                color: "white",
                boxShadow: "0 22px 46px rgba(15,22,33,0.18)",
              }}
            >
              <MenuBookOutlinedIcon sx={{ color: "#DDF509", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.55, fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                Practical knowledge for every solar step.
              </Typography>
              <Typography sx={{ mt: 1.05, color: "rgba(235,241,248,0.72)", fontSize: "0.9rem", lineHeight: 1.76 }}>
                Use this page as a starting point for support, education,
                marketplace rules, and data safety.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                minHeight: 330,
                height: "100%",
                p: { xs: 2.25, md: 2.8 },
                borderRadius: "1.8rem",
                backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 48%, rgba(255,255,255,0.18) 100%), url(${quoteAnalysisImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(223,231,241,0.92)",
              }}
            >
              <ArticleOutlinedIcon sx={{ color: "#0E56C8", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.45, color: "#18253A", fontSize: { xs: "1.45rem", md: "1.9rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.12, maxWidth: 430 }}>
                Resource checklist
              </Typography>
              <Grid container spacing={1.2} sx={{ mt: 2.1, maxWidth: 560 }}>
                {resourceHighlights.map((item) => (
                  <Grid key={item} size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1.2, borderRadius: "0.9rem", bgcolor: "rgba(255,255,255,0.82)", border: "1px solid #E8EEF6" }}>
                      <VerifiedUserOutlinedIcon sx={{ color: "#13C784", fontSize: "1rem" }} />
                      <Typography sx={{ color: "#4E5A6F", fontSize: "0.82rem", fontWeight: 800 }}>
                        {item}
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

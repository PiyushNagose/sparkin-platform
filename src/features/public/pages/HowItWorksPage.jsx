import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { Link as RouterLink } from "react-router-dom";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import quoteBiddingImage from "@/shared/assets/images/public/quotes/quote-bidding-banner-placeholder.png";

const journeySteps = [
  {
    step: "01",
    title: "Request",
    text: "Share your roof and power details.",
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    step: "02",
    title: "Broadcast",
    text: "Matched vendors receive your brief.",
    icon: <NotificationsActiveRoundedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#6C7A00",
    bg: "#F1F7D6",
  },
  {
    step: "03",
    title: "Compare",
    text: "Review quotes, warranties, and timelines.",
    icon: <CompareArrowsRoundedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#B86800",
    bg: "#FFF1E2",
  },
  {
    step: "04",
    title: "Select",
    text: "Choose the vendor that fits best.",
    icon: <VerifiedRoundedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#10985E",
    bg: "#DFF7EA",
  },
  {
    step: "05",
    title: "Track",
    text: "Follow milestones until completion.",
    icon: <ConstructionRoundedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#344155",
    bg: "#EEF2F7",
  },
];

const highlights = [
  "Verified vendors",
  "Clear quote comparison",
  "Project tracking",
];

export default function HowItWorksPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageYCompact,
        bgcolor: "#F7FAFC",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        className={layoutStyles.publicContentContainer}
      >
        <Box
          className={layoutStyles.revealUp}
          sx={{
            position: "relative",
            minHeight: { xs: 430, md: 500 },
            px: { xs: 2.2, md: 4.2 },
            py: { xs: 4.2, md: 5 },
            mb: { xs: 5, md: 6.5 },
            borderRadius: "2rem",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            backgroundImage: `linear-gradient(90deg, rgba(9,22,48,0.9) 0%, rgba(9,22,48,0.72) 42%, rgba(9,22,48,0.18) 100%), url(${quoteBiddingImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 26px 58px rgba(16,29,51,0.16)",
          }}
        >
          <Box sx={{ maxWidth: 620, position: "relative", zIndex: 1 }}>
            <Chip
              label="How It Works"
              sx={{
                height: 30,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#465000",
                ...publicTypography.eyebrow,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                mt: 1.35,
                color: "#FFFFFF",
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                lineHeight: 1.05,
                letterSpacing: 0,
                fontWeight: 900,
              }}
            >
              Solar quotes made simple
            </Typography>
            <Typography
              sx={{
                mt: 1.2,
                maxWidth: 520,
                color: "rgba(255,255,255,0.78)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.75,
              }}
            >
              Request, compare, select, and track your solar project from one clean place.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              sx={{ mt: 2.5 }}
            >
              <Button
                component={RouterLink}
                to="/booking"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 46,
                  px: 2.4,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  color: "#0E56C8",
                  fontSize: "0.88rem",
                  fontWeight: 850,
                  textTransform: "none",
                  boxShadow: "0 14px 28px rgba(5,14,31,0.22)",
                  "&:hover": { bgcolor: "#F4F8FF" },
                }}
              >
                Get a Quote
              </Button>
              <Button
                component={RouterLink}
                to="/vendors"
                variant="outlined"
                sx={{
                  minHeight: 46,
                  px: 2.3,
                  borderRadius: "999px",
                  borderColor: "rgba(255,255,255,0.38)",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.62)",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Explore Vendors
              </Button>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              left: { xs: 18, md: 34 },
              right: { xs: 18, md: "auto" },
              bottom: { xs: 18, md: 28 },
              flexWrap: "wrap",
              zIndex: 1,
            }}
          >
            {highlights.map((item) => (
              <Box
                key={item}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.15,
                  py: 0.72,
                  borderRadius: "999px",
                  bgcolor: "rgba(255,255,255,0.13)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(8px)",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: "0.92rem", color: "#83F1A7" }} />
                {item}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mb: { xs: 2.4, md: 3.2 }, textAlign: "center" }}>
          <Typography
            sx={{
              color: "#18253A",
              ...publicTypography.sectionTitle,
              letterSpacing: 0,
            }}
          >
            Five steps. No confusion.
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              color: "#6E7B8E",
              fontSize: "0.95rem",
              lineHeight: 1.65,
            }}
          >
            The full quote journey, trimmed down to what matters.
          </Typography>
        </Box>

        <Box sx={{ position: "relative", mb: { xs: 5, md: 6.5 } }}>
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "absolute",
              top: 43,
              left: "8%",
              right: "8%",
              height: 2,
              bgcolor: "#DCE6F1",
            }}
          />
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {journeySteps.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 2.4 }}>
                <Box
                  className={`${layoutStyles.interactiveSurface} ${layoutStyles.revealUpSlow}`}
                  sx={{
                    position: "relative",
                    height: "100%",
                    minHeight: 180,
                    p: { xs: 1.8, md: 2 },
                    borderRadius: "1.2rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E4EBF4",
                    boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "0.95rem",
                        bgcolor: item.bg,
                        color: item.color,
                        display: "grid",
                        placeItems: "center",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        color: item.color,
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {item.step}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1.35,
                      color: "#18253A",
                      fontSize: "1.02rem",
                      lineHeight: 1.25,
                      fontWeight: 850,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.65,
                      color: "#66768B",
                      fontSize: "0.84rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            p: { xs: 2.3, md: 3 },
            borderRadius: "1.5rem",
            bgcolor: "#FFFFFF",
            border: "1px solid #E4EBF4",
            boxShadow: "0 18px 38px rgba(16,29,51,0.07)",
          }}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: { xs: "1.35rem", md: "1.75rem" },
                  lineHeight: 1.18,
                  letterSpacing: 0,
                  fontWeight: 900,
                }}
              >
                Ready to compare real vendor quotes?
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  color: "#6E7B8E",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  maxWidth: 520,
                }}
              >
                Start with your property details and Sparkin will handle the quote flow.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.1}
                justifyContent={{ md: "flex-end" }}
              >
                <Button
                  component={RouterLink}
                  to="/booking"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 46,
                    px: 2.4,
                    borderRadius: "999px",
                    bgcolor: "#0E56C8",
                    fontWeight: 850,
                    textTransform: "none",
                    boxShadow: "0 14px 26px rgba(14,86,200,0.18)",
                    "&:hover": { bgcolor: "#0B49AD" },
                  }}
                >
                  Get a Quote
                </Button>
                <Button
                  component={RouterLink}
                  to="/calculator"
                  variant="outlined"
                  sx={{
                    minHeight: 46,
                    px: 2.2,
                    borderRadius: "999px",
                    borderColor: "#BFD0E6",
                    color: "#18253A",
                    fontWeight: 850,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#0E56C8",
                      bgcolor: "#F3F7FF",
                    },
                  }}
                >
                  Try Calculator
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

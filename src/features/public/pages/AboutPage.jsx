import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import aboutHeroPlaceholder from "@/shared/assets/images/public/about/about-hero-placeholder.png";
import aboutStoryPlaceholder from "@/shared/assets/images/public/about/about-story-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";

const values = [
  {
    title: "Our Vision",
    text: "To empower every Indian household with energy independence. We envision a future where energy is decentralized, clean.",
    icon: <VerifiedOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    tone: { bg: "#EAF1FF", fg: "#285DDE" },
  },
  {
    title: "Our Mission",
    text: "To build the most transparent and efficient solar ecosystem through technology. We bridge the gap between intent and installation with precision data.",
    icon: <EnergySavingsLeafOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    tone: { bg: "#DDF8E8", fg: "#14A75B" },
  },
];

const targets = [
  {
    label: "1 Million",
    title: "Households Powered",
    text: "Building confidence in transparent solar adoption across urban and semi-urban communities.",
    tone: { bg: "#EAF1FF", fg: "#285DDE" },
    icon: <Groups2OutlinedIcon sx={{ fontSize: "0.9rem" }} />,
  },
  {
    label: "10GW",
    title: "Clean Energy Installed",
    text: "A long-term infrastructure milestone toward resilient and distributed energy systems.",
    tone: { bg: "#DDF8E8", fg: "#14A75B" },
    icon: <EnergySavingsLeafOutlinedIcon sx={{ fontSize: "0.9rem" }} />,
  },
  {
    label: "50 Million",
    title: "Units Saved",
    text: "Driving meaningful household and business utility savings through data-backed solar choices.",
    tone: { bg: "#F3F5B3", fg: "#7A7B00" },
    icon: <BoltRoundedIcon sx={{ fontSize: "0.9rem" }} />,
  },
];

const statPills = [
  { value: "50,000+", label: "Installations" },
  { value: "100+", label: "Cities" },
  { value: "500+", label: "Verified Vendors" },
  { value: "2.5GW", label: "Clean Energy" },
];

export default function AboutPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        className={layoutStyles.publicContentContainer}
      >
        <Grid
          container
          spacing={{ xs: 3.2, md: 4.2 }}
          alignItems="center"
          sx={{ mb: { xs: 5.8, md: 6.8 } }}
          className={layoutStyles.revealUp}
        >
          <Grid size={{ xs: 12, md: 6.4 }}>
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
              Sparkin Sustainability Mission
            </Box>

            <Typography
              variant="h1"
              sx={{
                mt: 1.25,
                ...publicTypography.heroTitle,
                color: "#18253A",
                maxWidth: 620,
              }}
            >
              Harnessing the Sun&apos;s Brilliance for a{" "}
              <Box component="span" sx={{ color: "#0E56C8" }}>
                Sustainable Future
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 510,
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
              }}
            >
              Sparkin is on a mission to accelerate India&apos;s transition to
              clean energy through precision data and trusted vendor
              partnerships.
            </Typography>

            <Button
              component={RouterLink}
              to="/booking"
              variant="contained"
              sx={{
                mt: 2.35,
                minHeight: 42,
                px: 2.1,
                borderRadius: "0.72rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
              }}
            >
              Join the Movement
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 5.6 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                ml: { md: "auto" },
                maxWidth: 390,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  minHeight: { xs: 280, md: 320 },
                  borderRadius: "1.7rem",
                  overflow: "hidden",
                  backgroundImage: `linear-gradient(180deg, rgba(8,28,68,0.08) 0%, rgba(8,28,68,0.18) 100%), url(${aboutHeroPlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 22px 46px rgba(16,29,51,0.14)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 18, md: 22 },
                  bottom: { xs: 18, md: 22 },
                  px: 1.2,
                  py: 0.9,
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  boxShadow: "0 12px 24px rgba(12,29,56,0.16)",
                }}
              >
                <Typography
                  sx={{
                    color: "#566000",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Built at scale
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    color: "#18253A",
                    fontSize: "0.86rem",
                    fontWeight: 700,
                  }}
                >
                  500+ verified vendors
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={{ xs: 2, md: 2.4 }}
          sx={{ mb: { xs: 5.8, md: 6.8 } }}
        >
          {values.map((value) => (
            <Grid key={value.title} size={{ xs: 12, md: 6 }}>
              <Box
                className={`${layoutStyles.interactiveSurface} ${layoutStyles.revealUpSlow}`}
                sx={{
                  p: { xs: 2.2, md: 2.6 },
                  minHeight: 180,
                  borderRadius: "1.5rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 14px 32px rgba(16,29,51,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "0.9rem",
                    bgcolor: value.tone.bg,
                    color: value.tone.fg,
                    display: "grid",
                    placeItems: "center",
                    mb: 1.4,
                  }}
                >
                  {value.icon}
                </Box>
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: "1.18rem",
                    fontWeight: 800,
                  }}
                >
                  {value.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: "#6E7B8E",
                    fontSize: "0.9rem",
                    lineHeight: 1.76,
                    maxWidth: 470,
                  }}
                >
                  {value.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mb: { xs: 4.8, md: 5.8 } }}>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.75rem", md: "2.2rem" },
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Our 2030 Targets
          </Typography>
          <Typography
            sx={{
              mt: 0.9,
              color: "#7B889C",
              fontSize: "0.9rem",
              lineHeight: 1.72,
            }}
          >
            We are committed to measurable goals that shape a more resilient
            solar ecosystem.
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 1.8, md: 2.2 }}
          sx={{ mb: { xs: 6.6, md: 8 } }}
        >
          {targets.map((target) => (
            <Grid key={target.title} size={{ xs: 12, md: 4 }}>
              <Box
                className={layoutStyles.interactiveSurface}
                sx={{
                  p: { xs: 2, md: 2.2 },
                  minHeight: 184,
                  borderRadius: "1.35rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "0.8rem",
                    bgcolor: target.tone.bg,
                    color: target.tone.fg,
                    display: "grid",
                    placeItems: "center",
                    mb: 1.25,
                  }}
                >
                  {target.icon}
                </Box>
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: "2rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {target.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.85,
                    color: "#18253A",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                  }}
                >
                  {target.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6E7B8E",
                    fontSize: "0.82rem",
                    lineHeight: 1.72,
                  }}
                >
                  {target.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          alignItems="center"
          sx={{ mb: { xs: 6.6, md: 8 } }}
        >
          <Grid size={{ xs: 12, md: 5.3 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                minHeight: { xs: 250, md: 300 },
                borderRadius: "1.55rem",
                overflow: "hidden",
                backgroundImage: `linear-gradient(180deg, rgba(8,28,68,0.04) 0%, rgba(8,28,68,0.08) 100%), url(${aboutStoryPlaceholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 18px 40px rgba(16,29,51,0.08)",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6.7 }}>
            <Typography
              sx={{
                color: "#18253A",
                fontSize: { xs: "1.95rem", md: "2.65rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.04,
              }}
            >
              The Sparkin Story
            </Typography>

            <Typography
              sx={{
                mt: 1.4,
                color: "#6E7B8E",
                fontSize: "0.92rem",
                lineHeight: 1.82,
              }}
            >
              Sparkin was founded with a simple but ambitious vision: to make
              clean energy adoption accessible, measurable, and trustworthy. We
              set out to solve the market’s biggest pain points—opaque pricing,
              delayed execution, and a fragmented installer network.
            </Typography>
            <Typography
              sx={{
                mt: 1.05,
                color: "#6E7B8E",
                fontSize: "0.92rem",
                lineHeight: 1.82,
              }}
            >
              Today, Sparkin blends the intelligence of technology and
              sustainability, helping households and businesses compare,
              evaluate, and transition to solar with confidence.
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ mb: { xs: 6.6, md: 8 } }}
        >
          {statPills.map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 3 }}>
              <Box
                className={layoutStyles.interactiveSurface}
                sx={{
                  p: { xs: 1.4, md: 1.6 },
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: { xs: "1.15rem", md: "1.35rem" },
                    fontWeight: 800,
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.35,
                    color: "#6E7B8E",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          className={layoutStyles.interactiveSurface}
          sx={{
            p: { xs: 3.2, md: 4.6 },
            borderRadius: "2rem",
            background:
              "radial-gradient(circle at 84% 30%, rgba(191,255,118,0.2) 0%, rgba(191,255,118,0) 18%), linear-gradient(90deg, #0E56C8 0%, #1557D1 62%, #0D45B4 100%)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 20px 44px rgba(14,86,200,0.18)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.04,
            }}
          >
            Ready to start your
            <Box component="span" sx={{ display: "block" }}>
              solar journey?
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 1.25,
              mx: "auto",
              maxWidth: 520,
              color: "rgba(239,245,255,0.84)",
              fontSize: "0.95rem",
              lineHeight: 1.76,
            }}
          >
            Get a free personalized quote in less than 2 minutes and see how
            Sparkin can help simplify your transition.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.4}
            justifyContent="center"
            sx={{ mt: 2.8 }}
          >
            <Button
              component={RouterLink}
              to="/calculator"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minWidth: 164,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#DDF509",
                color: "#162331",
                boxShadow: "none",
              }}
            >
              Check Your Savings
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              sx={{
                minWidth: 150,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "none",
              }}
            >
              Talk to an Expert
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

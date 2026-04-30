import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import { Link as RouterLink } from "react-router-dom";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import calculatorRegionImage from "@/shared/assets/images/public/calculator/calculator-region-placeholder.png";
import quoteAnalysisImage from "@/shared/assets/images/public/quotes/quote-analysis-placeholder.png";
import loanHeroImage from "@/shared/assets/images/public/financing/loan-hero-placeholder.png";

const featuredArticle = {
  title: "How to compare rooftop solar quotes without getting confused",
  summary:
    "A practical buyer guide to evaluate panel brands, inverter warranties, installer quality, subsidy eligibility, and payback claims.",
  image: quoteAnalysisImage,
  readTime: "8 min read",
};

const articles = [
  {
    title: "What system size does your home actually need?",
    category: "Planning",
    text: "Understand how bill amount, roof area, appliances, and sunlight hours shape your ideal kW size.",
    icon: <CalculateOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "On-grid, hybrid, or battery ready?",
    category: "Technology",
    text: "Choose the right solar architecture for backup, grid export, and future battery expansion.",
    icon: <BatteryChargingFullRoundedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "Subsidy basics for residential solar",
    category: "Savings",
    text: "Learn what documentation, capacity limits, and timelines matter before finalizing an installer.",
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
];

const guides = [
  "Roof inspection checklist",
  "Net metering documents",
  "Warranty questions to ask",
  "Monthly generation tracker",
];

export default function ArticlesPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 64%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Grid container spacing={{ xs: 3.5, md: 5 }} alignItems="center" sx={{ mb: publicPageSpacing.sectionBottom }}>
          <Grid size={{ xs: 12, md: 6.3 }}>
            <Chip
              label="Solar Articles"
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
            <Typography variant="h1" sx={{ mt: 1.35, ...publicTypography.heroTitle, color: "#18253A", maxWidth: 700 }}>
              Clear solar knowledge for smarter buying decisions.
            </Typography>
            <Typography sx={{ mt: 1.45, color: "#6E7B8E", maxWidth: 540, ...publicTypography.sectionBody }}>
              Browse practical explainers, buyer checklists, and savings guides
              written for homeowners comparing solar for the first time.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5.7 }}>
            <Box
              sx={{
                minHeight: { xs: 300, md: 360 },
                borderRadius: "2rem",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.08) 0%, rgba(7,22,55,0.46) 100%), url(${calculatorRegionImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 24px 52px rgba(16,29,51,0.14)",
              }}
            >
              <Box sx={{ position: "absolute", left: 24, right: 24, bottom: 24, color: "white" }}>
                <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1.16 }}>
                  Learn before you sign.
                </Typography>
                <Typography sx={{ mt: 0.8, maxWidth: 360, color: "rgba(255,255,255,0.78)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  Simple guidance for pricing, equipment, installation, and long-term service.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            p: { xs: 2.2, md: 2.8 },
            mb: publicPageSpacing.sectionBottom,
            borderRadius: "1.8rem",
            bgcolor: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(223,231,241,0.92)",
            boxShadow: "0 18px 40px rgba(16,29,51,0.07)",
          }}
        >
          <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4.3 }}>
              <Box
                sx={{
                  minHeight: 250,
                  borderRadius: "1.4rem",
                  backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.02) 0%, rgba(7,22,55,0.18) 100%), url(${featuredArticle.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7.7 }}>
              <Chip label={featuredArticle.readTime} sx={{ bgcolor: "#EAF1FF", color: "#0E56C8", fontWeight: 800 }} />
              <Typography sx={{ mt: 1.5, color: "#18253A", fontSize: { xs: "1.55rem", md: "2.2rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
                {featuredArticle.title}
              </Typography>
              <Typography sx={{ mt: 1.15, color: "#6E7B8E", fontSize: "0.96rem", lineHeight: 1.8, maxWidth: 720 }}>
                {featuredArticle.summary}
              </Typography>
              <Button component={RouterLink} to="/calculator" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2, px: 0, color: "#0E56C8", fontWeight: 800 }}>
                Start with your savings
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={{ xs: 2.2, md: 2.8 }} sx={{ mb: publicPageSpacing.sectionBottom }}>
          {articles.map((article) => (
            <Grid key={article.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  minHeight: 250,
                  p: { xs: 2.2, md: 2.5 },
                  borderRadius: "1.45rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 12px 28px rgba(16,29,51,0.05)",
                }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: "0.9rem", bgcolor: "#EAF1FF", color: "#0E56C8", display: "grid", placeItems: "center", mb: 1.45 }}>
                  {article.icon}
                </Box>
                <Typography sx={{ color: "#13A66B", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {article.category}
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#18253A", fontSize: "1.08rem", fontWeight: 800, lineHeight: 1.3 }}>
                  {article.title}
                </Typography>
                <Typography sx={{ mt: 0.95, color: "#6E7B8E", fontSize: "0.88rem", lineHeight: 1.75 }}>
                  {article.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: "100%", minHeight: 300, borderRadius: "1.8rem", backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.08) 0%, rgba(7,22,55,0.36) 100%), url(${loanHeroImage})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 18px 40px rgba(16,29,51,0.1)" }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ height: "100%", p: { xs: 2.5, md: 3.2 }, borderRadius: "1.8rem", background: "linear-gradient(180deg, #121C32 0%, #182641 100%)", color: "white" }}>
              <LightbulbOutlinedIcon sx={{ color: "#DDF509", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.7, fontSize: { xs: "1.55rem", md: "2rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
                Downloadable buyer guides
              </Typography>
              <Grid container spacing={1.3} sx={{ mt: 2.2 }}>
                {guides.map((guide) => (
                  <Grid key={guide} size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1.25, borderRadius: "0.9rem", bgcolor: "rgba(255,255,255,0.08)" }}>
                      <SolarPowerOutlinedIcon sx={{ color: "#13C784", fontSize: "1rem" }} />
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 700 }}>{guide}</Typography>
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

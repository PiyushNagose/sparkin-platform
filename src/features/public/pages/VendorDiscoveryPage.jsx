import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import vendorHeroPlaceholder from "@/shared/assets/images/public/vendors/vendor-discovery-hero-placeholder.png";
import vendorConsultPlaceholder from "@/shared/assets/images/public/vendors/vendor-consult-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const filterChips = [
  { label: "Location", icon: <PlaceOutlinedIcon sx={{ fontSize: "0.9rem" }} /> },
  { label: "Rating", icon: <StarRoundedIcon sx={{ fontSize: "0.9rem" }} /> },
  { label: "Experience", icon: <WorkOutlineRoundedIcon sx={{ fontSize: "0.9rem" }} /> },
  { label: "Services", icon: <TuneRoundedIcon sx={{ fontSize: "0.9rem" }} /> },
];

const vendors = [
  {
    name: "Tata Power Solar",
    location: "Pune, Maharashtra",
    expertise: "30+ Years",
    projects: "58+ Projects",
    rating: "4.9",
    reviews: "125 reviews",
    tags: ["Installation", "Maintenance", "Financing"],
    tone: "#15D97C",
    logo: "#154D9F",
    featured: true,
  },
  {
    name: "Adani Solar",
    location: "Ahmedabad, Gujarat",
    expertise: "12+ Years",
    projects: "48+ Projects",
    rating: "4.8",
    reviews: "180 reviews",
    tags: ["Installation", "Commercial"],
    tone: "#7ED957",
    logo: "#2D8A43",
  },
  {
    name: "Loom Solar",
    location: "Faridabad, Haryana",
    expertise: "8+ Years",
    projects: "41+ Projects",
    rating: "4.7",
    reviews: "160 reviews",
    tags: ["Installation", "Off-grid Solutions"],
    tone: "#E5F20D",
    logo: "#F0B625",
  },
  {
    name: "Waaree Energies",
    location: "Surat, Gujarat",
    expertise: "22+ Years",
    projects: "70+ Projects",
    rating: "4.9",
    reviews: "175 reviews",
    tags: ["Manufacturing", "Consulting"],
    tone: "#19C5A8",
    logo: "#31A7A2",
  },
  {
    name: "Vikram Solar",
    location: "Kolkata, West Bengal",
    expertise: "13+ Years",
    projects: "75+ Projects",
    rating: "4.6",
    reviews: "130 reviews",
    tags: ["Installation", "PV Modules"],
    tone: "#8FD55A",
    logo: "#233B63",
  },
  {
    name: "Servotech",
    location: "New Delhi, Delhi",
    expertise: "10+ Years",
    projects: "35+ Projects",
    rating: "4.5",
    reviews: "120 reviews",
    tags: ["Inverters", "Maintenance"],
    tone: "#8D9DFF",
    logo: "#E2C451",
  },
];

export default function VendorDiscoveryPage() {
  return (
    <Box
      sx={{
        pb: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 360, md: 430 },
          backgroundImage: `linear-gradient(180deg, rgba(7,17,36,0.18) 0%, rgba(7,17,36,0.58) 70%, rgba(7,17,36,0.66) 100%), url(${vendorHeroPlaceholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: { xs: 360, md: 430 },
              display: "flex",
              alignItems: "center",
              py: { xs: 5.5, md: 7.2 },
            }}
          >
            <Box sx={{ maxWidth: 470 }}>
              <Box
                sx={{
                  width: "fit-content",
                  px: 0.8,
                  py: 0.32,
                  borderRadius: 999,
                  bgcolor: "#E5F20D",
                  color: "#4B5200",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                240+ Curated Partners
              </Box>

              <Typography
                sx={{
                  mt: 1.35,
                  color: "#FFFFFF",
                  ...publicTypography.heroTitle,
                  maxWidth: 520,
                }}
              >
                Explore Premier Solar Vendors
              </Typography>

              <Typography
                sx={{
                  mt: 1.15,
                  maxWidth: 425,
                  color: "rgba(241,246,255,0.78)",
                  ...publicTypography.sectionBody,
                }}
              >
                Compare top-rated solar providers and find the perfect match for
                your home. Our atmospheric precision helps you identify the best
                efficiency for your specific region.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                sx={{ mt: 2.4 }}
              >
                <Button
                  component={RouterLink}
                  to="/quotes/compare"
                  variant="contained"
                  sx={{
                    minHeight: 42,
                    px: 2.05,
                    borderRadius: "0.72rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#0E56C8",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                  }}
                >
                  Get Instant Quotes
                </Button>
                <Button
                  component={RouterLink}
                  to="/vendors/partners"
                  variant="contained"
                  sx={{
                    minHeight: 42,
                    px: 2.05,
                    borderRadius: "0.72rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Partner Network
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "center" }}
          spacing={2}
          sx={{ mt: publicPageSpacing.heroBottom, mb: { xs: 4.5, md: 5.5 } }}
        >
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.15}>
            {filterChips.map((chip) => (
              <Box
                key={chip.label}
                sx={{
                  px: 1.1,
                  py: 0.62,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.55,
                  color: "#5E6B7E",
                  fontSize: "0.77rem",
                  fontWeight: 700,
                }}
              >
                {chip.icon}
                {chip.label}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "1rem" }} />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.65} alignItems="center">
            <Typography sx={{ color: "#7A879A", fontSize: "0.78rem" }}>
              Sort by:
            </Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.8rem", fontWeight: 700 }}>
              Most Recommended
            </Typography>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: "1rem", color: "#5E6B7E" }} />
          </Stack>
        </Stack>

        <Grid container spacing={{ xs: 2, md: 2.2 }}>
          {vendors.map((vendor) => (
            <Grid key={vendor.name} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: { xs: 1.5, md: 1.6 },
                  borderRadius: "1.45rem",
                  bgcolor: "rgba(255,255,255,0.96)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 14px 32px rgba(16,29,51,0.06)",
                  height: "100%",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                  <Stack direction="row" spacing={1} alignItems="start">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "0.65rem",
                        bgcolor: vendor.logo,
                        color: "#FFFFFF",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      {vendor.name.split(" ")[0].slice(0, 1)}
                    </Box>
                    <Box>
                      <Typography
                        sx={{ color: "#18253A", fontSize: "0.98rem", fontWeight: 800 }}
                      >
                        {vendor.name}
                      </Typography>
                      <Typography sx={{ mt: 0.2, color: "#7A879A", fontSize: "0.76rem" }}>
                        {vendor.location}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={0.32} alignItems="center">
                    <StarRoundedIcon sx={{ fontSize: "0.88rem", color: "#F0C419" }} />
                    <Typography sx={{ color: "#18253A", fontSize: "0.78rem", fontWeight: 700 }}>
                      {vendor.rating}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography sx={{ mt: 0.35, color: "#A1ADBD", fontSize: "0.68rem" }}>
                  {vendor.reviews}
                </Typography>

                <Grid container spacing={1.2} sx={{ mt: 1.55 }}>
                  <Grid size={4}>
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Experience
                    </Typography>
                    <Typography sx={{ mt: 0.38, color: "#18253A", fontSize: "0.78rem", fontWeight: 700 }}>
                      {vendor.expertise}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Completed
                    </Typography>
                    <Typography sx={{ mt: 0.38, color: "#18253A", fontSize: "0.78rem", fontWeight: 700 }}>
                      {vendor.projects}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Rating
                    </Typography>
                    <Typography sx={{ mt: 0.38, color: "#18253A", fontSize: "0.78rem", fontWeight: 700 }}>
                      {vendor.rating}/5
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.65} sx={{ mt: 1.35 }}>
                  {vendor.tags.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: 0.7,
                        py: 0.26,
                        borderRadius: 999,
                        bgcolor: "#E9FFF4",
                        color: "#0E8F50",
                        fontSize: "0.58rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1.7 }}>
                  <Button
                    component={RouterLink}
                    to={vendor.featured ? "/vendors/tata-power-solar" : "/vendors/tata-power-solar"}
                    variant="contained"
                    sx={{
                      flex: 1,
                      minHeight: 38,
                      borderRadius: "0.78rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: "#0E56C8",
                      boxShadow: "none",
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/quotes/compare"
                    variant="contained"
                    sx={{
                      flex: 1,
                      minHeight: 38,
                      borderRadius: "0.78rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: "#F2F5F9",
                      color: "#2B3645",
                      boxShadow: "none",
                    }}
                  >
                    Compare
                  </Button>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3.2, md: 3.8 } }}>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              minHeight: 40,
              px: 2.2,
              borderRadius: "0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "rgba(255,255,255,0.96)",
              color: "#2A3442",
              border: "1px solid rgba(223,231,241,0.92)",
              boxShadow: "none",
            }}
          >
            Show more vendors
          </Button>
        </Box>

        <Box
          sx={{
            mt: publicPageSpacing.sectionTopLarge,
            p: { xs: 3, md: 4.2 },
            borderRadius: "2rem",
            background:
              "radial-gradient(circle at 78% 28%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 24%), linear-gradient(180deg, #0F4FBE 0%, #0A43A8 100%)",
            color: "white",
            boxShadow: "0 20px 44px rgba(14,86,200,0.18)",
          }}
        >
          <Grid container spacing={{ xs: 3, md: 3.8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6.8 }}>
              <Typography
                sx={{
                  ...publicTypography.sectionTitle,
                  maxWidth: 420,
                }}
              >
                Can&apos;t decide on the right provider?
              </Typography>
              <Typography
                sx={{
                  mt: 1.15,
                  maxWidth: 430,
                  color: "rgba(239,245,255,0.82)",
                  ...publicTypography.body,
                }}
              >
                Our expert solar advisors can help you compare quotes and select
                the optimal configuration for your energy needs—completely free.
              </Typography>

              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                sx={{
                  mt: 2.4,
                  minHeight: 44,
                  px: 2.05,
                  borderRadius: "0.78rem",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#DDF509",
                  color: "#162331",
                  boxShadow: "none",
                }}
              >
                Get Free Consultation
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 5.2 }}>
              <Box
                sx={{
                  ml: { md: "auto" },
                  maxWidth: 280,
                  minHeight: 228,
                  borderRadius: "1.45rem",
                  overflow: "hidden",
                  backgroundImage: `linear-gradient(180deg, rgba(8,28,68,0.03) 0%, rgba(8,28,68,0.08) 100%), url(${vendorConsultPlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 16px 36px rgba(10,30,66,0.18)",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

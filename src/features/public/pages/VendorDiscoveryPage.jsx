import { useState } from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import vendorHeroPlaceholder from "@/shared/assets/images/public/vendors/vendor-discovery-hero-placeholder.png";
import vendorConsultPlaceholder from "@/shared/assets/images/public/vendors/vendor-consult-placeholder.png";

const filterChips = [
  { label: "Location", icon: <PlaceOutlinedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Rating", icon: <StarRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Experience", icon: <WorkOutlineRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
  { label: "Services", icon: <TuneRoundedIcon sx={{ fontSize: "0.85rem" }} /> },
];

const vendors = [
  {
    name: "Total Power Solar",
    location: "Mumbai, Maharashtra",
    expertise: "20+ Years",
    projects: "58+ Projects",
    rating: "4.2",
    reviews: "125 reviews",
    tags: [
      { label: "Installation", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Maintenance", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Financing", color: "#0E56C8", bg: "#EEF4FF" },
    ],
    logoColor: "#154D9F",
    logoText: "TP",
  },
  {
    name: "Adani Solar",
    location: "Ahmedabad, Gujarat",
    expertise: "10+ Years",
    projects: "48+ Projects",
    rating: "4.6",
    reviews: "180 reviews",
    tags: [
      { label: "Installation", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Commercial", color: "#0A7A40", bg: "#EDFFF5" },
    ],
    logoColor: "#2D8A43",
    logoText: "AS",
  },
  {
    name: "Loom Solar",
    location: "Faridabad, Haryana",
    expertise: "8+ Years",
    projects: "41+ Projects",
    rating: "4.7",
    reviews: "160 reviews",
    tags: [
      { label: "Installation", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Off Grid Solutions", color: "#0A7A40", bg: "#EDFFF5" },
    ],
    logoColor: "#C47A00",
    logoText: "LS",
  },
  {
    name: "Waaree Energies",
    location: "Surat, Gujarat",
    expertise: "20+ Years",
    projects: "155+ Projects",
    rating: "4.9",
    reviews: "175 reviews",
    tags: [
      { label: "Manufacturing", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Consulting", color: "#0A7A40", bg: "#EDFFF5" },
    ],
    logoColor: "#0E7A6A",
    logoText: "WE",
  },
  {
    name: "Vikram Solar",
    location: "Kolkata, West Bengal",
    expertise: "13+ Years",
    projects: "75+ Projects",
    rating: "4.6",
    reviews: "130 reviews",
    tags: [
      { label: "Installation", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "PV Modules", color: "#0A7A40", bg: "#EDFFF5" },
    ],
    logoColor: "#233B63",
    logoText: "VS",
  },
  {
    name: "Servotech",
    location: "New Delhi, Delhi",
    expertise: "10+ Years",
    projects: "35+ Projects",
    rating: "4.5",
    reviews: "120 reviews",
    tags: [
      { label: "Inverters", color: "#0A7A40", bg: "#EDFFF5" },
      { label: "Maintenance", color: "#0A7A40", bg: "#EDFFF5" },
    ],
    logoColor: "#C04A20",
    logoText: "ST",
  },
];

function VendorCard({ vendor }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "1.4rem",
        bgcolor: "white",
        border: "1px solid rgba(223,231,241,0.9)",
        boxShadow: "0 6px 24px rgba(16,29,51,0.07)",
        height: "100%",
        overflow: "hidden",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 16px 42px rgba(16,29,51,0.12)",
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 }, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header row: logo + name/location + rating */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
          {/* Logo */}
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "1rem",
              bgcolor: vendor.logoColor,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: "0.95rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {vendor.logoText}
          </Box>

          {/* Name + location */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.25 }}
            >
              {vendor.name}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <PlaceOutlinedIcon sx={{ fontSize: "0.8rem", color: "#9AAABB" }} />
              <Typography sx={{ color: "#9AAABB", fontSize: "0.78rem" }}>
                {vendor.location}
              </Typography>
            </Stack>
          </Box>

          {/* Rating pill */}
          <Stack
            direction="column"
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 999,
                bgcolor: "#FFF8E1",
                border: "1px solid rgba(240,196,25,0.3)",
              }}
            >
              <StarRoundedIcon sx={{ fontSize: "0.9rem", color: "#F0C419" }} />
              <Typography sx={{ color: "#18253A", fontSize: "0.82rem", fontWeight: 800 }}>
                {vendor.rating}
              </Typography>
            </Stack>
            <Typography sx={{ mt: 0.4, color: "#B0BCCC", fontSize: "0.65rem", textAlign: "center" }}>
              {vendor.reviews}
            </Typography>
          </Stack>
        </Stack>

        {/* Experience + Completed */}
        <Stack direction="row" spacing={3.5} sx={{ mb: 2 }}>
          <Box>
            <Typography
              sx={{
                color: "#9AAABB",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Experience
            </Typography>
            <Typography sx={{ mt: 0.4, color: "#18253A", fontSize: "0.88rem", fontWeight: 700 }}>
              {vendor.expertise}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#9AAABB",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Completed
            </Typography>
            <Typography sx={{ mt: 0.4, color: "#18253A", fontSize: "0.88rem", fontWeight: 700 }}>
              {vendor.projects}
            </Typography>
          </Box>
        </Stack>

        {/* Service tags */}
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.7} sx={{ mb: 2.5 }}>
          {vendor.tags.map((tag) => (
            <Box
              key={tag.label}
              sx={{
                px: 1.1,
                py: 0.45,
                borderRadius: "0.5rem",
                bgcolor: tag.bg,
                color: tag.color,
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {tag.label}
            </Box>
          ))}
        </Stack>

        {/* Buttons */}
        <Stack direction="row" spacing={1.2} sx={{ mt: "auto" }}>
          <Button
            component={RouterLink}
            to="/vendors/tata-power-solar"
            variant="contained"
            sx={{
              flex: 1,
              minHeight: 44,
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
              boxShadow: "0 8px 20px rgba(14,86,200,0.22)",
            }}
          >
            View Profile
          </Button>
          <Button
            component={RouterLink}
            to="/booking"
            variant="outlined"
            sx={{
              flex: 1,
              minHeight: 44,
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
              borderColor: "rgba(223,231,241,0.9)",
              color: "#3A4A5C",
              bgcolor: "#F7F9FC",
              boxShadow: "none",
              "&:hover": { bgcolor: "#EEF2F8", borderColor: "#C8D4E4" },
            }}
          >
            Compare
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default function VendorDiscoveryPage() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <Box sx={{ bgcolor: "#F7FAFB" }}>

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 340, md: 420 },
          backgroundImage: `linear-gradient(160deg, rgba(7,17,36,0.75) 0%, rgba(10,30,60,0.58) 50%, rgba(7,17,36,0.80) 100%), url(${vendorHeroPlaceholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: { xs: 340, md: 420 },
              display: "flex",
              alignItems: "center",
              py: { xs: 5, md: 7 },
            }}
          >
            <Box sx={{ maxWidth: 520 }}>
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  px: 1.4,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: "#E5F20D",
                  color: "#3A4000",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                240+ Curated Partners
              </Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Explore Premier Solar{" "}
                <Box component="span" sx={{ display: "block" }}>
                  Vendors
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  maxWidth: 400,
                  color: "rgba(241,246,255,0.75)",
                  fontSize: "0.88rem",
                  lineHeight: 1.65,
                }}
              >
                Compare top-rated solar providers and find the perfect match for your home. Our algorithmic precision helps you identify the best efficiency for your specific region.
              </Typography>

              <Stack direction="row" spacing={1.2} sx={{ mt: 2.8 }}>
                <Button
                  component={RouterLink}
                  to="/booking"
                  variant="contained"
                  sx={{
                    minHeight: 44,
                    px: 2.2,
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                    boxShadow: "0 10px 24px rgba(14,86,200,0.3)",
                  }}
                >
                  Get Instant Quotes
                </Button>
                <Button
                  component={RouterLink}
                  to="/how-it-works"
                  variant="contained"
                  sx={{
                    minHeight: 44,
                    px: 2.2,
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  How It Works
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 9 } }}>
        {/* Filter bar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.5}
          sx={{ mt: { xs: 3.5, md: 4.5 }, mb: { xs: 3, md: 4 } }}
        >
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.8}>
            {filterChips.map((chip) => (
              <Box
                key={chip.label}
                onClick={() => setActiveFilter(activeFilter === chip.label ? null : chip.label)}
                sx={{
                  px: 1.3,
                  py: 0.65,
                  borderRadius: 999,
                  cursor: "pointer",
                  bgcolor: activeFilter === chip.label ? "#0E56C8" : "white",
                  border: activeFilter === chip.label
                    ? "1px solid #0E56C8"
                    : "1px solid rgba(223,231,241,0.92)",
                  color: activeFilter === chip.label ? "white" : "#5E6B7E",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.55,
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  transition: "all 160ms ease",
                  userSelect: "none",
                }}
              >
                {chip.icon}
                {chip.label}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.95rem" }} />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography sx={{ color: "#7A879A", fontSize: "0.76rem" }}>Sort by:</Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.78rem", fontWeight: 700 }}>
              Most Recommended
            </Typography>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: "0.95rem", color: "#5E6B7E" }} />
          </Stack>
        </Stack>

        {/* Vendor grid */}
        <Grid container spacing={{ xs: 2, md: 2.2 }}>
          {vendors.map((vendor) => (
            <Grid key={vendor.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <VendorCard vendor={vendor} />
            </Grid>
          ))}
        </Grid>

        {/* Show more */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3.5, md: 4.5 } }}>
          <Button
            variant="text"
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              minHeight: 40,
              px: 2,
              fontSize: "0.84rem",
              fontWeight: 700,
              textTransform: "none",
              color: "#3A4A5C",
              "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
            }}
          >
            Show more vendors
          </Button>
        </Box>

        {/* CTA Banner */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            borderRadius: "1.6rem",
            background: "linear-gradient(135deg, #0A1F4E 0%, #0E56C8 65%, #0A3A8A 100%)",
            color: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Grid container alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: { xs: 3.5, md: 5 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.7rem", md: "2.2rem" },
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    mb: 1.5,
                  }}
                >
                  Can&apos;t decide on the right provider?
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(239,245,255,0.75)",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    mb: 3,
                    maxWidth: 380,
                  }}
                >
                  Our expert solar advisors can help you compare quotes and select the optimal configuration for your energy needs — completely free.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  sx={{
                    minHeight: 46,
                    px: 2.5,
                    borderRadius: "999px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#E5F20D",
                    color: "#162331",
                    boxShadow: "0 8px 20px rgba(229,242,13,0.22)",
                    "&:hover": { bgcolor: "#D4E00C" },
                  }}
                >
                  Get Free Consultation
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  height: { xs: 220, md: "100%" },
                  minHeight: { md: 280 },
                  backgroundImage: `url(${vendorConsultPlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

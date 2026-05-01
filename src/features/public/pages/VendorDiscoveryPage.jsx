import { useState } from "react";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
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
    badge: "Top Pick",
    capacity: "5kW – 100kW",
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
    capacity: "3kW – 50kW",
  },
  {
    name: "Loom Solar",
    location: "Faridabad, Haryana",
    expertise: "8+ Years",
    projects: "41+ Projects",
    rating: "4.7",
    reviews: "160 reviews",
    tags: ["Installation", "Off-grid Solutions"],
    tone: "#F0B625",
    logo: "#C47A00",
    capacity: "1kW – 20kW",
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
    logo: "#0E7A6A",
    capacity: "5kW – 200kW",
  },
  {
    name: "Vikram Solar",
    location: "Kolkata, West Bengal",
    expertise: "13+ Years",
    projects: "75+ Projects",
    rating: "4.6",
    reviews: "130 reviews",
    tags: ["Installation", "PV Modules"],
    tone: "#6C8FFF",
    logo: "#233B63",
    capacity: "3kW – 80kW",
  },
  {
    name: "Servotech",
    location: "New Delhi, Delhi",
    expertise: "10+ Years",
    projects: "35+ Projects",
    rating: "4.5",
    reviews: "120 reviews",
    tags: ["Inverters", "Maintenance"],
    tone: "#FF8C69",
    logo: "#C04A20",
    capacity: "2kW – 30kW",
  },
];

const trustStats = [
  { icon: <GroupsRoundedIcon />, value: "50,000+", label: "Happy Homeowners" },
  { icon: <VerifiedRoundedIcon />, value: "240+", label: "Verified Vendors" },
  { icon: <EmojiEventsRoundedIcon />, value: "4.8★", label: "Avg. Rating" },
  { icon: <SolarPowerRoundedIcon />, value: "2.5 GW+", label: "Installed Capacity" },
];

export default function VendorDiscoveryPage() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <Box sx={{ pb: publicPageSpacing.pageY, bgcolor: "#F7FAFB" }}>

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 420, md: 520 },
          backgroundImage: `linear-gradient(160deg, rgba(7,17,36,0.72) 0%, rgba(10,30,60,0.55) 50%, rgba(7,17,36,0.78) 100%), url(${vendorHeroPlaceholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Decorative glow */}
        <Box sx={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(21,217,124,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <Container maxWidth="lg">
          <Box sx={{ minHeight: { xs: 420, md: 520 }, display: "flex", alignItems: "center", py: { xs: 6, md: 8 } }}>
            <Box sx={{ maxWidth: 560 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Box sx={{
                  px: 1.2, py: 0.4, borderRadius: 999,
                  bgcolor: "#E5F20D", color: "#3A4000",
                  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  240+ Curated Partners
                </Box>
                <Box sx={{
                  px: 1.2, py: 0.4, borderRadius: 999,
                  bgcolor: "rgba(21,217,124,0.18)", color: "#15D97C",
                  border: "1px solid rgba(21,217,124,0.3)",
                  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  ● Live Bids Open
                </Box>
              </Stack>

              <Typography sx={{
                color: "#FFFFFF", fontWeight: 900,
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.08, letterSpacing: "-0.03em",
              }}>
                Find Your Perfect{" "}
                <Box component="span" sx={{ color: "#15D97C" }}>Solar Partner</Box>
              </Typography>

              <Typography sx={{
                mt: 1.5, maxWidth: 440,
                color: "rgba(241,246,255,0.78)",
                fontSize: "1rem", lineHeight: 1.65,
              }}>
                Compare India&apos;s top-rated solar installers side by side. Transparent pricing, verified reviews, guaranteed quality.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/booking"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 48, px: 2.5, borderRadius: "0.8rem",
                    fontSize: "0.9rem", fontWeight: 700, textTransform: "none",
                    background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.3)",
                  }}
                >
                  Get Free Quotes
                </Button>
                <Button
                  component={RouterLink}
                  to="/calculator"
                  variant="contained"
                  sx={{
                    minHeight: 48, px: 2.5, borderRadius: "0.8rem",
                    fontSize: "0.9rem", fontWeight: 700, textTransform: "none",
                    bgcolor: "rgba(255,255,255,0.12)", color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)", boxShadow: "none",
                  }}
                >
                  Calculate Savings
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Trust Stats Bar */}
      <Box sx={{ bgcolor: "#10192F", py: { xs: 2.5, md: 3 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {trustStats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }}>
                  <Box sx={{
                    width: 38, height: 38, borderRadius: "50%",
                    bgcolor: "rgba(21,217,124,0.12)", color: "#15D97C",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, mt: 0.3 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Filters */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "center" }}
          spacing={2}
          sx={{ mt: { xs: 4, md: 5 }, mb: { xs: 3.5, md: 4.5 } }}
        >
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {filterChips.map((chip) => (
              <Box
                key={chip.label}
                onClick={() => setActiveFilter(activeFilter === chip.label ? null : chip.label)}
                sx={{
                  px: 1.4, py: 0.7, borderRadius: 999, cursor: "pointer",
                  bgcolor: activeFilter === chip.label ? "#0E56C8" : "white",
                  border: activeFilter === chip.label ? "1px solid #0E56C8" : "1px solid rgba(223,231,241,0.92)",
                  color: activeFilter === chip.label ? "white" : "#5E6B7E",
                  display: "flex", alignItems: "center", gap: 0.6,
                  fontSize: "0.78rem", fontWeight: 700,
                  transition: "all 180ms ease",
                  boxShadow: activeFilter === chip.label ? "0 6px 16px rgba(14,86,200,0.22)" : "none",
                }}
              >
                {chip.icon}
                {chip.label}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "1rem" }} />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.65} alignItems="center">
            <Typography sx={{ color: "#7A879A", fontSize: "0.78rem" }}>Sort by:</Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.8rem", fontWeight: 700 }}>Most Recommended</Typography>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: "1rem", color: "#5E6B7E" }} />
          </Stack>
        </Stack>

        {/* Vendor Cards */}
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {vendors.map((vendor) => (
            <Grid key={vendor.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{
                display: "flex", flexDirection: "column",
                borderRadius: "1.4rem",
                bgcolor: "white",
                border: vendor.featured ? "1.5px solid rgba(14,86,200,0.3)" : "1px solid rgba(223,231,241,0.9)",
                boxShadow: vendor.featured
                  ? "0 20px 48px rgba(14,86,200,0.13)"
                  : "0 8px 28px rgba(16,29,51,0.06)",
                height: "100%", position: "relative", overflow: "hidden",
                transition: "transform 220ms ease, box-shadow 220ms ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 24px 52px rgba(16,29,51,0.13)",
                },
              }}>
                {/* Top color bar */}
                <Box sx={{
                  height: 5,
                  background: `linear-gradient(90deg, ${vendor.logo} 0%, ${vendor.tone} 100%)`,
                }} />

                {/* Featured badge */}
                {vendor.featured && (
                  <Box sx={{
                    position: "absolute", top: 18, right: 14,
                    px: 1, py: 0.3, borderRadius: 999,
                    background: "linear-gradient(90deg, #0E56C8, #1A8FFF)",
                    color: "white", fontSize: "0.6rem", fontWeight: 800,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    boxShadow: "0 4px 12px rgba(14,86,200,0.3)",
                  }}>
                    ★ Top Pick
                  </Box>
                )}

                <Box sx={{ p: { xs: 2, md: 2.2 }, display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Header */}
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Box sx={{
                      width: 46, height: 46, borderRadius: "1rem", flexShrink: 0,
                      background: `linear-gradient(135deg, ${vendor.logo} 0%, ${vendor.tone} 120%)`,
                      color: "#fff", display: "grid", placeItems: "center",
                      fontSize: "1rem", fontWeight: 900,
                      boxShadow: `0 8px 20px ${vendor.tone}50`,
                    }}>
                      {vendor.name.slice(0, 1)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ color: "#18253A", fontSize: "0.95rem", fontWeight: 800, lineHeight: 1.2 }}>
                        {vendor.name}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.3 }}>
                        <PlaceOutlinedIcon sx={{ fontSize: "0.72rem", color: "#9AAABB" }} />
                        <Typography sx={{ color: "#9AAABB", fontSize: "0.72rem" }}>
                          {vendor.location}
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.3} alignItems="center" sx={{
                      px: 0.8, py: 0.4, borderRadius: 999,
                      bgcolor: "#FFF8E1", border: "1px solid rgba(240,196,25,0.25)",
                    }}>
                      <StarRoundedIcon sx={{ fontSize: "0.82rem", color: "#F0C419" }} />
                      <Typography sx={{ color: "#18253A", fontSize: "0.78rem", fontWeight: 800 }}>
                        {vendor.rating}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Stats row */}
                  <Box sx={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 1, mb: 1.5,
                    p: 1.2, borderRadius: "1rem",
                    bgcolor: "#F7FAFB", border: "1px solid #EEF2F7",
                  }}>
                    {[
                      ["Experience", vendor.expertise],
                      ["Projects", vendor.projects],
                      ["Capacity", vendor.capacity],
                    ].map(([lbl, val]) => (
                      <Box key={lbl} sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: "#9AAABB", fontSize: "0.56rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                          {lbl}
                        </Typography>
                        <Typography sx={{ mt: 0.3, color: "#18253A", fontSize: "0.75rem", fontWeight: 700 }}>
                          {val}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Verified + reviews */}
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.4 }}>
                    <Stack direction="row" spacing={0.4} alignItems="center" sx={{
                      px: 0.8, py: 0.3, borderRadius: 999,
                      bgcolor: vendor.featured ? "rgba(14,86,200,0.07)" : "#F3F7FC",
                      color: vendor.featured ? "#0E56C8" : "#657386",
                    }}>
                      <VerifiedRoundedIcon sx={{ fontSize: "0.75rem" }} />
                      <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Verified
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#B0BCCC", fontSize: "0.7rem" }}>
                      {vendor.reviews}
                    </Typography>
                  </Stack>

                  {/* Tags */}
                  <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.6} sx={{ mb: 1.8 }}>
                    {vendor.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{
                        height: 20, bgcolor: "#EDFFF5", color: "#0A7A40",
                        fontSize: "0.6rem", fontWeight: 800,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        "& .MuiChip-label": { px: 0.9 },
                      }} />
                    ))}
                  </Stack>

                  {/* Fast response strip */}
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{
                    p: 1, borderRadius: "0.85rem", mb: 1.8,
                    bgcolor: `${vendor.tone}12`,
                    border: `1px solid ${vendor.tone}30`,
                  }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: "0.9rem", color: vendor.tone, flexShrink: 0 }} />
                    <Typography sx={{ color: "#3A4A5C", fontSize: "0.72rem", fontWeight: 700 }}>
                      Fast quote · Certified installers · 25yr warranty
                    </Typography>
                  </Stack>

                  {/* Buttons */}
                  <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                    <Button
                      component={RouterLink}
                      to="/vendors/tata-power-solar"
                      variant="contained"
                      sx={{
                        flex: 1, minHeight: 40, borderRadius: "0.75rem",
                        fontSize: "0.8rem", fontWeight: 700, textTransform: "none",
                        background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                        boxShadow: "0 8px 20px rgba(14,86,200,0.2)",
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/booking"
                      variant="contained"
                      sx={{
                        flex: 1, minHeight: 40, borderRadius: "0.75rem",
                        fontSize: "0.8rem", fontWeight: 700, textTransform: "none",
                        bgcolor: "#F0F4FA", color: "#1A2B45",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#E4EBF5" },
                      }}
                    >
                      Compare
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Show more */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3.5, md: 4 } }}>
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              minHeight: 44, px: 3, borderRadius: "0.9rem",
              fontSize: "0.85rem", fontWeight: 700, textTransform: "none",
              borderColor: "rgba(14,86,200,0.25)", color: "#0E56C8",
              bgcolor: "white",
              "&:hover": { bgcolor: "#EEF4FF", borderColor: "#0E56C8" },
            }}
          >
            Show more vendors
          </Button>
        </Box>

        {/* CTA Banner */}
        <Box sx={{
          mt: { xs: 6, md: 8 },
          p: { xs: 3.5, md: 5 },
          borderRadius: "2rem",
          background: "linear-gradient(135deg, #0A1F4E 0%, #0E56C8 60%, #0A3A8A 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 24px 56px rgba(14,86,200,0.22)",
        }}>
          <Box sx={{
            position: "absolute", top: -60, right: -60,
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <Box sx={{
            position: "absolute", bottom: -40, left: "30%",
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(21,217,124,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label="Free Service" sx={{
                mb: 2, height: 26, bgcolor: "rgba(229,242,13,0.15)",
                color: "#E5F20D", border: "1px solid rgba(229,242,13,0.25)",
                fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.1em",
                "& .MuiChip-label": { px: 1.2 },
              }} />
              <Typography sx={{
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em",
              }}>
                Can&apos;t decide on the{" "}
                <Box component="span" sx={{ color: "#15D97C" }}>right provider?</Box>
              </Typography>
              <Typography sx={{
                mt: 1.5, maxWidth: 440,
                color: "rgba(239,245,255,0.78)", fontSize: "0.96rem", lineHeight: 1.65,
              }}>
                Our solar advisors compare quotes and find the best fit for your home — completely free, no obligation.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 48, px: 2.5, borderRadius: "0.8rem",
                    fontSize: "0.9rem", fontWeight: 700, textTransform: "none",
                    bgcolor: "#E5F20D", color: "#162331",
                    boxShadow: "0 10px 24px rgba(229,242,13,0.25)",
                    "&:hover": { bgcolor: "#D4E00C" },
                  }}
                >
                  Get Free Consultation
                </Button>
                <Button
                  component={RouterLink}
                  to="/booking"
                  variant="contained"
                  sx={{
                    minHeight: 48, px: 2.5, borderRadius: "0.8rem",
                    fontSize: "0.9rem", fontWeight: 700, textTransform: "none",
                    bgcolor: "rgba(255,255,255,0.1)", color: "white",
                    border: "1px solid rgba(255,255,255,0.18)", boxShadow: "none",
                  }}
                >
                  Book Installation
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{
                ml: { md: "auto" },
                maxWidth: { xs: "100%", md: 300 },
                minHeight: 220,
                borderRadius: "1.5rem",
                overflow: "hidden",
                backgroundImage: `url(${vendorConsultPlaceholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
              }} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

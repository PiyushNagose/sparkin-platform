import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { publicVendorsApi } from "@/features/public/api/vendorsApi";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing, publicTypography } from "@/features/public/pages/publicPageStyles";
import solarHeroImg from "@/shared/assets/images/public/vendors/tata-power-hero-placeholder.png";
import solarSpecImg from "@/shared/assets/images/public/vendors/tata-power-spec-placeholder.png";

const staticRoadmap = [
  ["Site Survey & Shadow Analysis", "Day 1–2 | Roof photos and energy usage are verified on-site."],
  ["Design & Material Procurement", "Day 3–7 | Engineering layout finalised and logistics coordinated."],
  ["Installation & Commissioning", "Day 8–15 | Structural mounting, wiring, and net-metering application."],
];

const staticTestimonials = [
  {
    quote: "The installation was seamless. The team explained the subsidy payback clearly. My electricity bill has dropped significantly.",
    name: "Arun Kumar",
    meta: "Verified Customer",
    initials: "AK",
  },
  {
    quote: "Great product quality. The monitoring is very helpful to see daily energy production. Highly recommend.",
    name: "Priya Bose",
    meta: "Verified Customer",
    initials: "PB",
  },
  {
    quote: "The delivery was fast. The team was professional and the forecast accuracy was spot-on throughout.",
    name: "Sanjay Mehta",
    meta: "Verified Customer",
    initials: "SM",
  },
];

const serviceLabels = {
  installation: "Installation",
  maintenance: "Maintenance",
  siteSurvey: "Site Survey",
  consultation: "Consultation",
};

function getLogoText(name) {
  const words = (name || "").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (name || "??").slice(0, 2).toUpperCase();
}

function StatPill({ icon, label, value }) {
  return (
    <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 80 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "0.9rem",
          bgcolor: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "white",
          display: "grid",
          placeItems: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "white", fontSize: "1.05rem", fontWeight: 800, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function MetricCard({ icon, label, value, accent }) {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.2 },
        borderRadius: "1.25rem",
        bgcolor: "rgba(255,255,255,0.88)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 8px 24px rgba(17,31,54,0.05)",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.9rem",
          bgcolor: accent?.bg || "#EFF5FF",
          color: accent?.fg || "#0E56C8",
          display: "grid",
          placeItems: "center",
          mb: 1.4,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "#8A96A8", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#1D2430", fontSize: "0.95rem", fontWeight: 700, mt: 0.45, lineHeight: 1.35 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function VendorPublicProfilePage() {
  const { vendorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");
    publicVendorsApi.getVendorProfile(vendorId)
      .then((data) => { if (active) setProfile(data); })
      .catch((err) => { if (active) setError(err?.response?.data?.message || "Could not load vendor profile."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [vendorId]);

  const companyName = profile?.company?.name || profile?.account?.fullName || "Verified Partner";
  const city = profile?.company?.city || "";
  const state = profile?.company?.state || "";
  const location = [city, state].filter(Boolean).join(", ") || "India";
  const experienceYears = profile?.company?.experienceYears;
  const projectsCompleted = profile?.company?.projectsCompleted;
  const totalCapacityMw = profile?.company?.totalCapacityMw;
  const coverageArea = profile?.company?.coverageArea;
  const businessType = profile?.company?.businessType || "EPC Contractor";
  const enabledServices = Object.entries(profile?.services || {})
    .filter(([, v]) => v)
    .map(([k]) => serviceLabels[k] || k);

  const metricCards = [
    {
      icon: <SolarPowerRoundedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Business Type",
      value: businessType,
      accent: { bg: "#EFF5FF", fg: "#0E56C8" },
    },
    {
      icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Experience",
      value: experienceYears ? `${experienceYears}+ Years` : "Experienced",
      accent: { bg: "#FFF8E1", fg: "#C47A00" },
    },
    {
      icon: <EmojiEventsRoundedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Projects Done",
      value: projectsCompleted ? `${projectsCompleted}+` : "Multiple",
      accent: { bg: "#EDFFF5", fg: "#0A7A40" },
    },
    {
      icon: <BoltRoundedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Total Capacity",
      value: totalCapacityMw ? `${totalCapacityMw} MW` : "On Request",
      accent: { bg: "#FFF0F0", fg: "#C0392B" },
    },
    {
      icon: <PlaceOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Coverage Area",
      value: coverageArea || location,
      accent: { bg: "#F3EEFF", fg: "#6B3FA0" },
    },
    {
      icon: <ShieldOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
      label: "Verification",
      value: profile?.verificationStatus === "verified" ? "Verified Partner" : "Registered",
      accent: { bg: "#E8F5E9", fg: "#2E7D32" },
    },
  ];

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          minHeight: "calc(100vh - 72px)",
          background: "radial-gradient(circle at top center, rgba(214,229,246,0.72) 0%, rgba(247,250,252,0.98) 24%, #F9FBFD 68%, #F7FAFB 100%)",
        }}
      >
        {isLoading ? (
          <Box sx={{ py: 14, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Container maxWidth={false} disableGutters className={styles.contentContainer} sx={{ py: publicPageSpacing.pageYCompact }}>
            <Stack spacing={2} alignItems="flex-start">
              <Button component={RouterLink} to="/vendors" startIcon={<ArrowBackRoundedIcon />}
                sx={{ px: 0, color: "#657082", fontSize: "0.84rem", fontWeight: 700, textTransform: "none" }}>
                Back to Vendors
              </Button>
              <Alert severity="error" sx={{ borderRadius: "0.9rem", width: "100%" }}>{error}</Alert>
            </Stack>
          </Container>
        ) : (
          <>
            {/* ── HERO BANNER ── */}
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: 320, md: 400 },
                backgroundImage: `linear-gradient(160deg, rgba(7,17,36,0.82) 0%, rgba(10,30,70,0.72) 50%, rgba(7,17,36,0.86) 100%), url(${solarHeroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "hidden",
              }}
            >
              {/* subtle grid overlay */}
              <Box sx={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }} />

              <Container maxWidth={false} disableGutters className={styles.contentContainer}>
                <Box sx={{ pt: { xs: 3.5, md: 4.5 }, pb: { xs: 4, md: 5.5 } }}>
                  <Button
                    component={RouterLink}
                    to="/vendors"
                    startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />}
                    sx={{
                      mb: 3,
                      px: 1.4,
                      py: 0.55,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "none",
                      backdropFilter: "blur(8px)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                    }}
                  >
                    Back to Vendors
                  </Button>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2.5, md: 4 }} alignItems={{ xs: "flex-start", md: "flex-end" }} justifyContent="space-between">
                    <Box>
                      {/* Logo + name row */}
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.8 }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "1.1rem",
                            bgcolor: "#0E56C8",
                            color: "white",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "1.2rem",
                            fontWeight: 900,
                            boxShadow: "0 12px 28px rgba(14,86,200,0.35)",
                            flexShrink: 0,
                          }}
                        >
                          {getLogoText(companyName)}
                        </Box>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography variant="h1" sx={{ color: "white", ...publicTypography.pageTitle, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
                              {companyName}
                            </Typography>
                            {profile?.verificationStatus === "verified" && (
                              <Chip label="Verified" sx={{ height: 22, bgcolor: "#21C27B", color: "white", fontSize: "0.58rem", fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", borderRadius: 999 }} />
                            )}
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.6 }}>
                            <PlaceOutlinedIcon sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.84rem" }}>{location}</Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Rating row */}
                      <Stack direction="row" spacing={0.4} alignItems="center" sx={{ mb: 2.2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarRoundedIcon key={i} sx={{ fontSize: "1rem", color: "#F3BB32" }} />
                        ))}
                        <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.84rem", fontWeight: 700, ml: 0.5 }}>4.5</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>(Verified Partner)</Typography>
                      </Stack>

                      {/* Stats row */}
                      <Stack direction="row" spacing={{ xs: 2.5, md: 4 }} flexWrap="wrap" useFlexGap>
                        <StatPill icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: "1.1rem" }} />} label="Experience" value={experienceYears ? `${experienceYears}+ Yrs` : "Exp."} />
                        <StatPill icon={<EmojiEventsRoundedIcon sx={{ fontSize: "1.1rem" }} />} label="Projects" value={projectsCompleted ? `${projectsCompleted}+` : "Many"} />
                        <StatPill icon={<BoltRoundedIcon sx={{ fontSize: "1.1rem" }} />} label="Capacity" value={totalCapacityMw ? `${totalCapacityMw} MW` : "—"} />
                      </Stack>
                    </Box>

                    {/* CTA card on hero */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: "100%", md: 240 },
                        p: 2.2,
                        borderRadius: "1.4rem",
                        bgcolor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Interested?
                      </Typography>
                      <Typography sx={{ color: "white", fontSize: "1.3rem", fontWeight: 800, mt: 0.4, mb: 1.8, lineHeight: 1.2 }}>
                        Get a free quote today
                      </Typography>
                      <Stack spacing={1}>
                        <Button
                          component={RouterLink}
                          to="/booking"
                          variant="contained"
                          sx={{
                            minHeight: 44,
                            borderRadius: "0.85rem",
                            fontSize: "0.84rem",
                            fontWeight: 700,
                            textTransform: "none",
                            background: "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)",
                            boxShadow: "0 10px 22px rgba(14,86,200,0.35)",
                          }}
                        >
                          Get a Quote
                        </Button>
                        <Button
                          sx={{
                            minHeight: 40,
                            borderRadius: "0.85rem",
                            bgcolor: "rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.88)",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            textTransform: "none",
                            border: "1px solid rgba(255,255,255,0.18)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                          }}
                        >
                          Request a Call
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Container>
            </Box>

            {/* ── BODY ── */}
            <Container maxWidth={false} disableGutters className={styles.contentContainer} sx={{ py: { xs: 4.5, md: 6 } }}>
              <Stack spacing={{ xs: 4, md: 5 }}>

                {/* Metric cards row */}
                <Grid container spacing={{ xs: 1.6, md: 2 }}>
                  {metricCards.map((card) => (
                    <Grid key={card.label} size={{ xs: 6, sm: 4, md: 2 }}>
                      <MetricCard {...card} />
                    </Grid>
                  ))}
                </Grid>

                {/* Solar panel image + about */}
                <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      sx={{
                        height: "100%",
                        minHeight: { xs: 220, md: 320 },
                        borderRadius: "1.6rem",
                        overflow: "hidden",
                        backgroundImage: `url(${solarHeroImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 20px 48px rgba(17,31,54,0.14)",
                        position: "relative",
                      }}
                    >
                      {/* overlay badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: 16,
                          px: 1.4,
                          py: 0.7,
                          borderRadius: "0.9rem",
                          bgcolor: "rgba(14,86,200,0.92)",
                          backdropFilter: "blur(8px)",
                          color: "white",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: 0.3,
                        }}
                      >
                        Solar Installation Specialists
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Box
                      sx={{
                        height: "100%",
                        p: { xs: 2.4, md: 3 },
                        borderRadius: "1.6rem",
                        bgcolor: "rgba(255,255,255,0.94)",
                        border: "1px solid #E8EDF5",
                        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 1.1,
                            py: 0.4,
                            borderRadius: 999,
                            bgcolor: "#EFF5FF",
                            color: "#0E56C8",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            textTransform: "uppercase",
                            mb: 1.5,
                          }}
                        >
                          About {companyName}
                        </Box>
                        <Typography sx={{ color: "#202938", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1.3, mb: 1.2 }}>
                          Trusted solar partner for homes &amp; businesses
                        </Typography>
                        <Typography sx={{ color: "#667084", fontSize: "0.88rem", lineHeight: 1.72 }}>
                          {companyName} is a verified solar partner offering{" "}
                          {enabledServices.length > 0 ? enabledServices.join(", ") : "solar services"}{" "}
                          across {coverageArea || location}. With {experienceYears ? `${experienceYears}+ years` : "years"} of experience
                          and {projectsCompleted ? `${projectsCompleted}+ completed projects` : "multiple completed projects"},
                          they bring proven expertise to every installation.
                        </Typography>
                      </Box>

                      {/* Service tags */}
                      {enabledServices.length > 0 && (
                        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.8} sx={{ mt: 2.2 }}>
                          {enabledServices.map((s) => (
                            <Stack key={s} direction="row" spacing={0.5} alignItems="center"
                              sx={{ px: 1.1, py: 0.5, borderRadius: "0.55rem", bgcolor: "#EDFFF5", color: "#0A7A40" }}>
                              <CheckCircleRoundedIcon sx={{ fontSize: "0.78rem" }} />
                              <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.3 }}>
                                {s}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {/* Spec image + company details */}
                <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Box
                      sx={{
                        p: { xs: 2.4, md: 3 },
                        borderRadius: "1.6rem",
                        bgcolor: "rgba(255,255,255,0.94)",
                        border: "1px solid #E8EDF5",
                        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
                        height: "100%",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.2 }}>
                        <Box sx={{ width: 4, height: 22, borderRadius: 999, bgcolor: "#0E56C8" }} />
                        <Typography sx={{ color: "#202938", fontSize: "1.05rem", fontWeight: 800 }}>
                          Company Details
                        </Typography>
                      </Stack>
                      <Stack spacing={1.8}>
                        {[
                          ["Location", location],
                          ["Business Type", businessType],
                          ["Coverage Area", coverageArea || location],
                          ["Total Capacity", totalCapacityMw ? `${totalCapacityMw} MW` : "On Request"],
                        ].map(([label, value]) => (
                          <Stack key={label} direction="row" justifyContent="space-between" alignItems="flex-start"
                            sx={{ pb: 1.6, borderBottom: "1px solid #F0F4FA", "&:last-child": { borderBottom: "none", pb: 0 } }}>
                            <Typography sx={{ color: "#8A96A8", fontSize: "0.78rem", fontWeight: 700 }}>{label}</Typography>
                            <Typography sx={{ color: "#202938", fontSize: "0.84rem", fontWeight: 700, textAlign: "right", maxWidth: "55%" }}>{value}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Box
                      sx={{
                        height: "100%",
                        minHeight: { xs: 200, md: 280 },
                        borderRadius: "1.6rem",
                        overflow: "hidden",
                        backgroundImage: `url(${solarSpecImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 20px 48px rgba(17,31,54,0.12)",
                        position: "relative",
                      }}
                    >
                      <Box sx={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(10,20,40,0.55) 0%, transparent 55%)",
                      }} />
                      <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          Verified Solar Partner
                        </Typography>
                        <Typography sx={{ color: "white", fontSize: "1rem", fontWeight: 800, mt: 0.3 }}>
                          {companyName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Installation Roadmap */}
                <Box
                  sx={{
                    p: { xs: 2.4, md: 3.2 },
                    borderRadius: "1.6rem",
                    bgcolor: "rgba(255,255,255,0.94)",
                    border: "1px solid #E8EDF5",
                    boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.8 }}>
                    <Box sx={{ width: 4, height: 22, borderRadius: 999, bgcolor: "#0E56C8" }} />
                    <Typography sx={{ color: "#202938", fontSize: "1.05rem", fontWeight: 800 }}>
                      Typical Installation Roadmap
                    </Typography>
                  </Stack>
                  <Stack spacing={0}>
                    {staticRoadmap.map(([title, text], index) => (
                      <Stack key={title} direction="row" spacing={2} alignItems="stretch">
                        <Stack alignItems="center" sx={{ flexShrink: 0, width: 24 }}>
                          <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "#0E56C8", boxShadow: "0 0 0 4px rgba(14,86,200,0.12)", flexShrink: 0, mt: 0.3 }} />
                          {index < staticRoadmap.length - 1 && (
                            <Box sx={{ width: 2, flex: 1, bgcolor: "#D8E3F4", my: 0.5 }} />
                          )}
                        </Stack>
                        <Box sx={{ pb: index < staticRoadmap.length - 1 ? 2.5 : 0 }}>
                          <Typography sx={{ color: "#202938", fontSize: "0.94rem", fontWeight: 700 }}>{title}</Typography>
                          <Typography sx={{ color: "#687487", fontSize: "0.82rem", lineHeight: 1.65, mt: 0.3 }}>{text}</Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Testimonials */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.4 }}>
                    <Box sx={{ width: 4, height: 22, borderRadius: 999, bgcolor: "#0E56C8" }} />
                    <Typography sx={{ color: "#202938", fontSize: "1.05rem", fontWeight: 800 }}>
                      Customer Testimonials
                    </Typography>
                  </Stack>
                  <Grid container spacing={{ xs: 2, md: 2.2 }}>
                    {staticTestimonials.map((item) => (
                      <Grid key={item.name} size={{ xs: 12, md: 4 }}>
                        <Box
                          sx={{
                            p: { xs: 2.2, md: 2.6 },
                            borderRadius: "1.4rem",
                            bgcolor: "rgba(255,255,255,0.94)",
                            border: "1px solid #E8EDF5",
                            boxShadow: "0 14px 28px rgba(17,31,54,0.05)",
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* decorative quote mark */}
                          <Typography sx={{ position: "absolute", top: 8, right: 18, fontSize: "5rem", lineHeight: 1, color: "#EEF4FF", fontWeight: 900, userSelect: "none" }}>
                            "
                          </Typography>
                          <Stack spacing={1.6} sx={{ position: "relative" }}>
                            <Stack direction="row" spacing={0.3}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarRoundedIcon key={i} sx={{ fontSize: "0.95rem", color: "#F2B12A" }} />
                              ))}
                            </Stack>
                            <Typography sx={{ color: "#425062", fontSize: "0.86rem", lineHeight: 1.75 }}>
                              &ldquo;{item.quote}&rdquo;
                            </Typography>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#EAF0FA", color: "#0E56C8", display: "grid", placeItems: "center", fontSize: "0.82rem", fontWeight: 800, flexShrink: 0 }}>
                                {item.initials}
                              </Box>
                              <Box>
                                <Typography sx={{ color: "#202938", fontSize: "0.88rem", fontWeight: 700 }}>{item.name}</Typography>
                                <Typography sx={{ color: "#8A93A4", fontSize: "0.72rem" }}>{item.meta}</Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Bottom CTA strip */}
                <Box
                  sx={{
                    p: { xs: 2.4, md: 3.2 },
                    borderRadius: "1.6rem",
                    background: "linear-gradient(135deg, #0A1F4E 0%, #0E56C8 65%, #0A3A8A 100%)",
                    boxShadow: "0 20px 48px rgba(14,86,200,0.22)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
                  <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} sx={{ position: "relative" }}>
                    <Box>
                      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Ready to go solar?
                      </Typography>
                      <Typography sx={{ color: "white", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 800, lineHeight: 1.15, mt: 0.5, letterSpacing: "-0.03em" }}>
                        Start your journey with {companyName}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem", mt: 0.8 }}>
                        Get a personalised quote in minutes — no commitment required.
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ flexShrink: 0, width: { xs: "100%", md: "auto" } }}>
                      <Button
                        startIcon={<DownloadRoundedIcon />}
                        sx={{
                          minHeight: 46, px: 2.2, borderRadius: "0.9rem",
                          bgcolor: "rgba(255,255,255,0.12)", color: "white",
                          fontSize: "0.84rem", fontWeight: 700, textTransform: "none",
                          border: "1px solid rgba(255,255,255,0.2)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                        }}
                      >
                        Download Brochure
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/booking"
                        variant="contained"
                        sx={{
                          minHeight: 46, px: 2.4, borderRadius: "0.9rem",
                          bgcolor: "#E5F20D", color: "#162331",
                          fontSize: "0.84rem", fontWeight: 800, textTransform: "none",
                          boxShadow: "0 10px 24px rgba(229,242,13,0.22)",
                          "&:hover": { bgcolor: "#D4E00C" },
                        }}
                      >
                        Get a Free Quote
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

              </Stack>
            </Container>
          </>
        )}
      </Box>
    </Box>
  );
}

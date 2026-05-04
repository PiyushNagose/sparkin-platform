import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import tataPowerHeroPlaceholder from "@/shared/assets/images/public/vendors/tata-power-hero-placeholder.png";
import tataPowerSpecPlaceholder from "@/shared/assets/images/public/vendors/tata-power-spec-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const quickFacts = [
  {
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    label: "System Capacity",
    value: "5kW on-grid efficiency mono-crystalline panels",
  },
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: "1.15rem" }} />,
    label: "Warranty",
    value: "25-year performance warranty on PV modules",
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    label: "Installation",
    value: "Standard timeline of 15 days from site survey",
  },
  {
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    label: "Maintenance",
    value: "5-year AMC included with annual site visits",
  },
];

const specs = [
  ["Panel Type", "Mono-PERC Half Cut"],
  ["Inverter Technology", "String Inverter (MPPT)"],
  ["Structure Material", "Hot Dipped Galvanised Steel"],
  ["Monitoring App", "Tata Solar Smart Connect"],
];

const serviceCards = [
  {
    value: "25 Years",
    title: "Performance Warranty",
    text: "Guaranteed panel output will stay above 80% after 25 years of operation.",
  },
  {
    value: "10 Years",
    title: "Product Warranty",
    text: "Coverage for manufacturing defects in panels and inverter unit.",
  },
  {
    value: "5 Years",
    title: "Free AMC",
    text: "Annual maintenance visits and basic helpline support are included.",
  },
];

const roadmap = [
  ["Site Survey & Shadow Analysis", "Day 1-2 | Roof photos and energy usage are verified."],
  ["Design & Material Procurement", "Day 3-7 | Engineering layout finalised and logistics coordinated."],
  ["Installation & Commissioning", "Day 8-15 | Structural mounting, wiring, and net-metering application."],
];

const testimonials = [
  {
    quote:
      "The installation was seamless. Tata's team explained the subsidy payback clearly. My electricity bill has dropped by 60%.",
    name: "Arun Kumar",
    meta: "Vadodara, Gujarat",
    initials: "AK",
  },
  {
    quote:
      "Great product quality. The app monitoring is very helpful to see daily energy production. Highly recommend the 5kW system.",
    name: "Priya Bose",
    meta: "Virar, Maharashtra",
    initials: "PB",
  },
  {
    quote:
      "The delivery for our home was fast. The team was professional and the forecast accuracy was spot-on throughout.",
    name: "Sanjay Mehta",
    meta: "Whitefield, Karnataka",
    initials: "SM",
  },
];

function InfoCard({ icon, label, value }) {
  return (
    <Stack spacing={1.2} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.95rem",
          bgcolor: "#EFF5FF",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "#1D2430", fontSize: "0.92rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#687487", fontSize: "0.84rem", lineHeight: 1.6 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function VendorTataPowerPage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.72) 0%, rgba(247,250,252,0.98) 24%, #F9FBFD 68%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Stack spacing={{ xs: 4, md: 5 }}>
            {/* Back button */}
            <Button
              component={RouterLink}
              to="/quotes/compare"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                width: "fit-content",
                px: 0,
                minHeight: 32,
                color: "#657082",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "#1F2937" },
              }}
            >
              Back to Vendors
            </Button>

            {/* Hero section */}
            <Grid container spacing={{ xs: 3.5, md: 4 }} alignItems="start">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2.8}>
                  {/* Title block */}
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.2}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          color: "#20242B",
                          ...publicTypography.pageTitle,
                        }}
                      >
                        Tata Power Solar
                      </Typography>
                      <Chip
                        label="Top Rated"
                        sx={{
                          height: 24,
                          bgcolor: "#EAF56F",
                          color: "#5A6400",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          letterSpacing: 0.32,
                          textTransform: "uppercase",
                          borderRadius: 999,
                        }}
                      />
                      <Stack direction="row" spacing={0.4} alignItems="center">
                        <StarRoundedIcon sx={{ fontSize: "0.95rem", color: "#F3BB32" }} />
                        <Typography sx={{ color: "#283344", fontSize: "0.84rem", fontWeight: 700 }}>
                          4.8
                        </Typography>
                        <Typography sx={{ color: "#7B8696", fontSize: "0.8rem" }}>
                          (4,814 reviews)
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      sx={{
                        mt: 1.2,
                        color: "#667084",
                        fontSize: "1rem",
                        lineHeight: 1.65,
                        maxWidth: 690,
                      }}
                    >
                      India&apos;s largest integrated solar company with over 3 decades of expertise
                      in providing sustainable energy solutions for residential and commercial spaces.
                    </Typography>
                  </Box>

                  {/* Hero image + pricing card */}
                  <Box
                    sx={{
                      p: { xs: 1.8, md: 2 },
                      borderRadius: "1.6rem",
                      bgcolor: "rgba(255,255,255,0.82)",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 16px 34px rgba(17,31,54,0.06)",
                    }}
                  >
                    <Grid container spacing={2} alignItems="stretch">
                      <Grid size={{ xs: 12, md: 7.7 }}>
                        <Box
                          sx={{
                            minHeight: { xs: 260, md: 320 },
                            borderRadius: "1.2rem",
                            overflow: "hidden",
                            backgroundImage: `url(${tataPowerHeroPlaceholder})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            boxShadow: "0 14px 30px rgba(17,31,54,0.14)",
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4.3 }}>
                        <Box
                          sx={{
                            height: "100%",
                            p: { xs: 2, md: 2.4 },
                            borderRadius: "1.2rem",
                            bgcolor: "#FFFFFF",
                            border: "1px solid #E7ECF4",
                            boxShadow: "0 14px 28px rgba(17,31,54,0.04)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Stack spacing={1.6}>
                            <Stack direction="row" justifyContent="space-between" alignItems="start">
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#8B96A7",
                                    fontSize: "0.62rem",
                                    fontWeight: 800,
                                    letterSpacing: 0.4,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Starting From
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#0E56C8",
                                    fontSize: { xs: "2rem", md: "2.2rem" },
                                    fontWeight: 800,
                                    letterSpacing: "-0.04em",
                                    lineHeight: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  ₹2,85,000
                                </Typography>
                              </Box>
                              <Chip
                                label="+6% off"
                                sx={{
                                  height: 24,
                                  bgcolor: "#EAF2FF",
                                  color: "#0E56C8",
                                  fontSize: "0.6rem",
                                  fontWeight: 800,
                                  borderRadius: 999,
                                  textTransform: "uppercase",
                                }}
                              />
                            </Stack>

                            <Grid container spacing={1.2}>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.3, borderRadius: "1rem", bgcolor: "#F6F8FB" }}>
                                  <Typography
                                    sx={{
                                      color: "#8A93A4",
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.3,
                                    }}
                                  >
                                    System Size
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#243142",
                                      fontSize: "0.92rem",
                                      fontWeight: 700,
                                      mt: 0.5,
                                    }}
                                  >
                                    5kW
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.3, borderRadius: "1rem", bgcolor: "#F6F8FB" }}>
                                  <Typography
                                    sx={{
                                      color: "#8A93A4",
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.3,
                                    }}
                                  >
                                    Capacity
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#243142",
                                      fontSize: "0.92rem",
                                      fontWeight: 700,
                                      mt: 0.5,
                                    }}
                                  >
                                    5kW Capacity
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            <Box sx={{ p: 1.3, borderRadius: "1rem", bgcolor: "#F6F8FB" }}>
                              <Typography
                                sx={{
                                  color: "#8A93A4",
                                  fontSize: "0.6rem",
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.3,
                                }}
                              >
                                Net Payable
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#1E2736",
                                  fontSize: "1.2rem",
                                  fontWeight: 800,
                                  mt: 0.5,
                                }}
                              >
                                ₹2,67,000
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack spacing={1.2} sx={{ mt: 2.4 }}>
                            <Button
                              component={RouterLink}
                              to="/vendors/tata-power-solar/confirm"
                              variant="contained"
                              sx={{
                                minHeight: 46,
                                borderRadius: "0.9rem",
                                fontSize: "0.88rem",
                                fontWeight: 700,
                                textTransform: "none",
                                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                                boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
                              }}
                            >
                              Select Vendor
                            </Button>
                            <Button
                              sx={{
                                minHeight: 46,
                                borderRadius: "0.9rem",
                                bgcolor: "#F4F7FB",
                                color: "#202938",
                                fontSize: "0.88rem",
                                fontWeight: 700,
                                textTransform: "none",
                              }}
                            >
                              Request a Call
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>

              {/* Quick facts sidebar */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Grid container spacing={{ xs: 2, md: 2 }}>
                  {quickFacts.map((fact) => (
                    <Grid key={fact.label} size={{ xs: 12, sm: 6, md: 12 }}>
                      <Box
                        sx={{
                          p: { xs: 2, md: 2.2 },
                          borderRadius: "1.25rem",
                          bgcolor: "rgba(255,255,255,0.88)",
                          border: "1px solid #E8EDF5",
                          boxShadow: "0 14px 28px rgba(17,31,54,0.04)",
                          height: "100%",
                        }}
                      >
                        <InfoCard {...fact} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* System Specification */}
            <Box
              sx={{
                p: { xs: 2.4, md: 3 },
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2}>
                    <Typography sx={{ color: "#202938", fontSize: "1.1rem", fontWeight: 800 }}>
                      System Specification
                    </Typography>
                    <Grid container spacing={1.8}>
                      {specs.map(([label, value]) => (
                        <Grid key={label} size={{ xs: 12, sm: 6 }}>
                          <Stack spacing={0.5}>
                            <Typography
                              sx={{
                                color: "#8A93A4",
                                fontSize: "0.62rem",
                                fontWeight: 800,
                                letterSpacing: 0.3,
                                textTransform: "uppercase",
                              }}
                            >
                              {label}
                            </Typography>
                            <Typography sx={{ color: "#243142", fontSize: "0.92rem", fontWeight: 700 }}>
                              {value}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box
                    sx={{
                      minHeight: 250,
                      borderRadius: "1.2rem",
                      overflow: "hidden",
                      backgroundImage: `url(${tataPowerSpecPlaceholder})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Warranty & Service */}
            <Box
              sx={{
                p: { xs: 2.4, md: 3 },
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Typography sx={{ color: "#202938", fontSize: "1.1rem", fontWeight: 800, mb: 2 }}>
                Warranty & Post-Purchase Service
              </Typography>
              <Grid container spacing={{ xs: 1.8, md: 2 }}>
                {serviceCards.map((card) => (
                  <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: { xs: 2, md: 2.2 },
                        borderRadius: "1.1rem",
                        bgcolor: "#F7F9FC",
                        border: "1px solid #EBF0F6",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ color: "#0E56C8", fontSize: "1rem", fontWeight: 800 }}>
                        {card.value}
                      </Typography>
                      <Typography
                        sx={{ color: "#202938", fontSize: "0.9rem", fontWeight: 700, mt: 0.7 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.82rem", lineHeight: 1.6, mt: 0.6 }}>
                        {card.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Installation Roadmap */}
            <Box
              sx={{
                p: { xs: 2.4, md: 3 },
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Typography sx={{ color: "#202938", fontSize: "1.1rem", fontWeight: 800, mb: 2 }}>
                Installation Roadmap
              </Typography>
              <Stack spacing={1.8}>
                {roadmap.map(([title, text], index) => (
                  <Stack key={title} direction="row" spacing={1.5} alignItems="start">
                    <Box sx={{ pt: 0.4, flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#0E56C8",
                          boxShadow: "0 0 0 5px rgba(14,86,200,0.1)",
                        }}
                      />
                      {index < roadmap.length - 1 ? (
                        <Box sx={{ width: 2, minHeight: 36, bgcolor: "#D8E3F4", mt: 0.5, ml: "5px" }} />
                      ) : null}
                    </Box>
                    <Box sx={{ pb: 0.5 }}>
                      <Typography sx={{ color: "#202938", fontSize: "0.94rem", fontWeight: 700 }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.82rem", lineHeight: 1.6, mt: 0.3 }}>
                        {text}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Testimonials */}
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Typography sx={{ color: "#202938", fontSize: "1.1rem", fontWeight: 800 }}>
                  Customer Testimonials
                </Typography>
                <Button
                  sx={{
                    px: 0,
                    minHeight: 28,
                    color: "#0E56C8",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  View All Reviews
                </Button>
              </Stack>
              <Grid container spacing={{ xs: 2, md: 2.2 }}>
                {testimonials.map((item) => (
                  <Grid key={item.name} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: { xs: 2, md: 2.4 },
                        borderRadius: "1.25rem",
                        bgcolor: "rgba(255,255,255,0.92)",
                        border: "1px solid #E8EDF5",
                        boxShadow: "0 14px 28px rgba(17,31,54,0.04)",
                        height: "100%",
                      }}
                    >
                      <Stack spacing={1.4}>
                        <Stack direction="row" spacing={0.25}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarRoundedIcon key={index} sx={{ fontSize: "1rem", color: "#F2B12A" }} />
                          ))}
                        </Stack>
                        <Typography sx={{ color: "#425062", fontSize: "0.84rem", lineHeight: 1.72 }}>
                          &ldquo;{item.quote}&rdquo;
                        </Typography>
                        <Stack direction="row" spacing={1.1} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              bgcolor: "#EAF0FA",
                              color: "#0E56C8",
                              display: "grid",
                              placeItems: "center",
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {item.initials}
                          </Box>
                          <Box>
                            <Typography sx={{ color: "#202938", fontSize: "0.88rem", fontWeight: 700 }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ color: "#8A93A4", fontSize: "0.74rem" }}>
                              {item.meta}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            {/* Bottom CTA bar */}
            <Box
              sx={{
                p: { xs: 2, md: 2.4 },
                borderRadius: "1.4rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2.5}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#8A93A4",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                    }}
                  >
                    Ready to Switch?
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
                    <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 700 }}>
                      Tata Power Solar
                    </Typography>
                    <Typography sx={{ color: "#0E56C8", fontSize: "1.05rem", fontWeight: 800 }}>
                      ₹2,85,000
                    </Typography>
                  </Stack>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Button
                    startIcon={<DownloadRoundedIcon />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minHeight: 46,
                      px: 2,
                      borderRadius: "0.9rem",
                      bgcolor: "#F4F7FB",
                      color: "#202938",
                      fontSize: "0.86rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Download Quote
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/vendors/tata-power-solar/confirm"
                    variant="contained"
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minHeight: 46,
                      px: 2.2,
                      borderRadius: "0.9rem",
                      fontSize: "0.86rem",
                      fontWeight: 700,
                      textTransform: "none",
                      background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
                    }}
                  >
                    Select Vendor
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

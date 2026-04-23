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
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "1rem" }} />,
    label: "System Capacity",
    value: "5kW on-grid efficiency mono-crystalline panels",
  },
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: "1rem" }} />,
    label: "Warranty",
    value: "25-year performance warranty on PV modules",
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: "1rem" }} />,
    label: "Installation",
    value: "Standard timeline of 15 days from site survey",
  },
  {
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: "1rem" }} />,
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
    <Stack spacing={0.95} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "0.85rem",
          bgcolor: "#EFF5FF",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "#1D2430", fontSize: "0.8rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#687487", fontSize: "0.72rem", lineHeight: 1.55 }}>
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
          <Stack spacing={{ xs: 3.5, md: 4.1 }}>
            <Button
              component={RouterLink}
              to="/quotes/compare"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                width: "fit-content",
                px: 0,
                minHeight: 28,
                color: "#657082",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "#1F2937" },
              }}
            >
              Back to Vendors
            </Button>

            <Grid container spacing={{ xs: 3, md: 3.3 }} alignItems="start">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2.15}>
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.05}
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
                          height: 22,
                          bgcolor: "#EAF56F",
                          color: "#5A6400",
                          fontSize: "0.54rem",
                          fontWeight: 800,
                          letterSpacing: 0.32,
                          textTransform: "uppercase",
                          borderRadius: 999,
                        }}
                      />
                      <Stack direction="row" spacing={0.32} alignItems="center">
                        <StarRoundedIcon sx={{ fontSize: "0.82rem", color: "#F3BB32" }} />
                        <Typography sx={{ color: "#283344", fontSize: "0.72rem", fontWeight: 700 }}>
                          4.8
                        </Typography>
                        <Typography sx={{ color: "#7B8696", fontSize: "0.68rem" }}>
                          (4,814 reviews)
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      sx={{
                        mt: 1,
                        color: "#667084",
                        fontSize: "0.92rem",
                        lineHeight: 1.62,
                        maxWidth: 690,
                      }}
                    >
                      India&apos;s largest integrated solar company with over 3 decades of expertise
                      in providing sustainable energy solutions for residential and commercial spaces.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: { xs: 1.45, md: 1.55 },
                      borderRadius: "1.55rem",
                      bgcolor: "rgba(255,255,255,0.82)",
                      border: "1px solid #E8EDF5",
                      boxShadow: "0 16px 34px rgba(17,31,54,0.06)",
                    }}
                  >
                    <Grid container spacing={1.8} alignItems="stretch">
                      <Grid size={{ xs: 12, md: 7.7 }}>
                        <Box
                          sx={{
                            minHeight: { xs: 250, md: 290 },
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
                            p: { xs: 1.8, md: 2 },
                            borderRadius: "1.2rem",
                            bgcolor: "#FFFFFF",
                            border: "1px solid #E7ECF4",
                            boxShadow: "0 14px 28px rgba(17,31,54,0.04)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Stack spacing={1.35}>
                            <Stack direction="row" justifyContent="space-between" alignItems="start">
                              <Box>
                                <Typography
                                  sx={{
                                    color: "#8B96A7",
                                    fontSize: "0.52rem",
                                    fontWeight: 800,
                                    letterSpacing: 0.36,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Starting From
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#0E56C8",
                                    fontSize: { xs: "1.9rem", md: "2rem" },
                                    fontWeight: 800,
                                    letterSpacing: "-0.04em",
                                    lineHeight: 1,
                                    mt: 0.4,
                                  }}
                                >
                                  ₹2,85,000
                                </Typography>
                              </Box>
                              <Chip
                                label="+6% off"
                                sx={{
                                  height: 21,
                                  bgcolor: "#EAF2FF",
                                  color: "#0E56C8",
                                  fontSize: "0.5rem",
                                  fontWeight: 800,
                                  borderRadius: 999,
                                  textTransform: "uppercase",
                                }}
                              />
                            </Stack>

                            <Grid container spacing={1}>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.1, borderRadius: "0.95rem", bgcolor: "#F6F8FB" }}>
                                  <Typography
                                    sx={{
                                      color: "#8A93A4",
                                      fontSize: "0.5rem",
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.28,
                                    }}
                                  >
                                    System Size
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#243142",
                                      fontSize: "0.8rem",
                                      fontWeight: 700,
                                      mt: 0.5,
                                    }}
                                  >
                                    5kW
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.1, borderRadius: "0.95rem", bgcolor: "#F6F8FB" }}>
                                  <Typography
                                    sx={{
                                      color: "#8A93A4",
                                      fontSize: "0.5rem",
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.28,
                                    }}
                                  >
                                    Capacity
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#243142",
                                      fontSize: "0.8rem",
                                      fontWeight: 700,
                                      mt: 0.5,
                                    }}
                                  >
                                    5kW Capacity
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            <Box sx={{ p: 1.15, borderRadius: "0.95rem", bgcolor: "#F6F8FB" }}>
                              <Typography
                                sx={{
                                  color: "#8A93A4",
                                  fontSize: "0.5rem",
                                  fontWeight: 800,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.28,
                                }}
                              >
                                Net Payable
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#1E2736",
                                  fontSize: "1.05rem",
                                  fontWeight: 800,
                                  mt: 0.48,
                                }}
                              >
                                ₹2,67,000
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack spacing={1.05} sx={{ mt: 2 }}>
                            <Button
                              component={RouterLink}
                              to="/vendors/tata-power-solar/confirm"
                              variant="contained"
                              sx={{
                                minHeight: 42,
                                borderRadius: "0.85rem",
                                fontSize: "0.78rem",
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
                                minHeight: 42,
                                borderRadius: "0.85rem",
                                bgcolor: "#F4F7FB",
                                color: "#202938",
                                fontSize: "0.78rem",
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

              <Grid size={{ xs: 12, md: 4 }}>
                <Grid container spacing={{ xs: 2, md: 1.8 }}>
                  {quickFacts.map((fact) => (
                    <Grid key={fact.label} size={{ xs: 12, sm: 6, md: 12 }}>
                      <Box
                        sx={{
                          p: 1.45,
                          borderRadius: "1.15rem",
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

            <Box
              sx={{
                p: { xs: 2.05, md: 2.35 },
                borderRadius: "1.5rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Grid container spacing={{ xs: 2.4, md: 3 }} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={1.5}>
                    <Typography sx={{ color: "#202938", fontSize: "0.98rem", fontWeight: 800 }}>
                      System Specification
                    </Typography>
                    <Grid container spacing={1.3}>
                      {specs.map(([label, value]) => (
                        <Grid key={label} size={{ xs: 12, sm: 6 }}>
                          <Stack spacing={0.3}>
                            <Typography
                              sx={{
                                color: "#8A93A4",
                                fontSize: "0.52rem",
                                fontWeight: 800,
                                letterSpacing: 0.28,
                                textTransform: "uppercase",
                              }}
                            >
                              {label}
                            </Typography>
                            <Typography sx={{ color: "#243142", fontSize: "0.8rem", fontWeight: 700 }}>
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
                      minHeight: 228,
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

            <Box
              sx={{
                p: { xs: 2.05, md: 2.35 },
                borderRadius: "1.5rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Typography sx={{ color: "#202938", fontSize: "0.98rem", fontWeight: 800 }}>
                Warranty & Post-Purchase Service
              </Typography>
              <Grid container spacing={{ xs: 1.4, md: 1.6 }} sx={{ mt: 0.45 }}>
                {serviceCards.map((card) => (
                  <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 1.45,
                        borderRadius: "1rem",
                        bgcolor: "#F7F9FC",
                        border: "1px solid #EBF0F6",
                        height: "100%",
                      }}
                    >
                      <Typography sx={{ color: "#0E56C8", fontSize: "0.84rem", fontWeight: 800 }}>
                        {card.value}
                      </Typography>
                      <Typography
                        sx={{ color: "#202938", fontSize: "0.78rem", fontWeight: 700, mt: 0.55 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.7rem", lineHeight: 1.55, mt: 0.45 }}>
                        {card.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box
              sx={{
                p: { xs: 2.05, md: 2.35 },
                borderRadius: "1.5rem",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Typography sx={{ color: "#202938", fontSize: "0.98rem", fontWeight: 800 }}>
                Installation Roadmap
              </Typography>
              <Stack spacing={1.3} sx={{ mt: 1.3 }}>
                {roadmap.map(([title, text], index) => (
                  <Stack key={title} direction="row" spacing={1.1} alignItems="start">
                    <Box sx={{ pt: 0.3 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "#0E56C8",
                          boxShadow: "0 0 0 4px rgba(14,86,200,0.08)",
                        }}
                      />
                      {index < roadmap.length - 1 ? (
                        <Box sx={{ width: 2, minHeight: 32, bgcolor: "#D8E3F4", mt: 0.4, ml: 0.5 }} />
                      ) : null}
                    </Box>
                    <Box sx={{ pb: 0.25 }}>
                      <Typography sx={{ color: "#202938", fontSize: "0.82rem", fontWeight: 700 }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.7rem", lineHeight: 1.55, mt: 0.22 }}>
                        {text}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Stack spacing={1.45}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 800 }}>
                  Customer Testimonials
                </Typography>
                <Button
                  sx={{
                    px: 0,
                    minHeight: 24,
                    color: "#0E56C8",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  View All Reviews
                </Button>
              </Stack>
              <Grid container spacing={{ xs: 1.5, md: 1.8 }}>
                {testimonials.map((item) => (
                  <Grid key={item.name} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 1.45,
                        borderRadius: "1.15rem",
                        bgcolor: "rgba(255,255,255,0.92)",
                        border: "1px solid #E8EDF5",
                        boxShadow: "0 14px 28px rgba(17,31,54,0.04)",
                        height: "100%",
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={0.18}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarRoundedIcon key={index} sx={{ fontSize: "0.86rem", color: "#F2B12A" }} />
                          ))}
                        </Stack>
                        <Typography sx={{ color: "#425062", fontSize: "0.72rem", lineHeight: 1.7 }}>
                          &ldquo;{item.quote}&rdquo;
                        </Typography>
                        <Stack direction="row" spacing={0.9} alignItems="center">
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              bgcolor: "#EAF0FA",
                              color: "#0E56C8",
                              display: "grid",
                              placeItems: "center",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                            }}
                          >
                            {item.initials}
                          </Box>
                          <Box>
                            <Typography sx={{ color: "#202938", fontSize: "0.76rem", fontWeight: 700 }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ color: "#8A93A4", fontSize: "0.62rem" }}>
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

            <Box
              sx={{
                p: { xs: 1.6, md: 1.75 },
                borderRadius: "1.25rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid #E8EDF5",
                boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#8A93A4",
                      fontSize: "0.5rem",
                      fontWeight: 800,
                      letterSpacing: 0.34,
                      textTransform: "uppercase",
                    }}
                  >
                    Ready to Switch?
                  </Typography>
                  <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.45 }}>
                    <Typography sx={{ color: "#202938", fontSize: "0.9rem", fontWeight: 700 }}>
                      Tata Power Solar
                    </Typography>
                    <Typography sx={{ color: "#0E56C8", fontSize: "0.92rem", fontWeight: 800 }}>
                      ₹2,85,000
                    </Typography>
                  </Stack>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.1}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                >
                  <Button
                    startIcon={<DownloadRoundedIcon />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minHeight: 40,
                      px: 1.55,
                      borderRadius: "0.8rem",
                      bgcolor: "#F4F7FB",
                      color: "#202938",
                      fontSize: "0.74rem",
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
                      minHeight: 40,
                      px: 1.7,
                      borderRadius: "0.8rem",
                      fontSize: "0.74rem",
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

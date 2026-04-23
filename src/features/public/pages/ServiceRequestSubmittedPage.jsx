import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import QueryBuilderRoundedIcon from "@mui/icons-material/QueryBuilderRounded";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const requestFacts = [
  ["Request Type", "Maintenance"],
  ["Date", "Oct 24, 2026"],
  ["Reference ID", "#SR-8821", "#0E56C8"],
];

const lifecycleSteps = [
  "Team reviews request",
  "Technician assigned",
  "Issue resolved",
];

function FactCard({ label, value, valueColor }) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 1.12,
        borderRadius: "0.95rem",
        bgcolor: "#F5F7FB",
        border: "1px solid #EDF1F6",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          color: "#98A2B3",
          fontSize: "0.56rem",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: valueColor || "#202938",
          fontSize: "0.95rem",
          fontWeight: 800,
          lineHeight: 1.22,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ServiceRequestSubmittedPage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at center, rgba(207,245,214,0.42) 0%, rgba(237,248,240,0.2) 18%, rgba(247,250,252,0.98) 44%, #F8FBFD 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Stack alignItems="center">
            <Box
              sx={{
                width: "100%",
                maxWidth: 520,
                p: { xs: 2.4, md: 3 },
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.97)",
                border: "1px solid #E9EEF4",
                boxShadow: "0 22px 40px rgba(17,31,54,0.08)",
                textAlign: "center",
              }}
            >
              <Stack spacing={{ xs: 2.1, md: 2.4 }} alignItems="center">
                <Box
                  sx={{
                    width: 74,
                    height: 74,
                    borderRadius: "50%",
                    bgcolor: "#E6F5EB",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 10px 24px rgba(56,181,103,0.16)",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: "#0B6B31",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <CheckRoundedIcon sx={{ fontSize: "1.2rem" }} />
                  </Box>
                </Box>

                <Box sx={{ maxWidth: 520 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      color: "#20242B",
                      fontSize: { xs: "1.55rem", sm: "1.7rem", md: "1.85rem", lg: "2rem" },
                      lineHeight: 1.12,
                      letterSpacing: "-0.04em",
                      fontWeight: 800,
                      textAlign: "center",
                      maxWidth: 480,
                      mx: "auto",
                    }}
                  >
                    Request submitted successfully
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        mt: 0.35,
                        textAlign: "center",
                      }}
                    >
                      {"\uD83C\uDF89"}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#667084",
                      fontSize: "0.95rem",
                      lineHeight: 1.62,
                    }}
                  >
                    Our team has received your request and will get back to you shortly
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  {requestFacts.map(([label, value, valueColor]) => (
                    <FactCard key={label} label={label} value={value} valueColor={valueColor} />
                  ))}
                </Stack>

                <Box
                  sx={{
                    width: "100%",
                    p: { xs: 1.5, md: 1.75 },
                    borderRadius: "1.1rem",
                    bgcolor: "#F7F9FB",
                    border: "1px solid #EEF2F6",
                  }}
                >
                  <Stack spacing={1.35}>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <QueryBuilderRoundedIcon sx={{ fontSize: "0.92rem", color: "#6B6700" }} />
                      <Typography
                        sx={{
                          color: "#3A4353",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                        }}
                      >
                        Expected response within 24 hours
                      </Typography>
                    </Stack>

                    <Box sx={{ position: "relative", px: { xs: 0.5, md: 1 } }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: 15,
                          height: 1,
                          bgcolor: "#E3E8EF",
                        }}
                      />
                      <Stack direction="row" justifyContent="space-between" spacing={1.4}>
                        {lifecycleSteps.map((label, index) => {
                          const active = index === 0;
                          return (
                            <Stack
                              key={label}
                              alignItems="center"
                              spacing={0.68}
                              sx={{ position: "relative", zIndex: 1, flex: 1 }}
                            >
                              <Box
                                sx={{
                                  width: 31,
                                  height: 31,
                                  borderRadius: "50%",
                                  bgcolor: active ? "#0E56C8" : "#E8EDF4",
                                  color: active ? "white" : "#5F6979",
                                  display: "grid",
                                  placeItems: "center",
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Typography
                                sx={{
                                  color: active ? "#202938" : "#8A93A4",
                                  fontSize: "0.72rem",
                                  fontWeight: active ? 700 : 500,
                                  lineHeight: 1.35,
                                  maxWidth: 104,
                                }}
                              >
                                {label}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  sx={{ width: "100%", justifyContent: "center", pt: 0.25 }}
                >
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/service-support/track"
                    startIcon={<AssignmentTurnedInOutlinedIcon sx={{ fontSize: "1rem" }} />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minWidth: 170,
                      minHeight: 42,
                      borderRadius: "0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      textTransform: "none",
                      background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 14px 24px rgba(14,86,200,0.18)",
                    }}
                  >
                    Track Request
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/service-support"
                    startIcon={<DashboardCustomizeOutlinedIcon sx={{ fontSize: "1rem" }} />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minWidth: 170,
                      minHeight: 42,
                      borderRadius: "0.85rem",
                      bgcolor: "#EAEFF6",
                      color: "#202938",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Back to Dashboard
                  </Button>
                </Stack>

                <Stack direction="row" spacing={0.55} alignItems="center" sx={{ pt: 0.15 }}>
                  <FiberManualRecordRoundedIcon sx={{ fontSize: "0.48rem", color: "#D3DA16" }} />
                  <Typography sx={{ color: "#98A2B3", fontSize: "0.76rem" }}>
                    Redirecting you in 3 seconds...
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}


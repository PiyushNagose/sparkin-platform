import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import QueryBuilderRoundedIcon from "@mui/icons-material/QueryBuilderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import serviceNetworkPlaceholder from "@/shared/assets/images/public/support/service-track-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const statusSteps = [
  { label: "Request Submitted", status: "Completed", complete: true },
  { label: "Under Review", status: "Completed", complete: true },
  { label: "Technician Assigned", status: "In Progress", active: true },
  { label: "Issue Resolved", status: "Pending" },
];

const activityItems = [
  {
    time: "10:30 AM",
    text: "Technician Rajesh Kumar assigned to your request.",
    subtext: "Resource allocation finalized.",
    color: "#0E56C8",
  },
  {
    time: "09:15 AM",
    text: "Request reviewed and approved by Sparkin support team.",
    color: "#0B6B31",
  },
  {
    time: "08:45 AM",
    text: "Service request #SR-8821 successfully submitted.",
    color: "#0B6B31",
  },
];

function CardShell({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 1.8, md: 2.05 },
        borderRadius: "1.5rem",
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function TrackServiceRequestPage() {
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
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack spacing={{ xs: 2.8, md: 3.15 }}>
            <Box sx={{ maxWidth: 500 }}>
              <Typography
                variant="h1"
                sx={{
                  color: "#20242B",
                  ...publicTypography.pageTitle,
                  whiteSpace: { md: "nowrap" },
                }}
              >
                Track Your Service Request
                <Box
                  component="span"
                  sx={{ ml: 0.28, fontSize: "0.8em", display: "inline-block" }}
                >
                  {"\uD83D\uDCCB"}
                </Box>
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#667084",
                  fontSize: "0.84rem",
                  lineHeight: 1.58,
                }}
              >
                Stay updated on the progress of your request
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 2fr) minmax(270px, 0.9fr)",
                },
                gap: { xs: 1.7, md: 1.85 },
                alignItems: "start",
              }}
            >
              <Stack spacing={1.6}>
                <CardShell sx={{ p: { xs: 1.25, md: 1.45 }, borderRadius: "1.35rem" }}>
                  <Box sx={{ position: "relative", pt: 0.4, pb: 0.05 }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: { xs: 42, sm: 56, md: 58 },
                        right: { xs: 42, sm: 56, md: 58 },
                        top: 17,
                        height: 1.5,
                        bgcolor: "#E2E7EF",
                      }}
                    />

                    <Grid container spacing={{ xs: 1.1, sm: 1.2 }}>
                      {statusSteps.map((step) => (
                        <Grid key={step.label} size={{ xs: 6, sm: 3 }}>
                          <Stack
                            alignItems="center"
                            spacing={0.52}
                            sx={{ zIndex: 1, height: "100%" }}
                          >
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: step.complete
                                  ? "#0B6B31"
                                  : step.active
                                    ? "white"
                                    : "#E9EDF4",
                                color:
                                  step.complete || step.active
                                    ? step.complete
                                      ? "white"
                                      : "#0E56C8"
                                    : "#8A93A4",
                                border: step.active
                                  ? "3px solid #0E56C8"
                                  : "1px solid transparent",
                                boxShadow: step.active
                                  ? "0 8px 18px rgba(14,86,200,0.12)"
                                  : "none",
                              }}
                            >
                              {step.complete ? (
                                <CheckRoundedIcon sx={{ fontSize: "1rem" }} />
                              ) : step.active ? (
                                <EngineeringOutlinedIcon
                                  sx={{ fontSize: "0.96rem" }}
                                />
                              ) : (
                                <FiberManualRecordRoundedIcon
                                  sx={{ fontSize: "0.55rem" }}
                                />
                              )}
                            </Box>

                            <Typography
                              sx={{
                                color: step.active ? "#0E56C8" : "#202938",
                                fontSize: "0.64rem",
                                fontWeight: step.active ? 800 : 600,
                                textAlign: "center",
                                maxWidth: 92,
                                lineHeight: 1.32,
                              }}
                            >
                              {step.label}
                            </Typography>

                            <Typography
                              sx={{
                                color: step.active
                                  ? "#0E56C8"
                                  : step.complete
                                    ? "#0B6B31"
                                    : "#8A93A4",
                                fontSize: "0.56rem",
                                fontWeight:
                                  step.active || step.complete ? 700 : 500,
                                textAlign: "center",
                                lineHeight: 1.2,
                              }}
                            >
                              {step.status}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardShell>

                <CardShell sx={{ p: 0, overflow: "hidden", borderRadius: "1.35rem" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(250px, 0.98fr) minmax(0, 1fr)",
                      },
                    }}
                  >
                    <Box sx={{ p: { xs: 1.45, md: 1.55 }, bgcolor: "#EEF4F8" }}>
                      <Box
                        sx={{
                          px: 0.78,
                          py: 0.34,
                          borderRadius: 999,
                          bgcolor: "#D8E7FF",
                          color: "#0E56C8",
                          fontSize: "0.48rem",
                          fontWeight: 800,
                          letterSpacing: 0.28,
                          textTransform: "uppercase",
                          width: "fit-content",
                        }}
                      >
                        Current Status
                      </Box>

                      <Typography
                        sx={{
                          mt: 0.95,
                          color: "#202938",
                          fontSize: { xs: "1.45rem", md: "1.65rem" },
                          fontWeight: 800,
                          lineHeight: 1.08,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        Technician Assigned
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.52,
                          color: "#667084",
                          fontSize: "0.74rem",
                          lineHeight: 1.58,
                          maxWidth: 210,
                        }}
                      >
                        On the way to your location. Estimated arrival in 25
                        mins.
                      </Typography>

                      <Box
                        sx={{
                          mt: 1.2,
                          p: 0.92,
                          borderRadius: "1rem",
                          bgcolor: "rgba(255,255,255,0.96)",
                          border: "1px solid #E7EDF5",
                          maxWidth: 198,
                        }}
                      >
                        <Stack direction="row" spacing={0.9} alignItems="center">
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              bgcolor: "#CFE4F7",
                              display: "grid",
                              placeItems: "center",
                              color: "#0E56C8",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                            }}
                          >
                            RK
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: "0.8rem",
                                fontWeight: 800,
                              }}
                            >
                              Rajesh Kumar
                            </Typography>
                            <Typography
                              sx={{
                                color: "#667084",
                                fontSize: "0.66rem",
                                mt: 0.05,
                              }}
                            >
                              Lead Service Engineer
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.2}
                              alignItems="center"
                              sx={{ mt: 0.18 }}
                            >
                              <StarRoundedIcon
                                sx={{ fontSize: "0.72rem", color: "#F6C94A" }}
                              />
                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.64rem",
                                  fontWeight: 700,
                                }}
                              >
                                4.9
                              </Typography>
                              <Typography
                                sx={{ color: "#7C8797", fontSize: "0.62rem" }}
                              >
                                (124 reviews)
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        minHeight: { xs: 205, md: 214 },
                        position: "relative",
                        backgroundImage: `url(${serviceNetworkPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          right: 12,
                          bottom: 12,
                          px: 0.9,
                          py: 0.45,
                          borderRadius: "0.8rem",
                          bgcolor: "rgba(255,255,255,0.92)",
                          color: "#202938",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          boxShadow: "0 10px 20px rgba(17,31,54,0.12)",
                        }}
                      >
                        Live Tracking: 1.2km away
                      </Box>
                    </Box>
                  </Box>
                </CardShell>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<CallOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
                    sx={{
                      flex: 1,
                      minHeight: 40,
                      borderRadius: "0.82rem",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textTransform: "none",
                      background:
                        "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 14px 24px rgba(14,86,200,0.18)",
                    }}
                  >
                    Call Technician
                  </Button>
                  <Button
                    startIcon={
                      <ChatBubbleOutlineRoundedIcon
                        sx={{ fontSize: "0.95rem" }}
                      />
                    }
                    sx={{
                      flex: 1,
                      minHeight: 40,
                      borderRadius: "0.82rem",
                      bgcolor: "#EAEFF6",
                      color: "#202938",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Contact Support
                  </Button>
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: { xs: 0.7, md: 0.95 },
                    color: "#8C96A7",
                    fontSize: "0.66rem",
                    flexWrap: "wrap",
                    gap: 1.2,
                  }}
                >
                  <Stack direction="row" spacing={0.45} alignItems="center">
                    <FiberManualRecordRoundedIcon
                      sx={{ fontSize: "0.48rem", color: "#0B6B31" }}
                    />
                    <Typography sx={{ fontSize: "0.66rem", color: "#8C96A7" }}>
                      System Live
                    </Typography>
                    <Typography sx={{ fontSize: "0.66rem", color: "#8C96A7" }}>
                      Version 2.4.1 Enterprise
                    </Typography>
                  </Stack>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 0.4, sm: 1.6 }}
                  >
                    <Typography sx={{ fontSize: "0.66rem", color: "#8C96A7" }}>
                      Privacy Policy
                    </Typography>
                    <Typography sx={{ fontSize: "0.66rem", color: "#8C96A7" }}>
                      Terms of Service
                    </Typography>
                    <Typography sx={{ fontSize: "0.66rem", color: "#8C96A7" }}>
                      Help Center
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Stack spacing={1.6}>
                <CardShell sx={{ borderRadius: "1.35rem" }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={0.55} alignItems="center">
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: "0.88rem", color: "#0E56C8" }}
                      />
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.96rem",
                          fontWeight: 800,
                        }}
                      >
                        Summary
                      </Typography>
                    </Stack>

                    <Box>
                      <Typography
                        sx={{
                          color: "#98A2B3",
                          fontSize: "0.55rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Request Type
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.38,
                          color: "#202938",
                          fontSize: "0.96rem",
                          fontWeight: 700,
                        }}
                      >
                        Panel Cleaning
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: "#98A2B3",
                          fontSize: "0.55rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Date Submitted
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.38,
                          color: "#202938",
                          fontSize: "0.96rem",
                          fontWeight: 700,
                        }}
                      >
                        Oct 24, 2026
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: "#98A2B3",
                          fontSize: "0.55rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Reference ID
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.38,
                          color: "#0E56C8",
                          fontSize: "0.96rem",
                          fontWeight: 800,
                        }}
                      >
                        #SR-8821
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 0.65, borderTop: "1px solid #EDF1F6" }}>
                      <Typography
                        sx={{
                          color: "#98A2B3",
                          fontSize: "0.55rem",
                          fontWeight: 800,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Technician
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.38,
                          color: "#202938",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                      >
                        Rajesh Kumar
                      </Typography>
                    </Box>
                  </Stack>
                </CardShell>

                <CardShell sx={{ minHeight: { md: 214 }, borderRadius: "1.35rem" }}>
                  <Stack spacing={1.35}>
                    <Stack direction="row" spacing={0.58} alignItems="center">
                      <QueryBuilderRoundedIcon
                        sx={{ fontSize: "0.88rem", color: "#0E56C8" }}
                      />
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.96rem",
                          fontWeight: 800,
                        }}
                      >
                        Activity Timeline
                      </Typography>
                    </Stack>

                    <Stack spacing={1.35}>
                      {activityItems.map((item, index) => (
                        <Stack
                          key={`${item.time}-${index}`}
                          direction="row"
                          spacing={0.9}
                          alignItems="flex-start"
                        >
                          <Stack alignItems="center" sx={{ pt: 0.1 }}>
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: item.color,
                                color: "white",
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              {index === 0 ? (
                                <EngineeringOutlinedIcon
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              ) : (
                                <CheckRoundedIcon
                                  sx={{ fontSize: "0.72rem" }}
                                />
                              )}
                            </Box>
                            {index !== activityItems.length - 1 && (
                              <Box
                                sx={{
                                  width: 1.5,
                                  height: 34,
                                  bgcolor: "#E5EAF1",
                                  mt: 0.45,
                                }}
                              />
                            )}
                          </Stack>
                          <Box sx={{ pb: 0.15 }}>
                            <Typography
                              sx={{
                                color: item.color,
                                fontSize: "0.64rem",
                                fontWeight: 800,
                              }}
                            >
                              {item.time}
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.16,
                                color: "#202938",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                lineHeight: 1.45,
                              }}
                            >
                              {item.text}
                            </Typography>
                            {item.subtext && (
                              <Typography
                                sx={{
                                  mt: 0.18,
                                  color: "#7D8798",
                                  fontSize: "0.64rem",
                                  lineHeight: 1.48,
                                }}
                              >
                                {item.subtext}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </CardShell>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}


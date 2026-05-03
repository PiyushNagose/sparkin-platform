import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Link as MuiLink,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import serviceSystemPlaceholder from "@/shared/assets/images/public/support/service-system-placeholder.png";
import serviceUpgradePlaceholder from "@/shared/assets/images/public/support/service-upgrade-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const quickActions = [
  {
    icon: <ErrorOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    title: "Report Issue",
    text: "Instant technical alert",
    tone: "#FDEBEC",
    color: "#DE524E",
    to: "/service-support/request",
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    title: "Request Maintenance",
    text: "Book annual cleanup",
    tone: "#EEF4FF",
    color: "#0E56C8",
    to: "/service-support/request",
  },
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    title: "Warranty Claim",
    text: "File part replacements",
    tone: "#EAF8F0",
    color: "#11814E",
    to: "/service-support/request",
  },
  {
    icon: <HeadsetMicRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    title: "Contact Support",
    text: "Talk to our experts",
    tone: "#FFF3DD",
    color: "#D78E00",
    to: "/service-support/request",
  },
];

const serviceHistory = [
  {
    title: "Annual Maintenance",
    text: "Completed on Feb 12, 2026",
    badge: "Completed",
    badgeTone: "#DCF6E6",
    badgeColor: "#14824D",
    icon: <TaskAltRoundedIcon sx={{ fontSize: "0.88rem" }} />,
    iconTone: "#EAF8F0",
    iconColor: "#14824D",
  },
  {
    title: "Inverter Check",
    text: "Scheduled for Tomorrow",
    badge: "Processing",
    badgeTone: "#E9F0FF",
    badgeColor: "#0E56C8",
    icon: <WarningAmberRoundedIcon sx={{ fontSize: "0.88rem" }} />,
    iconTone: "#FFF9D5",
    iconColor: "#B8A200",
  },
  {
    title: "Grid Connection Test",
    text: "Reported Jan 05, 2024",
    badge: "Closed",
    badgeTone: "#FCE3E1",
    badgeColor: "#D14F48",
    icon: <ErrorOutlineRoundedIcon sx={{ fontSize: "0.88rem" }} />,
    iconTone: "#FDEBEC",
    iconColor: "#D14F48",
  },
];

function CardShell({ children, sx = {}, ...props }) {
  return (
    <Box
      sx={{
        p: { xs: 1.8, md: 2.05 },
        borderRadius: "1.45rem",
        bgcolor: "rgba(255,255,255,0.95)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default function ServiceSupportPage() {
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
          <Stack spacing={{ xs: 3.2, md: 3.7 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Box sx={{ maxWidth: 560 }}>
                <Typography
                  variant="h1"
                sx={{
                    color: "#20242B",
                    ...publicTypography.heroTitle,
                  }}
                >
                  Service & Support
                </Typography>
                <Typography
                  sx={{
                    mt: 0.7,
                    color: "#667084",
                    ...publicTypography.body,
                    maxWidth: 430,
                  }}
                >
                  Manage your solar system and get help anytime. Your energy health is our top priority.
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1,
                  py: 0.34,
                  borderRadius: 999,
                  bgcolor: "#39D290",
                  color: "white",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: 0.32,
                }}
              >
                System Active & Healthy
              </Box>
            </Stack>

            <Grid container spacing={{ xs: 1.8, md: 1.9 }} alignItems="stretch">
              <Grid size={{ xs: 12, md: 4 }}>
                <CardShell sx={{ height: "100%" }}>
                  <Stack spacing={1.3}>
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      <ShieldOutlinedIcon sx={{ fontSize: "0.9rem", color: "#0E56C8" }} />
                      <Typography sx={{ color: "#0E56C8", fontSize: "0.82rem", fontWeight: 800 }}>
                        System Summary
                      </Typography>
                    </Stack>

                    <Stack spacing={1}>
                      {[
                        ["System size", "5kW"],
                        ["Installation date", "Oct 24, 2023"],
                        ["Warranty", "25 Years"],
                        ["Status", "Active"],
                      ].map(([label, value]) => (
                        <Stack key={label} direction="row" justifyContent="space-between" spacing={1}>
                          <Typography sx={{ color: "#8A93A4", fontSize: "0.68rem" }}>{label}</Typography>
                          <Typography
                            sx={{
                              color: value === "Active" ? "#0E56C8" : "#202938",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                            }}
                          >
                            {value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Box
                      sx={{
                        minHeight: 132,
                        borderRadius: "1rem",
                        overflow: "hidden",
                        backgroundImage: `url(${serviceSystemPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ position: "absolute", left: 14, bottom: 14 }}>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.64)",
                            fontSize: "0.44rem",
                            fontWeight: 800,
                            letterSpacing: 0.32,
                            textTransform: "uppercase",
                          }}
                        >
                          Connected Via
                        </Typography>
                        <Typography sx={{ color: "white", fontSize: "0.72rem", fontWeight: 700, mt: 0.15 }}>
                          Sparkin Cloud Node 04
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardShell>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={{ xs: 1.4, md: 1.5 }} alignItems="stretch">
                  {quickActions.map((action) => (
                    <Grid key={action.title} size={{ xs: 12, sm: 6, md: 3 }}>
                      <CardShell
                        component={RouterLink}
                        to={action.to}
                        sx={{
                          p: { xs: 1.25, md: 1.35 },
                          minHeight: { xs: 118, md: 108 },
                          height: "100%",
                          display: "block",
                          textDecoration: "none",
                          transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 16px 28px rgba(14,86,200,0.09)",
                            borderColor: "#D8E4F5",
                          },
                        }}
                      >
                        <Stack spacing={0.8}>
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "0.8rem",
                              bgcolor: action.tone,
                              color: action.color,
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            {action.icon}
                          </Box>
                          <Typography
                            sx={{
                              color: "#202938",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              lineHeight: 1.35,
                              maxWidth: 88,
                            }}
                          >
                            {action.title}
                          </Typography>
                          <Typography sx={{ color: "#7D8797", fontSize: "0.6rem", lineHeight: 1.48 }}>
                            {action.text}
                          </Typography>
                        </Stack>
                      </CardShell>
                    </Grid>
                  ))}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CardShell sx={{ height: "100%", minHeight: 150 }}>
                      <Stack spacing={1.2}>
                        <Typography sx={{ color: "#202938", fontSize: "0.92rem", fontWeight: 800 }}>
                          Performance Snapshot
                        </Typography>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ color: "#7B8696", fontSize: "0.7rem" }}>
                              Energy Generated
                            </Typography>
                            <Typography sx={{ color: "#0E56C8", fontSize: "1rem", fontWeight: 800 }}>
                              4.2 MWh
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={58}
                            sx={{
                              mt: 0.62,
                              height: 5,
                              borderRadius: 999,
                              bgcolor: "#EAF0F6",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 999,
                                bgcolor: "#0E56C8",
                              },
                            }}
                          />
                        </Box>

                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ color: "#7B8696", fontSize: "0.7rem" }}>
                              Total Savings
                            </Typography>
                            <Typography sx={{ color: "#14824D", fontSize: "1rem", fontWeight: 800 }}>
                              ₹1,24,500
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={74}
                            sx={{
                              mt: 0.62,
                              height: 5,
                              borderRadius: 999,
                              bgcolor: "#EAF0F6",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 999,
                                bgcolor: "#39D290",
                              },
                            }}
                          />
                        </Box>
                      </Stack>
                    </CardShell>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        p: { xs: 1.8, md: 2 },
                        minHeight: 150,
                        height: "100%",
                        borderRadius: "1.45rem",
                        color: "white",
                        background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                        boxShadow: "0 18px 34px rgba(14,86,200,0.2)",
                      }}
                    >
                      <Stack spacing={1.2}>
                        <Typography sx={{ fontSize: "0.96rem", fontWeight: 800 }}>
                          Direct Support
                        </Typography>
                        {[
                          ["Call Expert", <HeadsetMicRoundedIcon sx={{ fontSize: "0.95rem" }} />],
                          ["Start Live Chat", <ChatBubbleOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />],
                          ["Email Support", <DescriptionOutlinedIcon sx={{ fontSize: "0.95rem" }} />],
                        ].map(([label, icon]) => (
                          <Button
                            key={label}
                            component={RouterLink}
                            to="/service-support/request"
                            startIcon={icon}
                            sx={{
                              justifyContent: "flex-start",
                              minHeight: 38,
                              borderRadius: "0.8rem",
                              bgcolor: "rgba(255,255,255,0.12)",
                              color: "white",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              textTransform: "none",
                            }}
                          >
                            {label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <CardShell sx={{ p: { xs: 1.75, md: 1.95 } }}>
              <Stack spacing={1.1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ color: "#202938", fontSize: "0.94rem", fontWeight: 800 }}>
                    Recent Service History
                  </Typography>
                  <MuiLink
                    component={RouterLink}
                    to="/service-support/request"
                    sx={{
                      color: "#0E56C8",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    View All
                  </MuiLink>
                </Stack>

                <Stack spacing={0.72}>
                  {serviceHistory.map((item) => (
                    <Stack
                      key={item.title}
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                      sx={{
                        px: 1.05,
                        py: 0.88,
                        borderRadius: "0.95rem",
                        bgcolor: "#FAFBFD",
                        border: "1px solid #EEF2F7",
                      }}
                    >
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            bgcolor: item.iconTone,
                            color: item.iconColor,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ color: "#202938", fontSize: "0.78rem", fontWeight: 700 }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ color: "#7C8797", fontSize: "0.62rem", mt: 0.08 }}>
                            {item.text}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          px: 0.8,
                          py: 0.28,
                          borderRadius: 999,
                          bgcolor: item.badgeTone,
                          color: item.badgeColor,
                          fontSize: "0.52rem",
                          fontWeight: 800,
                          letterSpacing: 0.3,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.badge}
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardShell>

            <Grid container spacing={{ xs: 2.4, md: 2.8 }} alignItems="center">
              <Grid size={{ xs: 12, md: 5.2 }}>
                <Stack spacing={1.35} sx={{ maxWidth: 410, pl: { xs: 0, md: 1.4 } }}>
                  <Typography
                    sx={{
                      color: "#202938",
                      fontSize: { xs: "1.8rem", md: "2.1rem" },
                      fontWeight: 800,
                      lineHeight: 1.12,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    Extend Your Peace of Mind
                  </Typography>
                  <Typography sx={{ color: "#687487", fontSize: "0.82rem", lineHeight: 1.72 }}>
                    Our Premium Shield coverage now includes 24/7 proactive monitoring and storm damage insurance. Keep your energy flow uninterrupted.
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/service-support/request"
                    sx={{
                      width: { xs: "100%", sm: "fit-content" },
                      minHeight: 40,
                      px: 1.5,
                      borderRadius: "0.85rem",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      textTransform: "none",
                      background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
                    }}
                  >
                    Upgrade Coverage
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6.8 }}>
                <Box
                  sx={{
                    minHeight: { xs: 300, md: 360 },
                    borderRadius: "1.65rem",
                    overflow: "hidden",
                    backgroundImage: `url(${serviceUpgradePlaceholder})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 18px 34px rgba(17,31,54,0.08)",
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}


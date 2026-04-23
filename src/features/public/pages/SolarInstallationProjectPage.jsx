import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const journeySteps = [
  { title: "Site Visit", status: "Completed", active: false, done: true },
  { title: "Installation", status: "In Progress", active: true, done: false },
  { title: "Inspection", status: "Pending", active: false, done: false },
  { title: "Activation", status: "Pending", active: false, done: false },
];

const projectMeta = [
  {
    label: "Vendor",
    value: "Tata Power Solar",
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "System Size",
    value: "5kW On-Grid",
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Project Cost",
    value: "₹2,85,000",
    icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Location",
    value: "Sector 45, Gurgaon, Haryana",
    icon: <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

const recentActivity = [
  {
    title: "Installation Team Dispatched",
    text: "Engineers have arrived at your location with the solar panels and mounting structure.",
    tag: "Today, 09:30 AM",
    tone: "#0E56C8",
    icon: <BoltRoundedIcon sx={{ fontSize: "0.82rem" }} />,
  },
  {
    title: "Technical Design Approved",
    text: "The final layout for the 12 Monocrystalline PERC panels has been verified by the engineering team.",
    tag: "24 Mar, 2026",
    tone: "#12824C",
    icon: <TaskAltRoundedIcon sx={{ fontSize: "0.82rem" }} />,
  },
  {
    title: "Site Survey Completed",
    text: "Shadow analysis and roof load capacity assessment completed successfully.",
    tag: "20 Mar, 2026",
    tone: "#12824C",
    icon: <TaskAltRoundedIcon sx={{ fontSize: "0.82rem" }} />,
  },
];

const documents = [
  { icon: <DescriptionOutlinedIcon sx={{ fontSize: "1rem" }} />, label: "Tax Invoice" },
  { icon: <DescriptionOutlinedIcon sx={{ fontSize: "1rem" }} />, label: "Service Agreement" },
  { icon: <ShieldOutlinedIcon sx={{ fontSize: "1rem" }} />, label: "Warranty Certificate" },
];

function CardShell({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 2.05, md: 2.25 },
        borderRadius: "1.5rem",
        bgcolor: "rgba(255,255,255,0.94)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function SolarInstallationProjectPage() {
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
          <Stack spacing={{ xs: 3.2, md: 3.8 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: "flex-start", md: "flex-start" }}
            >
              <Box sx={{ maxWidth: 620 }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#20242B",
                    ...publicTypography.heroTitle,
                  }}
                >
                  Your Solar Installation Project
                  <Box component="span" sx={{ ml: 0.4 }}>
                    ☀️
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    color: "#667084",
                    fontSize: "0.94rem",
                    lineHeight: 1.6,
                  }}
                >
                  Track progress and stay updated on your installation
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.1}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                <Button
                  startIcon={<ShareRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minHeight: 40,
                    px: 1.45,
                    borderRadius: "0.85rem",
                    bgcolor: "#F1F4F8",
                    color: "#2B3443",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Share Status
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minHeight: 40,
                    px: 1.55,
                    borderRadius: "0.85rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
                  }}
                >
                  Download Report
                </Button>
              </Stack>
            </Stack>

            <Grid container spacing={{ xs: 2.2, md: 2.4 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={{ xs: 2.2, md: 2.4 }}>
                  <CardShell>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 800 }}>
                          Installation Journey
                        </Typography>
                        <Box
                          sx={{
                            px: 0.9,
                            py: 0.3,
                            borderRadius: 999,
                            bgcolor: "#39D290",
                            color: "white",
                            fontSize: "0.56rem",
                            fontWeight: 800,
                          }}
                        >
                          Phase 2 of 4
                        </Box>
                      </Stack>

                      <Box sx={{ position: "relative", px: { xs: 0.1, md: 0.35 }, pt: 0.6 }}>
                        <Box
                          sx={{
                            position: "absolute",
                            left: 18,
                            right: 18,
                            top: 20,
                            height: 2,
                            bgcolor: "#E1E7F0",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: 18,
                            width: "43%",
                            top: 20,
                            height: 2,
                            bgcolor: "#0E56C8",
                          }}
                        />

                        <Grid
                          container
                          columns={{ xs: 2, sm: 4 }}
                          rowSpacing={{ xs: 1.5, sm: 0 }}
                        >
                          {journeySteps.map((step) => (
                            <Grid key={step.title} size={{ xs: 1, sm: 1 }}>
                              <Stack alignItems="center" spacing={0.7}>
                                <Box
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    bgcolor: step.done ? "#0E56C8" : step.active ? "white" : "#EFF3F8",
                                    color: step.done ? "white" : step.active ? "#0E56C8" : "#98A3B6",
                                    border: step.active ? "3px solid #0E56C8" : "1px solid transparent",
                                    boxShadow: step.active ? "0 6px 14px rgba(14,86,200,0.12)" : "none",
                                    display: "grid",
                                    placeItems: "center",
                                    zIndex: 1,
                                  }}
                                >
                                  {step.done ? (
                                    <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />
                                  ) : step.active ? (
                                    <SolarPowerRoundedIcon sx={{ fontSize: "0.85rem" }} />
                                  ) : (
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "currentColor" }} />
                                  )}
                                </Box>
                                <Stack spacing={0.1} alignItems="center">
                                  <Typography sx={{ color: "#2A3444", fontSize: "0.72rem", fontWeight: 700 }}>
                                    {step.title}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: step.active ? "#0E56C8" : step.done ? "#12824C" : "#8C96A6",
                                      fontSize: "0.63rem",
                                      fontWeight: step.active || step.done ? 700 : 500,
                                    }}
                                  >
                                    {step.status}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ py: { xs: 1.7, md: 1.8 } }}>
                    <Grid container spacing={{ xs: 1.4, md: 1.8 }}>
                      {projectMeta.map((item) => (
                        <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                          <Stack spacing={0.52}>
                            <Typography
                              sx={{
                                color: "#8A93A4",
                                fontSize: "0.56rem",
                                fontWeight: 800,
                                letterSpacing: 0.34,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Stack direction="row" spacing={0.55} alignItems="flex-start">
                              <Box sx={{ mt: 0.14, color: "#0E56C8" }}>{item.icon}</Box>
                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.9rem",
                                  fontWeight: 700,
                                  lineHeight: 1.45,
                                  maxWidth: item.label === "Location" ? { xs: "none", md: 140 } : "none",
                                }}
                              >
                                {item.value}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </CardShell>

                  <CardShell>
                    <Stack spacing={1.4}>
                      <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 800 }}>
                        Recent Activity
                      </Typography>
                      <Stack spacing={1.35}>
                        {recentActivity.map((item, index) => (
                          <Stack key={item.title} direction="row" spacing={1.15} alignItems="flex-start">
                            <Stack alignItems="center" sx={{ pt: 0.1 }}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  bgcolor: item.tone,
                                  color: "white",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                {item.icon}
                              </Box>
                              {index < recentActivity.length - 1 ? (
                                <Box sx={{ width: 2, minHeight: 40, bgcolor: "#E0E6EF", mt: 0.45 }} />
                              ) : null}
                            </Stack>

                            <Box sx={{ flex: 1, pt: 0.02 }}>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                spacing={0.7}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                              >
                                <Typography sx={{ color: "#202938", fontSize: "0.84rem", fontWeight: 700 }}>
                                  {item.title}
                                </Typography>
                                <Box
                                  sx={{
                                    px: 0.65,
                                    py: 0.22,
                                    borderRadius: "0.55rem",
                                    bgcolor: "#F1F4F8",
                                    color: "#788495",
                                    fontSize: "0.58rem",
                                  }}
                                >
                                  {item.tag}
                                </Box>
                              </Stack>
                              <Typography sx={{ color: "#687487", fontSize: "0.72rem", lineHeight: 1.6, mt: 0.32 }}>
                                {item.text}
                              </Typography>
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardShell>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={{ xs: 2.2, md: 2.4 }}>
                  <Box
                    sx={{
                      p: { xs: 2.05, md: 2.2 },
                      borderRadius: "1.45rem",
                      color: "white",
                      background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 18px 34px rgba(14,86,200,0.2)",
                    }}
                  >
                    <Stack spacing={1.4}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "0.9rem",
                            bgcolor: "rgba(255,255,255,0.12)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <SolarPowerRoundedIcon sx={{ fontSize: "1rem" }} />
                        </Box>
                        <Box
                          sx={{
                            px: 0.8,
                            py: 0.28,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,0.14)",
                            fontSize: "0.54rem",
                            fontWeight: 800,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                          }}
                        >
                          Active Stage
                        </Box>
                      </Stack>
                      <Box>
                        <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, lineHeight: 1.12 }}>
                          Installing Now
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.8rem", lineHeight: 1.65, mt: 0.7 }}>
                          Mounting structure is being secured. Wiring and inverter placement will follow this afternoon.
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Stack direction="row" spacing={-0.5}>
                          {["#FDD96A", "#9EE7FF", "#FFD1D1"].map((tone) => (
                            <Box
                              key={tone}
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: tone,
                                border: "2px solid #0E56C8",
                              }}
                            />
                          ))}
                        </Stack>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>
                          Team of 3 on site
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <CardShell>
                    <Stack spacing={1.15}>
                      <Typography sx={{ color: "#202938", fontSize: "0.98rem", fontWeight: 800 }}>
                        Project Documents
                      </Typography>
                      {documents.map((doc) => (
                        <Stack key={doc.label} direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "0.8rem",
                                bgcolor: "#F2F6FC",
                                color: "#0E56C8",
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              {doc.icon}
                            </Box>
                            <Typography sx={{ color: "#243142", fontSize: "0.78rem", fontWeight: 700 }}>
                              {doc.label}
                            </Typography>
                          </Stack>
                          <DownloadRoundedIcon sx={{ fontSize: "1rem", color: "#798496" }} />
                        </Stack>
                      ))}
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ bgcolor: "rgba(249,251,254,0.96)" }}>
                    <Stack spacing={1.2}>
                      <Typography sx={{ color: "#202938", fontSize: "1.05rem", fontWeight: 800 }}>
                        Need Assistance?
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.75rem", lineHeight: 1.65 }}>
                        Our support team is available 24/7 to help with your project queries.
                      </Typography>
                      <Button
                        sx={{
                          minHeight: 42,
                          borderRadius: "0.9rem",
                          bgcolor: "#FFFFFF",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          border: "1px solid #E4EAF3",
                        }}
                      >
                        Chat with Vendor
                      </Button>
                      <Button
                        startIcon={<HelpOutlineRoundedIcon />}
                        sx={{
                          minHeight: 42,
                          borderRadius: "0.9rem",
                          bgcolor: "#FFFFFF",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          border: "1px solid #E4EAF3",
                        }}
                      >
                        Help Center
                      </Button>
                    </Stack>
                  </CardShell>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

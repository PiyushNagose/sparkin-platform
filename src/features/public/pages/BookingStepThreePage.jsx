import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import { Link as RouterLink } from "react-router-dom";
import roofTipPlaceholder from "@/shared/assets/images/public/booking/roof-tip-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";

const steps = [
  { label: "Step 1", state: "complete" },
  { label: "Step 2", state: "complete" },
  { label: "Step 3", state: "active" },
  { label: "Step 4", state: "upcoming" },
];

const roofSizes = [
  { title: "< 500 sq ft", subtitle: "Compact roof space", selected: false },
  { title: "500-1000 sq ft", subtitle: "Standard residential", selected: true },
  { title: "1000+ sq ft", subtitle: "Expansive area", selected: false },
];

const shadowItems = [
  {
    title: "No Shadow",
    icon: <WbSunnyOutlinedIcon sx={{ fontSize: "1.15rem" }} />,
    tone: "#A38C00",
  },
  {
    title: "Partial Shadow",
    icon: <WbTwilightRoundedIcon sx={{ fontSize: "1.1rem" }} />,
    tone: "#6E788A",
  },
  {
    title: "Heavy Shadow",
    icon: <CloudQueueRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    tone: "#475367",
  },
];

const roofConditions = [
  { title: "Excellent", selected: false },
  { title: "Average", selected: true },
  { title: "Needs Repair", selected: false },
];

function BookingStepper() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        position: "relative",
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "4%",
          right: "4%",
          top: 15,
          height: 2,
          bgcolor: "#E7ECF3",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "4%",
          width: "58.5%",
          top: 15,
          height: 2,
          bgcolor: "#0E56C8",
        }}
      />

      {steps.map((step) => (
        <Stack
          key={step.label}
          alignItems="center"
          spacing={0.72}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              width: step.state === "active" ? 32 : 28,
              height: step.state === "active" ? 32 : 28,
              borderRadius: "50%",
              border:
                step.state === "active"
                  ? "3px solid #0E56C8"
                  : step.state === "upcoming"
                    ? "none"
                    : "none",
              bgcolor:
                step.state === "complete"
                  ? "#0E56C8"
                  : step.state === "active"
                    ? "white"
                    : "#EEF3FA",
              boxShadow:
                step.state === "active"
                  ? "0 8px 20px rgba(14,86,200,0.08)"
                  : "0 6px 16px rgba(17,31,54,0.04)",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            {step.state === "complete" ? (
              <Typography
                sx={{ color: "white", fontSize: "0.9rem", fontWeight: 800 }}
              >
                {"\u2713"}
              </Typography>
            ) : (
              <Box
                sx={{
                  width: step.state === "active" ? 7 : 6,
                  height: step.state === "active" ? 7 : 6,
                  borderRadius: "50%",
                  bgcolor: "#0E56C8",
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              color: "#202938",
              fontSize: "0.74rem",
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {step.label}
          </Typography>

          <Typography
            sx={{
              minHeight: 14,
              color: step.state === "active" ? "#0E56C8" : "transparent",
              fontSize: "0.54rem",
              fontWeight: 800,
              letterSpacing: 0.48,
              textTransform: "uppercase",
            }}
          >
            {step.state === "active" ? "In Progress" : "."}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

function SelectCard({ title, subtitle, selected = false }) {
  return (
    <Box
      sx={{
        minHeight: 84,
        borderRadius: "0.95rem",
        px: 1.8,
        py: 1.35,
        bgcolor: selected ? "white" : "#F5F7FB",
        border: selected ? "2px solid #0E56C8" : "1px solid #EEF2F7",
        boxShadow: selected ? "0 10px 22px rgba(14,86,200,0.08)" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          color: selected ? "#0E56C8" : "#203041",
          fontSize: "0.98rem",
          fontWeight: 800,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.35,
          color: "#7B8799",
          fontSize: "0.72rem",
          lineHeight: 1.45,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

function ShadowCard({ title, icon, tone }) {
  return (
    <Box
      sx={{
        minHeight: 86,
        borderRadius: "0.95rem",
        px: 1.8,
        py: 1.35,
        bgcolor: "#F5F7FB",
        border: "1px solid #EEF2F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{ color: tone, display: "grid", placeItems: "center", mb: 0.85 }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          color: "#202938",
          fontSize: "0.82rem",
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function BookingStepThreePage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: { xs: 7.5, md: 8.75 },
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.78) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
          sx={{
            maxWidth: "1120px !important",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={{ xs: 3.8, md: 4.8 }}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Stack
              spacing={{ xs: 3.8, md: 4.8 }}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Stack
                alignItems="center"
                sx={{ width: "100%", maxWidth: 980, mx: "auto" }}
              >
                <Box sx={{ width: "100%", maxWidth: 880 }}>
                  <BookingStepper />
                </Box>
              </Stack>

              <Stack
                sx={{ width: "100%", maxWidth: 660, mx: "auto" }}
                spacing={{ xs: 3.8, md: 4.4 }}
                alignItems="center"
              >
                <Stack
                  spacing={1}
                  alignItems="center"
                  textAlign="center"
                  sx={{ width: "100%", maxWidth: 640, mx: "auto" }}
                >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.4rem" },
                    lineHeight: 1.06,
                    letterSpacing: "-0.05em",
                    color: "#18253A",
                  }}
                >
                  Tell us about your roof
                  <Box component="span" sx={{ ml: 0.32 }}>
                    {"\u2600\uFE0F"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: "#707D90",
                    fontSize: "0.96rem",
                    lineHeight: 1.65,
                    maxWidth: 500,
                  }}
                >
                  This helps us estimate how much solar capacity your roof can
                  support and design the perfect energy layout.
                </Typography>
                </Stack>

                <Box
                  sx={{
                    width: "100%",
                    p: { xs: 2.25, md: 3.2 },
                    borderRadius: "1.35rem",
                    bgcolor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(221,229,239,0.98)",
                    boxShadow: "0 22px 54px rgba(20,34,56,0.08)",
                  }}
                >
                  <Stack spacing={{ xs: 3.2, md: 3.8 }}>
                  <Box>
                    <Typography
                      sx={{
                        mb: 1.2,
                        color: "#59667A",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Roof Size
                    </Typography>
                    <Grid container spacing={1.15}>
                      {roofSizes.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
                          <SelectCard {...item} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        mb: 1.2,
                        color: "#59667A",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Shadow Availability
                    </Typography>
                    <Grid container spacing={1.15}>
                      {shadowItems.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
                          <ShadowCard {...item} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        mb: 1.2,
                        color: "#59667A",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Roof Condition
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {roofConditions.map((item) => (
                        <Box
                          key={item.title}
                          sx={{
                            px: 1.45,
                            py: 0.78,
                            borderRadius: 999,
                            bgcolor: item.selected ? "#0E56C8" : "#F2F4F8",
                            color: item.selected ? "white" : "#243143",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            boxShadow: item.selected
                              ? "0 10px 20px rgba(14,86,200,0.18)"
                              : "none",
                          }}
                        >
                          {item.title}
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                    <Divider sx={{ borderColor: "#EDF1F6" }} />

                    <Stack alignItems="center" spacing={1.1}>
                      <Button
                        component={RouterLink}
                        to="/booking/upload"
                        variant="contained"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          minWidth: 126,
                          minHeight: 48,
                          borderRadius: "0.85rem",
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          background:
                            "linear-gradient(180deg, #17B2D3 0%, #1BC17B 100%)",
                          boxShadow: "0 14px 28px rgba(27,193,123,0.22)",
                        }}
                      >
                        Continue
                      </Button>
                      <Button
                        startIcon={
                          <HelpOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                        }
                        sx={{
                          color: "#0E56C8",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        I&apos;m not sure
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                <Grid
                  container
                  spacing={{ xs: 1.5, md: 1.8 }}
                  sx={{ width: "100%", maxWidth: 660, mx: "auto" }}
                >
                  <Grid size={{ xs: 12, md: 5.3 }}>
                    <Box
                      sx={{
                        minHeight: { xs: 124, md: 138 },
                        borderRadius: "1rem",
                        bgcolor: "#F0F6B4",
                        borderLeft: "4px solid #78800B",
                        px: 2,
                        py: 1.9,
                      }}
                    >
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <LightbulbRoundedIcon
                          sx={{ fontSize: "1rem", color: "#5F6500" }}
                        />
                        <Typography
                          sx={{
                            color: "#283240",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          Solar Pro Tip
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          mt: 1.15,
                          color: "#495669",
                          fontSize: "0.78rem",
                          lineHeight: 1.65,
                        }}
                      >
                        Most RCC slab roofs in India can easily support solar
                        panel weight. If you have an asbestos or tin shed, we
                        might need a custom mounting structure.
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6.7 }}>
                    <Box
                      sx={{
                        minHeight: { xs: 124, md: 138 },
                        borderRadius: "1rem",
                        overflow: "hidden",
                        backgroundImage: `linear-gradient(180deg, rgba(7,18,31,0.06) 0%, rgba(8,17,28,0.62) 88%), url(${roofTipPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 1.4,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.72rem",
                          lineHeight: 1.45,
                        }}
                      >
                        Typical 3kW installation requires ~300 sq ft
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="center"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ width: "100%" }}
                >
                  <Button
                    component={RouterLink}
                    to="/booking/property"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{
                      alignSelf: "flex-start",
                      width: { xs: "100%", sm: "auto" },
                      color: "#4A5668",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textTransform: "none",
                      px: 0,
                      "&:hover": { bgcolor: "transparent" },
                    }}
                  >
                    Back
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

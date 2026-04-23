import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReorderRoundedIcon from "@mui/icons-material/ReorderRounded";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const stepItems = [
  { label: "Step 1", status: "In Progress", active: true },
  { label: "Step 2", status: "", active: false },
  { label: "Step 3", status: "", active: false },
  { label: "Step 4", status: "", active: false },
];

const timeSlots = [
  { title: "Morning", time: "9-12 PM" },
  { title: "Afternoon", time: "1-3 PM" },
  { title: "Evening", time: "3-6 PM" },
];

function SectionLabel({ icon, title }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 2 }}>
      <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>
        {icon}
      </Box>
      <Typography
        sx={{
          color: "#202938",
          fontWeight: 700,
          fontSize: "1.05rem",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

function InputField({
  label,
  placeholder,
  optional = false,
  multiline = false,
  minRows = 1,
}) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.8 }}
      >
        <Typography
          sx={{
            color: "#505C70",
            fontSize: "0.72rem",
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
        {optional ? (
          <Typography
            sx={{
              color: "#9AA5B5",
              fontSize: "0.62rem",
              fontWeight: 700,
            }}
          >
            Optional
          </Typography>
        ) : null}
      </Stack>
      <TextField
        fullWidth
        placeholder={placeholder}
        multiline={multiline}
        minRows={minRows}
        InputProps={{
          sx: {
            borderRadius: "0.95rem",
            bgcolor: "#F3F5F9",
            minHeight: multiline ? "auto" : 48,
            alignItems: multiline ? "flex-start" : "center",
          },
        }}
      />
    </Box>
  );
}

export default function BookingStepOnePage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
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
          }}
        >
          <Stack
            spacing={{ xs: 3.4, md: 4.2 }}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Stack
              alignItems="center"
              sx={{ width: "100%", maxWidth: 920 }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 760,
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
                    bgcolor: "#E9EDF3",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: "4%",
                    width: "8.5%",
                    top: 15,
                    height: 2,
                    bgcolor: "#0E56C8",
                  }}
                />

                {stepItems.map((step) => (
                  <Stack
                    key={step.label}
                    alignItems="center"
                    spacing={0.72}
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Box
                      sx={{
                        width: step.active ? 32 : 28,
                        height: step.active ? 32 : 28,
                        borderRadius: "50%",
                        border: step.active ? "3px solid #0E56C8" : "none",
                        bgcolor: step.active ? "white" : "#EEF3FA",
                        boxShadow: step.active
                          ? "0 8px 20px rgba(14,86,200,0.08)"
                          : "0 6px 16px rgba(17,31,54,0.04)",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: step.active ? 7 : 6,
                          height: step.active ? 7 : 6,
                          borderRadius: "50%",
                          bgcolor: "#0E56C8",
                          transform: "translate(-50%, -50%)",
                        },
                      }}
                    />
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
                        color: step.active ? "#0E56C8" : "transparent",
                        fontSize: "0.54rem",
                        fontWeight: 800,
                        letterSpacing: 0.48,
                        textTransform: "uppercase",
                      }}
                    >
                      {step.status || "."}
                    </Typography>
                  </Stack>
                ))}
              </Box>

              <Stack
                spacing={1}
                alignItems="center"
                textAlign="center"
                sx={{
                  mt: { xs: 4.2, md: 5 },
                  width: "100%",
                  maxWidth: 520,
                  mx: "auto",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    ...publicTypography.pageTitle,
                    color: "#18253A",
                  }}
                >
                  Let&apos;s get started
                  <Box component="span" sx={{ ml: 0.35 }}>
                    {"\uD83D\uDC4B"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: "#707D90",
                    fontSize: "0.96rem",
                    lineHeight: 1.6,
                  }}
                >
                  Tell us a few details to begin your solar journey
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                width: "100%",
                maxWidth: 920,
                p: { xs: 2.2, md: 3.2 },
                borderRadius: "1.35rem",
                bgcolor: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(221,229,239,0.98)",
                boxShadow: "0 22px 54px rgba(20,34,56,0.08)",
              }}
            >
              <Grid container spacing={{ xs: 3.2, md: 3.6 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={
                      <PersonOutlineRoundedIcon sx={{ fontSize: "0.98rem" }} />
                    }
                    title="Personal Details"
                  />
                  <Stack spacing={2.1}>
                    <InputField label="Full name" placeholder="John Doe" />
                    <InputField
                      label="Phone number"
                      placeholder="+1 (555) 000-0000"
                    />
                    <InputField
                      label="Email"
                      placeholder="name@example.com"
                      optional
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={<LocationOnOutlinedIcon sx={{ fontSize: "1rem" }} />}
                    title="Installation Address"
                  />
                  <Stack spacing={2.1}>
                    <InputField
                      label="Street Address / House No."
                      placeholder="e.g. 123 Solar Street"
                    />
                    <InputField
                      label="Landmark"
                      placeholder="e.g. Near Central Park"
                      optional
                    />
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InputField label="City" placeholder="City" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <InputField label="State" placeholder="State" />
                      </Grid>
                    </Grid>
                    <InputField label="Pincode" placeholder="000000" />
                  </Stack>
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 3, md: 3.4 }, borderColor: "#EDF1F6" }}
              />

              <Grid container spacing={{ xs: 3.2, md: 3.6 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={
                      <CalendarMonthRoundedIcon sx={{ fontSize: "1rem" }} />
                    }
                    title="Preferred Inspection"
                  />
                  <Stack spacing={2.1}>
                    <InputField
                      label="Preferred Date"
                      placeholder="mm/dd/yyyy"
                    />
                    <Box>
                      <Typography
                        sx={{
                          mb: 0.8,
                          color: "#505C70",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        Preferred Time Slot
                      </Typography>
                      <Grid container spacing={1.1}>
                        {timeSlots.map((slot) => (
                          <Grid key={slot.title} size={{ xs: 12, sm: 4 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              sx={{
                                minHeight: 50,
                                borderRadius: "0.9rem",
                                borderColor: "#E5EAF0",
                                bgcolor: "#F7F9FC",
                                color: "#1D293B",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.2,
                                textTransform: "none",
                                "&:hover": {
                                  borderColor: "#D9E1EB",
                                  bgcolor: "#F3F6FA",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "0.68rem", fontWeight: 700 }}
                              >
                                {slot.title}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "0.56rem", color: "#7D899D" }}
                              >
                                {slot.time}
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={<ReorderRoundedIcon sx={{ fontSize: "1rem" }} />}
                    title="Additional Information"
                  />
                  <InputField
                    label="Special Instructions"
                    placeholder="Any specific instructions (e.g., gate code, pets)"
                    multiline
                    minRows={5}
                  />
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 3, md: 3.4 }, borderColor: "#EDF1F6" }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <InfoOutlinedIcon
                    sx={{ fontSize: "0.9rem", color: "#B3A208" }}
                  />
                  <Typography
                    sx={{
                      color: "#7A879A",
                      fontSize: "0.76rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Your data is encrypted and kept private.
                  </Typography>
                </Stack>

                <Button
                  component={RouterLink}
                  to="/booking/property"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: 188,
                    minHeight: 50,
                    borderRadius: "0.85rem",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.22)",
                  }}
                >
                  Continue to Next Step
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

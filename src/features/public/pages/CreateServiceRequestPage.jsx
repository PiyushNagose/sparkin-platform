import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import serviceNetworkPlaceholder from "@/shared/assets/images/public/support/service-network-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const requestTypes = [
  {
    title: "Maintenance",
    text: "Scheduled cleaning and check-ups",
    tone: "#EEF4FF",
    color: "#0E56C8",
    icon: <ConstructionRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    title: "Repair",
    text: "Fixing specific component failures",
    tone: "#EEF4FF",
    color: "#0E56C8",
    icon: <BuildRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    active: true,
  },
  {
    title: "Warranty",
    text: "In-warranty replacement or service",
    tone: "#F3F6FB",
    color: "#7D889B",
    icon: <ShieldOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

const guarantees = [
  "Certified technicians with over 500+ solar installations.",
  "24/7 Monitoring ensures we know the problem before you do.",
  "Original Sparkin components used for all repairs.",
];

function CardShell({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 1.95, md: 2.2 },
        borderRadius: "1.45rem",
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

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        color: "#2B3340",
        fontSize: "0.78rem",
        fontWeight: 800,
      }}
    >
      {children}
    </Typography>
  );
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: "0.9rem",
    bgcolor: "#F5F7FB",
    fontSize: "0.9rem",
    color: "#202938",
    "& fieldset": {
      borderColor: "#E6EBF2",
    },
    "&:hover fieldset": {
      borderColor: "#D9E1ED",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#98A2B3",
    opacity: 1,
  },
};

export default function CreateServiceRequestPage() {
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
          <Stack spacing={{ xs: 3.1, md: 3.5 }}>
            <Box sx={{ maxWidth: 520 }}>
              <Typography
                variant="h1"
                sx={{
                  color: "#20242B",
                  ...publicTypography.heroTitle,
                }}
              >
                Create Service Request
              </Typography>
              <Typography
                sx={{
                  mt: 0.7,
                  color: "#667084",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                Manage your solar infrastructure with precision and care.
              </Typography>
            </Box>

            <Grid
              container
              spacing={{ xs: 2.3, md: 2.5 }}
              alignItems="flex-start"
            >
              <Grid size={{ xs: 12, md: 8.1 }}>
                <CardShell>
                  <Stack spacing={{ xs: 2.1, md: 2.3 }}>
                    <Box>
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "1.36rem",
                          fontWeight: 800,
                        }}
                      >
                        Submit a Service Request
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.32,
                          color: "#667084",
                          fontSize: "0.84rem",
                          lineHeight: 1.55,
                        }}
                      >
                        Our technicians will review your request and get back to
                        you within 24 hours.
                      </Typography>
                    </Box>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 1: Request Details</SectionLabel>
                      <Grid container spacing={1.2}>
                        {requestTypes.map((item) => (
                          <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
                            <Box
                              sx={{
                                p: 1.2,
                                minHeight: 88,
                                borderRadius: "1rem",
                                bgcolor: item.active ? "white" : "#F5F7FB",
                                border: item.active
                                  ? "2px solid #0E56C8"
                                  : "1px solid #E8EDF5",
                                boxShadow: item.active
                                  ? "0 10px 22px rgba(14,86,200,0.08)"
                                  : "none",
                              }}
                            >
                              <Stack spacing={0.7}>
                                <Box
                                  sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "0.75rem",
                                    bgcolor: item.tone,
                                    color: item.color,
                                    display: "grid",
                                    placeItems: "center",
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                <Typography
                                  sx={{
                                    color: "#202938",
                                    fontSize: "0.77rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#7C8797",
                                    fontSize: "0.62rem",
                                    lineHeight: 1.46,
                                  }}
                                >
                                  {item.text}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>
                        Section 2: Problem Description
                      </SectionLabel>
                      <TextField
                        multiline
                        minRows={4}
                        placeholder="Describe your issue..."
                        sx={{
                          ...fieldStyles,
                          "& .MuiOutlinedInput-root": {
                            ...fieldStyles["& .MuiOutlinedInput-root"],
                            alignItems: "flex-start",
                            py: 0.4,
                          },
                        }}
                      />
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 3: Attachment</SectionLabel>
                      <Box
                        sx={{
                          minHeight: 112,
                          borderRadius: "1rem",
                          border: "1.5px dashed #D8E2F0",
                          bgcolor: "#FCFDFE",
                          display: "grid",
                          placeItems: "center",
                          textAlign: "center",
                          px: 2,
                        }}
                      >
                        <Stack spacing={0.35} alignItems="center">
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: "0.85rem",
                              bgcolor: "#EEF4FF",
                              color: "#0E56C8",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <CloudUploadOutlinedIcon
                              sx={{ fontSize: "1.08rem" }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              color: "#202938",
                              fontSize: "0.9rem",
                              fontWeight: 700,
                            }}
                          >
                            Upload photo/video
                          </Typography>
                          <Typography
                            sx={{
                              color: "#7A8596",
                              fontSize: "0.64rem",
                              lineHeight: 1.44,
                            }}
                          >
                            Drag and drop or click to browse (Max 50MB)
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 4: Preferred Schedule</SectionLabel>
                      <Grid container spacing={1.2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            placeholder="mm/dd/yyyy"
                            InputProps={{
                              startAdornment: (
                                <CalendarMonthRoundedIcon
                                  sx={{
                                    color: "#7F8A9C",
                                    mr: 1,
                                    fontSize: "1rem",
                                  }}
                                />
                              ),
                            }}
                            sx={fieldStyles}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            placeholder="--:-- --"
                            InputProps={{
                              startAdornment: (
                                <ScheduleRoundedIcon
                                  sx={{
                                    color: "#7F8A9C",
                                    mr: 1,
                                    fontSize: "1rem",
                                  }}
                                />
                              ),
                            }}
                            sx={fieldStyles}
                          />
                        </Grid>
                      </Grid>
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>
                        Section 5: Contact Confirmation
                      </SectionLabel>
                      <Box
                        sx={{
                          p: 1.18,
                          borderRadius: "1rem",
                          bgcolor: "#F5F7FB",
                          border: "1px solid #E8EDF5",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "0.8rem",
                              bgcolor: "#EEF4FF",
                              color: "#0E56C8",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <HeadsetMicRoundedIcon sx={{ fontSize: "1rem" }} />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                              }}
                            >
                              Primary Contact: Alex Rivers
                            </Typography>
                            <Typography
                              sx={{
                                color: "#7C8797",
                                fontSize: "0.64rem",
                                mt: 0.12,
                              }}
                            >
                              alex.rivers@sparkin-solar.com • +1 (555) 012-3456
                            </Typography>
                            <Button
                              sx={{
                                px: 0,
                                mt: 0.36,
                                minHeight: 18,
                                color: "#0E56C8",
                                fontSize: "0.64rem",
                                fontWeight: 700,
                                textTransform: "none",
                              }}
                            >
                              Change contact info
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ pt: 0.45 }}>
                      <Button
                        variant="contained"
                        component={RouterLink}
                        to="/service-support/request/submitted"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          minWidth: 132,
                          minHeight: 42,
                          borderRadius: "0.85rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          background:
                            "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                          boxShadow: "0 14px 24px rgba(14,86,200,0.18)",
                        }}
                      >
                        Submit Request
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/service-support"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          minWidth: 92,
                          minHeight: 42,
                          borderRadius: "0.85rem",
                          bgcolor: "#EAEFF6",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </CardShell>
              </Grid>

              <Grid size={{ xs: 12, md: 3.9 }}>
                <Stack spacing={1.5}>
                  <CardShell sx={{ bgcolor: "#FBFCFF" }}>
                    <Stack spacing={1.15}>
                      <Stack direction="row" spacing={0.62} alignItems="center">
                        <TaskAltRoundedIcon
                          sx={{ fontSize: "0.9rem", color: "#8D8900" }}
                        />
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.88rem",
                            fontWeight: 800,
                          }}
                        >
                          Service Guarantees
                        </Typography>
                      </Stack>

                      {guarantees.map((item) => (
                        <Stack
                          key={item}
                          direction="row"
                          spacing={0.68}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              bgcolor: "#EAF8F0",
                              color: "#14824D",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                              mt: 0.08,
                            }}
                          >
                            <TaskAltRoundedIcon sx={{ fontSize: "0.72rem" }} />
                          </Box>
                          <Typography
                            sx={{
                              color: "#667084",
                              fontSize: "0.72rem",
                              lineHeight: 1.64,
                            }}
                          >
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ bgcolor: "#F7FAFD", p: 1.35 }}>
                    <Stack spacing={0.9}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "0.84rem",
                            fontWeight: 800,
                          }}
                        >
                          Live Network Status
                        </Typography>
                        <Box
                          sx={{
                            px: 0.66,
                            py: 0.28,
                            borderRadius: 999,
                            bgcolor: "#FFF6A7",
                            color: "#6B6200",
                            fontSize: "0.5rem",
                            fontWeight: 800,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                          }}
                        >
                          Optimal
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          minHeight: 150,
                          borderRadius: "1rem",
                          overflow: "hidden",
                          backgroundImage: `url(${serviceNetworkPlaceholder})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#7A8596",
                          fontSize: "0.64rem",
                          lineHeight: 1.55,
                        }}
                      >
                        Currently 12 technicians active in your metropolitan
                        area. Average response time:
                        <Box
                          component="span"
                          sx={{ color: "#0E56C8", fontWeight: 700, ml: 0.2 }}
                        >
                          3.2 hours
                        </Box>
                      </Typography>
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

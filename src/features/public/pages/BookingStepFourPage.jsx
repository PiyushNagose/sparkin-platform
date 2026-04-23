import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { Link as RouterLink } from "react-router-dom";
import uploadSummaryPlaceholder from "@/shared/assets/images/public/booking/upload-summary-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";

const steps = [
  { label: "Step 1", state: "complete" },
  { label: "Step 2", state: "complete" },
  { label: "Step 3", state: "complete" },
  { label: "Step 4", state: "active" },
];

const whyUploadItems = [
  {
    title: "Accurate System Design",
    description: "Better photos help our engineers design the optimal panel layout.",
    icon: <ArchitectureRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#1A57C8",
    bg: "#E9EEFF",
  },
  {
    title: "Faster Quotes",
    description: "Vendors can provide firm prices without a physical site visit.",
    icon: <FlashOnRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#188D48",
    bg: "#62F082",
  },
  {
    title: "Identify Obstructions",
    description: "Help us spot vents, chimneys, or shading issues early.",
    icon: <VisibilityOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#5D6400",
    bg: "#E7EB00",
  },
];

const documents = [
  {
    title: "Electricity Bill",
    meta: "Last 3 months required for usage analysis.",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: "#2E7D4F",
    bg: "#E8F6EC",
  },
  {
    title: "Govt Photo ID",
    meta: "Aadhaar or PAN for KYC verification.",
    icon: <ShieldRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: "#3566DA",
    bg: "#ECF2FF",
  },
];

const trustItems = [
  {
    title: "Data Secure",
    subtitle: "256-bit encryption",
    icon: <SecurityRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#174B22",
    bg: "#60F177",
  },
  {
    title: "No Spam Calls",
    subtitle: "Privacy protected",
    icon: <BlockRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#5D6400",
    bg: "#E7EB00",
  },
  {
    title: "Verified Vendors",
    subtitle: "Certified installers",
    icon: <VerifiedRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#203D89",
    bg: "#E9EEFF",
  },
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
          width: "83.5%",
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
              border: step.state === "active" ? "3px solid #0E56C8" : "none",
              bgcolor: step.state === "active" ? "white" : "#0E56C8",
              boxShadow:
                step.state === "active"
                  ? "0 8px 20px rgba(14,86,200,0.08)"
                  : "0 8px 20px rgba(17,31,54,0.06)",
              display: "grid",
              placeItems: "center",
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
                  width: 7,
                  height: 7,
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

function SectionLabel({ children }) {
  return (
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
      {children}
    </Typography>
  );
}

function UploadZone({ icon, title, description, buttonLabel, helper, compact = false }) {
  return (
    <Box
      sx={{
        minHeight: compact ? { xs: 164, md: 184 } : { xs: 220, md: 252 },
        borderRadius: "1.1rem",
        border: "1.5px dashed #C9D9F4",
        bgcolor: "#FFFFFF",
        px: 2.2,
        py: compact ? 2.6 : 3.1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Stack spacing={compact ? 0.95 : 1.15} alignItems="center">
        <Box
          sx={{
            width: compact ? 38 : 44,
            height: compact ? 38 : 44,
            borderRadius: "0.9rem",
            bgcolor: "#DCE4FF",
            color: "#0E56C8",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color: "#202938",
            fontSize: compact ? "0.92rem" : "0.95rem",
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            sx={{
              maxWidth: 270,
              color: "#6D7889",
              fontSize: "0.78rem",
              lineHeight: 1.55,
            }}
          >
            {description}
          </Typography>
        ) : null}

        {buttonLabel ? (
          <Box
            sx={{
              mt: 0.35,
              px: 1.8,
              py: 0.72,
              borderRadius: 999,
              bgcolor: "white",
              border: "1px solid #E8EDF5",
              color: "#0E56C8",
              fontSize: "0.7rem",
              fontWeight: 700,
              lineHeight: 1,
              boxShadow: "0 8px 20px rgba(20,34,56,0.04)",
            }}
          >
            {buttonLabel}
          </Box>
        ) : null}

        {helper ? (
          <Typography
            sx={{
              color: "#8F9AAC",
              fontSize: "0.52rem",
              fontWeight: 800,
              letterSpacing: 0.55,
              textTransform: "uppercase",
            }}
          >
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function BookingStepFourPage() {
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
          <Stack spacing={{ xs: 2.8, md: 3.2 }} alignItems="center" sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 620,
                p: { xs: 2.2, md: 3 },
                borderRadius: "1.65rem",
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(228,234,241,0.98)",
                boxShadow: "0 20px 56px rgba(20,34,56,0.08)",
              }}
            >
              <Stack spacing={{ xs: 3, md: 3.5 }}>
                <Box sx={{ width: "100%", maxWidth: 540, mx: "auto" }}>
                  <BookingStepper />
                </Box>

                <Stack spacing={1}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2rem", md: "2.4rem" },
                      lineHeight: 1.06,
                      letterSpacing: "-0.05em",
                      color: "#20242B",
                    }}
                  >
                    Almost done!
                    <Box component="span" sx={{ ml: 0.35 }}>
                      {"\uD83D\uDE80"}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#667084",
                      fontSize: "0.94rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload a few details to help vendors give you accurate quotes
                  </Typography>
                </Stack>

                <Box>
                  <SectionLabel>Roof Reference</SectionLabel>
                  <Stack spacing={2}>
                    <UploadZone
                      icon={<CloudUploadOutlinedIcon sx={{ fontSize: "1rem" }} />}
                      title="Upload roof photos (optional)"
                      description="Provide a visual reference to help experts design your perfect system"
                      buttonLabel="Browse Files"
                      helper="JPG, PNG, PDF up to 10 MB"
                    />

                    <UploadZone
                      compact
                      icon={<CameraAltOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
                      title="Capture Live Photo"
                      description="with GPS"
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      mb: 2.4,
                      color: "#202938",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Why upload photos?
                  </Typography>
                  <Grid container spacing={1.8}>
                    {whyUploadItems.map((item) => (
                      <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                        <Stack spacing={1.05} alignItems="center" textAlign="center">
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              bgcolor: item.bg,
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
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              lineHeight: 1.35,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              maxWidth: 160,
                              color: "#707D90",
                              fontSize: "0.68rem",
                              lineHeight: 1.55,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box>
                  <SectionLabel>Additional Context</SectionLabel>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Any specific requirements or questions? (e.g. 'Considering an EV charger soon')"
                    InputProps={{
                      sx: {
                        borderRadius: "0.95rem",
                        bgcolor: "#F6F7FA",
                        minHeight: 86,
                        alignItems: "flex-start",
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    p: { xs: 1.8, md: 2 },
                    borderRadius: "1.1rem",
                    bgcolor: "#F3F5F8",
                    border: "1px solid #EEF2F7",
                  }}
                >
                  <Stack spacing={1.55}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: "1rem", color: "#1A57C8" }}
                      />
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                        }}
                      >
                        Required Documents
                      </Typography>
                    </Stack>

                    <Grid container spacing={1.4}>
                      {documents.map((item) => (
                        <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                          <Box
                            sx={{
                              minHeight: 120,
                              borderRadius: "1rem",
                              bgcolor: "white",
                              border: "1px solid #E9EDF4",
                              px: 1.5,
                              py: 1.3,
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "0.55rem",
                                    bgcolor: item.bg,
                                    color: item.tone,
                                    display: "grid",
                                    placeItems: "center",
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                <AddCircleOutlineRoundedIcon
                                  sx={{ fontSize: "1rem", color: "#C3CAD8" }}
                                />
                              </Stack>

                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.82rem",
                                  fontWeight: 700,
                                }}
                              >
                                {item.title}
                              </Typography>

                              <Typography
                                sx={{
                                  color: "#687588",
                                  fontSize: "0.72rem",
                                  lineHeight: 1.5,
                                  maxWidth: 180,
                                }}
                              >
                                {item.meta}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Box>

                <Grid container spacing={1.4}>
                  <Grid size={{ xs: 12, md: 5.1 }}>
                    <Box
                      sx={{
                        minHeight: 126,
                        borderRadius: "1rem",
                        border: "1px solid #EEF2F7",
                        bgcolor: "white",
                        px: 1.4,
                        py: 1.15,
                      }}
                    >
                      <Stack spacing={0.9}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            sx={{
                              color: "#5D6879",
                              fontSize: "0.5rem",
                              fontWeight: 800,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            System Status
                          </Typography>
                          <Box
                            sx={{
                              px: 0.7,
                              py: 0.2,
                              borderRadius: 999,
                              bgcolor: "#62F082",
                              color: "#174B22",
                              fontSize: "0.46rem",
                              fontWeight: 800,
                              letterSpacing: 0.38,
                              textTransform: "uppercase",
                            }}
                          >
                            Ready
                          </Box>
                        </Stack>

                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.98rem",
                            fontWeight: 800,
                          }}
                        >
                          Ideal
                        </Typography>

                        <Typography
                          sx={{
                            color: "#6A778A",
                            fontSize: "0.6rem",
                            lineHeight: 1.55,
                            maxWidth: 190,
                          }}
                        >
                          High potential for solar efficiency at your location.
                        </Typography>

                        <Box
                          sx={{
                            px: 0.95,
                            py: 0.5,
                            borderRadius: 999,
                            bgcolor: "#F4F7FB",
                            width: "fit-content",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#233044",
                              fontSize: "0.58rem",
                              fontWeight: 700,
                            }}
                          >
                            98% Data Accuracy
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6.9 }}>
                    <Box
                      sx={{
                        minHeight: 126,
                        borderRadius: "1rem",
                        overflow: "hidden",
                        backgroundImage: `linear-gradient(180deg, rgba(7,18,31,0.02) 0%, rgba(8,17,28,0.62) 100%), url(${uploadSummaryPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 1.15,
                      }}
                    >
                      <Stack spacing={0.18}>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.92)",
                            fontSize: "0.48rem",
                            fontWeight: 800,
                            letterSpacing: 0.42,
                            textTransform: "uppercase",
                          }}
                        >
                          Solar Potential
                        </Typography>
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: "0.9rem",
                            lineHeight: 1.35,
                            fontWeight: 700,
                            maxWidth: 240,
                          }}
                        >
                          12kW peak generation potential
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1.6, sm: 2.25 }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "#E7EB00",
                        color: "#5D6400",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <LightbulbOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        maxWidth: 230,
                        color: "#6E798B",
                        fontSize: "0.62rem",
                        lineHeight: 1.55,
                      }}
                    >
                      Photos help identify vent placement and roof pitch for
                      instant, accurate quotes.
                    </Typography>
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1.2, sm: 2 }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Button
                      component={RouterLink}
                      to="/booking/roof"
                      sx={{
                        color: "#4A5668",
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        textTransform: "none",
                        minWidth: 0,
                        px: 0,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/booking/submitted"
                      endIcon={<ArrowForwardRoundedIcon />}
                      variant="contained"
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        minWidth: 170,
                        minHeight: 42,
                        borderRadius: "1rem",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        textTransform: "none",
                        background:
                          "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                        boxShadow: "0 12px 24px rgba(14,86,200,0.24)",
                      }}
                    >
                      Submit Request
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            <Grid container spacing={1.15} sx={{ width: "100%", maxWidth: 620 }}>
              {trustItems.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      px: 1.05,
                      py: 0.9,
                      borderRadius: "1rem",
                      bgcolor: "rgba(255,255,255,0.94)",
                      border: "1px solid #EEF2F7",
                      boxShadow: "0 12px 24px rgba(25,38,62,0.04)",
                    }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: item.bg,
                          color: item.color,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#7A8698",
                            fontSize: "0.54rem",
                            lineHeight: 1.45,
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

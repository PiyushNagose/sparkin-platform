import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import { useBookingDraft } from "@/features/public/booking/BookingDraftProvider";

const steps = [
  { label: "Step 1", state: "complete" },
  { label: "Step 2", state: "active" },
  { label: "Step 3", state: "upcoming" },
  { label: "Step 4", state: "upcoming" },
];

const propertyTypes = [
  {
    title: "Independent House",
    value: "independent_house",
    icon: <HomeRoundedIcon sx={{ fontSize: "1.1rem" }} />,
  },
  {
    title: "Apartment",
    value: "apartment",
    icon: <ApartmentRoundedIcon sx={{ fontSize: "1.05rem" }} />,
  },
  {
    title: "Commercial",
    value: "commercial",
    icon: <BusinessRoundedIcon sx={{ fontSize: "1.05rem" }} />,
  },
];

const roofTypes = [
  { title: "Flat", value: "flat" },
  { title: "Sloped", value: "sloped" },
];

const ownershipTypes = [
  { title: "Owned", value: "owned" },
  { title: "Rented", value: "rented" },
];

function BookingStepper() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "start",
        position: "relative",
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
          width: "33.5%",
          top: 15,
          height: 2,
          bgcolor: "#0E56C8",
        }}
      />

      {steps.map((step) => (
        <Stack
          key={step.label}
          alignItems="center"
          spacing={0.7}
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
              position: "relative",
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

function OptionCard({ icon, title, selected = false, onClick }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      sx={{
        position: "relative",
        minHeight: 108,
        borderRadius: "0.95rem",
        px: 2,
        py: 1.6,
        bgcolor: selected ? "white" : "#F5F7FB",
        border: selected ? "2px solid #0E56C8" : "1px solid #EEF2F7",
        boxShadow: selected ? "0 10px 22px rgba(14,86,200,0.08)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      {selected ? (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#0E56C8",
            color: "white",
            fontSize: "0.55rem",
            fontWeight: 800,
            display: "grid",
            placeItems: "center",
          }}
        >
          {"\u2713"}
        </Box>
      ) : null}
      <Box
        sx={{ color: "#344153", display: "grid", placeItems: "center", mb: 1 }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          color: "#202938",
          fontSize: "0.78rem",
          fontWeight: 700,
          lineHeight: 1.35,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function SegmentedChoice({ items, value, onChange }) {
  return (
    <Box
      sx={{
        p: 0.45,
        borderRadius: "0.9rem",
        bgcolor: "#F4F6FA",
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 0.55,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.title}
          role="button"
          tabIndex={0}
          onClick={() => onChange(item.value)}
          sx={{
            minHeight: 38,
            borderRadius: "0.72rem",
            bgcolor: item.value === value ? "white" : "transparent",
            border: item.value === value
              ? "1px solid #E8EDF5"
              : "1px solid transparent",
            color: item.value === value ? "#0E56C8" : "#2D3A4C",
            fontWeight: 700,
            fontSize: "0.76rem",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          {item.title}
        </Box>
      ))}
    </Box>
  );
}

function FieldLabel({ children }) {
  return (
    <Typography
      sx={{
        mb: 0.75,
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

export default function BookingStepTwoPage() {
  const { draft, updateDraft } = useBookingDraft();

  function updateProperty(values) {
    updateDraft("property", values);
  }

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
          sx={{ maxWidth: "1120px !important" }}
        >
          <Box
            sx={{
              mx: "auto",
              width: "100%",
              maxWidth: 900,
              p: { xs: 2.2, md: 3.2 },
              borderRadius: "1.35rem",
              bgcolor: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(221,229,239,0.98)",
              boxShadow: "0 22px 54px rgba(20,34,56,0.08)",
            }}
          >
            <Stack spacing={{ xs: 3.6, md: 4.4 }}>
              <Box sx={{ maxWidth: 760, mx: "auto", width: "100%" }}>
                <BookingStepper />
              </Box>

              <Box sx={{ maxWidth: 540 }}>
                <Typography
                  variant="h1"
                  sx={{
                    ...publicTypography.pageTitle,
                    color: "#18253A",
                  }}
                >
                  Tell us about your property
                  <Box component="span" sx={{ ml: 0.32 }}>
                    {"\uD83C\uDFE0"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    mt: 1.15,
                    color: "#6F7C90",
                    fontSize: "0.96rem",
                    lineHeight: 1.65,
                    maxWidth: 470,
                  }}
                >
                  This helps us recommend the right solar system for you and
                  accurately calculate your potential savings.
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 3.4, md: 3.8 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FieldLabel>Property Type</FieldLabel>
                  <Grid container spacing={1.2}>
                    {propertyTypes.map((item) => (
                      <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
                        <OptionCard
                          {...item}
                          selected={draft.property.type === item.value}
                          onClick={() => updateProperty({ type: item.value })}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2.2}>
                    <Box>
                      <FieldLabel>Roof Type</FieldLabel>
                      <SegmentedChoice
                        items={roofTypes}
                        value={draft.property.roofType}
                        onChange={(roofType) => updateProperty({ roofType })}
                      />
                    </Box>

                    <Box>
                      <FieldLabel>Ownership Status</FieldLabel>
                      <SegmentedChoice
                        items={ownershipTypes}
                        value={draft.property.ownership}
                        onChange={(ownership) => updateProperty({ ownership })}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 0.35, md: 0.55 }, borderColor: "#EDF1F6" }}
              />

              <Box>
                <Typography
                  sx={{
                    color: "#59667A",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    mb: 1.3,
                  }}
                >
                  Electricity Connection
                </Typography>

                <Grid container spacing={{ xs: 2.4, md: 2.9 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>Distribution Company</FieldLabel>
                    <TextField
                      select
                      fullWidth
                      value={draft.property.distributionCompany}
                      onChange={(event) =>
                        updateProperty({ distributionCompany: event.target.value })
                      }
                      SelectProps={{
                        displayEmpty: true,
                        IconComponent: KeyboardArrowDownRoundedIcon,
                      }}
                      InputProps={{
                        sx: {
                          borderRadius: "0.95rem",
                          bgcolor: "#F3F5F9",
                          minHeight: 48,
                        },
                      }}
                    >
                      <MenuItem value="">Select Company</MenuItem>
                      <MenuItem value="tsspdcl">TSSPDCL</MenuItem>
                      <MenuItem value="bescom">BESCOM</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>Connection Type</FieldLabel>
                    <TextField
                      select
                      fullWidth
                      value={draft.property.connectionType}
                      onChange={(event) =>
                        updateProperty({ connectionType: event.target.value })
                      }
                      SelectProps={{
                        displayEmpty: true,
                        IconComponent: KeyboardArrowDownRoundedIcon,
                      }}
                      InputProps={{
                        sx: {
                          borderRadius: "0.95rem",
                          bgcolor: "#F3F5F9",
                          minHeight: 48,
                        },
                      }}
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="single_phase">Single Phase</MenuItem>
                      <MenuItem value="three_phase">Three Phase</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>Consumer Number (from bill)</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. 1029384756"
                      value={draft.property.consumerNumber}
                      onChange={(event) =>
                        updateProperty({ consumerNumber: event.target.value })
                      }
                      InputProps={{
                        sx: {
                          borderRadius: "0.95rem",
                          bgcolor: "#F3F5F9",
                          minHeight: 48,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>Sanctioned Load</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. 5"
                      value={draft.property.sanctionedLoadKw}
                      onChange={(event) =>
                        updateProperty({ sanctionedLoadKw: event.target.value })
                      }
                      InputProps={{
                        sx: {
                          borderRadius: "0.95rem",
                          bgcolor: "#F3F5F9",
                          minHeight: 48,
                        },
                        endAdornment: (
                          <Typography
                            sx={{ color: "#5E6C80", fontWeight: 700, mr: 0.4 }}
                          >
                            kW
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ pt: { xs: 1, md: 1.35 } }}
              >
                <Button
                  component={RouterLink}
                  to="/booking"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{
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

                <Button
                  component={RouterLink}
                  to="/booking/roof"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minWidth: 140,
                    minHeight: 48,
                    borderRadius: "0.85rem",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.22)",
                  }}
                >
                  Continue
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

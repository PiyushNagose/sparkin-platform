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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import { useBookingDraft } from "@/features/public/booking/BookingDraftProvider";
import {
  validateStep2,
  isStep1Complete,
} from "@/features/public/booking/bookingValidation";
import { publicPlatformSettingsApi } from "@/features/public/api/platformSettingsApi";
import BookingStepper from "@/features/public/booking/BookingStepper";
import { scrollToFirstFieldError } from "@/shared/lib/forms/scrollToFieldError";

// ─── data ────────────────────────────────────────────────────────────────────

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

const ownershipTypes = [
  { title: "Owned", value: "owned" },
  { title: "Rented", value: "rented" },
];

const fallbackDiscoms = [
  { value: "apspdcl", label: "APSPDCL", stateKey: "andhra_pradesh" },
  { value: "apepdcl", label: "APEPDCL", stateKey: "andhra_pradesh" },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function OptionCard({ icon, title, selected = false, onClick }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 130,
        borderRadius: "0.95rem",
        px: 1.5,
        py: 2,
        bgcolor: selected ? "white" : "#F5F7FB",
        border: selected ? "2px solid #0E56C8" : "1px solid #EEF2F7",
        boxShadow: selected ? "0 10px 22px rgba(14,86,200,0.08)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {selected && (
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
          ✓
        </Box>
      )}
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
          onKeyDown={(e) => e.key === "Enter" && onChange(item.value)}
          sx={{
            minHeight: 40,
            borderRadius: "0.72rem",
            bgcolor: item.value === value ? "white" : "transparent",
            border:
              item.value === value
                ? "1px solid #E8EDF5"
                : "1px solid transparent",
            color: item.value === value ? "#0E56C8" : "#2D3A4C",
            fontWeight: 700,
            fontSize: "0.76rem",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {item.title}
        </Box>
      ))}
    </Box>
  );
}

function FieldLabel({ children, optional = false }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 0.75 }}
    >
      <Typography
        sx={{
          color: "#59667A",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
      {optional && (
        <Typography
          sx={{ color: "#9AA5B5", fontSize: "0.62rem", fontWeight: 600 }}
        >
          Optional
        </Typography>
      )}
    </Stack>
  );
}

const INPUT_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.95rem",
    bgcolor: "#F3F5F9",
    minHeight: 48,
    "& fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "1.5px solid #0E56C8" },
    "&.Mui-error fieldset": { border: "1.5px solid #D32F2F" },
    "&.Mui-error": { bgcolor: "#FFF5F5" },
  },
};

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BookingStepTwoPage() {
  const { draft, updateDraft } = useBookingDraft();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [discomOptions, setDiscomOptions] = useState([]);
  const [discomsLoading, setDiscomsLoading] = useState(true);

  useEffect(() => {
    if (!isStep1Complete(draft)) navigate("/booking", { replace: true });
  }, []);

  useEffect(() => {
    let active = true;
    async function loadDiscoms() {
      try {
        const settings = await publicPlatformSettingsApi.getSettings();
        if (!active) return;
        const activeDiscoms = (settings.discoms || [])
          .filter((d) => d.status !== "disabled")
          .map((d) => ({
            value: String(d.code || d.id).toLowerCase(),
            label: d.code || d.name,
            stateKey: d.stateKey,
          }));
        setDiscomOptions(
          activeDiscoms.length ? activeDiscoms : fallbackDiscoms,
        );
      } catch {
        if (active) setDiscomOptions(fallbackDiscoms);
      } finally {
        if (active) setDiscomsLoading(false);
      }
    }
    loadDiscoms();
    return () => {
      active = false;
    };
  }, []);

  const stateDiscomOptions = useMemo(() => {
    const userStateKey = draft.installationAddress?.state;
    if (!userStateKey) return discomOptions;
    // Strictly filter by state — empty means none configured for this state
    return discomOptions.filter((o) => o.stateKey === userStateKey);
  }, [discomOptions, draft.installationAddress?.state]);

  useEffect(() => {
    // Only auto-select if there are actual options for this state
    if (!stateDiscomOptions.length) {
      // Clear any previously selected company that no longer applies
      updateProperty({ distributionCompany: "" });
      return;
    }
    const hasCurrent = stateDiscomOptions.some(
      (o) => o.value === draft.property.distributionCompany,
    );
    if (!hasCurrent)
      updateProperty({ distributionCompany: stateDiscomOptions[0].value });
  }, [draft.property.distributionCompany, stateDiscomOptions]);

  function updateProperty(values) {
    updateDraft("property", values);
  }

  function clearError(key) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleContinue() {
    const { valid, errors: ve } = validateStep2(draft);
    if (!valid) {
      setErrors(ve);
      scrollToFirstFieldError(ve);
      return;
    }
    navigate("/booking/roof");
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
        >
          <Stack
            spacing={{ xs: 3, md: 3.8 }}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {/* Stepper */}
            <Box sx={{ width: "100%", maxWidth: 720 }}>
              <BookingStepper activeStep={1} />
            </Box>

            {/* Heading */}
            <Stack
              spacing={0.9}
              alignItems="center"
              textAlign="center"
              sx={{ maxWidth: 500 }}
            >
              <Typography
                variant="h1"
                sx={{ ...publicTypography.pageTitle, color: "#18253A" }}
              >
                Tell us about your property 🏠
              </Typography>
              <Typography
                sx={{ color: "#707D90", fontSize: "0.94rem", lineHeight: 1.65 }}
              >
                This helps us recommend the right solar system and accurately
                calculate your savings.
              </Typography>
            </Stack>

            {/* Main card */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 860,
                p: { xs: 2.4, md: 3.4 },
                borderRadius: "1.4rem",
                bgcolor: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(221,229,239,0.98)",
                boxShadow: "0 20px 50px rgba(20,34,56,0.08)",
              }}
            >
              {/* ── Property Type — full width ── */}
              <Box data-field="property.type">
                <FieldLabel>Property Type</FieldLabel>
                <Grid container spacing={1.4} sx={{ mt: 0.2 }}>
                  {propertyTypes.map((item) => (
                    <Grid key={item.value} size={{ xs: 12, sm: 4 }}>
                      <OptionCard
                        {...item}
                        selected={draft.property.type === item.value}
                        onClick={() => {
                          updateProperty({ type: item.value });
                          clearError("property.type");
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                {errors["property.type"] && (
                  <Typography
                    sx={{ mt: 0.8, color: "#D32F2F", fontSize: "0.72rem" }}
                  >
                    {errors["property.type"]}
                  </Typography>
                )}
              </Box>

              <Divider
                sx={{ my: { xs: 2.6, md: 3 }, borderColor: "#EDF1F6" }}
              />

              {/* ── Ownership + Discom + Connection — 3 equal columns ── */}
              <Grid
                container
                spacing={{ xs: 2.4, md: 2.8 }}
                alignItems="stretch"
              >
                {/* Ownership */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    data-field="property.ownership"
                    sx={{
                      height: "100%",
                      p: 1.6,
                      borderRadius: "0.95rem",
                      border: errors["property.ownership"]
                        ? "1.5px solid #D32F2F"
                        : "1px solid #EEF2F7",
                      bgcolor: "#FAFBFD",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <FieldLabel>Ownership Status</FieldLabel>
                    <SegmentedChoice
                      items={ownershipTypes}
                      value={draft.property.ownership}
                      onChange={(ownership) => {
                        updateProperty({ ownership });
                        clearError("property.ownership");
                      }}
                    />
                    {errors["property.ownership"] && (
                      <Typography
                        sx={{ color: "#D32F2F", fontSize: "0.72rem", mt: 0.2 }}
                      >
                        {errors["property.ownership"]}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Distribution Company */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    data-field="property.distributionCompany"
                    sx={{
                      height: "100%",
                      p: 1.6,
                      borderRadius: "0.95rem",
                      border:
                        !discomsLoading && stateDiscomOptions.length === 0
                          ? "1.5px solid #FFA726"
                          : errors["property.distributionCompany"]
                            ? "1.5px solid #D32F2F"
                            : "1px solid #EEF2F7",
                      bgcolor:
                        !discomsLoading && stateDiscomOptions.length === 0
                          ? "#FFFBF5"
                          : "#FAFBFD",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <FieldLabel>Distribution Company</FieldLabel>

                    {/* ── not yet configured ── */}
                    {!discomsLoading && stateDiscomOptions.length === 0 ? (
                      <Stack spacing={0.6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 1.2,
                            py: 1,
                            borderRadius: "0.75rem",
                            bgcolor: "#FFF3E0",
                            border: "1px solid #FFE0B2",
                          }}
                        >
                          <Typography sx={{ fontSize: "1rem", lineHeight: 1 }}>
                            ⚠️
                          </Typography>
                          <Box>
                            <Typography
                              sx={{
                                color: "#E65100",
                                fontSize: "0.74rem",
                                fontWeight: 800,
                                lineHeight: 1.3,
                              }}
                            >
                              Not configured for this state
                            </Typography>
                            <Typography
                              sx={{
                                color: "#BF360C",
                                fontSize: "0.66rem",
                                lineHeight: 1.45,
                                mt: 0.25,
                              }}
                            >
                              Please contact your admin to add distribution
                              companies for this state.
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    ) : (
                      /* ── normal dropdown ── */
                      <TextField
                        select
                        fullWidth
                        disabled={discomsLoading}
                        value={
                          discomsLoading
                            ? ""
                            : (draft.property.distributionCompany ?? "")
                        }
                        onChange={(e) => {
                          updateProperty({
                            distributionCompany: e.target.value,
                          });
                          clearError("property.distributionCompany");
                        }}
                        error={!!errors["property.distributionCompany"]}
                        helperText={errors["property.distributionCompany"]}
                        SelectProps={{
                          displayEmpty: true,
                          IconComponent: KeyboardArrowDownRoundedIcon,
                        }}
                        sx={{
                          ...INPUT_SX,
                          "& .MuiOutlinedInput-root": {
                            ...INPUT_SX["& .MuiOutlinedInput-root"],
                            bgcolor: discomsLoading ? "#F0F2F5" : "#F3F5F9",
                          },
                        }}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      >
                        {discomsLoading ? (
                          <MenuItem value="" disabled>
                            Loading...
                          </MenuItem>
                        ) : (
                          stateDiscomOptions.map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                              {o.label}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  </Box>
                </Grid>

                {/* Connection Type */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    data-field="property.connectionType"
                    sx={{
                      height: "100%",
                      p: 1.6,
                      borderRadius: "0.95rem",
                      border: errors["property.connectionType"]
                        ? "1.5px solid #D32F2F"
                        : "1px solid #EEF2F7",
                      bgcolor: "#FAFBFD",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <FieldLabel>Connection Type</FieldLabel>
                    <TextField
                      select
                      fullWidth
                      value={draft.property.connectionType ?? ""}
                      onChange={(e) => {
                        updateProperty({ connectionType: e.target.value });
                        clearError("property.connectionType");
                      }}
                      error={!!errors["property.connectionType"]}
                      helperText={errors["property.connectionType"]}
                      SelectProps={{
                        displayEmpty: true,
                        IconComponent: KeyboardArrowDownRoundedIcon,
                      }}
                      sx={INPUT_SX}
                      FormHelperTextProps={{
                        sx: { fontSize: "0.68rem", mx: 0.5 },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Type
                      </MenuItem>
                      <MenuItem value="single_phase">Single Phase</MenuItem>
                      <MenuItem value="three_phase">Three Phase</MenuItem>
                    </TextField>
                    {errors["property.connectionType"] && (
                      <Typography
                        sx={{ color: "#D32F2F", fontSize: "0.72rem", mt: 0.2 }}
                      >
                        {errors["property.connectionType"]}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 2.8, md: 3.2 }, borderColor: "#EDF1F6" }}
              />

              {/* ── Consumer Number + Sanctioned Load ── */}
              <Box>
                <Typography
                  sx={{
                    color: "#59667A",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    mb: 1.6,
                  }}
                >
                  Electricity Details
                </Typography>
                <Grid container spacing={{ xs: 2.4, md: 2.9 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel optional>
                      Consumer Number (from bill)
                    </FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="As printed on your electricity bill"
                      value={draft.property.consumerNumber}
                      onChange={(e) =>
                        updateProperty({
                          consumerNumber: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      sx={INPUT_SX}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel optional>Sanctioned Load</FieldLabel>
                    <TextField
                      fullWidth
                      placeholder="e.g. 5"
                      value={draft.property.sanctionedLoadKw}
                      onChange={(e) =>
                        updateProperty({ sanctionedLoadKw: e.target.value })
                      }
                      InputProps={{
                        sx: {
                          borderRadius: "0.95rem",
                          bgcolor: "#F3F5F9",
                          minHeight: 48,
                          "& fieldset": { border: "none" },
                          "&.Mui-focused fieldset": {
                            border: "1.5px solid #0E56C8",
                          },
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

              <Divider
                sx={{ my: { xs: 2.8, md: 3.2 }, borderColor: "#EDF1F6" }}
              />

              {/* Footer */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1.5}
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
                  onClick={handleContinue}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minWidth: 150,
                    minHeight: 50,
                    borderRadius: "0.85rem",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    textTransform: "none",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 12px 28px rgba(14,86,200,0.22)",
                  }}
                >
                  Continue
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

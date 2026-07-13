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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReorderRoundedIcon from "@mui/icons-material/ReorderRounded";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import { useBookingDraft } from "@/features/public/booking/BookingDraftProvider";
import { validateStep1 } from "@/features/public/booking/bookingValidation";
import BookingStepper from "@/features/public/booking/BookingStepper";
import { usePlatformStates } from "@/shared/hooks/usePlatformStates";
import {
  limitEmailInput,
  limitPhoneNumber,
  PHONE_INPUT_PROPS,
} from "@/shared/lib/forms/inputConstraints";

const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.85rem",
    bgcolor: "#F3F5F9",
    minHeight: 48,
    fontSize: "0.9rem",
    "& fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "1.5px solid #0E56C8" },
    "&.Mui-error fieldset": { border: "1.5px solid #D32F2F" },
    "&.Mui-error": { bgcolor: "#FFF5F5" },
  },
};

const MULTILINE_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.85rem",
    bgcolor: "#F3F5F9",
    fontSize: "0.9rem",
    alignItems: "flex-start",
    "& fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "1.5px solid #0E56C8" },
  },
};

const timeSlots = [
  { title: "Morning", time: "9 AM – 12 PM" },
  { title: "Afternoon", time: "12 PM – 3 PM" },
  { title: "Evening", time: "3 PM – 6 PM" },
];

function SectionLabel({ icon, title }) {
  return (
    <Stack direction="row" spacing={0.9} alignItems="center" sx={{ mb: 2.2 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "0.7rem",
          bgcolor: "#EEF4FF",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ color: "#1A2535", fontWeight: 700, fontSize: "1rem" }}>
        {title}
      </Typography>
    </Stack>
  );
}

function FieldLabel({ children, optional = false }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 0.65 }}
    >
      <Typography
        sx={{ color: "#505C70", fontSize: "0.72rem", fontWeight: 700 }}
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

function clearError(setErrors, key) {
  setErrors((prev) => {
    const next = { ...prev };
    delete next[key];
    return next;
  });
}

export default function BookingStepOnePage() {
  const { draft, updateDraft, updateField } = useBookingDraft();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const {
    stateOptions,
    getCityOptions,
    loading: statesLoading,
  } = usePlatformStates();

  // Auto-select the first state if none chosen yet
  useEffect(() => {
    if (stateOptions.length && !draft.installationAddress.state) {
      const first = stateOptions[0];
      const firstCity = getCityOptions(first.key)[0];
      updateDraft("installationAddress", {
        state: first.key,
        city: firstCity?.name ?? "",
        pincode: firstCity?.pincode ?? "",
      });
    }
  }, [stateOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateContact(values) {
    updateDraft("contact", values);
  }
  function updateAddress(values) {
    updateDraft("installationAddress", values);
  }
  function updateInspection(values) {
    updateDraft("inspection", values);
  }

  function handleContinue() {
    const { valid, errors: ve } = validateStep1(draft);
    if (!valid) {
      setErrors(ve);
      // scroll to first error
      const firstKey = Object.keys(ve)[0];
      document
        .querySelector(`[data-field="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    navigate("/booking/property");
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
            {/* ── Stepper ── */}
            <Box sx={{ width: "100%", maxWidth: 720 }}>
              <BookingStepper activeStep={0} />
            </Box>

            {/* ── Heading ── */}
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
                Let&apos;s get started 👋
              </Typography>
              <Typography
                sx={{ color: "#707D90", fontSize: "0.94rem", lineHeight: 1.65 }}
              >
                Tell us a few details to begin your solar journey
              </Typography>
            </Stack>

            {/* ── Main card ── */}
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
              {/* ── Personal + Address ── */}
              <Grid
                container
                spacing={{ xs: 3, md: 4 }}
                alignItems="flex-start"
              >
                {/* Personal Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={
                      <PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
                    }
                    title="Personal Details"
                  />
                  <Stack spacing={2}>
                    <Box data-field="contact.fullName">
                      <FieldLabel>Full name</FieldLabel>
                      <TextField
                        fullWidth
                        placeholder="e.g. Ravi Kumar"
                        value={draft.contact.fullName}
                        error={!!errors["contact.fullName"]}
                        helperText={errors["contact.fullName"]}
                        onChange={(e) => {
                          updateContact({ fullName: e.target.value });
                          clearError(setErrors, "contact.fullName");
                        }}
                        sx={FIELD_SX}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      />
                    </Box>

                    <Box data-field="contact.phoneNumber">
                      <FieldLabel>Phone number</FieldLabel>
                      <TextField
                        fullWidth
                        placeholder="10-digit mobile number"
                        value={draft.contact.phoneNumber}
                        error={!!errors["contact.phoneNumber"]}
                        helperText={errors["contact.phoneNumber"]}
                        inputProps={PHONE_INPUT_PROPS}
                        onChange={(e) => {
                          const cleaned = limitPhoneNumber(e.target.value);
                          updateContact({ phoneNumber: cleaned });
                          clearError(setErrors, "contact.phoneNumber");
                        }}
                        sx={FIELD_SX}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      />
                    </Box>

                    <Box data-field="contact.email">
                      <FieldLabel optional>Email address</FieldLabel>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="name@example.com"
                        value={draft.contact.email}
                        error={!!errors["contact.email"]}
                        helperText={errors["contact.email"]}
                        onChange={(e) => {
                          updateContact({ email: limitEmailInput(e.target.value) });
                          clearError(setErrors, "contact.email");
                        }}
                        sx={FIELD_SX}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      />
                    </Box>

                    <Box data-field="installationAddress.pincode">
                      <FieldLabel>Pincode</FieldLabel>
                      <TextField
                        fullWidth
                        placeholder="e.g. 520001"
                        value={draft.installationAddress.pincode}
                        error={!!errors["installationAddress.pincode"]}
                        helperText={
                          errors["installationAddress.pincode"] ||
                          "Enter your 6-digit pincode"
                        }
                        inputProps={{ inputMode: "numeric", maxLength: 6 }}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          updateAddress({ pincode: cleaned });
                          clearError(setErrors, "installationAddress.pincode");
                        }}
                        sx={FIELD_SX}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* Installation Address */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={<LocationOnOutlinedIcon sx={{ fontSize: "1rem" }} />}
                    title="Installation Address"
                  />
                  <Stack spacing={2}>
                    <Box data-field="installationAddress.street">
                      <FieldLabel>Street / House no.</FieldLabel>
                      <TextField
                        fullWidth
                        placeholder="e.g. 12-3-45, MG Road"
                        value={draft.installationAddress.street}
                        error={!!errors["installationAddress.street"]}
                        helperText={errors["installationAddress.street"]}
                        onChange={(e) => {
                          updateAddress({ street: e.target.value });
                          clearError(setErrors, "installationAddress.street");
                        }}
                        sx={FIELD_SX}
                        FormHelperTextProps={{
                          sx: { fontSize: "0.68rem", mx: 0.5 },
                        }}
                      />
                    </Box>

                    <Box>
                      <FieldLabel optional>Landmark</FieldLabel>
                      <TextField
                        fullWidth
                        placeholder="e.g. Near Bus Stand"
                        value={draft.installationAddress.landmark}
                        onChange={(e) =>
                          updateAddress({ landmark: e.target.value })
                        }
                        sx={FIELD_SX}
                      />
                    </Box>

                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box data-field="installationAddress.state">
                          <FieldLabel>State</FieldLabel>
                          <TextField
                            select
                            fullWidth
                            disabled={statesLoading || stateOptions.length === 0}
                            value={draft.installationAddress.state || ""}
                            error={!!errors["installationAddress.state"]}
                            helperText={
                              errors["installationAddress.state"] ||
                              (!statesLoading && stateOptions.length === 0
                                ? "No states configured - contact admin"
                                : undefined)
                            }
                            onChange={(e) => {
                              const newState = e.target.value;
                              const cityOptions = getCityOptions(newState);
                              updateAddress({
                                state: newState,
                                city: cityOptions[0]?.name ?? "",
                                pincode: cityOptions[0]?.pincode ?? "",
                              });
                              clearError(
                                setErrors,
                                "installationAddress.state",
                              );
                            }}
                            SelectProps={{
                              displayEmpty: true,
                              IconComponent: KeyboardArrowDownRoundedIcon,
                              renderValue: (selected) => {
                                if (!selected) {
                                  return statesLoading
                                    ? "Loading states..."
                                    : "Select state";
                                }
                                return (
                                  stateOptions.find(
                                    (state) => state.key === selected,
                                  )?.name || "Select state"
                                );
                              },
                              MenuProps: {
                                PaperProps: {
                                  sx: {
                                    maxHeight: 260,
                                    borderRadius: "0.85rem",
                                    boxShadow:
                                      "0 16px 40px rgba(14,34,64,0.12)",
                                    mt: 0.5,
                                  },
                                },
                              },
                            }}
                            sx={FIELD_SX}
                            FormHelperTextProps={{
                              sx: { fontSize: "0.68rem", mx: 0.5 },
                            }}
                          >
                            {statesLoading ? (
                              <MenuItem value="" disabled>
                                Loading states…
                              </MenuItem>
                            ) : stateOptions.length === 0 ? (
                              <MenuItem value="" disabled>
                                No states configured — contact admin
                              </MenuItem>
                            ) : (
                              stateOptions.map((s) => (
                                <MenuItem key={s.key} value={s.key}>
                                  {s.name}
                                </MenuItem>
                              ))
                            )}
                          </TextField>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box data-field="installationAddress.city">
                          <FieldLabel>City</FieldLabel>
                          {(() => {
                            const selectedState =
                              draft.installationAddress.state;
                            const cityOptions = getCityOptions(
                              selectedState || "",
                            );
                            const cities = cityOptions.map((city) => city.name);
                            const noCities =
                              !statesLoading &&
                              selectedState &&
                              cities.length === 0;
                            return noCities ? (
                              <Box
                                sx={{
                                  minHeight: 48,
                                  borderRadius: "0.85rem",
                                  bgcolor: "#FFFBF5",
                                  border: "1px solid #FFE0B2",
                                  px: 1.5,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.8,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "0.95rem", lineHeight: 1 }}
                                >
                                  ⚠️
                                </Typography>
                                <Box>
                                  <Typography
                                    sx={{
                                      color: "#E65100",
                                      fontSize: "0.74rem",
                                      fontWeight: 700,
                                    }}
                                  >
                                    No cities for this state
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#BF360C",
                                      fontSize: "0.62rem",
                                    }}
                                  >
                                    Contact admin to add cities
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <TextField
                                select
                                fullWidth
                                disabled={statesLoading || !selectedState}
                                value={draft.installationAddress.city || ""}
                                error={!!errors["installationAddress.city"]}
                                helperText={errors["installationAddress.city"]}
                                onChange={(e) => {
                                  const selectedCity = e.target.value;
                                  const matchedCity = cityOptions.find(
                                    (city) => city.name === selectedCity,
                                  );
                                  updateAddress({
                                    city: selectedCity,
                                    pincode:
                                      matchedCity?.pincode ||
                                      draft.installationAddress.pincode,
                                  });
                                  clearError(
                                    setErrors,
                                    "installationAddress.city",
                                  );
                                }}
                                SelectProps={{
                                  displayEmpty: true,
                                  IconComponent: KeyboardArrowDownRoundedIcon,
                                  MenuProps: {
                                    PaperProps: {
                                      sx: {
                                        maxHeight: 260,
                                        borderRadius: "0.85rem",
                                        boxShadow:
                                          "0 16px 40px rgba(14,34,64,0.12)",
                                        mt: 0.5,
                                      },
                                    },
                                  },
                                }}
                                sx={FIELD_SX}
                                FormHelperTextProps={{
                                  sx: { fontSize: "0.68rem", mx: 0.5 },
                                }}
                              >
                                <MenuItem value="" disabled>
                                  {!selectedState
                                    ? "Select state first"
                                    : "Select city"}
                                </MenuItem>
                                {cities.map((city) => (
                                  <MenuItem key={city} value={city}>
                                    {city}
                                  </MenuItem>
                                ))}
                              </TextField>
                            );
                          })()}
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 3, md: 3.5 }, borderColor: "#EDF1F6" }}
              />

              {/* ── Inspection + Additional Info ── */}
              <Grid
                container
                spacing={{ xs: 3, md: 4 }}
                alignItems="flex-start"
              >
                {/* Inspection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={
                      <CalendarMonthRoundedIcon sx={{ fontSize: "1rem" }} />
                    }
                    title="Preferred Inspection"
                  />
                  <Stack spacing={2}>
                    <Box>
                      <FieldLabel optional>Preferred date</FieldLabel>
                      <TextField
                        fullWidth
                        type="date"
                        value={draft.inspection.preferredDate}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0],
                        }}
                        onChange={(e) =>
                          updateInspection({ preferredDate: e.target.value })
                        }
                        sx={FIELD_SX}
                      />
                    </Box>

                    <Box>
                      <FieldLabel optional>Preferred time slot</FieldLabel>
                      <Grid container spacing={1}>
                        {timeSlots.map((slot) => {
                          const active =
                            draft.inspection.preferredTimeSlot ===
                            slot.title.toLowerCase();
                          return (
                            <Grid key={slot.title} size={{ xs: 4 }}>
                              <Box
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  updateInspection({
                                    preferredTimeSlot: slot.title.toLowerCase(),
                                  })
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  updateInspection({
                                    preferredTimeSlot: slot.title.toLowerCase(),
                                  })
                                }
                                sx={{
                                  minHeight: 56,
                                  borderRadius: "0.85rem",
                                  border: active
                                    ? "2px solid #0E56C8"
                                    : "1.5px solid #E5EAF0",
                                  bgcolor: active ? "#F0F6FF" : "#F7F9FC",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  gap: 0.3,
                                  transition: "all 0.15s",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.74rem",
                                    fontWeight: 700,
                                    color: active ? "#0E56C8" : "#1D293B",
                                  }}
                                >
                                  {slot.title}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "0.58rem", color: "#7D899D" }}
                                >
                                  {slot.time}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </Stack>
                </Grid>

                {/* Additional Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionLabel
                    icon={<ReorderRoundedIcon sx={{ fontSize: "1rem" }} />}
                    title="Additional Information"
                  />
                  <Box>
                    <FieldLabel optional>Special instructions</FieldLabel>
                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      placeholder="Any specific instructions (e.g. gate code, parking, pets)"
                      value={draft.specialInstructions}
                      onChange={(e) =>
                        updateField("specialInstructions", e.target.value)
                      }
                      sx={MULTILINE_SX}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider
                sx={{ my: { xs: 3, md: 3.5 }, borderColor: "#EDF1F6" }}
              />

              {/* ── Footer ── */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1.5}
              >
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <InfoOutlinedIcon
                    sx={{ fontSize: "0.88rem", color: "#B3A208" }}
                  />
                  <Typography
                    sx={{
                      color: "#7A879A",
                      fontSize: "0.75rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Your data is encrypted and kept private.
                  </Typography>
                </Stack>

                <Button
                  onClick={handleContinue}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minWidth: 190,
                    minHeight: 50,
                    borderRadius: "0.85rem",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 12px 28px rgba(14,86,200,0.22)",
                    textTransform: "none",
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

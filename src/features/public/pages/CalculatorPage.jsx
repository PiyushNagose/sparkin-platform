import { Alert, Box, Button, Chip, Container, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculatorApi } from "@/features/public/api/calculatorApi";
import { calculatorStorage } from "@/features/public/calculator/calculatorStorage";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing, publicTypography } from "@/features/public/pages/publicPageStyles";

const stateOptions = [
  ["telangana", "Telangana"],
  ["andhra_pradesh", "Andhra Pradesh"],
  ["karnataka", "Karnataka"],
];

const insightCards = [
  {
    title: "State Tariff",
    text: "We estimate usage from your monthly bill using AP, Telangana, and Karnataka tariff assumptions.",
    icon: <BoltRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F0F3A6", fg: "#5B6200" },
  },
  {
    title: "Subsidy Ready",
    text: "Residential estimates include PM Surya Ghar subsidy logic capped at Rs 78,000.",
    icon: <PaidOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#DDF5E9", fg: "#0B7D5C" },
  },
  {
    title: "Commercial Inputs",
    text: "Commercial users can include sanctioned load, roof area, and daytime usage for a sharper estimate.",
    icon: <TrendingUpRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#E6F0FF", fg: "#256BFF" },
  },
];

const initialForm = {
  propertyType: "residential",
  state: "telangana",
  city: "Hyderabad",
  pincode: "",
  monthlyBill: "",
  monthlyUnits: "",
  roofAreaSqFt: "",
  sanctionedLoadKw: "",
  connectionType: "single_phase",
  daytimeUsagePercent: "75",
  desiredOffsetPercent: "90",
};

function toNumberOrUndefined(value) {
  return value === "" ? undefined : Number(value);
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCommercial = form.propertyType === "commercial";

  function updateForm(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "propertyType") {
        next.connectionType = value === "commercial" ? "lt" : "single_phase";
        next.desiredOffsetPercent = value === "commercial" ? "75" : "90";
      }

      return next;
    });
  }

  function validateForm() {
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Please enter a valid 6-digit pincode.";
    if (!form.city.trim()) return "Please enter your city.";
    if (!Number(form.monthlyBill) || Number(form.monthlyBill) < 500) return "Monthly bill should be at least Rs 500.";
    if (form.roofAreaSqFt && Number(form.roofAreaSqFt) < 100) return "Roof area should be at least 100 sq. ft.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm();
    setError(validationMessage);
    if (validationMessage) return;

    setIsSubmitting(true);

    try {
      const estimate = await calculatorApi.createEstimate({
        propertyType: form.propertyType,
        state: form.state,
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        monthlyBill: Number(form.monthlyBill),
        monthlyUnits: toNumberOrUndefined(form.monthlyUnits),
        roofAreaSqFt: toNumberOrUndefined(form.roofAreaSqFt),
        sanctionedLoadKw: toNumberOrUndefined(form.sanctionedLoadKw),
        connectionType: form.connectionType,
        daytimeUsagePercent: isCommercial ? toNumberOrUndefined(form.daytimeUsagePercent) : undefined,
        desiredOffsetPercent: toNumberOrUndefined(form.desiredOffsetPercent),
      });

      calculatorStorage.setEstimate(estimate);
      navigate("/calculator/processing");
    } catch (apiError) {
      const serviceability = apiError?.response?.data?.details?.serviceability;
      if (serviceability) {
        calculatorStorage.setServiceability(serviceability);
        navigate("/calculator/unavailable");
        return;
      }

      setError(apiError?.response?.data?.message || apiError?.message || "Could not calculate savings right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background: "radial-gradient(circle at top center, rgba(214,229,246,0.8) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 62%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.compactContainer}>
          <Stack spacing={1.35} alignItems="center" textAlign="center" sx={{ maxWidth: 760, mx: "auto" }}>
            <Typography variant="h1" sx={{ ...publicTypography.heroTitle, color: "#18253A" }}>
              Calculate Your <Box component="span" sx={{ color: "#0E56C8" }}>Solar Savings</Box>
            </Typography>
            <Typography sx={{ maxWidth: 590, color: "#7A889D", ...publicTypography.sectionBody }}>
              Get a state-aware estimate for Andhra Pradesh, Telangana, or Karnataka using your bill, pincode, roof area, and connection details.
            </Typography>
          </Stack>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: { xs: 4.8, md: 5.8 },
              mx: "auto",
              maxWidth: 820,
              p: { xs: 2.3, md: 3.1 },
              borderRadius: "1.45rem",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(218,228,240,0.95)",
              boxShadow: "0 18px 50px rgba(22,36,58,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={2.2}>
              {error ? <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>{error}</Alert> : null}

              <Box>
                <Typography sx={{ mb: 1.1, fontSize: "0.78rem", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", color: "#3B4658" }}>
                  Property Type
                </Typography>
                <Box sx={{ p: 0.45, borderRadius: "0.85rem", bgcolor: "#EFF2F7", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.55 }}>
                  {[
                    ["residential", "Residential"],
                    ["commercial", "Commercial"],
                  ].map(([value, label]) => (
                    <Chip
                      key={value}
                      label={label}
                      onClick={() => updateForm("propertyType", value)}
                      sx={{
                        height: 38,
                        borderRadius: "0.65rem",
                        bgcolor: form.propertyType === value ? "white" : "transparent",
                        color: form.propertyType === value ? "#0E56C8" : "#4C586C",
                        fontWeight: 700,
                        boxShadow: form.propertyType === value ? "0 4px 12px rgba(16,29,51,0.08)" : "none",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 1.45 }}>
                <TextField select label="State" value={form.state} onChange={(event) => updateForm("state", event.target.value)}>
                  {stateOptions.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                </TextField>
                <TextField label="City" value={form.city} onChange={(event) => updateForm("city", event.target.value)} placeholder="Hyderabad" />
                <TextField
                  label="Pincode"
                  value={form.pincode}
                  onChange={(event) => updateForm("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="501101"
                  InputProps={{ startAdornment: <PlaceOutlinedIcon sx={{ color: "#727E92", fontSize: "1.1rem", mr: 1 }} /> }}
                />
                <TextField label="Average Monthly Bill" type="number" value={form.monthlyBill} onChange={(event) => updateForm("monthlyBill", event.target.value)} placeholder="1200" />
                <TextField label="Monthly Units (optional)" type="number" value={form.monthlyUnits} onChange={(event) => updateForm("monthlyUnits", event.target.value)} placeholder="Auto from bill" />
                <TextField label="Available Roof Area sq. ft. (optional)" type="number" value={form.roofAreaSqFt} onChange={(event) => updateForm("roofAreaSqFt", event.target.value)} placeholder="600" />
                <TextField label="Sanctioned Load kW (optional)" type="number" value={form.sanctionedLoadKw} onChange={(event) => updateForm("sanctionedLoadKw", event.target.value)} placeholder={isCommercial ? "25" : "5"} />
                <TextField select label="Connection Type" value={form.connectionType} onChange={(event) => updateForm("connectionType", event.target.value)}>
                  {(isCommercial ? [["lt", "LT"], ["ht", "HT"]] : [["single_phase", "Single Phase"], ["three_phase", "Three Phase"]]).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </TextField>
                {isCommercial ? (
                  <TextField label="Daytime Usage %" type="number" value={form.daytimeUsagePercent} onChange={(event) => updateForm("daytimeUsagePercent", event.target.value)} />
                ) : null}
                <TextField label="Target Solar Offset %" type="number" value={form.desiredOffsetPercent} onChange={(event) => updateForm("desiredOffsetPercent", event.target.value)} />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 0.5,
                  minHeight: 58,
                  borderRadius: "0.85rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #0E56C8 0%, #1BC17B 100%)",
                  boxShadow: "0 10px 24px rgba(27,193,123,0.18)",
                }}
              >
                {isSubmitting ? "Calculating..." : "Calculate Savings"}
              </Button>
            </Stack>
          </Box>
        </Container>

        <Container maxWidth={false} disableGutters className={styles.contentContainer} sx={{ mt: { xs: 5.8, md: 7 } }}>
          <Grid container spacing={{ xs: 2.5, md: 4 }} justifyContent="center">
            {insightCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3.3 }}>
                <Box sx={{ maxWidth: 300, mx: "auto", p: { xs: 1.8, md: 2 }, height: "100%", borderRadius: "1.15rem", bgcolor: "rgba(255,255,255,0.7)", border: "1px solid rgba(223,231,241,0.8)" }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "0.9rem", bgcolor: item.tone.bg, color: item.tone.fg, display: "grid", placeItems: "center", mb: 1.35 }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ color: "#18253A", fontWeight: 800, fontSize: "1.05rem" }}>{item.title}</Typography>
                  <Typography sx={{ mt: 1, color: "#6C7990", lineHeight: 1.72, fontSize: "0.9rem" }}>{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

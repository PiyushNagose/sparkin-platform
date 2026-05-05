import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useCallback, useEffect, useState } from "react";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import pricingBannerImg from "@/shared/assets/images/admin/settings/admin-settings-pricing-engine-placeholder.png";

// ─── storage key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "sparkin_admin_platform_settings";

// ─── defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  pricing: {
    standardCostPerKw: "55000",
    minBidAmount: "45000",
    maxBidAmount: "85000",
  },
  bidding: {
    windowHours: "48",
    autoExtendMinutes: "30",
    maxVendorsPerLead: "5",
  },
  subsidy: {
    centralPct: "40",
    maxAmount: "78000",
    residentialOnly: true,
  },
  states: [
    { id: "ap", name: "Andhra Pradesh", rate: "7.50" },
    { id: "ts", name: "Telangana", rate: "6.20" },
    { id: "ka", name: "Karnataka", rate: "8.10" },
  ],
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    return { ...structuredClone(DEFAULT_SETTINGS), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function formatSavedTime(ts) {
  if (!ts) return "Never saved";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPositiveNumber(v) {
  return /^\d+(\.\d+)?$/.test(String(v).trim()) && Number(v) > 0;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── sub-components ──────────────────────────────────────────────────────────

const fieldLabelSx = {
  mb: 0.7,
  color: "#8B97A8",
  fontSize: "0.6rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.85rem",
    bgcolor: "#F7F9FC",
    fontSize: "0.92rem",
    fontWeight: 700,
    transition: "box-shadow 0.15s",
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(14,86,200,0.12)" },
  },
};

function FieldLabel({ children, tooltip }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.7 }}>
      <Typography sx={fieldLabelSx}>{children}</Typography>
      {tooltip ? (
        <Tooltip title={tooltip} placement="top" arrow>
          <InfoOutlinedIcon
            sx={{ color: "#B0BAC8", fontSize: "0.82rem", cursor: "help" }}
          />
        </Tooltip>
      ) : null}
    </Stack>
  );
}

function SectionRow({
  icon: Icon,
  title,
  description,
  children,
  accent = "#0E56C8",
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
        gap: { xs: 2, md: 4 },
        alignItems: "start",
      }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={1.1}
          alignItems="center"
          sx={{ mb: 0.7 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "0.85rem",
              bgcolor: `${accent}18`,
              color: accent,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: "1.05rem" }} />
          </Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.05rem",
              fontWeight: 900,
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography
          sx={{
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            lineHeight: 1.65,
            pl: 0.5,
          }}
        >
          {description}
        </Typography>
      </Box>
      <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>{children}</AdminPanel>
    </Box>
  );
}

function ValidationHint({ value, label }) {
  if (!value || isPositiveNumber(value)) return null;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.6 }}>
      <WarningAmberRoundedIcon sx={{ color: "#E07B00", fontSize: "0.82rem" }} />
      <Typography
        sx={{ color: "#E07B00", fontSize: "0.7rem", fontWeight: 700 }}
      >
        {label} must be a positive number.
      </Typography>
    </Stack>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(loadSettings);
  const [savedAt, setSavedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [stateErrors, setStateErrors] = useState({});
  const [, forceRender] = useState(0);

  // tick the "saved X min ago" label every 30s
  useEffect(() => {
    const id = setInterval(() => forceRender((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // warn on unload if dirty
  useEffect(() => {
    function onBeforeUnload(e) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // ── field updaters ─────────────────────────────────────────────────────────

  const updatePricing = useCallback((field, value) => {
    setSettings((s) => ({ ...s, pricing: { ...s.pricing, [field]: value } }));
    setIsDirty(true);
  }, []);

  const updateBidding = useCallback((field, value) => {
    setSettings((s) => ({ ...s, bidding: { ...s.bidding, [field]: value } }));
    setIsDirty(true);
  }, []);

  const updateSubsidy = useCallback((field, value) => {
    setSettings((s) => ({ ...s, subsidy: { ...s.subsidy, [field]: value } }));
    setIsDirty(true);
  }, []);

  const updateStateName = useCallback((id, value) => {
    setSettings((s) => ({
      ...s,
      states: s.states.map((st) =>
        st.id === id ? { ...st, name: value } : st,
      ),
    }));
    setIsDirty(true);
  }, []);

  const updateStateRate = useCallback((id, value) => {
    setSettings((s) => ({
      ...s,
      states: s.states.map((st) =>
        st.id === id ? { ...st, rate: value } : st,
      ),
    }));
    setStateErrors((e) => ({ ...e, [id]: !isPositiveNumber(value) }));
    setIsDirty(true);
  }, []);

  const addState = useCallback(() => {
    setSettings((s) => ({
      ...s,
      states: [...s.states, { id: uid(), name: "", rate: "" }],
    }));
    setIsDirty(true);
  }, []);

  const removeState = useCallback((id) => {
    setSettings((s) => ({
      ...s,
      states: s.states.filter((st) => st.id !== id),
    }));
    setStateErrors((e) => {
      const next = { ...e };
      delete next[id];
      return next;
    });
    setIsDirty(true);
  }, []);

  // ── validation ─────────────────────────────────────────────────────────────

  function validate() {
    const errors = [];
    const p = settings.pricing;
    const b = settings.bidding;
    const sub = settings.subsidy;

    if (!isPositiveNumber(p.standardCostPerKw))
      errors.push("Standard Cost Per kW");
    if (!isPositiveNumber(p.minBidAmount)) errors.push("Minimum Bid Amount");
    if (!isPositiveNumber(p.maxBidAmount)) errors.push("Maximum Bid Amount");
    if (
      isPositiveNumber(p.minBidAmount) &&
      isPositiveNumber(p.maxBidAmount) &&
      Number(p.minBidAmount) >= Number(p.maxBidAmount)
    )
      errors.push("Min Bid must be less than Max Bid");
    if (!isPositiveNumber(b.windowHours)) errors.push("Bidding Window Hours");
    if (!isPositiveNumber(b.maxVendorsPerLead))
      errors.push("Max Vendors Per Lead");
    if (!isPositiveNumber(sub.centralPct) || Number(sub.centralPct) > 100)
      errors.push("Central Subsidy % (0–100)");
    if (!isPositiveNumber(sub.maxAmount)) errors.push("Max Subsidy Amount");
    settings.states.forEach((st, i) => {
      if (!st.name.trim()) errors.push(`State row ${i + 1}: name required`);
      if (!isPositiveNumber(st.rate))
        errors.push(`State row ${i + 1}: valid rate required`);
    });
    return errors;
  }

  // ── save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    const errors = validate();
    if (errors.length) {
      setToast({
        open: true,
        message: `Fix: ${errors.slice(0, 2).join(", ")}${errors.length > 2 ? ` +${errors.length - 2} more` : ""}`,
        severity: "error",
      });
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    saveSettings(settings);
    setSavedAt(Date.now());
    setIsDirty(false);
    setIsSaving(false);
    setToast({
      open: true,
      message: "Platform settings saved successfully.",
      severity: "success",
    });
  }

  // ── reset ──────────────────────────────────────────────────────────────────

  function handleReset() {
    if (
      !window.confirm(
        "Reset all settings to factory defaults? This cannot be undone.",
      )
    )
      return;
    const defaults = structuredClone(DEFAULT_SETTINGS);
    setSettings(defaults);
    saveSettings(defaults);
    setSavedAt(Date.now());
    setIsDirty(false);
    setStateErrors({});
    setToast({
      open: true,
      message: "Settings reset to defaults.",
      severity: "info",
    });
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const hasStateErrors = Object.values(stateErrors).some(Boolean);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Platform Settings"
        subtitle="Configure global thresholds, subsidies, and regional parameters for the Sparkin ecosystem."
      />

      {/* System Pricing Thresholds */}
      <SectionRow
        icon={MonetizationOnOutlinedIcon}
        title="System Pricing Thresholds"
        description="Establish the core financial baseline for solar installations. These values act as guardrails for all vendor bids."
        accent="#0E56C8"
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <FieldLabel tooltip="Base cost used by the calculator to estimate project value">
              Standard Cost Per kW (₹)
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.pricing.standardCostPerKw}
              onChange={(e) =>
                updatePricing("standardCostPerKw", e.target.value)
              }
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            <ValidationHint
              value={settings.pricing.standardCostPerKw}
              label="Standard cost"
            />
          </Box>

          <Box>
            <FieldLabel tooltip="Vendors cannot submit quotes below this amount">
              Minimum Bid Amount (₹)
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.pricing.minBidAmount}
              onChange={(e) => updatePricing("minBidAmount", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            <ValidationHint
              value={settings.pricing.minBidAmount}
              label="Minimum bid"
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <FieldLabel tooltip="Bids above this amount are auto-flagged for admin review">
              Maximum Bid Amount (₹)
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.pricing.maxBidAmount}
              onChange={(e) => updatePricing("maxBidAmount", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            {isPositiveNumber(settings.pricing.minBidAmount) &&
            isPositiveNumber(settings.pricing.maxBidAmount) &&
            Number(settings.pricing.minBidAmount) >=
              Number(settings.pricing.maxBidAmount) ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mt: 0.6 }}
              >
                <WarningAmberRoundedIcon
                  sx={{ color: "#E07B00", fontSize: "0.82rem" }}
                />
                <Typography
                  sx={{ color: "#E07B00", fontSize: "0.7rem", fontWeight: 700 }}
                >
                  Min bid must be less than max bid.
                </Typography>
              </Stack>
            ) : (
              <>
                <ValidationHint
                  value={settings.pricing.maxBidAmount}
                  label="Maximum bid"
                />
                <Typography
                  sx={{ mt: 0.8, color: "#8B97A8", fontSize: "0.72rem" }}
                >
                  Bids exceeding this amount will be automatically flagged for
                  review.
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </SectionRow>

      <Divider
        sx={{ my: { xs: 3, md: 3.5 }, borderColor: "rgba(225,232,241,0.96)" }}
      />

      {/* Bidding Rules */}
      <SectionRow
        icon={GavelOutlinedIcon}
        title="Bidding Rules"
        description="Define the duration and automation logic for the auction process to ensure fair competition."
        accent="#7C7A00"
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <FieldLabel tooltip="How long vendors have to submit quotes after a lead is opened">
              Bidding Window (Hours)
            </FieldLabel>
            <TextField
              size="small"
              value={settings.bidding.windowHours}
              onChange={(e) => updateBidding("windowHours", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      sx={{
                        color: "#8B97A8",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      HRS
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, width: "100%" }}
            />
            <ValidationHint
              value={settings.bidding.windowHours}
              label="Window"
            />
          </Box>

          <Box>
            <FieldLabel tooltip="Extra time added if a bid arrives in the final minutes">
              Auto-Extend (Minutes)
            </FieldLabel>
            <TextField
              size="small"
              value={settings.bidding.autoExtendMinutes}
              onChange={(e) =>
                updateBidding("autoExtendMinutes", e.target.value)
              }
              inputProps={{ inputMode: "numeric" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      sx={{
                        color: "#8B97A8",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      MIN
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, width: "100%" }}
            />
            <ValidationHint
              value={settings.bidding.autoExtendMinutes}
              label="Auto-extend"
            />
          </Box>

          <Box>
            <FieldLabel tooltip="Maximum number of vendors that can bid on a single lead">
              Max Vendors Per Lead
            </FieldLabel>
            <TextField
              size="small"
              value={settings.bidding.maxVendorsPerLead}
              onChange={(e) =>
                updateBidding("maxVendorsPerLead", e.target.value)
              }
              inputProps={{ inputMode: "numeric" }}
              sx={{ ...inputSx, width: "100%" }}
            />
            <ValidationHint
              value={settings.bidding.maxVendorsPerLead}
              label="Max vendors"
            />
          </Box>
        </Box>
      </SectionRow>

      <Divider
        sx={{ my: { xs: 3, md: 3.5 }, borderColor: "rgba(225,232,241,0.96)" }}
      />

      {/* Subsidy Configuration */}
      <SectionRow
        icon={SolarPowerOutlinedIcon}
        title="Subsidy Configuration"
        description="Adjust the central government financial assistance parameters for residential rooftop solar."
        accent="#239654"
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box>
            <FieldLabel tooltip="PM Surya Ghar subsidy percentage applied to residential systems">
              Central Subsidy Percentage (%)
            </FieldLabel>
            <TextField
              size="small"
              value={settings.subsidy.centralPct}
              onChange={(e) => updateSubsidy("centralPct", e.target.value)}
              inputProps={{ inputMode: "numeric", max: 100 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      sx={{
                        color: "#8B97A8",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                      }}
                    >
                      %
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, width: "100%" }}
            />
            {isPositiveNumber(settings.subsidy.centralPct) &&
            Number(settings.subsidy.centralPct) > 100 ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mt: 0.6 }}
              >
                <WarningAmberRoundedIcon
                  sx={{ color: "#E07B00", fontSize: "0.82rem" }}
                />
                <Typography
                  sx={{ color: "#E07B00", fontSize: "0.7rem", fontWeight: 700 }}
                >
                  Percentage cannot exceed 100%.
                </Typography>
              </Stack>
            ) : (
              <ValidationHint
                value={settings.subsidy.centralPct}
                label="Subsidy %"
              />
            )}
          </Box>

          <Box>
            <FieldLabel tooltip="Maximum subsidy cap per installation regardless of system size">
              Max Subsidy Amount (₹)
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.subsidy.maxAmount}
              onChange={(e) => updateSubsidy("maxAmount", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            <ValidationHint
              value={settings.subsidy.maxAmount}
              label="Max subsidy"
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label="Residential Only"
                size="small"
                onClick={() =>
                  updateSubsidy(
                    "residentialOnly",
                    !settings.subsidy.residentialOnly,
                  )
                }
                icon={
                  settings.subsidy.residentialOnly ? (
                    <CheckRoundedIcon sx={{ fontSize: "0.8rem !important" }} />
                  ) : undefined
                }
                sx={{
                  bgcolor: settings.subsidy.residentialOnly
                    ? "#E4F7EA"
                    : "#F0F4F8",
                  color: settings.subsidy.residentialOnly
                    ? "#239654"
                    : "#667386",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  border: settings.subsidy.residentialOnly
                    ? "1px solid #B8EAC8"
                    : "1px solid #DDE3EC",
                }}
              />
              <Typography sx={{ color: "#8B97A8", fontSize: "0.74rem" }}>
                {settings.subsidy.residentialOnly
                  ? "Subsidy applies to residential installations only."
                  : "Subsidy applies to all installation types."}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </SectionRow>

      <Divider
        sx={{ my: { xs: 3, md: 3.5 }, borderColor: "rgba(225,232,241,0.96)" }}
      />

      {/* State Electricity Rates */}
      <SectionRow
        icon={LocationOnOutlinedIcon}
        title="State Electricity Rates"
        description="Regional unit rates used to calculate projected savings and ROI for customers in different states."
        accent="#F47C22"
      >
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 160px 100px",
              gap: 1.5,
              mb: 1.2,
              px: 0.5,
            }}
          >
            {["State / UT", "Rate Per Unit (₹)", "Actions"].map((h) => (
              <Typography key={h} sx={fieldLabelSx}>
                {h}
              </Typography>
            ))}
          </Box>

          <Stack spacing={1.1}>
            {settings.states.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px 100px",
                  gap: 1.5,
                  alignItems: "center",
                  p: 1,
                  borderRadius: "0.85rem",
                  bgcolor: stateErrors[row.id] ? "#FFF8F0" : "transparent",
                  border: stateErrors[row.id]
                    ? "1px solid #F5C97A"
                    : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <TextField
                  size="small"
                  value={row.name}
                  onChange={(e) => updateStateName(row.id, e.target.value)}
                  placeholder="State name"
                  sx={inputSx}
                />
                <TextField
                  size="small"
                  value={row.rate}
                  onChange={(e) => updateStateRate(row.id, e.target.value)}
                  placeholder="0.00"
                  inputProps={{ inputMode: "decimal" }}
                  error={Boolean(stateErrors[row.id])}
                  sx={inputSx}
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Button
                    size="small"
                    onClick={() => {
                      if (!row.name.trim() || !isPositiveNumber(row.rate))
                        return;
                      setToast({
                        open: true,
                        message: `${row.name} rate updated.`,
                        severity: "success",
                      });
                    }}
                    sx={{
                      px: 1,
                      color: "#0E56C8",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      textTransform: "none",
                      minWidth: 0,
                      borderRadius: "0.65rem",
                      "&:hover": { bgcolor: "#EEF4FF" },
                    }}
                  >
                    Update
                  </Button>
                  <Tooltip title="Remove state" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => removeState(row.id)}
                      sx={{
                        color: "#D74C4C",
                        borderRadius: "0.65rem",
                        "&:hover": { bgcolor: "#FFF0F0" },
                      }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>

          {hasStateErrors ? (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <WarningAmberRoundedIcon
                sx={{ color: "#E07B00", fontSize: "0.82rem" }}
              />
              <Typography
                sx={{ color: "#E07B00", fontSize: "0.72rem", fontWeight: 700 }}
              >
                Some state rates have invalid values. Fix before saving.
              </Typography>
            </Stack>
          ) : null}

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={addState}
            sx={{
              mt: 1.8,
              color: "#0E56C8",
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "none",
              px: 0,
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            + Add New State
          </Button>
        </Box>
      </SectionRow>

      {/* Dynamic Pricing Engine Banner */}
      <Box
        sx={{
          mt: 4,
          position: "relative",
          borderRadius: "1.4rem",
          overflow: "hidden",
          height: { xs: 180, md: 220 },
          backgroundImage: `url(${pricingBannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 12px 30px rgba(16,29,51,0.06)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,30,70,0.88) 0%, rgba(10,30,70,0.55) 55%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.66rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            Powered by your parameters
          </Typography>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1.2rem", md: "1.6rem" },
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            Dynamic Pricing Engine
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.84rem",
              maxWidth: 440,
              lineHeight: 1.6,
            }}
          >
            Our algorithm analyses historical bid data to auto-recalibrate
            thresholds every 24 hours.
          </Typography>
        </Box>
      </Box>

      {/* Sticky footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 4,
          mx: { xs: -2.2, md: -3.6, lg: -4.2 },
          px: { xs: 2.2, md: 3.6, lg: 4.2 },
          py: 2,
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(225,232,241,0.96)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityOutlinedIcon sx={{ color: "#239654", fontSize: "1rem" }} />
          <Box>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.8rem",
                  fontWeight: 800,
                }}
              >
                Admin Session Active
              </Typography>
              {isDirty ? (
                <Chip
                  label="Unsaved changes"
                  size="small"
                  sx={{
                    height: 18,
                    bgcolor: "#FFF4E0",
                    color: "#B06000",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    border: "1px solid #F5C97A",
                  }}
                />
              ) : null}
            </Stack>
            <Typography
              sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}
            >
              {savedAt
                ? `Last saved ${formatSavedTime(savedAt)} by Admin`
                : "Settings loaded from local storage"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={handleReset}
            sx={{
              minHeight: 44,
              px: 2.2,
              borderRadius: "0.9rem",
              borderColor: "rgba(225,232,241,0.96)",
              color: "#556478",
              fontSize: "0.86rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#F6F8FB", borderColor: "#C8D0DC" },
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={isSaving ? null : <SaveRoundedIcon />}
            onClick={handleSave}
            disabled={isSaving || hasStateErrors}
            sx={{
              minHeight: 44,
              px: 2.8,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 10px 24px rgba(14,86,200,0.18)",
              fontSize: "0.86rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#0B49AD" },
              "&:disabled": { bgcolor: "#A0B8E0", boxShadow: "none" },
            }}
          >
            {isSaving ? "Saving…" : "Save Global Settings"}
          </Button>
        </Stack>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            borderRadius: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(16,29,51,0.14)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AdminPageShell>
  );
}

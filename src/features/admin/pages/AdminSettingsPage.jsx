import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
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
import { platformSettingsApi } from "@/features/admin/api/adminApi";
import pricingBannerImg from "@/shared/assets/images/admin/settings/admin-settings-pricing-engine-placeholder.png";

// â”€â”€â”€ storage key â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STORAGE_KEY = "sparkin_admin_platform_settings";

// â”€â”€â”€ defaults â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    for1Kw: "30000",
    for2Kw: "60000",
    above3Kw: "78000",
    residentialOnly: true,
  },
  states: [
    {
      id: "ap",
      key: "andhra_pradesh",
      name: "Andhra Pradesh",
      rate: "7.50",
      cities: [
        "Visakhapatnam",
        "Vijayawada",
        "Guntur",
        "Nellore",
        "Kurnool",
        "Rajamahendravaram",
        "Kakinada",
        "Tirupati",
        "Kadapa",
        "Eluru",
        "Ongole",
        "Nandyal",
        "Vizianagaram",
        "Anantapur",
        "Proddatur",
        "Srikakulam",
        "Adoni",
        "Tenali",
        "Chittoor",
        "Hindupur",
      ],
    },
  ],
  discoms: [
    {
      id: "apspdcl",
      stateKey: "andhra_pradesh",
      name: "Southern Power Distribution Company of AP",
      code: "APSPDCL",
      status: "active",
    },
    {
      id: "apepdcl",
      stateKey: "andhra_pradesh",
      name: "Eastern Power Distribution Company of AP",
      code: "APEPDCL",
      status: "active",
    },
  ],
};

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...parsed,
      pricing: {
        ...structuredClone(DEFAULT_SETTINGS).pricing,
        ...parsed.pricing,
      },
      bidding: {
        ...structuredClone(DEFAULT_SETTINGS).bidding,
        ...parsed.bidding,
      },
      subsidy: {
        ...structuredClone(DEFAULT_SETTINGS).subsidy,
        ...parsed.subsidy,
        above3Kw:
          parsed.subsidy?.above3Kw ??
          parsed.subsidy?.maxAmount ??
          structuredClone(DEFAULT_SETTINGS).subsidy.above3Kw,
      },
      // Restore states and discoms from localStorage if present
      states: parsed.states?.length
        ? parsed.states.map((s) => ({ cities: [], ...s }))
        : structuredClone(DEFAULT_SETTINGS.states),
      discoms: parsed.discoms?.length
        ? parsed.discoms
        : structuredClone(DEFAULT_SETTINGS.discoms),
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function toStateKey(name = "") {
  // Convert a display name to a key: "Andhra Pradesh" → "andhra_pradesh"
  return name.trim().toLowerCase().replaceAll(/\s+/g, "_");
}

function normalizeSettingsForUi(settings) {
  // Preserve all states as-is — just ensure numeric fields are strings for inputs
  const states = (
    settings.states?.length ? settings.states : DEFAULT_SETTINGS.states
  ).map((state) => ({
    ...state,
    // Generate key from name if key is missing
    key: state.key || toStateKey(state.name),
    id: state.id || toStateKey(state.name),
    rate: String(state.rate),
    cities: Array.isArray(state.cities) ? state.cities : [],
  }));

  return {
    ...settings,
    pricing: Object.fromEntries(
      Object.entries(settings.pricing).map(([key, value]) => [
        key,
        String(value),
      ]),
    ),
    bidding: Object.fromEntries(
      Object.entries(settings.bidding).map(([key, value]) => [
        key,
        String(value),
      ]),
    ),
    subsidy: {
      ...settings.subsidy,
      for1Kw: String(settings.subsidy.for1Kw ?? 30000),
      for2Kw: String(settings.subsidy.for2Kw ?? 60000),
      above3Kw: String(
        settings.subsidy.above3Kw ?? settings.subsidy.maxAmount ?? 78000,
      ),
      residentialOnly: settings.subsidy.residentialOnly !== false,
    },
    states,
    discoms: (settings.discoms || DEFAULT_SETTINGS.discoms).map((discom) => ({
      ...discom,
      status: discom.status === "disabled" ? "disabled" : "active",
    })),
  };
}

function normalizeSettingsForApi(settings) {
  // Build a key→state map so DISCOMs can reference the correct key
  const stateKeyMap = Object.fromEntries(
    settings.states.map((s) => [s.id, s.key || toStateKey(s.name)]),
  );

  return {
    ...settings,
    states: settings.states
      .filter((state) => state.name?.trim())
      .map((state) => ({
        ...state,
        key: state.key || toStateKey(state.name),
        cities: Array.isArray(state.cities) ? state.cities : [],
      })),
    discoms: (settings.discoms || [])
      .map((discom) => ({
        ...discom,
        code: String(discom.code || "")
          .trim()
          .toUpperCase(),
        name: String(discom.name || "").trim(),
        stateKey: stateKeyMap[discom.stateKey] || discom.stateKey,
        status: discom.status === "disabled" ? "disabled" : "active",
      }))
      .filter((discom) => discom.stateKey && discom.name && discom.code),
  };
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

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  // Raw string buffer for cities textarea — keyed by state id
  // This lets users type freely (including trailing commas/spaces) without
  // the array→string join fighting them on every keystroke.
  const [citiesRaw, setCitiesRaw] = useState(() => {
    const initial = loadSettings();
    return Object.fromEntries(
      (initial.states || []).map((s) => [s.id, (s.cities || []).join(", ")]),
    );
  });
  const [, forceRender] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadRemoteSettings() {
      try {
        const remote = await platformSettingsApi.getSettings();
        if (!active) return;
        const normalized = normalizeSettingsForUi(remote);
        setSettings(normalized);
        saveSettings(normalized);
        // Seed citiesRaw from remote data
        setCitiesRaw(
          Object.fromEntries(
            (normalized.states || []).map((s) => [
              s.id,
              (s.cities || []).join(", "),
            ]),
          ),
        );
      } catch {
        // Keep local settings if the business service is offline.
      }
    }
    loadRemoteSettings();
    return () => {
      active = false;
    };
  }, []);

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

  // â”€â”€ field updaters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    const newId = uid();
    setSettings((s) => ({
      ...s,
      states: [...s.states, { id: newId, name: "", rate: "", cities: [] }],
    }));
    setCitiesRaw((prev) => ({ ...prev, [newId]: "" }));
    setIsDirty(true);
  }, []);

  // Called on every keystroke — only updates the raw display string
  const handleCitiesRawChange = useCallback((id, value) => {
    setCitiesRaw((prev) => ({ ...prev, [id]: value }));
    setIsDirty(true);
  }, []);

  // Called on blur — parse raw string into the cities array in settings
  const commitCities = useCallback((id) => {
    setCitiesRaw((prev) => {
      const raw = prev[id] ?? "";
      const cities = raw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      setSettings((s) => ({
        ...s,
        states: s.states.map((st) => (st.id === id ? { ...st, cities } : st)),
      }));
      return prev;
    });
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
    setCitiesRaw((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setIsDirty(true);
  }, []);

  const addDiscom = useCallback(() => {
    setSettings((s) => ({
      ...s,
      discoms: [
        ...(s.discoms || []),
        {
          id: uid(),
          stateKey: s.states[0]?.key || "andhra_pradesh",
          name: "",
          code: "",
          status: "active",
        },
      ],
    }));
    setIsDirty(true);
  }, []);

  const updateDiscom = useCallback((id, field, value) => {
    setSettings((s) => ({
      ...s,
      discoms: (s.discoms || []).map((discom) =>
        discom.id === id
          ? {
              ...discom,
              [field]: field === "code" ? value.toUpperCase() : value,
            }
          : discom,
      ),
    }));
    setIsDirty(true);
  }, []);

  const toggleDiscomStatus = useCallback((id) => {
    setSettings((s) => ({
      ...s,
      discoms: (s.discoms || []).map((discom) =>
        discom.id === id
          ? {
              ...discom,
              status: discom.status === "disabled" ? "active" : "disabled",
            }
          : discom,
      ),
    }));
    setIsDirty(true);
  }, []);

  const removeDiscom = useCallback((id) => {
    setSettings((s) => ({
      ...s,
      discoms: (s.discoms || []).filter((discom) => discom.id !== id),
    }));
    setIsDirty(true);
  }, []);

  // â”€â”€ validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    if (!isPositiveNumber(sub.for1Kw)) errors.push("Subsidy for 1kW");
    if (!isPositiveNumber(sub.for2Kw)) errors.push("Subsidy for 2kW");
    if (!isPositiveNumber(sub.above3Kw)) errors.push("Subsidy above 3kW");
    if (
      isPositiveNumber(sub.for1Kw) &&
      isPositiveNumber(sub.for2Kw) &&
      Number(sub.for2Kw) < Number(sub.for1Kw)
    )
      errors.push("2kW subsidy must be greater than or equal to 1kW subsidy");
    if (
      isPositiveNumber(sub.for2Kw) &&
      isPositiveNumber(sub.above3Kw) &&
      Number(sub.above3Kw) < Number(sub.for2Kw)
    )
      errors.push("3kW+ subsidy must be greater than or equal to 2kW subsidy");
    settings.states.forEach((st, i) => {
      if (!st.name.trim()) errors.push(`State row ${i + 1}: name required`);
      if (!isPositiveNumber(st.rate))
        errors.push(`State row ${i + 1}: valid rate required`);
    });
    (settings.discoms || []).forEach((discom, i) => {
      if (!String(discom.stateKey || "").trim())
        errors.push(`DISCOM row ${i + 1}: state required`);
      if (!String(discom.name || "").trim())
        errors.push(`DISCOM row ${i + 1}: company name required`);
      if (!String(discom.code || "").trim())
        errors.push(`DISCOM row ${i + 1}: company code required`);
    });
    return errors;
  }

  // â”€â”€ save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async function handleSave() {
    // Flush any in-progress cities text before validating / saving
    setSettings((s) => ({
      ...s,
      states: s.states.map((st) => {
        const raw = citiesRaw[st.id];
        if (raw === undefined) return st;
        const cities = raw
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        return { ...st, cities };
      }),
    }));

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
    try {
      const saved = await platformSettingsApi.updateSettings(
        normalizeSettingsForApi(settings),
      );
      const normalized = normalizeSettingsForUi(saved);
      setSettings(normalized);
      saveSettings(normalized);
      // Reseed citiesRaw from saved data
      setCitiesRaw(
        Object.fromEntries(
          (normalized.states || []).map((s) => [
            s.id,
            (s.cities || []).join(", "),
          ]),
        ),
      );
      setSavedAt(Date.now());
      setIsDirty(false);
      setToast({
        open: true,
        message: "Platform settings saved successfully.",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message:
          error?.response?.data?.message ||
          "Unable to save platform settings. Check business service.",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // â”€â”€ reset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    setCitiesRaw(
      Object.fromEntries(
        (defaults.states || []).map((s) => [s.id, (s.cities || []).join(", ")]),
      ),
    );
    setToast({
      open: true,
      message: "Settings reset to defaults.",
      severity: "info",
    });
  }

  // â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
              Standard Cost Per kW (â‚¹)
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
              Minimum Bid Amount (â‚¹)
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
              Maximum Bid Amount (â‚¹)
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
            <FieldLabel tooltip="Configured subsidy amount applied when the recommended system size is 1kW.">
              For 1kW
            </FieldLabel>
            <TextField
              size="small"
              fullWidth
              value={settings.subsidy.for1Kw}
              onChange={(e) => updateSubsidy("for1Kw", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={{ ...inputSx, width: "100%" }}
            />
            <ValidationHint
              value={settings.subsidy.for1Kw}
              label="1kW subsidy"
            />
          </Box>

          <Box>
            <FieldLabel tooltip="Configured subsidy amount applied when the recommended system size reaches 2kW.">
              For 2kW
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.subsidy.for2Kw}
              onChange={(e) => updateSubsidy("for2Kw", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            <ValidationHint
              value={settings.subsidy.for2Kw}
              label="2kW subsidy"
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <FieldLabel tooltip="Configured subsidy cap applied for 3kW and higher residential systems.">
              Above 3kW
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={settings.subsidy.above3Kw}
              onChange={(e) => updateSubsidy("above3Kw", e.target.value)}
              inputProps={{ inputMode: "numeric" }}
              sx={inputSx}
            />
            <ValidationHint
              value={settings.subsidy.above3Kw}
              label="3kW+ subsidy"
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
        title="State Electricity Rates & Cities"
        description="Add states with their electricity tariff rates and city lists. Customers will see these states and their cities in the calculator and booking dropdowns."
        accent="#F47C22"
      >
        <Stack spacing={2.5}>
          {settings.states.map((row) => (
            <Box
              key={row.id}
              sx={{
                p: { xs: 1.8, md: 2.2 },
                borderRadius: "1rem",
                border: stateErrors[row.id]
                  ? "1.5px solid #F5C97A"
                  : "1.5px solid #EEF2F7",
                bgcolor: stateErrors[row.id] ? "#FFF8F0" : "#FAFBFD",
                transition: "all 0.15s",
              }}
            >
              {/* Row header */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.8 }}
              >
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#505C70",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.name?.trim() || "New State"}
                </Typography>
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

              {/* Name + Rate */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 160px" },
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box>
                  <FieldLabel tooltip="Display name shown to customers in dropdowns (e.g. Andhra Pradesh)">
                    State Name
                  </FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={row.name}
                    onChange={(e) => updateStateName(row.id, e.target.value)}
                    placeholder="e.g. Andhra Pradesh"
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  <FieldLabel tooltip="Electricity tariff rate per unit (₹/kWh) used in savings calculations">
                    Rate Per Unit (₹)
                  </FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={row.rate}
                    onChange={(e) => updateStateRate(row.id, e.target.value)}
                    placeholder="7.50"
                    inputProps={{ inputMode: "decimal" }}
                    error={Boolean(stateErrors[row.id])}
                    sx={inputSx}
                  />
                  <ValidationHint value={row.rate} label="Rate" />
                </Box>
              </Box>

              {/* Cities */}
              <Box>
                <FieldLabel tooltip="Type city names separated by commas. Changes are applied when you click outside the field.">
                  Cities (comma-separated)
                </FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  value={citiesRaw[row.id] ?? (row.cities || []).join(", ")}
                  onChange={(e) =>
                    handleCitiesRawChange(row.id, e.target.value)
                  }
                  onBlur={() => commitCities(row.id)}
                  placeholder="e.g. Visakhapatnam, Vijayawada, Guntur, Tirupati, Nellore"
                  helperText={
                    (row.cities || []).length > 0
                      ? `${row.cities.length} ${row.cities.length === 1 ? "city" : "cities"} saved — type more separated by commas`
                      : "No cities added yet — type names separated by commas"
                  }
                  sx={{
                    ...inputSx,
                    "& .MuiOutlinedInput-root": {
                      ...inputSx["& .MuiOutlinedInput-root"],
                      alignItems: "flex-start",
                    },
                  }}
                  FormHelperTextProps={{
                    sx: { fontSize: "0.68rem", mx: 0.5, color: "#8B97A8" },
                  }}
                />
              </Box>
            </Box>
          ))}

          {hasStateErrors ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
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
              color: "#0E56C8",
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "none",
              px: 0,
              alignSelf: "flex-start",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            + Add New State
          </Button>
        </Stack>
      </SectionRow>

      <Divider
        sx={{ my: { xs: 3, md: 3.5 }, borderColor: "rgba(225,232,241,0.96)" }}
      />

      {/* Distribution Companies */}
      <SectionRow
        icon={LocationOnOutlinedIcon}
        title="Distribution Companies (DISCOMs)"
        description="Manage electricity distribution companies for each state. Booking forms will show only active companies for the customer's selected state."
        accent="#0E56C8"
      >
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "160px 1.2fr 150px 120px 120px",
              },
              gap: 1.2,
              px: { xs: 0, md: 0.5 },
              pb: 1.2,
              borderBottom: "1px solid #EEF2F7",
            }}
          >
            {[
              "State",
              "Distribution Company Name",
              "Code",
              "Status",
              "Actions",
            ].map((h) => (
              <Typography key={h} sx={fieldLabelSx}>
                {h}
              </Typography>
            ))}
          </Box>

          <Stack spacing={1}>
            {(settings.discoms || []).map((discom) => (
              <Box
                key={discom.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "160px 1.2fr 150px 120px 120px",
                  },
                  gap: 1.2,
                  alignItems: "center",
                  py: 1.1,
                  borderBottom: "1px solid #F1F4F8",
                }}
              >
                <TextField
                  select
                  size="small"
                  value={discom.stateKey}
                  onChange={(e) =>
                    updateDiscom(discom.id, "stateKey", e.target.value)
                  }
                  sx={inputSx}
                >
                  {settings.states.map((state) => (
                    <MenuItem key={state.id} value={state.key}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  value={discom.name}
                  onChange={(e) =>
                    updateDiscom(discom.id, "name", e.target.value)
                  }
                  placeholder="Distribution company name"
                  sx={inputSx}
                />
                <TextField
                  size="small"
                  value={discom.code}
                  onChange={(e) =>
                    updateDiscom(discom.id, "code", e.target.value)
                  }
                  placeholder="BESCOM"
                  sx={inputSx}
                />
                <Chip
                  label={discom.status === "disabled" ? "Disabled" : "Active"}
                  size="small"
                  sx={{
                    width: "fit-content",
                    bgcolor:
                      discom.status === "disabled" ? "#EEF2F6" : "#DDFBEF",
                    color: discom.status === "disabled" ? "#667386" : "#0B7D44",
                    fontWeight: 900,
                    fontSize: "0.66rem",
                    textTransform: "uppercase",
                  }}
                />
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <Button
                    size="small"
                    onClick={() => toggleDiscomStatus(discom.id)}
                    sx={{
                      color: "#4B5565",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      textTransform: "none",
                      minWidth: 0,
                    }}
                  >
                    {discom.status === "disabled" ? "Enable" : "Disable"}
                  </Button>
                  <Tooltip title="Remove DISCOM" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => removeDiscom(discom.id)}
                      sx={{ color: "#D74C4C", borderRadius: "0.65rem" }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={addDiscom}
            variant="contained"
            sx={{
              mt: 2,
              minHeight: 42,
              borderRadius: "0.85rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 10px 22px rgba(14,86,200,0.18)",
              fontSize: "0.8rem",
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            Add Distribution Company
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
            {isSaving ? "Savingâ€¦" : "Save Global Settings"}
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

import { useRef, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "@/features/auth/AuthProvider";
import { projectsApi } from "@/features/public/api/projectsApi";
import customerProfileAvatarPlaceholder from "@/shared/assets/images/customer/profile/customer-profile-avatar-placeholder.svg";

const preferencesKey = "sparkin.customer.preferences";
const identityApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1";
const identityOrigin = identityApiBaseUrl.replace(/\/api\/v1\/?$/, "");

function getStoredPreferences() {
  try {
    return JSON.parse(window.localStorage.getItem(preferencesKey) || "{}");
  } catch {
    return {};
  }
}

function SectionCard({ title, icon, children, sx }) {
  return (
    <Box
      sx={{
        p: 1.55,
        borderRadius: "1.3rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
        ...sx,
      }}
    >
      <Stack direction="row" spacing={0.7} alignItems="center">
        <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>{icon}</Box>
        <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>{title}</Typography>
      </Stack>
      <Box sx={{ mt: 1.35 }}>{children}</Box>
    </Box>
  );
}

function LabeledField({ label, value, onChange, fullWidth = false, readOnly = false }) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: fullWidth ? "1 / -1" : "auto" }}>
      <Typography
        sx={{
          mb: 0.48,
          color: "#7F8A9B",
          fontSize: "0.62rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        InputProps={{ readOnly }}
        sx={{
          "& .MuiOutlinedInput-root": {
            minHeight: 40,
            borderRadius: "0.82rem",
            bgcolor: readOnly ? "#F4F7FB" : "#FFFFFF",
            fontSize: "0.84rem",
          },
        }}
      />
    </Box>
  );
}

function PreferenceToggle({ title, subtitle, checked, onChange }) {
  return (
    <Box
      sx={{
        p: 1.05,
        borderRadius: "0.95rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.86)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Box>
          <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>{title}</Typography>
          <Typography sx={{ mt: 0.18, color: "#98A3B2", fontSize: "0.62rem", lineHeight: 1.4 }}>
            {subtitle}
          </Typography>
        </Box>
        <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </Stack>
    </Box>
  );
}

function formatAddress(address) {
  if (!address) return null;

  return {
    line: [address.street, address.landmark].filter(Boolean).join(", "),
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
  };
}

export default function CustomerProfilePage() {
  const { user, updateUserAvatar, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [preferences, setPreferences] = useState(() => ({
    language: "English (India)",
    notifications: true,
    darkMode: false,
    ...getStoredPreferences(),
  }));
  const [projects, setProjects] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoNotice, setPhotoNotice] = useState("");

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user]);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const result = await projectsApi.listProjects();
        if (active) setProjects(result);
      } catch {
        if (active) setProjects([]);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const activeProject = projects[0] ?? null;
  const projectAddress = useMemo(() => formatAddress(activeProject?.installationAddress), [activeProject]);
  const installedCapacity = projects.reduce((sum, project) => sum + (Number(project.system?.sizeKw) || 0), 0);
  const statusLabel = installedCapacity > 0 ? `${installedCapacity}kW connected` : "Profile active";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updatePreference(field, value) {
    setPreferences((current) => {
      const next = { ...current, [field]: value };
      window.localStorage.setItem(preferencesKey, JSON.stringify(next));
      return next;
    });
  }

  async function saveProfile() {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateUserProfile({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
      });
      setSuccess("Profile updated.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setForm({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setError("");
    setSuccess("");
  }

  function getAvatarSource() {
    if (!user?.avatarUrl) {
      return customerProfileAvatarPlaceholder;
    }

    if (user.avatarUrl.startsWith("http")) {
      return user.avatarUrl;
    }

    return `${identityOrigin}${user.avatarUrl}`;
  }

  function handlePhotoAction() {
    fileInputRef.current?.click();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleAvatarSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");
    setSuccess("");
    setPhotoNotice("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoNotice("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoNotice("Please upload an image smaller than 2MB.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const data = await readFileAsDataUrl(file);
      await updateUserAvatar({
        fileName: file.name,
        contentType: file.type,
        data,
      });
      setSuccess("Profile photo updated.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not upload profile photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          p: { xs: 1.4, md: 1.65 },
          borderRadius: "1.35rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={handleAvatarSelected}
        />
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={2}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={getAvatarSource()}
                alt="Customer profile placeholder"
                sx={{
                  width: 84,
                  height: 84,
                  borderRadius: "1.1rem",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Button
                onClick={handlePhotoAction}
                disabled={isUploadingAvatar}
                sx={{
                  minWidth: 0,
                  width: 26,
                  height: 26,
                  p: 0,
                  position: "absolute",
                  right: -6,
                  bottom: -6,
                  borderRadius: "0.7rem",
                  bgcolor: "#0E56C8",
                  color: "#FFFFFF",
                  boxShadow: "0 10px 18px rgba(14,86,200,0.18)",
                  "&:hover": { bgcolor: "#0E56C8" },
                }}
              >
                <CameraAltOutlinedIcon sx={{ fontSize: "0.82rem" }} />
              </Button>
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#223146",
                  fontSize: { xs: "1.55rem", md: "1.8rem" },
                  fontWeight: 800,
                  lineHeight: 1.08,
                }}
              >
                {user?.fullName || "Sparkin User"}
              </Typography>
              <Typography sx={{ mt: 0.35, color: "#647387", fontSize: "0.86rem" }}>
                {user?.email || "Email not available"}
              </Typography>
              <Typography sx={{ mt: 0.55, color: "#0E56C8", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
                {user?.role || "customer"}
              </Typography>
              <Button
                onClick={handlePhotoAction}
                disabled={isUploadingAvatar}
                sx={{
                  mt: 1.1,
                  minHeight: 32,
                  px: 1.25,
                  borderRadius: "0.8rem",
                  bgcolor: "#E9EDF2",
                  color: "#223146",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {isUploadingAvatar ? "Uploading..." : "Change Photo"}
              </Button>
            </Box>
          </Stack>

          <Box
            sx={{
              px: 1.1,
              py: 1,
              borderRadius: "1rem",
              bgcolor: "#F4F1C9",
              borderLeft: "4px solid #7E8700",
            }}
          >
            <Typography
              sx={{
                color: "#7E8700",
                fontSize: "0.58rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Energy Saving Status
            </Typography>
            <Typography sx={{ mt: 0.22, color: "#5C6400", fontSize: "1.1rem", fontWeight: 800 }}>
              {statusLabel}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.7fr 0.95fr" },
          gap: 1.55,
        }}
      >
        <Stack spacing={1.45}>
          <SectionCard title="Personal Information" icon={<PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} />}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.15,
              }}
            >
              <LabeledField label="Full Name" value={form.fullName} onChange={(value) => updateField("fullName", value)} />
              <LabeledField label="Phone Number" value={form.phoneNumber} onChange={(value) => updateField("phoneNumber", value)} />
              <LabeledField label="Email Address" value={user?.email || ""} fullWidth readOnly />
            </Box>
          </SectionCard>

          <SectionCard title="Primary Project Address" icon={<LocationOnOutlinedIcon sx={{ fontSize: "1rem" }} />}>
            {projectAddress ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 1.15,
                }}
              >
                <LabeledField label="Address" value={projectAddress.line} fullWidth readOnly />
                <LabeledField label="City" value={projectAddress.city} readOnly />
                <LabeledField label="State" value={projectAddress.state} readOnly />
                <LabeledField label="Pincode" value={projectAddress.pincode} readOnly />
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
                Your installation address will appear here after your first project is created.
              </Alert>
            )}
          </SectionCard>
        </Stack>

        <Stack spacing={1.45}>
          <SectionCard title="Preferences" icon={<SettingsSuggestOutlinedIcon sx={{ fontSize: "1rem" }} />}>
            <Typography
              sx={{
                mb: 0.48,
                color: "#7F8A9B",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Language Selection
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={preferences.language}
              onChange={(event) => updatePreference("language", event.target.value)}
              sx={{
                mb: 1.15,
                "& .MuiOutlinedInput-root": {
                  height: 42,
                  borderRadius: "0.82rem",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.84rem",
                },
              }}
            >
              <MenuItem value="English (India)">English (India)</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
            </TextField>

            <Stack spacing={1.05}>
              <PreferenceToggle
                title="Notifications"
                subtitle="Email and portal alerts"
                checked={preferences.notifications}
                onChange={(value) => updatePreference("notifications", value)}
              />
              <PreferenceToggle
                title="Dark Mode"
                subtitle="Stored locally until theme service is added"
                checked={preferences.darkMode}
                onChange={(value) => updatePreference("darkMode", value)}
              />
            </Stack>
          </SectionCard>

          <Box
            sx={{
              p: 1.4,
              borderRadius: "1.15rem",
              bgcolor: "#F1F5FB",
              border: "1px solid rgba(225,232,241,0.86)",
              minHeight: 168,
            }}
          >
            <Stack direction="row" spacing={0.55} alignItems="flex-start">
              <InfoOutlinedIcon sx={{ color: "#0E56C8", fontSize: "0.95rem", mt: 0.12 }} />
              <Typography sx={{ color: "#0E56C8", fontSize: "0.76rem", fontWeight: 600, lineHeight: 1.7 }}>
                Email is used for login and cannot be changed here yet. Name and phone update directly in identity service.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ mt: 1.5, borderRadius: "0.9rem" }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      ) : null}
      {photoNotice ? (
        <Alert severity="info" sx={{ mt: 1.5, borderRadius: "0.9rem" }} onClose={() => setPhotoNotice("")}>
          {photoNotice}
        </Alert>
      ) : null}

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={1.2}
        sx={{
          mt: 1.85,
          pt: 1.65,
          borderTop: "1px solid rgba(225,232,241,0.86)",
        }}
      >
        <Button
          onClick={resetForm}
          sx={{
            minHeight: 36,
            px: 1.25,
            color: "#223146",
            fontSize: "0.82rem",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isSaving || form.fullName.trim().length < 2}
          onClick={saveProfile}
          sx={{
            minHeight: 38,
            px: 1.6,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.76rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </Box>
  );
}

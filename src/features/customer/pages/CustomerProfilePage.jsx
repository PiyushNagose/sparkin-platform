import { useRef, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { authApi } from "@/features/auth/authApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import customerProfileAvatarPlaceholder from "@/shared/assets/images/customer/profile/customer-profile-avatar-placeholder.svg";

// ─── constants ────────────────────────────────────────────────────────────────

const PREFS_KEY = "sparkin.customer.preferences";
const IDENTITY_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1"
).replace(/\/api\/v1\/?$/, "");

// ─── helpers ─────────────────────────────────────────────────────────────────

function getStoredPreferences() {
  try {
    return JSON.parse(window.localStorage.getItem(PREFS_KEY) || "{}");
  } catch {
    return {};
  }
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

function getAvatarSrc(user) {
  if (!user?.avatarUrl) return customerProfileAvatarPlaceholder;
  if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
  return `${IDENTITY_ORIGIN}${user.avatarUrl}`;
}

// Basic phone validation — must be 7–15 digits, optional leading +
function isValidPhone(value) {
  return !value || /^\+?[0-9]{7,15}$/.test(value.trim());
}

function isDirty(form, user) {
  return (
    form.fullName.trim() !== (user?.fullName || "") ||
    form.phoneNumber.trim() !== (user?.phoneNumber || "")
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

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
        <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>
          {icon}
        </Box>
        <Typography
          sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
        >
          {title}
        </Typography>
      </Stack>
      <Box sx={{ mt: 1.35 }}>{children}</Box>
    </Box>
  );
}

function LabeledField({
  label,
  value,
  onChange,
  type = "text",
  fullWidth = false,
  readOnly = false,
  endAdornment,
}) {
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
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        InputProps={{ readOnly, endAdornment }}
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Box>
          <Typography
            sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 0.18,
              color: "#98A3B2",
              fontSize: "0.62rem",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size="small"
        />
      </Stack>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserAvatar, updateUserProfile, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [preferences, setPreferences] = useState(() => ({
    language: "English (India)",
    notifications: true,
    ...getStoredPreferences(),
  }));
  const [projects, setProjects] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" }); // unified feedback

  // Sync form when user object updates (e.g. after save)
  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user]);

  useEffect(() => {
    let active = true;
    projectsApi
      .listProjects()
      .then((result) => {
        if (active) setProjects(result);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // ── derived ────────────────────────────────────────────────────────────────

  const activeProject = projects[0] ?? null;
  const projectAddress = useMemo(
    () => formatAddress(activeProject?.installationAddress),
    [activeProject],
  );
  const installedKw = projects.reduce(
    (sum, p) => sum + (Number(p.system?.sizeKw) || 0),
    0,
  );

  const formDirty = isDirty(form, user);
  const phoneValid = isValidPhone(form.phoneNumber);

  const pwValid =
    pwForm.currentPassword.length >= 6 &&
    pwForm.newPassword.length >= 8 &&
    pwForm.newPassword === pwForm.confirmPassword;

  // ── handlers ──────────────────────────────────────────────────────────────

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updatePwField(field, value) {
    setPwForm((prev) => ({ ...prev, [field]: value }));
  }

  function updatePreference(field, value) {
    setPreferences((prev) => {
      const next = { ...prev, [field]: value };
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }

  function showToast(type, message) {
    setToast({ type, message });
  }

  function resetForm() {
    setForm({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setToast({ type: "", message: "" });
  }

  async function saveProfile() {
    if (!phoneValid) {
      showToast("error", "Please enter a valid phone number.");
      return;
    }

    setIsSaving(true);
    setToast({ type: "", message: "" });

    try {
      await updateUserProfile({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
      });
      showToast("success", "Profile updated successfully.");
    } catch (apiError) {
      showToast(
        "error",
        apiError?.response?.data?.message || "Could not update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function changePassword() {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }

    setIsChangingPw(true);
    setToast({ type: "", message: "" });

    try {
      await authApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", "Password changed successfully.");
    } catch (apiError) {
      showToast(
        "error",
        apiError?.response?.data?.message || "Could not change password.",
      );
    } finally {
      setIsChangingPw(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch {
      navigate("/auth/login", { replace: true });
    }
  }

  async function handleAvatarSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setToast({ type: "", message: "" });

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("info", "Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("info", "Please upload an image smaller than 2MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      const data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      await updateUserAvatar({
        fileName: file.name,
        contentType: file.type,
        data,
      });
      showToast("success", "Profile photo updated.");
    } catch (apiError) {
      showToast(
        "error",
        apiError?.response?.data?.message || "Could not upload photo.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      {/* Avatar + identity header */}
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            {/* Avatar */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box
                component="img"
                src={getAvatarSrc(user)}
                alt="Profile photo"
                sx={{
                  width: 84,
                  height: 84,
                  borderRadius: "1.1rem",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
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
                  boxShadow: "0 8px 16px rgba(14,86,200,0.2)",
                  "&:hover": { bgcolor: "#0B49AD" },
                }}
              >
                <CameraAltOutlinedIcon sx={{ fontSize: "0.82rem" }} />
              </Button>
            </Box>

            {/* Identity */}
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
              <Typography
                sx={{ mt: 0.35, color: "#647387", fontSize: "0.86rem" }}
              >
                {user?.email || "Email not available"}
              </Typography>
              <Box
                sx={{
                  mt: 0.55,
                  display: "inline-flex",
                  px: 0.75,
                  py: 0.22,
                  borderRadius: "999px",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {user?.role || "customer"}
              </Box>
              <Stack direction="row" spacing={0.8} sx={{ mt: 1.1 }}>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  sx={{
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
                  {isUploadingAvatar ? "Uploading…" : "Change Photo"}
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  startIcon={<LogoutRoundedIcon sx={{ fontSize: "0.85rem" }} />}
                  sx={{
                    minHeight: 32,
                    px: 1.25,
                    borderRadius: "0.8rem",
                    bgcolor: "#FFF0EE",
                    color: "#D92D20",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#FFE4E1" },
                  }}
                >
                  {isLoggingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </Stack>
            </Box>
          </Stack>

          {/* Energy status badge */}
          <Box
            sx={{
              px: 1.1,
              py: 1,
              borderRadius: "1rem",
              bgcolor: installedKw > 0 ? "#F4F1C9" : "#F2F5F8",
              borderLeft: `4px solid ${installedKw > 0 ? "#7E8700" : "#C8D0DC"}`,
            }}
          >
            <Typography
              sx={{
                color: installedKw > 0 ? "#7E8700" : "#8F98A7",
                fontSize: "0.58rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Energy Status
            </Typography>
            <Typography
              sx={{
                mt: 0.22,
                color: installedKw > 0 ? "#5C6400" : "#647387",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              {installedKw > 0
                ? `${installedKw}kW connected`
                : "No active project"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main grid */}
      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.7fr 0.95fr" },
          gap: 1.55,
        }}
      >
        <Stack spacing={1.45}>
          {/* Personal information */}
          <SectionCard
            title="Personal Information"
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} />}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.15,
              }}
            >
              <LabeledField
                label="Full Name"
                value={form.fullName}
                onChange={(v) => updateField("fullName", v)}
              />
              <LabeledField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(v) => updateField("phoneNumber", v)}
              />
              <LabeledField
                label="Email Address"
                value={user?.email || ""}
                fullWidth
                readOnly
              />
            </Box>
            {form.phoneNumber && !phoneValid && (
              <Typography
                sx={{ mt: 0.75, color: "#D92D20", fontSize: "0.72rem" }}
              >
                Enter a valid phone number (7–15 digits, optional +).
              </Typography>
            )}
          </SectionCard>

          {/* Project address */}
          <SectionCard
            title="Primary Project Address"
            icon={<LocationOnOutlinedIcon sx={{ fontSize: "1rem" }} />}
          >
            {projectAddress ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.15,
                }}
              >
                <LabeledField
                  label="Address"
                  value={projectAddress.line}
                  fullWidth
                  readOnly
                />
                <LabeledField
                  label="City"
                  value={projectAddress.city}
                  readOnly
                />
                <LabeledField
                  label="State"
                  value={projectAddress.state}
                  readOnly
                />
                <LabeledField
                  label="Pincode"
                  value={projectAddress.pincode}
                  readOnly
                />
              </Box>
            ) : (
              <Box
                sx={{
                  p: 1.1,
                  borderRadius: "0.95rem",
                  bgcolor: "#F1F5FB",
                  border: "1px solid rgba(225,232,241,0.86)",
                }}
              >
                <Stack direction="row" spacing={0.55} alignItems="flex-start">
                  <InfoOutlinedIcon
                    sx={{
                      color: "#0E56C8",
                      fontSize: "0.9rem",
                      mt: 0.1,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#4F5F73",
                      fontSize: "0.76rem",
                      lineHeight: 1.65,
                    }}
                  >
                    Your installation address will appear here once your first
                    project is created.
                  </Typography>
                </Stack>
              </Box>
            )}
          </SectionCard>

          {/* Change password */}
          <SectionCard
            title="Change Password"
            icon={<LockOutlinedIcon sx={{ fontSize: "1rem" }} />}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.15,
              }}
            >
              <LabeledField
                label="Current Password"
                type={showPw.current ? "text" : "password"}
                value={pwForm.currentPassword}
                onChange={(v) => updatePwField("currentPassword", v)}
                fullWidth
                endAdornment={
                  <Button
                    onClick={() =>
                      setShowPw((p) => ({ ...p, current: !p.current }))
                    }
                    sx={{ minWidth: 0, p: 0.3, color: "#8F98A7" }}
                  >
                    {showPw.current ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                    )}
                  </Button>
                }
              />
              <LabeledField
                label="New Password"
                type={showPw.next ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={(v) => updatePwField("newPassword", v)}
                endAdornment={
                  <Button
                    onClick={() => setShowPw((p) => ({ ...p, next: !p.next }))}
                    sx={{ minWidth: 0, p: 0.3, color: "#8F98A7" }}
                  >
                    {showPw.next ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                    )}
                  </Button>
                }
              />
              <LabeledField
                label="Confirm New Password"
                type={showPw.confirm ? "text" : "password"}
                value={pwForm.confirmPassword}
                onChange={(v) => updatePwField("confirmPassword", v)}
                endAdornment={
                  <Button
                    onClick={() =>
                      setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                    }
                    sx={{ minWidth: 0, p: 0.3, color: "#8F98A7" }}
                  >
                    {showPw.confirm ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                    )}
                  </Button>
                }
              />
            </Box>
            {pwForm.newPassword &&
              pwForm.confirmPassword &&
              pwForm.newPassword !== pwForm.confirmPassword && (
                <Typography
                  sx={{ mt: 0.75, color: "#D92D20", fontSize: "0.72rem" }}
                >
                  Passwords do not match.
                </Typography>
              )}
            {pwForm.newPassword.length > 0 && pwForm.newPassword.length < 8 && (
              <Typography
                sx={{ mt: 0.75, color: "#D92D20", fontSize: "0.72rem" }}
              >
                New password must be at least 8 characters.
              </Typography>
            )}
            <Button
              variant="contained"
              disabled={!pwValid || isChangingPw}
              onClick={changePassword}
              sx={{
                mt: 1.25,
                minHeight: 36,
                px: 1.45,
                borderRadius: "0.9rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {isChangingPw ? "Updating…" : "Update Password"}
            </Button>
          </SectionCard>
        </Stack>

        <Stack spacing={1.45}>
          {/* Preferences */}
          <SectionCard
            title="Preferences"
            icon={<SettingsSuggestOutlinedIcon sx={{ fontSize: "1rem" }} />}
          >
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
              Language
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
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
                title="Email Notifications"
                subtitle="Receive updates about bookings, quotes, and projects"
                checked={preferences.notifications}
                onChange={(v) => updatePreference("notifications", v)}
              />
            </Stack>
          </SectionCard>

          {/* Account info note */}
          <Box
            sx={{
              p: 1.4,
              borderRadius: "1.15rem",
              bgcolor: "#F1F5FB",
              border: "1px solid rgba(225,232,241,0.86)",
            }}
          >
            <Stack direction="row" spacing={0.55} alignItems="flex-start">
              <InfoOutlinedIcon
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.95rem",
                  mt: 0.12,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  color: "#4F5F73",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  lineHeight: 1.7,
                }}
              >
                Your email address is used for login and cannot be changed from
                this screen. Contact support if you need to update it.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Unified toast */}
      {toast.message && (
        <Alert
          severity={toast.type || "info"}
          sx={{ mt: 1.5, borderRadius: "0.9rem" }}
          onClose={() => setToast({ type: "", message: "" })}
        >
          {toast.message}
        </Alert>
      )}

      {/* Save / Cancel footer */}
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
          disabled={!formDirty}
          sx={{
            minHeight: 36,
            px: 1.25,
            color: "#223146",
            fontSize: "0.82rem",
            fontWeight: 600,
            textTransform: "none",
            "&:disabled": { opacity: 0.4 },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={
            isSaving ||
            !formDirty ||
            form.fullName.trim().length < 2 ||
            !phoneValid
          }
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
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </Stack>
    </Box>
  );
}

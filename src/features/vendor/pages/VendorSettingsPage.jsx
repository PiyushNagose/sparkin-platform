import { Alert, Box, Button, Divider, Stack, Switch, Typography } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { VendorPageHeader, VendorPageShell } from "@/features/vendor/components/VendorPortalUI";

const settingsStorageKey = "sparkin_vendor_settings";

const defaultPreferences = {
  leadAlerts: true,
  quoteUpdates: true,
  projectMilestones: true,
  paymentUpdates: true,
};

function readPreferences() {
  try {
    return { ...defaultPreferences, ...JSON.parse(localStorage.getItem(settingsStorageKey) || "{}") };
  } catch {
    return defaultPreferences;
  }
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <Box
      sx={{
        p: { xs: 1.6, md: 1.9 },
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "0.9rem",
            bgcolor: "#EEF4FF",
            color: "#0E56C8",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>{title}</Typography>
          <Typography sx={{ mt: 0.25, color: "#6F7D8F", fontSize: "0.78rem", lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  );
}

function PreferenceRow({ title, description, checked, onChange }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ py: 1.05 }}>
      <Box>
        <Typography sx={{ color: "#223146", fontSize: "0.84rem", fontWeight: 700 }}>{title}</Typography>
        <Typography sx={{ mt: 0.15, color: "#7A8799", fontSize: "0.72rem", lineHeight: 1.55 }}>
          {description}
        </Typography>
      </Box>
      <Switch checked={checked} onChange={onChange} color="primary" />
    </Stack>
  );
}

export default function VendorSettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState(readPreferences);
  const [notice, setNotice] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem(settingsStorageKey, JSON.stringify(preferences));
  }, [preferences]);

  function updatePreference(key) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
    setNotice("Settings saved.");
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    navigate("/auth/login", { replace: true });
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Settings"
        subtitle="Manage account preferences, notifications, and secure sign out."
        sx={{ mb: 2.4 }}
        actions={
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{
              minHeight: 40,
              px: 1.8,
              borderRadius: "0.95rem",
              boxShadow: "none",
              fontSize: "0.76rem",
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        }
      />

      {notice ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      ) : null}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" }, gap: 1.6 }}>
        <SectionCard
          icon={<PersonOutlineOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
          title="Account"
          subtitle="Profile editing stays in the top-right profile section."
        >
          <Stack spacing={1.05}>
            {[
              ["Name", user?.fullName || "Not available"],
              ["Email", user?.email || "Not available"],
              ["Role", user?.role || "Not available"],
            ].map(([label, value]) => (
              <Stack key={label} direction="row" justifyContent="space-between" spacing={2}>
                <Typography sx={{ color: "#7A8799", fontSize: "0.76rem", fontWeight: 600 }}>{label}</Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 800, textAlign: "right" }}>
                  {value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          icon={<NotificationsNoneOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
          title="Notifications"
          subtitle="Choose which vendor activity should appear as account alerts."
        >
          <PreferenceRow
            title="Lead alerts"
            description="Notify when a matching customer booking becomes available."
            checked={preferences.leadAlerts}
            onChange={() => updatePreference("leadAlerts")}
          />
          <Divider />
          <PreferenceRow
            title="Quote updates"
            description="Notify when a customer views, selects, or changes a quote decision."
            checked={preferences.quoteUpdates}
            onChange={() => updatePreference("quoteUpdates")}
          />
          <Divider />
          <PreferenceRow
            title="Project milestones"
            description="Notify when installation milestones need action."
            checked={preferences.projectMilestones}
            onChange={() => updatePreference("projectMilestones")}
          />
          <Divider />
          <PreferenceRow
            title="Payment updates"
            description="Notify when payment schedules or invoice status changes."
            checked={preferences.paymentUpdates}
            onChange={() => updatePreference("paymentUpdates")}
          />
        </SectionCard>

        <SectionCard
          icon={<SecurityOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
          title="Security"
          subtitle="Use logout when handing the device to someone else."
        >
          <Typography sx={{ color: "#5E6A7D", fontSize: "0.78rem", lineHeight: 1.7 }}>
            Your session is managed with access and refresh tokens. Logging out clears the local session and asks the
            identity service to revoke the refresh token.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{ mt: 1.5, minHeight: 38, borderRadius: "0.9rem", textTransform: "none", fontWeight: 800 }}
          >
            Logout from this device
          </Button>
        </SectionCard>

        <SectionCard
          icon={<SupportAgentOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
          title="Support"
          subtitle="Reach the Sparkin team for account or project help."
        >
          <Stack spacing={1.1}>
            <Button
              component="a"
              href="mailto:support@sparkin.com"
              variant="outlined"
              sx={{ minHeight: 38, borderRadius: "0.9rem", textTransform: "none", fontWeight: 800 }}
            >
              Email Support
            </Button>
            <Button
              component={RouterLink}
              to="/vendor/services"
              variant="contained"
              sx={{
                minHeight: 38,
                borderRadius: "0.9rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              View Service Requests
            </Button>
          </Stack>
        </SectionCard>
      </Box>
    </VendorPageShell>
  );
}

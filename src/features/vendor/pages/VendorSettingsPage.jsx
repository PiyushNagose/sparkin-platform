import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { VendorPageShell } from "@/features/vendor/components/VendorPortalUI";

const TABS = ["Profile", "Business Details"];

const SERVICES = ["Installation", "Maintenance", "Site Survey", "Consultation"];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.85rem",
    bgcolor: "#FFFFFF",
    fontSize: "0.88rem",
  },
  "& .MuiInputLabel-root": { fontSize: "0.78rem" },
};

function SectionRow({ title, description, children }) {
  return (
    <Grid container spacing={{ xs: 2, md: 4 }} alignItems="flex-start">
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 0.6, color: "#6F7D8F", fontSize: "0.82rem", lineHeight: 1.65, maxWidth: 260 }}>
          {description}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>{children}</Grid>
    </Grid>
  );
}

function Divider() {
  return <Box sx={{ borderTop: "1px solid rgba(225,232,241,0.96)", my: { xs: 2.5, md: 3 } }} />;
}

function ProfileTab({ user, onLogout, isLoggingOut }) {
  const [twoFa, setTwoFa] = useState(true);
  const [notice, setNotice] = useState("");

  const name = user?.fullName || "Vikas Solar Tech";
  const email = user?.email || "contact@vikassolar.com";
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Box>
      {/* Page title */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: "#18253A", fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Vendor Profile
        </Typography>
        <Typography sx={{ mt: 0.6, color: "#6F7D8F", fontSize: "0.92rem" }}>
          Manage your business identity and account security settings.
        </Typography>
      </Box>

      {notice ? (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: "0.9rem" }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      ) : null}

      {/* Avatar card */}
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          borderRadius: "1.3rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 4px 20px rgba(16,29,51,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#132C58",
              fontSize: "1.4rem",
              fontWeight: 800,
              border: "3px solid #FFFFFF",
              boxShadow: "0 4px 16px rgba(16,29,51,0.14)",
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ color: "#18253A", fontSize: "1.15rem", fontWeight: 800 }}>
              {name}
            </Typography>
            <Typography sx={{ mt: 0.3, color: "#6F7D8F", fontSize: "0.84rem" }}>
              {email}
            </Typography>
            <Box
              sx={{
                mt: 0.7,
                display: "inline-flex",
                px: 1,
                py: 0.3,
                borderRadius: "999px",
                bgcolor: "#E5F20D",
                color: "#4A5500",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Verified Vendor
            </Box>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          startIcon={<CameraAltOutlinedIcon />}
          sx={{
            minHeight: 40,
            px: 1.8,
            borderRadius: "0.9rem",
            borderColor: "rgba(225,232,241,0.96)",
            bgcolor: "#F7F9FC",
            color: "#223146",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Change Photo
        </Button>
      </Box>

      {/* Account Details */}
      <SectionRow
        title="Account Details"
        description="Update your contact information. This information will be visible on your public vendor profile and official quotes."
      >
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.8 }}>
          <TextField label="Full Name" defaultValue={name} sx={inputSx} />
          <TextField label="Email Address" defaultValue={email} type="email" sx={inputSx} />
          <TextField
            label="Phone Number"
            defaultValue="+1 (555) 012-3456"
            sx={{ ...inputSx, gridColumn: { xs: "auto", sm: "1 / -1" } }}
          />
        </Box>
      </SectionRow>

      <Divider />

      {/* Security */}
      <SectionRow
        title="Security"
        description="Keep your account secure by enabling two-factor authentication and regularly updating your credentials."
      >
        <Stack spacing={1.2}>
          {/* Password row */}
          <Box
            sx={{
              p: 1.6,
              borderRadius: "1rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "0.8rem",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <LockResetOutlinedIcon sx={{ fontSize: "1.05rem" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 700 }}>
                  Password
                </Typography>
                <Typography sx={{ mt: 0.2, color: "#8A96A7", fontSize: "0.74rem" }}>
                  Last changed 3 months ago
                </Typography>
              </Box>
            </Stack>
            <Button
              sx={{
                px: 0,
                color: "#0E56C8",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              Change Password
            </Button>
          </Box>

          {/* 2FA row */}
          <Box
            sx={{
              p: 1.6,
              borderRadius: "1rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "0.8rem",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <SecurityOutlinedIcon sx={{ fontSize: "1.05rem" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 700 }}>
                  Two-Factor Authentication
                </Typography>
                <Typography sx={{ mt: 0.2, color: "#8A96A7", fontSize: "0.74rem" }}>
                  Recommended for high security accounts
                </Typography>
              </Box>
            </Stack>
            <Switch
              checked={twoFa}
              onChange={() => setTwoFa((v) => !v)}
              color="primary"
            />
          </Box>
        </Stack>
      </SectionRow>

      {/* Footer actions */}
      <Box
        sx={{
          mt: 4,
          pt: 2.5,
          borderTop: "1px solid rgba(225,232,241,0.96)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            minHeight: 44,
            px: 2.2,
            borderRadius: "0.9rem",
            borderColor: "rgba(225,232,241,0.96)",
            color: "#556478",
            fontSize: "0.86rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => setNotice("Changes saved successfully.")}
          sx={{
            minHeight: 44,
            px: 2.8,
            borderRadius: "0.9rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 10px 24px rgba(14,86,200,0.18)",
            fontSize: "0.86rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}

function BusinessDetailsTab() {
  const [services, setServices] = useState(["Installation", "Maintenance", "Site Survey", "Consultation"]);
  const [notice, setNotice] = useState("");

  function toggleService(s) {
    setServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  return (
    <Box>
      {/* Page title + actions */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ color: "#18253A", fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Business Details
          </Typography>
          <Typography sx={{ mt: 0.6, color: "#6F7D8F", fontSize: "0.92rem" }}>
            Manage your commercial profile and operational certificates.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            sx={{ minHeight: 42, px: 2, borderRadius: "0.9rem", borderColor: "rgba(225,232,241,0.96)", color: "#556478", fontSize: "0.84rem", fontWeight: 700, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setNotice("Business details saved.")}
            sx={{ minHeight: 42, px: 2.4, borderRadius: "0.9rem", bgcolor: "#0E56C8", boxShadow: "0 10px 24px rgba(14,86,200,0.18)", fontSize: "0.84rem", fontWeight: 700, textTransform: "none" }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>

      {notice ? (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: "0.9rem" }} onClose={() => setNotice("")}>
          {notice}
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {/* Left column */}
        <Grid size={{ xs: 12, lg: 7 }}>
          {/* Business identity card */}
          <Box
            sx={{
              p: { xs: 2, md: 2.4 },
              mb: 2.5,
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 4px 20px rgba(16,29,51,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "1rem",
                bgcolor: "#1A3A6E",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                color: "#FFFFFF",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textAlign: "center",
                lineHeight: 1.3,
                p: 0.5,
              }}
            >
              TATA POWER
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#18253A", fontSize: "1.1rem", fontWeight: 800 }}>
                Tata Power Solar
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.28,
                    borderRadius: "999px",
                    bgcolor: "#E5F20D",
                    color: "#4A5500",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  EPC Contractor
                </Box>
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.85rem", color: "#239654" }} />
                  <Typography sx={{ color: "#239654", fontSize: "0.76rem", fontWeight: 700 }}>
                    Verified Vendor
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2px solid rgba(225,232,241,0.96)",
                display: "grid",
                placeItems: "center",
                color: "#C8D4E4",
                flexShrink: 0,
              }}
            >
              <SecurityOutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </Box>
          </Box>

          {/* Company Information */}
          <Box
            sx={{
              p: { xs: 2, md: 2.4 },
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 4px 20px rgba(16,29,51,0.05)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <BusinessOutlinedIcon sx={{ fontSize: "1.1rem", color: "#0E56C8" }} />
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                Company Information
              </Typography>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.8 }}>
              <TextField label="Company Name" defaultValue="Tata Power Solar" sx={inputSx} />
              <TextField label="GST Number" defaultValue="27AAACT1234A1Z1" sx={inputSx} />
              <TextField
                label="Full Business Address"
                defaultValue="34, Corporate Park, Saki Naka, Andheri East"
                sx={{ ...inputSx, gridColumn: { xs: "auto", sm: "1 / -1" } }}
              />
              <TextField label="City" defaultValue="Mumbai" sx={inputSx} />
              <TextField
                select
                label="State"
                defaultValue="Maharashtra"
                sx={inputSx}
              >
                {["Maharashtra", "Gujarat", "Karnataka", "Delhi", "Tamil Nadu", "Rajasthan"].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {/* Service Capability */}
          <Box
            sx={{
              p: { xs: 2, md: 2.4 },
              mb: 2.5,
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 4px 20px rgba(16,29,51,0.05)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.8 }}>
              <BoltOutlinedIcon sx={{ fontSize: "1.1rem", color: "#0E56C8" }} />
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                Service Capability
              </Typography>
            </Stack>

            <Typography sx={{ color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 1 }}>
              Services Offered
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
              {SERVICES.map((s) => (
                <Stack
                  key={s}
                  direction="row"
                  spacing={0.8}
                  alignItems="center"
                  onClick={() => toggleService(s)}
                  sx={{
                    p: 1,
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(225,232,241,0.96)",
                    cursor: "pointer",
                    bgcolor: services.includes(s) ? "#EEF4FF" : "#FFFFFF",
                    transition: "all 0.15s",
                  }}
                >
                  <Checkbox
                    checked={services.includes(s)}
                    size="small"
                    sx={{ p: 0, color: "#C8D4E4", "&.Mui-checked": { color: "#0E56C8" } }}
                    onChange={() => toggleService(s)}
                  />
                  <Typography sx={{ color: "#223146", fontSize: "0.8rem", fontWeight: 600 }}>
                    {s}
                  </Typography>
                </Stack>
              ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <Box>
                <Typography sx={{ color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.8 }}>
                  Coverage Area
                </Typography>
                <Stack direction="row" spacing={0.6} alignItems="center" sx={{ p: 1, borderRadius: "0.75rem", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#F7F9FC" }}>
                  <PublicRoundedIcon sx={{ fontSize: "0.9rem", color: "#0E56C8" }} />
                  <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                    Pan India
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography sx={{ color: "#8B97A8", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", mb: 0.8 }}>
                  Experience
                </Typography>
                <Stack direction="row" spacing={0.6} alignItems="center" sx={{ p: 1, borderRadius: "0.75rem", border: "1px solid rgba(225,232,241,0.96)", bgcolor: "#F7F9FC" }}>
                  <HistoryRoundedIcon sx={{ fontSize: "0.9rem", color: "#239654" }} />
                  <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                    15+ years
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Compliance Documents */}
          <Box
            sx={{
              p: { xs: 2, md: 2.4 },
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 4px 20px rgba(16,29,51,0.05)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.8 }}>
              <UploadFileOutlinedIcon sx={{ fontSize: "1.1rem", color: "#0E56C8" }} />
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                Compliance Documents
              </Typography>
            </Stack>

            <Stack spacing={1.2}>
              {/* Company Documents upload zone */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: "0.9rem",
                  border: "2px dashed rgba(225,232,241,0.96)",
                  bgcolor: "#F7F9FC",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.6,
                  cursor: "pointer",
                  "&:hover": { borderColor: "#0E56C8" },
                  transition: "border-color 0.15s",
                }}
              >
                <UploadFileOutlinedIcon sx={{ fontSize: "1.6rem", color: "#B0BCCC" }} />
                <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                  Company Documents
                </Typography>
                <Typography sx={{ color: "#8B97A8", fontSize: "0.7rem" }}>
                  PDF, JPG (Max 5MB)
                </Typography>
              </Box>

              {/* Certifications upload zone */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: "0.9rem",
                  border: "2px dashed rgba(225,232,241,0.96)",
                  bgcolor: "#F7F9FC",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.6,
                  cursor: "pointer",
                  "&:hover": { borderColor: "#0E56C8" },
                  transition: "border-color 0.15s",
                }}
              >
                <EmojiEventsOutlinedIcon sx={{ fontSize: "1.6rem", color: "#B0BCCC" }} />
                <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                  Certifications & Awards
                </Typography>
                <Typography sx={{ color: "#8B97A8", fontSize: "0.7rem" }}>
                  Verified ISO or local certs
                </Typography>
              </Box>

              {/* Uploaded file */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 1.2,
                  borderRadius: "0.9rem",
                  border: "1px solid rgba(225,232,241,0.96)",
                  bgcolor: "#FFFFFF",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: "1.1rem", color: "#239654" }} />
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.8rem", fontWeight: 700 }}>
                      Business_License_2024.pdf
                    </Typography>
                    <Typography sx={{ color: "#8B97A8", fontSize: "0.68rem" }}>
                      Uploaded 2 days ago · 1.2MB
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  sx={{ minWidth: 30, width: 30, height: 30, p: 0, borderRadius: "50%", color: "#D74C4C" }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function VendorSettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    navigate("/auth/login", { replace: true });
  }

  return (
    <VendorPageShell>
      {/* Tab bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(225,232,241,0.96)",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={0}>
          {TABS.map((tab, idx) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(idx)}
              sx={{
                minHeight: 42,
                px: 1.8,
                borderRadius: 0,
                borderBottom: activeTab === idx ? "2px solid #0E56C8" : "2px solid transparent",
                color: activeTab === idx ? "#0E56C8" : "#6F7D8F",
                fontSize: "0.88rem",
                fontWeight: activeTab === idx ? 800 : 600,
                textTransform: "none",
                mb: "-1px",
                "&:hover": { bgcolor: "transparent", color: "#0E56C8" },
              }}
            >
              {tab}
            </Button>
          ))}
        </Stack>

        <Button
          variant="outlined"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            minHeight: 36,
            px: 1.6,
            borderRadius: "0.85rem",
            borderColor: "rgba(225,232,241,0.96)",
            color: "#D74C4C",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </Box>

      {activeTab === 0 ? (
        <ProfileTab user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      ) : (
        <BusinessDetailsTab />
      )}
    </VendorPageShell>
  );
}

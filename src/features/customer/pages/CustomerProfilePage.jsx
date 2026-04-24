import { Avatar, Box, Button, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import customerProfileAvatarPlaceholder from "@/shared/assets/images/customer/profile/customer-profile-avatar-placeholder.svg";

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

function LabeledField({ label, value, fullWidth = false, select = false, children }) {
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
        select={select}
        InputProps={{
          readOnly: !select,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 40,
            borderRadius: "0.82rem",
            bgcolor: "#FFFFFF",
            fontSize: "0.84rem",
          },
        }}
      >
        {children}
      </TextField>
    </Box>
  );
}

function PreferenceToggle({ title, subtitle, checked }) {
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
        <Switch checked={checked} />
      </Stack>
    </Box>
  );
}

export default function CustomerProfilePage() {
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
                src={customerProfileAvatarPlaceholder}
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
                Arjun Sharma
              </Typography>
              <Typography sx={{ mt: 0.35, color: "#647387", fontSize: "0.86rem" }}>
                arjun.sharma@example.com
              </Typography>
              <Button
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
                Change Photo
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
              Top 5% Household
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
              <LabeledField label="Full Name" value="Arjun Sharma" />
              <LabeledField label="Phone Number" value="+91 98765 43210" />
              <LabeledField label="Email Address" value="arjun.sharma@example.com" fullWidth />
            </Box>
          </SectionCard>

          <SectionCard title="Address" icon={<LocationOnOutlinedIcon sx={{ fontSize: "1rem" }} />}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                gap: 1.15,
              }}
            >
              <LabeledField label="Address" value="42, Green Valley Estate, Phase II" fullWidth />
              <LabeledField label="City" value="Bangalore" />
              <LabeledField label="State" value="Karnataka" />
              <LabeledField label="Pincode" value="560001" />
            </Box>
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
              value="English (US)"
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
              <MenuItem value="English (US)">English (US)</MenuItem>
            </TextField>

            <Stack spacing={1.05}>
              <PreferenceToggle title="Notifications" subtitle="Email & Push Alerts" checked />
              <PreferenceToggle title="Dark Mode" subtitle="System default" checked={false} />
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
                Updating your primary email will require a new verification link to be sent to your inbox.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

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
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}

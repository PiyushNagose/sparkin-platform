import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ── Static broadcast history ──────────────────────────────────────────────────
const BROADCAST_HISTORY = [
  {
    id: "BRD-2023-089",
    title: "System Maintenance Oct 12",
    audience: "All Users",
    channels: ["notification", "email"],
    status: "SENT",
    statusColor: "#239654",
    statusBg: "#DDF8E7",
    date: "Oct 10, 2023 • 09:30 AM",
  },
  {
    id: "BRD-2023-090",
    title: "New Pricing Model Launch",
    audience: "Leads, Customers",
    channels: ["notification", "email"],
    status: "SCHEDULED",
    statusColor: "#0E56C8",
    statusBg: "#EEF4FF",
    date: "Oct 15, 2023 • 11:00 AM",
  },
  {
    id: "BRD-2023-087",
    title: "Quarterly Savings Report",
    audience: "Verified Vendors",
    channels: ["email"],
    status: "FAILED",
    statusColor: "#D94444",
    statusBg: "#FDECEC",
    date: "Oct 05, 2023 • 04:15 PM",
  },
];

const MESSAGE_TYPES = [
  { label: "Info", color: "#0E56C8", bg: "#EEF4FF" },
  { label: "Alert", color: "#D97706", bg: "#FFF4D6" },
  { label: "Reminder", color: "#239654", bg: "#DDF8E7" },
];

const CHANNEL_ICON = {
  notification: NotificationsNoneOutlinedIcon,
  email: EmailOutlinedIcon,
  sms: SmsOutlinedIcon,
};

function ChannelIcon({ type }) {
  const Icon = CHANNEL_ICON[type] || NotificationsNoneOutlinedIcon;
  return <Icon sx={{ fontSize: "1rem", color: "#0E56C8" }} />;
}

// ── Create Broadcast tab ──────────────────────────────────────────────────────
function CreateBroadcastTab() {
  const [audiences, setAudiences] = useState({ leads: false, customers: false, vendors: false, allUsers: false });
  const [channels, setChannels] = useState({ notification: true, email: false, sms: false });
  const [timing, setTiming] = useState("now");
  const [messageType, setMessageType] = useState("Info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function toggleAudience(key) {
    setAudiences((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleChannel(key) {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, gap: 2.5, alignItems: "start" }}>
      {/* Left column */}
      <Stack spacing={2.5}>
        {/* Audience Selection */}
        <AdminPanel sx={{ p: 2.8 }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.2 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#EEF4FF", display: "grid", placeItems: "center" }}>
              <NotificationsNoneOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1.1rem" }} />
            </Box>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Audience Selection</Typography>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.2 }}>User Groups</Typography>
              <Stack spacing={0.4}>
                {[["leads", "Leads"], ["vendors", "Vendors"]].map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox checked={audiences[key]} onChange={() => toggleAudience(key)} size="small" sx={{ color: "#C8D4E4", "&.Mui-checked": { color: "#0E56C8" } }} />}
                    label={<Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: adminUi.colors.text }}>{label}</Typography>}
                    sx={{ m: 0 }}
                  />
                ))}
                {[["customers", "Customers"], ["allUsers", "All Users"]].map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox checked={audiences[key]} onChange={() => toggleAudience(key)} size="small" sx={{ color: "#C8D4E4", "&.Mui-checked": { color: "#0E56C8" } }} />}
                    label={<Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: adminUi.colors.text }}>{label}</Typography>}
                    sx={{ m: 0 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.2 }}>Advanced Filters</Typography>
              <Stack spacing={1}>
                {["All Regions", "User Status"].map((filter) => (
                  <Box key={filter} sx={{ px: 1.4, py: 0.9, borderRadius: "0.7rem", bgcolor: "#F4F7FB", border: "1px solid rgba(225,232,241,0.96)", cursor: "pointer", "&:hover": { bgcolor: "#EEF4FF" } }}>
                    <Typography sx={{ color: "#556478", fontSize: "0.82rem", fontWeight: 700 }}>{filter}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </AdminPanel>

        {/* Message Configuration */}
        <AdminPanel sx={{ p: 2.8 }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.2 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#FFFDE7", display: "grid", placeItems: "center" }}>
              <Typography sx={{ fontSize: "1rem" }}>⚠️</Typography>
            </Box>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Message Configuration</Typography>
          </Stack>

          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1 }}>Message Type</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2.2 }}>
            {MESSAGE_TYPES.map((type) => (
              <Button
                key={type.label}
                onClick={() => setMessageType(type.label)}
                sx={{
                  px: 1.6, py: 0.5, borderRadius: "999px",
                  bgcolor: messageType === type.label ? type.bg : "#F4F7FB",
                  color: messageType === type.label ? type.color : adminUi.colors.muted,
                  fontSize: "0.78rem", fontWeight: 800, textTransform: "none",
                  border: messageType === type.label ? `1.5px solid ${type.color}30` : "1.5px solid transparent",
                  "&:hover": { bgcolor: type.bg },
                }}
              >
                <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: type.color, mr: 0.7, display: "inline-block" }} />
                {type.label}
              </Button>
            ))}
          </Stack>

          <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 800, mb: 0.6 }}>Broadcast Title</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g., System Maintenance Update"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
          />

          <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 800, mb: 0.6 }}>Message Description</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="Draft your detailed message here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.88rem" } }}
          />
        </AdminPanel>
      </Stack>

      {/* Right column — Delivery & Schedule */}
      <Stack spacing={2.5}>
        <AdminPanel sx={{ p: 2.8 }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.2 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: "0.65rem", bgcolor: "#DDF8E7", display: "grid", placeItems: "center" }}>
              <CalendarTodayOutlinedIcon sx={{ color: "#239654", fontSize: "1.1rem" }} />
            </Box>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>Delivery & Schedule</Typography>
          </Stack>

          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.2 }}>Channels</Typography>
          <Stack spacing={1.2} sx={{ mb: 2.5 }}>
            {[
              { key: "notification", label: "In-App Notification" },
              { key: "email", label: "Email" },
              { key: "sms", label: "SMS" },
            ].map(({ key, label }) => {
              const Icon = CHANNEL_ICON[key];
              return (
                <Stack key={key} direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.4, py: 1, borderRadius: "0.75rem", border: "1px solid rgba(225,232,241,0.96)", bgcolor: channels[key] ? "#F0F5FF" : "#FAFBFC" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon sx={{ fontSize: "1rem", color: channels[key] ? "#0E56C8" : "#A0ACBA" }} />
                    <Typography sx={{ color: channels[key] ? adminUi.colors.text : "#A0ACBA", fontSize: "0.84rem", fontWeight: 700 }}>{label}</Typography>
                  </Stack>
                  <Switch
                    checked={channels[key]}
                    onChange={() => toggleChannel(key)}
                    size="small"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#0E56C8" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0E56C8" } }}
                  />
                </Stack>
              );
            })}
          </Stack>

          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.2 }}>Timing</Typography>
          <RadioGroup value={timing} onChange={(e) => setTiming(e.target.value)}>
            <Stack spacing={1}>
              <Box
                onClick={() => setTiming("now")}
                sx={{ px: 1.6, py: 1.2, borderRadius: "0.85rem", border: `2px solid ${timing === "now" ? "#0E56C8" : "rgba(225,232,241,0.96)"}`, bgcolor: timing === "now" ? "#EEF4FF" : "#FAFBFC", cursor: "pointer" }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Radio value="now" size="small" sx={{ p: 0, mt: 0.1, color: "#C8D4E4", "&.Mui-checked": { color: "#0E56C8" } }} />
                  <Box>
                    <Typography sx={{ color: timing === "now" ? "#0E56C8" : adminUi.colors.text, fontSize: "0.86rem", fontWeight: 800 }}>Send Now</Typography>
                    <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>Immediate delivery to all channels</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                onClick={() => setTiming("later")}
                sx={{ px: 1.6, py: 1.2, borderRadius: "0.85rem", border: `2px solid ${timing === "later" ? "#0E56C8" : "rgba(225,232,241,0.96)"}`, bgcolor: timing === "later" ? "#EEF4FF" : "#FAFBFC", cursor: "pointer" }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Radio value="later" size="small" sx={{ p: 0, mt: 0.1, color: "#C8D4E4", "&.Mui-checked": { color: "#0E56C8" } }} />
                  <Box>
                    <Typography sx={{ color: timing === "later" ? "#0E56C8" : adminUi.colors.text, fontSize: "0.86rem", fontWeight: 800 }}>Schedule for Later</Typography>
                    <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>Pick a future date and time</Typography>
                  </Box>
                </Stack>
              </Box>

              {timing === "later" && (
                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  placeholder="Select Date & Time"
                  InputProps={{ startAdornment: <CalendarTodayOutlinedIcon sx={{ color: "#A0ACBA", fontSize: "0.9rem", mr: 0.5 }} /> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#F7F9FC", fontSize: "0.84rem" } }}
                />
              )}
            </Stack>
          </RadioGroup>
        </AdminPanel>

        {/* Action buttons */}
        <Button
          variant="contained"
          fullWidth
          sx={{ minHeight: 50, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontSize: "0.92rem", fontWeight: 900, textTransform: "none", boxShadow: "0 10px 24px rgba(14,86,200,0.25)", "&:hover": { bgcolor: "#0B49AD" } }}
        >
          Send Broadcast
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ minHeight: 50, borderRadius: "0.9rem", borderColor: "rgba(225,232,241,0.96)", color: adminUi.colors.text, fontSize: "0.92rem", fontWeight: 800, textTransform: "none", bgcolor: "#F4F7FB", "&:hover": { bgcolor: "#E5EAF1", borderColor: "#C8D4E4" } }}
        >
          Save Draft
        </Button>
      </Stack>
    </Box>
  );
}

// ── Broadcast History tab ─────────────────────────────────────────────────────
function BroadcastHistoryTab() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const total = BROADCAST_HISTORY.length;

  return (
    <AdminPanel sx={{ overflow: "hidden" }}>
      {/* Table header */}
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 1.2fr", gap: 1, px: 2.5, py: 1.6, bgcolor: "#F6F8FB", borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
        {["Broadcast Title", "Audience", "Channels", "Status", "Date Sent/Scheduled"].map((h) => (
          <Typography key={h} sx={{ color: "#738096", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</Typography>
        ))}
      </Box>

      {BROADCAST_HISTORY.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 1.2fr",
            gap: 1,
            px: 2.5,
            py: 2,
            alignItems: "center",
            borderTop: index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)",
            "&:hover": { bgcolor: "#F7F9FC" },
            transition: "background 0.15s",
          }}
        >
          <Box>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 900 }}>{item.title}</Typography>
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>ID: {item.id}</Typography>
          </Box>
          <Typography sx={{ color: "#344155", fontSize: "0.84rem", fontWeight: 700 }}>{item.audience}</Typography>
          <Stack direction="row" spacing={0.6}>
            {item.channels.map((ch) => {
              const Icon = CHANNEL_ICON[ch];
              return <Icon key={ch} sx={{ fontSize: "1rem", color: "#0E56C8" }} />;
            })}
          </Stack>
          <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "0.5rem", bgcolor: item.statusBg, color: item.statusColor, fontSize: "0.66rem", fontWeight: 900, textTransform: "uppercase" }}>
            {item.status}
          </Box>
          <Typography sx={{ color: "#667386", fontSize: "0.8rem" }}>{item.date}</Typography>
        </Box>
      ))}

      {/* Pagination */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.8, borderTop: "1px solid rgba(225,232,241,0.96)" }}>
        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>
          Showing {Math.min(pageSize, total)} of {total} records
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            sx={{ minHeight: 34, px: 1.6, borderRadius: "0.7rem", border: "1px solid rgba(225,232,241,0.96)", color: adminUi.colors.text, fontSize: "0.8rem", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#F4F7FB" } }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage((p) => p + 1)}
            sx={{ minHeight: 34, px: 1.6, borderRadius: "0.7rem", bgcolor: "#0E56C8", fontSize: "0.8rem", fontWeight: 700, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#0B49AD" } }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </AdminPanel>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <AdminPageShell>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-start" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ color: adminUi.colors.text, fontSize: { xs: "1.9rem", md: "2.3rem" }, fontWeight: 850, lineHeight: 1 }}>
            Broadcast
          </Typography>
          <Typography sx={{ mt: 0.7, maxWidth: 480, color: adminUi.colors.muted, fontSize: "0.94rem", lineHeight: 1.55 }}>
            Manage targeted communications and platform alerts to keep your solar ecosystem informed and efficient.
          </Typography>
        </Box>

        {/* Tab toggle */}
        <Stack direction="row" sx={{ border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.85rem", overflow: "hidden", flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}>
          <Button
            onClick={() => setActiveTab("create")}
            sx={{
              px: 2.2, py: 1, borderRadius: 0,
              bgcolor: activeTab === "create" ? "#0E56C8" : "#FFFFFF",
              color: activeTab === "create" ? "#FFFFFF" : adminUi.colors.muted,
              fontSize: "0.84rem", fontWeight: 800, textTransform: "none",
              "&:hover": { bgcolor: activeTab === "create" ? "#0B49AD" : "#F4F7FB" },
            }}
          >
            Create Broadcast
          </Button>
          <Button
            onClick={() => setActiveTab("history")}
            sx={{
              px: 2.2, py: 1, borderRadius: 0,
              bgcolor: activeTab === "history" ? "#0E56C8" : "#FFFFFF",
              color: activeTab === "history" ? "#FFFFFF" : adminUi.colors.muted,
              fontSize: "0.84rem", fontWeight: 800, textTransform: "none",
              "&:hover": { bgcolor: activeTab === "history" ? "#0B49AD" : "#F4F7FB" },
            }}
          >
            Broadcast History
          </Button>
        </Stack>
      </Stack>

      {activeTab === "create" ? <CreateBroadcastTab /> : <BroadcastHistoryTab />}
    </AdminPageShell>
  );
}

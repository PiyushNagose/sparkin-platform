import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ── Static data ───────────────────────────────────────────────────────────────
const APPLICATIONS = [
  {
    id: 1,
    name: "Rohan Deshmukh",
    email: "r.deshmukh@solartech.com",
    company: "SolarTech Solutions",
    location: "Pune",
    state: "Maharashtra",
    experience: "12+ Years",
    experienceColor: "#0E56C8",
    dateReceived: "Oct 24, 2023",
    status: "Pending",
    statusColor: "#556478",
    statusBg: "#EEF2F6",
    initials: "RD",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "p.sharma@greengrid.in",
    company: "GreenGrid Energy",
    location: "Mumbai",
    state: "Maharashtra",
    experience: "8 Years",
    experienceColor: "#0E56C8",
    dateReceived: "Oct 22, 2023",
    status: "Under Review",
    statusColor: "#0E56C8",
    statusBg: "#EEF4FF",
    initials: "PS",
  },
  {
    id: 3,
    name: "Vikram Singh",
    email: "v.singh@sunvolt.co",
    company: "SunVolt Systems",
    location: "Bangalore",
    state: "Karnataka",
    experience: "15+ Years",
    experienceColor: "#0E56C8",
    dateReceived: "Oct 20, 2023",
    status: "Approved",
    statusColor: "#239654",
    statusBg: "#DDF8E7",
    initials: "VS",
  },
];

const STATUS_OPTIONS = ["All", "Pending", "Under Review", "Approved", "Rejected"];
const LOCATION_OPTIONS = ["All Regions", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"];
const EXPERIENCE_OPTIONS = ["5+ Years", "8+ Years", "10+ Years", "15+ Years"];

export default function AdminVendorApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Regions");
  const [experienceFilter, setExperienceFilter] = useState("5+ Years");
  const [page, setPage] = useState(1);
  const totalPages = 12;
  const total = 124;

  const filtered = APPLICATIONS.filter((a) => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchLocation = locationFilter === "All Regions" || a.state === locationFilter;
    return matchStatus && matchLocation;
  });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Partner Applications"
        subtitle="Review and manage incoming vendor partnership requests. Vet applicants based on industry experience and regional presence to maintain grid quality."
        actions={
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            sx={{ minHeight: 44, px: 2.2, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontSize: "0.86rem", fontWeight: 800, textTransform: "none", boxShadow: "0 8px 20px rgba(14,86,200,0.22)", "&:hover": { bgcolor: "#0B49AD" } }}
          >
            Export List
          </Button>
        }
      />

      <AdminPanel sx={{ overflow: "hidden" }}>
        {/* Filters bar */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2.5, py: 1.8, borderBottom: "1px solid rgba(225,232,241,0.96)", flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 800, flexShrink: 0 }}>FILTER BY:</Typography>

          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>Status:</Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ height: 32, borderRadius: "0.65rem", fontSize: "0.8rem", minWidth: 90, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(225,232,241,0.96)" } }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>{s}</MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>Location:</Typography>
            <Select
              size="small"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              sx={{ height: 32, borderRadius: "0.65rem", fontSize: "0.8rem", minWidth: 120, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(225,232,241,0.96)" } }}
            >
              {LOCATION_OPTIONS.map((l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: "0.82rem" }}>{l}</MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>Experience:</Typography>
            <Select
              size="small"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              sx={{ height: 32, borderRadius: "0.65rem", fontSize: "0.8rem", minWidth: 100, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(225,232,241,0.96)" } }}
            >
              {EXPERIENCE_OPTIONS.map((e) => (
                <MenuItem key={e} value={e} sx={{ fontSize: "0.82rem" }}>{e}</MenuItem>
              ))}
            </Select>
          </Stack>

          <Box sx={{ ml: "auto", display: "flex", gap: 0.8 }}>
            <IconButton size="small" sx={{ width: 32, height: 32, border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.6rem", color: adminUi.colors.muted }}>
              <FilterListRoundedIcon sx={{ fontSize: "0.9rem" }} />
            </IconButton>
            <IconButton size="small" sx={{ width: 32, height: 32, border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.6rem", color: "#D94444" }}>
              <RefreshRoundedIcon sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Box>
        </Stack>

        {/* Column headers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr 1fr 1.2fr", gap: 1, px: 2.5, py: 1.4, bgcolor: "#F6F8FB", borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
          {["Applicant Name", "Company Name", "Location", "Experience", "Date Received", "Status", "Actions"].map((h) => (
            <Typography key={h} sx={{ color: "#738096", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((app, index) => (
          <Box
            key={app.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 0.8fr 1fr 1fr 1.2fr",
              gap: 1,
              px: 2.5,
              py: 2,
              alignItems: "center",
              borderTop: index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)",
              "&:hover": { bgcolor: "#F7F9FC" },
              transition: "background 0.15s",
            }}
          >
            {/* Applicant */}
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, bgcolor: "#EEF2F6", color: "#667386", fontSize: "0.76rem", fontWeight: 900, flexShrink: 0 }}>
                {app.initials}
              </Avatar>
              <Box>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 900 }}>{app.name}</Typography>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>{app.email}</Typography>
              </Box>
            </Stack>

            {/* Company */}
            <Typography sx={{ color: "#344155", fontSize: "0.86rem", fontWeight: 800 }}>{app.company}</Typography>

            {/* Location */}
            <Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 700 }}>{app.location}</Typography>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>{app.state}</Typography>
            </Box>

            {/* Experience */}
            <Typography sx={{ color: app.experienceColor, fontSize: "0.84rem", fontWeight: 900 }}>{app.experience}</Typography>

            {/* Date */}
            <Typography sx={{ color: "#667386", fontSize: "0.82rem" }}>{app.dateReceived}</Typography>

            {/* Status */}
            <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "0.5rem", bgcolor: app.statusBg, color: app.statusColor, fontSize: "0.68rem", fontWeight: 900, alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: app.statusColor }} />
              {app.status}
            </Box>

            {/* Actions */}
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: "0.7rem", borderColor: "rgba(225,232,241,0.96)", color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 800, textTransform: "none", px: 1.4, py: 0.7, bgcolor: "#F4F7FB", "&:hover": { bgcolor: "#EEF4FF", borderColor: "#0E56C8", color: "#0E56C8" } }}
            >
              View Application
            </Button>
          </Box>
        ))}

        {/* Pagination */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.8, borderTop: "1px solid rgba(225,232,241,0.96)" }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>
            Showing {filtered.length} of {total} partner applications
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ width: 30, height: 30, borderRadius: "0.5rem", border: "1px solid rgba(225,232,241,0.96)", color: adminUi.colors.muted }}
            >
              <Typography sx={{ fontSize: "0.8rem" }}>‹</Typography>
            </IconButton>

            {[1, 2, 3].map((p) => (
              <Button
                key={p}
                onClick={() => setPage(p)}
                sx={{ minWidth: 30, height: 30, borderRadius: "0.5rem", bgcolor: page === p ? "#0E56C8" : "transparent", color: page === p ? "#FFFFFF" : adminUi.colors.muted, fontSize: "0.8rem", fontWeight: 800, p: 0, "&:hover": { bgcolor: page === p ? "#0B49AD" : "#F4F7FB" } }}
              >
                {p}
              </Button>
            ))}

            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.8rem", px: 0.5 }}>...</Typography>

            <Button
              onClick={() => setPage(totalPages)}
              sx={{ minWidth: 30, height: 30, borderRadius: "0.5rem", bgcolor: page === totalPages ? "#0E56C8" : "transparent", color: page === totalPages ? "#FFFFFF" : adminUi.colors.muted, fontSize: "0.8rem", fontWeight: 800, p: 0, "&:hover": { bgcolor: "#F4F7FB" } }}
            >
              {totalPages}
            </Button>

            <IconButton
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ width: 30, height: 30, borderRadius: "0.5rem", border: "1px solid rgba(225,232,241,0.96)", color: adminUi.colors.muted }}
            >
              <Typography sx={{ fontSize: "0.8rem" }}>›</Typography>
            </IconButton>
          </Stack>
        </Stack>
      </AdminPanel>
    </AdminPageShell>
  );
}

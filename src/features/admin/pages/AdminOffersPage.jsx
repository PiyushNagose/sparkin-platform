import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";

// ── Static data ───────────────────────────────────────────────────────────────
const OFFERS = [
  {
    id: 1,
    name: "Eco-Friendly Installation",
    subtitle: "Residential solar panel sets",
    icon: "🌿",
    iconBg: "#DDF8E7",
    code: "ECOSOLAR20",
    type: "Percentage Discount",
    value: "20% OFF",
    valueColor: "#239654",
    used: 40,
    total: 100,
    usagePct: 40,
    barColor: "#0E56C8",
    expiry: "Oct 24, 2024",
    status: "ACTIVE",
    statusColor: "#239654",
    statusBg: "#DDF8E7",
  },
  {
    id: 2,
    name: "Flash Energy Sale",
    subtitle: "Limited time storage bundles",
    icon: "⚡",
    iconBg: "#FFF4D6",
    code: "FLASH780",
    type: "Fixed Amount",
    value: "₹700 OFF",
    valueColor: "#D97706",
    used: 92,
    total: 100,
    usagePct: 92,
    barColor: "#D94444",
    expiry: "Aug 15, 2024",
    status: "EXPIRED",
    statusColor: "#D94444",
    statusBg: "#FDECEC",
  },
  {
    id: 3,
    name: "Member Loyalty Boost",
    subtitle: "Annual subscription rewards",
    icon: "🖥️",
    iconBg: "#EEF4FF",
    code: "LOYALTY50",
    type: "Flat Credit",
    value: "₹50 CREDIT",
    valueColor: "#556478",
    used: 0,
    total: 500,
    usagePct: 0,
    barColor: "#C8D4E4",
    expiry: "Dec 31, 2024",
    status: "DISABLED",
    statusColor: "#556478",
    statusBg: "#EEF2F6",
  },
];

export default function AdminOffersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = OFFERS.filter((o) => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminPageShell>
      {/* Header */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-start" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ color: adminUi.colors.text, fontSize: { xs: "1.9rem", md: "2.3rem" }, fontWeight: 850, lineHeight: 1 }}>
            Offers & Coupons
          </Typography>
          <Typography sx={{ mt: 0.7, maxWidth: 520, color: adminUi.colors.muted, fontSize: "0.94rem", lineHeight: 1.55 }}>
            Manage your promotional strategy and discount campaigns with precision energy.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}>
          {/* Tab toggle */}
          <Stack direction="row" sx={{ border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.85rem", overflow: "hidden" }}>
            <Button
              onClick={() => navigate("/admin/offers/create")}
              sx={{ px: 2.2, py: 1, borderRadius: 0, bgcolor: "#FFFFFF", color: adminUi.colors.muted, fontSize: "0.84rem", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#F4F7FB" } }}
            >
              Create Offer
            </Button>
            <Button
              sx={{ px: 2.2, py: 1, borderRadius: 0, bgcolor: "#0E56C8", color: "#FFFFFF", fontSize: "0.84rem", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#0B49AD" } }}
            >
              Offers List
            </Button>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/admin/offers/create")}
            sx={{ minHeight: 44, px: 2.2, borderRadius: "0.9rem", bgcolor: "#0E56C8", fontSize: "0.86rem", fontWeight: 800, textTransform: "none", boxShadow: "0 8px 20px rgba(14,86,200,0.22)", "&:hover": { bgcolor: "#0B49AD" } }}
          >
            + New Strategy
          </Button>
        </Stack>
      </Stack>

      {/* Stats row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2, mb: 2.5 }}>
        {/* Active coupons */}
        <AdminPanel sx={{ p: 2.4 }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>Total Active Coupons</Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1.5}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "2.4rem", fontWeight: 900, lineHeight: 1 }}>12</Typography>
            <Typography sx={{ color: "#239654", fontSize: "0.78rem", fontWeight: 800, mb: 0.4 }}>+2 this week</Typography>
          </Stack>
        </AdminPanel>

        {/* Total redemptions */}
        <AdminPanel sx={{ p: 2.4 }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", mb: 0.6 }}>Total Redemptions</Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1.5}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "2.4rem", fontWeight: 900, lineHeight: 1 }}>842</Typography>
            <Box sx={{ mb: 0.4, width: 28, height: 28, borderRadius: "0.5rem", bgcolor: "#DDF8E7", display: "grid", placeItems: "center" }}>
              <ShowChartRoundedIcon sx={{ color: "#239654", fontSize: "1rem" }} />
            </Box>
          </Stack>
        </AdminPanel>

        {/* Campaign performance */}
        <AdminPanel sx={{ p: 2.4, bgcolor: "#0E56C8", backgroundImage: "linear-gradient(135deg, #0E56C8 0%, #1A3A8F 100%)", position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: 8, left: 12 }}>
            <Box sx={{ px: 1, py: 0.3, borderRadius: "999px", bgcolor: "#D7E600", color: "#4D5800", fontSize: "0.58rem", fontWeight: 900, display: "inline-flex" }}>
              CAMPAIGN PERFORMANCE
            </Box>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "1.5rem", fontWeight: 900, lineHeight: 1.1 }}>Solar Summer 24'</Typography>
            <Typography sx={{ mt: 0.5, color: "rgba(255,255,255,0.75)", fontSize: "0.78rem" }}>Currently the most effective coupon with 45% conversion.</Typography>
          </Box>
        </AdminPanel>
      </Box>

      {/* Inventory Management table */}
      <AdminPanel sx={{ overflow: "hidden", mb: 2.5 }}>
        {/* Table toolbar */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.8, borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListRoundedIcon sx={{ color: adminUi.colors.muted, fontSize: "1rem" }} />
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900 }}>Inventory Management</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "#A0ACBA", fontSize: "0.9rem" }} /></InputAdornment> }}
              sx={{ width: 180, "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", fontSize: "0.82rem", height: 36 } }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ height: 36, borderRadius: "0.75rem", fontSize: "0.82rem", minWidth: 110 }}
            >
              {["All Status", "ACTIVE", "EXPIRED", "DISABLED"].map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>{s}</MenuItem>
              ))}
            </Select>
            <IconButton size="small" sx={{ color: adminUi.colors.muted, border: "1px solid rgba(225,232,241,0.96)", borderRadius: "0.65rem", width: 36, height: 36 }}>
              <DownloadRoundedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Column headers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 0.9fr 0.8fr", gap: 1, px: 2.5, py: 1.4, bgcolor: "#F6F8FB", borderBottom: "1px solid rgba(225,232,241,0.96)" }}>
          {["Offer Name", "Code", "Type & Value", "Usage", "Expiry Date", "Status"].map((h) => (
            <Typography key={h} sx={{ color: "#738096", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</Typography>
          ))}
        </Box>

        {filtered.map((offer, index) => (
          <Box
            key={offer.id}
            sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 0.9fr 0.8fr", gap: 1, px: 2.5, py: 2, alignItems: "center", borderTop: index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)", "&:hover": { bgcolor: "#F7F9FC" }, transition: "background 0.15s" }}
          >
            {/* Name */}
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: "0.7rem", bgcolor: offer.iconBg, display: "grid", placeItems: "center", fontSize: "1rem", flexShrink: 0 }}>
                {offer.icon}
              </Box>
              <Box>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.88rem", fontWeight: 900 }}>{offer.name}</Typography>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}>{offer.subtitle}</Typography>
              </Box>
            </Stack>

            {/* Code */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ px: 0.9, py: 0.35, borderRadius: "0.45rem", bgcolor: "#F4F7FB", border: "1px solid rgba(225,232,241,0.96)" }}>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 900, fontFamily: "monospace" }}>{offer.code}</Typography>
              </Box>
              <IconButton size="small" sx={{ color: "#A0ACBA", p: 0.3 }}>
                <ContentCopyOutlinedIcon sx={{ fontSize: "0.8rem" }} />
              </IconButton>
            </Stack>

            {/* Type & Value */}
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.74rem" }}>{offer.type}</Typography>
              <Typography sx={{ color: offer.valueColor, fontSize: "0.82rem", fontWeight: 900 }}>{offer.value}</Typography>
            </Box>

            {/* Usage */}
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}>{offer.used}/{offer.total}</Typography>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}>{offer.usagePct}%</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={offer.usagePct}
                sx={{ height: 5, borderRadius: 9, bgcolor: "#EEF2F6", "& .MuiLinearProgress-bar": { bgcolor: offer.barColor, borderRadius: 9 } }}
              />
            </Box>

            {/* Expiry */}
            <Typography sx={{ color: "#344155", fontSize: "0.82rem", fontWeight: 700 }}>{offer.expiry}</Typography>

            {/* Status */}
            <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "0.5rem", bgcolor: offer.statusBg, color: offer.statusColor, fontSize: "0.64rem", fontWeight: 900, textTransform: "uppercase", alignItems: "center", gap: 0.4 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: offer.statusColor }} />
              {offer.status}
            </Box>
          </Box>
        ))}

        {/* Pagination */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.8, borderTop: "1px solid rgba(225,232,241,0.96)" }}>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>Showing 1–10 of 42 offers</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton size="small" disabled sx={{ width: 30, height: 30, borderRadius: "0.5rem", border: "1px solid rgba(225,232,241,0.96)" }}>
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
            <IconButton size="small" sx={{ width: 30, height: 30, borderRadius: "0.5rem", border: "1px solid rgba(225,232,241,0.96)", color: adminUi.colors.muted }}>
              <Typography sx={{ fontSize: "0.8rem" }}>›</Typography>
            </IconButton>
          </Stack>
        </Stack>
      </AdminPanel>

      {/* Bottom feature cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <AdminPanel sx={{ p: 2.8 }}>
          <Typography sx={{ fontSize: "1.4rem", mb: 0.6 }}>〜</Typography>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900, mb: 0.5 }}>Redemption Analytics</Typography>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.84rem", lineHeight: 1.6 }}>
            Deep dive into which coupons are driving the most solar adoption across specific geographic regions.
          </Typography>
        </AdminPanel>
        <AdminPanel sx={{ p: 2.8 }}>
          <Typography sx={{ fontSize: "1.4rem", mb: 0.6 }}>🕐</Typography>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900, mb: 0.5 }}>Automated Expiry</Typography>
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.84rem", lineHeight: 1.6 }}>
            Schedule future campaigns to auto-activate. Currently 4 campaigns are queued for the Q4 harvest season.
          </Typography>
        </AdminPanel>
      </Box>
    </AdminPageShell>
  );
}

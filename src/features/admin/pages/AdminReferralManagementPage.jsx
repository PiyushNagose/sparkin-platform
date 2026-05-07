import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  AdminPrimaryButton,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { adminReferralsApi } from "@/features/admin/api/referralsApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(v) {
  return rupeeFormatter.format(Number(v || 0));
}

function formatDate(v) {
  if (!v) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(v));
}

function getInitials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "#DCE9FF", color: "#0E56C8" },
  { bg: "#D6F5E3", color: "#0F6A38" },
  { bg: "#FFF0D6", color: "#A05C00" },
  { bg: "#F0E6FF", color: "#6B21A8" },
  { bg: "#FFE4E4", color: "#B91C1C" },
  { bg: "#E0F7FA", color: "#00695C" },
];

function avatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function downloadCsv(rows, filename) {
  const content = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Build monthly chart data from referrals array
function buildChartData(referrals) {
  const map = new Map();
  referrals.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "short" });
    if (!map.has(key)) map.set(key, { key, label, referrals: 0, conversions: 0 });
    const entry = map.get(key);
    entry.referrals += 1;
    if (["installed", "rewarded"].includes(r.status)) entry.conversions += 1;
  });
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([, v]) => v);
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, delta, accent = "#0E56C8", positive = true }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.2 },
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 18px 38px rgba(16,29,51,0.1)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "0.9rem",
            bgcolor: `${accent}18`,
            color: accent,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon sx={{ fontSize: "1.15rem" }} />
        </Box>
        {delta ? (
          <Box
            sx={{
              px: 0.85,
              py: 0.32,
              borderRadius: "999px",
              bgcolor: positive ? "#DFF7E8" : "#FFF0D6",
              color: positive ? "#108A55" : "#A05C00",
              fontSize: "0.62rem",
              fontWeight: 900,
            }}
          >
            {delta}
          </Box>
        ) : null}
      </Stack>
      <Typography
        sx={{ mt: 1.3, color: "#596579", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.45, color: adminUi.colors.text, fontSize: "1.8rem", fontWeight: 950, lineHeight: 1 }}>
        {value}
      </Typography>
    </AdminPanel>
  );
}

function ChannelBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ color, fontSize: "0.82rem", fontWeight: 900 }}>{value}</Typography>
      </Stack>
      <Box sx={{ height: 7, borderRadius: "999px", bgcolor: "#EEF2F7", overflow: "hidden" }}>
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "999px",
            bgcolor: color,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </Box>
    </Box>
  );
}

function StatusChip({ status }) {
  const map = {
    invited:   { label: "Invited",   bg: "#F0F4F8", color: "#596579" },
    signed_up: { label: "Signed Up", bg: "#FFF8D6", color: "#7A6B00" },
    installed: { label: "Success",   bg: "#D7F600", color: "#3C4700" },
    rewarded:  { label: "Rewarded",  bg: "#DFF7E8", color: "#0F6A38" },
  };
  const s = map[status] || map.invited;
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.1,
        py: 0.35,
        borderRadius: "0.5rem",
        bgcolor: s.bg,
        color: s.color,
        fontSize: "0.7rem",
        fontWeight: 900,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </Box>
  );
}

function PayoutChip({ rewardStatus, referralId, onUpdate }) {
  const isPaid = rewardStatus === "paid";
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      await onUpdate(referralId, isPaid ? "earned" : "paid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      onClick={handleToggle}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.1,
        py: 0.35,
        borderRadius: "0.5rem",
        bgcolor: isPaid ? "#DFF7E8" : "#FFE4E4",
        color: isPaid ? "#0F6A38" : "#B91C1C",
        fontSize: "0.7rem",
        fontWeight: 900,
        cursor: "pointer",
        userSelect: "none",
        transition: "opacity 0.15s",
        "&:hover": { opacity: 0.8 },
      }}
    >
      {loading ? (
        <CircularProgress size={10} sx={{ color: "inherit" }} />
      ) : (
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: isPaid ? "#0F6A38" : "#B91C1C",
          }}
        />
      )}
      {isPaid ? "PAID" : "UNPAID"}
    </Box>
  );
}

// Custom recharts tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "#1A2540",
        borderRadius: "0.75rem",
        px: 1.8,
        py: 1.2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.68rem", fontWeight: 700, mb: 0.6 }}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Stack key={p.dataKey} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: p.color }} />
          <Typography sx={{ color: "#fff", fontSize: "0.76rem", fontWeight: 700 }}>
            {p.name}: {p.value}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ referrals }) {
  const chartData = useMemo(() => buildChartData(referrals), [referrals]);

  const totalReferrals = referrals.length;
  const successful = referrals.filter((r) => ["installed", "rewarded"].includes(r.status)).length;
  const rewardsPaid = referrals
    .filter((r) => r.rewardStatus === "paid")
    .reduce((s, r) => s + r.rewardAmount, 0);
  const pendingRewards = referrals
    .filter((r) => r.rewardStatus === "earned")
    .reduce((s, r) => s + r.rewardAmount, 0);

  const directCount = referrals.filter((r) => r.channel === "direct_invite").length;
  const socialCount = referrals.filter((r) => r.channel === "social_share").length;
  const emailCount = referrals.filter((r) => r.channel === "email_campaign").length;
  const maxChannel = Math.max(directCount, socialCount, emailCount, 1);

  // Recent high-value referrals (top 3 by reward)
  const highValue = [...referrals]
    .sort((a, b) => b.rewardAmount - a.rewardAmount)
    .slice(0, 3);

  return (
    <Stack spacing={3}>
      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <KpiCard
          icon={PeopleAltOutlinedIcon}
          label="Total Referrals"
          value={totalReferrals.toLocaleString("en-IN")}
          delta="+10%"
          accent="#0E56C8"
        />
        <KpiCard
          icon={CheckCircleOutlineRoundedIcon}
          label="Successful Conversions"
          value={successful.toLocaleString("en-IN")}
          delta="+8.4%"
          accent="#239654"
        />
        <KpiCard
          icon={AccountBalanceWalletOutlinedIcon}
          label="Rewards Paid"
          value={formatMoney(rewardsPaid)}
          accent="#F47C22"
        />
        <KpiCard
          icon={HourglassEmptyRoundedIcon}
          label="Pending Rewards"
          value={formatMoney(pendingRewards)}
          delta="Active"
          positive={false}
          accent="#8B6FD4"
        />
      </Box>

      {/* Chart + Top Channels */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, gap: 2.5 }}>
        {/* Referral Growth Chart */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900 }}>
                Referral Growth
              </Typography>
              <Typography sx={{ mt: 0.3, color: adminUi.colors.muted, fontSize: "0.76rem" }}>
                Tracking monthly referral acquisition vs conversion performance
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                  color: "#596579",
                  bgcolor: "#F0F4F8",
                  borderRadius: "0.65rem",
                  px: 1.2,
                  minHeight: 30,
                }}
              >
                Last 12 Months
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadRoundedIcon sx={{ fontSize: "0.8rem" }} />}
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "none",
                  bgcolor: "#0E56C8",
                  borderRadius: "0.65rem",
                  px: 1.2,
                  minHeight: 30,
                  boxShadow: "0 6px 16px rgba(14,86,200,0.22)",
                }}
              >
                Export
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2.5, height: 280 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0E56C8" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0E56C8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B7A4A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1B7A4A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#8B97A8", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8B97A8", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<ChartTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "0.76rem", fontWeight: 700, paddingTop: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="referrals"
                    name="Total Referrals"
                    stroke="#0E56C8"
                    strokeWidth={2.5}
                    fill="url(#refGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#0E56C8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    name="Conversions"
                    stroke="#1B7A4A"
                    strokeWidth={2.5}
                    fill="url(#convGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#1B7A4A" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.84rem" }}>
                  No referral data yet
                </Typography>
              </Box>
            )}
          </Box>
        </AdminPanel>

        {/* Top Channels */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900, mb: 2 }}>
            Top Channels
          </Typography>
          <Stack spacing={2.2}>
            <ChannelBar label="Direct Referral" value={directCount} max={maxChannel} color="#0E56C8" />
            <ChannelBar label="Social Sharing" value={socialCount} max={maxChannel} color="#D4B800" />
            <ChannelBar label="Email Campaigns" value={emailCount} max={maxChannel} color="#239654" />
          </Stack>
        </AdminPanel>
      </Box>

      {/* Recent High-Value Referrals */}
      <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.2 }}>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 900 }}>
            Recent High-Value Referrals
          </Typography>
          <Typography sx={{ color: "#0E56C8", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}>
            View All Referrals →
          </Typography>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Referrer", "Referral Entity", "Status", "Reward", "Date"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#8B97A8",
                      fontSize: "0.64rem",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #EEF2F7",
                      pb: 1.2,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {highValue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <AdminEmptyState title="No referrals yet" subtitle="Referrals will appear here once customers start inviting friends." />
                  </TableCell>
                </TableRow>
              ) : (
                highValue.map((r) => {
                  const av = avatarColor(r.referrerEmail || "");
                  return (
                    <TableRow
                      key={r.id}
                      sx={{ "&:hover": { bgcolor: "#F8FAFC" }, "& td": { borderBottom: "1px solid #F0F4F8" } }}
                    >
                      <TableCell sx={{ py: 1.6 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              bgcolor: av.bg,
                              color: av.color,
                              display: "grid",
                              placeItems: "center",
                              fontSize: "0.7rem",
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(r.referrerEmail || "U")}
                          </Box>
                          <Box>
                            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 700 }}>
                              {r.referrerEmail?.split("@")[0] || "—"}
                            </Typography>
                            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}>
                              {r.referrerEmail || "—"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 600 }}>
                          {r.friend?.fullName || "—"}
                        </Typography>
                        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}>
                          {r.friend?.email || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <StatusChip status={r.status} />
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 800 }}>
                          {formatMoney(r.rewardAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}>
                          {formatDate(r.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminPanel>
    </Stack>
  );
}

// ─── Referrals List Tab ───────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function ReferralsListTab({ referrals, onUpdateRewardStatus }) {
  const [dateFilter, setDateFilter] = useState("30d");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payoutFilter, setPayoutFilter] = useState("all");
  const [page, setPage] = useState(1);

  const cutoff = useMemo(() => {
    if (dateFilter === "all") return null;
    const d = new Date();
    const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 90;
    d.setDate(d.getDate() - days);
    return d;
  }, [dateFilter]);

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (cutoff && new Date(r.createdAt) < cutoff) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (payoutFilter === "paid" && r.rewardStatus !== "paid") return false;
      if (payoutFilter === "unpaid" && r.rewardStatus === "paid") return false;
      return true;
    });
  }, [referrals, cutoff, statusFilter, payoutFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setDateFilter("30d");
    setStatusFilter("all");
    setPayoutFilter("all");
    setPage(1);
  }

  const filterSx = {
    minWidth: 140,
    "& .MuiOutlinedInput-root": {
      height: 38,
      borderRadius: "0.85rem",
      bgcolor: "#F4F7FA",
      fontSize: "0.78rem",
      fontWeight: 700,
      "& fieldset": { borderColor: "#E1E8F1" },
    },
  };

  return (
    <Stack spacing={2.5}>
      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ sm: "center" }} flexWrap="wrap">
        <TextField
          select
          size="small"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
          sx={filterSx}
          InputProps={{
            startAdornment: <FilterAltOutlinedIcon sx={{ fontSize: "0.9rem", color: "#8B97A8", mr: 0.6 }} />,
          }}
        >
          <MenuItem value="7d">Last 7 Days</MenuItem>
          <MenuItem value="30d">Last 30 Days</MenuItem>
          <MenuItem value="90d">Last 90 Days</MenuItem>
          <MenuItem value="all">All Time</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          sx={filterSx}
          InputProps={{
            startAdornment: <FilterAltOutlinedIcon sx={{ fontSize: "0.9rem", color: "#8B97A8", mr: 0.6 }} />,
          }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="invited">Invited</MenuItem>
          <MenuItem value="signed_up">Signed Up</MenuItem>
          <MenuItem value="installed">Installed</MenuItem>
          <MenuItem value="rewarded">Rewarded</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={payoutFilter}
          onChange={(e) => { setPayoutFilter(e.target.value); setPage(1); }}
          sx={filterSx}
          InputProps={{
            startAdornment: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: "0.9rem", color: "#8B97A8", mr: 0.6 }} />,
          }}
        >
          <MenuItem value="all">Payout Status</MenuItem>
          <MenuItem value="unpaid">Unpaid</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
        </TextField>

        <Button
          startIcon={<RefreshRoundedIcon sx={{ fontSize: "0.9rem" }} />}
          onClick={resetFilters}
          sx={{
            height: 38,
            px: 1.4,
            borderRadius: "0.85rem",
            bgcolor: "#F4F7FA",
            color: "#0E56C8",
            fontSize: "0.76rem",
            fontWeight: 800,
            textTransform: "none",
            border: "1px solid #E1E8F1",
          }}
        >
          Reset Filters
        </Button>
      </Stack>

      {/* Table */}
      <AdminPanel>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {["Referrer", "Referred User", "Signup Date", "Status", "Reward", "Payout"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#8B97A8",
                      fontSize: "0.64rem",
                      fontWeight: 900,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #EEF2F7",
                      py: 1.4,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <AdminEmptyState title="No referrals found" subtitle="Try adjusting your filters." />
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((r) => {
                  const av = avatarColor(r.referrerEmail || "");
                  return (
                    <TableRow
                      key={r.id}
                      sx={{ "&:hover": { bgcolor: "#F8FAFC" }, "& td": { borderBottom: "1px solid #F0F4F8" } }}
                    >
                      <TableCell sx={{ py: 1.6 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              bgcolor: av.bg,
                              color: av.color,
                              display: "grid",
                              placeItems: "center",
                              fontSize: "0.72rem",
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(r.referrerEmail || "U")}
                          </Box>
                          <Box>
                            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 700 }}>
                              {r.referrerEmail?.split("@")[0] || "—"}
                            </Typography>
                            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}>
                              {r.referrerEmail || "—"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 600 }}>
                          {r.friend?.fullName || "—"}
                        </Typography>
                        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.68rem" }}>
                          {r.friend?.email || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.8rem" }}>
                          {formatDate(r.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <StatusChip status={r.status} />
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 800 }}>
                          {formatMoney(r.rewardAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <PayoutChip
                          rewardStatus={r.rewardStatus}
                          referralId={r.id}
                          onUpdate={onUpdateRewardStatus}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2.5, py: 1.8, borderTop: "1px solid #EEF2F7" }}
        >
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} referrals
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "0.6rem",
                fontSize: "0.78rem",
                fontWeight: 700,
              },
              "& .Mui-selected": {
                bgcolor: "#0E56C8 !important",
                color: "white",
              },
            }}
          />
        </Stack>
      </AdminPanel>
    </Stack>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ settings, onSave }) {
  const [config, setConfig] = useState({
    rewardType: "Referral Reward",
    rewardAmount: 1000,
    minPurchase: "Min. 5kW Solar Installation",
    expiryDays: "60",
    programActive: true,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;

    setConfig({
      rewardType: settings.rewardType || "Referral Reward",
      rewardAmount: Number(settings.rewardAmount || 0),
      minPurchase:
        settings.minimumPurchaseCondition || "Min. 5kW Solar Installation",
      expiryDays: String(settings.referralExpiryDays || 60),
      programActive: Boolean(settings.programActive),
    });
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        rewardType: config.rewardType,
        rewardAmount: Number(config.rewardAmount || 0),
        minimumPurchaseCondition: config.minPurchase,
        referralExpiryDays: Number(config.expiryDays || 60),
        programActive: Boolean(config.programActive),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, gap: 2.5, alignItems: "flex-start" }}>
      {/* Config Form */}
      <AdminPanel sx={{ p: { xs: 2.2, md: 3 } }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "0.85rem",
              bgcolor: "#EEF4FF",
              color: "#0E56C8",
              display: "grid",
              placeItems: "center",
            }}
          >
            <TuneRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </Box>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900 }}>
            Reward Configuration
          </Typography>
        </Stack>

        <Stack spacing={2.8}>
          {/* Row 1 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", fontWeight: 700, mb: 0.8 }}>
                Reward Type
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={config.rewardType}
                onChange={(e) => setConfig((c) => ({ ...c, rewardType: e.target.value }))}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F4F7FA",
                    fontSize: "0.84rem",
                    "& fieldset": { borderColor: "#E1E8F1" },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", fontWeight: 700, mb: 0.8 }}>
                Reward Amount (₹)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={config.rewardAmount}
                onChange={(e) => setConfig((c) => ({ ...c, rewardAmount: Number(e.target.value) }))}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F4F7FA",
                    fontSize: "0.84rem",
                    "& fieldset": { borderColor: "#E1E8F1" },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Minimum Purchase */}
          <Box>
            <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", fontWeight: 700, mb: 0.8 }}>
              Minimum Purchase Condition
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={config.minPurchase}
              onChange={(e) => setConfig((c) => ({ ...c, minPurchase: e.target.value }))}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.85rem",
                  bgcolor: "#F4F7FA",
                  fontSize: "0.84rem",
                  "& fieldset": { borderColor: "#E1E8F1" },
                },
              }}
            />
            <Typography sx={{ mt: 0.7, color: "#8B97A8", fontSize: "0.68rem" }}>
              The reward will only trigger when the referred customer completes this specific purchase.
            </Typography>
          </Box>

          {/* Row 3 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", fontWeight: 700, mb: 0.8 }}>
                Referral Expiry
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={config.expiryDays}
                onChange={(e) => setConfig((c) => ({ ...c, expiryDays: e.target.value }))}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.85rem",
                    bgcolor: "#F4F7FA",
                    fontSize: "0.84rem",
                    "& fieldset": { borderColor: "#E1E8F1" },
                  },
                }}
              >
                <MenuItem value="30">30 Days</MenuItem>
                <MenuItem value="60">60 Days</MenuItem>
                <MenuItem value="90">90 Days</MenuItem>
                <MenuItem value="180">180 Days</MenuItem>
              </TextField>
            </Box>
            <Box>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", fontWeight: 700, mb: 0.8 }}>
                Program Status
              </Typography>
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{
                  height: 40,
                  px: 1.4,
                  borderRadius: "0.85rem",
                  bgcolor: "#F4F7FA",
                  border: "1px solid #E1E8F1",
                }}
              >
                <Switch
                  checked={config.programActive}
                  onChange={(e) => setConfig((c) => ({ ...c, programActive: e.target.checked }))}
                  size="small"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#0E56C8" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0E56C8" },
                  }}
                />
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 700 }}>
                  {config.programActive ? "Active & Public" : "Inactive"}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {saved ? (
            <Alert severity="success" sx={{ borderRadius: "0.85rem", fontSize: "0.8rem" }}>
              Configuration saved successfully.
            </Alert>
          ) : null}

          <Button
            fullWidth
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} sx={{ color: "white" }} /> : <SaveOutlinedIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              minHeight: 48,
              borderRadius: "0.9rem",
              fontWeight: 800,
              fontSize: "0.92rem",
              textTransform: "none",
              background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
              boxShadow: "0 12px 28px rgba(14,86,200,0.28)",
              "&:hover": { background: "linear-gradient(180deg, #0B49AD 0%, #0A3E9A 100%)" },
            }}
          >
            {saving ? "Saving…" : "Save Configuration"}
          </Button>
        </Stack>
      </AdminPanel>

      {/* Customer Preview Card */}
      <Box>
        <AdminPanel
          sx={{
            overflow: "hidden",
            border: "none",
            boxShadow: "0 16px 40px rgba(14,86,200,0.18)",
          }}
        >
          {/* Blue header */}
          <Box
            sx={{
              height: 100,
              background: "linear-gradient(135deg, #0E56C8 0%, #1A3A8F 100%)",
              display: "flex",
              alignItems: "flex-end",
              px: 2,
              pb: 1.5,
            }}
          >
            <Box
              sx={{
                px: 0.9,
                py: 0.3,
                borderRadius: "0.4rem",
                bgcolor: "#D7E600",
                color: "#3C4700",
                fontSize: "0.58rem",
                fontWeight: 950,
                letterSpacing: "0.06em",
              }}
            >
              CUSTOMER PREVIEW
            </Box>
          </Box>

          <Box sx={{ p: 2.2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.8 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <WbSunnyOutlinedIcon sx={{ fontSize: "1rem" }} />
              </Box>
              <Box>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "0.9rem", fontWeight: 800 }}>
                  Share the Sun
                </Typography>
                <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}>
                  Help friends switch and get rewarded.
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 1.8, borderColor: "#EEF2F7" }} />

            <Typography sx={{ color: "#8B97A8", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>
              Your Friend Gets
            </Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "1.6rem", fontWeight: 950, lineHeight: 1 }}>
              ₹{config.rewardAmount.toLocaleString("en-IN")} Credit
            </Typography>
            <Typography sx={{ mt: 0.6, color: adminUi.colors.muted, fontSize: "0.68rem" }}>
              Valid for {config.expiryDays} days · {config.minPurchase}
            </Typography>
          </Box>
        </AdminPanel>
      </Box>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Referrals List", "Settings"];

export default function AdminReferralManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [state, setState] = useState({
    loading: true,
    error: "",
    referrals: [],
    settings: null,
  });

  const load = useCallback(async (active = true) => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const [referrals, settings] = await Promise.all([
        adminReferralsApi.listAll(),
        adminReferralsApi.getSettings(),
      ]);
      if (active) {
        setState({
          loading: false,
          error: "",
          referrals,
          settings,
        });
      }
    } catch (err) {
      if (active)
        setState({
          loading: false,
          error: err?.response?.data?.message || err.message || "Unable to load referrals",
          referrals: [],
          settings: null,
        });
    }
  }, []);

  useEffect(() => {
    let active = true;
    load(active);
    return () => { active = false; };
  }, [load]);

  async function handleUpdateRewardStatus(referralId, rewardStatus) {
    const updated = await adminReferralsApi.updateRewardStatus(referralId, rewardStatus);
    setState((s) => ({
      ...s,
      referrals: s.referrals.map((r) => (r.id === referralId ? { ...r, rewardStatus: updated.rewardStatus } : r)),
    }));
  }

  async function handleSaveSettings(payload) {
    const settings = await adminReferralsApi.updateSettings(payload);
    setState((s) => ({ ...s, settings }));
    return settings;
  }

  function handleExport() {
    const rows = [
      ["Referrer Email", "Friend Name", "Friend Email", "Status", "Reward Status", "Reward Amount", "Date"],
      ...state.referrals.map((r) => [
        r.referrerEmail || "",
        r.friend?.fullName || "",
        r.friend?.email || "",
        r.status,
        r.rewardStatus,
        r.rewardAmount,
        formatDate(r.createdAt),
      ]),
    ];
    downloadCsv(rows, `sparkin-referrals-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Referral Management"
        subtitle="Monitor growth, track conversions, and manage rewards payouts."
        actions={
          <AdminPrimaryButton
            startIcon={<DownloadRoundedIcon />}
            onClick={handleExport}
          >
            + Export List
          </AdminPrimaryButton>
        }
      />

      {/* Tabs */}
      <Stack direction="row" spacing={0} sx={{ mb: 3, borderBottom: "2px solid #EEF2F7" }}>
        {TABS.map((tab, i) => (
          <Box
            key={tab}
            onClick={() => setActiveTab(i)}
            sx={{
              px: 2,
              pb: 1.2,
              cursor: "pointer",
              borderBottom: activeTab === i ? "2.5px solid #0E56C8" : "2.5px solid transparent",
              mb: "-2px",
              transition: "all 0.15s",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.88rem",
                fontWeight: activeTab === i ? 800 : 600,
                color: activeTab === i ? "#0E56C8" : adminUi.colors.muted,
                transition: "color 0.15s",
              }}
            >
              {tab}
            </Typography>
          </Box>
        ))}
      </Stack>

      {state.loading ? <AdminLoadingState /> : null}
      {!state.loading && state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      {!state.loading && !state.error ? (
        <>
          {activeTab === 0 && <OverviewTab referrals={state.referrals} />}
          {activeTab === 1 && (
            <ReferralsListTab
              referrals={state.referrals}
              onUpdateRewardStatus={handleUpdateRewardStatus}
            />
          )}
          {activeTab === 2 && (
            <SettingsTab settings={state.settings} onSave={handleSaveSettings} />
          )}
        </>
      ) : null}
    </AdminPageShell>
  );
}

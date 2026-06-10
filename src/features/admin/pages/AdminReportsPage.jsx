import {
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import regionalMapImg from "@/shared/assets/images/admin/reports/admin-reports-regional-map-placeholder.png";

// â”€â”€â”€ constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "6m", label: "Last 6 Months" },
  { value: "3m", label: "Last 3 Months" },
  { value: "1m", label: "Last Month" },
];

// months back â†’ cutoff date
function getCutoff(range) {
  if (range === "all") return null;
  const months = range === "6m" ? 6 : range === "3m" ? 3 : 1;
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10_000_000) return `â‚¹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `â‚¹${(amount / 100_000).toFixed(1)}L`;
  return rupeeFormatter.format(amount);
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function toCsv(rows) {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

function downloadBlob(name, content, type = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// â”€â”€â”€ sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  accent = "#0E56C8",
  steady = false,
}) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.2 },
        minHeight: 124,
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 36px rgba(16,29,51,0.1)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
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
              bgcolor: steady ? "#EEF2F6" : "#DFF7E8",
              color: steady ? "#657386" : "#108A55",
              fontSize: "0.62rem",
              fontWeight: 900,
            }}
          >
            {delta}
          </Box>
        ) : null}
      </Stack>
      <Typography
        sx={{
          mt: 1.3,
          color: "#596579",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.45,
          color: adminUi.colors.text,
          fontSize: "1.8rem",
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </AdminPanel>
  );
}

function VendorBar({ rank, name, completedProjects, totalProjects, pctValue }) {
  const barColor =
    pctValue >= 90 ? "#0F6A38" : pctValue >= 80 ? "#2B9C58" : "#4CAF7D";
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.6 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: rank === 1 ? "#F2F08E" : "#F0F4F8",
              color: rank === 1 ? "#6C7300" : "#7A8799",
              display: "grid",
              placeItems: "center",
              fontSize: "0.6rem",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {rank}
          </Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "0.84rem",
              fontWeight: 700,
            }}
          >
            {name}
          </Typography>
        </Stack>
        <Typography
          sx={{
            color: barColor,
            fontSize: "0.78rem",
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          {pctValue}% Completion
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 8,
          borderRadius: "999px",
          bgcolor: "#E7ECF2",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${pctValue}%`,
            height: "100%",
            borderRadius: "999px",
            bgcolor: barColor,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </Box>
      <Typography sx={{ mt: 0.4, color: "#8B97A8", fontSize: "0.66rem" }}>
        {completedProjects} of {totalProjects} projects completed
      </Typography>
    </Box>
  );
}

function FunnelBar({ label, value, pctValue, color }) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.55 }}
      >
        <Typography
          sx={{ color: "#596579", fontSize: "0.76rem", fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{ color: "#596579", fontSize: "0.74rem", fontWeight: 800 }}
        >
          {pctValue}%
        </Typography>
      </Stack>
      <Tooltip title={`${value} ${label.toLowerCase()}`} placement="right">
        <Box
          sx={{
            height: 34,
            borderRadius: "0.55rem",
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            px: 1.4,
            width: `${Math.max(pctValue, 8)}%`,
            minWidth: 56,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            cursor: "default",
          }}
        >
          <Typography
            sx={{ color: "#FFFFFF", fontSize: "0.84rem", fontWeight: 900 }}
          >
            {value}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ py: 0.9 }}
    >
      <Typography sx={{ color: "#657386", fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: highlight ? "#0E56C8" : adminUi.colors.text,
          fontSize: "0.84rem",
          fontWeight: 800,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function RegionCard({ region }) {
  return (
    <AdminPanel sx={{ p: { xs: 1.8, md: 2.2 } }}>
      <Typography
        sx={{
          color: adminUi.colors.muted,
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        {region.state}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.5 }}>
        <Typography
          sx={{
            color: adminUi.colors.text,
            fontSize: "1.7rem",
            fontWeight: 950,
            lineHeight: 1,
          }}
        >
          {region.count.toLocaleString("en-IN")}
        </Typography>
        <Typography
          sx={{ color: "#239654", fontSize: "0.76rem", fontWeight: 800 }}
        >
          {region.delta}
        </Typography>
      </Stack>
      <Box
        sx={{
          mt: 1.1,
          height: 4,
          borderRadius: "999px",
          bgcolor: "#E7ECF2",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${region.share}%`,
            height: "100%",
            borderRadius: "999px",
            bgcolor: "#0E56C8",
          }}
        />
      </Box>
      <Typography sx={{ mt: 0.5, color: "#8B97A8", fontSize: "0.66rem" }}>
        {region.share}% of total leads
      </Typography>
    </AdminPanel>
  );
}

// --- main page ----------------------------------------------------------------

export default function AdminReportsPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [range, setRange] = useState("6m");
  const [isExporting, setIsExporting] = useState(false);

  const load = useCallback(async (active = true) => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await getAdminDashboardData();
      if (active) setState({ loading: false, error: "", data });
    } catch (err) {
      if (active)
        setState({
          loading: false,
          error:
            err?.response?.data?.message ||
            err.message ||
            "Unable to load reports",
          data: null,
        });
    }
  }, []);

  useEffect(() => {
    let active = true;
    load(active);
    return () => {
      active = false;
    };
  }, [load]);

  // -- derived metrics --------------------------------------------------------

  const metrics = useMemo(() => {
    const allLeads = state.data?.leads || [];
    const allQuotes = state.data?.quotes || [];
    const allPayments = state.data?.payments || [];
    const allVendors = state.data?.vendors || [];
    const allProjects = state.data?.projects || [];

    const cutoff = getCutoff(range);
    const inRange = (item) => {
      if (!cutoff) return true;
      const d = new Date(
        item.createdAt || item.submittedAt || item.updatedAt || 0,
      );
      return d >= cutoff;
    };

    const leads = allLeads.filter(inRange);
    const quotes = allQuotes.filter(inRange);
    const payments = allPayments.filter(inRange);
    const projects = allProjects.filter(inRange);
    const vendors = allVendors; // vendors not time-filtered

    const verified = leads.filter((l) =>
      ["open_for_quotes", "quote_selected", "closed"].includes(l.status),
    );
    const paid = payments.filter((p) => p.status === "paid");
    const pending = payments.filter((p) => p.status === "pending");
    const totalRevenue = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
    const pendingRevenue = pending.reduce(
      (s, p) => s + Number(p.amount || 0),
      0,
    );
    const activeVendors = vendors.filter(
      (v) => v.verificationStatus === "verified",
    );
    const completedProjects = projects.filter((p) =>
      ["activated", "completed"].includes(p.status),
    );
    const activeProjects = projects.filter(
      (p) => !["activated", "completed", "cancelled"].includes(p.status),
    );

    // Vendor performance — rank by completed projects
    const vendorProjectMap = new Map();
    projects.forEach((p) => {
      const vid = p.vendorId;
      if (!vid) return;
      if (!vendorProjectMap.has(vid))
        vendorProjectMap.set(vid, { total: 0, completed: 0 });
      const entry = vendorProjectMap.get(vid);
      entry.total += 1;
      if (["activated", "completed"].includes(p.status)) entry.completed += 1;
    });

    const vendorPerf = vendors
      .map((v) => {
        const vid = v.vendorId || v.id;
        const stats = vendorProjectMap.get(vid) || { total: 0, completed: 0 };
        const completionPct = stats.total
          ? Math.round((stats.completed / stats.total) * 100)
          : 0;
        return {
          id: vid,
          name: v.company?.name || v.account?.fullName || "Unnamed Vendor",
          completedProjects: stats.completed,
          totalProjects: stats.total,
          pct: completionPct,
        };
      })
      .filter((v) => v.totalProjects > 0)
      .sort(
        (a, b) => b.pct - a.pct || b.completedProjects - a.completedProjects,
      )
      .slice(0, 5);

    // Conversion funnel
    const funnelSteps = [
      { label: "Leads", value: leads.length, pctValue: 100, color: "#0E56C8" },
      {
        label: "Verified",
        value: verified.length,
        pctValue: pct(verified.length, leads.length),
        color: "#1A66E8",
      },
      {
        label: "Paid",
        value: paid.length,
        pctValue: pct(paid.length, leads.length),
        color: "#4F89FF",
      },
      {
        label: "Assigned",
        value: projects.length,
        pctValue: pct(projects.length, leads.length),
        color: "#7AAEFF",
      },
      {
        label: "Bidding",
        value: quotes.length,
        pctValue: pct(quotes.length, leads.length),
        color: "#A8C8FF",
      },
      {
        label: "Customers",
        value: completedProjects.length,
        pctValue: pct(completedProjects.length, leads.length),
        color: "#239654",
      },
    ];

    // Regional breakdown from lead installationAddress
    const stateMap = new Map();
    leads.forEach((l) => {
      const s = l.installationAddress?.state;
      if (!s) return;
      // Normalise: "andhra_pradesh" → "Andhra Pradesh", or use raw value
      const label = String(s)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      stateMap.set(label, (stateMap.get(label) || 0) + 1);
    });
    const sortedStates = [...stateMap.entries()].sort((a, b) => b[1] - a[1]);
    const regionData = sortedStates.slice(0, 3).map(([stateName, count]) => ({
      state: stateName,
      count,
      share: pct(count, leads.length),
      delta: "+—",
    }));
    // fallback if no real data
    if (!regionData.length && leads.length === 0) {
      regionData.push({
        state: "Andhra Pradesh",
        count: 0,
        share: 0,
        delta: "—",
      });
    }

    return {
      leads,
      verified,
      paid,
      pending,
      totalRevenue,
      pendingRevenue,
      activeVendors,
      activeProjects,
      completedProjects,
      vendorPerf,
      funnelSteps,
      regionData,
      quotes,
      projects,
      vendors,
    };
  }, [state.data, range]);

  // -- export -----------------------------------------------------------------

  function handleExportCSV() {
    setIsExporting(true);
    try {
      const rows = [
        ["Metric", "Value"],
        ["Total Leads", metrics.leads.length],
        ["Verified Leads", metrics.verified.length],
        ["Total Quotes", metrics.quotes.length],
        ["Total Projects", metrics.projects.length],
        ["Active Projects", metrics.activeProjects.length],
        ["Completed Projects", metrics.completedProjects.length],
        ["Paid Payments", metrics.paid.length],
        ["Total Revenue", metrics.totalRevenue],
        ["Pending Revenue", metrics.pendingRevenue],
        ["Active Vendors", metrics.activeVendors.length],
        [],
        ["Vendor Performance"],
        ["Rank", "Vendor", "Completed", "Total", "Completion %"],
        ...metrics.vendorPerf.map((v, i) => [
          i + 1,
          v.name,
          v.completedProjects,
          v.totalProjects,
          `${v.pct}%`,
        ]),
        [],
        ["Regional Breakdown"],
        ["State", "Leads", "Share %"],
        ...metrics.regionData.map((r) => [r.state, r.count, `${r.share}%`]),
      ];
      downloadBlob(
        `sparkin-reports-${new Date().toISOString().slice(0, 10)}.csv`,
        toCsv(rows),
      );
    } finally {
      setIsExporting(false);
    }
  }

  // -- render -----------------------------------------------------------------

  if (state.loading) return <AdminLoadingState />;

  const rangeLabel =
    RANGE_OPTIONS.find((o) => o.value === range)?.label || "All Time";

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive overview of your solar ecosystem performance, from lead generation to project fulfillment."
        actions={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <TextField
              select
              size="small"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "0.85rem",
                  bgcolor: "#EFF3F7",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                },
              }}
              InputProps={{
                startAdornment: (
                  <CalendarTodayOutlinedIcon
                    sx={{ color: "#667386", fontSize: "0.95rem", mr: 0.8 }}
                  />
                ),
              }}
            >
              {RANGE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              startIcon={<RefreshRoundedIcon />}
              onClick={() => load()}
              sx={{
                minHeight: 40,
                px: 1.6,
                borderRadius: "0.85rem",
                bgcolor: "#EFF3F7",
                color: "#1F2C40",
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleExportCSV}
              disabled={isExporting}
              sx={{
                minHeight: 40,
                px: 2,
                borderRadius: "0.85rem",
                bgcolor: "#0E56C8",
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(14,86,200,0.2)",
              }}
            >
              {isExporting ? "Exporting…" : "Export CSV"}
            </Button>
          </Stack>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      {/* Range label */}
      <Typography
        sx={{ mb: 2.2, color: "#8B97A8", fontSize: "0.76rem", fontWeight: 700 }}
      >
        Showing data for:{" "}
        <Box component="span" sx={{ color: "#0E56C8", fontWeight: 900 }}>
          {rangeLabel}
        </Box>
      </Typography>

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <KpiCard
          icon={TrendingUpRoundedIcon}
          label="Total Leads"
          value={metrics.leads.length.toLocaleString("en-IN")}
          delta="+12%"
          accent="#0E56C8"
        />
        <KpiCard
          icon={VerifiedOutlinedIcon}
          label="Verified Leads"
          value={metrics.verified.length.toLocaleString("en-IN")}
          delta="+8%"
          accent="#8A9700"
        />
        <KpiCard
          icon={PaymentsOutlinedIcon}
          label="Payments Rec."
          value={formatMoney(metrics.totalRevenue)}
          delta="+24%"
          accent="#43D66E"
        />
        <KpiCard
          icon={AccountBalanceWalletOutlinedIcon}
          label="Total Revenue"
          value={formatMoney(metrics.totalRevenue)}
          delta="+18%"
          accent="#F47C22"
        />
        <KpiCard
          icon={StorefrontOutlinedIcon}
          label="Active Vendors"
          value={metrics.activeVendors.length.toLocaleString("en-IN")}
          delta="Steady"
          accent="#C9D5F5"
          steady
        />
      </Box>

      {/* Vendor Performance + Conversion Funnel */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Vendor Performance */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 2.4 }}
          >
            <Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.1rem",
                  fontWeight: 900,
                }}
              >
                Vendor Performance
              </Typography>
              <Typography
                sx={{
                  mt: 0.3,
                  color: adminUi.colors.muted,
                  fontSize: "0.76rem",
                }}
              >
                Top vendors ranked by project completion rate
              </Typography>
            </Box>
            <Button
              component={NavLink}
              to="/admin/vendors"
              sx={{
                color: "#0E56C8",
                fontSize: "0.78rem",
                fontWeight: 800,
                textTransform: "none",
                px: 0,
                whiteSpace: "nowrap",
              }}
            >
              View All Vendors ?
            </Button>
          </Stack>

          {metrics.vendorPerf.length ? (
            <Stack spacing={2.4}>
              {metrics.vendorPerf.map((v, i) => (
                <VendorBar
                  key={v.id}
                  rank={i + 1}
                  name={v.name}
                  completedProjects={v.completedProjects}
                  totalProjects={v.totalProjects}
                  pctValue={v.pct}
                />
              ))}
            </Stack>
          ) : (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography
                sx={{ color: adminUi.colors.muted, fontSize: "0.84rem" }}
              >
                No vendor project data available for this period.
              </Typography>
              <Button
                component={NavLink}
                to="/admin/vendors"
                sx={{
                  mt: 1.2,
                  color: "#0E56C8",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Manage Vendors ?
              </Button>
            </Box>
          )}
        </AdminPanel>

        {/* Conversion Funnel */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.1rem",
              fontWeight: 900,
              mb: 0.4,
            }}
          >
            Conversion Funnel
          </Typography>
          <Typography
            sx={{ color: adminUi.colors.muted, fontSize: "0.76rem", mb: 2.4 }}
          >
            Lead-to-customer pipeline for {rangeLabel.toLowerCase()}
          </Typography>
          <Stack spacing={1.8}>
            {metrics.funnelSteps.map((step) => (
              <FunnelBar
                key={step.label}
                label={step.label}
                value={step.value}
                pctValue={step.pctValue}
                color={step.color}
              />
            ))}
          </Stack>
        </AdminPanel>
      </Box>

      {/* Platform Summary + Project Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Lead Summary */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.8 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "0.85rem",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Groups2OutlinedIcon sx={{ fontSize: "1.05rem" }} />
            </Box>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.95rem",
                fontWeight: 900,
              }}
            >
              Lead Summary
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1.4, borderColor: "rgba(225,232,241,0.96)" }} />
          <SummaryRow
            label="Total Leads"
            value={metrics.leads.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Verified"
            value={metrics.verified.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Conversion Rate"
            value={`${pct(metrics.verified.length, metrics.leads.length)}%`}
            highlight
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Total Quotes"
            value={metrics.quotes.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Quote Acceptance"
            value={`${pct(metrics.quotes.filter((q) => q.status === "accepted").length, metrics.quotes.length)}%`}
            highlight
          />
        </AdminPanel>

        {/* Project Stats */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.8 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "0.85rem",
                bgcolor: "#E4F7EA",
                color: "#239654",
                display: "grid",
                placeItems: "center",
              }}
            >
              <AssignmentOutlinedIcon sx={{ fontSize: "1.05rem" }} />
            </Box>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.95rem",
                fontWeight: 900,
              }}
            >
              Project Stats
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1.4, borderColor: "rgba(225,232,241,0.96)" }} />
          <SummaryRow
            label="Total Projects"
            value={metrics.projects.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Active"
            value={metrics.activeProjects.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Completed"
            value={metrics.completedProjects.length.toLocaleString("en-IN")}
            highlight
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Completion Rate"
            value={`${pct(metrics.completedProjects.length, metrics.projects.length)}%`}
            highlight
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Avg. System Size"
            value={
              metrics.projects.length
                ? `${(metrics.projects.reduce((s, p) => s + Number(p.system?.sizeKw || 0), 0) / metrics.projects.length).toFixed(1)} kW`
                : "—"
            }
          />
        </AdminPanel>

        {/* Revenue Stats */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.4 } }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.8 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "0.85rem",
                bgcolor: "#FFF4E8",
                color: "#F47C22",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: "1.05rem" }} />
            </Box>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "0.95rem",
                fontWeight: 900,
              }}
            >
              Revenue Stats
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1.4, borderColor: "rgba(225,232,241,0.96)" }} />
          <SummaryRow
            label="Total Invoices"
            value={metrics.paid.length + metrics.pending.length}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Paid"
            value={metrics.paid.length.toLocaleString("en-IN")}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Collected Revenue"
            value={formatMoney(metrics.totalRevenue)}
            highlight
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Pending Revenue"
            value={formatMoney(metrics.pendingRevenue)}
          />
          <Divider sx={{ borderColor: "rgba(225,232,241,0.6)" }} />
          <SummaryRow
            label="Collection Rate"
            value={`${pct(metrics.paid.length, metrics.paid.length + metrics.pending.length)}%`}
            highlight
          />
        </AdminPanel>
      </Box>

      {/* Regional Insights */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: adminUi.colors.text,
            fontSize: "1.1rem",
            fontWeight: 900,
            mb: 0.5,
          }}
        >
          Regional Insights
        </Typography>
        <Typography
          sx={{ color: adminUi.colors.muted, fontSize: "0.82rem", mb: 2 }}
        >
          Lead distribution across key metropolitan clusters
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: { xs: 220, md: 300 },
            borderRadius: "1.4rem",
            overflow: "hidden",
            backgroundImage: `url(${regionalMapImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2.5,
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 12px 30px rgba(16,29,51,0.06)",
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {metrics.regionData.map((region) => (
            <RegionCard key={region.state} region={region} />
          ))}
        </Box>
      </Box>
    </AdminPageShell>
  );
}

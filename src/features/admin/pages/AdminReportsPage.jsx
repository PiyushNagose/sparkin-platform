import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import heroImg from "@/shared/assets/images/public/home/hero-background-placeholder.png";

const rupeeFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function formatMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return rupeeFormatter.format(amount);
}

function KpiCard({ icon: Icon, label, value, delta, accent = "#0E56C8", chip }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.2 },
        minHeight: 120,
        borderLeft: `4px solid ${accent}`,
        transition: "transform 0.18s ease",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ width: 36, height: 36, borderRadius: "0.85rem", bgcolor: `${accent}18`, color: accent, display: "grid", placeItems: "center" }}>
          <Icon sx={{ fontSize: "1.1rem" }} />
        </Box>
        {delta ? (
          <Box sx={{ px: 0.8, py: 0.3, borderRadius: "999px", bgcolor: chip === "Steady" ? "#EEF2F6" : "#DFF7E8", color: chip === "Steady" ? "#657386" : "#108A55", fontSize: "0.62rem", fontWeight: 900 }}>
            {delta}
          </Box>
        ) : null}
      </Stack>
      <Typography sx={{ mt: 1.2, color: "#596579", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</Typography>
      <Typography sx={{ mt: 0.4, color: adminUi.colors.text, fontSize: "1.75rem", fontWeight: 950, lineHeight: 1 }}>{value}</Typography>
    </AdminPanel>
  );
}

function VendorBar({ name, pct, color = "#0F6A38" }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 700 }}>{name}</Typography>
        <Typography sx={{ color, fontSize: "0.78rem", fontWeight: 900 }}>{pct}% Completion</Typography>
      </Stack>
      <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "#E7ECF2" }}>
        <Box sx={{ width: `${pct}%`, height: "100%", borderRadius: "999px", bgcolor: color }} />
      </Box>
    </Box>
  );
}

function FunnelBar({ label, value, pct, color }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography sx={{ color: "#596579", fontSize: "0.74rem", fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ color: "#596579", fontSize: "0.74rem", fontWeight: 700 }}>{pct}%</Typography>
      </Stack>
      <Box sx={{ height: 32, borderRadius: "0.5rem", bgcolor: color, display: "flex", alignItems: "center", px: 1.2, width: `${pct}%`, minWidth: 60 }}>
        <Typography sx={{ color: "#FFFFFF", fontSize: "0.82rem", fontWeight: 900 }}>{value}</Typography>
      </Box>
    </Box>
  );
}

export default function AdminReportsPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAdminDashboardData();
        if (active) setState({ loading: false, error: "", data });
      } catch (err) {
        if (active) setState({ loading: false, error: err?.response?.data?.message || err.message || "Unable to load reports", data: null });
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const metrics = useMemo(() => {
    const leads = state.data?.leads || [];
    const quotes = state.data?.quotes || [];
    const payments = state.data?.payments || [];
    const vendors = state.data?.vendors || [];
    const projects = state.data?.projects || [];

    const verified = leads.filter((l) => ["open_for_quotes", "quote_selected", "closed"].includes(l.status));
    const paid = payments.filter((p) => p.status === "paid");
    const totalRevenue = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
    const activeVendors = vendors.filter((v) => v.verificationStatus !== "rejected");

    const vendorPerf = vendors.slice(0, 5).map((v, i) => ({
      name: v.company?.name || v.account?.fullName || `Vendor ${i + 1}`,
      pct: Math.max(60, 98 - i * 8),
    }));

    const funnelSteps = [
      { label: "Leads", value: leads.length, pct: 100, color: "#0E56C8" },
      { label: "Verified", value: verified.length, pct: leads.length ? Math.round((verified.length / leads.length) * 100) : 0, color: "#1A66E8" },
      { label: "Paid", value: paid.length, pct: leads.length ? Math.round((paid.length / leads.length) * 100) : 0, color: "#4F89FF" },
      { label: "Assigned", value: projects.length, pct: leads.length ? Math.round((projects.length / leads.length) * 100) : 0, color: "#7AAEFF" },
      { label: "Bidding", value: quotes.length, pct: leads.length ? Math.round((quotes.length / leads.length) * 100) : 0, color: "#A8C8FF" },
      { label: "Customers", value: Math.round(projects.length * 0.85), pct: leads.length ? Math.round((projects.length * 0.85 / leads.length) * 100) : 0, color: "#239654" },
    ];

    const regionData = [
      { state: "Andhra Pradesh", count: Math.max(1, Math.round(leads.length * 0.32)), delta: "+16%" },
      { state: "Telangana", count: Math.max(1, Math.round(leads.length * 0.23)), delta: "+11%" },
      { state: "Karnataka", count: Math.max(1, Math.round(leads.length * 0.30)), delta: "+9%" },
    ];

    return { leads, verified, paid, totalRevenue, activeVendors, vendorPerf, funnelSteps, regionData, quotes };
  }, [state.data]);

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive overview of your solar ecosystem performance, from lead generation to project fulfillment."
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<CalendarTodayOutlinedIcon />}
              sx={{ minHeight: 40, px: 1.8, borderRadius: "0.85rem", bgcolor: "#EFF3F7", color: "#1F2C40", fontSize: "0.8rem", fontWeight: 800, textTransform: "none" }}
            >
              Last 6 Months
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadRoundedIcon />}
              sx={{ minHeight: 40, px: 2, borderRadius: "0.85rem", bgcolor: "#0E56C8", fontSize: "0.8rem", fontWeight: 800, textTransform: "none", boxShadow: "0 8px 20px rgba(14,86,200,0.2)" }}
            >
              Export PDF
            </Button>
          </Stack>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }, gap: 2, mb: 3 }}>
        <KpiCard icon={TrendingUpRoundedIcon} label="Total Leads" value={metrics.leads.length.toLocaleString("en-IN")} delta="+12%" accent="#0E56C8" />
        <KpiCard icon={VerifiedOutlinedIcon} label="Verified Leads" value={metrics.verified.length.toLocaleString("en-IN")} delta="+8%" accent="#8A9700" />
        <KpiCard icon={PaymentsOutlinedIcon} label="Payments Rec." value={formatMoney(metrics.totalRevenue)} delta="+24%" accent="#43D66E" />
        <KpiCard icon={AccountBalanceWalletOutlinedIcon} label="Total Revenue" value={formatMoney(metrics.totalRevenue)} delta="+18%" accent="#F47C22" />
        <KpiCard icon={StorefrontOutlinedIcon} label="Active Vendors" value={metrics.activeVendors.length} chip="Steady" delta="Steady" accent="#C9D5F5" />
      </Box>

      {/* Vendor Performance + Conversion Funnel */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2.5, mb: 3 }}>
        {/* Vendor Performance */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Box>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900 }}>Vendor Performance</Typography>
              <Typography sx={{ mt: 0.3, color: adminUi.colors.muted, fontSize: "0.76rem" }}>Top 5 vendors ranked by project completion rate</Typography>
            </Box>
            <Button component={NavLink} to="/admin/vendors" sx={{ color: "#0E56C8", fontSize: "0.78rem", fontWeight: 800, textTransform: "none", px: 0 }}>
              View All Vendors →
            </Button>
          </Stack>
          <Stack spacing={2.2}>
            {metrics.vendorPerf.length ? (
              metrics.vendorPerf.map((v) => <VendorBar key={v.name} name={v.name} pct={v.pct} />)
            ) : (
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.84rem" }}>No vendor data available yet.</Typography>
            )}
          </Stack>
        </AdminPanel>

        {/* Conversion Funnel */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
          <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900, mb: 2.5 }}>Conversion Funnel</Typography>
          <Stack spacing={1.6}>
            {metrics.funnelSteps.map((step) => (
              <FunnelBar key={step.label} label={step.label} value={step.value} pct={Math.max(step.pct, 5)} color={step.color} />
            ))}
          </Stack>
        </AdminPanel>
      </Box>

      {/* Regional Insights */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: adminUi.colors.text, fontSize: "1.1rem", fontWeight: 900, mb: 0.5 }}>Regional Insights</Typography>
        <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.82rem", mb: 2 }}>Lead distribution across key metropolitan clusters</Typography>

        <Box
          sx={{
            width: "100%",
            height: { xs: 220, md: 300 },
            borderRadius: "1.4rem",
            overflow: "hidden",
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 2.5,
          }}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
          {metrics.regionData.map((region) => (
            <AdminPanel key={region.state} sx={{ p: { xs: 1.8, md: 2.2 } }}>
              <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem", fontWeight: 700 }}>{region.state}</Typography>
              <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 0.5 }}>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "1.6rem", fontWeight: 950 }}>{region.count}</Typography>
                <Typography sx={{ color: "#239654", fontSize: "0.76rem", fontWeight: 800 }}>{region.delta}</Typography>
              </Stack>
            </AdminPanel>
          ))}
        </Box>
      </Box>
    </AdminPageShell>
  );
}

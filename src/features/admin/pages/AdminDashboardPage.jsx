import {
  Avatar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData } from "@/features/admin/api/adminApi";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  const amount = Number(value || 0);

  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;

  return rupeeFormatter.format(amount);
}

function formatRelativeDate(value) {
  if (!value) return "Recently";

  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return `${Math.floor(hours / 24)} days ago`;
}

function getLeadCity(lead) {
  return (
    lead?.installationAddress?.city ||
    lead?.installationAddress?.district ||
    lead?.installationAddress?.state ||
    "Unassigned"
  );
}

function getProjectName(project) {
  return project?.customer?.fullName || project?.installationAddress?.city || "Solar project";
}

function buildTrend(leads) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-IN", { month: "short" }),
      count: 0,
    };
  });

  const monthByKey = new Map(months.map((month) => [month.key, month]));
  leads.forEach((lead) => {
    const createdAt = new Date(lead.createdAt || lead.submittedAt);
    if (Number.isNaN(createdAt.getTime())) return;
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const bucket = monthByKey.get(key);
    if (bucket) bucket.count += 1;
  });

  const max = Math.max(1, ...months.map((month) => month.count));
  const points = months.map((month, index) => {
    const x = 24 + index * 64;
    const y = 150 - (month.count / max) * 90;
    return { ...month, x, y };
  });

  return {
    months: points,
    path: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    area: `M ${points[0].x} 150 ${points.map((point) => `L ${point.x} ${point.y}`).join(" ")} L ${points.at(-1).x} 150 Z`,
  };
}

function StatCard({ title, value, caption, icon: Icon, accent = "#0E56C8", progress }) {
  return (
    <AdminPanel
      sx={{
        p: 2,
        minHeight: 116,
        borderLeft: `4px solid ${accent}`,
        display: "flex",
        justifyContent: "space-between",
        gap: 1.5,
      }}
    >
      <Box>
        <Typography sx={{ color: "#5E6C80", fontSize: "0.78rem", fontWeight: 700 }}>{title}</Typography>
        <Typography sx={{ mt: 0.55, color: adminUi.colors.text, fontSize: "1.8rem", fontWeight: 850, lineHeight: 1 }}>
          {value}
        </Typography>
        {typeof progress === "number" ? (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              mt: 1.2,
              width: 70,
              height: 5,
              borderRadius: 9,
              bgcolor: "#EDF1F6",
              "& .MuiLinearProgress-bar": { bgcolor: accent, borderRadius: 9 },
            }}
          />
        ) : null}
        {caption ? (
          <Typography sx={{ mt: 0.85, color: "#007A4D", fontSize: "0.68rem", fontWeight: 800 }}>{caption}</Typography>
        ) : null}
      </Box>
      <Avatar sx={{ width: 44, height: 44, bgcolor: `${accent}22`, color: accent }}>
        <Icon sx={{ fontSize: "1.25rem" }} />
      </Avatar>
    </AdminPanel>
  );
}

function AlertCard({ title, caption, action, tone, path }) {
  return (
    <Box
      component={NavLink}
      to={path}
      sx={{
        p: 1.45,
        borderRadius: "1rem",
        border: `1px solid ${tone.border}`,
        bgcolor: tone.bg,
        color: "inherit",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        minHeight: 70,
      }}
    >
      <Box sx={{ width: 6, height: 38, borderRadius: 9, bgcolor: tone.color }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "#18253A", fontSize: "0.76rem", fontWeight: 850 }}>{title}</Typography>
        <Typography sx={{ mt: 0.25, color: "#667386", fontSize: "0.67rem", fontWeight: 700 }}>{caption}</Typography>
        <Typography sx={{ mt: 0.65, color: tone.color, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase" }}>
          {action}
        </Typography>
      </Box>
    </Box>
  );
}

function LogItem({ event }) {
  const Icon = event.icon;
  return (
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      <Avatar sx={{ width: 34, height: 34, bgcolor: event.bg, color: event.color }}>
        <Icon sx={{ fontSize: "1rem" }} />
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "#1F2C40", fontSize: "0.75rem", fontWeight: 850, lineHeight: 1.35 }}>
          {event.title}
        </Typography>
        <Typography sx={{ mt: 0.2, color: "#7B8797", fontSize: "0.66rem", fontWeight: 650 }}>
          {event.time} • {event.caption}
        </Typography>
      </Box>
    </Stack>
  );
}

function AdminPlaceholderPage({ title }) {
  return (
    <AdminPageShell>
      <AdminPageHeader title={title} subtitle="This admin workspace will use the same live operational data as the dashboard." />
      <AdminPanel>
        <AdminEmptyState title={`${title} workspace is ready`} subtitle="We will connect the detailed table and actions in the next admin flow." />
      </AdminPanel>
    </AdminPageShell>
  );
}

export function makeAdminPlaceholder(title) {
  return <AdminPlaceholderPage title={title} />;
}

export default function AdminDashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const data = await getAdminDashboardData();
        if (active) setState({ loading: false, error: "", data });
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error: error?.response?.data?.message || error.message || "Unable to load admin dashboard",
            data: null,
          });
        }
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const data = state.data || {};
    const leads = data.leads || [];
    const quotes = data.quotes || [];
    const payments = data.payments || [];
    const projects = data.projects || [];
    const vendors = data.vendors || [];

    const verifiedLeads = leads.filter((lead) =>
      ["open_for_quotes", "quote_selected", "closed"].includes(lead.status),
    );
    const paidAmount = payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const activeVendors = vendors.filter((vendor) => vendor.verificationStatus !== "rejected");
    const pendingLeads = leads.filter((lead) => ["submitted", "reviewing"].includes(lead.status));
    const pendingPayments = payments.filter((payment) => payment.status === "pending");
    const failedPayments = payments.filter((payment) => payment.status === "failed");
    const vendorsOnHold = vendors.filter((vendor) => ["draft", "submitted"].includes(vendor.verificationStatus));

    const recentEvents = [
      ...leads.map((lead) => ({
        date: lead.createdAt || lead.submittedAt,
        title: `New lead created by ${lead.contact?.fullName || "Customer"}`,
        caption: `${getLeadCity(lead)} • ${lead.sector || "Solar lead"}`,
        icon: PersonAddAltOutlinedIcon,
        color: "#0E56C8",
        bg: "#EAF1FF",
      })),
      ...payments.map((payment) => ({
        date: payment.paidAt || payment.createdAt,
        title: `${payment.status === "paid" ? "Payment received" : "Payment updated"} for ${payment.invoiceNumber || "invoice"}`,
        caption: formatMoney(payment.amount || 0),
        icon: PaymentsOutlinedIcon,
        color: payment.status === "failed" ? "#E7473C" : "#16B765",
        bg: payment.status === "failed" ? "#FFEDEC" : "#EAFBF1",
      })),
      ...projects.map((project) => ({
        date: project.updatedAt || project.createdAt,
        title: `Project status updated`,
        caption: `${getProjectName(project)} • ${project.status?.replaceAll("_", " ") || "active"}`,
        icon: AssignmentTurnedInOutlinedIcon,
        color: "#9BA900",
        bg: "#F7F9DD",
      })),
      ...quotes.map((quote) => ({
        date: quote.submittedAt || quote.createdAt,
        title: `Bid placed by vendor`,
        caption: formatMoney(quote.pricing?.totalPrice || 0),
        icon: RequestQuoteOutlinedIcon,
        color: "#4D77D7",
        bg: "#EEF3FF",
      })),
    ]
      .filter((event) => event.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((event) => ({ ...event, time: formatRelativeDate(event.date) }));

    return {
      leads,
      quotes,
      payments,
      projects,
      vendors,
      verifiedLeads,
      paidAmount,
      activeVendors,
      pendingLeads,
      pendingPayments,
      failedPayments,
      vendorsOnHold,
      recentEvents,
      trend: buildTrend(leads),
    };
  }, [state.data]);

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Real-time intelligence on solar lead acquisition and vendor network performance across India."
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      <Grid container spacing={2.2}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Leads"
            value={metrics.leads.length}
            caption={`${metrics.pendingLeads.length} need review`}
            icon={Groups2OutlinedIcon}
            accent="#0E56C8"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Verified Leads"
            value={metrics.verifiedLeads.length}
            caption={`${metrics.quotes.length} submitted quotes`}
            icon={AdminPanelSettingsOutlinedIcon}
            accent="#8A9700"
            progress={metrics.leads.length ? (metrics.verifiedLeads.length / metrics.leads.length) * 100 : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Payments Received"
            value={formatMoney(metrics.paidAmount)}
            caption={`${metrics.pendingPayments.length} pending payments`}
            icon={AccountBalanceWalletOutlinedIcon}
            accent="#43D66E"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Vendors"
            value={metrics.activeVendors.length}
            caption={`${metrics.vendorsOnHold.length} on-boarding`}
            icon={StorefrontOutlinedIcon}
            accent="#C9D5F5"
          />
        </Grid>
      </Grid>

      <AdminPanel sx={{ mt: 2.8, p: { xs: 1.8, md: 2.2 }, borderColor: "#F2D8D5" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.5} sx={{ mb: 1.8 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ErrorOutlineRoundedIcon sx={{ color: "#E7473C", fontSize: "1.15rem" }} />
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 850 }}>
              System Alerts (High Priority)
            </Typography>
          </Stack>
          <Button component={NavLink} to="/admin/notifications" sx={{ textTransform: "none", fontSize: "0.74rem", fontWeight: 800 }}>
            Mark all as seen
          </Button>
        </Stack>

        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6} lg={3}>
            <AlertCard
              title="Lead Verification"
              caption={`${metrics.pendingLeads.length} leads need verification`}
              action="Resolve now"
              path="/admin/leads"
              tone={{ color: "#D42C25", bg: "#FFF3F2", border: "#F4D4D1" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <AlertCard
              title="Payment Pending"
              caption={`${metrics.pendingPayments.length} users payment pending`}
              action="Notify users"
              path="/admin/payments"
              tone={{ color: "#8A9700", bg: "#FAFAEF", border: "#E8E5CC" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <AlertCard
              title="Vendor Status"
              caption={`${metrics.vendorsOnHold.length} vendors on hold`}
              action="View vendors"
              path="/admin/vendors"
              tone={{ color: "#0E56C8", bg: "#F1F6FF", border: "#D9E4FA" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <AlertCard
              title="Transaction Fail"
              caption={`${metrics.failedPayments.length} failed payments`}
              action="Retry sync"
              path="/admin/payments"
              tone={{ color: "#F47C22", bg: "#FFF5ED", border: "#F6DDC9" }}
            />
          </Grid>
        </Grid>
      </AdminPanel>

      <Grid container spacing={2.2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={8}>
          <AdminPanel sx={{ p: { xs: 2, md: 2.4 }, minHeight: 390 }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 850 }}>
                  Performance Metrics
                </Typography>
                <Typography sx={{ mt: 0.25, color: adminUi.colors.muted, fontSize: "0.76rem" }}>
                  Monthly growth and activity distribution
                </Typography>
              </Box>
              <Box sx={{ px: 1.2, py: 0.6, borderRadius: "999px", bgcolor: "#F2F5F9", fontSize: "0.68rem", fontWeight: 850 }}>
                Last 6 Months
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3.2 }}>
              <Typography sx={{ color: "#8A96A8", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.12em" }}>
                LEADS OVER TIME
              </Typography>
              <Typography sx={{ color: "#0E56C8", fontSize: "0.72rem", fontWeight: 900 }}>
                {metrics.leads.length} total
              </Typography>
            </Stack>

            <Box sx={{ mt: 1.4, height: 225, borderRadius: "1rem", bgcolor: "#FAFCFF", overflow: "hidden" }}>
              <svg viewBox="0 0 360 180" width="100%" height="100%" preserveAspectRatio="none" role="img" aria-label="Leads over time">
                <defs>
                  <linearGradient id="adminTrendArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0E56C8" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0E56C8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={metrics.trend.area} fill="url(#adminTrendArea)" />
                <path d={metrics.trend.path} fill="none" stroke="#0E56C8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {metrics.trend.months.map((month) => (
                  <circle key={month.key} cx={month.x} cy={month.y} r="3.6" fill="#0E56C8" />
                ))}
              </svg>
            </Box>
          </AdminPanel>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AdminPanel sx={{ p: { xs: 2, md: 2.4 }, minHeight: 390, bgcolor: "#F8FAFC" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.4 }}>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1rem", fontWeight: 850 }}>Real-time Log</Typography>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#43D66E" }} />
            </Stack>

            {metrics.recentEvents.length ? (
              <Stack spacing={2.2}>
                {metrics.recentEvents.map((event, index) => (
                  <LogItem key={`${event.title}-${event.date}-${index}`} event={event} />
                ))}
              </Stack>
            ) : (
              <AdminEmptyState title="No live activity yet" subtitle="Operational events will appear once users, vendors, or projects create activity." />
            )}

            <Button
              component={NavLink}
              to="/admin/notifications"
              fullWidth
              sx={{
                mt: 2.6,
                minHeight: 38,
                borderRadius: "999px",
                bgcolor: "#FFFFFF",
                color: "#0E56C8",
                fontSize: "0.73rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#EEF4FF" },
              }}
            >
              View Full System Log
            </Button>
          </AdminPanel>
        </Grid>
      </Grid>
    </AdminPageShell>
  );
}

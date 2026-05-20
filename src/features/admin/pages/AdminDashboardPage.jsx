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
  return (
    project?.customer?.fullName ||
    project?.installationAddress?.city ||
    "Solar project"
  );
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
    path: points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" "),
    area: `M ${points[0].x} 150 ${points.map((point) => `L ${point.x} ${point.y}`).join(" ")} L ${points.at(-1).x} 150 Z`,
  };
}

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  accent = "#0E56C8",
  progress,
}) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        minHeight: 130,
        borderLeft: `4px solid ${accent}`,
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 36px rgba(16,29,51,0.1)",
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: "#5E6C80",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 0.7,
            color: adminUi.colors.text,
            fontSize: "2rem",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        {typeof progress === "number" ? (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              mt: 1.4,
              width: 80,
              height: 5,
              borderRadius: 9,
              bgcolor: "#EDF1F6",
              "& .MuiLinearProgress-bar": { bgcolor: accent, borderRadius: 9 },
            }}
          />
        ) : null}
        {caption ? (
          <Typography
            sx={{
              mt: 1,
              color: "#007A4D",
              fontSize: "0.72rem",
              fontWeight: 800,
            }}
          >
            {caption}
          </Typography>
        ) : null}
      </Box>
      <Avatar
        sx={{
          width: 48,
          height: 48,
          borderRadius: "1rem",
          bgcolor: `${accent}18`,
          color: accent,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: "1.35rem" }} />
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
        p: { xs: 1.6, md: 1.8 },
        borderRadius: "1.1rem",
        border: `1px solid ${tone.border}`,
        bgcolor: tone.bg,
        color: "inherit",
        textDecoration: "none",
        display: "flex",
        alignItems: "flex-start",
        gap: 1.4,
        minHeight: 90,
        transition: "transform 0.15s ease",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          width: 5,
          height: 44,
          borderRadius: 9,
          bgcolor: tone.color,
          flexShrink: 0,
          mt: 0.2,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ color: "#18253A", fontSize: "0.82rem", fontWeight: 900 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 0.35,
            color: "#667386",
            fontSize: "0.72rem",
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          {caption}
        </Typography>
        <Typography
          sx={{
            mt: 0.8,
            color: tone.color,
            fontSize: "0.64rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {action}
        </Typography>
      </Box>
    </Box>
  );
}

function LogItem({ event }) {
  const Icon = event.icon;
  return (
    <Stack direction="row" spacing={1.4} alignItems="flex-start">
      <Avatar
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.85rem",
          bgcolor: event.bg,
          color: event.color,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: "1.05rem" }} />
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#1F2C40",
            fontSize: "0.82rem",
            fontWeight: 850,
            lineHeight: 1.35,
          }}
        >
          {event.title}
        </Typography>
        <Typography
          sx={{
            mt: 0.25,
            color: "#7B8797",
            fontSize: "0.7rem",
            fontWeight: 650,
          }}
        >
          {event.time} • {event.caption}
        </Typography>
      </Box>
    </Stack>
  );
}

function AdminPlaceholderPage({ title }) {
  return (
    <AdminPageShell>
      <AdminPageHeader
        title={title}
        subtitle="This admin workspace will use the same live operational data as the dashboard."
      />
      <AdminPanel>
        <AdminEmptyState
          title={`${title} workspace is ready`}
          subtitle="We will connect the detailed table and actions in the next admin flow."
        />
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
            error:
              error?.response?.data?.message ||
              error.message ||
              "Unable to load admin dashboard",
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
      [
        "verified",
        "vendors_assigned",
        "open_for_quotes",
        "quote_selected",
        "closed",
      ].includes(lead.status),
    );
    const paidAmount = payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const activeVendors = vendors.filter(
      (vendor) => vendor.verificationStatus !== "rejected",
    );
    const pendingLeads = leads.filter((lead) =>
      ["submitted", "reviewing"].includes(lead.status),
    );
    const pendingPayments = payments.filter(
      (payment) => payment.status === "pending",
    );
    const failedPayments = payments.filter(
      (payment) => payment.status === "failed",
    );
    const vendorsOnHold = vendors.filter((vendor) =>
      ["draft", "submitted"].includes(vendor.verificationStatus),
    );

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

      {/* KPI Cards — 4 equal columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.2,
          mb: 0,
        }}
      >
        <StatCard
          title="Total Leads"
          value={metrics.leads.length}
          caption={`${metrics.pendingLeads.length} need review`}
          icon={Groups2OutlinedIcon}
          accent="#0E56C8"
        />
        <StatCard
          title="Verified Leads"
          value={metrics.verifiedLeads.length}
          caption={`${metrics.quotes.length} submitted quotes`}
          icon={AdminPanelSettingsOutlinedIcon}
          accent="#8A9700"
          progress={
            metrics.leads.length
              ? (metrics.verifiedLeads.length / metrics.leads.length) * 100
              : 0
          }
        />
        <StatCard
          title="Payments Received"
          value={formatMoney(metrics.paidAmount)}
          caption={`${metrics.pendingPayments.length} pending payments`}
          icon={AccountBalanceWalletOutlinedIcon}
          accent="#43D66E"
        />
        <StatCard
          title="Active Vendors"
          value={metrics.activeVendors.length}
          caption={`${metrics.vendorsOnHold.length} on-boarding`}
          icon={StorefrontOutlinedIcon}
          accent="#C9D5F5"
        />
      </Box>

      <AdminPanel
        sx={{ mt: 2.8, p: { xs: 2, md: 2.6 }, borderColor: "#F2D8D5" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2.2 }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <ErrorOutlineRoundedIcon
              sx={{ color: "#E7473C", fontSize: "1.25rem" }}
            />
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1.1rem",
                fontWeight: 900,
              }}
            >
              System Alerts (High Priority)
            </Typography>
          </Stack>
          <Button
            component={NavLink}
            to="/admin/notifications"
            sx={{
              textTransform: "none",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#0E56C8",
            }}
          >
            Mark all as seen
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <AlertCard
            title="Lead Verification"
            caption={`${metrics.pendingLeads.length} leads need verification`}
            action="Resolve now"
            path="/admin/leads"
            tone={{ color: "#D42C25", bg: "#FFF3F2", border: "#F4D4D1" }}
          />
          <AlertCard
            title="Payment Pending"
            caption={`${metrics.pendingPayments.length} users payment pending`}
            action="Notify users"
            path="/admin/payments"
            tone={{ color: "#8A9700", bg: "#FAFAEF", border: "#E8E5CC" }}
          />
          <AlertCard
            title="Vendor Status"
            caption={`${metrics.vendorsOnHold.length} vendors on hold`}
            action="View vendors"
            path="/admin/vendors"
            tone={{ color: "#0E56C8", bg: "#F1F6FF", border: "#D9E4FA" }}
          />
          <AlertCard
            title="Transaction Fail"
            caption={`${metrics.failedPayments.length} failed payments`}
            action="Retry sync"
            path="/admin/payments"
            tone={{ color: "#F47C22", bg: "#FFF5ED", border: "#F6DDC9" }}
          />
        </Box>
      </AdminPanel>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2.2,
          mt: 2.8,
        }}
      >
        <AdminPanel sx={{ p: { xs: 2, md: 2.6 }, minHeight: 390 }}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "1.1rem",
                  fontWeight: 900,
                }}
              >
                Performance Metrics
              </Typography>
              <Typography
                sx={{
                  mt: 0.3,
                  color: adminUi.colors.muted,
                  fontSize: "0.78rem",
                }}
              >
                Monthly growth and activity distribution
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1.3,
                py: 0.65,
                borderRadius: "999px",
                bgcolor: "#F2F5F9",
                fontSize: "0.72rem",
                fontWeight: 850,
                color: "#556478",
              }}
            >
              Last 30 Days
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3.5 }}
          >
            <Typography
              sx={{
                color: "#8A96A8",
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "0.12em",
              }}
            >
              LEADS OVER TIME
            </Typography>
            <Typography
              sx={{ color: "#0E56C8", fontSize: "0.72rem", fontWeight: 900 }}
            >
              +{metrics.leads.length > 0 ? "15.4" : "0"}%
            </Typography>
          </Stack>

          <Box
            sx={{
              mt: 1.6,
              height: 230,
              borderRadius: "1rem",
              bgcolor: "#FAFCFF",
              overflow: "hidden",
            }}
          >
            <svg
              viewBox="0 0 360 180"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              role="img"
              aria-label="Leads over time"
            >
              <defs>
                <linearGradient id="adminTrendArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0E56C8" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0E56C8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={metrics.trend.area} fill="url(#adminTrendArea)" />
              <path
                d={metrics.trend.path}
                fill="none"
                stroke="#0E56C8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {metrics.trend.months.map((month) => (
                <circle
                  key={month.key}
                  cx={month.x}
                  cy={month.y}
                  r="4"
                  fill="#0E56C8"
                />
              ))}
            </svg>
          </Box>
        </AdminPanel>

        <AdminPanel
          sx={{ p: { xs: 2, md: 2.6 }, minHeight: 390, bgcolor: "#F8FAFC" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2.6 }}
          >
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1.1rem",
                fontWeight: 900,
              }}
            >
              Real-time Log
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#43D66E",
              }}
            />
          </Stack>

          {metrics.recentEvents.length ? (
            <Stack spacing={2.2}>
              {metrics.recentEvents.map((event, index) => (
                <LogItem
                  key={`${event.title}-${event.date}-${index}`}
                  event={event}
                />
              ))}
            </Stack>
          ) : (
            <AdminEmptyState
              title="No live activity yet"
              subtitle="Operational events will appear once users, vendors, or projects create activity."
            />
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
      </Box>
    </AdminPageShell>
  );
}

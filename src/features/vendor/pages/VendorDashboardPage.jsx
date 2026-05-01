import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import vendorHeatmapPlaceholder from "@/shared/assets/images/vendor/dashboard/vendor-heatmap-placeholder.png";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatCompactPrice(value) {
  const amount = Number(value) || 0;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount >= 1000000 ? 1 : 0)}L`;
  return formatPrice(amount);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SP";
}

function downloadFile(fileName, content, type = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function formatLocation(address) {
  return [address?.city, address?.state].filter(Boolean).join(", ") || "Location pending";
}

function getLeadSystem(lead) {
  return lead.property?.sanctionedLoadKw ? `${lead.property.sanctionedLoadKw} kW` : "Assessment";
}

function getLeadBudget(lead) {
  const load = Number(lead.property?.sanctionedLoadKw) || 0;
  return load ? formatPrice(load * 75000) : "Quote needed";
}

function getStatusMeta(status) {
  const map = {
    submitted: { label: "New", tone: "#4F89FF", bg: "#EEF4FF" },
    reviewing: { label: "Reviewing", tone: "#8C9400", bg: "#F7F6C7" },
    open_for_quotes: { label: "Open", tone: "#2B9C58", bg: "#E7F8EC" },
    quote_selected: { label: "Closed", tone: "#596579", bg: "#EEF2F6" },
  };

  return map[status] || { label: status?.replaceAll("_", " ") || "Lead", tone: "#596579", bg: "#EEF2F6" };
}

function timeAgo(value) {
  const timestamp = value ? new Date(value).getTime() : 0;
  if (!timestamp) return "Recently";

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function buildActivity({ leads, quotes, projects, payments }) {
  const events = [
    ...quotes.map((quote) => ({
      color: quote.status === "accepted" ? "#1C9B57" : "#2E78FF",
      title: `${quote.status === "accepted" ? "Quote accepted" : "Quote submitted"} for ${formatPrice(quote.pricing.totalPrice)}`,
      at: quote.updatedAt || quote.submittedAt,
    })),
    ...projects.map((project) => ({
      color: "#95A000",
      title: `${project.customer.fullName} project is ${project.status.replaceAll("_", " ")}`,
      at: project.updatedAt || project.createdAt,
    })),
    ...payments
      .filter((payment) => payment.status === "paid")
      .map((payment) => ({
        color: "#1C9B57",
        title: `Payment received: ${formatPrice(payment.amount)}`,
        at: payment.paidAt || payment.updatedAt,
      })),
    ...leads.map((lead) => ({
      color: "#8E98A9",
      title: `New lead: ${lead.contact.fullName}`,
      at: lead.createdAt || lead.submittedAt,
    })),
  ];

  return events
    .filter((event) => event.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);
}

export default function VendorDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [leadRows, quoteRows, projectRows, paymentRows] = await Promise.all([
          leadsApi.listLeads(),
          quotesApi.listQuotes(),
          projectsApi.listProjects(),
          paymentsApi.listPayments(),
        ]);

        if (!active) return;
        setLeads(leadRows);
        setQuotes(quoteRows);
        setProjects(projectRows);
        setPayments(paymentRows);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load vendor dashboard.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const paidRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const pendingRevenue = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const acceptedQuotes = quotes.filter((quote) => quote.status === "accepted");
  const openLeads = leads.filter((lead) => ["submitted", "reviewing", "open_for_quotes"].includes(lead.status));
  const activeProjects = projects.filter((project) => !["completed", "cancelled"].includes(project.status));
  const totalCapacity = projects.reduce((sum, project) => sum + (Number(project.system?.sizeKw) || 0), 0);
  const activity = useMemo(() => buildActivity({ leads, quotes, projects, payments }), [leads, quotes, projects, payments]);

  const kpiCards = [
    {
      icon: Groups2RoundedIcon,
      label: "Open Leads",
      value: String(openLeads.length),
      delta: `${leads.length} total`,
      color: "#4F7FFF",
      bg: "#EEF4FF",
    },
    {
      icon: AccessTimeRoundedIcon,
      label: "Active Projects",
      value: String(activeProjects.length),
      delta: `${projects.length} assigned`,
      color: "#A04FFF",
      bg: "#F4EDFF",
    },
    {
      icon: RequestQuoteRoundedIcon,
      label: "Quotes Submitted",
      value: String(quotes.length),
      delta: `${acceptedQuotes.length} accepted`,
      color: "#F0A33D",
      bg: "#FFF4E8",
    },
    {
      icon: CheckCircleRoundedIcon,
      label: "Won Projects",
      value: String(acceptedQuotes.length),
      delta: `${Math.round(totalCapacity)} kW`,
      color: "#90A524",
      bg: "#F6F7D8",
    },
    {
      icon: CurrencyRupeeRoundedIcon,
      label: "Revenue",
      value: formatCompactPrice(paidRevenue),
      delta: `${formatCompactPrice(pendingRevenue)} pending`,
      color: "#47A26D",
      bg: "#E9F7EE",
    },
  ];

  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        openLeads: openLeads.length,
        totalLeads: leads.length,
        activeProjects: activeProjects.length,
        totalProjects: projects.length,
        quotesSubmitted: quotes.length,
        acceptedQuotes: acceptedQuotes.length,
        paidRevenue,
        pendingRevenue,
        totalCapacityKw: totalCapacity,
      },
      leads,
      quotes,
      projects,
      payments,
    };

    downloadFile(
      `sparkin-vendor-report-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(report, null, 2),
      "application/json;charset=utf-8",
    );
  }

  function downloadLeads() {
    const rows = [
      ["Lead ID", "Customer", "Phone", "Email", "Location", "System Size", "Budget", "Status", "Submitted At"],
      ...leads.map((lead) => [
        lead.id,
        lead.contact?.fullName,
        lead.contact?.phoneNumber,
        lead.contact?.email,
        formatLocation(lead.installationAddress),
        getLeadSystem(lead),
        getLeadBudget(lead),
        getStatusMeta(lead.status).label,
        lead.createdAt || lead.submittedAt,
      ]),
    ];

    downloadFile(`sparkin-vendor-leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: { xs: 2.8, md: 3.2 } }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "2rem", md: "2.2rem" },
              fontWeight: 800,
              lineHeight: 1.03,
            }}
          >
            Vendor Dashboard
          </Typography>
          <Typography sx={{ mt: 0.6, maxWidth: 430, color: "#6F7D8F", fontSize: "0.92rem", lineHeight: 1.62 }}>
            Real-time overview of your leads, quotes, installation projects, and payments.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.1}>
          <Button
            onClick={exportReport}
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={isLoading}
            sx={{ minHeight: 36, px: 1.8, borderRadius: "999px", borderColor: "rgba(208,216,226,0.95)", color: "#223146", fontSize: "0.75rem", fontWeight: 700, textTransform: "none" }}
          >
            Export Report
          </Button>
          <Button
            onClick={downloadLeads}
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={isLoading}
            sx={{ minHeight: 36, px: 1.8, borderRadius: "999px", bgcolor: "#0E56C8", boxShadow: "none", fontSize: "0.75rem", fontWeight: 700, textTransform: "none" }}
          >
            Download Leads
          </Button>
        </Stack>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>{error}</Alert> : null}

      {isLoading ? (
        <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}

      {!isLoading ? (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" }, gap: 1.6, mb: { xs: 2.4, md: 2.8 } }}>
            {kpiCards.map((card) => (
              <KpiCard key={card.label} card={card} />
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1.55fr 0.82fr" }, gap: 1.8, mb: { xs: 2.4, md: 2.8 } }}>
            <ActiveLeadsPanel leads={openLeads.slice(0, 5)} />
            <ActivityPanel activity={activity} />
          </Box>

          <Box sx={{ p: 2.2, borderRadius: "1.45rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)", mb: { xs: 2.4, md: 2.8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.6 }}>
              <Typography sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}>
                Project Feedback
              </Typography>
              <Stack direction="row" spacing={0.35} alignItems="center">
                <StarRoundedIcon sx={{ color: "#FFB648", fontSize: "0.98rem" }} />
                <Typography sx={{ color: "#F39A20", fontSize: "0.76rem", fontWeight: 800 }}>
                  {projects.length ? "4.8" : "-"}
                </Typography>
                <Typography sx={{ color: "#8B97A8", fontSize: "0.71rem" }}>
                  ({projects.length} project{projects.length === 1 ? "" : "s"})
                </Typography>
              </Stack>
            </Stack>

            {projects.length ? (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.4 }}>
                {projects.slice(0, 2).map((project) => (
                  <Box key={project.id} sx={{ p: 1.6, minHeight: 126, borderRadius: "1.05rem", bgcolor: "#FBFCFE", border: "1px solid rgba(231,236,244,0.96)" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ display: "flex", gap: 0.18 }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarRoundedIcon key={index} sx={{ color: "#FFB648", fontSize: "0.82rem" }} />
                        ))}
                      </Box>
                      <Typography sx={{ color: "#A1ACBA", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" }}>
                        {project.status.replaceAll("_", " ")}
                      </Typography>
                    </Stack>
                    <Typography sx={{ mt: 1.2, color: "#556478", fontSize: "0.8rem", lineHeight: 1.65, fontStyle: "italic" }}>
                      "{project.customer.fullName}'s {project.system.sizeKw}kW installation is currently in your project pipeline."
                    </Typography>
                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 1.6 }}>
                      <Avatar sx={{ width: 22, height: 22, bgcolor: "#E4EAF4", fontSize: "0.62rem" }}>
                        {getInitials(project.customer.fullName)}
                      </Avatar>
                      <Typography sx={{ color: "#223146", fontSize: "0.75rem", fontWeight: 700 }}>
                        {project.customer.fullName}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Box>
            ) : (
              <EmptyState text="Customer feedback will appear after your first accepted project." />
            )}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1.55fr 0.82fr" }, gap: 1.8 }}>
            <Box sx={{ p: 2.2, borderRadius: "1.45rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}>
                  Installation Heatmap
                </Typography>
                <Stack direction="row" spacing={0.6}>
                  {[...new Set(projects.map((project) => project.installationAddress?.state).filter(Boolean))]
                    .slice(0, 2)
                    .map((chip, index) => (
                      <Box key={chip} sx={{ px: 0.8, py: 0.3, borderRadius: "999px", bgcolor: index === 0 ? "#EAF1FF" : "#F3F5F9", color: index === 0 ? "#0E56C8" : "#7D899A", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {chip}
                      </Box>
                    ))}
                </Stack>
              </Stack>

              <Box sx={{ height: 168, borderRadius: "1rem", overflow: "hidden", border: "1px solid rgba(220,228,238,0.96)", backgroundImage: `url(${vendorHeatmapPlaceholder})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </Box>

            <Box sx={{ p: 2.35, borderRadius: "1.45rem", bgcolor: "#0E56C8", color: "#FFFFFF", boxShadow: "0 18px 34px rgba(14,86,200,0.18)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 228 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "0.85rem", bgcolor: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center" }}>
                <MapOutlinedIcon sx={{ fontSize: "1rem" }} />
              </Box>
              <Box sx={{ mt: 2.2 }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
                  Total Power Yield
                </Typography>
                <Typography sx={{ mt: 0.7, maxWidth: 220, color: "rgba(255,255,255,0.78)", fontSize: "0.82rem", lineHeight: 1.62 }}>
                  Capacity is calculated from your accepted installation projects.
                </Typography>
              </Box>
              <Typography sx={{ mt: 3.2, fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>
                {Math.round(totalCapacity * 120)}
                <Typography component="span" sx={{ ml: 0.6, fontSize: "1rem", fontWeight: 700, opacity: 0.82 }}>
                  MWH
                </Typography>
              </Typography>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  );
}

function KpiCard({ card }) {
  const Icon = card.icon;

  return (
    <Box sx={{ p: 2.1, minHeight: 114, borderRadius: "1.35rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ width: 30, height: 30, borderRadius: "0.8rem", bgcolor: card.bg, color: card.color, display: "grid", placeItems: "center" }}>
          <Icon sx={{ fontSize: "0.95rem" }} />
        </Box>
        <Typography sx={{ color: "#3DAB62", fontSize: "0.66rem", fontWeight: 800 }}>{card.delta}</Typography>
      </Stack>
      <Typography sx={{ mt: 1.5, color: "#8B97A8", fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {card.label}
      </Typography>
      <Typography sx={{ mt: 0.55, color: "#18253A", fontSize: "1.55rem", fontWeight: 800, lineHeight: 1.06 }}>
        {card.value}
      </Typography>
    </Box>
  );
}

function ActiveLeadsPanel({ leads }) {
  return (
    <Box sx={{ p: 2.2, borderRadius: "1.45rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ color: "#18253A", fontSize: "1.12rem", fontWeight: 800 }}>Active Leads</Typography>
        <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 700 }}>All Leads</Typography>
      </Stack>

      <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "1.35fr 1fr 0.78fr 0.9fr 0.9fr 0.55fr", gap: 1, px: 0.4, mb: 1.1 }}>
        {["Customer Name", "Location", "System Size", "Budget", "Status", "Actions"].map((label) => (
          <Typography key={label} sx={{ color: "#8B97A8", fontSize: "0.61rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {label}
          </Typography>
        ))}
      </Box>

      {leads.length ? (
        <Stack spacing={0.35}>
          {leads.map((lead) => {
            const status = getStatusMeta(lead.status);

            return (
              <Box key={lead.id} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr 0.78fr 0.9fr 0.9fr 0.55fr" }, gap: 1, alignItems: "center", px: 0.4, py: 1.15, borderRadius: "0.95rem", "&:hover": { bgcolor: "#F8FAFD" } }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#EFF3F9", color: "#18253A", fontSize: "0.7rem", fontWeight: 800 }}>
                    {getInitials(lead.contact.fullName)}
                  </Avatar>
                  <Typography sx={{ color: "#223146", fontSize: "0.79rem", fontWeight: 700 }}>
                    {lead.contact.fullName}
                  </Typography>
                </Stack>
                <Typography sx={{ color: "#4E5C70", fontSize: "0.79rem" }}>{formatLocation(lead.installationAddress)}</Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.79rem" }}>{getLeadSystem(lead)}</Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.79rem" }}>{getLeadBudget(lead)}</Typography>
                <Box sx={{ justifySelf: "start", px: 1, py: 0.42, borderRadius: "999px", bgcolor: status.bg, color: status.tone, fontSize: "0.66rem", fontWeight: 800, lineHeight: 1 }}>
                  {status.label}
                </Box>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  <Button component={RouterLink} to={`/vendor/leads/${lead.id}`} sx={{ minWidth: 0, p: 0.25, color: "#93A0B3" }}>
                    <VisibilityOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  </Button>
                  <Button component={RouterLink} to={`/vendor/leads/${lead.id}/quote`} sx={{ minWidth: 0, p: 0.25, color: "#93A0B3" }}>
                    <MailOutlineRoundedIcon sx={{ fontSize: "0.9rem" }} />
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <EmptyState text="No active leads are available yet." />
      )}

      <Button component={RouterLink} to="/vendor/leads" fullWidth sx={{ mt: 1.8, color: "#0E56C8", fontSize: "0.76rem", fontWeight: 700, textTransform: "none" }}>
        View all active leads
      </Button>
    </Box>
  );
}

function ActivityPanel({ activity }) {
  return (
    <Box sx={{ p: 2.2, borderRadius: "1.45rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
      <Typography sx={{ color: "#18253A", fontSize: "1.12rem", fontWeight: 800, mb: 1.8 }}>Recent Activity</Typography>
      {activity.length ? (
        <Stack spacing={1.4}>
          {activity.map((item) => (
            <Stack key={`${item.title}-${item.at}`} direction="row" spacing={1} alignItems="flex-start">
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: item.color, mt: 0.52, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ color: "#223146", fontSize: "0.79rem", lineHeight: 1.45 }}>{item.title}</Typography>
                <Typography sx={{ mt: 0.25, color: "#8B97A8", fontSize: "0.71rem" }}>{timeAgo(item.at)}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : (
        <EmptyState text="Activity will appear as leads, quotes, projects, and payments move." />
      )}

      <Button component={RouterLink} to="/vendor/projects" fullWidth variant="outlined" sx={{ mt: 2.1, minHeight: 40, borderRadius: "0.95rem", borderColor: "rgba(222,228,236,0.96)", color: "#556478", bgcolor: "#F7F9FC", textTransform: "none", fontSize: "0.76rem", fontWeight: 700 }}>
        View Projects
      </Button>
    </Box>
  );
}

function EmptyState({ text }) {
  return (
    <Box sx={{ py: 3, px: 1.5, borderRadius: "1rem", bgcolor: "#F8FAFD", textAlign: "center", color: "#798698", fontSize: "0.82rem", fontWeight: 600 }}>
      {text}
    </Box>
  );
}

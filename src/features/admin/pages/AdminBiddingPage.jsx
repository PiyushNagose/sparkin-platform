import {
  Alert,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
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
import { quotesApi } from "@/features/public/api/leadsApi";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function formatCompactMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `INR ${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `INR ${(amount / 100000).toFixed(1)}L`;
  return formatMoney(amount);
}

function formatLeadId(leadId) {
  return `#SPK-${String(leadId || "")
    .slice(-4)
    .toUpperCase()}`;
}

function getLeadStatus(lead, quotes) {
  if (lead?.status === "quote_selected")
    return { label: "Selected", color: "#0E56C8", bg: "#EAF1FF" };
  if (["closed", "cancelled"].includes(lead?.status))
    return { label: "Completed", color: "#657386", bg: "#EEF2F6" };
  if (quotes.length > 0)
    return { label: "Active", color: "#687000", bg: "#D7E600" };
  return { label: "Pending", color: "#6B7280", bg: "#EEF2F6" };
}

function getCustomerLocation(lead) {
  return (
    [lead?.installationAddress?.city, lead?.installationAddress?.state]
      .filter(Boolean)
      .join(", ") || "Location pending"
  );
}

function getLatestQuoteAmount(quotes) {
  return quotes[0]?.pricing?.totalPrice || 0;
}

function formatTimeLeft(value, now) {
  const endsAt = value ? new Date(value).getTime() : 0;
  if (!endsAt) return "Window pending";

  const remainingMs = endsAt - now;
  if (remainingMs <= 0) return "Closed";

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  accent = "#0E56C8",
  chip,
}) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        minHeight: 130,
        borderLeft: `4px solid ${accent}`,
        transition: "transform 0.18s ease",
        "&:hover": { transform: "translateY(-2px)" },
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
            borderRadius: "0.85rem",
            bgcolor: `${accent}18`,
            color: accent,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon sx={{ fontSize: "1.15rem" }} />
        </Box>
        {chip ? (
          <Box
            sx={{
              px: 0.9,
              py: 0.35,
              borderRadius: "999px",
              bgcolor: "#DFF7E8",
              color: "#108A55",
              fontSize: "0.62rem",
              fontWeight: 950,
            }}
          >
            {chip}
          </Box>
        ) : null}
      </Stack>
      <Typography
        sx={{
          mt: 1.3,
          color: "#596579",
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.4,
          color: adminUi.colors.text,
          fontSize: "1.8rem",
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ mt: 0.9, color: "#647387", fontSize: "0.7rem", fontWeight: 700 }}
      >
        {note}
      </Typography>
    </AdminPanel>
  );
}

function StatusPill({ status }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 1.1,
        py: 0.45,
        borderRadius: "999px",
        bgcolor: status.bg,
        color: status.color,
        fontSize: "0.68rem",
        fontWeight: 950,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {status.label}
    </Box>
  );
}

export default function AdminBiddingPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "7",
    bidRange: "all",
  });
  const [now, setNow] = useState(() => Date.now());
  const [acceptingId, setAcceptingId] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const leadFilterId = searchParams.get("leadId");

  useEffect(() => {
    let active = true;

    async function loadBidding() {
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
              "Unable to load bidding activity",
            data: null,
          });
        }
      }
    }

    loadBidding();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const rows = useMemo(() => {
    const leads = state.data?.leads || [];
    const quotes = state.data?.quotes || [];
    const quotesByLead = new Map();

    quotes.forEach((quote) => {
      const leadId = String(quote.leadId);
      const current = quotesByLead.get(leadId) || [];
      current.push(quote);
      quotesByLead.set(leadId, current);
    });

    return leads
      .filter(
        (lead) =>
          ["quote_selected", "closed"].includes(
            lead.status,
          ) || quotesByLead.has(String(lead.id)),
      )
      .map((lead) => {
        const leadQuotes = (quotesByLead.get(String(lead.id)) || []).sort(
          (a, b) =>
            new Date(b.submittedAt || b.createdAt) -
            new Date(a.submittedAt || a.createdAt),
        );
        const status = getLeadStatus(lead, leadQuotes);
        return {
          lead,
          quotes: leadQuotes,
          status,
          bidAmount: getLatestQuoteAmount(leadQuotes),
          biddingEndsAt: lead.biddingEndsAt,
          latestActivityAt:
            leadQuotes[0]?.submittedAt || lead.updatedAt || lead.createdAt,
        };
      });
  }, [state.data]);

  const filteredRows = useMemo(() => {
    const now = Date.now();

    return rows.filter((row) => {
      const matchesStatus =
        filters.status === "all" ||
        row.status.label.toLowerCase() === filters.status;
      const activityAt = new Date(row.latestActivityAt).getTime();
      const matchesDate =
        filters.dateRange === "all" ||
        (!Number.isNaN(activityAt) &&
          now - activityAt <= Number(filters.dateRange) * 86400000);
      const bidCount = row.quotes.length;
      const matchesBidRange =
        filters.bidRange === "all" ||
        (filters.bidRange === "low" && bidCount <= 3) ||
        (filters.bidRange === "medium" && bidCount > 3 && bidCount <= 8) ||
        (filters.bidRange === "high" && bidCount > 8);
      const matchesLead =
        !leadFilterId || String(row.lead.id) === String(leadFilterId);

      return matchesStatus && matchesDate && matchesBidRange && matchesLead;
    });
  }, [rows, filters, leadFilterId]);

  const metrics = useMemo(() => {
    const quotes = state.data?.quotes || [];
    const activeTenders = rows.filter(
      (row) => row.status.label === "Active",
    ).length;
    const bidValue = quotes.reduce(
      (sum, quote) => sum + Number(quote.pricing?.totalPrice || 0),
      0,
    );
    const averageBids = rows.length ? quotes.length / rows.length : 0;

    return {
      activeTenders,
      bidsReceived: quotes.length,
      averageBids: averageBids.toFixed(1),
      bidValue,
    };
  }, [rows, state.data]);

  if (state.loading) return <AdminLoadingState />;

  async function handleAcceptQuote(quote, leadId) {
    if (!quote?.id) return;
    setAcceptingId(quote.id);
    try {
      await quotesApi.acceptQuote(quote.id);
      // Refresh data to reflect new project creation
      const data = await getAdminDashboardData({ force: true });
      setState({ loading: false, error: "", data });
      setToast({
        open: true,
        message: `Quote accepted — project created for lead #${String(leadId).slice(-4).toUpperCase()}.`,
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not accept quote.",
        severity: "error",
      });
    } finally {
      setAcceptingId("");
    }
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Bidding Monitoring"
        subtitle="Track real-time vendor bidding activity and ensure market fairness across all active projects."
        subtitleSx={{ whiteSpace: "nowrap", maxWidth: "none" }}
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
          mb: 3,
        }}
      >
        <StatCard
          title="Total Active Tenders"
          value={metrics.activeTenders}
          note="Currently live for bidding"
          icon={GavelOutlinedIcon}
          chip="+12%"
        />
        <StatCard
          title="Total Bids Received"
          value={metrics.bidsReceived}
          note="Across all active projects"
          icon={TrendingUpRoundedIcon}
          accent="#8A9700"
          chip="New High"
        />
        <StatCard
          title="Avg. Bids per Project"
          value={metrics.averageBids}
          note="Competitive participation"
          icon={Groups2OutlinedIcon}
          accent="#108A55"
          chip="Stable"
        />
        <StatCard
          title="Bidding Value"
          value={formatCompactMoney(metrics.bidValue)}
          note="Cumulative tender estimate"
          icon={AccountBalanceWalletOutlinedIcon}
          chip="+40L"
        />
      </Box>

      {/* Filter bar — pill-style inline */}
      <AdminPanel sx={{ p: { xs: 1.6, md: 2 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
              sx={{
                borderRadius: "999px",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              }}
              renderValue={(v) =>
                `Status: ${v === "all" ? "All Activity" : v.charAt(0).toUpperCase() + v.slice(1)}`
              }
            >
              <MenuItem value="all">All Activity</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="selected">Selected</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={filters.dateRange}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  dateRange: event.target.value,
                }))
              }
              sx={{
                borderRadius: "999px",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              }}
              renderValue={(v) =>
                `Date Range: ${v === "7" ? "Last 7 Days" : v === "30" ? "Last 30 Days" : v === "90" ? "Last 90 Days" : "All Time"}`
              }
            >
              <MenuItem value="7">Last 7 Days</MenuItem>
              <MenuItem value="30">Last 30 Days</MenuItem>
              <MenuItem value="90">Last 90 Days</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filters.bidRange}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  bidRange: event.target.value,
                }))
              }
              sx={{
                borderRadius: "999px",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              }}
              renderValue={(v) =>
                `Bid Range: ${v === "all" ? "All" : v === "low" ? "1-3" : v === "medium" ? "4-8" : "9+"}`
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">1-3 Bids</MenuItem>
              <MenuItem value="medium">4-8 Bids</MenuItem>
              <MenuItem value="high">9+ Bids</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {[
                  "Lead ID",
                  "Customer",
                  "Total Bids",
                  "Bid Amount",
                  "Time Left",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "#738096",
                      fontSize: "0.66rem",
                      fontWeight: 900,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      py: 1.8,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length ? (
                filteredRows.map((row) => (
                  <TableRow
                    key={row.lead.id}
                    hover
                    sx={{
                      bgcolor:
                        leadFilterId &&
                        String(row.lead.id) === String(leadFilterId)
                          ? "#F8FBFF"
                          : "transparent",
                      "& td": { borderColor: "#EEF2F6", py: 2 },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          color: "#0E56C8",
                          fontSize: "0.84rem",
                          fontWeight: 950,
                        }}
                      >
                        {formatLeadId(row.lead.id)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.88rem",
                          fontWeight: 900,
                        }}
                      >
                        {row.lead.contact?.fullName || "Customer"}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#7C8899",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {getCustomerLocation(row.lead)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: adminUi.colors.text,
                        fontSize: "0.88rem",
                        fontWeight: 900,
                      }}
                    >
                      {String(row.quotes.length).padStart(2, "0")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: adminUi.colors.text,
                        fontSize: "0.9rem",
                        fontWeight: 950,
                      }}
                    >
                      {row.bidAmount ? formatMoney(row.bidAmount) : "Pending"}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            formatTimeLeft(row.biddingEndsAt, now) === "Closed"
                              ? "#D94444"
                              : "#223146",
                          fontSize: "0.82rem",
                          fontWeight: 850,
                        }}
                      >
                        {formatTimeLeft(row.biddingEndsAt, now)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusPill status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton
                          component={NavLink}
                          to={`/admin/leads/${row.lead.id}`}
                          size="small"
                          aria-label="View bidding lead"
                          sx={{
                            color: "#0E56C8",
                            bgcolor: "#EEF4FF",
                            borderRadius: "0.6rem",
                            "&:hover": { bgcolor: "#DCE9FF" },
                          }}
                        >
                          <VisibilityOutlinedIcon
                            sx={{ color: "#0E56C8", fontSize: "1rem" }}
                          />
                        </IconButton>
                        {row.quotes.length > 0 &&
                          row.status.label !== "Selected" &&
                          row.status.label !== "Completed" && (
                            <Tooltip title="Accept top quote & create project">
                              <IconButton
                                size="small"
                                disabled={acceptingId === row.quotes[0]?.id}
                                onClick={() =>
                                  handleAcceptQuote(row.quotes[0], row.lead.id)
                                }
                                sx={{
                                  color: "#10985E",
                                  bgcolor: "#DDF8E7",
                                  borderRadius: "0.6rem",
                                  "&:hover": { bgcolor: "#B8EAC8" },
                                }}
                              >
                                <CheckCircleOutlineRoundedIcon
                                  sx={{ fontSize: "1rem" }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <AdminEmptyState
                      title="No bidding activity found"
                      subtitle="Open verified leads for quotes or adjust filters."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ px: 2, py: 1.8, borderTop: "1px solid #EEF2F6" }}
        >
          <Typography
            sx={{ color: "#667386", fontSize: "0.8rem", fontWeight: 700 }}
          >
            Showing 1-{Math.min(10, filteredRows.length)} of{" "}
            {filteredRows.length} active bids
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box
              sx={{
                px: 1.8,
                height: 36,
                borderRadius: "0.7rem",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                color: "#667386",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                "&:hover": { bgcolor: "#F7F9FC" },
              }}
            >
              Previous
            </Box>
            <Box
              sx={{
                px: 1.8,
                height: 36,
                borderRadius: "0.7rem",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                color: "#667386",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                "&:hover": { bgcolor: "#F7F9FC" },
              }}
            >
              Next
            </Box>
          </Stack>
        </Stack>
      </AdminPanel>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            borderRadius: "0.9rem",
            fontWeight: 700,
            boxShadow: "0 12px 28px rgba(16,29,51,0.14)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AdminPageShell>
  );
}

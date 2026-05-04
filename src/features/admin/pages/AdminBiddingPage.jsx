import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
  return `#SPK-${String(leadId || "").slice(-4).toUpperCase()}`;
}

function getLeadStatus(lead, quotes) {
  if (lead?.status === "quote_selected") return { label: "Selected", color: "#0E56C8", bg: "#EAF1FF" };
  if (["closed", "cancelled"].includes(lead?.status)) return { label: "Completed", color: "#657386", bg: "#EEF2F6" };
  if (quotes.length > 0 || lead?.status === "open_for_quotes") return { label: "Active", color: "#687000", bg: "#D7E600" };
  return { label: "Pending", color: "#6B7280", bg: "#EEF2F6" };
}

function getCustomerLocation(lead) {
  return [lead?.installationAddress?.city, lead?.installationAddress?.state].filter(Boolean).join(", ") || "Location pending";
}

function getLatestQuoteAmount(quotes) {
  return quotes[0]?.pricing?.totalPrice || 0;
}

function StatCard({ title, value, note, icon: Icon, accent = "#0E56C8", chip }) {
  return (
    <AdminPanel sx={{ p: 2, minHeight: 126, borderLeft: `4px solid ${accent}` }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ width: 34, height: 34, borderRadius: "0.7rem", bgcolor: `${accent}18`, color: accent, display: "grid", placeItems: "center" }}>
          <Icon sx={{ fontSize: "1.05rem" }} />
        </Box>
        {chip ? (
          <Box sx={{ px: 0.9, py: 0.35, borderRadius: "999px", bgcolor: "#DFF7E8", color: "#108A55", fontSize: "0.62rem", fontWeight: 950 }}>
            {chip}
          </Box>
        ) : null}
      </Stack>
      <Typography sx={{ mt: 1.1, color: "#596579", fontSize: "0.78rem", fontWeight: 750 }}>{title}</Typography>
      <Typography sx={{ mt: 0.35, color: adminUi.colors.text, fontSize: "1.55rem", fontWeight: 950, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ mt: 0.85, color: "#647387", fontSize: "0.67rem", fontWeight: 700 }}>{note}</Typography>
    </AdminPanel>
  );
}

function StatusPill({ status }) {
  return (
    <Box sx={{ display: "inline-flex", px: 0.9, py: 0.4, borderRadius: "999px", bgcolor: status.bg, color: status.color, fontSize: "0.62rem", fontWeight: 950, textTransform: "uppercase" }}>
      {status.label}
    </Box>
  );
}

export default function AdminBiddingPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "7",
    bidRange: "all",
  });

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
            error: error?.response?.data?.message || error.message || "Unable to load bidding activity",
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
      .filter((lead) => ["open_for_quotes", "quote_selected", "closed"].includes(lead.status) || quotesByLead.has(String(lead.id)))
      .map((lead) => {
        const leadQuotes = (quotesByLead.get(String(lead.id)) || []).sort(
          (a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt),
        );
        const status = getLeadStatus(lead, leadQuotes);
        return {
          lead,
          quotes: leadQuotes,
          status,
          bidAmount: getLatestQuoteAmount(leadQuotes),
          latestActivityAt: leadQuotes[0]?.submittedAt || lead.updatedAt || lead.createdAt,
        };
      });
  }, [state.data]);

  const filteredRows = useMemo(() => {
    const now = Date.now();

    return rows.filter((row) => {
      const matchesStatus = filters.status === "all" || row.status.label.toLowerCase() === filters.status;
      const activityAt = new Date(row.latestActivityAt).getTime();
      const matchesDate =
        filters.dateRange === "all" ||
        (!Number.isNaN(activityAt) && now - activityAt <= Number(filters.dateRange) * 86400000);
      const bidCount = row.quotes.length;
      const matchesBidRange =
        filters.bidRange === "all" ||
        (filters.bidRange === "low" && bidCount <= 3) ||
        (filters.bidRange === "medium" && bidCount > 3 && bidCount <= 8) ||
        (filters.bidRange === "high" && bidCount > 8);

      return matchesStatus && matchesDate && matchesBidRange;
    });
  }, [rows, filters]);

  const metrics = useMemo(() => {
    const quotes = state.data?.quotes || [];
    const activeTenders = rows.filter((row) => row.status.label === "Active").length;
    const bidValue = quotes.reduce((sum, quote) => sum + Number(quote.pricing?.totalPrice || 0), 0);
    const averageBids = rows.length ? quotes.length / rows.length : 0;

    return {
      activeTenders,
      bidsReceived: quotes.length,
      averageBids: averageBids.toFixed(1),
      bidValue,
    };
  }, [rows, state.data]);

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Bidding Monitoring"
        subtitle="Track real-time vendor bidding activity and ensure market fairness across all active projects."
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      <Grid container spacing={2.2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Active Tenders" value={metrics.activeTenders} note="Currently live for bidding" icon={GavelOutlinedIcon} chip="+12%" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Bids Received" value={metrics.bidsReceived} note="Across all active projects" icon={TrendingUpRoundedIcon} accent="#8A9700" chip="New High" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Avg. Bids per Project" value={metrics.averageBids} note="Competitive participation" icon={Groups2OutlinedIcon} accent="#108A55" chip="Stable" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Bidding Value" value={formatCompactMoney(metrics.bidValue)} note="Cumulative tender estimate" icon={AccountBalanceWalletOutlinedIcon} chip="+40L" />
        </Grid>
      </Grid>

      <AdminPanel sx={{ p: { xs: 1.5, md: 1.8 }, mb: 2.5, bgcolor: "#F6F8FB" }}>
        <Grid container spacing={1.3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                <MenuItem value="all">All Activity</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="selected">Selected</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select label="Date Range" value={filters.dateRange} onChange={(event) => setFilters((current) => ({ ...current, dateRange: event.target.value }))}>
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Bid Range</InputLabel>
              <Select label="Bid Range" value={filters.bidRange} onChange={(event) => setFilters((current) => ({ ...current, bidRange: event.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="low">1-3 Bids</MenuItem>
                <MenuItem value="medium">4-8 Bids</MenuItem>
                <MenuItem value="high">9+ Bids</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {["Lead ID", "Customer", "Total Bids", "Bid Amount", "Status", "Actions"].map((heading) => (
                  <TableCell key={heading} sx={{ color: "#738096", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", py: 1.6 }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length ? (
                filteredRows.map((row) => (
                  <TableRow key={row.lead.id} hover sx={{ "& td": { borderColor: "#EEF2F6", py: 1.8 } }}>
                    <TableCell>
                      <Typography sx={{ color: "#0E56C8", fontSize: "0.8rem", fontWeight: 950 }}>
                        {formatLeadId(row.lead.id)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 900 }}>
                        {row.lead.contact?.fullName || "Customer"}
                      </Typography>
                      <Typography sx={{ color: "#7C8899", fontSize: "0.64rem", fontWeight: 700 }}>
                        {getCustomerLocation(row.lead)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 900 }}>
                      {String(row.quotes.length).padStart(2, "0")}
                    </TableCell>
                    <TableCell sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 950 }}>
                      {row.bidAmount ? formatMoney(row.bidAmount) : "Pending"}
                    </TableCell>
                    <TableCell><StatusPill status={row.status} /></TableCell>
                    <TableCell>
                      <IconButton component={NavLink} to={`/admin/leads/${row.lead.id}`} size="small" aria-label="View bidding lead">
                        <VisibilityOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <AdminEmptyState title="No bidding activity found" subtitle="Open verified leads for quotes or adjust filters." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ px: 2, py: 1.6, borderTop: "1px solid #EEF2F6" }}>
          <Typography sx={{ color: "#667386", fontSize: "0.78rem", fontWeight: 700 }}>
            Showing {filteredRows.length} of {rows.length} active bids
          </Typography>
        </Stack>
      </AdminPanel>
    </AdminPageShell>
  );
}

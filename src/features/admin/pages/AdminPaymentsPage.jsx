import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Stack,
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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
  AdminPrimaryButton,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import {
  downloadInvoicePdf,
  printInvoiceHtml,
} from "@/shared/invoice/InvoiceTemplate";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const initialInvoiceForm = {
  projectId: "",
  title: "Additional Invoice",
  amount: "",
  dueAt: "",
  method: "bank_transfer",
};

function formatMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function formatCompactMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `INR ${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `INR ${(amount / 100000).toFixed(1)}L`;
  return formatMoney(amount);
}

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusMeta(status) {
  if (status === "paid")
    return { label: "Paid", color: "#10985E", bg: "#DDF8E7" };
  if (status === "failed")
    return { label: "Failed", color: "#D94444", bg: "#FDECEC" };
  if (status === "cancelled")
    return { label: "Cancelled", color: "#6B7280", bg: "#EEF2F6" };
  return { label: "Pending", color: "#6E6900", bg: "#F2F08E" };
}

function formatMethod(method) {
  const labels = {
    upi: "UPI",
    net_banking: "Net Banking",
    card: "Credit Card",
    bank_transfer: "Bank Transfer",
    cash: "Cash",
    not_recorded: "Not Recorded",
  };
  return labels[method] || "Not Recorded";
}

function getPaymentId(payment) {
  return `#PAY-${String(payment.id || payment.invoiceNumber || "")
    .slice(-4)
    .toUpperCase()}`;
}

function getProjectLeadId(payment) {
  const leadId = payment.project?.leadId || payment.quoteId || "";
  return leadId.startsWith("manual:")
    ? "Manual"
    : `#SPK-${String(leadId).slice(-4).toUpperCase()}`;
}

function buildCsv(rows) {
  const headers = [
    "Payment ID",
    "Invoice",
    "Customer",
    "Email",
    "Lead ID",
    "Amount",
    "Status",
    "Method",
    "Date",
  ];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const body = rows.map((payment) =>
    [
      getPaymentId(payment),
      payment.invoiceNumber,
      payment.customer?.fullName,
      payment.customer?.email,
      getProjectLeadId(payment),
      payment.amount,
      payment.status,
      formatMethod(payment.method),
      payment.paidAt || payment.dueAt || payment.createdAt,
    ]
      .map(escape)
      .join(","),
  );
  return [headers.join(","), ...body].join("\n");
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function StatCard({ title, value, note, tone = "#0E56C8", dark = false }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        minHeight: 120,
        borderLeft: dark
          ? "none"
          : `4px solid ${tone === "#1F2C40" ? "#E2E8F0" : tone}`,
        bgcolor: dark ? "#0E56C8" : "#FFFFFF",
        color: dark ? "#FFFFFF" : adminUi.colors.text,
        transition: "transform 0.18s ease",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Typography
        sx={{
          color: dark ? "#CFE0FF" : "#596579",
          fontSize: "0.64rem",
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.8,
          color: dark
            ? "#FFFFFF"
            : tone === "#1F2C40"
              ? adminUi.colors.text
              : tone,
          fontSize: "1.7rem",
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      {note ? (
        <Typography
          sx={{
            mt: 1,
            color: dark ? "#CFE0FF" : "#667386",
            fontSize: "0.72rem",
            fontWeight: 750,
          }}
        >
          {note}
        </Typography>
      ) : null}
    </AdminPanel>
  );
}

function InvoiceDialog({ open, onClose, projects, onSubmit, saving, error }) {
  const [form, setForm] = useState(initialInvoiceForm);

  useEffect(() => {
    if (open) {
      setForm({
        ...initialInvoiceForm,
        projectId: projects[0]?.id || "",
      });
    }
  }, [open, projects]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      projectId: form.projectId,
      title: form.title,
      amount: Number(form.amount),
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null,
      method: form.method,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: adminUi.colors.text, fontWeight: 900 }}>
          New Invoice
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: adminUi.colors.border }}>
          {error ? <AdminErrorState>{error}</AdminErrorState> : null}
          <Stack spacing={1.6}>
            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                label="Project"
                value={form.projectId}
                onChange={(event) =>
                  updateField("projectId", event.target.value)
                }
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.customer?.fullName || "Customer"} -{" "}
                    {project.installationAddress?.city || "Location"} -{" "}
                    {formatMoney(project.pricing?.totalPrice)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              label="Invoice Title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
            <TextField
              required
              fullWidth
              type="number"
              label="Amount"
              value={form.amount}
              onChange={(event) => updateField("amount", event.target.value)}
            />
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={form.dueAt}
              onChange={(event) => updateField("dueAt", event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                label="Payment Method"
                value={form.method}
                onChange={(event) => updateField("method", event.target.value)}
              >
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="net_banking">Net Banking</MenuItem>
                <MenuItem value="card">Credit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="not_recorded">Not Recorded</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            disabled={saving}
            onClick={onClose}
            sx={{ textTransform: "none", fontWeight: 850 }}
          >
            Cancel
          </Button>
          <AdminPrimaryButton
            disabled={saving || !projects.length}
            type="submit"
          >
            {saving ? "Creating..." : "Create Invoice"}
          </AdminPrimaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function AdminPaymentsPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "30",
    region: "all",
    query: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE_PAY = 10;

  async function loadPayments() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const data = await getAdminDashboardData();
      setState({ loading: false, error: "", data });
    } catch (error) {
      setState({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unable to load payments",
        data: null,
      });
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const payments = state.data?.payments || [];
  const projects = state.data?.projects || [];

  const regions = useMemo(
    () => [
      ...new Set(
        projects
          .map((project) => project.installationAddress?.state)
          .filter(Boolean),
      ),
    ],
    [projects],
  );

  const filteredPayments = useMemo(() => {
    const now = Date.now();
    const query = filters.query.trim().toLowerCase();

    return payments.filter((payment) => {
      const projectState = payment.project?.installationAddress?.state;
      const statusMatch =
        filters.status === "all" || payment.status === filters.status;
      const regionMatch =
        filters.region === "all" || projectState === filters.region;
      const dateValue = new Date(
        payment.paidAt || payment.dueAt || payment.createdAt,
      ).getTime();
      const dateMatch =
        filters.dateRange === "all" ||
        (!Number.isNaN(dateValue) &&
          now - dateValue <= Number(filters.dateRange) * 86400000);
      const queryText = [
        getPaymentId(payment),
        payment.invoiceNumber,
        payment.customer?.fullName,
        payment.customer?.email,
        getProjectLeadId(payment),
        payment.project?.installationAddress?.city,
        payment.project?.installationAddress?.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const queryMatch = !query || queryText.includes(query);

      return statusMatch && regionMatch && dateMatch && queryMatch;
    });
  }, [payments, filters]);

  const metrics = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === "paid");
    const pending = payments.filter((payment) => payment.status === "pending");
    const failed = payments.filter((payment) => payment.status === "failed");
    const totalRevenue = paid.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );
    const successRate = payments.length
      ? ((paid.length / payments.length) * 100).toFixed(1)
      : "0.0";

    return {
      totalRevenue,
      pendingCount: pending.length,
      failedCount: failed.length,
      successRate,
    };
  }, [payments]);

  async function handleCreateInvoice(payload) {
    setSaving(true);
    setFormError("");
    try {
      await paymentsApi.createInvoice(payload);
      setDialogOpen(false);
      await loadPayments();
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to create invoice",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid(payment) {
    setActionLoading(payment.id);
    try {
      await paymentsApi.updatePaymentStatus(payment.id, { status: "paid" });
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          payments: (s.data?.payments || []).map((p) =>
            p.id === payment.id
              ? { ...p, status: "paid", paidAt: new Date().toISOString() }
              : p,
          ),
        },
      }));
      setToast({
        open: true,
        message: `${payment.invoiceNumber} marked as paid.`,
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: error?.response?.data?.message || "Could not update payment.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleMarkFailed(payment) {
    setActionLoading(payment.id);
    try {
      await paymentsApi.updatePaymentStatus(payment.id, { status: "failed" });
      setState((s) => ({
        ...s,
        data: {
          ...s.data,
          payments: (s.data?.payments || []).map((p) =>
            p.id === payment.id ? { ...p, status: "failed" } : p,
          ),
        },
      }));
      setToast({
        open: true,
        message: `${payment.invoiceNumber} marked as failed.`,
        severity: "info",
      });
    } catch (error) {
      setToast({
        open: true,
        message: error?.response?.data?.message || "Could not update payment.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Payments"
        subtitle="Monitor platform revenue, track transaction statuses, and manage financial follow-ups."
        actions={
          <>
            <Button
              startIcon={<DownloadRoundedIcon />}
              onClick={() =>
                downloadCsv(
                  `sparkin-payments-${new Date().toISOString().slice(0, 10)}.csv`,
                  buildCsv(filteredPayments),
                )
              }
              sx={{
                minHeight: 40,
                px: 1.7,
                borderRadius: "0.75rem",
                bgcolor: "#EFF3F7",
                color: "#1F2C40",
                fontSize: "0.76rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#E3E9F0" },
              }}
            >
              Export CSV
            </Button>
            <Tooltip title="Refresh">
              <IconButton
                onClick={loadPayments}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "0.85rem",
                  bgcolor: "#EFF3F7",
                  color: "#1F2C40",
                  "&:hover": { bgcolor: "#E3E9F0" },
                }}
              >
                <RefreshRoundedIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Tooltip>
            <AdminPrimaryButton
              startIcon={<AddRoundedIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ minHeight: 44, px: 2.3 }}
            >
              New Invoice
            </AdminPrimaryButton>
          </>
        }
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
          mb: 2.6,
        }}
      >
        <StatCard
          title="Total Revenue"
          value={formatCompactMoney(metrics.totalRevenue)}
          note={`${payments.length} total payments`}
        />
        <StatCard
          title="Pending Payments"
          value={metrics.pendingCount}
          note={`${metrics.failedCount} failed this week`}
          tone="#1F2C40"
        />
        <StatCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          note={`${metrics.failedCount} failed payments`}
          tone="#1F2C40"
        />
        <StatCard
          title="Active Promos"
          value="None"
          note="Promo service not connected"
          dark
        />
      </Box>

      <AdminPanel sx={{ p: { xs: 1.6, md: 2 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", md: "center" }}
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
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
              startAdornment={
                <Box sx={{ mr: 0.5, color: "#8B97A8", fontSize: "0.8rem" }}>
                  ≡
                </Box>
              }
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
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
            >
              <MenuItem value="30">Last 30 Days</MenuItem>
              <MenuItem value="90">Last 90 Days</MenuItem>
              <MenuItem value="365">Last 12 Months</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filters.region}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  region: event.target.value,
                }))
              }
              sx={{
                borderRadius: "999px",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              }}
            >
              <MenuItem value="all">All Regions</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            placeholder="Search ID or Customer..."
            sx={{
              ml: { md: "auto" },
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                bgcolor: "#F7F9FC",
                fontSize: "0.84rem",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "#8B98AA", fontSize: "1rem" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {[
                  "Payment ID",
                  "Customer",
                  "Lead ID",
                  "Amount",
                  "Status",
                  "Method",
                  "Date",
                  "",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "#738096",
                      fontSize: "0.66rem",
                      fontWeight: 900,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      py: 1.6,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.length ? (
                filteredPayments
                  .slice((page - 1) * PAGE_SIZE_PAY, page * PAGE_SIZE_PAY)
                  .map((payment) => {
                    const status = getStatusMeta(payment.status);
                    return (
                      <TableRow
                        key={payment.id}
                        hover
                        sx={{ "& td": { borderColor: "#EEF2F6", py: 2 } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-flex",
                              px: 0.9,
                              py: 0.5,
                              borderRadius: "0.5rem",
                              bgcolor: "#DCE5FF",
                              color: "#0E56C8",
                              fontSize: "0.72rem",
                              fontWeight: 900,
                            }}
                          >
                            {getPaymentId(payment)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: adminUi.colors.text,
                              fontSize: "0.88rem",
                              fontWeight: 900,
                            }}
                          >
                            {payment.customer?.fullName || "Customer"}
                          </Typography>
                          <Typography
                            sx={{ color: "#7C8899", fontSize: "0.7rem" }}
                          >
                            {payment.customer?.email || "No email"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#344155",
                            fontSize: "0.82rem",
                            fontWeight: 750,
                          }}
                        >
                          {getProjectLeadId(payment)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: adminUi.colors.text,
                            fontSize: "0.9rem",
                            fontWeight: 950,
                          }}
                        >
                          {formatMoney(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-flex",
                              px: 0.9,
                              py: 0.4,
                              borderRadius: "999px",
                              bgcolor: status.bg,
                              color: status.color,
                              fontSize: "0.68rem",
                              fontWeight: 900,
                            }}
                          >
                            {status.label}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#344155",
                            fontSize: "0.8rem",
                            fontWeight: 750,
                          }}
                        >
                          {formatMethod(payment.method)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#344155",
                            fontSize: "0.8rem",
                            fontWeight: 750,
                          }}
                        >
                          {formatDate(
                            payment.paidAt ||
                              payment.dueAt ||
                              payment.createdAt,
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              component={NavLink}
                              to={`/admin/payments/${payment.id}`}
                              size="small"
                              aria-label="View payment"
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
                            <Tooltip title="Download Invoice">
                              <IconButton
                                size="small"
                                aria-label="Download invoice"
                                onClick={() => downloadInvoicePdf(payment)}
                                sx={{
                                  color: "#0E56C8",
                                  bgcolor: "#EAF2FF",
                                  borderRadius: "0.6rem",
                                  "&:hover": { bgcolor: "#DCE9FF" },
                                }}
                              >
                                <DownloadRoundedIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Invoice">
                              <IconButton
                                size="small"
                                aria-label="Print invoice"
                                onClick={() => printInvoiceHtml(payment)}
                                sx={{
                                  color: "#1F2C40",
                                  bgcolor: "#EFF3F7",
                                  borderRadius: "0.6rem",
                                  "&:hover": { bgcolor: "#E3E9F0" },
                                }}
                              >
                                <PrintOutlinedIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                            {payment.status === "pending" && (
                              <Tooltip title="Mark as Paid">
                                <IconButton
                                  size="small"
                                  disabled={actionLoading === payment.id}
                                  onClick={() => handleMarkPaid(payment)}
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
                            {(payment.status === "pending" ||
                              payment.status === "paid") && (
                              <Tooltip title="Mark as Failed">
                                <IconButton
                                  size="small"
                                  disabled={actionLoading === payment.id}
                                  onClick={() => handleMarkFailed(payment)}
                                  sx={{
                                    color: "#D94444",
                                    bgcolor: "#FDECEC",
                                    borderRadius: "0.6rem",
                                    "&:hover": { bgcolor: "#FFCFCF" },
                                  }}
                                >
                                  <ErrorOutlineRoundedIcon
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <AdminEmptyState
                      title="No payments found"
                      subtitle="Adjust filters or create an invoice for an active project."
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
            Showing 1-{Math.min(10, filteredPayments.length)} of{" "}
            {filteredPayments.length} payments
          </Typography>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                border: "1px solid #E2E8F0",
                display: "grid",
                placeItems: "center",
                color: "#667386",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ‹
            </Box>
            {[1, 2, 3].map((p) => (
              <Box
                key={p}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "0.6rem",
                  bgcolor: p === 1 ? "#0E56C8" : "#FFFFFF",
                  border: p === 1 ? "none" : "1px solid #E2E8F0",
                  color: p === 1 ? "#FFFFFF" : "#223146",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {p}
              </Box>
            ))}
            <Typography sx={{ color: "#8B97A8", fontSize: "0.8rem", px: 0.3 }}>
              …
            </Typography>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                border: "1px solid #E2E8F0",
                color: "#223146",
                display: "grid",
                placeItems: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {Math.max(1, Math.ceil(filteredPayments.length / 10))}
            </Box>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                border: "1px solid #E2E8F0",
                display: "grid",
                placeItems: "center",
                color: "#667386",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ›
            </Box>
          </Stack>
        </Stack>
      </AdminPanel>

      <InvoiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        projects={projects}
        onSubmit={handleCreateInvoice}
        saving={saving}
        error={formError}
      />

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

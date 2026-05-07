/**
 * AdminPaymentDetailPage
 *
 * Full payment invoice view accessible from the Payments list (/admin/payments/:paymentId).
 * Shows all invoice details, project context, and allows marking paid/failed.
 */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { paymentsApi } from "@/features/public/api/paymentsApi";

// ─── helpers ──────────────────────────────────────────────────────────────────

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    razorpay: "Razorpay",
    cod: "Cash on Delivery",
    not_recorded: "Not Recorded",
  };
  return labels[method] || "Not Recorded";
}

function InfoRow({ label, value }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Typography
        sx={{ color: adminUi.colors.muted, fontSize: "0.82rem", flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: adminUi.colors.text,
          fontSize: "0.84rem",
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {value || "—"}
      </Typography>
    </Stack>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPaymentDetailPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActioning, setIsActioning] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("not_recorded");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const result = await paymentsApi.getPayment(paymentId, { force: true });
      setPayment(result);
      setSelectedMethod(result.method || "not_recorded");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load payment details.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [paymentId]);

  async function handleMarkPaid() {
    setIsActioning(true);
    try {
      const updated = await paymentsApi.updatePaymentStatus(paymentId, {
        status: "paid",
        method: selectedMethod,
      });
      setPayment(updated);
      setToast({
        open: true,
        message: "Payment marked as paid.",
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update payment.",
        severity: "error",
      });
    } finally {
      setIsActioning(false);
    }
  }

  async function handleMarkFailed() {
    setIsActioning(true);
    try {
      const updated = await paymentsApi.updatePaymentStatus(paymentId, {
        status: "failed",
      });
      setPayment(updated);
      setToast({
        open: true,
        message: "Payment marked as failed.",
        severity: "info",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update payment.",
        severity: "error",
      });
    } finally {
      setIsActioning(false);
    }
  }

  if (isLoading) return <AdminLoadingState />;

  if (error) {
    return (
      <AdminPageShell>
        <Button
          onClick={() => navigate("/admin/payments")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 2,
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
          }}
        >
          Back to Payments
        </Button>
        <AdminErrorState>{error}</AdminErrorState>
      </AdminPageShell>
    );
  }

  if (!payment) return null;

  const statusMeta = getStatusMeta(payment.status);
  const project = payment.project;
  const isPending = payment.status === "pending";
  const isPaid = payment.status === "paid";

  return (
    <AdminPageShell>
      {/* Back nav */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Button
          onClick={() => navigate("/admin/payments")}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": {
              bgcolor: "transparent",
              color: adminUi.colors.primary,
            },
          }}
        >
          Back to Payments
        </Button>
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            onClick={load}
            sx={{
              color: adminUi.colors.muted,
              border: "1px solid rgba(225,232,241,0.96)",
              borderRadius: "0.65rem",
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Hero — invoice header */}
      <AdminPanel sx={{ p: { xs: 2, md: 2.8 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              sx={{
                color: adminUi.colors.muted,
                fontSize: "0.68rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 0.5,
              }}
            >
              Invoice
            </Typography>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1.6rem",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              {payment.invoiceNumber}
            </Typography>
            <Typography
              sx={{ mt: 0.5, color: adminUi.colors.muted, fontSize: "0.84rem" }}
            >
              {payment.milestone?.title || "Payment"}
            </Typography>
          </Box>
          <Stack
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            spacing={0.5}
          >
            <Box
              sx={{
                px: 1.2,
                py: 0.5,
                borderRadius: "999px",
                bgcolor: statusMeta.bg,
                color: statusMeta.color,
                fontSize: "0.72rem",
                fontWeight: 900,
              }}
            >
              {statusMeta.label}
            </Box>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "2rem",
                fontWeight: 950,
                lineHeight: 1,
              }}
            >
              {formatMoney(payment.amount)}
            </Typography>
          </Stack>
        </Stack>
      </AdminPanel>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Left — details */}
        <Stack spacing={2.5}>
          {/* Invoice details */}
          <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
            <Typography
              sx={{
                color: "#0E56C8",
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Invoice Details
            </Typography>
            <Stack spacing={1.4}>
              <InfoRow label="Invoice Number" value={payment.invoiceNumber} />
              <InfoRow label="Milestone" value={payment.milestone?.title} />
              <InfoRow label="Amount" value={formatMoney(payment.amount)} />
              <InfoRow
                label="Payment Method"
                value={formatMethod(payment.method)}
              />
              <InfoRow label="Due Date" value={formatDate(payment.dueAt)} />
              <InfoRow
                label="Paid At"
                value={
                  payment.paidAt ? formatDate(payment.paidAt) : "Not yet paid"
                }
              />
              {payment.razorpayOrderId && (
                <InfoRow
                  label="Razorpay Order ID"
                  value={payment.razorpayOrderId}
                />
              )}
              {payment.razorpayPaymentId && (
                <InfoRow
                  label="Razorpay Payment ID"
                  value={payment.razorpayPaymentId}
                />
              )}
            </Stack>
          </AdminPanel>

          {/* Customer details */}
          <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
            <Typography
              sx={{
                color: "#0E56C8",
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Customer
            </Typography>
            <Stack spacing={1.4}>
              <InfoRow label="Name" value={payment.customer?.fullName} />
              <InfoRow label="Email" value={payment.customer?.email} />
              <InfoRow label="Customer ID" value={payment.customerId} />
            </Stack>
          </AdminPanel>

          {/* Project context */}
          {project && (
            <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
              <Typography
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 2,
                }}
              >
                Project Context
              </Typography>
              <Stack spacing={1.4}>
                <InfoRow label="Project ID" value={project.id} />
                <InfoRow
                  label="System Size"
                  value={
                    project.system?.sizeKw
                      ? `${project.system.sizeKw} kW`
                      : null
                  }
                />
                <InfoRow label="Panel Type" value={project.system?.panelType} />
                <InfoRow
                  label="Total Project Value"
                  value={formatMoney(project.pricing?.totalPrice)}
                />
                <InfoRow
                  label="Installation Address"
                  value={[
                    project.installationAddress?.city,
                    project.installationAddress?.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
                <InfoRow
                  label="Project Status"
                  value={project.status?.replaceAll("_", " ")}
                />
              </Stack>
            </AdminPanel>
          )}
        </Stack>

        {/* Right — actions */}
        <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
          <AdminPanel sx={{ p: 2.4 }}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
                mb: 2,
              }}
            >
              Update Payment
            </Typography>

            {/* Current status */}
            <Box
              sx={{
                mb: 2,
                p: 1.4,
                borderRadius: "0.85rem",
                bgcolor: statusMeta.bg,
                border: `1px solid ${statusMeta.color}30`,
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: statusMeta.color,
                  }}
                />
                <Typography
                  sx={{
                    color: statusMeta.color,
                    fontSize: "0.82rem",
                    fontWeight: 900,
                  }}
                >
                  {statusMeta.label}
                </Typography>
              </Stack>
            </Box>

            {isPending && (
              <>
                <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    label="Payment Method"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  >
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="net_banking">Net Banking</MenuItem>
                    <MenuItem value="card">Credit Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="not_recorded">Not Recorded</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    isActioning ? (
                      <CircularProgress size={14} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      <CheckCircleOutlineRoundedIcon />
                    )
                  }
                  onClick={handleMarkPaid}
                  disabled={isActioning}
                  sx={{
                    minHeight: 48,
                    borderRadius: "0.9rem",
                    bgcolor: "#10985E",
                    fontSize: "0.88rem",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(16,152,94,0.22)",
                    mb: 1.2,
                    "&:hover": { bgcolor: "#0D7A4C" },
                  }}
                >
                  {isActioning ? "Processing…" : "Mark as Paid"}
                </Button>
              </>
            )}

            {(isPending || isPaid) && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ErrorOutlineRoundedIcon />}
                onClick={handleMarkFailed}
                disabled={isActioning}
                sx={{
                  minHeight: 44,
                  borderRadius: "0.9rem",
                  borderColor: "#D94444",
                  color: "#D94444",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  textTransform: "none",
                  bgcolor: "#FFF8F8",
                  "&:hover": { bgcolor: "#FDECEC" },
                }}
              >
                Mark as Failed
              </Button>
            )}

            {!isPending && !isPaid && (
              <Typography
                sx={{
                  color: adminUi.colors.muted,
                  fontSize: "0.82rem",
                  textAlign: "center",
                }}
              >
                No actions available for {statusMeta.label.toLowerCase()}{" "}
                payments.
              </Typography>
            )}

            <Divider sx={{ my: 2, borderColor: "rgba(225,232,241,0.96)" }} />

            <Stack spacing={1.2}>
              {[
                {
                  label: "Payment ID",
                  value: payment.id?.slice(-8).toUpperCase(),
                },
                {
                  label: "Quote ID",
                  value: payment.quoteId?.slice(-8).toUpperCase(),
                },
                {
                  label: "Vendor ID",
                  value: payment.vendorId?.slice(-8).toUpperCase(),
                },
                { label: "Created", value: formatDate(payment.createdAt) },
              ].map(({ label, value }) => (
                <Stack
                  key={label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.78rem",
                      fontWeight: 800,
                    }}
                  >
                    {value || "—"}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </AdminPanel>
        </Stack>
      </Box>

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

import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { paymentsApi } from "@/features/vendor/api/paymentsApi";
import invoiceBannerPlaceholder from "@/shared/assets/images/vendor/payments/invoice-banner-placeholder.png";

const summaryStats = [
  ["Invoice ID", "Not available"],
  ["Issued Date", "Not available"],
  ["Status", "Not available"],
];

const customerRows = [
  ["Full Name", "Not available"],
  ["Email", "Not available"],
  ["Customer ID", "Not available"],
];

const paymentRows = [
  ["Method", "Not available"],
  ["Transaction ID", "Not available"],
  ["Date", "Not available"],
];

const projectRows = [
  ["Project ID", "Not available"],
  ["Milestone", "Not available"],
  ["System Size", "Not available"],
  ["Location", "Not available"],
];

const invoiceRows = [
  ["Milestone Amount", "Not available"],
  ["GST Estimate (18%)", "Not available"],
  ["Invoice Total", "Not available"],
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function downloadFile(fileName, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getPaymentView(payment) {
  if (!payment) {
    return null;
  }

  const amount = formatPrice(payment.amount);
  const gstEstimate = Math.round(payment.amount * 0.18);
  const baseEstimate = payment.amount - gstEstimate;

  return {
    summaryStats: [
      ["Invoice ID", payment.invoiceNumber],
      ["Issued Date", formatDate(payment.createdAt)],
      ["Status", payment.status.replaceAll("_", " ")],
    ],
    customerRows: [
      ["Full Name", payment.customer.fullName],
      ["Email", payment.customer.email || "Email not provided"],
      ["Customer ID", payment.customerId],
    ],
    paymentRows: [
      ["Method", payment.status === "paid" ? "Recorded payment" : "Pending collection"],
      ["Transaction ID", payment.id],
      ["Date", formatDateTime(payment.paidAt || payment.dueAt)],
    ],
    projectRows: [
      ["Project ID", payment.projectId],
      ["Milestone", payment.milestone.title],
      ["System Size", payment.project?.system?.sizeKw ? `${payment.project.system.sizeKw} kW` : "Not available"],
      ["Location", [payment.project?.installationAddress?.city, payment.project?.installationAddress?.state].filter(Boolean).join(", ") || "Not available"],
    ],
    invoiceRows: [
      ["Milestone Amount", formatPrice(baseEstimate)],
      ["GST Estimate (18%)", formatPrice(gstEstimate)],
      ["Invoice Total", amount],
    ],
    totalAmount: amount,
  };
}

function InfoCard({ icon, title, rows, dark }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "1.2rem",
        bgcolor: dark ? "#0E56C8" : "#FFFFFF",
        color: dark ? "#FFFFFF" : "#223146",
        border: dark ? "none" : "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack
        direction="row"
        spacing={0.8}
        alignItems="center"
        sx={{ mb: 1.35 }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "0.8rem",
            bgcolor: dark ? "rgba(255,255,255,0.14)" : "#EEF4FF",
            color: dark ? "#FFFFFF" : "#0E56C8",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: "0.96rem", fontWeight: 800 }}>
          {title}
        </Typography>
      </Stack>

      <Stack spacing={1.1}>
        {rows.map(([label, value]) => (
          <Stack
            key={label}
            direction="row"
            justifyContent="space-between"
            spacing={1.2}
          >
            <Typography
              sx={{
                color: dark ? "rgba(255,255,255,0.74)" : "#6F7D8F",
                fontSize: "0.76rem",
                lineHeight: 1.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                color: dark ? "#FFFFFF" : "#223146",
                fontSize: "0.76rem",
                fontWeight: 700,
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function VendorInvoiceDetailPage() {
  const { invoiceId } = useParams();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const paymentView = useMemo(() => getPaymentView(payment), [payment]);
  const displaySummaryStats = paymentView?.summaryStats ?? summaryStats;
  const displayCustomerRows = paymentView?.customerRows ?? customerRows;
  const displayPaymentRows = paymentView?.paymentRows ?? paymentRows;
  const displayProjectRows = paymentView?.projectRows ?? projectRows;
  const displayInvoiceRows = paymentView?.invoiceRows ?? invoiceRows;
  const displayVerifiedDate = formatDate(payment?.paidAt || payment?.updatedAt || payment?.createdAt);
  const displaySystemCapacity = payment?.project?.system?.sizeKw
    ? `${payment.project.system.sizeKw} kW System Capacity`
    : "System capacity pending";
  const displayTotalAmount = paymentView?.totalAmount ?? "Not available";

  function buildInvoiceCsv() {
    const rows = [
      ["Invoice Summary"],
      ...displaySummaryStats,
      [],
      ["Customer Information"],
      ...displayCustomerRows,
      [],
      ["Payment Summary"],
      ...displayPaymentRows,
      [],
      ["Project Details"],
      ...displayProjectRows,
      [],
      ["Invoice Breakdown"],
      ...displayInvoiceRows,
      ["Total", displayTotalAmount],
    ];

    return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  }

  function downloadInvoice() {
    downloadFile(`${payment?.invoiceNumber || invoiceId || "sparkin-invoice"}.csv`, buildInvoiceCsv());
  }

  function shareInvoice() {
    const text = `${payment?.invoiceNumber || "Invoice"} - ${displayTotalAmount}`;
    if (navigator.share) {
      navigator.share({ title: "Sparkin invoice", text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${text} ${window.location.href}`);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadPayment() {
      setIsLoading(true);
      setError("");

      try {
        const result = await paymentsApi.getPayment(invoiceId);
        if (active) setPayment(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load invoice.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPayment();

    return () => {
      active = false;
    };
  }, [invoiceId]);

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        component={RouterLink}
        to="/vendor/payments/transactions"
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
        sx={{
          mb: 2.2,
          px: 0,
          minHeight: 28,
          color: "#556478",
          fontSize: "0.78rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Transactions
      </Button>

      {isLoading ? (
        <Box sx={{ py: 4, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: 2.2 }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Invoice Details
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              maxWidth: 360,
            }}
          >
            Transaction overview for completed solar installation.
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.9} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<ShareOutlinedIcon />}
            onClick={shareInvoice}
            sx={{
              minHeight: 38,
              px: 1.35,
              borderRadius: "0.95rem",
              borderColor: "rgba(208,216,226,0.95)",
              bgcolor: "#FFFFFF",
              color: "#223146",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            onClick={() => window.print()}
            sx={{
              minHeight: 38,
              px: 1.35,
              borderRadius: "0.95rem",
              borderColor: "rgba(208,216,226,0.95)",
              bgcolor: "#FFFFFF",
              color: "#223146",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            onClick={downloadInvoice}
            disabled={!payment}
            sx={{
              minHeight: 38,
              px: 1.5,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Download Invoice
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          p: 1.6,
          borderRadius: "1.35rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          mb: 1.7,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          {displaySummaryStats.map(([label, value]) => (
            <Box key={label}>
              <Typography
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
              {label === "Status" ? (
                <Box
                  sx={{
                    mt: 1.02,
                    display: "inline-flex",
                    px: 0.9,
                    py: 0.36,
                    borderRadius: "999px",
                    bgcolor: "#5AE56F",
                    color: "#1C6E2A",
                    fontSize: "0.64rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Box>
              ) : (
                <Typography
                  sx={{
                    mt: 0.95,
                    color: "#223146",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {value}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 1.8 }}>
          <Typography
            sx={{
              color: "#8B97A8",
              fontSize: "0.56rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total Amount Paid
          </Typography>
          <Typography
            sx={{
              mt: 0.85,
              color: "#0E56C8",
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {displayTotalAmount}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 1.6,
          mb: 1.6,
        }}
      >
        <InfoCard
          icon={<PersonOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Customer Information"
          rows={displayCustomerRows}
        />
        <InfoCard
          icon={<PaymentsOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Payment Summary"
          rows={displayPaymentRows}
          dark
        />
        <InfoCard
          icon={<ConstructionOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
          title="Project Details"
          rows={displayProjectRows}
        />

        <Box
          sx={{
            p: 1.5,
            borderRadius: "1.2rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{ mb: 1.35 }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.8rem",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ReceiptLongOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
            <Typography
              sx={{ color: "#223146", fontSize: "0.96rem", fontWeight: 800 }}
            >
              Invoice Breakdown
            </Typography>
          </Stack>

          <Stack spacing={1.05}>
            {displayInvoiceRows.map(([label, value]) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                spacing={1.2}
              >
                <Typography sx={{ color: "#6F7D8F", fontSize: "0.76rem" }}>
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: "#223146",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                  }}
                >
                  {value}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box
            sx={{
              mt: 1.35,
              pt: 1.2,
              borderTop: "1px solid rgba(231,236,242,0.96)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1.2}>
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                Total Paid
              </Typography>
              <Typography
                sx={{
                  color: "#223146",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                {displayTotalAmount}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "1.4rem",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Box
          component="img"
          src={invoiceBannerPlaceholder}
          alt="Invoice solar installation banner placeholder"
          sx={{
            display: "block",
            width: "100%",
            height: { xs: 180, md: 210 },
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: { xs: 18, md: 24 },
            bottom: { xs: 18, md: 22 },
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1rem", md: "1.35rem" },
              fontWeight: 800,
            }}
          >
            System is Active & Delivering Power
          </Typography>
          <Typography
            sx={{
              mt: 0.35,
              color: "rgba(255,255,255,0.78)",
              fontSize: "0.72rem",
              lineHeight: 1.5,
            }}
          >
            Installation verified and certified on {displayVerifiedDate}.
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: { xs: 14, md: 18 },
            bottom: { xs: 14, md: 18 },
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.1,
            py: 0.55,
            borderRadius: "999px",
            bgcolor: "#E7F318",
            color: "#4D5800",
            fontSize: "0.68rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: "#FFF36A",
              display: "grid",
              placeItems: "center",
              fontSize: "0.72rem",
            }}
          >
            ⚡
          </Box>
          {displaySystemCapacity}
        </Box>
      </Box>
    </Box>
  );
}

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  InputBase,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { paymentsApi } from "@/features/vendor/api/paymentsApi";
import { useSocket } from "@/shared/websocket/SocketProvider";
import { downloadInvoicePdf } from "@/shared/invoice/InvoiceTemplate";
import {
  VendorEmptyState,
  VendorFilterPanel,
  VendorPageHeader,
  VendorPageShell,
  VendorPanel,
} from "@/features/vendor/components/VendorPortalUI";

const columns = [
  "Transaction ID",
  "Customer",
  "Project",
  "Amount",
  "Payment Method",
  "Status",
  "Date",
  "Actions",
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name) {
  return (name || "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusStyle(status) {
  if (status === "paid")
    return { label: "Paid", tone: "#239654", bg: "#DDF8E7" };
  if (status === "failed")
    return { label: "Failed", tone: "#D74C4C", bg: "#FDECEC" };
  return { label: "Pending", tone: "#726C00", bg: "#F2F08E" };
}

function toTransaction(payment) {
  const status = getStatusStyle(payment.status);
  return {
    id: payment.id,
    invoiceNumber: payment.invoiceNumber,
    initials: getInitials(payment.customer.fullName),
    name: payment.customer.fullName,
    email: payment.customer.email || "Email not provided",
    project: payment.milestone.title,
    amount: formatPrice(payment.amount),
    method:
      payment.status === "paid" ? "Recorded payment" : "Pending collection",
    status: status.label,
    statusTone: status.tone,
    statusBg: status.bg,
    rawStatus: payment.status,
    date: formatDate(payment.paidAt || payment.dueAt),
    payment,
  };
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

const pageSize = 8;

export default function VendorTransactionsPage() {
  const location = useLocation();
  const { refreshKey } = useSocket();
  const [payments, setPayments] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      setIsLoading(true);
      setError("");
      try {
        const result = await paymentsApi.listPayments();
        if (active) {
          setPayments(result);
          setPage(1);
        }
      } catch (apiError) {
        if (active)
          setError(
            apiError?.response?.data?.message || "Could not load transactions.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPayments();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    if (incomingSearch) {
      setQuery(incomingSearch);
      setPage(1);
    }
  }, [location.state]);

  const transactionRows = useMemo(
    () => payments.map(toTransaction),
    [payments],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactionRows.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.rawStatus === statusFilter;
      const matchesQuery =
        !q ||
        [item.invoiceNumber, item.name, item.email, item.project, item.id].some(
          (v) =>
            String(v || "")
              .toLowerCase()
              .includes(q),
        );
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, transactionRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const firstVisible = filteredRows.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisible = filteredRows.length
    ? firstVisible + visibleRows.length - 1
    : 0;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  const paidTotal = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeProjectCount = new Set(
    payments.map((p) => String(p.projectId)).filter(Boolean),
  ).size;

  const totalProjectCount = new Set(
    payments.map((p) => String(p.projectId)).filter(Boolean),
  ).size;

  // Progress toward total projects that have been fully paid
  const fullyPaidProjectIds = new Set(
    payments
      .filter((p) => p.status === "paid")
      .map((p) => String(p.projectId))
      .filter(Boolean),
  );
  const projectProgressPct =
    totalProjectCount > 0
      ? Math.round((fullyPaidProjectIds.size / totalProjectCount) * 100)
      : 0;

  function exportTransactions() {
    const rows = [
      ["Invoice", "Customer", "Email", "Project", "Amount", "Status", "Date"],
      ...filteredRows.map((item) => [
        item.invoiceNumber,
        item.name,
        item.email,
        item.project,
        item.amount,
        item.status,
        item.date,
      ]),
    ];
    downloadFile(
      `sparkin-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      rows.map((row) => row.map(csvEscape).join(",")).join("\n"),
    );
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Transactions"
        subtitle="View and manage all your payment transactions"
      />

      {/* Filter bar */}
      <VendorFilterPanel sx={{ mt: 0, p: 1.35, borderRadius: "1.2rem" }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", lg: "flex-end" }}
        >
          {/* Search */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                mb: 0.55,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Search Customer
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.7}
              sx={{
                minHeight: 44,
                px: 1.3,
                borderRadius: "0.9rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <SearchRoundedIcon sx={{ color: "#9AA5B5", fontSize: "1rem" }} />
              <InputBase
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, email, or invoice ID..."
                sx={{
                  flex: 1,
                  color: "#223146",
                  fontSize: "0.82rem",
                  "& input": { p: 0 },
                }}
              />
            </Stack>
          </Box>

          {/* Status select */}
          <Box sx={{ minWidth: 180 }}>
            <Typography
              sx={{
                mb: 0.55,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Status
            </Typography>
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: "0.9rem",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.82rem",
                },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Export button */}
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={exportTransactions}
            disabled={filteredRows.length === 0}
            sx={{
              minHeight: 44,
              px: 2.2,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 8px 20px rgba(14,86,200,0.18)",
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "none",
              whiteSpace: "nowrap",
              alignSelf: "flex-end",
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </VendorFilterPanel>

      {/* Table */}
      <VendorPanel
        sx={{ mt: 1.7, borderRadius: "1.55rem", overflow: "hidden" }}
      >
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            px: 1.7,
            pt: 1.8,
            pb: 1.1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "0.95fr 1.28fr 0.88fr 0.78fr 0.98fr 0.7fr 0.68fr 0.56fr",
              gap: 1,
            }}
          >
            {columns.map((col) => (
              <Typography
                key={col}
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {col}
              </Typography>
            ))}
          </Box>
        </Box>

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 1.7 }, pb: 1.1 }}>
          {isLoading && (
            <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && (
            <Box sx={{ py: 1.4 }}>
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {error}
              </Alert>
            </Box>
          )}

          {!isLoading && !error && filteredRows.length === 0 && (
            <Box sx={{ py: 2.2 }}>
              <VendorEmptyState
                title="No payment transactions yet"
                subtitle="Transactions will appear once project milestone payments are recorded."
              />
            </Box>
          )}

          {visibleRows.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.6, md: 2 },
              }}
            >
              {/* Desktop row */}
              <Box
                sx={{
                  display: { xs: "none", lg: "grid" },
                  gridTemplateColumns:
                    "0.95fr 1.28fr 0.88fr 0.78fr 0.98fr 0.7fr 0.68fr 0.56fr",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {item.invoiceNumber}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#EEF2F8",
                      color: "#667388",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    {item.initials}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.74rem" }}
                    >
                      {item.email}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  sx={{
                    color: "#5E6A7D",
                    fontSize: "0.82rem",
                    lineHeight: 1.45,
                  }}
                >
                  {item.project}
                </Typography>
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                  }}
                >
                  {item.amount}
                </Typography>
                <Typography
                  sx={{
                    color: "#5E6A7D",
                    fontSize: "0.82rem",
                    lineHeight: 1.45,
                  }}
                >
                  {item.method}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 1,
                    py: 0.4,
                    borderRadius: "999px",
                    bgcolor: item.statusBg,
                    color: item.statusTone,
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {item.status}
                </Box>
                <Typography sx={{ color: "#5E6A7D", fontSize: "0.82rem" }}>
                  {item.date}
                </Typography>
                <Stack direction="row" spacing={0.2} alignItems="center">
                  <Button
                    component={RouterLink}
                    to={`/vendor/payments/transactions/${item.id}`}
                    sx={{
                      minWidth: 28,
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: "50%",
                      color: "#0E56C8",
                    }}
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </Button>
                  <Button
                    onClick={() => downloadInvoicePdf(item.payment)}
                    sx={{
                      minWidth: 28,
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: "50%",
                      color: "#0E56C8",
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: "0.92rem" }} />
                  </Button>
                </Stack>
              </Box>

              {/* Mobile card */}
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={1.05}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography
                      sx={{
                        color: "#0E56C8",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                      }}
                    >
                      {item.invoiceNumber}
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.4,
                        borderRadius: "999px",
                        bgcolor: item.statusBg,
                        color: item.statusTone,
                        fontSize: "0.66rem",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {item.status}
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#EEF2F8",
                        color: "#667388",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                      }}
                    >
                      {item.initials}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.7rem" }}
                      >
                        {item.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {[
                      ["Project", item.project],
                      ["Amount", item.amount],
                      ["Method", item.method],
                      ["Date", item.date],
                    ].map(([label, value]) => (
                      <Box key={label}>
                        <Typography
                          sx={{
                            color: "#98A3B2",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.22,
                            color: label === "Amount" ? "#18253A" : "#223146",
                            fontSize: "0.75rem",
                            fontWeight: label === "Amount" ? 800 : 600,
                            lineHeight: 1.45,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Stack direction="row" spacing={0.35}>
                    <Button
                      component={RouterLink}
                      to={`/vendor/payments/transactions/${item.id}`}
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        p: 0,
                        borderRadius: "50%",
                        color: "#0E56C8",
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                    </Button>
                    <Button
                      onClick={() => downloadInvoicePdf(item.payment)}
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        p: 0,
                        borderRadius: "50%",
                        color: "#0E56C8",
                      }}
                    >
                      <DownloadRoundedIcon sx={{ fontSize: "0.92rem" }} />
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Pagination */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.4}
          sx={{
            px: { xs: 1.2, md: 1.7 },
            py: 1.25,
            borderTop: "1px solid rgba(234,239,245,0.95)",
          }}
        >
          <Typography
            sx={{ color: "#738094", fontSize: "0.72rem", fontWeight: 500 }}
          >
            Showing{" "}
            {firstVisible === 0 ? "0" : `${firstVisible} to ${lastVisible}`} of{" "}
            {filteredRows.length} transactions
          </Typography>
          <Stack direction="row" spacing={0.45} alignItems="center">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
            {pageNumbers.map((n, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev && n - prev > 1;
              return (
                <Box
                  key={n}
                  sx={{ display: "flex", alignItems: "center", gap: 0.45 }}
                >
                  {showEllipsis && (
                    <Typography
                      sx={{ color: "#8B97A8", fontSize: "0.72rem", px: 0.2 }}
                    >
                      …
                    </Typography>
                  )}
                  <Button
                    onClick={() => setPage(n)}
                    sx={{
                      minWidth: 30,
                      width: 30,
                      height: 30,
                      borderRadius: "0.6rem",
                      p: 0,
                      color: n === page ? "#FFFFFF" : "#223146",
                      bgcolor: n === page ? "#0E56C8" : "#FFFFFF",
                      border:
                        n === page
                          ? "none"
                          : "1px solid rgba(225,232,241,0.96)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {n}
                  </Button>
                </Box>
              );
            })}
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
          </Stack>
        </Stack>
      </VendorPanel>

      {/* Summary cards */}
      <Box
        sx={{
          mt: 1.8,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 1.5,
        }}
      >
        {/* Total revenue */}
        <Box
          sx={{
            p: { xs: 2, md: 2.2 },
            borderRadius: "1.3rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.64rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total Revenue
          </Typography>
          <Typography
            sx={{
              mt: 0.9,
              fontSize: "2.2rem",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {formatPrice(paidTotal)}
          </Typography>
          <Box
            sx={{
              mt: 1.2,
              display: "inline-flex",
              px: 0.85,
              py: 0.34,
              borderRadius: "999px",
              bgcolor: "rgba(153,255,186,0.2)",
              color: "#9AF39D",
              fontSize: "0.68rem",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            Live total
          </Box>
        </Box>

        {/* Active projects — data-driven progress */}
        <Box
          sx={{
            p: { xs: 2, md: 2.2 },
            borderRadius: "1.3rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Typography
            sx={{
              color: "#7D8797",
              fontSize: "0.64rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Active Projects
          </Typography>
          <Typography
            sx={{
              mt: 0.9,
              color: "#18253A",
              fontSize: "2.2rem",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {activeProjectCount}
          </Typography>
          <Box
            sx={{
              mt: 1.2,
              height: 5,
              borderRadius: "999px",
              bgcolor: "#E6EBF2",
            }}
          >
            <Box
              sx={{
                width: `${projectProgressPct}%`,
                height: "100%",
                borderRadius: "inherit",
                bgcolor: "#D3E717",
                transition: "width 0.4s ease",
              }}
            />
          </Box>
          <Typography sx={{ mt: 0.7, color: "#6F7D8F", fontSize: "0.78rem" }}>
            {fullyPaidProjectIds.size} of {totalProjectCount} fully paid
          </Typography>
        </Box>

        {/* Export — real action */}
        <Box
          sx={{
            p: { xs: 2, md: 2.2 },
            borderRadius: "1.3rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Typography
            sx={{
              color: "#7D8797",
              fontSize: "0.64rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Export
          </Typography>
          <Stack spacing={0.8} sx={{ mt: 1.2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={exportTransactions}
              sx={{
                p: 0.95,
                borderRadius: "0.9rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(232,237,244,0.96)",
                cursor: "pointer",
                "&:hover": { bgcolor: "#EEF4FF" },
              }}
            >
              <Typography
                sx={{ color: "#223146", fontSize: "0.84rem", fontWeight: 700 }}
              >
                All Transactions ({filteredRows.length})
              </Typography>
              <DownloadRoundedIcon
                sx={{ color: "#0E56C8", fontSize: "1.05rem" }}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => {
                const paidRows = transactionRows.filter(
                  (r) => r.rawStatus === "paid",
                );
                const rows = [
                  ["Invoice", "Customer", "Email", "Project", "Amount", "Date"],
                  ...paidRows.map((r) => [
                    r.invoiceNumber,
                    r.name,
                    r.email,
                    r.project,
                    r.amount,
                    r.date,
                  ]),
                ];
                downloadFile(
                  `sparkin-paid-${new Date().toISOString().slice(0, 10)}.csv`,
                  rows.map((row) => row.map(csvEscape).join(",")).join("\n"),
                );
              }}
              sx={{
                p: 0.95,
                borderRadius: "0.9rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(232,237,244,0.96)",
                cursor: "pointer",
                "&:hover": { bgcolor: "#EEF4FF" },
              }}
            >
              <Typography
                sx={{ color: "#223146", fontSize: "0.84rem", fontWeight: 700 }}
              >
                Paid Only (
                {transactionRows.filter((r) => r.rawStatus === "paid").length})
              </Typography>
              <DownloadRoundedIcon
                sx={{ color: "#0E56C8", fontSize: "1.05rem" }}
              />
            </Stack>
          </Stack>
        </Box>
      </Box>
    </VendorPageShell>
  );
}

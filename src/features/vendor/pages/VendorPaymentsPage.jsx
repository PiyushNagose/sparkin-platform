import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { paymentsApi } from "@/features/vendor/api/paymentsApi";
import {
  VendorPageHeader,
  VendorPageShell,
  VendorPrimaryButton,
  VendorSecondaryButton,
} from "@/features/vendor/components/VendorPortalUI";

const kpiCards = [
  {
    label: "Total Earnings",
    value: "\u20B912,85,000",
    delta: "+12%",
    tone: "#4F89FF",
    bg: "#EEF4FF",
    icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Pending Payments",
    value: "\u20B93,15,000",
    note: "4 Active",
    tone: "#8B8600",
    bg: "#F5F1CB",
    icon: <PaymentsOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Paid Out",
    value: "\u20B99,70,000",
    note: "All clear",
    tone: "#239654",
    bg: "#E8FAEF",
    icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Monthly Earnings",
    value: "\u20B92,45,000",
    delta: "+5.2%",
    tone: "#8B8600",
    bg: "#F5F1CB",
    icon: <CalendarTodayOutlinedIcon sx={{ fontSize: "0.92rem" }} />,
  },
];

const chartBars = [
  { month: "May", height: 54, tone: "#DEE7F7" },
  { month: "Jun", height: 76, tone: "#C7D7F1" },
  { month: "Jul", height: 62, tone: "#B9CDED" },
  { month: "Aug", height: 98, tone: "#A8C0E7" },
  { month: "Sep", height: 118, tone: "#7E9FD5" },
  { month: "Oct", height: 106, tone: "#0E56C8" },
];

const columns = ["Customer", "Project", "Amount", "Status", "Date", "Action"];

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

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusStyle(status) {
  if (status === "paid") {
    return { label: "Paid", tone: "#239654", bg: "#DDF8E7" };
  }

  if (status === "failed") {
    return { label: "Failed", tone: "#D74C4C", bg: "#FDECEC" };
  }

  return { label: "Pending", tone: "#6E6900", bg: "#F2F08E" };
}

function toTransaction(payment) {
  const status = getStatusStyle(payment.status);

  return {
    id: payment.id,
    initials: getInitials(payment.customer.fullName),
    name: payment.customer.fullName,
    project: payment.project?.system?.sizeKw ? `${payment.milestone.title} - ${payment.project.system.sizeKw} kW` : payment.milestone.title,
    amount: formatPrice(payment.amount),
    status: status.label,
    statusTone: status.tone,
    statusBg: status.bg,
    date: formatDate(payment.paidAt || payment.dueAt),
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

function buildStatement(payments) {
  const rows = [
    ["Invoice", "Customer", "Project", "Milestone", "Amount", "Status", "Due Date", "Paid Date"],
    ...payments.map((payment) => [
      payment.invoiceNumber,
      payment.customer?.fullName,
      payment.project?.id || payment.projectId,
      payment.milestone?.title,
      payment.amount,
      payment.status,
      payment.dueAt,
      payment.paidAt,
    ]),
  ];

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function buildChartBars(payments) {
  const monthTotals = new Map();
  const formatter = new Intl.DateTimeFormat("en-IN", { month: "short" });

  payments
    .filter((payment) => payment.status === "paid")
    .forEach((payment) => {
      const date = new Date(payment.paidAt || payment.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthTotals.set(key, {
        month: formatter.format(date),
        total: (monthTotals.get(key)?.total || 0) + payment.amount,
        time: date.getTime(),
      });
    });

  const totals = [...monthTotals.values()].sort((a, b) => a.time - b.time).slice(-6);
  const max = Math.max(...totals.map((item) => item.total), 1);

  return totals.length
    ? totals.map((item, index) => ({
        month: item.month,
        height: Math.max(22, Math.round((item.total / max) * 118)),
        tone: index === totals.length - 1 ? "#0E56C8" : "#A8C0E7",
      }))
    : chartBars;
}

function KpiCard({ card }) {
  return (
    <Box
      sx={{
        p: 1.65,
        minHeight: 106,
        borderRadius: "1.15rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "0.78rem",
            bgcolor: card.bg,
            color: card.tone,
            display: "grid",
            placeItems: "center",
          }}
        >
          {card.icon}
        </Box>
        {card.delta ? (
          <Typography sx={{ color: "#239654", fontSize: "0.58rem", fontWeight: 800 }}>
            {card.delta}
          </Typography>
        ) : card.note ? (
          <Typography sx={{ color: "#778597", fontSize: "0.58rem", fontWeight: 700 }}>
            {card.note}
          </Typography>
        ) : null}
      </Stack>

      <Typography
        sx={{
          mt: 1.15,
          color: "#6F7D8F",
          fontSize: "0.76rem",
          fontWeight: 500,
        }}
      >
        {card.label}
      </Typography>
      <Typography
        sx={{
          mt: 0.35,
          color: "#18253A",
          fontSize: "1.82rem",
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        {card.value}
      </Typography>
    </Box>
  );
}

export default function VendorPaymentsPage() {
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      setIsLoading(true);
      setError("");

      try {
        const result = await paymentsApi.listPayments();
        if (active) setPayments(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load payments.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    setSearchTerm(incomingSearch);
  }, [location.state]);

  const transactions = useMemo(() => payments.map(toTransaction), [payments]);
  const paidPayments = payments.filter((payment) => payment.status === "paid");
  const paidAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyPaidAmount = paidPayments
    .filter((payment) => {
      const date = new Date(payment.paidAt || payment.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
  const dynamicChartBars = useMemo(() => buildChartBars(payments), [payments]);
  const recentTransactions = transactions
    .filter((transaction) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) return true;
      return [transaction.id, transaction.name, transaction.project, transaction.amount, transaction.status, transaction.date]
        .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
    })
    .slice(0, 5);
  const dashboardKpis = useMemo(
    () => [
      { ...kpiCards[0], value: formatPrice(totalAmount), delta: payments.length ? "+live" : "" },
      {
        ...kpiCards[1],
        value: formatPrice(pendingAmount),
        note: `${payments.filter((payment) => payment.status === "pending").length} Active`,
      },
      { ...kpiCards[2], value: formatPrice(paidAmount), note: "Recorded" },
      { ...kpiCards[3], value: formatPrice(monthlyPaidAmount), delta: payments.length ? "+live" : "" },
    ],
    [monthlyPaidAmount, paidAmount, payments, pendingAmount, totalAmount],
  );

  function downloadStatement() {
    downloadFile(`sparkin-payment-statement-${new Date().toISOString().slice(0, 10)}.csv`, buildStatement(payments));
  }

  function handleWithdraw() {
    setNotice(
      pendingAmount > 0
        ? "Withdrawals will be enabled after pending project milestones are marked paid."
        : "There are no pending vendor payouts to withdraw right now.",
    );
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Payments"
        subtitle="Track your earnings and payouts"
        actions={
          <>
          <VendorSecondaryButton
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={downloadStatement}
            disabled={isLoading || payments.length === 0}
            sx={{ px: 1.55 }}
          >
            Statement
          </VendorSecondaryButton>
          <VendorPrimaryButton
            startIcon={<PaymentsOutlinedIcon />}
            onClick={handleWithdraw}
            sx={{ px: 1.65 }}
          >
            Withdraw Funds
          </VendorPrimaryButton>
          </>
        }
      />

      {notice ? (
        <Alert severity="info" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {notice}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.4, md: 2.7 },
        }}
      >
        {dashboardKpis.map((card) => (
          <KpiCard key={card.label} card={card} />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.55fr 0.88fr" },
          gap: 1.6,
          mb: { xs: 2.45, md: 2.8 },
        }}
      >
        <Box
          sx={{
            p: 1.7,
            borderRadius: "1.35rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
            <Box>
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                Monthly Revenue Trend
              </Typography>
              <Typography sx={{ mt: 0.2, color: "#738094", fontSize: "0.72rem" }}>
                Performance over the last 6 months
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1,
                py: 0.48,
                borderRadius: "0.75rem",
                bgcolor: "#F5F7FB",
                color: "#556478",
                fontSize: "0.66rem",
                fontWeight: 700,
              }}
            >
              Last 6 Months
            </Box>
          </Stack>

          <Stack
            direction="row"
            alignItems="flex-end"
            spacing={0.45}
            sx={{ mt: 3.2, height: 166 }}
          >
            {dynamicChartBars.map((bar) => (
              <Box key={bar.month} sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: bar.height,
                    borderRadius: "0.4rem 0.4rem 0 0",
                    bgcolor: bar.tone,
                  }}
                />
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#7A8799",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {bar.month}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.55,
            borderRadius: "1.35rem",
            background:
              "linear-gradient(180deg, rgba(239,243,255,0.96) 0%, rgba(245,248,255,0.96) 100%)",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.8rem",
                bgcolor: "#FFFFFF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 8px 16px rgba(16,29,51,0.06)",
              }}
            >
              <PaymentsOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
            <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
              Payout Setup
            </Typography>
          </Stack>

          <Box
            sx={{
              mt: 1.35,
              p: 1.25,
              borderRadius: "1rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(227,233,242,0.96)",
            }}
          >
            <Typography
              sx={{
                color: "#7D8797",
                fontSize: "0.56rem",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Linked Bank Account
            </Typography>
            <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.9} alignItems="center">
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "0.75rem",
                    bgcolor: "#F5F7FB",
                    color: "#556478",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  ▣
                </Box>
                <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                  Bank account not connected
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "#E8FAEF",
                  color: "#239654",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                }}
              >
                ✓
              </Box>
            </Stack>

            <Stack spacing={1} sx={{ mt: 1.35 }}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography sx={{ color: "#7A8799", fontSize: "0.72rem" }}>
                  Next payout date
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 700 }}>
                  {pendingAmount > 0 ? formatDate(new Date()) : "No payout pending"}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography sx={{ color: "#7A8799", fontSize: "0.72rem" }}>
                  Min withdrawal
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 700 }}>
                  \u20B910,000
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleWithdraw}
            sx={{
              mt: 1.45,
              minHeight: 39,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Withdraw Funds
          </Button>

          <Typography
            sx={{
              mt: 1.05,
              color: "#8A96A7",
              fontSize: "0.62rem",
              textAlign: "center",
            }}
          >
            Funds typically arrive within 2-3 business days.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          borderRadius: "1.55rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.2}
          sx={{ px: 1.7, pt: 1.5 }}
        >
          <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
            Recent Transactions
          </Typography>

          <Stack direction="row" spacing={0.55}>
            {["All", "Paid", "Pending"].map((tab, index) => (
              <Button
                key={tab}
                sx={{
                  minHeight: 28,
                  px: 1,
                  borderRadius: "999px",
                  bgcolor: index === 0 ? "#F4F7FB" : "transparent",
                  color: "#556478",
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {tab}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.7, pt: 1.45, pb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.8fr 0.76fr 0.82fr 0.42fr",
              gap: 1,
            }}
          >
            {columns.map((column) => (
              <Typography
                key={column}
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {column}
              </Typography>
            ))}
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : null}

        {!isLoading && error ? (
          <Box sx={{ px: { xs: 1.2, md: 1.7 }, py: 1.4 }}>
            <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
              {error}
            </Alert>
          </Box>
        ) : null}

        {!isLoading && !error && recentTransactions.length === 0 ? (
          <Box sx={{ px: { xs: 1.2, md: 1.7 }, py: 4 }}>
            <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
              Payments will appear here after customers accept your quotes and projects are created.
            </Alert>
          </Box>
        ) : null}

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 1.7 }, pb: 1.1 }}>
          {recentTransactions.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.55 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", lg: "grid" },
                  gridTemplateColumns: "1.2fr 1fr 0.8fr 0.76fr 0.82fr 0.42fr",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "#EEF2F8",
                      color: "#667388",
                      fontSize: "0.66rem",
                      fontWeight: 800,
                    }}
                  >
                    {item.initials}
                  </Avatar>
                  <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                </Stack>

                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem" }}>
                  {item.project}
                </Typography>
                <Typography sx={{ color: "#18253A", fontSize: "0.8rem", fontWeight: 800 }}>
                  {item.amount}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 0.85,
                    py: 0.34,
                    borderRadius: "999px",
                    bgcolor: item.statusBg,
                    color: item.statusTone,
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {item.status}
                </Box>
                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem" }}>
                  {item.date}
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/vendor/payments/transactions/${item.id}`}
                  sx={{
                    minWidth: 28,
                    width: 28,
                    height: 28,
                    p: 0,
                    borderRadius: "50%",
                    color: "#556478",
                  }}
                >
                  <FileDownloadOutlinedIcon sx={{ fontSize: "1rem" }} />
                </Button>
              </Box>

              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={1.05}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
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
                        <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 700 }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: "#7A8799", fontSize: "0.72rem", mt: 0.12 }}>
                          {item.project}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      component={RouterLink}
                      to={`/vendor/payments/transactions/${item.id}`}
                      sx={{
                        minWidth: 28,
                        width: 28,
                        height: 28,
                        p: 0,
                        borderRadius: "50%",
                        color: "#556478",
                      }}
                    >
                      <FileDownloadOutlinedIcon sx={{ fontSize: "1rem" }} />
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {[
                      ["Amount", item.amount],
                      ["Date", item.date],
                      ["Status", item.status],
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
                            mt: 0.24,
                            color: label === "Amount" ? "#18253A" : "#223146",
                            fontSize: "0.75rem",
                            fontWeight: label === "Amount" ? 800 : 600,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            px: 1.7,
            py: 1.2,
            borderTop: "1px solid rgba(234,239,245,0.95)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            component={RouterLink}
            to="/vendor/payments/transactions"
            sx={{
              px: 0,
              minHeight: 28,
              color: "#0E56C8",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            View All Transactions
          </Button>
        </Box>
      </Box>
    </VendorPageShell>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";

const tabs = ["All", "Pending", "Accepted", "Rejected"];

const columns = [
  "Customer",
  "Location",
  "System Size",
  "Your Price (₹)",
  "Status",
  "Date",
  "Actions",
];

const pageSize = 8;

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CU";
}

function getStatusMeta(status) {
  const map = {
    submitted: { status: "Pending", statusTone: "#4F89FF", statusBg: "#EEF4FF" },
    shortlisted: { status: "Under Review", statusTone: "#878500", statusBg: "#F2F08E" },
    accepted: { status: "Accepted", statusTone: "#1FA453", statusBg: "#E8FAEF" },
    rejected: { status: "Rejected", statusTone: "#E05252", statusBg: "#FDECEC" },
    withdrawn: { status: "Rejected", statusTone: "#E05252", statusBg: "#FDECEC" },
  };

  return map[status] || map.submitted;
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

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function toQuoteRow(quote, lead) {
  const customerName = lead?.contact?.fullName || "Customer";
  const { status, statusTone, statusBg } = getStatusMeta(quote.status);

  return {
    id: quote.id || quote._id,
    leadId: quote.leadId,
    rawStatus: quote.status,
    initials: getInitials(customerName),
    name: customerName,
    type: lead?.projectType || "Residential Project",
    location: [lead?.installationAddress?.city, lead?.installationAddress?.state].filter(Boolean).join(", ") || "Location pending",
    systemSize: quote.system?.sizeKw ? `${quote.system.sizeKw} kW` : "Assessment pending",
    yourPrice: formatPrice(quote.pricing?.totalPrice),
    status,
    statusTone,
    statusBg,
    date: formatDate(quote.submittedAt || quote.createdAt),
    submittedAt: quote.submittedAt || quote.createdAt,
  };
}

function KpiIcon({ type, tone, bg }) {
  const base = {
    width: 30,
    height: 30,
    borderRadius: "0.8rem",
    bgcolor: bg,
    color: tone,
    display: "grid",
    placeItems: "center",
    fontSize: "0.95rem",
    fontWeight: 800,
  };

  if (type === "accepted") {
    return (
      <Box sx={base}>
        <CheckRoundedIcon sx={{ fontSize: "0.95rem" }} />
      </Box>
    );
  }

  if (type === "rejected") {
    return (
      <Box sx={base}>
        <CloseRoundedIcon sx={{ fontSize: "0.95rem" }} />
      </Box>
    );
  }

  return <Box sx={base}>□</Box>;
}

export default function VendorQuotesPage() {
  const location = useLocation();
  const [quotes, setQuotes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadQuotes() {
      setIsLoading(true);
      setError("");

      try {
        const [quotesResult, leadsResult] = await Promise.allSettled([quotesApi.listQuotes(), leadsApi.listLeads()]);
        if (quotesResult.status === "rejected") {
          throw quotesResult.reason;
        }

        if (!active) return;
        setQuotes(quotesResult.value);
        setLeads(leadsResult.status === "fulfilled" ? leadsResult.value : []);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load quotes.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadQuotes();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    setSearchTerm(incomingSearch);
    setPage(1);
  }, [location.state]);

  const leadById = useMemo(() => {
    const map = new Map();
    leads.forEach((lead) => map.set(String(lead.id || lead._id), lead));
    return map;
  }, [leads]);
  const quoteRows = useMemo(
    () => quotes.map((quote) => toQuoteRow(quote, quote.lead || leadById.get(String(quote.leadId)))),
    [leadById, quotes],
  );
  const filteredQuotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const rows = quoteRows.filter((quote) => {
      if (activeTab === "Pending") return ["submitted", "shortlisted"].includes(quote.rawStatus);
      if (activeTab === "Accepted") return quote.rawStatus === "accepted";
      if (activeTab === "Rejected") return ["rejected", "withdrawn"].includes(quote.rawStatus);
      return true;
    }).filter((quote) => {
      if (!normalizedSearch) return true;
      return [quote.id, quote.leadId, quote.name, quote.type, quote.location, quote.systemSize, quote.yourPrice, quote.status]
        .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
    });

    return [...rows].sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  }, [activeTab, quoteRows, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / pageSize));
  const visibleQuotes = filteredQuotes.slice((page - 1) * pageSize, page * pageSize);
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);
  const firstVisibleQuote = filteredQuotes.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisibleQuote = filteredQuotes.length ? firstVisibleQuote + visibleQuotes.length - 1 : 0;
  const acceptedCount = quoteRows.filter((quote) => quote.rawStatus === "accepted").length;
  const rejectedCount = quoteRows.filter((quote) => ["rejected", "withdrawn"].includes(quote.rawStatus)).length;
  const pendingCount = quoteRows.filter((quote) => ["submitted", "shortlisted"].includes(quote.rawStatus)).length;
  const acceptanceRate = quoteRows.length ? Math.round((acceptedCount / quoteRows.length) * 100) : 0;
  const averageQuoteValue = quoteRows.length
    ? Math.round(
        quoteRows.reduce((sum, quote) => sum + Number(String(quote.yourPrice).replace(/[^\d.-]/g, "") || 0), 0) /
          quoteRows.length,
      )
    : 0;
  const topLocation = quoteRows
    .map((quote) => quote.location)
    .filter((value) => value && value !== "Location pending")
    .sort((a, b) => quoteRows.filter((quote) => quote.location === b).length - quoteRows.filter((quote) => quote.location === a).length)[0];
  const kpiCards = [
    {
      label: "Total Quotes",
      value: String(quoteRows.length),
      delta: `${acceptanceRate}%`,
      icon: "file",
      tone: "#4F89FF",
      bg: "#EEF4FF",
    },
    {
      label: "Pending",
      value: String(pendingCount),
      icon: "pending",
      tone: "#4F89FF",
      bg: "#EEF4FF",
    },
    {
      label: "Accepted",
      value: String(acceptedCount),
      badge: "High Win Rate",
      icon: "accepted",
      tone: "#1FA453",
      bg: "#E8FAEF",
    },
    {
      label: "Rejected",
      value: String(rejectedCount),
      icon: "rejected",
      tone: "#E05252",
      bg: "#FDECEC",
    },
  ];

  function updateTab(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  function applySearch(value) {
    setSearchTerm(value);
    setPage(1);
  }

  function exportQuotes() {
    const rows = [
      ["Quote ID", "Lead ID", "Customer", "Location", "System Size", "Your Price", "Status", "Date"],
      ...filteredQuotes.map((quote) => [
        quote.id,
        quote.leadId,
        quote.name,
        quote.location,
        quote.systemSize,
        quote.yourPrice,
        quote.status,
        quote.date,
      ]),
    ];

    downloadFile(`sparkin-quotes-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: { xs: 2.4, md: 2.8 } }}
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
            Quotes
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Manage and track all your submitted quotes
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/vendor/quotes/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            minHeight: 38,
            px: 1.7,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Create New Quote
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.4, md: 2.7 },
        }}
      >
        {kpiCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              p: 1.65,
              minHeight: 108,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <KpiIcon type={card.icon} tone={card.tone} bg={card.bg} />
              {card.delta ? (
                <Typography sx={{ color: "#778597", fontSize: "0.58rem", fontWeight: 800 }}>
                  {card.delta}
                </Typography>
              ) : card.badge ? (
                <Box
                  sx={{
                    px: 0.75,
                    py: 0.28,
                    borderRadius: "999px",
                    bgcolor: "#9AF39D",
                    color: "#167D2E",
                    fontSize: "0.54rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {card.badge}
                </Box>
              ) : null}
            </Stack>
            <Typography
              sx={{
                mt: 1.2,
                color: "#6F7D8F",
                fontSize: "0.76rem",
                fontWeight: 500,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                color: "#18253A",
                fontSize: "1.9rem",
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          borderRadius: "1.55rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
          overflow: "hidden",
          mb: { xs: 2.5, md: 2.8 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.2}
          sx={{ px: 1.7, pt: 1.5 }}
        >
          <Stack direction="row" spacing={0.7} flexWrap="wrap">
            {tabs.map((tab, index) => (
              <Button
                key={tab}
                onClick={() => updateTab(tab)}
                sx={{
                  minHeight: 30,
                  px: 1.2,
                  borderRadius: "999px",
                  bgcolor: activeTab === tab ? "#0E56C8" : "transparent",
                  color: activeTab === tab ? "#FFFFFF" : "#556478",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {tab}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.8} flexWrap="wrap">
            <TextField
              size="small"
              value={searchTerm}
              onChange={(event) => applySearch(event.target.value)}
              placeholder="Search quotes"
              sx={{
                minWidth: { xs: "100%", md: 210 },
                "& .MuiOutlinedInput-root": {
                  height: 32,
                  borderRadius: "0.8rem",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.72rem",
                },
              }}
            />
            <Button
              startIcon={<TuneRoundedIcon />}
              variant="outlined"
              onClick={() => updateTab("All")}
              sx={{
                minHeight: 32,
                px: 1.2,
                borderRadius: "0.8rem",
                borderColor: "rgba(225,232,241,0.96)",
                color: "#556478",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              More Filters
            </Button>
            <Button
              startIcon={<FileDownloadOutlinedIcon />}
              variant="outlined"
              onClick={exportQuotes}
              disabled={isLoading}
              sx={{
                minHeight: 32,
                px: 1.2,
                borderRadius: "0.8rem",
                borderColor: "rgba(225,232,241,0.96)",
                color: "#556478",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.7, pt: 1.55, pb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.25fr 1fr 0.72fr 0.98fr 0.92fr 0.88fr 0.95fr",
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

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 1.7 }, pb: 1.1 }}>
          {isLoading ? (
            <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : null}

          {!isLoading && !error && filteredQuotes.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ color: "#223146", fontSize: "0.95rem", fontWeight: 700 }}>
                No quotes available
              </Typography>
              <Typography sx={{ mt: 0.45, color: "#738094", fontSize: "0.78rem" }}>
                Submitted quotes will appear here.
              </Typography>
            </Box>
          ) : null}

          {visibleQuotes.map((quote, index) => (
            <Box
              key={quote.id}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.55 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", lg: "grid" },
                  gridTemplateColumns: "1.25fr 1fr 0.72fr 0.98fr 0.92fr 0.88fr 0.95fr",
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
                      fontSize: "0.68rem",
                      fontWeight: 800,
                    }}
                  >
                    {quote.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 700, lineHeight: 1.15 }}>
                      {quote.name}
                    </Typography>
                    <Typography sx={{ mt: 0.15, color: "#98A3B2", fontSize: "0.66rem", lineHeight: 1.3 }}>
                      {quote.type}
                    </Typography>
                  </Box>
                </Stack>

                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem", lineHeight: 1.35 }}>
                  {quote.location}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.76rem", fontWeight: 600 }}>
                  {quote.systemSize}
                </Typography>
                <Typography sx={{ color: "#0E56C8", fontSize: "0.8rem", fontWeight: 800 }}>
                  {quote.yourPrice}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 0.9,
                    py: 0.34,
                    borderRadius: "999px",
                    bgcolor: quote.statusBg,
                    color: quote.statusTone,
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {quote.status}
                </Box>
                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem" }}>
                  {quote.date}
                </Typography>

                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Button
                    component={RouterLink}
                    to={`/vendor/leads/${quote.leadId}/quote`}
                    sx={{
                      minWidth: 30,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      p: 0,
                      color: "#0E56C8",
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  </Button>
                  <Button
                    component={RouterLink}
                    to={`/vendor/leads/${quote.leadId}`}
                    variant="outlined"
                    sx={{
                      minHeight: 30,
                      px: 1,
                      borderRadius: "0.8rem",
                      borderColor: "rgba(225,232,241,0.96)",
                      bgcolor: "#F6F8FB",
                      color: "#223146",
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={1.1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#EEF2F8",
                        color: "#667388",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                      }}
                    >
                      {quote.initials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: "#223146", fontSize: "0.9rem", fontWeight: 700 }}>
                        {quote.name}
                      </Typography>
                      <Typography sx={{ color: "#98A3B2", fontSize: "0.7rem", mt: 0.12 }}>
                        {quote.type}
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
                      ["Location", quote.location],
                      ["System Size", quote.systemSize],
                      ["Your Price", quote.yourPrice],
                      ["Date", quote.date],
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
                            color: label === "Your Price" ? "#0E56C8" : "#223146",
                            fontSize: "0.76rem",
                            fontWeight: label === "Your Price" ? 800 : 600,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Box
                      sx={{
                        px: 0.9,
                        py: 0.34,
                        borderRadius: "999px",
                        bgcolor: quote.statusBg,
                        color: quote.statusTone,
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {quote.status}
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/vendor/leads/${quote.leadId}/quote`}
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        p: 0,
                        color: "#0E56C8",
                      }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                    </Button>
                    <Button
                      component={RouterLink}
                      to={`/vendor/leads/${quote.leadId}`}
                      variant="outlined"
                      sx={{
                        minHeight: 30,
                        px: 1,
                        borderRadius: "0.8rem",
                        borderColor: "rgba(225,232,241,0.96)",
                        bgcolor: "#F6F8FB",
                        color: "#223146",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>

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
          <Typography sx={{ color: "#738094", fontSize: "0.72rem", fontWeight: 500 }}>
            Showing {firstVisibleQuote} to {lastVisibleQuote} of {filteredQuotes.length} quotes
          </Typography>

          <Stack direction="row" spacing={0.45} alignItems="center">
            <Button
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
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
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                sx={{
                  minWidth: 30,
                  width: 30,
                  height: 30,
                  borderRadius: "0.6rem",
                  p: 0,
                  color: pageNumber === page ? "#FFFFFF" : "#223146",
                  bgcolor: pageNumber === page ? "#0E56C8" : "#FFFFFF",
                  border: pageNumber === page ? "none" : "1px solid rgba(225,232,241,0.96)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
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
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.35fr 0.95fr" },
          gap: 1.8,
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
          <Typography sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}>
            Quote Insights
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1.6}
            sx={{ mt: 1.2 }}
          >
            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.84rem", lineHeight: 1.7 }}>
                Your current quote acceptance rate is {acceptanceRate}% across {quoteRows.length} submitted quotes.
                {topLocation ? ` ${topLocation} is your most active quote location.` : " Submit more quotes to build reliable regional insights."}
              </Typography>
              <Button
                onClick={exportQuotes}
                disabled={isLoading || quoteRows.length === 0}
                sx={{
                  mt: 2,
                  px: 0,
                  minHeight: 28,
                  color: "#0E56C8",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Detailed Analytics →
              </Button>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: 112 },
                height: 112,
                borderRadius: "1rem",
                bgcolor: "#F4F7FB",
                display: "grid",
                placeItems: "center",
                color: "#8CB2EA",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              ↗
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.7,
            borderRadius: "1.35rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 18px 34px rgba(14,86,200,0.18)",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "0.8rem",
              bgcolor: "rgba(255,255,255,0.14)",
              display: "grid",
              placeItems: "center",
              fontSize: "0.95rem",
            }}
          >
            ✦
          </Box>
          <Typography sx={{ mt: 1.2, fontSize: "1.1rem", fontWeight: 800 }}>
            Smart Pricing Suggestion
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              maxWidth: 290,
              color: "rgba(255,255,255,0.78)",
              fontSize: "0.8rem",
              lineHeight: 1.65,
            }}
          >
            Your average submitted quote is {formatPrice(averageQuoteValue)}.
            Review open leads and tune proposals using system size, warranty, and delivery timelines.
          </Typography>
          <Button
            component={RouterLink}
            to="/vendor/leads"
            variant="contained"
            sx={{
              mt: 2.2,
              minHeight: 38,
              width: "100%",
              borderRadius: "0.9rem",
              bgcolor: "#FFFFFF",
              color: "#0E56C8",
              boxShadow: "none",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#FFFFFF" },
            }}
          >
            Review Pricing Strategy
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

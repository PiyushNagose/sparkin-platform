import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import {
  VendorEmptyState,
  VendorErrorState,
  VendorFilterPanel,
  VendorLoadingState,
  VendorPageHeader,
  VendorPageShell,
  VendorPanel,
  VendorSecondaryButton,
  VendorStatusPill,
} from "@/features/vendor/components/VendorPortalUI";

const columns = [
  "Customer Name",
  "Location",
  "System Size",
  "Budget",
  "Status",
  "Time Received",
  "Actions",
];

const pageSize = 8;

function FilterSelect({ label, value, onChange, options }) {
  return (
    <Stack
      direction="row"
      spacing={0.7}
      alignItems="center"
      sx={{
        minHeight: 40,
        px: 1.1,
        borderRadius: "999px",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
      }}
    >
      <Typography
        sx={{
          color: "#A1ACBA",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {label}:
      </Typography>
      <TextField
        select
        variant="standard"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ input: { disableUnderline: true } }}
        sx={{
          minWidth: { xs: 150, md: 122 },
          "& .MuiInputBase-input": {
            py: 0,
            color: "#223146",
            fontSize: "0.74rem",
            fontWeight: 700,
          },
        }}
      >
        {options.map(([optionValue, optionLabel]) => (
          <MenuItem key={optionValue} value={optionValue}>
            {optionLabel}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatLeadStatus(status) {
  const labels = {
    submitted: "New",
    reviewing: "In Review",
    vendors_assigned: "Assigned",
    open_for_quotes: "Open",
    quote_selected: "Selected",
    closed: "Closed",
  };

  return labels[status] || status;
}

function getStatusStyle(status) {
  if (status === "reviewing") {
    return { statusTone: "#7D7B00", statusBg: "#F2F08E" };
  }

  if (status === "vendors_assigned") {
    return { statusTone: "#FF8C00", statusBg: "#FFF4E6" };
  }

  if (status === "open_for_quotes") {
    return { statusTone: "#239654", statusBg: "#E4F7EA" };
  }

  if (status === "closed" || status === "quote_selected") {
    return { statusTone: "#7D8798", statusBg: "#EDF1F5" };
  }

  return { statusTone: "#4F89FF", statusBg: "#EEF4FF" };
}

function formatTimeReceived(value) {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return "Recently";
  }

  const diffMs = Date.now() - createdAt.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 1) {
    return "Just now";
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getLeadBudget(lead) {
  const load = Number(lead.property?.sanctionedLoadKw) || 0;
  return load ? formatPrice(load * 75000) : "Pending quote";
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

function toLeadRow(lead, quote) {
  const { statusTone, statusBg } = getStatusStyle(lead.status);
  const name = lead.contact?.fullName || "Customer";
  const load = lead.property?.sanctionedLoadKw;
  const id = lead.id || lead._id;
  const hasQuote = Boolean(quote);

  return {
    id,
    raw: lead,
    initials: getInitials(name) || "CU",
    name,
    location: [lead.installationAddress?.city, lead.installationAddress?.state]
      .filter(Boolean)
      .join(", "),
    systemSize: load ? `${load} kW` : "Assessment pending",
    systemLoad: Number(load) || 0,
    budget: getLeadBudget(lead),
    status: formatLeadStatus(lead.status),
    rawStatus: lead.status,
    statusTone,
    statusBg,
    timeReceived: formatTimeReceived(lead.createdAt),
    primaryAction: hasQuote ? "Edit Quote" : "Submit Quote",
    detailAction: "View Details",
    quotePath: id ? `/vendor/leads/${id}/quote` : "/vendor/leads",
    detailPath: id ? `/vendor/leads/${id}` : "/vendor/leads",
    quoteStatus: quote?.status || null,
    createdAt: lead.createdAt || lead.submittedAt,
  };
}

export default function VendorLeadsPage() {
  const location = useLocation();
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  async function loadLeads(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [leadRows, quoteRows] = await Promise.all([
        leadsApi.listLeads(),
        quotesApi.listQuotes(),
      ]);

      if (active) {
        setLeads(leadRows);
        setQuotes(quoteRows);
        setPage(1);
      }
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load leads.");
      }
    } finally {
      if (active) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    let active = true;
    loadLeads(active);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const incomingSearch = location.state?.portalSearch || "";
    setSearchTerm(incomingSearch);
    setPage(1);
  }, [location.state]);

  const quoteByLeadId = useMemo(() => {
    const map = new Map();
    quotes.forEach((quote) => {
      map.set(String(quote.leadId), quote);
    });
    return map;
  }, [quotes]);
  const leadRows = useMemo(
    () =>
      leads.map((lead) =>
        toLeadRow(lead, quoteByLeadId.get(String(lead.id || lead._id))),
      ),
    [leads, quoteByLeadId],
  );
  const locationOptions = useMemo(
    () => [
      ...new Set(
        leadRows
          .map((lead) => lead.raw.installationAddress?.state)
          .filter(Boolean),
      ),
    ],
    [leadRows],
  );
  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const rows = leadRows.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.rawStatus === statusFilter;
      const matchesLocation =
        locationFilter === "all" ||
        lead.raw.installationAddress?.state === locationFilter;
      const matchesSystem =
        systemFilter === "all" ||
        (systemFilter === "assessment" && !lead.systemLoad) ||
        (systemFilter === "under_5" &&
          lead.systemLoad > 0 &&
          lead.systemLoad < 5) ||
        (systemFilter === "5_10" &&
          lead.systemLoad >= 5 &&
          lead.systemLoad <= 10) ||
        (systemFilter === "over_10" && lead.systemLoad > 10);
      const matchesSearch =
        !normalizedSearch ||
        [
          lead.id,
          lead.name,
          lead.location,
          lead.systemSize,
          lead.budget,
          lead.status,
          lead.quoteStatus,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

      return matchesStatus && matchesLocation && matchesSystem && matchesSearch;
    });

    return [...rows].sort((a, b) => {
      if (sortBy === "oldest")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "system_desc") return b.systemLoad - a.systemLoad;
      if (sortBy === "system_asc") return a.systemLoad - b.systemLoad;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [
    leadRows,
    locationFilter,
    searchTerm,
    sortBy,
    statusFilter,
    systemFilter,
  ]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);
  const firstVisibleLead = filteredRows.length ? (page - 1) * pageSize + 1 : 0;
  const lastVisibleLead = filteredRows.length
    ? firstVisibleLead + visibleRows.length - 1
    : 0;

  function exportCsv() {
    const rows = [
      [
        "Lead ID",
        "Customer",
        "Location",
        "System Size",
        "Budget",
        "Status",
        "Quote Status",
        "Time Received",
      ],
      ...filteredRows.map((lead) => [
        lead.id,
        lead.name,
        lead.location,
        lead.systemSize,
        lead.budget,
        lead.status,
        lead.quoteStatus || "not quoted",
        lead.createdAt,
      ]),
    ];

    downloadFile(
      `sparkin-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(rows),
    );
  }

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <VendorPageShell>
      <VendorPageHeader
        title="Leads"
        subtitle="Manage and track your potential solar installations."
        actions={
          <>
            <VendorSecondaryButton
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={exportCsv}
              disabled={isLoading}
              sx={{ borderRadius: "999px" }}
            >
              Export CSV
            </VendorSecondaryButton>
          </>
        }
      />

      <VendorFilterPanel>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          spacing={1.35}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Search by name, location, ID…"
              value={searchTerm}
              onChange={(event) =>
                updateFilter(setSearchTerm, event.target.value)
              }
              sx={{
                minWidth: { xs: "100%", md: 240 },
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                },
              }}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={(value) => updateFilter(setStatusFilter, value)}
              options={[
                ["all", "All Statuses"],
                ["submitted", "New"],
                ["reviewing", "In Review"],
                ["open_for_quotes", "Open"],
                ["quote_selected", "Selected"],
              ]}
            />
            <FilterSelect
              label="Location"
              value={locationFilter}
              onChange={(value) => updateFilter(setLocationFilter, value)}
              options={[
                ["all", "All Locations"],
                ...locationOptions.map((location) => [location, location]),
              ]}
            />
            <FilterSelect
              label="System"
              value={systemFilter}
              onChange={(value) => updateFilter(setSystemFilter, value)}
              options={[
                ["all", "Any Size"],
                ["assessment", "Assessment Pending"],
                ["under_5", "Under 5 kW"],
                ["5_10", "5-10 kW"],
                ["over_10", "Over 10 kW"],
              ]}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={0.85}
            alignItems="center"
            justifyContent="flex-end"
          >
            <TuneRoundedIcon sx={{ color: "#6E7B8C", fontSize: "0.95rem" }} />
            <Typography
              sx={{ color: "#6E7B8C", fontSize: "0.74rem", fontWeight: 600 }}
            >
              Sort by:
            </Typography>
            <TextField
              select
              size="small"
              value={sortBy}
              onChange={(event) => updateFilter(setSortBy, event.target.value)}
              sx={{
                minWidth: 190,
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: "#0E56C8",
                },
              }}
            >
              <MenuItem value="newest">Time Received (Newest)</MenuItem>
              <MenuItem value="oldest">Time Received (Oldest)</MenuItem>
              <MenuItem value="system_desc">System Size (High-Low)</MenuItem>
              <MenuItem value="system_asc">System Size (Low-High)</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </VendorFilterPanel>

      <VendorPanel sx={{ borderRadius: "1.7rem", overflow: "hidden" }}>
        <Box
          sx={{ display: { xs: "none", lg: "block" }, px: 2.4, pt: 2, pb: 1.2 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr 0.7fr 0.82fr 0.8fr 0.88fr 0.9fr",
              gap: 1,
            }}
          >
            {columns.map((column) => (
              <Typography
                key={column}
                sx={{
                  color: "#616E82",
                  fontSize: "0.6rem",
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

        <Stack spacing={0} sx={{ px: { xs: 1.4, md: 2.4 }, pb: 1.25 }}>
          {isLoading ? <VendorLoadingState minHeight={140} /> : null}

          {error ? (
            <VendorErrorState sx={{ my: 2 }}>{error}</VendorErrorState>
          ) : null}

          {!isLoading && !error && filteredRows.length === 0 ? (
            <VendorEmptyState
              icon={Groups2RoundedIcon}
              title="No matching leads"
              subtitle="Adjust the filters above to find leads assigned to you."
            />
          ) : null}

          {visibleRows.map((lead, index) => (
            <Box
              key={lead.id || `${lead.name}-${index}`}
              sx={{
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.6, md: 2 },
                transition: "background 0.15s",
                borderRadius: "0.75rem",
                "&:hover": { bgcolor: "#F4F7FF" },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", lg: "grid" },
                  gridTemplateColumns:
                    "1.35fr 1fr 0.7fr 0.82fr 0.8fr 0.88fr 0.9fr",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
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
                    {lead.initials}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: "#223146",
                        fontSize: "0.96rem",
                        fontWeight: 700,
                        lineHeight: 1.18,
                      }}
                    >
                      {lead.name}
                    </Typography>
                    {lead.rawStatus === "submitted" && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          mt: 0.3,
                          px: 0.7,
                          py: 0.15,
                          borderRadius: "0.3rem",
                          bgcolor: "#0E56C8",
                          color: "#FFFFFF",
                          fontSize: "0.5rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        NEW
                      </Box>
                    )}
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    color: "#5E6A7D",
                    fontSize: "0.78rem",
                    lineHeight: 1.4,
                  }}
                >
                  {lead.location}
                </Typography>
                <Typography
                  sx={{
                    color: "#223146",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {lead.systemSize}
                </Typography>
                <Typography
                  sx={{
                    color: "#223146",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  {lead.budget}
                </Typography>
                <VendorStatusPill tone={lead.statusTone} bg={lead.statusBg}>
                  {lead.status}
                </VendorStatusPill>
                <Typography
                  sx={{
                    color: "#5E6A7D",
                    fontSize: "0.78rem",
                    lineHeight: 1.35,
                  }}
                >
                  {lead.timeReceived}
                </Typography>

                <Stack spacing={0.7} alignItems="flex-start">
                  <Button
                    component={RouterLink}
                    to={lead.detailPath}
                    sx={{
                      minHeight: 0,
                      px: 0,
                      py: 0,
                      color: "#0E56C8",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    component={RouterLink}
                    to={lead.quotePath}
                    variant="contained"
                    sx={{
                      minHeight: 34,
                      px: 1.4,
                      borderRadius: "999px",
                      bgcolor: "#0E56C8",
                      boxShadow: "0 6px 14px rgba(14,86,200,0.2)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#0B49AD",
                        boxShadow: "0 8px 18px rgba(14,86,200,0.28)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {lead.primaryAction}
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
                      {lead.initials}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                        }}
                      >
                        {lead.name}
                      </Typography>
                      <Typography
                        sx={{ color: "#5E6A7D", fontSize: "0.76rem", mt: 0.15 }}
                      >
                        {lead.location}
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
                      ["System Size", lead.systemSize],
                      ["Budget", lead.budget],
                      ["Status", lead.status],
                      ["Time Received", lead.timeReceived],
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
                            mt: 0.28,
                            color: "#223146",
                            fontSize: "0.76rem",
                            fontWeight: 600,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      component={RouterLink}
                      to={lead.detailPath}
                      variant="text"
                      sx={{
                        px: 0,
                        minHeight: 32,
                        color: "#0E56C8",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      {lead.detailAction}
                    </Button>
                    <Button
                      component={RouterLink}
                      to={lead.quotePath}
                      variant="contained"
                      sx={{
                        minHeight: 34,
                        px: 1.25,
                        borderRadius: "999px",
                        bgcolor: "#0E56C8",
                        borderColor: "rgba(225,232,241,0.96)",
                        color: "#FFFFFF",
                        boxShadow: "0 10px 20px rgba(14,86,200,0.16)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      {lead.primaryAction}
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
            px: { xs: 1.2, md: 2.4 },
            py: 1.4,
            borderTop: "1px solid rgba(234,239,245,0.95)",
          }}
        >
          <Typography
            sx={{ color: "#738094", fontSize: "0.74rem", fontWeight: 500 }}
          >
            Showing {firstVisibleLead}-{lastVisibleLead} of{" "}
            {filteredRows.length} lead
            {filteredRows.length === 1 ? "" : "s"}
          </Typography>

          <Stack direction="row" spacing={0.55} alignItems="center">
            <Button
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={page === 1}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                minHeight: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                lineHeight: 1,
                borderRadius: '50%',
                color: '#647387',
                p: 0,
              }}
            >
              <KeyboardArrowLeftRoundedIcon />
            </Button>
            {pageNumbers.map((pageNumber, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev && pageNumber - prev > 1;
              return (
                <Box
                  key={pageNumber}
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
                    onClick={() => setPage(pageNumber)}
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      minHeight: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      lineHeight: 1,
                      borderRadius: '50%',
                      p: 0,
                      color: pageNumber === page ? '#FFFFFF' : '#223146',
                      bgcolor: pageNumber === page ? '#0E56C8' : 'transparent',
                      border: pageNumber === page ? 'none' : '1px solid rgba(225,232,241,0.96)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {pageNumber}
                  </Button>
                </Box>
              );
            })}
            <Button
              onClick={() =>
                setPage((currentPage) => Math.min(totalPages, currentPage + 1))
              }
              disabled={page === totalPages}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                minHeight: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                lineHeight: 1,
                borderRadius: '50%',
                color: '#647387',
                p: 0,
              }}
            >
              <KeyboardArrowRightRoundedIcon />
            </Button>
          </Stack>
        </Stack>
      </VendorPanel>
    </VendorPageShell>
  );
}

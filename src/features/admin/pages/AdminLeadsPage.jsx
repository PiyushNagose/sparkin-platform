import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
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
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import { leadsApi } from "@/features/public/api/leadsApi";

const initialLeadForm = {
  fullName: "",
  phoneNumber: "",
  email: "",
  street: "",
  city: "",
  state: "Telangana",
  pincode: "",
  systemSizeKw: "",
  propertyType: "independent_house",
  roofType: "flat",
  ownership: "owned",
  roofSize: "500_1000",
  shadow: "partial",
  condition: "average",
  notes: "",
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "submitted", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "verified", label: "Verified" },
  { value: "vendors_assigned", label: "Vendors Assigned" },
  { value: "open_for_quotes", label: "Bidding" },
  { value: "quote_selected", label: "Selected" },
  { value: "closed", label: "Closed" },
];

const paymentOptions = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Payment Pending" },
  { value: "none", label: "No Payment" },
];

const dateOptions = [
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "365", label: "Last 12 Months" },
  { value: "all", label: "All Time" },
];

const leadStatusMeta = {
  submitted: { label: "New", color: "#0E56C8", bg: "#EAF1FF" },
  reviewing: { label: "Reviewing", color: "#9A6B00", bg: "#FFF5D6" },
  verified: { label: "Verified", color: "#10985E", bg: "#E7F8EF" },
  vendors_assigned: { label: "Vendors Assigned", color: "#7B3FE4", bg: "#F1E9FF" },
  open_for_quotes: { label: "Bidding", color: "#0E56C8", bg: "#EAF1FF" },
  quote_selected: { label: "Selected", color: "#7B3FE4", bg: "#F1E9FF" },
  closed: { label: "Closed", color: "#657386", bg: "#EEF2F6" },
};

function formatLeadId(lead) {
  return `#SPK-${
    String(lead.id || "")
      .slice(-4)
      .toUpperCase() || "NEW"
  }`;
}

function formatLocation(lead) {
  return (
    [lead.installationAddress?.city, lead.installationAddress?.state]
      .filter(Boolean)
      .join(", ") || "Location pending"
  );
}

function getLeadSize(lead) {
  const direct = Number(lead.property?.sanctionedLoadKw || 0);
  if (direct > 0) return direct;

  const roofSize = lead.roof?.sizeRange;
  if (roofSize === "under_500") return 3;
  if (roofSize === "over_1000") return 10;
  return 5;
}

function getPaymentStatus(lead, projects, payments) {
  const linkedProjectIds = projects
    .filter((project) => String(project.leadId) === String(lead.id))
    .map((project) => String(project.id));

  const linkedPayments = payments.filter((payment) =>
    linkedProjectIds.includes(String(payment.projectId)),
  );

  if (!linkedPayments.length) return "none";
  if (linkedPayments.some((payment) => payment.status === "pending"))
    return "pending";
  if (linkedPayments.some((payment) => payment.status === "paid"))
    return "paid";
  return "none";
}

function buildCsv(rows) {
  const headers = [
    "Lead ID",
    "Customer Name",
    "Email",
    "Phone",
    "Location",
    "System Size KW",
    "Status",
    "Payment",
    "Vendors",
    "Created At",
  ];

  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const body = rows.map((row) =>
    [
      formatLeadId(row.raw),
      row.raw.contact?.fullName,
      row.raw.contact?.email,
      row.raw.contact?.phoneNumber,
      row.location,
      row.systemSizeKw,
      row.statusLabel,
      row.paymentLabel,
      row.vendorLabel,
      row.raw.createdAt,
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

function MetricCard({ icon: Icon, title, value, accent }) {
  return (
    <AdminPanel
      sx={{
        p: { xs: 2, md: 2.4 },
        display: "flex",
        alignItems: "center",
        gap: 2,
        minHeight: 96,
      }}
    >
      <Avatar
        sx={{
          width: 52,
          height: 52,
          borderRadius: "1rem",
          bgcolor: `${accent}18`,
          color: accent,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: "1.4rem" }} />
      </Avatar>
      <Box>
        <Typography
          sx={{
            color: "#768296",
            fontSize: "0.64rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: "#17499F",
            fontSize: "1.4rem",
            fontWeight: 900,
          }}
        >
          {value}
        </Typography>
      </Box>
    </AdminPanel>
  );
}

function LeadPill({ children, color, bg }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.45,
        px: 0.8,
        py: 0.42,
        borderRadius: "0.5rem",
        color,
        bgcolor: bg,
        fontSize: "0.66rem",
        fontWeight: 850,
      }}
    >
      <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: color }} />
      {children}
    </Box>
  );
}

function LeadFormDialog({ open, onClose, onSubmit, saving, error }) {
  const [form, setForm] = useState(initialLeadForm);

  useEffect(() => {
    if (open) setForm(initialLeadForm);
  }, [open]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      contact: {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        email: form.email.trim() || null,
      },
      installationAddress: {
        street: form.street,
        landmark: null,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      property: {
        type: form.propertyType,
        roofType: form.roofType,
        ownership: form.ownership,
        distributionCompany: null,
        connectionType: null,
        consumerNumber: null,
        sanctionedLoadKw: form.systemSizeKw ? Number(form.systemSizeKw) : null,
      },
      roof: {
        sizeRange: form.roofSize,
        shadow: form.shadow,
        condition: form.condition,
      },
      inspection: {
        preferredDate: null,
        preferredTimeSlot: null,
      },
      notes: form.notes.trim() || null,
      specialInstructions: null,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: adminUi.colors.text, fontWeight: 900 }}>
          Create New Lead
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: adminUi.colors.border }}>
          {error ? <AdminErrorState>{error}</AdminErrorState> : null}
          <Grid container spacing={1.6}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Customer Name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                value={form.street}
                onChange={(e) => updateField("street", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="City"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="State"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Pincode"
                value={form.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="System Size (kW)"
                value={form.systemSizeKw}
                onChange={(e) => updateField("systemSizeKw", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  label="Property Type"
                  value={form.propertyType}
                  onChange={(e) => updateField("propertyType", e.target.value)}
                >
                  <MenuItem value="independent_house">
                    Independent House
                  </MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Roof Size</InputLabel>
                <Select
                  label="Roof Size"
                  value={form.roofSize}
                  onChange={(e) => updateField("roofSize", e.target.value)}
                >
                  <MenuItem value="under_500">Under 500 sq ft</MenuItem>
                  <MenuItem value="500_1000">500-1000 sq ft</MenuItem>
                  <MenuItem value="over_1000">Over 1000 sq ft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={saving}
            sx={{ textTransform: "none", fontWeight: 800 }}
          >
            Cancel
          </Button>
          <AdminPrimaryButton type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Lead"}
          </AdminPrimaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function AdminLeadsPage() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    status: "all",
    location: "all",
    dateRange: "30",
    payment: "all",
    query: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE_LEADS = 10;

  async function loadLeads() {
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
          "Unable to load leads",
        data: null,
      });
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const rows = useMemo(() => {
    const data = state.data || {};
    const leads = data.leads || [];
    const quotes = data.quotes || [];
    const projects = data.projects || [];
    const payments = data.payments || [];
    const vendors = data.vendors || [];
    const vendorById = new Map(
      vendors.map((vendor) => [vendor.vendorId, vendor]),
    );

    return leads.map((lead) => {
      const leadQuotes = quotes.filter(
        (quote) => String(quote.leadId) === String(lead.id),
      );
      const paymentStatus = getPaymentStatus(lead, projects, payments);
      const vendorNames = leadQuotes
        .map(
          (quote) =>
            vendorById.get(quote.vendorId)?.company?.name ||
            quote.vendorEmail ||
            quote.vendorId,
        )
        .filter(Boolean);
      const meta = leadStatusMeta[lead.status] || leadStatusMeta.submitted;

      return {
        raw: lead,
        location: formatLocation(lead),
        systemSizeKw: getLeadSize(lead),
        statusLabel: meta.label,
        statusMeta: meta,
        paymentStatus,
        paymentLabel:
          paymentStatus === "paid"
            ? "Paid"
            : paymentStatus === "pending"
              ? "Payment Pending"
              : "No Payment",
        vendorLabel: vendorNames.length ? vendorNames.join(", ") : "Unassigned",
        vendorCount: vendorNames.length,
      };
    });
  }, [state.data]);

  const locations = useMemo(
    () => [
      ...new Set(
        rows.map((row) => row.raw.installationAddress?.state).filter(Boolean),
      ),
    ],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const now = Date.now();
    const q = filters.query.trim().toLowerCase();

    return rows.filter((row) => {
      const lead = row.raw;
      const matchesStatus =
        filters.status === "all" || lead.status === filters.status;
      const matchesLocation =
        filters.location === "all" ||
        lead.installationAddress?.state === filters.location;
      const matchesPayment =
        filters.payment === "all" || row.paymentStatus === filters.payment;
      const createdAt = new Date(lead.createdAt || lead.submittedAt).getTime();
      const matchesDate =
        filters.dateRange === "all" ||
        (!Number.isNaN(createdAt) &&
          now - createdAt <= Number(filters.dateRange) * 86400000);
      const matchesQuery =
        !q ||
        lead.contact?.fullName?.toLowerCase().includes(q) ||
        lead.contact?.email?.toLowerCase().includes(q) ||
        lead.contact?.phoneNumber?.toLowerCase().includes(q) ||
        formatLeadId(lead).toLowerCase().includes(q);

      return (
        matchesStatus &&
        matchesLocation &&
        matchesPayment &&
        matchesDate &&
        matchesQuery
      );
    });
  }, [rows, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const metrics = useMemo(() => {
    const totalCapacity = filteredRows.reduce(
      (sum, row) => sum + Number(row.systemSizeKw || 0),
      0,
    );
    const quotes = state.data?.quotes || [];
    const pipeline = quotes.reduce(
      (sum, quote) => sum + Number(quote.pricing?.totalPrice || 0),
      0,
    );
    const assigned = rows.filter((row) =>
      ["vendors_assigned", "open_for_quotes", "quote_selected"].includes(
        row.raw.status,
      ),
    ).length;

    return {
      totalCapacity,
      pipeline,
      conversion: rows.length
        ? Math.round((assigned / rows.length) * 1000) / 10
        : 0,
    };
  }, [filteredRows, rows, state.data]);

  async function handleCreateLead(payload) {
    setSaving(true);
    setFormError("");
    try {
      await leadsApi.createLead(payload);
      setDialogOpen(false);
      await loadLeads();
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error.message ||
          "Could not create lead",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleExport() {
    downloadCsv(
      `sparkin-admin-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      buildCsv(filteredRows),
    );
  }

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Leads"
        subtitle="Manage and track all incoming solar enquiries"
        actions={
          <>
            <Button
              startIcon={<DownloadRoundedIcon />}
              onClick={handleExport}
              sx={{
                minHeight: 40,
                px: 1.7,
                borderRadius: "999px",
                bgcolor: "#E9EEF3",
                color: "#1F2C40",
                fontSize: "0.76rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#DDE5EE" },
              }}
            >
              Export Report
            </Button>
            <AdminPrimaryButton
              startIcon={<AddRoundedIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ borderRadius: "999px", minHeight: 40 }}
            >
              Create New Lead
            </AdminPrimaryButton>
          </>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      <AdminPanel sx={{ p: { xs: 1.6, md: 2 }, mb: 2.6 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={2.4}>
            <Typography
              sx={{
                mb: 0.5,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.status}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    status: e.target.value,
                  }))
                }
                sx={{
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.84rem",
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Typography
              sx={{
                mb: 0.5,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Location
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.location}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    location: e.target.value,
                  }))
                }
                sx={{
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.84rem",
                }}
              >
                <MenuItem value="all">All Regions</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Typography
              sx={{
                mb: 0.5,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Date Range
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    dateRange: e.target.value,
                  }))
                }
                sx={{
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.84rem",
                }}
              >
                {dateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Typography
              sx={{
                mb: 0.5,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Payment Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.payment}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    payment: e.target.value,
                  }))
                }
                sx={{
                  borderRadius: "0.75rem",
                  bgcolor: "#F7F9FC",
                  fontSize: "0.84rem",
                }}
              >
                {paymentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Typography
              sx={{
                mb: 0.5,
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              &nbsp;
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={filters.query}
              onChange={(e) =>
                setFilters((current) => ({ ...current, query: e.target.value }))
              }
              placeholder="Search leads"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
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
                endAdornment: (
                  <InputAdornment position="end">
                    <FilterListRoundedIcon
                      sx={{ color: "#0E56C8", fontSize: "1rem" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {[
                  "Lead ID",
                  "Customer Name",
                  "Location",
                  "Size (kW)",
                  "Status",
                  "Payment",
                  "Vendors",
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
                      py: 1.7,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length ? (
                filteredRows
                  .slice((page - 1) * PAGE_SIZE_LEADS, page * PAGE_SIZE_LEADS)
                  .map((row) => (
                    <TableRow
                      key={row.raw.id}
                      hover
                      sx={{ "& td": { borderColor: "#EEF2F6", py: 2 } }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "0.82rem",
                            fontWeight: 900,
                          }}
                        >
                          {formatLeadId(row.raw)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#EEF2F6",
                              color: "#667386",
                              fontSize: "0.72rem",
                              fontWeight: 900,
                            }}
                          >
                            {(row.raw.contact?.fullName || "C")
                              .slice(0, 2)
                              .toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                color: adminUi.colors.text,
                                fontSize: "0.88rem",
                                fontWeight: 850,
                              }}
                            >
                              {row.raw.contact?.fullName || "Customer"}
                            </Typography>
                            <Typography
                              sx={{ color: "#8A96A8", fontSize: "0.7rem" }}
                            >
                              {row.raw.contact?.email ||
                                row.raw.contact?.phoneNumber}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#344155",
                          fontSize: "0.82rem",
                          fontWeight: 650,
                        }}
                      >
                        {row.location}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 0.9,
                            py: 0.4,
                            borderRadius: "999px",
                            bgcolor: "#F0F5A8",
                            color: "#526000",
                            fontSize: "0.7rem",
                            fontWeight: 900,
                          }}
                        >
                          {row.systemSizeKw.toFixed(1)} kW
                        </Box>
                      </TableCell>
                      <TableCell>
                        <LeadPill
                          color={row.statusMeta.color}
                          bg={row.statusMeta.bg}
                        >
                          {row.statusLabel}
                        </LeadPill>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 0.9,
                            py: 0.45,
                            borderRadius: "0.5rem",
                            bgcolor:
                              row.paymentStatus === "paid"
                                ? "#E7F8EF"
                                : row.paymentStatus === "pending"
                                  ? "#FFF4E6"
                                  : "#EEF2F6",
                            color:
                              row.paymentStatus === "paid"
                                ? "#10985E"
                                : row.paymentStatus === "pending"
                                  ? "#B25E00"
                                  : "#657386",
                            fontSize: "0.7rem",
                            fontWeight: 850,
                          }}
                        >
                          {row.paymentLabel}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#344155",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                          maxWidth: 180,
                        }}
                      >
                        {row.vendorLabel}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            component={NavLink}
                            to={`/admin/leads/${row.raw.id}`}
                            size="small"
                            aria-label="View lead"
                            sx={{
                              color: "#0E56C8",
                              bgcolor: "#EEF4FF",
                              borderRadius: "0.6rem",
                              "&:hover": { bgcolor: "#DCE9FF" },
                            }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="Assign vendor"
                            onClick={() =>
                              navigate("/admin/vendor-assignment", {
                                state: { leadId: row.raw.id },
                              })
                            }
                            sx={{
                              color: "#10985E",
                              bgcolor: "#E7F8EF",
                              borderRadius: "0.6rem",
                              "&:hover": { bgcolor: "#D0F2E3" },
                            }}
                          >
                            <GroupAddOutlinedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <AdminEmptyState
                      title="No leads found"
                      subtitle="Adjust filters or create a new operational lead."
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
            {filteredRows.length === 0
              ? "No leads"
              : `Showing ${(page - 1) * PAGE_SIZE_LEADS + 1}–${Math.min(page * PAGE_SIZE_LEADS, filteredRows.length)} of ${filteredRows.length} leads`}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                border: "1px solid #E2E8F0",
                display: "grid",
                placeItems: "center",
                color: page === 1 ? "#C8D4E4" : "#667386",
                cursor: page === 1 ? "default" : "pointer",
                fontSize: "0.9rem",
              }}
            >
              ‹
            </Box>
            {Array.from(
              {
                length: Math.max(
                  1,
                  Math.ceil(filteredRows.length / PAGE_SIZE_LEADS),
                ),
              },
              (_, i) => i + 1,
            )
              .filter(
                (p) =>
                  p === 1 ||
                  p === Math.ceil(filteredRows.length / PAGE_SIZE_LEADS) ||
                  Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <Typography
                    key={`e${i}`}
                    sx={{ color: "#8B97A8", fontSize: "0.8rem", px: 0.3 }}
                  >
                    …
                  </Typography>
                ) : (
                  <Box
                    key={p}
                    onClick={() => setPage(p)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "0.6rem",
                      bgcolor: p === page ? "#0E56C8" : "#FFFFFF",
                      border: p === page ? "none" : "1px solid #E2E8F0",
                      color: p === page ? "#FFFFFF" : "#223146",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.8rem",
                      fontWeight: 900,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      "&:hover": {
                        bgcolor: p === page ? "#0B49AD" : "#EEF4FF",
                      },
                    }}
                  >
                    {p}
                  </Box>
                ),
              )}
            <Box
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    Math.ceil(filteredRows.length / PAGE_SIZE_LEADS),
                    p + 1,
                  ),
                )
              }
              sx={{
                width: 32,
                height: 32,
                borderRadius: "0.6rem",
                border: "1px solid #E2E8F0",
                display: "grid",
                placeItems: "center",
                color:
                  page >= Math.ceil(filteredRows.length / PAGE_SIZE_LEADS)
                    ? "#C8D4E4"
                    : "#667386",
                cursor:
                  page >= Math.ceil(filteredRows.length / PAGE_SIZE_LEADS)
                    ? "default"
                    : "pointer",
                fontSize: "0.9rem",
              }}
            >
              ›
            </Box>
          </Stack>
        </Stack>
      </AdminPanel>

      <Grid container spacing={2.2} sx={{ mt: 2.8 }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            icon={BoltOutlinedIcon}
            title="Total Capacity"
            value={`${metrics.totalCapacity.toFixed(1)} kW`}
            accent="#0E56C8"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            icon={TrendingUpRoundedIcon}
            title="Revenue Pipeline"
            value={`₹${(metrics.pipeline / 100000 || 0).toFixed(1)}L`}
            accent="#8A9700"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            icon={GroupAddOutlinedIcon}
            title="Conversion Rate"
            value={`${metrics.conversion}%`}
            accent="#10985E"
          />
        </Grid>
      </Grid>

      <LeadFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateLead}
        saving={saving}
        error={formError}
      />
    </AdminPageShell>
  );
}

import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
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
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
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
import { adminVendorsApi, getAdminDashboardData } from "@/features/admin/api/adminApi";

const statusFilters = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "hold", label: "Hold" },
  { value: "cancelled", label: "Cancelled" },
];

function getVendorName(vendor) {
  return vendor.company?.name || vendor.account?.fullName || vendor.account?.email || "Vendor";
}

function getLocation(vendor) {
  return [vendor.company?.city, vendor.company?.state].filter(Boolean).join(", ") || vendor.company?.coverageArea || "Location pending";
}

function getStatus(vendor) {
  if (vendor.verificationStatus === "verified") {
    return { key: "active", label: "Active", color: "#10985E", bg: "#DDF8E7" };
  }
  if (vendor.verificationStatus === "rejected") {
    return { key: "cancelled", label: "Cancelled", color: "#D94444", bg: "#FDECEC" };
  }
  return { key: "hold", label: "Hold", color: "#687000", bg: "#E8F000" };
}

function getRating(vendor) {
  const docs = vendor.documents?.length || 0;
  const experience = Number(vendor.company?.experienceYears || 0);
  return Math.min(5, Math.max(3.1, 3.5 + docs * 0.22 + Math.min(experience, 12) * 0.07));
}

function buildVendorRows(data) {
  const leads = data?.leads || [];
  const quotes = data?.quotes || [];
  const vendors = data?.vendors || [];

  return vendors
    .filter((vendor) => vendor.verificationStatus === "verified")
    .map((vendor) => {
    const assignedLeads = leads.filter((lead) => lead.assignedVendorIds?.includes(vendor.vendorId));
    const vendorQuotes = quotes.filter((quote) => quote.vendorId === vendor.vendorId);
    const rejectedQuotes = vendorQuotes.filter((quote) => quote.status === "rejected");

    return {
      vendor,
      status: getStatus(vendor),
      rating: getRating(vendor),
      leadsCount: assignedLeads.length,
      participationCount: vendorQuotes.length,
      rejectedCount: rejectedQuotes.length,
      capacityMw: Number(vendor.company?.totalCapacityMw || 0),
    };
    });
}

function StatusPill({ status }) {
  return (
    <Box sx={{ display: "inline-flex", px: 0.85, py: 0.38, borderRadius: "999px", bgcolor: status.bg, color: status.color, fontSize: "0.62rem", fontWeight: 950, textTransform: "uppercase" }}>
      {status.label}
    </Box>
  );
}

function NetworkCard({ activeCount, capacityMw, growth }) {
  return (
    <AdminPanel
      sx={{
        mt: 3,
        p: { xs: 2.2, md: 2.8 },
        maxWidth: 380,
        bgcolor: "#0E56C8",
        color: "#FFFFFF",
        boxShadow: "0 18px 40px rgba(14,86,200,0.24)",
      }}
    >
      <Typography sx={{ fontSize: "1.25rem", fontWeight: 900 }}>Network Growth</Typography>
      <Typography sx={{ mt: 0.8, color: "#CFE0FF", fontSize: "0.82rem", lineHeight: 1.6 }}>
        Vendor onboarding has changed by {growth}% this quarter, based on verified network movement.
      </Typography>
      <Grid container spacing={2.2} sx={{ mt: 2.6 }}>
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ color: "#AFC8FF", fontSize: "0.62rem", fontWeight: 950, letterSpacing: "0.12em" }}>
            TOTAL ACTIVE VENDORS
          </Typography>
          <Typography sx={{ mt: 0.4, fontSize: "1.75rem", fontWeight: 950 }}>{activeCount}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography sx={{ color: "#AFC8FF", fontSize: "0.62rem", fontWeight: 950, letterSpacing: "0.12em" }}>
            NETWORK CAPACITY
          </Typography>
          <Typography sx={{ mt: 0.4, fontSize: "1.75rem", fontWeight: 950 }}>{capacityMw.toFixed(1)} MW</Typography>
        </Grid>
      </Grid>
    </AdminPanel>
  );
}

export default function AdminVendorsPage() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    status: "all",
    region: "all",
    rating: "all",
    experience: "all",
    query: "",
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeVendor, setActiveVendor] = useState(null);
  const [actionError, setActionError] = useState("");

  async function loadVendors() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const data = await getAdminDashboardData();
      setState({ loading: false, error: "", data });
    } catch (error) {
      setState({
        loading: false,
        error: error?.response?.data?.message || error.message || "Unable to load vendors",
        data: null,
      });
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  const rows = useMemo(() => buildVendorRows(state.data), [state.data]);
  const regions = useMemo(
    () => [...new Set(rows.flatMap((row) => [row.vendor.company?.city, row.vendor.company?.state, row.vendor.company?.coverageArea]).filter(Boolean))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return rows.filter((row) => {
      const vendor = row.vendor;
      const location = getLocation(vendor).toLowerCase();
      const searchable = [
        getVendorName(vendor),
        vendor.account?.fullName,
        vendor.account?.email,
        vendor.account?.phoneNumber,
        vendor.company?.businessType,
        vendor.company?.city,
        vendor.company?.state,
        vendor.company?.coverageArea,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const statusMatch = filters.status === "all" || row.status.key === filters.status;
      const regionMatch = filters.region === "all" || location.includes(filters.region.toLowerCase());
      const ratingMatch = filters.rating === "all" || row.rating >= Number(filters.rating);
      const experienceMatch = filters.experience === "all" || Number(vendor.company?.experienceYears || 0) >= Number(filters.experience);
      const queryMatch = !query || searchable.includes(query);

      return statusMatch && regionMatch && ratingMatch && experienceMatch && queryMatch;
    });
  }, [rows, filters]);

  const metrics = useMemo(() => {
    const activeRows = rows.filter((row) => row.status.key === "active");
    const capacityMw = activeRows.reduce((sum, row) => sum + row.capacityMw, 0);
    const submittedRows = rows.filter((row) => row.vendor.verificationStatus === "submitted");
    const growth = rows.length ? Math.round((submittedRows.length / rows.length) * 100) : 0;

    return {
      activeCount: activeRows.length,
      capacityMw,
      growth,
    };
  }, [rows]);

  function openMenu(event, row) {
    setMenuAnchor(event.currentTarget);
    setActiveVendor(row.vendor);
  }

  function closeMenu() {
    setMenuAnchor(null);
    setActiveVendor(null);
  }

  async function updateStatus(verificationStatus) {
    if (!activeVendor) return;
    setActionError("");
    try {
      await adminVendorsApi.updateVendorStatus(activeVendor.vendorId, { verificationStatus });
      closeMenu();
      await loadVendors();
    } catch (error) {
      setActionError(error?.response?.data?.message || error.message || "Unable to update vendor");
    }
  }

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Vendor Management"
        subtitle="Monitor performance metrics and control vendor participation levels across the Sparkin ecosystem."
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}
      {actionError ? <AdminErrorState>{actionError}</AdminErrorState> : null}

      <AdminPanel sx={{ p: { xs: 1.5, md: 1.8 }, mb: 3, bgcolor: "#F6F8FB" }}>
        <Grid container spacing={1.3} alignItems="center">
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                {statusFilters.map((status) => (
                  <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2.2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Region/Location</InputLabel>
              <Select label="Region/Location" value={filters.region} onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}>
                <MenuItem value="all">Global View</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 1.8 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Rating</InputLabel>
              <Select label="Rating" value={filters.rating} onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))}>
                <MenuItem value="all">Any Rating</MenuItem>
                <MenuItem value="4">4.0+</MenuItem>
                <MenuItem value="4.5">4.5+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Experience</InputLabel>
              <Select label="Experience" value={filters.experience} onChange={(event) => setFilters((current) => ({ ...current, experience: event.target.value }))}>
                <MenuItem value="all">Any Experience</MenuItem>
                <MenuItem value="3">3+ Years</MenuItem>
                <MenuItem value="5">5+ Years</MenuItem>
                <MenuItem value="10">10+ Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Search vendors"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "#8B98AA", fontSize: "1rem" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {["Vendor Name", "Location", "Status", "Exp.", "Rating", "Leads", "Part.", "Rej.", "Actions"].map((heading) => (
                  <TableCell key={heading} sx={{ color: "#738096", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", py: 1.6 }}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length ? (
                filteredRows.map((row) => {
                  const vendor = row.vendor;
                  return (
                    <TableRow key={vendor.vendorId} hover sx={{ "& td": { borderColor: "#EEF2F6", py: 1.8 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar sx={{ width: 34, height: 34, borderRadius: "0.55rem", bgcolor: "#DDEDE3", color: "#466155", fontSize: "0.72rem", fontWeight: 900 }}>
                            {getVendorName(vendor).slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 900 }}>{getVendorName(vendor)}</Typography>
                            <Typography sx={{ color: "#7C8899", fontSize: "0.64rem", fontWeight: 750 }}>{vendor.account?.email || vendor.company?.businessType}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: "#344155", fontSize: "0.76rem", fontWeight: 700 }}>{getLocation(vendor)}</TableCell>
                      <TableCell><StatusPill status={row.status} /></TableCell>
                      <TableCell sx={{ color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 850 }}>{Number(vendor.company?.experienceYears || 0)} Years</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.35} alignItems="center">
                          <StarRoundedIcon sx={{ color: "#7B8500", fontSize: "0.95rem" }} />
                          <Typography sx={{ color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 900 }}>{row.rating.toFixed(1)}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 800 }}>{row.leadsCount.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ color: adminUi.colors.text, fontSize: "0.76rem", fontWeight: 800 }}>{row.participationCount.toLocaleString("en-IN")}</TableCell>
                      <TableCell sx={{ color: "#D94444", fontSize: "0.76rem", fontWeight: 900 }}>{row.rejectedCount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.4}>
                          <IconButton component={NavLink} to={`/admin/vendors/${vendor.vendorId}`} size="small" aria-label="View vendor">
                            <VisibilityOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                          </IconButton>
                          <IconButton size="small" aria-label="Vendor actions" onClick={(event) => openMenu(event, row)}>
                            <MoreVertRoundedIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <AdminEmptyState title="No vendors found" subtitle="Adjust filters or ask vendors to complete onboarding." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ px: 2, py: 1.6, borderTop: "1px solid #EEF2F6" }}>
          <Typography sx={{ color: "#667386", fontSize: "0.78rem", fontWeight: 700 }}>
            Showing {filteredRows.length} of {rows.length} vendors
          </Typography>
          <Button
            onClick={() => setFilters({ status: "all", region: "all", rating: "all", experience: "all", query: "" })}
            sx={{ color: "#0E56C8", fontSize: "0.74rem", fontWeight: 850, textTransform: "none" }}
          >
            Reset filters
          </Button>
        </Stack>
      </AdminPanel>

      <NetworkCard activeCount={metrics.activeCount} capacityMw={metrics.capacityMw} growth={metrics.growth} />

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={() => updateStatus("verified")}>Mark Active</MenuItem>
        <MenuItem onClick={() => updateStatus("draft")}>Put On Hold</MenuItem>
        <MenuItem onClick={() => updateStatus("rejected")} sx={{ color: "#D94444" }}>Cancel Vendor</MenuItem>
      </Menu>
    </AdminPageShell>
  );
}

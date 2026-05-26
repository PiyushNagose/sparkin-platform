import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
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
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import heroBackground from "@/shared/assets/images/public/home/hero-background-placeholder.png";

function formatMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 100000) return `INR ${(amount / 100000).toFixed(2)}L`;
  return `INR ${amount.toLocaleString("en-IN")}`;
}

function formatLocation(lead) {
  return (
    [lead?.installationAddress?.street, lead?.installationAddress?.city]
      .filter(Boolean)
      .join(", ") || "Location pending"
  );
}

function getSystemSize(lead) {
  const size = Number(
    lead?.adminSystemSizeKw || lead?.property?.sanctionedLoadKw || 0,
  );
  if (size > 0) return `${size}kW Rooftop`;
  if (lead?.roof?.sizeRange === "under_500") return "3kW Rooftop";
  if (lead?.roof?.sizeRange === "over_1000") return "10kW Rooftop";
  return "5kW Rooftop";
}

function estimateInstallationCost(lead, quotes) {
  // Use admin-set estimated cost first
  if (lead?.estimatedCost) return lead.estimatedCost;
  const accepted = quotes.find(
    (quote) => String(quote.leadId) === String(lead?.id),
  );
  if (accepted?.pricing?.totalPrice) return accepted.pricing.totalPrice;

  const size = Number(
    lead?.adminSystemSizeKw || lead?.property?.sanctionedLoadKw || 5,
  );
  return Math.max(size, 3) * 65000;
}

function formatBidRange(lead) {
  if (lead?.bidRange?.minAmount && lead?.bidRange?.maxAmount) {
    return `${formatMoney(lead.bidRange.minAmount)} - ${formatMoney(lead.bidRange.maxAmount)}`;
  }

  return formatMoney(estimateInstallationCost(lead, []));
}

function getVendorName(vendor) {
  return (
    vendor.company?.name ||
    vendor.account?.fullName ||
    vendor.account?.email ||
    "Vendor"
  );
}

function getVendorCity(vendor) {
  return (
    vendor.company?.city ||
    vendor.company?.coverageArea ||
    "Service area pending"
  );
}

function getVendorRating(vendor) {
  const docs = vendor.documents?.length || 0;
  const experience = Number(vendor.company?.experienceYears || 0);
  return Math.min(
    5,
    Math.max(3.8, 3.8 + docs * 0.2 + Math.min(experience, 10) * 0.06),
  );
}

function getParticipationRate(vendor) {
  const completed = Number(vendor.company?.projectsCompleted || 0);
  const experience = Number(vendor.company?.experienceYears || 0);
  return Math.min(98, Math.max(55, 62 + completed * 0.4 + experience * 2));
}

function isVendorActive(vendor) {
  return vendor.verificationStatus === "verified";
}

function LeadSummary({ lead, quotes }) {
  return (
    <AdminPanel sx={{ mb: 2.8, overflow: "hidden" }}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              minHeight: 190,
              height: "100%",
              background: `linear-gradient(90deg, rgba(14,86,200,0.18), rgba(255,255,255,0.88)), url(${heroBackground}) center/cover`,
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ p: { xs: 2.2, md: 2.8 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Stack direction="row" spacing={0.8} sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      px: 0.9,
                      py: 0.38,
                      borderRadius: "0.4rem",
                      bgcolor: "#D7E600",
                      color: "#3C4700",
                      fontSize: "0.64rem",
                      fontWeight: 950,
                      letterSpacing: "0.06em",
                    }}
                  >
                    LEAD SUMMARY
                  </Box>
                  <Box
                    sx={{
                      px: 0.9,
                      py: 0.38,
                      borderRadius: "0.4rem",
                      bgcolor: "#DFF7E8",
                      color: "#00884E",
                      fontSize: "0.64rem",
                      fontWeight: 950,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {lead.status === "vendors_assigned"
                      ? "VENDORS ASSIGNED"
                      : lead.status?.replaceAll("_", " ").toUpperCase()}
                  </Box>
                </Stack>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "1.5rem",
                    fontWeight: 900,
                  }}
                >
                  {lead.contact?.fullName || "Customer"}
                </Typography>
              </Box>
              <Stack direction="row" spacing={5}>
                <Box>
                  <Typography
                    sx={{
                      color: "#667386",
                      fontSize: "0.62rem",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    System Size
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.4,
                      color: "#0E56C8",
                      fontSize: "1.05rem",
                      fontWeight: 900,
                    }}
                  >
                    {getSystemSize(lead)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "#667386",
                      fontSize: "0.62rem",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Installation Cost
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.4,
                      color: adminUi.colors.text,
                      fontSize: "1.05rem",
                      fontWeight: 900,
                    }}
                  >
                    {formatBidRange(lead)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Grid container spacing={1.6} sx={{ mt: 2.4 }}>
              <Grid item xs={12} md={4}>
                <InfoTile
                  icon={LocationOnOutlinedIcon}
                  title="Location"
                  value={formatLocation(lead)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoTile
                  icon={CalendarMonthOutlinedIcon}
                  title="Requested Timeline"
                  value={lead.inspection?.preferredDate || "Within 15 Days"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoTile
                  icon={SecurityOutlinedIcon}
                  title="Project Status"
                  value={lead.status?.replaceAll("_", " ") || "Pending"}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </AdminPanel>
  );
}

function InfoTile({ icon: Icon, title, value }) {
  return (
    <Box
      sx={{
        p: 1.4,
        borderRadius: "0.9rem",
        bgcolor: "#F2F5F8",
        display: "flex",
        gap: 1.1,
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{ width: 34, height: 34, bgcolor: "#FFFFFF", color: "#0E56C8" }}
      >
        <Icon sx={{ fontSize: "1rem" }} />
      </Avatar>
      <Box>
        <Typography
          sx={{ color: "#728095", fontSize: "0.62rem", fontWeight: 850 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: adminUi.colors.text,
            fontSize: "0.78rem",
            fontWeight: 850,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AdminVendorAssignmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [filters, setFilters] = useState({
    region: "all",
    status: "all",
    experience: "0",
    rating: "0",
    query: "",
  });
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [actionError, setActionError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectAllMode, setSelectAllMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAssignmentData() {
      try {
        const data = await getAdminDashboardData();
        if (!active) return;

        const requestedLeadId = location.state?.leadId;
        const lead =
          data.leads.find(
            (item) => String(item.id) === String(requestedLeadId),
          ) ||
          data.leads.find((item) =>
            ["verified", "vendors_assigned", "open_for_quotes"].includes(
              item.status,
            ),
          ) ||
          data.leads[0] ||
          null;

        setSelectedVendorIds(lead?.assignedVendorIds || []);
        setState({ loading: false, error: "", data: { ...data, lead } });
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error:
              error?.response?.data?.message ||
              error.message ||
              "Unable to load vendor assignment",
            data: null,
          });
        }
      }
    }

    loadAssignmentData();
    return () => {
      active = false;
    };
  }, [location.state?.leadId]);

  const vendors = useMemo(() => {
    const lead = state.data?.lead;
    const allVendors = state.data?.vendors || [];

    return allVendors
      .filter((vendor) => vendor.verificationStatus === "verified")
      .map((vendor) => ({
        ...vendor,
        rating: getVendorRating(vendor),
        participation: getParticipationRate(vendor),
      }))
      .filter((vendor) => {
        const query = filters.query.trim().toLowerCase();
        const city = getVendorCity(vendor).toLowerCase();
        const coverage = vendor.company?.coverageArea?.toLowerCase() || "";
        const stateName = vendor.company?.state?.toLowerCase() || "";
        const searchableText = [
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
        const matchesRegion =
          filters.region === "all" ||
          stateName === filters.region.toLowerCase() ||
          city.includes(filters.region.toLowerCase()) ||
          coverage.includes(filters.region.toLowerCase());
        const matchesStatus =
          filters.status === "all" ||
          (filters.status === "active"
            ? isVendorActive(vendor)
            : !isVendorActive(vendor));
        const matchesExperience =
          Number(vendor.company?.experienceYears || 0) >=
          Number(filters.experience);
        const matchesRating = vendor.rating >= Number(filters.rating);
        const matchesQuery = !query || searchableText.includes(query);

        return (
          matchesRegion &&
          matchesStatus &&
          matchesExperience &&
          matchesRating &&
          matchesQuery
        );
      });
  }, [state.data, filters]);

  const regions = useMemo(() => {
    const values = (state.data?.vendors || [])
      .flatMap((vendor) => [
        vendor.company?.city,
        vendor.company?.state,
        vendor.company?.coverageArea,
      ])
      .filter(Boolean);
    return [...new Set(values)];
  }, [state.data]);

  function toggleVendor(vendorId) {
    setSelectedVendorIds((current) =>
      current.includes(vendorId)
        ? current.filter((item) => item !== vendorId)
        : [...current, vendorId],
    );
  }

  async function handleAssign() {
    if (!state.data?.lead || (!selectedVendorIds.length && !selectAllMode))
      return;

    setIsAssigning(true);
    setActionError("");
    try {
      await leadsApi.assignVendors(state.data.lead.id, {
        vendorIds: selectAllMode ? [] : selectedVendorIds,
        selectAll: selectAllMode,
      });
      navigate(`/admin/leads/${state.data.lead.id}`);
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to assign vendors",
      );
    } finally {
      setIsAssigning(false);
    }
  }

  if (state.loading) return <AdminLoadingState />;

  if (state.error || !state.data?.lead) {
    return (
      <AdminPageShell>
        <AdminPageHeader
          title="Assign Qualified Vendors"
          subtitle="Select a verified lead before assigning vendors."
        />
        <AdminErrorState>
          {state.error || "No lead is available for vendor assignment."}
        </AdminErrorState>
      </AdminPageShell>
    );
  }

  const lead = state.data.lead;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Assign Qualified Vendors"
        subtitle="Select qualified vendors for this verified lead."
      />

      <LeadSummary lead={lead} quotes={state.data.quotes || []} />

      {actionError ? <AdminErrorState>{actionError}</AdminErrorState> : null}

      <AdminPanel sx={{ p: { xs: 1.5, md: 1.8 }, mb: 2.2, bgcolor: "#F6F8FB" }}>
        <Grid container spacing={1.3} alignItems="center">
          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                label="Region"
                value={filters.region}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    region: event.target.value,
                  }))
                }
              >
                <MenuItem value="all">All Regions</MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>Vendor Status</InputLabel>
              <Select
                label="Vendor Status"
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <MenuItem value="all">All Vendors</MenuItem>
                <MenuItem value="active">All Active</MenuItem>
                <MenuItem value="inactive">Inactive / Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Experience</InputLabel>
              <Select
                label="Experience"
                value={filters.experience}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    experience: event.target.value,
                  }))
                }
              >
                <MenuItem value="0">Any Experience</MenuItem>
                <MenuItem value="3">3+ Years</MenuItem>
                <MenuItem value="5">5+ Years</MenuItem>
                <MenuItem value="8">8+ Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Min. Rating</InputLabel>
              <Select
                label="Min. Rating"
                value={filters.rating}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    rating: event.target.value,
                  }))
                }
              >
                <MenuItem value="0">Any Rating</MenuItem>
                <MenuItem value="4">4.0+</MenuItem>
                <MenuItem value="4.5">4.5+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <TextField
              fullWidth
              size="small"
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Search vendors"
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
          </Grid>
          <Grid item xs={12} md={0.8}>
            <Button
              fullWidth
              onClick={() =>
                setFilters({
                  region: "all",
                  status: "all",
                  experience: "0",
                  rating: "0",
                  query: "",
                })
              }
              sx={{
                minHeight: 38,
                borderRadius: "0.55rem",
                bgcolor: "#23272E",
                color: "#FFFFFF",
                fontSize: "0.7rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#111418" },
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </AdminPanel>

      <AdminPanel sx={{ overflow: "hidden", mb: 2.2 }}>
        <Box
          sx={{
            px: 2.2,
            py: 1.6,
            borderBottom: "1px solid #EEF2F6",
            bgcolor: "#FFFBEA",
            borderRadius: "1.2rem 1.2rem 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "#7A6B00", fontSize: "0.76rem", fontWeight: 800 }}
          >
            ⚡ Vendors must submit quotes below the estimated cost of{" "}
            <Box component="span" sx={{ color: "#0E56C8" }}>
              {formatMoney(
                estimateInstallationCost(lead, state.data?.quotes || []),
              )}
            </Box>
            . Bids above this amount will not be accepted.
          </Typography>
          <Button
            onClick={() => {
              setSelectAllMode(!selectAllMode);
              if (!selectAllMode) {
                setSelectedVendorIds([]);
              }
            }}
            sx={{
              ml: 2,
              px: 1.5,
              py: 0.6,
              borderRadius: "0.5rem",
              bgcolor: selectAllMode ? "#0E56C8" : "#E8EAED",
              color: selectAllMode ? "#FFFFFF" : "#3C4700",
              fontSize: "0.72rem",
              fontWeight: 900,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: selectAllMode ? "#0A3FA0" : "#D8DADD",
              },
            }}
          >
            {selectAllMode ? "✓ Select All" : "Select All"}
          </Button>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F8FB" }}>
                {[
                  "",
                  "Vendor Name",
                  "Location",
                  "Status",
                  "Experience",
                  "Rating",
                  "Participation Rate",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "#738096",
                      fontSize: "0.66rem",
                      fontWeight: 900,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      py: 1.5,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.length ? (
                vendors.map((vendor) => {
                  const selected = selectedVendorIds.includes(vendor.vendorId);
                  return (
                    <TableRow
                      key={vendor.vendorId}
                      hover
                      sx={{ "& td": { borderColor: "#EEF2F6", py: 2 } }}
                    >
                      <TableCell width={54}>
                        <Checkbox
                          checked={selected}
                          onChange={() => toggleVendor(vendor.vendorId)}
                          sx={{
                            color: "#C8D4E4",
                            "&.Mui-checked": { color: "#0E56C8" },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "0.7rem",
                              bgcolor: "#DADDE2",
                              color: "#596579",
                              fontSize: "0.76rem",
                              fontWeight: 900,
                            }}
                          >
                            {getVendorName(vendor).slice(0, 2).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                color: adminUi.colors.text,
                                fontSize: "0.88rem",
                                fontWeight: 900,
                              }}
                            >
                              {getVendorName(vendor)}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#7C8899",
                                fontSize: "0.64rem",
                                fontWeight: 750,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {vendor.company?.businessType || "Solar Partner"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#344155",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {getVendorCity(vendor)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 0.9,
                            py: 0.4,
                            borderRadius: "999px",
                            bgcolor: isVendorActive(vendor)
                              ? "#E7F8EF"
                              : "#FFF0EA",
                            color: isVendorActive(vendor)
                              ? "#10985E"
                              : "#D95A2B",
                            fontSize: "0.68rem",
                            fontWeight: 900,
                          }}
                        >
                          {isVendorActive(vendor) ? "Active" : "On Hold"}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: adminUi.colors.text,
                          fontSize: "0.82rem",
                          fontWeight: 850,
                        }}
                      >
                        {Number(vendor.company?.experienceYears || 0)} Years
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.3}
                          alignItems="center"
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarRoundedIcon
                              key={i}
                              sx={{
                                fontSize: "0.9rem",
                                color:
                                  i < Math.round(vendor.rating)
                                    ? "#F0C419"
                                    : "#E2E8F0",
                              }}
                            />
                          ))}
                          <Typography
                            sx={{
                              ml: 0.5,
                              color: adminUi.colors.text,
                              fontSize: "0.78rem",
                              fontWeight: 850,
                            }}
                          >
                            {vendor.rating.toFixed(1)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#0E56C8",
                          fontSize: "0.9rem",
                          fontWeight: 950,
                        }}
                      >
                        {Math.round(vendor.participation)}%
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <AdminEmptyState
                      title="No qualified vendors found"
                      subtitle="Adjust filters or complete vendor profiles before assignment."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            px: 2.2,
            py: 1.6,
            borderTop: "1px solid #EEF2F6",
            color: "#667386",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          Showing {vendors.length} eligible vendors for{" "}
          {lead.installationAddress?.city || "this lead"}
        </Box>
      </AdminPanel>

      <AdminPanel
        sx={{
          p: { xs: 2, md: 2.4 },
          bgcolor: "#111923",
          color: "#FFFFFF",
          boxShadow: "0 18px 38px rgba(17,25,35,0.24)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                borderRadius: "0.85rem",
                width: 44,
                height: 44,
              }}
            >
              <Groups2OutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "1.35rem", fontWeight: 900 }}>
                {selectAllMode
                  ? `${vendors.length} Vendors Selected`
                  : `${selectedVendorIds.length} Vendors Selected`}
              </Typography>
              <Typography
                sx={{ mt: 0.2, color: "#B7C1D0", fontSize: "0.78rem" }}
              >
                {selectAllMode
                  ? "All verified vendors will receive quotes"
                  : "Eligible to receive and submit quotes"}
              </Typography>
            </Box>
          </Stack>
          <AdminPrimaryButton
            disabled={
              (!selectedVendorIds.length && !selectAllMode) || isAssigning
            }
            onClick={handleAssign}
            endIcon={<BoltOutlinedIcon />}
            sx={{
              minWidth: 280,
              minHeight: 52,
              borderRadius: "999px",
              fontSize: "0.92rem",
              fontWeight: 900,
            }}
          >
            {isAssigning ? "Assigning..." : "Assign Vendors & Invite Quotes"}
          </AdminPrimaryButton>
        </Stack>
      </AdminPanel>
    </AdminPageShell>
  );
}

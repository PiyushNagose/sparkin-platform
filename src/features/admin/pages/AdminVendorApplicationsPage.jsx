import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { vendorApplicationsApi } from "@/features/admin/api/vendorApplicationsApi";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_META = {
  draft: { label: "Draft", tone: "#8B97A8", bg: "#F2F5F8" },
  submitted: { label: "Pending", tone: "#556478", bg: "#EEF2F6" },
  verified: { label: "Approved", tone: "#239654", bg: "#DDF8E7" },
  rejected: { label: "Rejected", tone: "#D94444", bg: "#FDECEC" },
};

// Map display filter values → DB values
const STATUS_FILTER_MAP = {
  All: null,
  Pending: "submitted",
  "Under Review": "submitted",
  Approved: "verified",
  Rejected: "rejected",
  Draft: "draft",
};

const EXPERIENCE_FILTER_MAP = {
  "All Experience": 0,
  "5+ Years": 5,
  "8+ Years": 8,
  "10+ Years": 10,
  "15+ Years": 15,
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "VN"
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getExperienceLabel(years) {
  if (!years) return "—";
  return `${years}+ Years`;
}

function getVettingScore(vendor) {
  // Compute a simple score based on completeness
  let score = 0;
  if (vendor.account?.fullName) score += 1;
  if (vendor.account?.phoneNumber) score += 1;
  if (vendor.company?.name) score += 1;
  if (vendor.company?.gstNumber) score += 1;
  if (vendor.company?.experienceYears > 0) score += 1;
  if (vendor.company?.projectsCompleted > 0) score += 1;
  if (vendor.documents?.length >= 1) score += 2;
  if (vendor.documents?.length >= 2) score += 1;
  if (vendor.company?.totalCapacityMw > 0) score += 1;
  return Math.min(10, score);
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function downloadCsv(vendors) {
  const rows = [
    [
      "Vendor ID",
      "Name",
      "Email",
      "Company",
      "City",
      "State",
      "Experience (yrs)",
      "Projects",
      "Status",
      "Submitted At",
    ],
    ...vendors.map((v) => [
      v.vendorId,
      v.account?.fullName,
      v.account?.email,
      v.company?.name,
      v.company?.city,
      v.company?.state,
      v.company?.experienceYears,
      v.company?.projectsCompleted,
      v.verificationStatus,
      formatDate(v.onboardingSubmittedAt || v.createdAt),
    ]),
  ];
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sparkin-vendor-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminVendorApplicationsPage() {
  const navigate = useNavigate();

  const [allVendors, setAllVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Regions");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");

  // quick-action loading
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const vendors = await vendorApplicationsApi.list();
      setAllVendors(vendors);
      setPage(1);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load vendor applications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── derived ───────────────────────────────────────────────────────────────

  // Unique states for location filter
  const locationOptions = useMemo(() => {
    const states = [
      ...new Set(allVendors.map((v) => v.company?.state).filter(Boolean)),
    ].sort();
    return ["All Regions", ...states];
  }, [allVendors]);

  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dbStatus = STATUS_FILTER_MAP[statusFilter];
    const minExp = EXPERIENCE_FILTER_MAP[experienceFilter] || 0;

    return allVendors.filter((v) => {
      if (dbStatus && v.verificationStatus !== dbStatus) return false;
      if (
        locationFilter !== "All Regions" &&
        v.company?.state !== locationFilter
      )
        return false;
      if (minExp > 0 && (v.company?.experienceYears || 0) < minExp)
        return false;
      if (q) {
        return [
          v.account?.fullName,
          v.account?.email,
          v.company?.name,
          v.company?.city,
          v.company?.state,
          v.vendorId,
        ].some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(q),
        );
      }
      return true;
    });
  }, [allVendors, search, statusFilter, locationFilter, experienceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / PAGE_SIZE));
  const visibleVendors = filteredVendors.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  const firstVisible =
    filteredVendors.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisible =
    filteredVendors.length === 0
      ? 0
      : Math.min(page * PAGE_SIZE, filteredVendors.length);

  // ── quick approve from list ───────────────────────────────────────────────

  async function handleQuickApprove(vendor) {
    setActionLoading(vendor.vendorId);
    try {
      const updated = await vendorApplicationsApi.approve(vendor.vendorId);
      setAllVendors((prev) =>
        prev.map((v) =>
          v.vendorId === vendor.vendorId
            ? {
                ...v,
                verificationStatus: updated?.verificationStatus || "verified",
              }
            : v,
        ),
      );
      setToast({
        open: true,
        message: `${vendor.account?.fullName || "Vendor"} approved.`,
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not approve.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Partner Applications"
        subtitle="Review and manage incoming vendor partnership requests. Vet applicants based on industry experience and regional presence to maintain grid quality."
        actions={
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => downloadCsv(filteredVendors)}
            disabled={filteredVendors.length === 0}
            sx={{
              minHeight: 44,
              px: 2.2,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              fontSize: "0.86rem",
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(14,86,200,0.22)",
              "&:hover": { bgcolor: "#0B49AD" },
            }}
          >
            Export List
          </Button>
        }
      />

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}

      <AdminPanel sx={{ overflow: "hidden" }}>
        {/* Filters bar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", md: "center" }}
          flexWrap="wrap"
          sx={{
            px: 2.5,
            py: 1.8,
            borderBottom: "1px solid rgba(225,232,241,0.96)",
            gap: 1,
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search applicant, company…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: 220,
              "& .MuiOutlinedInput-root": {
                height: 34,
                borderRadius: "0.65rem",
                bgcolor: "#F6F8FB",
                fontSize: "0.8rem",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "#9AAABB", fontSize: "0.95rem" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.78rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            FILTER BY:
          </Typography>

          {/* Status */}
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography
              sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
            >
              Status:
            </Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                height: 34,
                borderRadius: "0.65rem",
                fontSize: "0.8rem",
                minWidth: 110,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(225,232,241,0.96)",
                },
              }}
            >
              {Object.keys(STATUS_FILTER_MAP).map((s) => (
                <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Location */}
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography
              sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
            >
              Location:
            </Typography>
            <Select
              size="small"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                height: 34,
                borderRadius: "0.65rem",
                fontSize: "0.8rem",
                minWidth: 130,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(225,232,241,0.96)",
                },
              }}
            >
              {locationOptions.map((l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: "0.82rem" }}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* Experience */}
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography
              sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
            >
              Experience:
            </Typography>
            <Select
              size="small"
              value={experienceFilter}
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                height: 34,
                borderRadius: "0.65rem",
                fontSize: "0.8rem",
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(225,232,241,0.96)",
                },
              }}
            >
              {Object.keys(EXPERIENCE_FILTER_MAP).map((e) => (
                <MenuItem key={e} value={e} sx={{ fontSize: "0.82rem" }}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Box sx={{ ml: { md: "auto" }, display: "flex", gap: 0.8 }}>
            <Tooltip title="More filters">
              <IconButton
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid rgba(225,232,241,0.96)",
                  borderRadius: "0.6rem",
                  color: adminUi.colors.muted,
                }}
              >
                <FilterListRoundedIcon sx={{ fontSize: "0.9rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={load}
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid rgba(225,232,241,0.96)",
                  borderRadius: "0.6rem",
                  color: "#D94444",
                }}
              >
                <RefreshRoundedIcon sx={{ fontSize: "0.9rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        {/* Column headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 0.9fr 1fr 1fr 1.4fr",
            gap: 1,
            px: 2.5,
            py: 1.4,
            bgcolor: "#F6F8FB",
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          {[
            "Applicant Name",
            "Company Name",
            "Location",
            "Experience",
            "Date Received",
            "Status",
            "Actions",
          ].map((h) => (
            <Typography
              key={h}
              sx={{
                color: "#738096",
                fontSize: "0.62rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {isLoading ? <AdminLoadingState minHeight={200} /> : null}

        {!isLoading && filteredVendors.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <AdminEmptyState
              title="No applications found"
              subtitle={
                search || statusFilter !== "All"
                  ? "Try adjusting your filters."
                  : "Vendor applications will appear here once vendors submit their profiles."
              }
            />
          </Box>
        ) : null}

        {visibleVendors.map((vendor, index) => {
          const statusDef =
            STATUS_META[vendor.verificationStatus] || STATUS_META.draft;
          const expYears = vendor.company?.experienceYears || 0;
          const isActioning = actionLoading === vendor.vendorId;
          const canApprove = vendor.verificationStatus === "submitted";

          return (
            <Box
              key={vendor.vendorId}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 0.9fr 1fr 1fr 1.4fr",
                gap: 1,
                px: 2.5,
                py: 2,
                alignItems: "center",
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(225,232,241,0.96)",
                "&:hover": { bgcolor: "#F7F9FC" },
                transition: "background 0.15s",
              }}
            >
              {/* Applicant */}
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "#EEF2F6",
                    color: "#667386",
                    fontSize: "0.76rem",
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(vendor.account?.fullName)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.88rem",
                      fontWeight: 900,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {vendor.account?.fullName || "—"}
                  </Typography>
                  <Typography
                    sx={{
                      color: adminUi.colors.muted,
                      fontSize: "0.72rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {vendor.account?.email || "—"}
                  </Typography>
                </Box>
              </Stack>

              {/* Company */}
              <Typography
                sx={{ color: "#344155", fontSize: "0.86rem", fontWeight: 800 }}
              >
                {vendor.company?.name || "—"}
              </Typography>

              {/* Location */}
              <Box>
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "0.84rem",
                    fontWeight: 700,
                  }}
                >
                  {vendor.company?.city || "—"}
                </Typography>
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}
                >
                  {vendor.company?.state || ""}
                </Typography>
              </Box>

              {/* Experience */}
              <Typography
                sx={{
                  color:
                    expYears >= 10
                      ? "#239654"
                      : expYears >= 5
                        ? "#0E56C8"
                        : "#8B97A8",
                  fontSize: "0.84rem",
                  fontWeight: 900,
                }}
              >
                {expYears > 0 ? getExperienceLabel(expYears) : "—"}
              </Typography>

              {/* Date */}
              <Typography sx={{ color: "#667386", fontSize: "0.82rem" }}>
                {formatDate(vendor.onboardingSubmittedAt || vendor.createdAt)}
              </Typography>

              {/* Status */}
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.9,
                  py: 0.4,
                  borderRadius: "0.5rem",
                  bgcolor: statusDef.bg,
                  color: statusDef.tone,
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  alignItems: "center",
                  gap: 0.5,
                  width: "fit-content",
                }}
              >
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: statusDef.tone,
                  }}
                />
                {statusDef.label}
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={0.6} alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate(`/admin/vendor-applications/${vendor.vendorId}`)
                  }
                  startIcon={
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: "0.85rem !important" }}
                    />
                  }
                  sx={{
                    borderRadius: "0.7rem",
                    borderColor: "rgba(225,232,241,0.96)",
                    color: adminUi.colors.text,
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 1.2,
                    py: 0.6,
                    bgcolor: "#F4F7FB",
                    "&:hover": {
                      bgcolor: "#EEF4FF",
                      borderColor: "#0E56C8",
                      color: "#0E56C8",
                    },
                  }}
                >
                  View
                </Button>
                {canApprove && (
                  <Tooltip title="Quick approve">
                    <IconButton
                      size="small"
                      disabled={isActioning}
                      onClick={() => handleQuickApprove(vendor)}
                      sx={{
                        color: "#239654",
                        bgcolor: "#DDF8E7",
                        borderRadius: "0.55rem",
                        "&:hover": { bgcolor: "#B8EAC8" },
                      }}
                    >
                      <CheckCircleOutlineRoundedIcon
                        sx={{ fontSize: "0.95rem" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          );
        })}

        {/* Pagination */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.4}
          sx={{
            px: 2.5,
            py: 1.8,
            borderTop: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          <Typography sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}>
            {filteredVendors.length === 0
              ? "No applications"
              : `Showing ${firstVisible}–${lastVisible} of ${filteredVendors.length} partner applications`}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              size="small"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.5rem",
                border: "1px solid rgba(225,232,241,0.96)",
                color: adminUi.colors.muted,
                "&:disabled": { opacity: 0.4 },
              }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
            {pageNumbers.map((n, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev && n - prev > 1;
              return (
                <Stack
                  key={n}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                >
                  {showEllipsis && (
                    <Typography
                      sx={{ color: "#8B97A8", fontSize: "0.72rem", px: 0.3 }}
                    >
                      …
                    </Typography>
                  )}
                  <Box
                    onClick={() => setPage(n)}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.5rem",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      bgcolor: n === page ? "#0E56C8" : "transparent",
                      color: n === page ? "#FFFFFF" : adminUi.colors.muted,
                      border:
                        n === page
                          ? "none"
                          : "1px solid rgba(225,232,241,0.96)",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      transition: "all 0.15s",
                      "&:hover": {
                        bgcolor: n === page ? "#0B49AD" : "#EEF4FF",
                      },
                    }}
                  >
                    {n}
                  </Box>
                </Stack>
              );
            })}
            <IconButton
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.5rem",
                border: "1px solid rgba(225,232,241,0.96)",
                color: adminUi.colors.muted,
                "&:disabled": { opacity: 0.4 },
              }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Stack>
        </Stack>
      </AdminPanel>

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

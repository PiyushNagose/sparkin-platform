import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { offersApi } from "@/features/admin/api/offersApi";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_META = {
  active: { label: "ACTIVE", tone: "#239654", bg: "#DDF8E7" },
  draft: { label: "DRAFT", tone: "#667386", bg: "#EEF2F6" },
  expired: { label: "EXPIRED", tone: "#D94444", bg: "#FDECEC" },
  disabled: { label: "DISABLED", tone: "#556478", bg: "#EEF2F6" },
  scheduled: { label: "SCHEDULED", tone: "#0E56C8", bg: "#EEF4FF" },
};

const OFFER_ICONS = ["🌿", "⚡", "🖥️", "☀️", "🔋", "💡", "🏠", "🌱"];
const ICON_BGS = [
  "#DDF8E7",
  "#FFF4D6",
  "#EEF4FF",
  "#FFF9E6",
  "#E8F0FF",
  "#FFFDE7",
  "#F0FAF4",
  "#E8FAEF",
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getDiscountLabel(offer) {
  if (offer.discountType === "percentage") return `${offer.discountValue}% OFF`;
  if (offer.discountType === "flat")
    return `₹${offer.discountValue.toLocaleString("en-IN")} OFF`;
  return `₹${offer.discountValue.toLocaleString("en-IN")} CREDIT`;
}

function getDiscountTypeLabel(offer) {
  if (offer.discountType === "percentage") return "Percentage Discount";
  if (offer.discountType === "flat") return "Fixed Amount";
  return "Flat Credit";
}

function getDiscountColor(offer) {
  if (offer.discountType === "percentage") return "#239654";
  if (offer.discountType === "flat") return "#D97706";
  return "#556478";
}

function getUsagePct(offer) {
  if (!offer.totalUsageLimit) return 0;
  return Math.min(
    100,
    Math.round((offer.usedCount / offer.totalUsageLimit) * 100),
  );
}

function getBarColor(pct) {
  if (pct >= 90) return "#D94444";
  if (pct >= 60) return "#D97706";
  return "#0E56C8";
}

function getOfferIcon(offer, index) {
  return {
    icon: OFFER_ICONS[index % OFFER_ICONS.length],
    bg: ICON_BGS[index % ICON_BGS.length],
  };
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function downloadCsv(offers) {
  const rows = [
    [
      "Offer ID",
      "Name",
      "Code",
      "Type",
      "Value",
      "Used",
      "Limit",
      "Valid From",
      "Valid To",
      "Status",
    ],
    ...offers.map((o) => [
      o.offerId,
      o.name,
      o.couponCode,
      getDiscountTypeLabel(o),
      getDiscountLabel(o),
      o.usedCount,
      o.totalUsageLimit ?? "Unlimited",
      formatDate(o.validFrom),
      formatDate(o.validTo),
      o.status,
    ]),
  ];
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sparkin-offers-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminOffersPage() {
  const navigate = useNavigate();

  // data
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    activeCount: 0,
    totalCount: 0,
    totalRedemptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // actions
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, page]);

  const load = useCallback(
    async (p = page, sf = statusFilter, sq = search) => {
      setIsLoading(true);
      setError("");
      try {
        const [result, statsResult] = await Promise.all([
          offersApi.list({
            page: p,
            limit: PAGE_SIZE,
            ...(sf !== "all" ? { status: sf } : {}),
            ...(sq.trim() ? { search: sq.trim() } : {}),
          }),
          offersApi.getStats(),
        ]);
        setOffers(result.offers || []);
        setTotal(result.total || 0);
        setStats(statsResult);
      } catch (err) {
        setError(err?.response?.data?.message || "Could not load offers.");
      } finally {
        setIsLoading(false);
      }
    },
    [page, statusFilter, search],
  );

  useEffect(() => {
    load(page, statusFilter, search);
  }, [page, statusFilter]);

  // debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      load(1, statusFilter, search);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  async function handleToggleStatus(offer) {
    const newStatus = offer.status === "active" ? "disabled" : "active";
    setActionLoading(offer.offerId);
    try {
      const updated = await offersApi.toggleStatus(offer.offerId, newStatus);
      setOffers((prev) =>
        prev.map((o) => (o.offerId === updated.offerId ? updated : o)),
      );
      setToast({
        open: true,
        message: `"${offer.name}" ${newStatus === "active" ? "activated" : "disabled"}.`,
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update status.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  async function handleDelete(offer) {
    if (!window.confirm(`Delete "${offer.name}"? This cannot be undone.`))
      return;
    setActionLoading(offer.offerId);
    try {
      await offersApi.remove(offer.offerId);
      setToast({
        open: true,
        message: `"${offer.name}" deleted.`,
        severity: "success",
      });
      load(page, statusFilter, search);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not delete offer.",
        severity: "error",
      });
    } finally {
      setActionLoading("");
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => {});
    setToast({
      open: true,
      message: `Code "${code}" copied.`,
      severity: "success",
    });
  }

  const firstVisible = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisible = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

  // Best performing offer (most used)
  const topOffer = offers.reduce(
    (best, o) => (!best || o.usedCount > best.usedCount ? o : best),
    null,
  );

  return (
    <AdminPageShell>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: { xs: "1.9rem", md: "2.3rem" },
              fontWeight: 850,
              lineHeight: 1,
            }}
          >
            Offers & Coupons
          </Typography>
          <Typography
            sx={{
              mt: 0.7,
              maxWidth: 520,
              color: adminUi.colors.muted,
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            Manage your promotional strategy and discount campaigns with
            precision energy.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}
        >
          <Stack
            direction="row"
            sx={{
              border: "1px solid rgba(225,232,241,0.96)",
              borderRadius: "0.85rem",
              overflow: "hidden",
            }}
          >
            <Button
              onClick={() => navigate("/admin/offers/create")}
              sx={{
                px: 2.2,
                py: 1,
                borderRadius: 0,
                bgcolor: "#FFFFFF",
                color: adminUi.colors.muted,
                fontSize: "0.84rem",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { bgcolor: "#F4F7FB" },
              }}
            >
              Create Offer
            </Button>
            <Button
              sx={{
                px: 2.2,
                py: 1,
                borderRadius: 0,
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                fontSize: "0.84rem",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { bgcolor: "#0B49AD" },
              }}
            >
              Offers List
            </Button>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/admin/offers/create")}
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
            New Strategy
          </Button>
        </Stack>
      </Stack>

      {error ? <AdminErrorState>{error}</AdminErrorState> : null}

      {/* Stats row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 2.5,
        }}
      >
        <AdminPanel sx={{ p: 2.4 }}>
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.62rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 0.6,
            }}
          >
            Total Active Coupons
          </Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1.5}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "2.4rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {isLoading ? "—" : stats.activeCount}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mb: 0.4 }}
            >
              <TrendingUpRoundedIcon
                sx={{ color: "#239654", fontSize: "0.9rem" }}
              />
              <Typography
                sx={{ color: "#239654", fontSize: "0.78rem", fontWeight: 800 }}
              >
                {stats.totalCount} total
              </Typography>
            </Stack>
          </Stack>
        </AdminPanel>

        <AdminPanel sx={{ p: 2.4 }}>
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.62rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 0.6,
            }}
          >
            Total Redemptions
          </Typography>
          <Stack direction="row" alignItems="flex-end" spacing={1.5}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "2.4rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {isLoading ? "—" : stats.totalRedemptions.toLocaleString("en-IN")}
            </Typography>
            <Box
              sx={{
                mb: 0.4,
                width: 28,
                height: 28,
                borderRadius: "0.5rem",
                bgcolor: "#DDF8E7",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ShowChartRoundedIcon
                sx={{ color: "#239654", fontSize: "1rem" }}
              />
            </Box>
          </Stack>
        </AdminPanel>

        <AdminPanel
          sx={{
            p: 2.4,
            bgcolor: "#0E56C8",
            backgroundImage:
              "linear-gradient(135deg, #0E56C8 0%, #1A3A8F 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", top: 8, left: 12 }}>
            <Box
              sx={{
                px: 1,
                py: 0.3,
                borderRadius: "999px",
                bgcolor: "#D7E600",
                color: "#4D5800",
                fontSize: "0.58rem",
                fontWeight: 900,
                display: "inline-flex",
              }}
            >
              CAMPAIGN PERFORMANCE
            </Box>
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "1.5rem",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              {isLoading
                ? "Loading…"
                : topOffer
                  ? topOffer.name
                  : "No active offers"}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.78rem",
              }}
            >
              {topOffer
                ? `${topOffer.usedCount} redemptions · ${getDiscountLabel(topOffer)}`
                : "Create your first offer to see performance."}
            </Typography>
          </Box>
        </AdminPanel>
      </Box>

      {/* Inventory Management table */}
      <AdminPanel sx={{ overflow: "hidden", mb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2.5,
            py: 1.8,
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListRoundedIcon
              sx={{ color: adminUi.colors.muted, fontSize: "1rem" }}
            />
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
              }}
            >
              Inventory Management
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: "#A0ACBA", fontSize: "0.9rem" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  fontSize: "0.82rem",
                  height: 36,
                },
              }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                height: 36,
                borderRadius: "0.75rem",
                fontSize: "0.82rem",
                minWidth: 120,
              }}
            >
              <MenuItem value="all" sx={{ fontSize: "0.82rem" }}>
                All Status
              </MenuItem>
              {["active", "draft", "scheduled", "expired", "disabled"].map(
                (s) => (
                  <MenuItem
                    key={s}
                    value={s}
                    sx={{ fontSize: "0.82rem", textTransform: "capitalize" }}
                  >
                    {s}
                  </MenuItem>
                ),
              )}
            </Select>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={() => load(page, statusFilter, search)}
                sx={{
                  color: adminUi.colors.muted,
                  border: "1px solid rgba(225,232,241,0.96)",
                  borderRadius: "0.65rem",
                  width: 36,
                  height: 36,
                }}
              >
                <RefreshRoundedIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              <IconButton
                size="small"
                onClick={() => downloadCsv(offers)}
                disabled={offers.length === 0}
                sx={{
                  color: adminUi.colors.muted,
                  border: "1px solid rgba(225,232,241,0.96)",
                  borderRadius: "0.65rem",
                  width: 36,
                  height: 36,
                }}
              >
                <DownloadRoundedIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Column headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 0.9fr 0.8fr 0.7fr",
            gap: 1,
            px: 2.5,
            py: 1.4,
            bgcolor: "#F6F8FB",
            borderBottom: "1px solid rgba(225,232,241,0.96)",
          }}
        >
          {[
            "Offer Name",
            "Code",
            "Type & Value",
            "Usage",
            "Expiry Date",
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

        {!isLoading && offers.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <AdminEmptyState
              title="No offers found"
              subtitle={
                search || statusFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "Create your first offer to get started."
              }
            />
          </Box>
        ) : null}

        {offers.map((offer, index) => {
          const statusDef = STATUS_META[offer.status] || STATUS_META.draft;
          const usagePct = getUsagePct(offer);
          const barColor = getBarColor(usagePct);
          const { icon, bg } = getOfferIcon(offer, index);
          const isActioning = actionLoading === offer.offerId;

          return (
            <Box
              key={offer.offerId}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 0.9fr 0.8fr 0.7fr",
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
              {/* Name */}
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.7rem",
                    bgcolor: bg,
                    display: "grid",
                    placeItems: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.88rem",
                      fontWeight: 900,
                    }}
                  >
                    {offer.name}
                  </Typography>
                  <Typography
                    sx={{ color: adminUi.colors.muted, fontSize: "0.72rem" }}
                  >
                    {offer.description || getDiscountTypeLabel(offer)}
                  </Typography>
                </Box>
              </Stack>

              {/* Code */}
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.35,
                    borderRadius: "0.45rem",
                    bgcolor: "#F4F7FB",
                    border: "1px solid rgba(225,232,241,0.96)",
                  }}
                >
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.76rem",
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {offer.couponCode}
                  </Typography>
                </Box>
                <Tooltip title="Copy code">
                  <IconButton
                    size="small"
                    onClick={() => copyCode(offer.couponCode)}
                    sx={{ color: "#A0ACBA", p: 0.3 }}
                  >
                    <ContentCopyOutlinedIcon sx={{ fontSize: "0.8rem" }} />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* Type & Value */}
              <Box>
                <Typography
                  sx={{ color: adminUi.colors.muted, fontSize: "0.74rem" }}
                >
                  {getDiscountTypeLabel(offer)}
                </Typography>
                <Typography
                  sx={{
                    color: getDiscountColor(offer),
                    fontSize: "0.82rem",
                    fontWeight: 900,
                  }}
                >
                  {getDiscountLabel(offer)}
                </Typography>
              </Box>

              {/* Usage */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.4 }}
                >
                  <Typography
                    sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}
                  >
                    {offer.usedCount}/{offer.totalUsageLimit ?? "∞"}
                  </Typography>
                  <Typography
                    sx={{ color: adminUi.colors.muted, fontSize: "0.7rem" }}
                  >
                    {usagePct}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={usagePct}
                  sx={{
                    height: 5,
                    borderRadius: 9,
                    bgcolor: "#EEF2F6",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: barColor,
                      borderRadius: 9,
                    },
                  }}
                />
              </Box>

              {/* Expiry */}
              <Typography
                sx={{ color: "#344155", fontSize: "0.82rem", fontWeight: 700 }}
              >
                {formatDate(offer.validTo)}
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
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  alignItems: "center",
                  gap: 0.4,
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
              <Stack direction="row" spacing={0.4} alignItems="center">
                <Tooltip
                  title={offer.status === "active" ? "Disable" : "Activate"}
                >
                  <IconButton
                    size="small"
                    disabled={isActioning || offer.status === "expired"}
                    onClick={() => handleToggleStatus(offer)}
                    sx={{
                      color: offer.status === "active" ? "#D97706" : "#239654",
                      bgcolor:
                        offer.status === "active" ? "#FFF4D6" : "#DDF8E7",
                      borderRadius: "0.55rem",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    {offer.status === "active" ? (
                      <PauseCircleOutlineRoundedIcon
                        sx={{ fontSize: "0.95rem" }}
                      />
                    ) : (
                      <PlayCircleOutlineRoundedIcon
                        sx={{ fontSize: "0.95rem" }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    disabled={isActioning}
                    onClick={() => handleDelete(offer)}
                    sx={{
                      color: "#D94444",
                      bgcolor: "#FDECEC",
                      borderRadius: "0.55rem",
                      "&:hover": { bgcolor: "#FFCFCF" },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                  </IconButton>
                </Tooltip>
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
            {total === 0
              ? "No offers"
              : `Showing ${firstVisible}–${lastVisible} of ${total} offers`}
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

      {/* Bottom feature cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <AdminPanel sx={{ p: 2.8 }}>
          <Typography sx={{ fontSize: "1.4rem", mb: 0.6 }}>〜</Typography>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.1rem",
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Redemption Analytics
          </Typography>
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.84rem",
              lineHeight: 1.6,
            }}
          >
            Deep dive into which coupons are driving the most solar adoption
            across specific geographic regions.
          </Typography>
        </AdminPanel>
        <AdminPanel sx={{ p: 2.8 }}>
          <Typography sx={{ fontSize: "1.4rem", mb: 0.6 }}>🕐</Typography>
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.1rem",
              fontWeight: 900,
              mb: 0.5,
            }}
          >
            Automated Expiry
          </Typography>
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.84rem",
              lineHeight: 1.6,
            }}
          >
            Schedule future campaigns to auto-activate. Currently{" "}
            {stats.totalCount} campaigns are tracked in the system.
          </Typography>
        </AdminPanel>
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

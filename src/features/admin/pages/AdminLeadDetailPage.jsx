import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  AdminPrimaryButton,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData, platformSettingsApi } from "@/features/admin/api/adminApi";
import { leadsApi } from "@/features/public/api/leadsApi";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getPlatformPricePerKw() {
  return 55000;
}

// Correct flow: New -> Verified -> Payment -> Assigned -> Bidding
const verificationSteps = [
  { key: "submitted", label: "New", icon: RequestQuoteOutlinedIcon },
  { key: "verified", label: "Verified", icon: VerifiedOutlinedIcon },
  { key: "payment", label: "Payment", icon: PaymentsOutlinedIcon },
  { key: "assigned", label: "Assigned", icon: GroupAddOutlinedIcon },
  { key: "bidding", label: "Bidding", icon: GavelOutlinedIcon },
];

function formatMoney(value) {
  const amount = Number(value || 0);
  if (!amount) return "Pending";
  return rupeeFormatter.format(amount);
}

function formatLeadId(lead) {
  return `#SPK-${
    String(lead?.id || "")
      .slice(-4)
      .toUpperCase() || "NEW"
  }`;
}

function formatAddress(address) {
  if (!address) return "Address pending";
  return [address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
}

function getSystemSize(lead) {
  if (lead?.adminSystemSizeKw) return lead.adminSystemSizeKw;
  if (lead?.calculatorEstimate?.system?.recommendedSizeKw)
    return lead.calculatorEstimate.system.recommendedSizeKw;
  const size = Number(lead?.property?.sanctionedLoadKw || 0);
  if (size > 0) return size;
  if (lead?.roof?.sizeRange === "under_500") return 3;
  if (lead?.roof?.sizeRange === "over_1000") return 10;
  return 5;
}

function getDefaultCommercialRange(lead, settings) {
  const size = Number(getSystemSize(lead));
  const pricing = settings?.pricing || {};
  const standardCostPerKw = Number(pricing.standardCostPerKw || 55000);
  const minBidPerKw = Number(pricing.minBidAmount || 45000);
  const maxBidPerKw = Number(pricing.maxBidAmount || 85000);
  return {
    systemSizeKw: size,
    estimatedCost: Math.round(
      Number(
        lead?.estimatedCost ||
          lead?.calculatorEstimate?.investment?.grossCost ||
          size * standardCostPerKw,
      ) / 1000,
    ) * 1000,
    minAmount:
      lead?.bidRange?.minAmount ||
      Math.round((size * minBidPerKw) / 1000) * 1000,
    maxAmount:
      lead?.bidRange?.maxAmount ||
      Math.round((size * maxBidPerKw) / 1000) * 1000,
  };
}

function getActiveStep(lead, quoteCount) {
  // New -> Verified -> Payment -> Assigned -> Bidding
  if (quoteCount > 0 || lead.status === "quote_selected") return "bidding";
  if (lead.assignedVendorIds?.length > 0) return "assigned";
  if (lead.commitmentFeePaid) return "payment";
  if (lead.status === "open_for_quotes") return "verified";
  return "submitted";
}

function exportLeadPdf(lead, quotes, projects) {
  const html = `
    <html>
      <head>
        <title>${formatLeadId(lead)} Lead Verification</title>
        <style>
          body { font-family: Arial, sans-serif; color: #18253A; padding: 32px; }
          h1 { margin: 0 0 8px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          td { border: 1px solid #E4EAF2; padding: 10px; font-size: 13px; }
          .label { color: #6F7D8F; font-weight: 700; width: 220px; }
        </style>
      </head>
      <body>
        <h1>${formatLeadId(lead)} Lead Verification</h1>
        <p>${new Date().toLocaleString("en-IN")}</p>
        <table>
          <tr><td class="label">Customer</td><td>${lead.contact?.fullName || ""}</td></tr>
          <tr><td class="label">Phone</td><td>${lead.contact?.phoneNumber || ""}</td></tr>
          <tr><td class="label">Email</td><td>${lead.contact?.email || ""}</td></tr>
          <tr><td class="label">Address</td><td>${formatAddress(lead.installationAddress)}</td></tr>
          <tr><td class="label">Status</td><td>${lead.status}</td></tr>
          <tr><td class="label">System Size</td><td>${getSystemSize(lead)} kW</td></tr>
          <tr><td class="label">Estimated Cost</td><td>${formatMoney(lead.estimatedCost)}</td></tr>
          <tr><td class="label">Commitment Fee Paid</td><td>${lead.commitmentFeePaid ? "Yes" : "No"}</td></tr>
          <tr><td class="label">Quotes</td><td>${quotes.length}</td></tr>
          <tr><td class="label">Projects</td><td>${projects.length}</td></tr>
        </table>
      </body>
    </html>
  `;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function VerificationStepper({ activeStep }) {
  const activeIndex = verificationSteps.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <AdminPanel sx={{ p: { xs: 2, md: 2.8 }, mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {verificationSteps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index <= activeIndex;
          const isActive = index === activeIndex;
          return (
            <Stack
              key={step.key}
              direction="row"
              alignItems="center"
              sx={{ flex: 1 }}
            >
              <Stack alignItems="center" spacing={1} sx={{ minWidth: 72 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isDone ? "#0E56C8" : "#FFFFFF",
                    color: isDone ? "#FFFFFF" : "#8A96A8",
                    border: isActive
                      ? "3px solid #0E56C8"
                      : "1.5px solid #D9E2EF",
                    boxShadow: isDone
                      ? "0 10px 24px rgba(14,86,200,0.25)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon sx={{ fontSize: "1.15rem" }} />
                </Box>
                <Typography
                  sx={{
                    color: isDone ? "#0E56C8" : "#6A7688",
                    fontSize: "0.76rem",
                    fontWeight: 850,
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </Typography>
              </Stack>
              {index < verificationSteps.length - 1 ? (
                <Box
                  sx={{
                    height: 2.5,
                    flex: 1,
                    bgcolor: isDone ? "#9ABCF7" : "#E2E8F0",
                    borderRadius: 9,
                    mx: 0.5,
                  }}
                />
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    </AdminPanel>
  );
}

function InfoMetric({ title, value }) {
  return (
    <Box
      sx={{
        p: { xs: 1.8, md: 2 },
        borderRadius: "1.1rem",
        bgcolor: "#F3F5F8",
        minHeight: 88,
      }}
    >
      <Typography
        sx={{
          color: "#667386",
          fontSize: "0.62rem",
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.6,
          color: adminUi.colors.text,
          fontSize: "1.1rem",
          fontWeight: 900,
          lineHeight: 1.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function HistoryDialog({ open, onClose, lead, quotes, projects }) {
  const events = [
    lead?.submittedAt && { title: "Lead submitted", date: lead.submittedAt },
    lead?.updatedAt && { title: "Lead updated", date: lead.updatedAt },
    lead?.commitmentFeePaidAt && {
      title: "Commitment fee paid",
      date: lead.commitmentFeePaidAt,
    },
    ...quotes.map((quote) => ({
      title: `Quote ${quote.status}`,
      date: quote.submittedAt || quote.createdAt,
    })),
    ...projects.map((project) => ({
      title: `Project ${project.status?.replaceAll("_", " ")}`,
      date: project.updatedAt || project.createdAt,
    })),
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: adminUi.colors.text, fontWeight: 900 }}>
        Lead History
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.3}>
          {events.map((event, index) => (
            <Box
              key={`${event.title}-${event.date}-${index}`}
              sx={{ p: 1.4, borderRadius: "0.9rem", bgcolor: "#F6F8FB" }}
            >
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.84rem",
                  fontWeight: 850,
                }}
              >
                {event.title}
              </Typography>
              <Typography
                sx={{ mt: 0.25, color: "#6F7D8F", fontSize: "0.72rem" }}
              >
                {new Date(event.date).toLocaleString("en-IN")}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminLeadDetailPage() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [actionError, setActionError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editSystemSize, setEditSystemSize] = useState("");
  const [editEstimatedCost, setEditEstimatedCost] = useState("");
  const [editMinBid, setEditMinBid] = useState("");
  const [editMaxBid, setEditMaxBid] = useState("");
  const [platformSettings, setPlatformSettings] = useState(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);

  async function loadDetail() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [lead, data, settings] = await Promise.all([
        leadsApi.getLead(leadId),
        getAdminDashboardData(),
        platformSettingsApi.getSettings(),
      ]);
      setPlatformSettings(settings);
      setState({ loading: false, error: "", data: { ...data, lead } });
      const defaults = getDefaultCommercialRange(lead, settings);
      setEditSystemSize(String(defaults.systemSizeKw || ""));
      setEditEstimatedCost(String(defaults.estimatedCost || ""));
      setEditMinBid(String(defaults.minAmount || ""));
      setEditMaxBid(String(defaults.maxAmount || ""));
    } catch (error) {
      setState({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unable to load lead detail",
        data: null,
      });
    }
  }

  useEffect(() => {
    loadDetail();
  }, [leadId]);

  const detail = useMemo(() => {
    const lead = state.data?.lead;
    if (!lead) return null;

    const quotes = (state.data?.quotes || []).filter(
      (quote) => String(quote.leadId) === String(lead.id),
    );
    const projects = (state.data?.projects || []).filter(
      (project) => String(project.leadId) === String(lead.id),
    );
    const activeStep = getActiveStep(lead, quotes.length);

    return {
      lead,
      quotes,
      projects,
      activeStep,
      canAssignVendor: lead.status === "open_for_quotes",
    };
  }, [state.data]);

  async function updateStatus(status) {
    setIsUpdating(true);
    setActionError("");
    try {
      await leadsApi.updateLeadStatus(leadId, { status });
      await loadDetail();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to update lead",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function saveDetails() {
    setIsSavingDetails(true);
    setActionError("");
    try {
      const payload = {};
      if (editSystemSize) payload.adminSystemSizeKw = Number(editSystemSize);
      if (editEstimatedCost) payload.estimatedCost = Number(editEstimatedCost);
      if (editMinBid || editMaxBid) {
        payload.bidRange = {
          minAmount: Number(editMinBid),
          maxAmount: Number(editMaxBid),
        };
      }
      await leadsApi.updateLeadDetails(leadId, payload);
      setDetailsSaved(true);
      setTimeout(() => setDetailsSaved(false), 2500);
      await loadDetail();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to save details",
      );
    } finally {
      setIsSavingDetails(false);
    }
  }

  async function markPaymentReceived() {
    setIsUpdating(true);
    setActionError("");
    try {
      await leadsApi.markCommitmentPaid(leadId);
      await loadDetail();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to update payment status",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function verifyLead() {
    setIsUpdating(true);
    setActionError("");
    try {
      const payload = {};
      if (editSystemSize) payload.adminSystemSizeKw = Number(editSystemSize);
      if (editEstimatedCost) payload.estimatedCost = Number(editEstimatedCost);
      if (editMinBid || editMaxBid) {
        payload.bidRange = {
          minAmount: Number(editMinBid),
          maxAmount: Number(editMaxBid),
        };
      }
      await leadsApi.updateLeadDetails(leadId, payload);
      await leadsApi.updateLeadStatus(leadId, { status: "open_for_quotes" });
      await loadDetail();
    } catch (error) {
      setActionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to verify lead",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (state.loading) return <AdminLoadingState />;

  if (state.error || !detail) {
    return (
      <AdminPageShell>
        <AdminErrorState>{state.error || "Lead not found"}</AdminErrorState>
      </AdminPageShell>
    );
  }

  const { lead, quotes, projects, activeStep, canAssignVendor } = detail;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Lead Verification"
        subtitle="Verify customer data and technical feasibility for new solar inquiry."
        actions={
          <>
            <Button
              onClick={() => exportLeadPdf(lead, quotes, projects)}
              sx={{
                color: "#1F2C40",
                fontSize: "0.78rem",
                fontWeight: 850,
                textTransform: "none",
              }}
            >
              Export PDF
            </Button>
            <Button
              onClick={() => setHistoryOpen(true)}
              sx={{
                minHeight: 40,
                px: 2,
                borderRadius: "0.85rem",
                bgcolor: "#E0E4E9",
                color: "#1F2C40",
                fontSize: "0.82rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#D5DBE2" },
              }}
            >
              History
            </Button>
          </>
        }
      />

      <VerificationStepper activeStep={activeStep} />

      {actionError ? <AdminErrorState>{actionError}</AdminErrorState> : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 2.4,
          alignItems: "start",
        }}
      >
        {/* ── Customer Profile ── */}
        <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1.3rem",
                fontWeight: 900,
              }}
            >
              Customer Profile
            </Typography>
            <Box
              sx={{
                px: 1.3,
                py: 0.5,
                borderRadius: "999px",
                bgcolor: "#D7E600",
                color: "#4D5800",
                fontSize: "0.68rem",
                fontWeight: 950,
              }}
            >
              {lead.source === "customer_booking"
                ? "CUSTOMER LEAD"
                : "PRIORITY LEAD"}
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  mb: 0.6,
                  color: "#657386",
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Customer Name
              </Typography>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.96rem",
                  fontWeight: 800,
                }}
              >
                {lead.contact?.fullName || "—"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  mb: 0.6,
                  color: "#657386",
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Phone Number
              </Typography>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.96rem",
                  fontWeight: 800,
                }}
              >
                {lead.contact?.phoneNumber || "—"}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
              <Typography
                sx={{
                  mb: 0.6,
                  color: "#657386",
                  fontSize: "0.64rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Installation Address
              </Typography>
              <Typography
                sx={{
                  color: adminUi.colors.text,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {formatAddress(lead.installationAddress)}
              </Typography>
            </Box>
          </Box>

          {/* Editable system size + estimated cost */}
          <Box
            sx={{
              p: 2,
              borderRadius: "1rem",
              bgcolor: "#F6F8FB",
              border: "1px solid #E5EAF1",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                mb: 1.5,
                color: adminUi.colors.text,
                fontSize: "0.82rem",
                fontWeight: 900,
              }}
            >
              Update System Details
            </Typography>
            <Grid container spacing={1.5} alignItems="flex-end">
              <Grid item xs={12} sm={4}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "#657386",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  System Size (kW)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={editSystemSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditSystemSize(val);
                    // Auto-recalculate estimated cost from platform settings
                    if (val && Number(val) > 0) {
                      const pricePerKw = Number(
                        platformSettings?.pricing?.standardCostPerKw ||
                          getPlatformPricePerKw(),
                      );
                      const minBidPerKw = Number(
                        platformSettings?.pricing?.minBidAmount || 45000,
                      );
                      const maxBidPerKw = Number(
                        platformSettings?.pricing?.maxBidAmount || 85000,
                      );
                      setEditEstimatedCost(
                        String(Math.round(Number(val) * pricePerKw)),
                      );
                      setEditMinBid(
                        String(Math.round(Number(val) * minBidPerKw)),
                      );
                      setEditMaxBid(
                        String(Math.round(Number(val) * maxBidPerKw)),
                      );
                    }
                  }}
                  placeholder="e.g. 5"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem",
                      bgcolor: "#FFFFFF",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "#657386",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Estimated Cost (₹)
                </Typography>
                <Tooltip
                  title={`Auto-calculated: System Size × ₹${getPlatformPricePerKw().toLocaleString("en-IN")}/kW from Platform Settings. You can override.`}
                  placement="top"
                  arrow
                >
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={editEstimatedCost}
                    onChange={(e) => setEditEstimatedCost(e.target.value)}
                    placeholder="e.g. 285000"
                    InputProps={{
                      endAdornment: (
                        <InfoOutlinedIcon
                          sx={{ fontSize: "0.9rem", color: "#B0BAC8", mr: 0.5 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.75rem",
                        bgcolor: "#FFFFFF",
                        fontSize: "0.92rem",
                        fontWeight: 700,
                      },
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  startIcon={<SaveOutlinedIcon />}
                  disabled={isSavingDetails}
                  onClick={saveDetails}
                  sx={{
                    minHeight: 40,
                    borderRadius: "0.75rem",
                    bgcolor: detailsSaved ? "#E7F8EF" : "#0E56C8",
                    color: detailsSaved ? "#10985E" : "#FFFFFF",
                    fontSize: "0.78rem",
                    fontWeight: 850,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: detailsSaved ? "#D0F0E0" : "#0B49AD",
                    },
                  }}
                >
                  {isSavingDetails
                    ? "Saving..."
                    : detailsSaved
                      ? "Saved ✓"
                      : "Save"}
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "#657386",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Minimum Vendor Bid (INR)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={editMinBid}
                  onChange={(e) => setEditMinBid(e.target.value)}
                  placeholder="e.g. 225000"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem",
                      bgcolor: "#FFFFFF",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "#657386",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Maximum Vendor Bid (INR)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={editMaxBid}
                  onChange={(e) => setEditMaxBid(e.target.value)}
                  placeholder="e.g. 425000"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem",
                      bgcolor: "#FFFFFF",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1.5,
            }}
          >
            <InfoMetric
              title="System Size"
              value={`${getSystemSize(lead)} kW`}
            />
            <InfoMetric
              title="Preferred Brand"
              value={lead.property?.distributionCompany || "Pending"}
            />
            <InfoMetric
              title="Estimated Cost"
              value={formatMoney(lead.estimatedCost)}
            />
            <InfoMetric
              title="Vendor Bid Range"
              value={
                lead.bidRange?.minAmount && lead.bidRange?.maxAmount
                  ? `${formatMoney(lead.bidRange.minAmount)} - ${formatMoney(lead.bidRange.maxAmount)}`
                  : "Pending"
              }
            />
          </Box>
        </AdminPanel>

        {/* ── Verification Actions ── */}
        <AdminPanel
          sx={{ p: { xs: 2, md: 2.6 }, borderTop: "4px solid #0E56C8" }}
        >
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "1.2rem",
              fontWeight: 900,
              mb: 2.4,
            }}
          >
            Verification Actions
          </Typography>

          {/* Step 1 — Payment */}
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Step 1 — Commitment Payment
          </Typography>
          {lead.commitmentFeePaid ? (
            <Box
              sx={{
                p: 1.4,
                borderRadius: "0.85rem",
                bgcolor: "#E7F8EF",
                border: "1px solid #B8EAC8",
                mb: 2,
              }}
            >
              <Typography
                sx={{ color: "#10985E", fontSize: "0.78rem", fontWeight: 900 }}
              >
                ✓ Commitment fee received
                {lead.commitmentFeePaidAt
                  ? ` · ${new Date(lead.commitmentFeePaidAt).toLocaleDateString("en-IN")}`
                  : ""}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 1.4,
                  borderRadius: "0.85rem",
                  bgcolor: "#FFF8E6",
                  border: "1px solid #F0C419",
                }}
              >
                <Typography
                  sx={{
                    color: "#7A6B00",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                  }}
                >
                  ⏳ Awaiting customer payment
                </Typography>
                <Typography
                  sx={{ color: "#9A8A20", fontSize: "0.68rem", mt: 0.3 }}
                >
                  Customer must pay the 10% commitment fee before verification.
                </Typography>
              </Box>
              <Button
                fullWidth
                startIcon={<PaymentsOutlinedIcon />}
                disabled={isUpdating}
                onClick={markPaymentReceived}
                sx={{
                  minHeight: 46,
                  borderRadius: "999px",
                  bgcolor: "#FFF5D6",
                  color: "#7A6B00",
                  border: "1.5px solid #F0C419",
                  fontSize: "0.84rem",
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#FFF0B0" },
                }}
              >
                {isUpdating ? "Updating..." : "Confirm Payment Received"}
              </Button>
            </Stack>
          )}

          <Box sx={{ my: 2, borderTop: "1px solid #E5EAF1" }} />

          {/* Step 2 — Verify */}
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Step 2 — Lead Verification
          </Typography>
          <Stack spacing={1.2} sx={{ mb: 2 }}>
            <AdminPrimaryButton
              fullWidth
              startIcon={<SettingsSuggestOutlinedIcon />}
              disabled={
                isUpdating ||
                lead.status === "open_for_quotes"
              }
              onClick={verifyLead}
              sx={{ minHeight: 50, borderRadius: "999px", fontSize: "0.88rem" }}
            >
              {lead.status === "open_for_quotes"
                ? "✓ Verified"
                : "Mark as Verified"}
            </AdminPrimaryButton>
            <Button
              fullWidth
              startIcon={<HelpOutlineRoundedIcon />}
              disabled={isUpdating || lead.status === "reviewing"}
              onClick={() => updateStatus("reviewing")}
              sx={{
                minHeight: 46,
                borderRadius: "999px",
                bgcolor: "#E1E4E8",
                color: "#1F2C40",
                fontSize: "0.84rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#D6DBE1" },
              }}
            >
              Need More Info
            </Button>
            <Button
              fullWidth
              startIcon={<CloseRoundedIcon />}
              disabled={isUpdating || lead.status === "closed"}
              onClick={() => updateStatus("closed")}
              sx={{
                minHeight: 46,
                borderRadius: "999px",
                border: "1.5px solid #FFC9C9",
                bgcolor: "#FFF7F7",
                color: "#E32626",
                fontSize: "0.84rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#FFECEC" },
              }}
            >
              Reject Lead
            </Button>
          </Stack>

          <Box sx={{ my: 2, borderTop: "1px solid #E5EAF1" }} />

          {/* Step 3 — Assign Vendor */}
          <Typography
            sx={{
              color: adminUi.colors.muted,
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Step 3 — Assign Vendors {canAssignVendor ? "" : "(Locked)"}
          </Typography>
          <Button
            fullWidth
            disabled={!canAssignVendor}
            onClick={() =>
              navigate("/admin/vendor-assignment", {
                state: { leadId: lead.id },
              })
            }
            endIcon={<GroupAddOutlinedIcon />}
            sx={{
              minHeight: 50,
              borderRadius: "999px",
              bgcolor: canAssignVendor ? "#EAF1FF" : "#EDF1F6",
              color: canAssignVendor ? "#0E56C8" : "#A3AFBF",
              fontSize: "0.88rem",
              fontWeight: 850,
              textTransform: "none",
              border: `1px solid ${canAssignVendor ? "#C5D8FF" : "#D9E2EF"}`,
              "&:hover": { bgcolor: canAssignVendor ? "#DCE9FF" : "#EDF1F6" },
            }}
          >
            Assign Vendor
          </Button>
        </AdminPanel>
      </Box>

      <HistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lead={lead}
        quotes={quotes}
        projects={projects}
      />
    </AdminPageShell>
  );
}

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
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
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import { leadsApi } from "@/features/public/api/leadsApi";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const verificationSteps = [
  { key: "submitted", label: "New", icon: RequestQuoteOutlinedIcon },
  { key: "open_for_quotes", label: "Verified", icon: VerifiedOutlinedIcon },
  { key: "payment", label: "Payment", icon: PaymentsOutlinedIcon },
  { key: "quote_selected", label: "Assigned", icon: GroupAddOutlinedIcon },
  { key: "bidding", label: "Bidding", icon: GavelOutlinedIcon },
];

function formatMoney(value) {
  const amount = Number(value || 0);
  if (!amount) return "Pending";
  return rupeeFormatter.format(amount);
}

function formatLeadId(lead) {
  return `#SPK-${String(lead?.id || "").slice(-4).toUpperCase() || "NEW"}`;
}

function formatAddress(address) {
  if (!address) return "Address pending";
  return [address.street, address.city, address.state, address.pincode].filter(Boolean).join(", ");
}

function getSystemSize(lead) {
  const size = Number(lead?.property?.sanctionedLoadKw || 0);
  if (size > 0) return size;
  if (lead?.roof?.sizeRange === "under_500") return 3;
  if (lead?.roof?.sizeRange === "over_1000") return 10;
  return 5;
}

function getPaymentState(lead, projects, payments) {
  const projectIds = projects
    .filter((project) => String(project.leadId) === String(lead.id))
    .map((project) => String(project.id));
  const linkedPayments = payments.filter((payment) => projectIds.includes(String(payment.projectId)));

  if (!linkedPayments.length) return "locked";
  if (linkedPayments.some((payment) => payment.status === "pending")) return "pending";
  if (linkedPayments.some((payment) => payment.status === "paid")) return "paid";
  return "locked";
}

function getActiveStep(lead, paymentState, quoteCount) {
  if (quoteCount > 0) return "bidding";
  if (lead.status === "quote_selected") return "quote_selected";
  if (paymentState === "paid" || paymentState === "pending") return "payment";
  if (lead.status === "open_for_quotes") return "open_for_quotes";
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
  const activeIndex = verificationSteps.findIndex((step) => step.key === activeStep);

  return (
    <AdminPanel sx={{ p: { xs: 2, md: 2.5 }, mb: 3, bgcolor: "#F6F8FB" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
        {verificationSteps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index <= activeIndex;
          return (
            <Stack key={step.key} direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
              <Stack alignItems="center" spacing={0.8} sx={{ minWidth: 70 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isDone ? "#0E56C8" : "#FFFFFF",
                    color: isDone ? "#FFFFFF" : "#8A96A8",
                    border: "1px solid #D9E2EF",
                    boxShadow: isDone ? "0 10px 22px rgba(14,86,200,0.22)" : "none",
                  }}
                >
                  <Icon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Typography sx={{ color: isDone ? "#0E56C8" : "#4A5667", fontSize: "0.74rem", fontWeight: 850 }}>
                  {step.label}
                </Typography>
              </Stack>
              {index < verificationSteps.length - 1 ? (
                <Box sx={{ height: 2, flex: 1, bgcolor: isDone ? "#9ABCF7" : "#E2E8F0" }} />
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
    <Box sx={{ p: 1.6, borderRadius: "1rem", bgcolor: "#F3F5F8", minHeight: 78 }}>
      <Typography sx={{ color: "#667386", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 0.5, color: adminUi.colors.text, fontSize: "1.05rem", fontWeight: 900, lineHeight: 1.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

function HistoryDialog({ open, onClose, lead, quotes, projects }) {
  const events = [
    lead?.submittedAt && { title: "Lead submitted", date: lead.submittedAt },
    lead?.updatedAt && { title: "Lead updated", date: lead.updatedAt },
    ...quotes.map((quote) => ({ title: `Quote ${quote.status}`, date: quote.submittedAt || quote.createdAt })),
    ...projects.map((project) => ({ title: `Project ${project.status?.replaceAll("_", " ")}`, date: project.updatedAt || project.createdAt })),
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: adminUi.colors.text, fontWeight: 900 }}>Lead History</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.3}>
          {events.map((event, index) => (
            <Box key={`${event.title}-${event.date}-${index}`} sx={{ p: 1.4, borderRadius: "0.9rem", bgcolor: "#F6F8FB" }}>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "0.84rem", fontWeight: 850 }}>{event.title}</Typography>
              <Typography sx={{ mt: 0.25, color: "#6F7D8F", fontSize: "0.72rem" }}>
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

  async function loadDetail() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [lead, data] = await Promise.all([leadsApi.getLead(leadId), getAdminDashboardData()]);
      setState({ loading: false, error: "", data: { ...data, lead } });
    } catch (error) {
      setState({
        loading: false,
        error: error?.response?.data?.message || error.message || "Unable to load lead detail",
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

    const quotes = (state.data?.quotes || []).filter((quote) => String(quote.leadId) === String(lead.id));
    const projects = (state.data?.projects || []).filter((project) => String(project.leadId) === String(lead.id));
    const payments = state.data?.payments || [];
    const paymentState = getPaymentState(lead, projects, payments);
    const acceptedQuote = quotes.find((quote) => quote.status === "accepted") || quotes[0] || null;
    const activeStep = getActiveStep(lead, paymentState, quotes.length);

    return {
      lead,
      quotes,
      projects,
      paymentState,
      acceptedQuote,
      activeStep,
      canAssignVendor: lead.status === "open_for_quotes" || lead.status === "quote_selected",
    };
  }, [state.data]);

  async function updateStatus(status) {
    setIsUpdating(true);
    setActionError("");
    try {
      await leadsApi.updateLeadStatus(leadId, { status });
      await loadDetail();
    } catch (error) {
      setActionError(error?.response?.data?.message || error.message || "Unable to update lead");
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

  const { lead, quotes, projects, acceptedQuote, paymentState, activeStep, canAssignVendor } = detail;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Lead Verification"
        subtitle="Verify customer data and technical feasibility for new solar inquiry."
        actions={
          <>
            <Button
              onClick={() => exportLeadPdf(lead, quotes, projects)}
              sx={{ color: "#1F2C40", fontSize: "0.78rem", fontWeight: 850, textTransform: "none" }}
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

      <Grid container spacing={2.4}>
        <Grid item xs={12} lg={8}>
          <AdminPanel sx={{ p: { xs: 2, md: 2.6 } }}>
            <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2.7 }}>
              <Typography sx={{ color: adminUi.colors.text, fontSize: "1.25rem", fontWeight: 900 }}>
                Customer Profile
              </Typography>
              <Box sx={{ px: 1.15, py: 0.45, borderRadius: "999px", bgcolor: "#D7E600", color: "#4D5800", fontSize: "0.67rem", fontWeight: 950 }}>
                {lead.source === "customer_booking" ? "CUSTOMER LEAD" : "MANUAL LEAD"}
              </Box>
            </Stack>

            <Grid container spacing={2.2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#657386", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.08em" }}>
                  CUSTOMER NAME
                </Typography>
                <Typography sx={{ mt: 0.55, color: adminUi.colors.text, fontSize: "1rem", fontWeight: 850 }}>
                  {lead.contact?.fullName || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#657386", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.08em" }}>
                  PHONE NUMBER
                </Typography>
                <Typography sx={{ mt: 0.55, color: adminUi.colors.text, fontSize: "1rem", fontWeight: 850 }}>
                  {lead.contact?.phoneNumber || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ color: "#657386", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.08em" }}>
                  INSTALLATION ADDRESS
                </Typography>
                <Box sx={{ mt: 0.8, p: 1.4, borderRadius: "0.8rem", bgcolor: "#F0F2F5", color: adminUi.colors.text, fontSize: "0.92rem", fontWeight: 750 }}>
                  {formatAddress(lead.installationAddress)}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoMetric title="System Size" value={`${getSystemSize(lead)} kW`} />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoMetric
                  title="Preferred Brand"
                  value={acceptedQuote?.system?.panelType || lead.property?.distributionCompany || "Pending"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoMetric title="Estimated Cost" value={formatMoney(acceptedQuote?.pricing?.totalPrice)} />
              </Grid>
            </Grid>
          </AdminPanel>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AdminPanel sx={{ p: { xs: 2, md: 2.6 }, borderTop: "4px solid #0E56C8" }}>
            <Typography sx={{ color: adminUi.colors.text, fontSize: "1.15rem", fontWeight: 900, mb: 2 }}>
              Verification Actions
            </Typography>

            <Stack spacing={1.2}>
              <AdminPrimaryButton
                fullWidth
                startIcon={<SettingsSuggestOutlinedIcon />}
                disabled={isUpdating || lead.status === "open_for_quotes"}
                onClick={() => updateStatus("open_for_quotes")}
                sx={{ minHeight: 48 }}
              >
                {lead.status === "open_for_quotes" ? "Verified" : "Mark as Verified"}
              </AdminPrimaryButton>
              <Button
                fullWidth
                startIcon={<HelpOutlineRoundedIcon />}
                disabled={isUpdating || lead.status === "reviewing"}
                onClick={() => updateStatus("reviewing")}
                sx={{
                  minHeight: 48,
                  borderRadius: "999px",
                  bgcolor: "#E1E4E8",
                  color: "#1F2C40",
                  fontSize: "0.82rem",
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
                  minHeight: 48,
                  borderRadius: "999px",
                  border: "1px solid #FFC9C9",
                  bgcolor: "#FFF7F7",
                  color: "#E32626",
                  fontSize: "0.82rem",
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#FFECEC" },
                }}
              >
                Reject Lead
              </Button>
            </Stack>

            <Box sx={{ my: 2.1, borderTop: "1px solid #E5EAF1" }} />

            <Typography sx={{ color: adminUi.colors.text, fontSize: "0.82rem", fontWeight: 900 }}>
              Next Steps {canAssignVendor ? "" : "(Locked)"}
            </Typography>
            <Button
              fullWidth
              disabled={!canAssignVendor}
              onClick={() => navigate("/admin/vendor-assignment", { state: { leadId: lead.id } })}
              endIcon={<GroupAddOutlinedIcon />}
              sx={{
                mt: 1.2,
                minHeight: 48,
                borderRadius: "999px",
                bgcolor: canAssignVendor ? "#0E56C8" : "#EDF1F6",
                color: canAssignVendor ? "#FFFFFF" : "#A3AFBF",
                fontSize: "0.82rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: canAssignVendor ? "#0B49AD" : "#EDF1F6" },
              }}
            >
              Assign Vendor
            </Button>

            <Box sx={{ mt: 1.6, color: "#6F7D8F", fontSize: "0.72rem", lineHeight: 1.55 }}>
              Payment status: {paymentState === "locked" ? "Not started" : paymentState}
            </Box>
          </AdminPanel>
        </Grid>
      </Grid>

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

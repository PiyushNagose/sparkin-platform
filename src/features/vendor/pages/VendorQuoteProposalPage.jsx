import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";

const timelineOptions = [
  { title: "2-4 weeks", subtitle: "Fast Track", value: "2_4_weeks" },
  { title: "4-6 weeks", subtitle: "Standard", value: "4_6_weeks" },
  { title: "6-8 weeks", subtitle: "Flexible", value: "6_8_weeks" },
];

const sectionLabelSx = {
  color: "#18253A",
  fontSize: "1.25rem",
  fontWeight: 800,
  lineHeight: 1.15,
};

const sectionBodySx = {
  mt: 0.45,
  color: "#6F7D8F",
  fontSize: "0.82rem",
  lineHeight: 1.6,
  maxWidth: 240,
};

const fieldLabelSx = {
  mb: 0.45,
  color: "#667388",
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: "0.9rem",
    bgcolor: "#F5F7FB",
    fontSize: "0.84rem",
  },
};

function numberOrNull(value) {
  return value === "" ? null : Number(value);
}

function getDraftKey(leadId) {
  return `sparkin:quote-draft:${leadId}`;
}

function validateQuoteForm(form) {
  const totalPrice = Number(form.totalPrice);
  const sizeKw = Number(form.sizeKw);

  if (!Number.isFinite(totalPrice) || totalPrice <= 0) return "Enter a valid total proposal price.";
  if (!Number.isFinite(sizeKw) || sizeKw <= 0) return "Enter a valid system size.";
  if (!form.inverterType.trim()) return "Enter inverter type.";

  const breakdown = [form.equipmentCost, form.laborCost, form.permittingCost]
    .map(numberOrNull)
    .filter((value) => value !== null);

  if (breakdown.some((value) => !Number.isFinite(value) || value < 0)) {
    return "Cost breakdown values cannot be negative.";
  }

  const breakdownTotal = breakdown.reduce((sum, value) => sum + value, 0);
  if (breakdownTotal > totalPrice) {
    return "Cost breakdown cannot exceed the total proposal price.";
  }

  return "";
}

export default function VendorQuoteProposalPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingQuote, setExistingQuote] = useState(null);
  const [form, setForm] = useState({
    totalPrice: "",
    equipmentCost: "",
    laborCost: "",
    permittingCost: "",
    sizeKw: "",
    panelType: "monocrystalline",
    inverterType: "",
    installationWindow: "4_6_weeks",
    proposalNotes: "",
  });

  useEffect(() => {
    let active = true;

    async function loadLead() {
      if (!leadId || leadId === "undefined") {
        setError("Select a lead before submitting a quote.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [result, quote] = await Promise.all([
          leadsApi.getLead(leadId),
          quotesApi.getMyQuoteForLead(leadId),
        ]);

        if (!active) return;

        setLead(result);
        setExistingQuote(quote);
        const draft = quote ? null : JSON.parse(window.localStorage.getItem(getDraftKey(leadId)) || "null");

        setForm((current) => ({
          ...current,
          ...(draft || {}),
          totalPrice: quote?.pricing?.totalPrice ? String(quote.pricing.totalPrice) : draft?.totalPrice || current.totalPrice,
          equipmentCost: quote?.pricing?.equipmentCost ? String(quote.pricing.equipmentCost) : draft?.equipmentCost || current.equipmentCost,
          laborCost: quote?.pricing?.laborCost ? String(quote.pricing.laborCost) : draft?.laborCost || current.laborCost,
          permittingCost: quote?.pricing?.permittingCost ? String(quote.pricing.permittingCost) : draft?.permittingCost || current.permittingCost,
          sizeKw: quote?.system?.sizeKw
            ? String(quote.system.sizeKw)
            : draft?.sizeKw
              ? draft.sizeKw
            : result.property?.sanctionedLoadKw
              ? String(result.property.sanctionedLoadKw)
              : current.sizeKw,
          panelType: quote?.system?.panelType || draft?.panelType || current.panelType,
          inverterType: quote?.system?.inverterType || draft?.inverterType || current.inverterType,
          installationWindow: quote?.timeline?.installationWindow || draft?.installationWindow || current.installationWindow,
          proposalNotes: quote?.proposalNotes || draft?.proposalNotes || current.proposalNotes,
        }));
      } catch (apiError) {
        if (active) {
          setError(apiError?.response?.data?.message || "Could not load lead.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadLead();

    return () => {
      active = false;
    };
  }, [leadId]);

  const summaryItems = useMemo(() => {
    if (!lead) return [];

    return [
      ["Customer Name", lead.contact?.fullName || "Customer"],
      ["Location", [lead.installationAddress?.city, lead.installationAddress?.state].filter(Boolean).join(", ")],
      ["System Size", lead.property?.sanctionedLoadKw ? `${lead.property.sanctionedLoadKw} kW` : "Assessment pending"],
      ["Budget", "Pending quote"],
    ];
  }, [lead]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    setError("");
    setSuccess("");

    const validationError = validateQuoteForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (existingQuote?.status === "accepted") {
      setError("Accepted quotes cannot be changed.");
      return;
    }

    setIsSubmitting(true);

    try {
      await quotesApi.createQuote(leadId, {
        pricing: {
          totalPrice: Number(form.totalPrice),
          equipmentCost: numberOrNull(form.equipmentCost),
          laborCost: numberOrNull(form.laborCost),
          permittingCost: numberOrNull(form.permittingCost),
        },
        system: {
          sizeKw: Number(form.sizeKw),
          panelType: form.panelType,
          inverterType: form.inverterType,
        },
        timeline: {
          installationWindow: form.installationWindow,
        },
        proposalNotes: form.proposalNotes,
      });

      window.localStorage.removeItem(getDraftKey(leadId));
      navigate("/vendor/quotes", { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not submit quote. Please check the details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSaveDraft() {
    window.localStorage.setItem(getDraftKey(leadId), JSON.stringify(form));
    setError("");
    setSuccess("Draft saved on this device.");
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!leadId || leadId === "undefined" || !lead) {
    return (
      <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
        Select a lead from the leads page before submitting a quote.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        component={RouterLink}
        to={`/vendor/leads/${leadId}`}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          px: 0,
          minHeight: 28,
          mb: 1.3,
          color: "#0E56C8",
          fontSize: "0.76rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to Lead Details
      </Button>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={1.6}
        sx={{ mb: 2.4 }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.9rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            New Quotation Proposal
          </Typography>
          <Typography
            sx={{
              mt: 0.55,
              maxWidth: 500,
              color: "#6F7D8F",
              fontSize: "0.9rem",
              lineHeight: 1.62,
            }}
          >
            {existingQuote
              ? "Review and update your submitted proposal for this customer requirement."
              : "Prepare a real solar proposal for this customer requirement."}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.35,
            borderRadius: "999px",
            bgcolor: "#ECEA63",
            color: "#4F5500",
            fontSize: "0.68rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {existingQuote ? "Quote Submitted" : "Active Lead"}
        </Box>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ borderRadius: "0.9rem", mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert severity="success" sx={{ borderRadius: "0.9rem", mb: 2 }}>
          {success}
        </Alert>
      ) : null}

      <Box
        sx={{
          p: { xs: 1.35, md: 1.55 },
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          mb: { xs: 2.25, md: 2.6 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 1.4,
          }}
        >
          {summaryItems.map(([label, value]) => (
            <Box key={label}>
              <Typography
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
              <Typography sx={{ mt: 0.42, color: "#18253A", fontSize: "0.96rem", fontWeight: 800 }}>
                {value || "Pending"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Stack spacing={3}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" }, gap: { xs: 1.2, lg: 2.2 } }}>
          <Box>
            <Typography sx={sectionLabelSx}>01 Pricing</Typography>
            <Typography sx={sectionBodySx}>Define the total project cost and clear breakdown.</Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Total Proposal Price</Typography>
            <TextField fullWidth type="number" value={form.totalPrice} onChange={(event) => updateField("totalPrice", event.target.value)} placeholder="310000" sx={inputSx} />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.2, mt: 1.2 }}>
              {[
                ["Equipment", "equipmentCost"],
                ["Labor", "laborCost"],
                ["Permitting", "permittingCost"],
              ].map(([label, field]) => (
                <Box key={label}>
                  <Typography sx={fieldLabelSx}>{label}</Typography>
                  <TextField fullWidth type="number" value={form[field]} onChange={(event) => updateField(field, event.target.value)} placeholder="Amount" sx={inputSx} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" }, gap: { xs: 1.2, lg: 2.2 } }}>
          <Box>
            <Typography sx={sectionLabelSx}>02 Specifications</Typography>
            <Typography sx={sectionBodySx}>Technical details of the proposed hardware configuration.</Typography>
          </Box>

          <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2 }}>
              <Box>
                <Typography sx={fieldLabelSx}>System Size (kW)</Typography>
                <TextField fullWidth type="number" value={form.sizeKw} onChange={(event) => updateField("sizeKw", event.target.value)} sx={inputSx} />
              </Box>
              <Box>
                <Typography sx={fieldLabelSx}>Panel Type</Typography>
                <TextField fullWidth select value={form.panelType} onChange={(event) => updateField("panelType", event.target.value)} sx={inputSx}>
                  <MenuItem value="monocrystalline">Monocrystalline</MenuItem>
                  <MenuItem value="polycrystalline">Polycrystalline</MenuItem>
                  <MenuItem value="bifacial">Bifacial</MenuItem>
                </TextField>
              </Box>
            </Box>

            <Box sx={{ mt: 1.2 }}>
              <Typography sx={fieldLabelSx}>Inverter Type</Typography>
              <TextField fullWidth value={form.inverterType} onChange={(event) => updateField("inverterType", event.target.value)} placeholder="String inverter" sx={inputSx} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" }, gap: { xs: 1.2, lg: 2.2 } }}>
          <Box>
            <Typography sx={sectionLabelSx}>03 Timeline</Typography>
            <Typography sx={sectionBodySx}>Estimated duration from agreement to activation.</Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.2 }}>
            {timelineOptions.map((option) => (
              <Box
                key={option.value}
                role="button"
                tabIndex={0}
                onClick={() => updateField("installationWindow", option.value)}
                sx={{
                  minHeight: 68,
                  px: 1.2,
                  py: 1.05,
                  borderRadius: "0.95rem",
                  bgcolor: "#FFFFFF",
                  border: form.installationWindow === option.value ? "2px solid #0E56C8" : "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 8px 20px rgba(16,29,51,0.025)",
                  cursor: "pointer",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ color: "#18253A", fontSize: "0.82rem", fontWeight: 800 }}>
                      {option.title}
                    </Typography>
                    <Typography sx={{ mt: 0.22, color: "#8B97A8", fontSize: "0.68rem" }}>
                      {option.subtitle}
                    </Typography>
                  </Box>
                  {form.installationWindow === option.value ? (
                    <CheckCircleRoundedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                  ) : (
                    <RadioButtonUncheckedRoundedIcon sx={{ color: "#A4AEBD", fontSize: "1rem" }} />
                  )}
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "180px 1fr" }, gap: { xs: 1.2, lg: 2.2 } }}>
          <Box>
            <Typography sx={sectionLabelSx}>04 Narrative</Typography>
            <Typography sx={sectionBodySx}>Add installation plan, warranties, and service inclusions.</Typography>
          </Box>

          <Box>
            <Typography sx={fieldLabelSx}>Proposal Notes</Typography>
            <TextField
              fullWidth
              multiline
              minRows={5}
              value={form.proposalNotes}
              onChange={(event) => updateField("proposalNotes", event.target.value)}
              placeholder="Describe the installation plan, maintenance inclusions, and warranties..."
              sx={{
                ...inputSx,
                "& .MuiOutlinedInput-root": {
                  ...inputSx["& .MuiOutlinedInput-root"],
                  alignItems: "flex-start",
                  minHeight: 148,
                },
              }}
            />
          </Box>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.1} justifyContent="flex-end" sx={{ mt: { xs: 2.6, md: 3 } }}>
        <Button
          variant="outlined"
          onClick={handleSaveDraft}
          disabled={isSubmitting || existingQuote?.status === "accepted"}
          sx={{
            minHeight: 40,
            px: 1.8,
            borderRadius: "0.95rem",
            borderColor: "rgba(220,228,238,0.96)",
            bgcolor: "#F5F7FB",
            color: "#556478",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          startIcon={<BoltRoundedIcon />}
          onClick={handleSubmit}
          disabled={isSubmitting || existingQuote?.status === "accepted"}
          sx={{
            minHeight: 40,
            px: 2,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {isSubmitting ? "Saving..." : existingQuote ? "Update Quote" : "Submit Quote"}
        </Button>
      </Stack>
    </Box>
  );
}

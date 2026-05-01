import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";

const verificationRows = [
  { label: "Ownership Status", value: "Owned", tone: "#2A9656", bg: "#E8F7EC" },
  { label: "Phone Verified", value: "", iconOnly: true },
  { label: "Location Accuracy", value: "High (98%)" },
];

const labels = {
  independent_house: "Independent House",
  apartment: "Apartment",
  commercial: "Commercial",
  under_500: "< 500 sq ft",
  "500_1000": "500-1000 sq ft",
  over_1000: "1000+ sq ft",
  none: "No Shadow",
  partial: "Partial Shadow",
  heavy: "Heavy Shadow",
  owned: "Owned",
  rented: "Rented",
  flat: "Flat Roof",
  sloped: "Sloped Roof",
  excellent: "Excellent",
  average: "Average",
  needs_repair: "Needs Repair",
  single_phase: "Single Phase",
  three_phase: "Three Phase",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getBudgetEstimate(lead) {
  const load = Number(lead?.property?.sanctionedLoadKw) || 0;
  return load ? formatPrice(load * 75000) : "Pending quote";
}

function getMapUrl(address) {
  const query = [address?.street, address?.landmark, address?.city, address?.state, address?.pincode]
    .filter(Boolean)
    .join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "";
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatTimeReceived(value) {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return "Recently";
  }

  const diffHours = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60)));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function VendorLeadDetailPage() {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [existingQuote, setExistingQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLead() {
      if (!leadId || leadId === "undefined") {
        setError("Invalid lead id. Please open the lead from the leads page.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [result, quote] = await Promise.all([leadsApi.getLead(leadId), quotesApi.getMyQuoteForLead(leadId)]);
        if (active) {
          setLead(result);
          setExistingQuote(quote);
        }
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load lead details.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadLead();

    return () => {
      active = false;
    };
  }, [leadId]);

  const specCards = useMemo(() => {
    if (!lead) return [];

    return [
      {
        icon: BoltRoundedIcon,
        label: "Sanctioned Load",
        value: lead.property?.sanctionedLoadKw ? `${lead.property.sanctionedLoadKw} kW` : "Assessment pending",
        tone: "#2F73FF",
        bg: "#EEF4FF",
      },
      {
        icon: CurrencyRupeeRoundedIcon,
        label: "Budget Range",
        value: existingQuote?.pricing?.totalPrice ? formatPrice(existingQuote.pricing.totalPrice) : getBudgetEstimate(lead),
        tone: "#239654",
        bg: "#EAF7EF",
      },
      {
        icon: CottageOutlinedIcon,
        label: "Property Type",
        value: labels[lead.property?.type] || "Property",
        tone: "#8C9400",
        bg: "#F7F6D7",
      },
      {
        icon: StraightenRoundedIcon,
        label: "Roof Size",
        value: labels[lead.roof?.sizeRange] || "Assessment pending",
        tone: "#4F89FF",
        bg: "#EEF4FF",
      },
      {
        icon: WbSunnyOutlinedIcon,
        label: "Shadow Availability",
        value: labels[lead.roof?.shadow] || "Assessment pending",
        tone: "#2A9656",
        bg: "#EAF7EF",
      },
      {
        icon: CalendarMonthOutlinedIcon,
        label: "Inspection Slot",
        value: [lead.inspection?.preferredDate, labels[lead.inspection?.preferredTimeSlot] || lead.inspection?.preferredTimeSlot]
          .filter(Boolean)
          .join(", ") || "Flexible",
        tone: "#2F73FF",
        bg: "#EEF4FF",
      },
    ];
  }, [existingQuote, lead]);

  const dynamicVerificationRows = useMemo(() => {
    if (!lead) return verificationRows;

    return [
      { label: "Ownership Status", value: labels[lead.property?.ownership] || "Pending", tone: "#2A9656", bg: "#E8F7EC" },
      { label: "Phone Verified", value: "", iconOnly: true },
      { label: "Location Accuracy", value: lead.installationAddress?.pincode ? "High" : "Pending" },
      { label: "Roof Condition", value: labels[lead.roof?.condition] || "Pending" },
      { label: "Connection Type", value: labels[lead.property?.connectionType] || "Pending" },
    ];
  }, [lead]);

  async function handleSaveForLater() {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedLead = await leadsApi.updateLeadStatus(resolvedLeadId, { status: "reviewing" });
      setLead(updatedLead);
      setSuccess("Lead saved for review.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not save this lead for later.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !lead) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!lead) {
    return <Alert severity="info">Lead not found.</Alert>;
  }

  const customerName = lead.contact?.fullName || "Customer";
  const location = [lead.installationAddress?.city, lead.installationAddress?.state].filter(Boolean).join(", ");
  const initials = getInitials(customerName) || "CU";
  const resolvedLeadId = lead.id || lead._id || leadId;
  const mapUrl = getMapUrl(lead.installationAddress);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          p: { xs: 1.4, md: 1.7 },
          borderRadius: "1.35rem",
          bgcolor: "#F4F6FA",
          border: "1px solid rgba(229,234,241,0.95)",
          mb: { xs: 2.4, md: 2.7 },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={1.6}
        >
          <Stack direction="row" spacing={1.3} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "1rem",
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontSize: "1.65rem",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {initials}
            </Box>

            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: { xs: "1.7rem", md: "1.95rem" },
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {customerName}
                </Typography>
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.32,
                    borderRadius: "999px",
                    bgcolor: "#ECEA00",
                    color: "#4B4A00",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Hot Lead
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.6} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap" }}>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <PlaceOutlinedIcon sx={{ color: "#7D8797", fontSize: "0.95rem" }} />
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.88rem" }}>
                    {location || "Location pending"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <AccessTimeRoundedIcon sx={{ color: "#7D8797", fontSize: "0.95rem" }} />
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.88rem" }}>
                    {formatTimeReceived(lead.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.9} flexWrap="wrap">
            {[
              { icon: PhoneOutlinedIcon, component: "a", href: `tel:${lead.contact?.phoneNumber || ""}` },
              { icon: MailOutlineRoundedIcon, component: "a", href: lead.contact?.email ? `mailto:${lead.contact.email}` : undefined },
              {
                icon: ShareOutlinedIcon,
                onClick: () => {
                  const text = `${customerName} - ${location || "Lead"} - ${window.location.href}`;
                  if (navigator.share) {
                    navigator.share({ title: "Sparkin lead", text, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard?.writeText(text);
                    setSuccess("Lead link copied.");
                  }
                },
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  component={item.component || "button"}
                  href={item.href}
                  onClick={item.onClick}
                  disabled={item.component === "a" && !item.href}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "0.95rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(225,232,241,0.96)",
                    color: "#0E56C8",
                    p: 0,
                  }}
                >
                  <Icon sx={{ fontSize: "1rem" }} />
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      <Typography
        sx={{
          mb: 1.45,
          color: "#18253A",
          fontSize: "1.2rem",
          fontWeight: 800,
        }}
      >
        System Specifications
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }}>
          {success}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.7fr 0.82fr" },
          gap: 1.8,
          mb: { xs: 2.4, md: 2.8 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
          }}
        >
          {specCards.map((card) => {
            const Icon = card.icon;
            return (
              <Box
                key={card.label}
                sx={{
                  p: 1.65,
                  minHeight: 104,
                  borderRadius: "1.15rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "0.8rem",
                    bgcolor: card.bg,
                    color: card.tone,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon sx={{ fontSize: "0.95rem" }} />
                </Box>
                <Typography
                  sx={{
                    mt: 1.2,
                    color: "#8B97A8",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.45,
                    color: "#18253A",
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Stack spacing={1.5}>
          <Box
            sx={{
              p: 1.65,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{
                color: "#18253A",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.4,
              }}
            >
              Verification Status
            </Typography>

            <Stack spacing={1.05}>
              {dynamicVerificationRows.map((row) => (
                <Stack
                  key={row.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.8rem" }}>
                    {row.label}
                  </Typography>

                  {row.iconOnly ? (
                    <CheckCircleRoundedIcon sx={{ color: "#239654", fontSize: "1rem" }} />
                  ) : row.tone ? (
                    <Box
                      sx={{
                        px: 0.7,
                        py: 0.28,
                        borderRadius: "999px",
                        bgcolor: row.bg,
                        color: row.tone,
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {row.value}
                    </Box>
                  ) : (
                    <Typography sx={{ color: "#18253A", fontSize: "0.8rem", fontWeight: 700 }}>
                      {row.value}
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 156,
                background:
                  "linear-gradient(135deg, #7E8A7A 0%, #BDAE8A 35%, #7B8E61 70%, #9C9571 100%)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  opacity: 0.38,
                }}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.2, py: 0.9 }}
            >
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem", fontWeight: 500 }}>
                Location Preview
              </Typography>
              <Button
                component={mapUrl ? "a" : "button"}
                href={mapUrl || undefined}
                target={mapUrl ? "_blank" : undefined}
                rel={mapUrl ? "noreferrer" : undefined}
                endIcon={<OpenInNewRoundedIcon />}
                sx={{
                  minHeight: 28,
                  px: 0,
                  color: "#0E56C8",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Map
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Typography
        sx={{
          mb: 1.45,
          color: "#18253A",
          fontSize: "1.2rem",
          fontWeight: 800,
        }}
      >
        Customer Notes
      </Typography>

      <Box
        sx={{
          p: { xs: 1.6, md: 1.8 },
          borderRadius: "1.15rem",
          bgcolor: "#F7F9FD",
          borderLeft: "3px solid #0E56C8",
          boxShadow: "0 14px 28px rgba(16,29,51,0.03)",
          maxWidth: 760,
          mb: { xs: 2.6, md: 2.9 },
          position: "relative",
        }}
      >
        <Typography
          sx={{
            color: "#556478",
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.7,
            fontStyle: "italic",
            maxWidth: 560,
          }}
        >
          {lead.notes || lead.specialInstructions || "No special customer notes were added for this request."}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            right: 18,
            bottom: 10,
            color: "#D7E1F1",
            fontSize: "3.4rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {"\u201D"}
        </Typography>
      </Box>

      <Box
        sx={{
          p: { xs: 1.35, md: 1.55 },
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.4}
        >
          <Box>
            <Typography
              sx={{
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Estimated Value
            </Typography>
            <Stack direction="row" spacing={0.6} alignItems="baseline" sx={{ mt: 0.35 }}>
              <Typography sx={{ color: "#118A44", fontSize: "1.8rem", fontWeight: 800 }}>
                {existingQuote?.pricing?.totalPrice ? formatPrice(existingQuote.pricing.totalPrice) : getBudgetEstimate(lead)}
              </Typography>
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.82rem" }}>
                Quote Value
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.05} sx={{ flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={handleSaveForLater}
              disabled={isSaving}
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
              {isSaving ? "Saving..." : "Save for Later"}
            </Button>
            <Button
              component={RouterLink}
              to={`/vendor/leads/${resolvedLeadId}/quote`}
              variant="contained"
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
              {existingQuote ? "Edit Quote" : "Submit Quote"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

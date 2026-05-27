import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { publicVendorsApi } from "@/features/public/api/vendorsApi";
import {
  formatDate,
  formatPrice,
  formatProjectStatus,
  formatPropertyType,
  formatRoofSize,
  getLeadQuotes,
  getLeadStatusMeta,
  getPrimaryLeadAction,
  getRelevantProject,
} from "@/features/customer/lib/customerLeadFlow";

function InfoCard({ title, children, icon }) {
  return (
    <Box
      sx={{
        p: 1.6,
        borderRadius: "1.2rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#EEF4FF",
            color: "#0E56C8",
          }}
        >
          {icon}
        </Avatar>
        <Typography
          sx={{
            color: "#18253A",
            fontSize: "0.96rem",
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

function InfoGrid({ items }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1,
      }}
    >
      {items.map(([label, value]) => (
        <Box
          key={label}
          sx={{
            p: 1,
            borderRadius: "0.95rem",
            bgcolor: "#F7F9FC",
          }}
        >
          <Typography
            sx={{
              color: "#98A3B2",
              fontSize: "0.56rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              mt: 0.35,
              color: "#223146",
              fontSize: "0.82rem",
              fontWeight: 700,
              lineHeight: 1.45,
            }}
          >
            {value || "-"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function AttachmentPreview({ file }) {
  const isImage = file?.dataUrl?.startsWith("data:image");

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: "1rem",
        border: "1px solid rgba(225,232,241,0.96)",
        bgcolor: "#FFFFFF",
      }}
    >
      {isImage ? (
        <Box
          component="img"
          src={file.dataUrl}
          alt={file.fileName}
          sx={{
            width: "100%",
            height: 170,
            borderRadius: "0.85rem",
            objectFit: "cover",
            mb: 0.85,
          }}
        />
      ) : (
        <Box
          sx={{
            height: 170,
            borderRadius: "0.85rem",
            bgcolor: "#F4F7FB",
            display: "grid",
            placeItems: "center",
            mb: 0.85,
            color: "#647387",
          }}
        >
          <DescriptionRoundedIcon sx={{ fontSize: "2rem" }} />
        </Box>
      )}
      <Typography
        sx={{ color: "#223146", fontSize: "0.76rem", fontWeight: 700 }}
      >
        {file.fileName}
      </Typography>
      <Typography sx={{ color: "#7A8799", fontSize: "0.68rem", mt: 0.2 }}>
        {file.mimeType} · {Math.max(1, Math.round((file.size || 0) / 1024))} KB
      </Typography>
    </Box>
  );
}

function VendorCard({ vendorId, profile }) {
  const name =
    profile?.company?.name || profile?.account?.fullName || "Assigned Vendor";
  const location =
    [profile?.company?.city, profile?.company?.state].filter(Boolean).join(", ") ||
    "Coverage details shared after verification";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SV";

  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: "1rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.96)",
      }}
    >
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: "#10243E",
            color: "#F5B92F",
            fontWeight: 800,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              color: "#223146",
              fontSize: "0.88rem",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {name}
          </Typography>
          <Typography sx={{ color: "#6F7D8F", fontSize: "0.72rem", mt: 0.2 }}>
            {location}
          </Typography>
        </Box>
        <Chip
          label={profile?.verificationStatus === "verified" ? "Verified" : "Partner"}
          size="small"
          sx={{
            bgcolor: "#E8FAEF",
            color: "#239654",
            fontWeight: 800,
          }}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={0.9} sx={{ mt: 1.1 }}>
        <Button
          component={RouterLink}
          to={`/vendors/${vendorId}`}
          variant="contained"
          sx={{
            minHeight: 34,
            borderRadius: "0.8rem",
            bgcolor: "#0E56C8",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          View Vendor
        </Button>
      </Stack>
    </Box>
  );
}

export default function CustomerTenderDetailPage() {
  const { leadId } = useParams();
  const [state, setState] = useState({
    isLoading: true,
    error: "",
    lead: null,
    quotes: [],
    projects: [],
    vendorProfiles: [],
  });

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      setState((current) => ({ ...current, isLoading: true, error: "" }));

      try {
        const lead = await leadsApi.getLead(leadId, { force: true });
        const [quotes, projects] = await Promise.all([
          quotesApi.listQuotes({ leadId }, { force: true }),
          projectsApi.listProjects({ force: true }),
        ]);

        const currentProject = getRelevantProject(projects, leadId);
        const vendorIds = [
          ...(lead.assignedVendorIds || []),
          lead.selection?.vendorId,
          currentProject?.vendorId,
        ].filter(Boolean);

        const uniqueVendorIds = [...new Set(vendorIds.map(String))];
        const vendorProfiles = await Promise.allSettled(
          uniqueVendorIds.map((vendorId) =>
            publicVendorsApi.getVendorProfile(vendorId, { force: true }),
          ),
        );

        if (!active) return;

        setState({
          isLoading: false,
          error: "",
          lead,
          quotes,
          projects,
          vendorProfiles: vendorProfiles
            .map((result, index) =>
              result.status === "fulfilled"
                ? { vendorId: uniqueVendorIds[index], profile: result.value }
                : null,
            )
            .filter(Boolean),
        });
      } catch (error) {
        if (!active) return;

        setState({
          isLoading: false,
          error:
            error?.response?.data?.message ||
            error.message ||
            "Could not load booking details.",
          lead: null,
          quotes: [],
          projects: [],
          vendorProfiles: [],
        });
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [leadId]);

  const lead = state.lead;
  const activeQuotes = useMemo(
    () => getLeadQuotes(state.quotes, leadId, { activeOnly: true }),
    [state.quotes, leadId],
  );
  const currentProject = useMemo(
    () => getRelevantProject(state.projects, leadId),
    [state.projects, leadId],
  );
  const statusMeta = getLeadStatusMeta(lead || {});
  const primaryAction = getPrimaryLeadAction(
    lead || {},
    state.quotes,
    state.projects,
  );
  const bestQuote = activeQuotes.length
    ? Math.min(...activeQuotes.map((quote) => Number(quote.pricing?.totalPrice) || 0))
    : null;

  if (state.isLoading) {
    return (
      <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.error || !lead) {
    return (
      <Box sx={{ width: "100%" }}>
        <Button
          component={RouterLink}
          to="/customer/bookings"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            px: 0,
            color: "#647387",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Back to Bookings
        </Button>
        <Alert severity="error" sx={{ mt: 1.2, borderRadius: "1rem" }}>
          {state.error || "Booking not found."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Button
            component={RouterLink}
            to="/customer/bookings"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              px: 0,
              mb: 0.8,
              color: "#647387",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Back to Bookings
          </Button>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.8rem", md: "2rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Booking Details
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Review the exact information you submitted and track the latest vendor
            and bidding progress.
          </Typography>
        </Box>

        <Stack spacing={1} alignItems={{ xs: "stretch", lg: "flex-end" }}>
          <Chip
            label={statusMeta.label}
            sx={{
              alignSelf: { xs: "flex-start", lg: "flex-end" },
              bgcolor: statusMeta.bg,
              color: statusMeta.tone,
              fontWeight: 800,
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              component={RouterLink}
              to={primaryAction.to}
              variant={primaryAction.primary ? "contained" : "outlined"}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
              sx={{
                minHeight: 38,
                px: 1.5,
                borderRadius: "0.9rem",
                bgcolor: primaryAction.primary ? "#0E56C8" : "#FFFFFF",
                color: primaryAction.primary ? "#FFFFFF" : "#223146",
                borderColor: "rgba(225,232,241,0.96)",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {primaryAction.label}
            </Button>
            <Button
              component={RouterLink}
              to="/customer/tenders"
              sx={{
                minHeight: 38,
                px: 1.5,
                borderRadius: "0.9rem",
                bgcolor: "#F5F7FB",
                color: "#223146",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Open My Tenders
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 1.8,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.15fr 0.85fr" },
          gap: 1.5,
        }}
      >
        <Stack spacing={1.5}>
          <InfoCard title="Customer & Site Details" icon={<PersonRoundedIcon />}>
            <InfoGrid
              items={[
                ["Full Name", lead.contact?.fullName],
                ["Phone Number", lead.contact?.phoneNumber],
                ["Email", lead.contact?.email || "Not shared"],
                [
                  "Location",
                  [
                    lead.installationAddress?.street,
                    lead.installationAddress?.city,
                    lead.installationAddress?.state,
                    lead.installationAddress?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", "),
                ],
                ["Submitted On", formatDate(lead.createdAt || lead.submittedAt)],
                [
                  "Preferred Inspection",
                  lead.inspection?.preferredDate
                    ? `${lead.inspection.preferredDate} · ${lead.inspection.preferredTimeSlot || "Slot pending"}`
                    : "Not specified",
                ],
              ]}
            />
          </InfoCard>

          <InfoCard title="Property & Roof Inputs" icon={<HomeWorkRoundedIcon />}>
            <InfoGrid
              items={[
                ["Property Type", formatPropertyType(lead.property?.type)],
                ["Roof Type", lead.property?.roofType || "Not specified"],
                ["Roof Size", formatRoofSize(lead.roof?.sizeRange)],
                ["Roof Condition", lead.roof?.condition || "Not specified"],
                ["Shadow", lead.roof?.shadow || "Not specified"],
                [
                  "Sanctioned Load",
                  lead.property?.sanctionedLoadKw
                    ? `${lead.property.sanctionedLoadKw} kW`
                    : "Not specified",
                ],
              ]}
            />
          </InfoCard>

          <InfoCard title="Uploaded Documents" icon={<ImageRoundedIcon />}>
            <Stack spacing={1.4}>
              <Box>
                <Typography
                  sx={{ color: "#223146", fontSize: "0.8rem", fontWeight: 800 }}
                >
                  Roof Photos
                </Typography>
                {lead.attachments?.roofPhotos?.length ? (
                  <Box
                    sx={{
                      mt: 0.85,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 1,
                    }}
                  >
                    {lead.attachments.roofPhotos.map((file) => (
                      <AttachmentPreview key={file.id || file.fileName} file={file} />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: "#7A8799", fontSize: "0.74rem", mt: 0.6 }}>
                    No roof photo found on this booking.
                  </Typography>
                )}
              </Box>

              <InfoGrid
                items={[
                  [
                    "Electricity Bill",
                    lead.attachments?.electricityBill?.length
                      ? lead.attachments.electricityBill.map((file) => file.fileName).join(", ")
                      : "Not uploaded",
                  ],
                  [
                    "Photo ID",
                    lead.attachments?.photoId?.length
                      ? lead.attachments.photoId.map((file) => file.fileName).join(", ")
                      : "Not uploaded",
                  ],
                ]}
              />
            </Stack>
          </InfoCard>
        </Stack>

        <Stack spacing={1.5}>
          <InfoCard title="Tender Snapshot" icon={<BoltRoundedIcon />}>
            <InfoGrid
              items={[
                ["Current Status", statusMeta.label],
                ["Bids Received", activeQuotes.length ? String(activeQuotes.length) : "Awaiting bids"],
                ["Best Price", bestQuote ? formatPrice(bestQuote) : "Waiting for quotes"],
                [
                  "Project Stage",
                  currentProject ? formatProjectStatus(currentProject.status) : "Project not created yet",
                ],
                [
                  "Bidding Ends",
                  lead.biddingEndsAt ? formatDate(lead.biddingEndsAt) : "Pending admin release",
                ],
                [
                  "Selected Vendor",
                  currentProject?.vendorEmail ||
                  activeQuotes.find((quote) => quote.status === "accepted")?.vendorEmail ||
                  "Not selected yet",
                ],
              ]}
            />

            {lead.roofAnalysis ? (
              <Box
                sx={{
                  mt: 1.2,
                  p: 1.1,
                  borderRadius: "1rem",
                  bgcolor: "#F7F9FC",
                }}
              >
                <Typography
                  sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 800 }}
                >
                  Roof Analysis
                </Typography>
                <Typography sx={{ color: "#6F7D8F", fontSize: "0.74rem", mt: 0.45 }}>
                  {lead.roofAnalysis.message || "Roof assessment generated for your booking."}
                </Typography>
                <Typography sx={{ color: "#0E56C8", fontSize: "0.72rem", mt: 0.7, fontWeight: 700 }}>
                  {lead.roofAnalysis.potentialKw}kW potential · {lead.roofAnalysis.accuracyPercent}% confidence
                </Typography>
              </Box>
            ) : null}
          </InfoCard>

          <InfoCard title="Assigned Vendors" icon={<BusinessRoundedIcon />}>
            {state.vendorProfiles.length ? (
              <Stack spacing={1}>
                {state.vendorProfiles.map((vendor) => (
                  <VendorCard
                    key={vendor.vendorId}
                    vendorId={vendor.vendorId}
                    profile={vendor.profile}
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "#7A8799", fontSize: "0.74rem" }}>
                Vendor details will appear here as soon as Sparkin assigns or updates
                your partner lineup.
              </Typography>
            )}
          </InfoCard>

          <InfoCard title="Special Notes" icon={<LocationOnOutlinedIcon />}>
            <Stack spacing={0.9}>
              <Box>
                <Typography
                  sx={{ color: "#98A3B2", fontSize: "0.56rem", fontWeight: 800, textTransform: "uppercase" }}
                >
                  Customer Notes
                </Typography>
                <Typography sx={{ mt: 0.35, color: "#223146", fontSize: "0.8rem", lineHeight: 1.6 }}>
                  {lead.notes || "No additional notes were added."}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "#98A3B2", fontSize: "0.56rem", fontWeight: 800, textTransform: "uppercase" }}
                >
                  Special Instructions
                </Typography>
                <Typography sx={{ mt: 0.35, color: "#223146", fontSize: "0.8rem", lineHeight: 1.6 }}>
                  {lead.specialInstructions || "No special instructions provided."}
                </Typography>
              </Box>
              {currentProject?.status === "cancelled" ? (
                <Alert severity="info" sx={{ borderRadius: "0.9rem", mt: 0.4 }}>
                  This project was cancelled earlier. If admin reassigns a vendor or
                  creates a fresh project, this page will show the latest assigned
                  vendors and newest active project automatically.
                </Alert>
              ) : null}
            </Stack>
          </InfoCard>
        </Stack>
      </Box>
    </Box>
  );
}

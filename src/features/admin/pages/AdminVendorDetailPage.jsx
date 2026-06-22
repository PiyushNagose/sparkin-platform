/**
 * AdminVendorDetailPage
 *
 * Full vendor profile view accessible from the Vendors list (/admin/vendors/:vendorId).
 * Reuses the same data and action layer as the vendor applications detail page,
 * but navigates back to the vendors list instead of applications.
 */
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminPageShell,
  AdminPanel,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { vendorApplicationsApi } from "@/features/admin/api/vendorApplicationsApi";
import { useSocket } from "@/shared/websocket/SocketProvider";

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_META = {
  draft: { label: "Draft", tone: "#8B97A8", bg: "#F2F5F8" },
  submitted: { label: "Pending Review", tone: "#556478", bg: "#EEF2F6" },
  verified: { label: "Active Partner", tone: "#239654", bg: "#DDF8E7" },
  rejected: { label: "Rejected", tone: "#D94444", bg: "#FDECEC" },
};

const BUSINESS_SERVICE_ORIGIN = (
  import.meta.env.VITE_BUSINESS_API_BASE_URL || "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

// ─── helpers ──────────────────────────────────────────────────────────────────

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

function getVettingScore(vendor) {
  let score = 0;
  if (vendor.account?.fullName) score += 1;
  if (vendor.account?.phoneNumber) score += 1;
  if (vendor.company?.name) score += 1;
  if (vendor.company?.gstNumber) score += 1;
  if (vendor.company?.experienceYears > 0) score += 1;
  if (vendor.company?.projectsCompleted > 0) score += 1;
  if ((vendor.documents?.length || 0) >= 1) score += 2;
  if ((vendor.documents?.length || 0) >= 2) score += 1;
  if (vendor.company?.totalCapacityMw > 0) score += 1;
  return Math.min(10, score);
}

function getDocUrl(doc) {
  if (!doc?.url) return null;
  if (doc.url.startsWith("http")) return doc.url;
  return `${BUSINESS_SERVICE_ORIGIN}${doc.url}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, icon: Icon }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#9AAABB",
          fontSize: "0.62rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          mb: 0.4,
        }}
      >
        {label}
      </Typography>
      <Stack direction="row" spacing={0.6} alignItems="center">
        {Icon && <Icon sx={{ color: "#8B97A8", fontSize: "0.9rem" }} />}
        <Typography
          sx={{
            color: adminUi.colors.text,
            fontSize: "0.88rem",
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          {value || "—"}
        </Typography>
      </Stack>
    </Box>
  );
}

function StatCard({ value, label, accent = "#0E56C8" }) {
  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 1.6, md: 2 },
        borderRadius: "1rem",
        border: "1px solid rgba(225,232,241,0.96)",
        borderLeft: `4px solid ${accent}`,
        bgcolor: "#FAFBFC",
      }}
    >
      <Typography
        sx={{
          color: adminUi.colors.text,
          fontSize: "1.8rem",
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: adminUi.colors.muted,
          fontSize: "0.74rem",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function DocumentCard({ doc }) {
  const url = getDocUrl(doc);
  const isPdf = doc.mimeType === "application/pdf";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "0.9rem",
        overflow: "hidden",
        border: "1px solid rgba(225,232,241,0.96)",
        bgcolor: "#F6F8FB",
        aspectRatio: "4/3",
        cursor: url ? "pointer" : "default",
        "&:hover .doc-overlay": { opacity: 1 },
        transition: "box-shadow 0.15s",
        "&:hover": { boxShadow: "0 8px 24px rgba(16,29,51,0.1)" },
      }}
      onClick={() => url && window.open(url, "_blank", "noreferrer")}
    >
      {isPdf ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            bgcolor: "#FFF1F1",
          }}
        >
          <Stack alignItems="center" spacing={0.8}>
            <DescriptionOutlinedIcon
              sx={{ color: "#D94444", fontSize: "2.5rem" }}
            />
            <Typography
              sx={{
                color: "#D94444",
                fontSize: "0.72rem",
                fontWeight: 800,
                textAlign: "center",
                px: 1,
              }}
            >
              {doc.title || doc.fileName}
            </Typography>
          </Stack>
        </Box>
      ) : url ? (
        <Box
          component="img"
          src={url}
          alt={doc.title || doc.fileName}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <ImageOutlinedIcon sx={{ color: "#C8D4E4", fontSize: "2rem" }} />
        </Box>
      )}
      <Box
        className="doc-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(14,86,200,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
      >
        <DownloadRoundedIcon sx={{ color: "#FFFFFF", fontSize: "1.5rem" }} />
      </Box>
    </Box>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminVendorDetailPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { refreshKey } = useSocket();

  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActioning, setIsActioning] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const result = await vendorApplicationsApi.getById(vendorId, {
        force: true,
      });
      setVendor(result);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load vendor profile.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [vendorId, refreshKey]);

  async function handleApprove() {
    setIsActioning(true);
    try {
      const updated = await vendorApplicationsApi.approve(vendorId);
      setVendor((v) => ({
        ...v,
        verificationStatus: updated?.verificationStatus || "verified",
      }));
      setToast({
        open: true,
        message: "Vendor approved as active partner.",
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not approve.",
        severity: "error",
      });
    } finally {
      setIsActioning(false);
    }
  }

  async function handleReject() {
    if (!window.confirm("Reject this vendor? They will lose access to leads."))
      return;
    setIsActioning(true);
    try {
      const updated = await vendorApplicationsApi.reject(vendorId);
      setVendor((v) => ({
        ...v,
        verificationStatus: updated?.verificationStatus || "rejected",
      }));
      setToast({ open: true, message: "Vendor rejected.", severity: "info" });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not reject.",
        severity: "error",
      });
    } finally {
      setIsActioning(false);
    }
  }

  async function handleSetUnderReview() {
    setIsActioning(true);
    try {
      const updated = await vendorApplicationsApi.setUnderReview(vendorId);
      setVendor((v) => ({
        ...v,
        verificationStatus: updated?.verificationStatus || "submitted",
      }));
      setToast({
        open: true,
        message: "Moved to Under Review.",
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Could not update.",
        severity: "error",
      });
    } finally {
      setIsActioning(false);
    }
  }

  if (isLoading) return <AdminLoadingState />;

  if (error) {
    return (
      <AdminPageShell>
        <Button
          onClick={() => navigate("/admin/vendors")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 2,
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
          }}
        >
          Back to Vendors
        </Button>
        <AdminErrorState>{error}</AdminErrorState>
      </AdminPageShell>
    );
  }

  if (!vendor) return null;

  const statusDef = STATUS_META[vendor.verificationStatus] || STATUS_META.draft;
  const vettingScore = getVettingScore(vendor);
  const coverageAreas = vendor.company?.coverageArea
    ? vendor.company.coverageArea
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const activeServices = Object.entries(vendor.services || {})
    .filter(([, v]) => v)
    .map(([k]) =>
      k === "installation"
        ? "Installation"
        : k === "maintenance"
          ? "Maintenance"
          : k === "siteSurvey"
            ? "Site Survey"
            : "Consultation",
    );
  const isApproved = vendor.verificationStatus === "verified";
  const isRejected = vendor.verificationStatus === "rejected";

  return (
    <AdminPageShell>
      {/* Back nav */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <Button
          onClick={() => navigate("/admin/vendors")}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            color: adminUi.colors.muted,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": {
              bgcolor: "transparent",
              color: adminUi.colors.primary,
            },
          }}
        >
          Back to Vendors
        </Button>
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            onClick={load}
            sx={{
              color: adminUi.colors.muted,
              border: "1px solid rgba(225,232,241,0.96)",
              borderRadius: "0.65rem",
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Hero card */}
      <AdminPanel sx={{ p: { xs: 2, md: 2.8 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#EEF2F6",
                color: "#667386",
                fontSize: "1.4rem",
                fontWeight: 900,
                borderRadius: "1rem",
                border: "2px solid rgba(225,232,241,0.96)",
                flexShrink: 0,
              }}
            >
              {getInitials(vendor.account?.fullName)}
            </Avatar>
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  sx={{
                    color: adminUi.colors.text,
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {vendor.account?.fullName || "—"}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.3,
                    borderRadius: "999px",
                    bgcolor: statusDef.bg,
                    color: statusDef.tone,
                    fontSize: "0.62rem",
                    fontWeight: 900,
                  }}
                >
                  {statusDef.label}
                </Box>
              </Stack>
              <Typography
                sx={{
                  mt: 0.4,
                  color: adminUi.colors.muted,
                  fontSize: "0.88rem",
                }}
              >
                {vendor.company?.name || "—"}
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mt: 0.6 }}
                flexWrap="wrap"
              >
                {(vendor.company?.city || vendor.company?.state) && (
                  <Stack direction="row" spacing={0.4} alignItems="center">
                    <LocationOnOutlinedIcon
                      sx={{ color: "#9AAABB", fontSize: "0.85rem" }}
                    />
                    <Typography
                      sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
                    >
                      {[vendor.company?.city, vendor.company?.state]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Stack>
                )}
                {vendor.company?.experienceYears > 0 && (
                  <Stack direction="row" spacing={0.4} alignItems="center">
                    <WorkOutlineOutlinedIcon
                      sx={{ color: "#9AAABB", fontSize: "0.85rem" }}
                    />
                    <Typography
                      sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
                    >
                      {vendor.company.experienceYears}+ Years Experience
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Vetting score */}
          <Box
            sx={{
              p: 2,
              borderRadius: "1rem",
              border: "1px solid rgba(225,232,241,0.96)",
              textAlign: "center",
              minWidth: 110,
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: "#9AAABB",
                fontSize: "0.58rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 0.5,
              }}
            >
              Vetting Score
            </Typography>
            <Typography
              sx={{
                color:
                  vettingScore >= 8
                    ? "#239654"
                    : vettingScore >= 5
                      ? "#0E56C8"
                      : "#D97706",
                fontSize: "2.2rem",
                fontWeight: 950,
                lineHeight: 1,
              }}
            >
              {vettingScore.toFixed(1)}
            </Typography>
            <Typography sx={{ color: "#9AAABB", fontSize: "0.68rem" }}>
              /10
            </Typography>
          </Box>
        </Stack>
      </AdminPanel>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 280px" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <Stack spacing={2.5}>
          {/* Basic Info + Company Details */}
          <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 2,
                  }}
                >
                  Basic Information
                </Typography>
                <Stack spacing={1.8}>
                  <InfoRow
                    label="Full Name"
                    value={vendor.account?.fullName}
                    icon={PersonOutlineOutlinedIcon}
                  />
                  <InfoRow
                    label="Contact Number"
                    value={vendor.account?.phoneNumber}
                    icon={PhoneOutlinedIcon}
                  />
                  <InfoRow
                    label="Email Address"
                    value={vendor.account?.email}
                    icon={EmailOutlinedIcon}
                  />
                  <InfoRow
                    label="Office Address"
                    value={[
                      vendor.company?.address,
                      vendor.company?.city,
                      vendor.company?.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    icon={LocationOnOutlinedIcon}
                  />
                </Stack>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 2,
                  }}
                >
                  Company Details
                </Typography>
                <Stack spacing={1.8}>
                  <InfoRow
                    label="Business Type"
                    value={vendor.company?.businessType}
                    icon={BusinessOutlinedIcon}
                  />
                  <InfoRow
                    label="GST Number"
                    value={vendor.company?.gstNumber}
                  />
                  <InfoRow
                    label="Years of Operation"
                    value={
                      vendor.company?.experienceYears
                        ? `${vendor.company.experienceYears} Years`
                        : null
                    }
                  />
                  <InfoRow
                    label="Projects Completed"
                    value={
                      vendor.company?.projectsCompleted
                        ? `${vendor.company.projectsCompleted}+`
                        : null
                    }
                  />
                </Stack>
              </Box>
            </Box>
          </AdminPanel>

          {/* Experience & Capacity */}
          <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
            <Typography
              sx={{
                color: "#0E56C8",
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Experience & Capacity
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <StatCard
                value={`${vendor.company?.projectsCompleted || 0}+`}
                label="Projects Completed"
                accent="#0E56C8"
              />
              <StatCard
                value={
                  vendor.company?.experienceYears
                    ? `${vendor.company.experienceYears} yrs`
                    : "—"
                }
                label="Experience"
                accent="#239654"
              />
              <StatCard
                value={
                  vendor.company?.totalCapacityMw
                    ? `${vendor.company.totalCapacityMw} MW`
                    : "—"
                }
                label="Total Capacity"
                accent="#7C7A00"
              />
            </Stack>

            {coverageAreas.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    color: "#9AAABB",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 1,
                  }}
                >
                  Service Area
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {coverageAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      size="small"
                      sx={{
                        bgcolor: "#F0F4F8",
                        color: "#344155",
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        border: "1px solid rgba(225,232,241,0.96)",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {activeServices.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    color: "#9AAABB",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 1,
                  }}
                >
                  Services Offered
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {activeServices.map((svc) => (
                    <Chip
                      key={svc}
                      label={svc}
                      size="small"
                      icon={
                        <VerifiedOutlinedIcon
                          sx={{
                            fontSize: "0.8rem !important",
                            color: "#239654 !important",
                          }}
                        />
                      }
                      sx={{
                        bgcolor: "#E4F7EA",
                        color: "#239654",
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        border: "1px solid #B8EAC8",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </AdminPanel>

          {/* Documents */}
          <AdminPanel sx={{ p: { xs: 2, md: 2.8 } }}>
            <Typography
              sx={{
                color: "#0E56C8",
                fontSize: "0.62rem",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Certifications & Documents
            </Typography>
            {(vendor.documents?.length || 0) === 0 ? (
              <Typography sx={{ color: "#A0ACBA", fontSize: "0.84rem" }}>
                No documents uploaded.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 1.5,
                }}
              >
                {vendor.documents.map((doc) => (
                  <DocumentCard
                    key={doc.id || doc._id || doc.fileName}
                    doc={doc}
                  />
                ))}
              </Box>
            )}
          </AdminPanel>
        </Stack>

        {/* Right column — Status & Actions */}
        <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
          <AdminPanel sx={{ p: 2.4 }}>
            <Typography
              sx={{
                color: adminUi.colors.text,
                fontSize: "1rem",
                fontWeight: 900,
                mb: 2,
              }}
            >
              Vendor Status
            </Typography>

            <Box
              sx={{
                mb: 2,
                p: 1.4,
                borderRadius: "0.85rem",
                bgcolor: statusDef.bg,
                border: `1px solid ${statusDef.tone}30`,
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: statusDef.tone,
                  }}
                />
                <Typography
                  sx={{
                    color: statusDef.tone,
                    fontSize: "0.82rem",
                    fontWeight: 900,
                  }}
                >
                  {statusDef.label}
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={1.2}>
              {!isApproved && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    isActioning ? (
                      <CircularProgress size={14} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )
                  }
                  onClick={handleApprove}
                  disabled={isActioning}
                  sx={{
                    minHeight: 48,
                    borderRadius: "0.9rem",
                    bgcolor: "#0E56C8",
                    fontSize: "0.88rem",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(14,86,200,0.22)",
                    "&:hover": { bgcolor: "#0B49AD" },
                  }}
                >
                  {isActioning ? "Processing…" : "Approve Partner"}
                </Button>
              )}
              {!isRejected && (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CancelRoundedIcon />}
                  onClick={handleReject}
                  disabled={isActioning}
                  sx={{
                    minHeight: 44,
                    borderRadius: "0.9rem",
                    borderColor: "#D94444",
                    color: "#D94444",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    textTransform: "none",
                    bgcolor: "#FFF8F8",
                    "&:hover": { bgcolor: "#FDECEC" },
                  }}
                >
                  Reject Vendor
                </Button>
              )}
              {(isApproved || isRejected) && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSetUnderReview}
                  disabled={isActioning}
                  sx={{
                    minHeight: 40,
                    borderRadius: "0.9rem",
                    borderColor: "rgba(225,232,241,0.96)",
                    color: adminUi.colors.muted,
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#F4F7FB",
                    "&:hover": { bgcolor: "#EEF4FF", color: "#0E56C8" },
                  }}
                >
                  Move to Under Review
                </Button>
              )}
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(225,232,241,0.96)" }} />

            <Stack spacing={1.2}>
              {[
                { label: "Vendor ID", value: vendor.vendorId },
                {
                  label: "Documents",
                  value: `${vendor.documents?.length || 0} uploaded`,
                },
                {
                  label: "Submitted",
                  value: vendor.onboardingSubmittedAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(vendor.onboardingSubmittedAt))
                    : "Not submitted",
                },
                {
                  label: "Vetting Score",
                  value: `${vettingScore.toFixed(1)} / 10`,
                },
              ].map(({ label, value }) => (
                <Stack
                  key={label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{ color: adminUi.colors.muted, fontSize: "0.78rem" }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      color: adminUi.colors.text,
                      fontSize: "0.8rem",
                      fontWeight: 800,
                    }}
                  >
                    {value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </AdminPanel>
        </Stack>
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

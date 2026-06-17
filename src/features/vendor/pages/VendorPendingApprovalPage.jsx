import { Alert, Box, Button, Collapse, Stack, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppFooter } from "@/shared/components/AppFooter";
import { useAuth } from "@/features/auth/AuthProvider";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";
import { useSocket } from "@/shared/websocket/SocketProvider";

export default function VendorPendingApprovalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { refreshKey } = useSocket();
  const error = location.state?.error;

  const [showReview, setShowReview] = useState(false);
  const [profile, setProfile] = useState(null);

  // Initial profile load
  useEffect(() => {
    vendorsApi
      .getMyProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  // When the socket fires a refresh event (e.g. admin just approved this vendor),
  // re-fetch the profile bypassing cache and redirect instantly if now verified.
  useEffect(() => {
    if (refreshKey === 0) return;
    vendorsApi
      .getMyProfile({ force: true })
      .then((updated) => {
        if (updated?.verificationStatus === "verified") {
          navigate("/vendor", { replace: true });
        } else {
          setProfile(updated);
        }
      })
      .catch(() => {});
  }, [refreshKey, navigate]);

  const company = profile?.company || {};
  const documents = profile?.documents || [];
  const services = profile?.services || {};

  const submittedAt = profile?.onboardingSubmittedAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(profile.onboardingSubmittedAt))
    : null;

  const serviceList = Object.entries(services)
    .filter(([, v]) => v)
    .map(([k]) => {
      const map = {
        installation: "Installation",
        maintenance: "Maintenance",
        siteSurvey: "Site Survey",
        consultation: "Consultation",
      };
      return map[k] || k;
    });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(220,234,250,0.9) 0%, rgba(245,249,252,0.96) 30%, #F7FAFC 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 5, md: 7 },
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 760 }}>
          {error && (
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: "0.95rem" }}>
              {error}
            </Alert>
          )}

          {/* ── Main card ── */}
          <Box
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: "1.8rem",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(223,231,241,0.92)",
              boxShadow: "0 22px 50px rgba(16,29,51,0.08)",
            }}
          >
            <Stack spacing={2.2} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "1.2rem",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <AccessTimeRoundedIcon sx={{ fontSize: "2rem" }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: { xs: "2rem", md: "2.55rem" },
                    fontWeight: 800,
                    lineHeight: 1.04,
                  }}
                >
                  Application under review
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    maxWidth: 520,
                    color: "#6D7A8C",
                    fontSize: "0.98rem",
                    lineHeight: 1.72,
                  }}
                >
                  Your partner onboarding has been submitted to Sparkin admin.
                  We&apos;ll unlock the vendor portal as soon as your company,
                  documents, and experience details are approved.
                </Typography>
                {submittedAt && (
                  <Typography
                    sx={{ mt: 0.8, color: "#9AAABB", fontSize: "0.78rem" }}
                  >
                    Submitted on {submittedAt}
                  </Typography>
                )}
              </Box>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ width: "100%" }}
              >
                <InfoCard
                  icon={
                    <CheckCircleOutlineRoundedIcon
                      sx={{ fontSize: "1.1rem" }}
                    />
                  }
                  title="Application submitted"
                  body="Your company profile and compliance documents are safely in review."
                />
                <InfoCard
                  icon={<MailOutlineRoundedIcon sx={{ fontSize: "1.1rem" }} />}
                  title="Approval update"
                  body="Admin approval will unlock your full partner workspace. You can check back here anytime."
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <Button
                  onClick={() => setShowReview((v) => !v)}
                  variant="outlined"
                  endIcon={
                    showReview ? (
                      <KeyboardArrowUpRoundedIcon />
                    ) : (
                      <ChevronRightRoundedIcon />
                    )
                  }
                  sx={{
                    minWidth: 190,
                    minHeight: 46,
                    borderRadius: "0.9rem",
                    borderColor: "#0E56C8",
                    color: "#0E56C8",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {showReview ? "Hide Application" : "Review Application"}
                </Button>
                <Button
                  onClick={logout}
                  variant="contained"
                  sx={{
                    minWidth: 190,
                    minHeight: 46,
                    borderRadius: "0.9rem",
                    bgcolor: "#0E56C8",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.18)",
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* ── Review summary (expandable) ── */}
          <Collapse in={showReview} timeout={320}>
            <Box
              sx={{
                mt: 2,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "1.5rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(223,231,241,0.92)",
                boxShadow: "0 12px 32px rgba(16,29,51,0.06)",
              }}
            >
              {/* Admin reviewing banner */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  mb: 3,
                  p: 1.8,
                  borderRadius: "1rem",
                  bgcolor: "#EEF4FF",
                  border: "1px solid rgba(14,86,200,0.15)",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.85rem",
                    bgcolor: "#0E56C8",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <HourglassTopRoundedIcon sx={{ fontSize: "1.1rem" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "#0E56C8",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                    }}
                  >
                    Admin is reviewing your application
                  </Typography>
                  <Typography
                    sx={{
                      color: "#5E7BB0",
                      fontSize: "0.78rem",
                      lineHeight: 1.5,
                    }}
                  >
                    Our team is verifying your documents and company details.
                    This usually takes 1–2 business days.
                  </Typography>
                </Box>
              </Stack>

              {/* Company details */}
              <ReviewSection
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} />}
                title="Company Details"
              >
                <Stack spacing={1.2}>
                  <ReviewRow label="Company Name" value={company.name} />
                  <ReviewRow
                    label="Business Type"
                    value={company.businessType}
                  />
                  <ReviewRow
                    label="Location"
                    value={[company.city, company.state]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <ReviewRow
                    label="Experience"
                    value={
                      company.experienceYears
                        ? `${company.experienceYears} Years`
                        : null
                    }
                  />
                  <ReviewRow
                    label="Projects Completed"
                    value={
                      company.projectsCompleted
                        ? `${company.projectsCompleted}+`
                        : null
                    }
                  />
                  <ReviewRow
                    label="Total Capacity"
                    value={
                      company.totalCapacityMw
                        ? `${company.totalCapacityMw} MW`
                        : null
                    }
                  />
                  {serviceList.length > 0 && (
                    <Box>
                      <Typography
                        sx={{
                          color: "#9AAABB",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          mb: 0.6,
                        }}
                      >
                        Services Offered
                      </Typography>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        useFlexGap
                        spacing={0.6}
                      >
                        {serviceList.map((s) => (
                          <Box
                            key={s}
                            sx={{
                              px: 1,
                              py: 0.35,
                              borderRadius: "0.5rem",
                              bgcolor: "#EDFFF5",
                              color: "#0A7A40",
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                            }}
                          >
                            {s}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </ReviewSection>

              {/* Documents */}
              <ReviewSection
                icon={<ArticleOutlinedIcon sx={{ fontSize: "1rem" }} />}
                title="Uploaded Documents"
                sx={{ mt: 2.5 }}
              >
                {documents.length === 0 ? (
                  <Typography sx={{ color: "#9AAABB", fontSize: "0.82rem" }}>
                    No documents uploaded.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {documents.map((doc) => (
                      <Stack
                        key={doc.id || doc._id || doc.fileName}
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        sx={{
                          p: 1.2,
                          borderRadius: "0.85rem",
                          bgcolor: "#F6F9FD",
                          border: "1px solid rgba(224,232,242,0.9)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "0.7rem",
                            bgcolor: "#EEF4FF",
                            color: "#0E56C8",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <ArticleOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "#18253A",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc.title || doc.fileName}
                          </Typography>
                          <Typography
                            sx={{ color: "#9AAABB", fontSize: "0.68rem" }}
                          >
                            {doc.type === "company"
                              ? "Company Document"
                              : "Certification"}{" "}
                            · {doc.fileName}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            px: 0.9,
                            py: 0.3,
                            borderRadius: "999px",
                            bgcolor: "#DDF8E7",
                            color: "#239654",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          Uploaded
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </ReviewSection>
            </Box>
          </Collapse>
        </Box>
      </Box>
      <AppFooter />
    </Box>
  );
}

function InfoCard({ icon, title, body }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2,
        borderRadius: "1.2rem",
        bgcolor: "#F6F9FD",
        border: "1px solid rgba(224,232,242,0.9)",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "0.9rem",
          bgcolor: "#FFFFFF",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
          mb: 1.2,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{ color: "#18253A", fontSize: "0.94rem", fontWeight: 800 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.45,
          color: "#6D7A8C",
          fontSize: "0.84rem",
          lineHeight: 1.65,
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

function ReviewSection({ icon, title, children, sx = {} }) {
  return (
    <Box sx={sx}>
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.5 }}>
        <Box sx={{ color: "#0E56C8" }}>{icon}</Box>
        <Typography
          sx={{ color: "#18253A", fontSize: "0.88rem", fontWeight: 800 }}
        >
          {title}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ color: "#9AAABB", fontSize: "0.76rem" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          color: "#18253A",
          fontSize: "0.8rem",
          fontWeight: 700,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

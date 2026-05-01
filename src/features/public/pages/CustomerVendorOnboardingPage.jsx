import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import { projectsApi } from "@/features/public/api/projectsApi";
import { publicVendorsApi } from "@/features/public/api/vendorsApi";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing } from "@/features/public/pages/publicPageStyles";

function getAddress(company) {
  return [company?.address, company?.city, company?.state].filter(Boolean).join(", ");
}

function getExperienceBand(years) {
  const value = Number(years) || 0;
  if (value >= 8) return "8+";
  if (value >= 4) return "4-7";
  return "1-3";
}

function getCompletion(profile) {
  if (!profile) return 0;

  const checks = [
    profile.company?.name,
    profile.company?.businessType,
    profile.company?.address,
    profile.company?.city,
    profile.company?.state,
    Number(profile.company?.experienceYears) > 0 ? "experience" : "",
    Number(profile.company?.projectsCompleted) > 0 ? "projects" : "",
    Number(profile.company?.totalCapacityMw) > 0 ? "capacity" : "",
    profile.documents?.some((document) => document.type === "company") ? "license" : "",
    profile.documents?.some((document) => document.type === "certification") ? "insurance" : "",
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function CustomerVendorOnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const [project, setProject] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOnboarding() {
      setIsLoading(true);
      setError("");

      try {
        const projectRecord = projectId ? await projectsApi.getProject(projectId) : (await projectsApi.listProjects())[0] ?? null;
        const profile = projectRecord?.vendorId
          ? await publicVendorsApi.getVendorProfile(projectRecord.vendorId)
          : null;

        if (!active) return;
        setProject(projectRecord);
        setVendorProfile(profile);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load vendor onboarding.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadOnboarding();

    return () => {
      active = false;
    };
  }, [projectId]);

  const company = vendorProfile?.company || {};
  const documents = vendorProfile?.documents || [];
  const licenseDocument = documents.find((document) => document.type === "company");
  const insuranceDocument = documents.find((document) => document.type === "certification");
  const completion = getCompletion(vendorProfile);
  const experienceBand = getExperienceBand(company.experienceYears);
  const projectsCompleted = Number(company.projectsCompleted) || 0;
  const projectsProgress = Math.min(100, Math.max(12, projectsCompleted * 2));
  const capacityMw = Number(company.totalCapacityMw) || 0;

  const submittedPayload = useMemo(
    () => ({
      contactName: project?.customer?.fullName || "Customer",
      contactPhone: project?.customer?.phoneNumber || "0000000000",
      preferredVisitWindow: "morning",
      siteAccessNotes: `Vendor profile reviewed for ${company.name || "selected vendor"}.`,
    }),
    [company.name, project],
  );

  async function submitApplication() {
    if (!project?.id) {
      setError("Project is required before onboarding can be submitted.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const updated = await projectsApi.submitOnboarding(project.id, submittedPayload);
      navigate(`/project/installation?projectId=${updated.id}`, { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not submit onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          background:
            "radial-gradient(circle at top center, rgba(226,238,231,0.72) 0%, #F7FAF8 34%, #F3F8F5 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Box sx={{ maxWidth: 1120, mx: "auto" }}>
            <Box sx={{ textAlign: "center", mb: { xs: 3.5, md: 4.25 } }}>
              <Typography sx={{ color: "#18253A", fontSize: { xs: "2rem", md: "2.45rem" }, fontWeight: 800, lineHeight: 1.04 }}>
                Vendor Onboarding
              </Typography>
              <Typography sx={{ mt: 0.8, color: "#687589", fontSize: { xs: "0.95rem", md: "1rem" }, lineHeight: 1.72 }}>
                Finalize your professional profile to start receiving project leads.
              </Typography>
            </Box>

            {error ? <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>{error}</Alert> : null}

            {isLoading ? (
              <Box sx={{ minHeight: 520, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : null}

            {!isLoading && vendorProfile ? (
              <>
                <Box sx={{ p: { xs: 2, md: 2.35 }, borderRadius: "0.75rem", bgcolor: "rgba(255,255,255,0.86)", boxShadow: "0 14px 35px rgba(19,34,54,0.07)", mb: { xs: 3, md: 3.6 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#005BC8", color: "#FFFFFF", display: "grid", placeItems: "center" }}>
                        <VerifiedUserOutlinedIcon sx={{ fontSize: "1rem" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: "#005BC8", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          Onboarding Status
                        </Typography>
                        <Typography sx={{ color: "#152033", fontSize: "1.1rem", fontWeight: 800, lineHeight: 1.1 }}>
                          Final Review
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ color: "#005BC8", fontSize: "2rem", fontWeight: 900, lineHeight: 0.95 }}>
                        {completion}%
                      </Typography>
                      <Typography sx={{ mt: 0.2, color: "#6C7787", fontSize: "0.62rem", fontWeight: 700 }}>
                        Profile Completion
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 2, height: 8, borderRadius: 999, bgcolor: "#DCE9F8", overflow: "hidden" }}>
                    <Box sx={{ width: `${completion}%`, height: "100%", bgcolor: "#005BC8" }} />
                  </Box>
                </Box>

                <Stack spacing={{ xs: 2.7, md: 3.4 }}>
                  <Panel number="1" title="Company Profile">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 1.6, md: 2.6 } }}>
                      <DisplayField label="Legal Company Name" value={company.name || "e.g., Solar Flow Systems LLC"} muted={!company.name} />
                      <DisplayField label="Business Type" value={company.businessType || "EPC Contractor"} hasArrow />
                      <Box sx={{ gridColumn: "1 / -1" }}>
                        <DisplayField
                          label="Business Address"
                          value={getAddress(company) || "Street Address, Suite, City, State, ZIP"}
                          muted={!getAddress(company)}
                          icon={<LocationOnOutlinedIcon sx={{ fontSize: "0.95rem" }} />}
                        />
                      </Box>
                    </Box>
                  </Panel>

                  <Box sx={{ p: { xs: 2.5, md: 3.8 }, borderRadius: "1.55rem", bgcolor: "rgba(248,250,253,0.92)" }}>
                    <StepTitle number="2" title="Certifications & Compliance" />
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 1.8, md: 2.4 } }}>
                      <DocumentCard
                        icon={<DescriptionOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
                        title="Electrical License"
                        subtitle={licenseDocument ? licenseDocument.fileName : "PDF or JPEG, max 10MB"}
                      />
                      <DocumentCard
                        icon={<ShieldOutlinedIcon sx={{ fontSize: "1.05rem" }} />}
                        title="Liability Insurance"
                        subtitle={insuranceDocument ? insuranceDocument.fileName : "Valid for current fiscal year"}
                      />
                    </Box>
                  </Box>

                  <Panel number="3" title="Professional Experience">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" }, gap: { xs: 2.2, md: 5 }, alignItems: "end" }}>
                      <Box>
                        <Typography sx={{ mb: 1.2, color: "#263449", fontSize: "0.72rem", fontWeight: 700 }}>
                          Years of Solar Experience
                        </Typography>
                        <Stack direction="row" spacing={1.2}>
                          {["1-3", "4-7", "8+"].map((item) => (
                            <ExperiencePill key={item} active={item === experienceBand}>
                              {item}
                            </ExperiencePill>
                          ))}
                        </Stack>
                      </Box>

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.3 }}>
                          <Typography sx={{ color: "#263449", fontSize: "0.72rem", fontWeight: 700 }}>
                            Projects Completed
                          </Typography>
                          <Typography sx={{ color: "#005BC8", fontSize: "0.72rem", fontWeight: 800 }}>
                            {projectsCompleted || "50+"}
                          </Typography>
                        </Stack>
                        <Box sx={{ height: 7, borderRadius: 999, bgcolor: "#E4E8ED", overflow: "hidden" }}>
                          <Box sx={{ width: `${projectsCompleted ? projectsProgress : 86}%`, height: "100%", bgcolor: "#C8D0D9" }} />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2.7, display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.95fr 2fr" }, gap: 1.4 }}>
                      <MetricCard tone="#FEFDE8" color="#737600" title={`${capacityMw || "1.2"} MW`} subtitle="Total Capacity Installed" icon={<BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />} />
                      <MetricCard tone="#E7F4EC" color="#00813F" title="Platinum Tier" subtitle="Partner Reliability Rating" avatars />
                    </Box>
                  </Panel>

                  <Box sx={{ p: { xs: 2.4, md: 3 }, borderRadius: "1.5rem", bgcolor: "#2A3032", color: "#FFFFFF", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: "1.32rem", fontWeight: 800 }}>Ready to Launch?</Typography>
                      <Typography sx={{ mt: 0.55, color: "rgba(255,255,255,0.72)", fontSize: "0.76rem" }}>
                        By submitting, you agree to our Vendor Terms & Conditions.
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      disabled={isSubmitting}
                      endIcon={<RocketLaunchOutlinedIcon sx={{ fontSize: "1rem" }} />}
                      onClick={submitApplication}
                      sx={{ minWidth: 210, minHeight: 58, borderRadius: "0.9rem", fontSize: "0.86rem", fontWeight: 800, textTransform: "none", bgcolor: "#005BC8", boxShadow: "none" }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : null}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function Panel({ number, title, children }) {
  return (
    <Box sx={{ p: { xs: 2.5, md: 3.8 }, borderRadius: "1.55rem", bgcolor: "#FFFFFF", border: "1px solid rgba(224,231,239,0.82)", boxShadow: "0 16px 34px rgba(20,35,55,0.06)" }}>
      <StepTitle number={number} title={title} />
      {children}
    </Box>
  );
}

function StepTitle({ number, title }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.4 }}>
      <Box sx={{ width: 23, height: 23, borderRadius: "0.42rem", bgcolor: "#DCE8FF", color: "#005BC8", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 900 }}>
        {number}
      </Box>
      <Typography sx={{ color: "#18253A", fontSize: "1.2rem", fontWeight: 800 }}>
        {title}
      </Typography>
    </Stack>
  );
}

function DisplayField({ label, value, icon, hasArrow = false, muted = false }) {
  return (
    <Box>
      <Typography sx={{ mb: 0.65, color: "#263449", fontSize: "0.68rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Box sx={{ minHeight: 48, px: 1.35, borderRadius: "0.72rem", bgcolor: "#F0F2F5", color: muted ? "#7B8797" : "#253349", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, fontSize: "0.78rem", fontWeight: 600 }}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          {icon ? <Box sx={{ color: "#6F7B8C", display: "grid", placeItems: "center" }}>{icon}</Box> : null}
          <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.78rem" }}>
            {value}
          </Typography>
        </Stack>
        {hasArrow ? <KeyboardArrowDownRoundedIcon sx={{ color: "#7B8797", fontSize: "1rem" }} /> : null}
      </Box>
    </Box>
  );
}

function DocumentCard({ icon, title, subtitle }) {
  return (
    <Box sx={{ minHeight: 150, borderRadius: "0.95rem", border: "1px dashed #AEBBD0", bgcolor: "#FFFFFF", display: "grid", placeItems: "center", textAlign: "center", px: 2 }}>
      <Box>
        <Box sx={{ mx: "auto", width: 46, height: 46, borderRadius: "50%", bgcolor: "#EEF3FF", color: "#005BC8", display: "grid", placeItems: "center", mb: 1.5 }}>
          {icon}
        </Box>
        <Typography sx={{ color: "#18253A", fontSize: "0.78rem", fontWeight: 800 }}>{title}</Typography>
        <Typography sx={{ mt: 0.35, color: "#5D6878", fontSize: "0.68rem", fontWeight: 500 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}

function ExperiencePill({ active, children }) {
  return (
    <Box sx={{ minWidth: 92, py: 1, borderRadius: "0.7rem", bgcolor: active ? "#EAF1FF" : "#F0F2F5", border: active ? "2px solid #005BC8" : "2px solid transparent", color: active ? "#005BC8" : "#4E5B6C", fontSize: "0.78rem", fontWeight: 800, textAlign: "center" }}>
      {children}
    </Box>
  );
}

function MetricCard({ tone, color, title, subtitle, icon, avatars = false }) {
  return (
    <Box sx={{ position: "relative", minHeight: 112, p: 2.1, borderRadius: "0.9rem", bgcolor: tone, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {avatars ? (
        <Stack direction="row" spacing={-0.4} sx={{ position: "absolute", top: 18, right: 18 }}>
          {["#243142", "#B86942", "#121212"].map((bg, index) => (
            <Box key={bg} sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: bg, border: "2px solid #E7F4EC", transform: `translateX(${-index * 2}px)` }} />
          ))}
        </Stack>
      ) : (
        <Box sx={{ color, mb: 0.55 }}>{icon}</Box>
      )}
      <Typography sx={{ color: "#18253A", fontSize: "1.22rem", fontWeight: 900, lineHeight: 1.05 }}>{title}</Typography>
      <Typography sx={{ mt: 0.35, color, fontSize: "0.68rem", fontWeight: 700 }}>{subtitle}</Typography>
    </Box>
  );
}

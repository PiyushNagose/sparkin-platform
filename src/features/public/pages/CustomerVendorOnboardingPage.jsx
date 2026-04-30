import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import { projectsApi } from "@/features/public/api/projectsApi";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing } from "@/features/public/pages/publicPageStyles";

function formatWindow(value) {
  const labels = {
    "2_4_weeks": "2-4 Weeks",
    "4_6_weeks": "4-6 Weeks",
    "6_8_weeks": "6-8 Weeks",
  };

  return labels[value] || "Timeline shared";
}

function getVendorName(project) {
  return project?.vendorEmail ? project.vendorEmail.split("@")[0] : "Selected Vendor";
}

function getInitialForm(project) {
  return {
    contactName: project?.onboarding?.contactName || project?.customer?.fullName || "",
    contactPhone: project?.onboarding?.contactPhone || project?.customer?.phoneNumber || "",
    preferredVisitWindow: project?.onboarding?.preferredVisitWindow || "morning",
    siteAccessNotes: project?.onboarding?.siteAccessNotes || "",
  };
}

export default function CustomerVendorOnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId");
  const [project, setProject] = useState(null);
  const [form, setForm] = useState(getInitialForm(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setIsLoading(true);
      setError("");

      try {
        const result = projectId ? await projectsApi.getProject(projectId) : (await projectsApi.listProjects())[0] ?? null;
        if (!active) return;
        setProject(result);
        setForm(getInitialForm(result));
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load project onboarding.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  const completion = useMemo(() => {
    const checks = [
      project?.id,
      form.contactName,
      form.contactPhone,
      form.preferredVisitWindow,
      project?.installationAddress?.street,
      project?.system?.sizeKw,
      project?.pricing?.totalPrice,
      project?.vendorId,
      project?.timeline?.installationWindow,
      form.siteAccessNotes,
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form, project]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitOnboarding() {
    if (!project?.id) {
      setError("Project is required before onboarding can be submitted.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const updated = await projectsApi.submitOnboarding(project.id, {
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        preferredVisitWindow: form.preferredVisitWindow,
        siteAccessNotes: form.siteAccessNotes || null,
      });

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
            "radial-gradient(circle at top center, rgba(222,236,229,0.65) 0%, rgba(247,250,252,0.98) 32%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Box sx={{ maxWidth: 1120, mx: "auto" }}>
            <Box sx={{ textAlign: "center", mb: { xs: 3.5, md: 4.25 } }}>
              <Typography sx={{ color: "#18253A", fontSize: { xs: "2rem", md: "2.45rem" }, fontWeight: 800, lineHeight: 1.04 }}>
                Vendor Onboarding
              </Typography>
              <Typography sx={{ mt: 0.8, color: "#7A879A", fontSize: { xs: "0.95rem", md: "1rem" }, lineHeight: 1.72 }}>
                Confirm project handoff details before your installation workflow begins.
              </Typography>
            </Box>

            {error ? <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>{error}</Alert> : null}

            {isLoading ? (
              <Box sx={{ minHeight: 420, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : null}

            {!isLoading && project ? (
              <>
                <Box sx={{ p: { xs: 2.2, md: 2.6 }, borderRadius: "1.6rem", bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(223,231,241,0.92)", boxShadow: "0 16px 34px rgba(16,29,51,0.06)", mb: { xs: 3.2, md: 4.2 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={{ width: 36, height: 36, borderRadius: "0.95rem", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center" }}>
                        <VerifiedUserOutlinedIcon sx={{ fontSize: "1rem" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: "#6E7B8E", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Onboarding Status
                        </Typography>
                        <Typography sx={{ mt: 0.2, color: "#18253A", fontSize: "1.2rem", fontWeight: 800 }}>
                          {project.onboarding?.completedAt ? "Completed" : "Final Review"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ color: "#0E56C8", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
                        {completion}%
                      </Typography>
                      <Typography sx={{ mt: 0.15, color: "#7A879A", fontSize: "0.74rem", fontWeight: 700 }}>
                        Profile Completion
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 2.1, height: 8, borderRadius: 999, bgcolor: "#E6EDF7", overflow: "hidden" }}>
                    <Box sx={{ width: `${completion}%`, height: "100%", bgcolor: "#0E56C8" }} />
                  </Box>
                </Box>

                <Stack spacing={{ xs: 2.6, md: 3 }} sx={{ mb: { xs: 3.6, md: 4.2 } }}>
                  <Panel number="1" title="Selected Vendor">
                    <Grid container spacing={{ xs: 1.8, md: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <ReadonlyField label="Vendor Name" value={getVendorName(project)} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <ReadonlyField label="Installation Window" value={formatWindow(project.timeline?.installationWindow)} />
                      </Grid>
                      <Grid size={12}>
                        <ReadonlyField
                          label="Installation Address"
                          value={[
                            project.installationAddress?.street,
                            project.installationAddress?.landmark,
                            project.installationAddress?.city,
                            project.installationAddress?.state,
                            project.installationAddress?.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        />
                      </Grid>
                    </Grid>
                  </Panel>

                  <Panel number="2" title="Site Coordination">
                    <Grid container spacing={{ xs: 1.8, md: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <EditableField label="Site Contact Name" value={form.contactName} onChange={(value) => updateField("contactName", value)} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <EditableField label="Site Contact Phone" value={form.contactPhone} onChange={(value) => updateField("contactPhone", value)} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          select
                          fullWidth
                          label="Preferred Visit Window"
                          value={form.preferredVisitWindow}
                          onChange={(event) => updateField("preferredVisitWindow", event.target.value)}
                          InputProps={{ sx: { minHeight: 48, borderRadius: "0.85rem", bgcolor: "#F2F5F9" } }}
                        >
                          <MenuItem value="morning">Morning</MenuItem>
                          <MenuItem value="afternoon">Afternoon</MenuItem>
                          <MenuItem value="evening">Evening</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <ReadonlyField label="System Size" value={`${project.system?.sizeKw || "-"} kW ${project.system?.panelType || ""}`} />
                      </Grid>
                      <Grid size={12}>
                        <EditableField
                          label="Site Access Notes"
                          value={form.siteAccessNotes}
                          onChange={(value) => updateField("siteAccessNotes", value)}
                          multiline
                        />
                      </Grid>
                    </Grid>
                  </Panel>

                  <Panel number="3" title="Professional Experience">
                    <Grid container spacing={{ xs: 1.8, md: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <InfoCard icon={<UploadFileRoundedIcon />} title="Site Audit" text="Your vendor will validate roof access, wiring path, and metering details." />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <InfoCard icon={<VerifiedUserOutlinedIcon />} title="Project Handoff" text="After submission, your solar installation project tracker becomes active." />
                      </Grid>
                    </Grid>

                    <Grid container spacing={{ xs: 1.8, md: 2 }} sx={{ mt: 2.4 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MetricCard title={`${project.system?.sizeKw || 0} kW`} subtitle="Confirmed System Size" color="#6C6B0D" tone="linear-gradient(180deg, #FAF8CF 0%, #F5F3BF 100%)" />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MetricCard title="Verified Vendor" subtitle="Partner handoff ready" color="#108A49" tone="linear-gradient(180deg, #E3F7EA 0%, #D6F1DF 100%)" />
                      </Grid>
                    </Grid>
                  </Panel>
                </Stack>

                <Box sx={{ p: { xs: 2.2, md: 2.5 }, borderRadius: "1.45rem", bgcolor: "#2A2F36", color: "#FFFFFF", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: "1.5rem", fontWeight: 800 }}>Ready to Launch?</Typography>
                    <Typography sx={{ mt: 0.55, color: "rgba(255,255,255,0.72)", fontSize: "0.82rem" }}>
                      By submitting, you confirm the site coordination details for this project.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    disabled={isSubmitting || form.contactName.trim().length < 2 || form.contactPhone.trim().length < 6}
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={submitOnboarding}
                    sx={{ minWidth: 190, minHeight: 46, borderRadius: "0.82rem", fontSize: "0.84rem", fontWeight: 700, textTransform: "none", bgcolor: "#0E56C8", boxShadow: "none" }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </Box>
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
    <Box sx={{ p: { xs: 2.3, md: 2.8 }, borderRadius: "1.7rem", bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(223,231,241,0.92)", boxShadow: "0 16px 34px rgba(16,29,51,0.06)" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ width: 24, height: 24, borderRadius: "0.55rem", bgcolor: "#EEF3FF", color: "#285DDE", display: "grid", placeItems: "center", fontSize: "0.78rem", fontWeight: 800 }}>
          {number}
        </Box>
        <Typography sx={{ color: "#18253A", fontSize: "1.32rem", fontWeight: 800 }}>{title}</Typography>
      </Stack>
      {children}
    </Box>
  );
}

function ReadonlyField({ label, value }) {
  return <EditableField label={label} value={value} readOnly />;
}

function EditableField({ label, value, onChange, readOnly = false, multiline = false }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value || ""}
      onChange={(event) => onChange?.(event.target.value)}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      InputProps={{
        readOnly,
        sx: { minHeight: multiline ? 92 : 48, borderRadius: "0.85rem", bgcolor: "#F2F5F9", alignItems: multiline ? "flex-start" : "center" },
      }}
    />
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <Box sx={{ minHeight: 134, borderRadius: "1.1rem", border: "1px dashed rgba(181,198,226,0.96)", bgcolor: "rgba(255,255,255,0.92)", display: "grid", placeItems: "center", textAlign: "center", px: 2 }}>
      <Box>
        <Box sx={{ mx: "auto", width: 42, height: 42, borderRadius: "0.95rem", bgcolor: "#EEF3FF", color: "#285DDE", display: "grid", placeItems: "center", mb: 1 }}>
          {icon}
        </Box>
        <Typography sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800 }}>{title}</Typography>
        <Typography sx={{ mt: 0.35, color: "#7A879A", fontSize: "0.74rem" }}>{text}</Typography>
      </Box>
    </Box>
  );
}

function MetricCard({ title, subtitle, tone, color }) {
  return (
    <Box sx={{ p: 2, minHeight: 96, borderRadius: "1.1rem", background: tone, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <BoltRoundedIcon sx={{ fontSize: "0.95rem", color, mb: 0.55 }} />
      <Typography sx={{ color: "#18253A", fontSize: "1.18rem", fontWeight: 800 }}>{title}</Typography>
      <Typography sx={{ mt: 0.3, color, fontSize: "0.75rem", fontWeight: 700 }}>{subtitle}</Typography>
    </Box>
  );
}

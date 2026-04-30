import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";

const defaultCompany = {
  name: "",
  businessType: "EPC Contractor",
  address: "",
  city: "",
  state: "",
  coverageArea: "",
  experienceYears: 0,
  projectsCompleted: 0,
  totalCapacityMw: 0,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getCompletion(company, documents) {
  const checks = [
    company.name,
    company.businessType,
    company.address,
    company.city,
    company.state,
    Number(company.experienceYears) > 0 ? "experience" : "",
    Number(company.projectsCompleted) > 0 ? "projects" : "",
    Number(company.totalCapacityMw) > 0 ? "capacity" : "",
    documents.some((document) => document.type === "company") ? "company-doc" : "",
    documents.some((document) => document.type === "certification") ? "certification" : "",
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function OnboardingField({ label, value, onChange, placeholder, type = "text", multiline = false }) {
  return (
    <Box>
      <Typography sx={{ mb: 0.5, color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        InputProps={{
          sx: {
            minHeight: multiline ? 72 : 48,
            borderRadius: "0.85rem",
            bgcolor: "#F2F5F9",
            alignItems: multiline ? "flex-start" : "center",
          },
        }}
      />
    </Box>
  );
}

export default function VendorOnboardingPage() {
  const navigate = useNavigate();
  const companyDocumentRef = useRef(null);
  const certificationDocumentRef = useRef(null);
  const [company, setCompany] = useState(defaultCompany);
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await vendorsApi.getMyProfile();
        if (!active) return;
        setCompany({ ...defaultCompany, ...(profile.company || {}) });
        setDocuments(profile.documents || []);
        setStatus(profile.verificationStatus || "draft");
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load onboarding profile.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => getCompletion(company, documents), [company, documents]);
  const tierCards = [
    {
      title: `${Number(company.totalCapacityMw) || 0} MW`,
      subtitle: "Total Capacity Installed",
      tone: "linear-gradient(180deg, #FAF8CF 0%, #F5F3BF 100%)",
      color: "#6C6B0D",
    },
    {
      title: completion >= 80 ? "Review Ready" : "Complete Profile",
      subtitle: "Partner Reliability Status",
      tone: "linear-gradient(180deg, #E3F7EA 0%, #D6F1DF 100%)",
      color: "#108A49",
    },
  ];

  function updateCompany(field, value) {
    setCompany((current) => ({ ...current, [field]: value }));
  }

  async function saveCompany() {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const profile = await vendorsApi.updateMyProfile({
        company: {
          ...company,
          experienceYears: Number(company.experienceYears) || 0,
          projectsCompleted: Number(company.projectsCompleted) || 0,
          totalCapacityMw: Number(company.totalCapacityMw) || 0,
        },
      });
      setCompany({ ...defaultCompany, ...(profile.company || {}) });
      setDocuments(profile.documents || []);
      setStatus(profile.verificationStatus || "draft");
      setSuccess("Onboarding details saved.");
      return profile;
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not save onboarding details.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadDocument(type, event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a PDF, JPG, PNG, or WEBP document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Document must be smaller than 5MB.");
      return;
    }

    setUploadingType(type);
    setError("");
    setSuccess("");

    try {
      const data = await readFileAsDataUrl(file);
      const profile = await vendorsApi.uploadDocument({
        type,
        title: type === "company" ? "Electrical License" : "Liability Insurance",
        fileName: file.name,
        mimeType: file.type,
        data,
      });
      setDocuments(profile.documents || []);
      setStatus(profile.verificationStatus || "draft");
      setSuccess("Document uploaded.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not upload document.");
    } finally {
      setUploadingType("");
    }
  }

  async function submitApplication() {
    const saved = await saveCompany();
    if (!saved) return;

    if (getCompletion(saved.company || company, saved.documents || documents) < 80) {
      setError("Please complete at least 80% of your onboarding before submitting.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await vendorsApi.submitApplication();
      navigate("/vendor/profile", { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not submit application.");
    } finally {
      setIsSaving(false);
    }
  }

  function renderUploadCard(type, title, copy) {
    const ref = type === "company" ? companyDocumentRef : certificationDocumentRef;
    const uploaded = documents.find((document) => document.type === type);

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <input
          ref={ref}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => uploadDocument(type, event)}
        />
        <Button
          fullWidth
          disabled={uploadingType === type}
          onClick={() => ref.current?.click()}
          sx={{
            minHeight: 134,
            borderRadius: "1.1rem",
            border: "1px dashed rgba(181,198,226,0.96)",
            bgcolor: "rgba(255,255,255,0.92)",
            textAlign: "center",
            px: 2,
            textTransform: "none",
            color: "#18253A",
          }}
        >
          <Box>
            <Box sx={{ mx: "auto", width: 42, height: 42, borderRadius: "0.95rem", bgcolor: "#EEF3FF", color: "#285DDE", display: "grid", placeItems: "center", mb: 1 }}>
              <UploadFileRoundedIcon sx={{ fontSize: "1.1rem" }} />
            </Box>
            <Typography sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800 }}>
              {uploadingType === type ? "Uploading..." : title}
            </Typography>
            <Typography sx={{ mt: 0.35, color: uploaded ? "#108A49" : "#7A879A", fontSize: "0.74rem", fontWeight: uploaded ? 700 : 400 }}>
              {uploaded ? uploaded.fileName : copy}
            </Typography>
          </Box>
        </Button>
      </Grid>
    );
  }

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto" }}>
      <Box sx={{ textAlign: "center", mb: { xs: 3.5, md: 4.25 } }}>
        <Typography sx={{ color: "#18253A", fontSize: { xs: "2rem", md: "2.45rem" }, fontWeight: 800, lineHeight: 1.04 }}>
          Vendor Onboarding
        </Typography>
        <Typography sx={{ mt: 0.8, color: "#7A879A", fontSize: { xs: "0.95rem", md: "1rem" }, lineHeight: 1.72 }}>
          Finalize your professional profile to start receiving project leads.
        </Typography>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2, borderRadius: "0.9rem" }} onClose={() => setSuccess("")}>{success}</Alert> : null}

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
                {status === "submitted" ? "Submitted for Review" : completion >= 80 ? "Ready for Review" : isLoading ? "Loading" : "In Progress"}
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
        <Box sx={{ p: { xs: 2.3, md: 2.8 }, borderRadius: "1.7rem", bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(223,231,241,0.92)", boxShadow: "0 16px 34px rgba(16,29,51,0.06)" }}>
          <StepTitle number="1" title="Company Profile" />
          <Grid container spacing={{ xs: 1.8, md: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <OnboardingField label="Legal Company Name" value={company.name} onChange={(value) => updateCompany("name", value)} placeholder="e.g., Solar Flow Systems LLC" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <OnboardingField label="Business Type" value={company.businessType} onChange={(value) => updateCompany("businessType", value)} placeholder="EPC Contractor" />
            </Grid>
            <Grid size={12}>
              <OnboardingField label="Business Address" value={company.address} onChange={(value) => updateCompany("address", value)} placeholder="Street Address, Suite, City, State, ZIP" multiline />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <OnboardingField label="City" value={company.city} onChange={(value) => updateCompany("city", value)} placeholder="Mumbai" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <OnboardingField label="State" value={company.state} onChange={(value) => updateCompany("state", value)} placeholder="Maharashtra" />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: { xs: 2.3, md: 2.8 }, borderRadius: "1.7rem", bgcolor: "rgba(247,249,252,0.98)", border: "1px solid rgba(233,238,245,0.95)", boxShadow: "0 12px 28px rgba(16,29,51,0.04)" }}>
          <StepTitle number="2" title="Certifications & Compliance" />
          <Grid container spacing={{ xs: 1.8, md: 2 }}>
            {renderUploadCard("company", "Electrical License", "PDF or image, max 5MB")}
            {renderUploadCard("certification", "Liability Insurance", "Valid for current fiscal year")}
          </Grid>
        </Box>

        <Box sx={{ p: { xs: 2.3, md: 2.8 }, borderRadius: "1.7rem", bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(223,231,241,0.92)", boxShadow: "0 16px 34px rgba(16,29,51,0.06)" }}>
          <StepTitle number="3" title="Professional Experience" />
          <Grid container spacing={{ xs: 2, md: 2.4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <OnboardingField label="Years of Solar Experience" value={company.experienceYears} type="number" onChange={(value) => updateCompany("experienceYears", value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <OnboardingField label="Projects Completed" value={company.projectsCompleted} type="number" onChange={(value) => updateCompany("projectsCompleted", value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <OnboardingField label="Coverage Area" value={company.coverageArea} onChange={(value) => updateCompany("coverageArea", value)} placeholder="Pan India" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <OnboardingField label="Total Capacity MW" value={company.totalCapacityMw} type="number" onChange={(value) => updateCompany("totalCapacityMw", value)} />
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 1.8, md: 2 }} sx={{ mt: 2.4 }}>
            {tierCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, minHeight: 96, borderRadius: "1.1rem", background: card.tone, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <BoltRoundedIcon sx={{ fontSize: "0.95rem", color: card.color, mb: 0.55 }} />
                  <Typography sx={{ color: "#18253A", fontSize: "1.18rem", fontWeight: 800 }}>{card.title}</Typography>
                  <Typography sx={{ mt: 0.3, color: card.color, fontSize: "0.75rem", fontWeight: 700 }}>{card.subtitle}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      <Box sx={{ p: { xs: 2.2, md: 2.5 }, borderRadius: "1.45rem", bgcolor: "#2A2F36", color: "#FFFFFF", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 800 }}>Ready to Launch?</Typography>
          <Typography sx={{ mt: 0.55, color: "rgba(255,255,255,0.72)", fontSize: "0.82rem" }}>
            By submitting, you agree to our Vendor Terms & Conditions.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            variant="outlined"
            disabled={isSaving || isLoading}
            onClick={saveCompany}
            sx={{ minHeight: 46, borderRadius: "0.82rem", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.28)", fontSize: "0.84rem", fontWeight: 700, textTransform: "none" }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            disabled={isSaving || isLoading}
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={submitApplication}
            sx={{ minWidth: 190, minHeight: 46, borderRadius: "0.82rem", fontSize: "0.84rem", fontWeight: 700, textTransform: "none", bgcolor: "#0E56C8", boxShadow: "none" }}
          >
            {isSaving ? "Submitting..." : "Submit Application"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function StepTitle({ number, title }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Box sx={{ width: 24, height: 24, borderRadius: "0.55rem", bgcolor: "#EEF3FF", color: "#285DDE", display: "grid", placeItems: "center", fontSize: "0.78rem", fontWeight: 800 }}>
        {number}
      </Box>
      <Typography sx={{ color: "#18253A", fontSize: "1.32rem", fontWeight: 800 }}>
        {title}
      </Typography>
    </Stack>
  );
}

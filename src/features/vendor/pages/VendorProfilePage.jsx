import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { authApi } from "@/features/auth/authApi";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";
import { getVendorProfileCompletion, getVendorProfileRequirements, isVendorProfileComplete } from "@/features/vendor/VendorProfileCompletionGate";
import vendorProfileAvatar from "@/shared/assets/images/vendor/profile/vendor-profile-avatar-placeholder.svg";

const tabs = ["Profile", "Business Details"];
const identityApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1";
const identityOrigin = identityApiBaseUrl.replace(/\/api\/v1\/?$/, "");

const serviceItems = [
  { key: "installation", label: "Installation" },
  { key: "maintenance", label: "Maintenance" },
  { key: "siteSurvey", label: "Site Survey" },
  { key: "consultation", label: "Consultation" },
];

const emptyForm = {
  account: {
    fullName: "",
    email: "",
    phoneNumber: "",
  },
  company: {
    name: "",
    businessType: "EPC Contractor",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    coverageArea: "",
    experienceYears: 0,
    projectsCompleted: 0,
    totalCapacityMw: 0,
  },
  services: {
    installation: true,
    maintenance: false,
    siteSurvey: true,
    consultation: false,
  },
};

function mergeProfileIntoForm(profile, user) {
  return {
    account: {
      fullName: profile?.account?.fullName || user?.fullName || "",
      email: profile?.account?.email || user?.email || "",
      phoneNumber: profile?.account?.phoneNumber || user?.phoneNumber || "",
    },
    company: {
      ...emptyForm.company,
      ...(profile?.company || {}),
    },
    services: {
      ...emptyForm.services,
      ...(profile?.services || {}),
    },
  };
}

function formatBytes(value) {
  const size = Number(value) || 0;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(size / 1024))}KB`;
}

function SectionIntro({ title, description }) {
  return (
    <Box sx={{ maxWidth: 220 }}>
      <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 0.55, color: "#6F7D8F", fontSize: "0.76rem", lineHeight: 1.65 }}>
        {description}
      </Typography>
    </Box>
  );
}

function FieldBlock({ label, value, onChange, fullWidth, readOnly = false, type = "text" }) {
  return (
    <Box sx={{ gridColumn: fullWidth ? { xs: "auto", md: "1 / -1" } : "auto" }}>
      <Typography sx={{ mb: 0.45, color: "#6F7D8F", fontSize: "0.72rem", fontWeight: 700 }}>
        {label}
      </Typography>
      <Box
        sx={{
          minHeight: 38,
          px: 1.15,
          borderRadius: "0.8rem",
          bgcolor: readOnly ? "#F4F7FB" : "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          value={value ?? ""}
          type={type}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          sx={{
            width: "100%",
            color: "#223146",
            fontSize: "0.82rem",
            fontWeight: 600,
            "& input": { p: 0 },
          }}
        />
      </Box>
    </Box>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function VendorProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserAvatar, updateUserProfile } = useAuth();
  const avatarInputRef = useRef(null);
  const companyDocumentRef = useRef(null);
  const certificationDocumentRef = useRef(null);
  const [activeTab, setActiveTab] = useState(location.state?.needsBusinessProfile ? "Business Details" : "Profile");
  const [vendorProfile, setVendorProfile] = useState(null);
  const [form, setForm] = useState(() => mergeProfileIntoForm(null, user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadingDocumentType, setUploadingDocumentType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVendorProfile() {
      setIsLoading(true);
      setError("");

      try {
        const result = await vendorsApi.getMyProfile();
        if (!active) return;
        setVendorProfile(result);
        setForm(mergeProfileIntoForm(result, user));
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load vendor profile.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadVendorProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const documents = vendorProfile?.documents || [];
  const companyDocuments = documents.filter((document) => document.type === "company");
  const certificationDocuments = documents.filter((document) => document.type === "certification");
  const completedServices = serviceItems.filter((item) => form.services[item.key]).length;
  const draftProfile = useMemo(
    () => ({
      ...(vendorProfile || {}),
      account: form.account,
      company: form.company,
      services: form.services,
      documents,
    }),
    [documents, form, vendorProfile],
  );
  const completion = useMemo(() => getVendorProfileCompletion(draftProfile), [draftProfile]);
  const missingRequirements = useMemo(
    () => getVendorProfileRequirements(draftProfile).filter((item) => !item.complete),
    [draftProfile],
  );
  const isComplete = useMemo(() => isVendorProfileComplete(draftProfile), [draftProfile]);

  function publishProfileUpdate(profile) {
    window.dispatchEvent(new CustomEvent("sparkin:vendor-profile-updated", { detail: profile }));
  }

  function updateGroupField(group, field, value) {
    setForm((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));
  }

  function resetForm() {
    setForm(mergeProfileIntoForm(vendorProfile, user));
    setError("");
    setSuccess("");
  }

  function getAvatarSource() {
    if (!user?.avatarUrl) return vendorProfileAvatar;
    if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
    return `${identityOrigin}${user.avatarUrl}`;
  }

  async function handleAvatarSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP profile photo.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be smaller than 2MB.");
      return;
    }

    setIsUploadingAvatar(true);
    setError("");
    setSuccess("");

    try {
      const data = await readFileAsDataUrl(file);
      await updateUserAvatar({ fileName: file.name, contentType: file.type, data });
      setSuccess("Profile photo updated.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not upload profile photo.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleDocumentSelected(type, event) {
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

    setUploadingDocumentType(type);
    setError("");
    setSuccess("");

    try {
      const data = await readFileAsDataUrl(file);
      const result = await vendorsApi.uploadDocument({
        type,
        title: type === "company" ? "Company Document" : "Certification",
        fileName: file.name,
        mimeType: file.type,
        data,
      });
      setVendorProfile(result);
      publishProfileUpdate(result);
      setSuccess("Document uploaded.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not upload document.");
    } finally {
      setUploadingDocumentType("");
    }
  }

  async function deleteDocument(documentId) {
    setError("");
    setSuccess("");

    try {
      const result = await vendorsApi.deleteDocument(documentId);
      setVendorProfile(result);
      publishProfileUpdate(result);
      setSuccess("Document removed.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not remove document.");
    }
  }

  async function saveChanges() {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const [profile] = await Promise.all([
        vendorsApi.updateMyProfile({
          account: form.account,
          company: {
            ...form.company,
            experienceYears: Number(form.company.experienceYears) || 0,
            projectsCompleted: Number(form.company.projectsCompleted) || 0,
            totalCapacityMw: Number(form.company.totalCapacityMw) || 0,
          },
          services: form.services,
        }),
        updateUserProfile({
          fullName: form.account.fullName.trim(),
          phoneNumber: form.account.phoneNumber?.trim() || null,
        }),
      ]);

      setVendorProfile(profile);
      setForm(mergeProfileIntoForm(profile, user));
      publishProfileUpdate(profile);
      setSuccess("Vendor profile updated.");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not save vendor profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function renderDocumentZone(type, title, subtitle, records) {
    const inputRef = type === "company" ? companyDocumentRef : certificationDocumentRef;
    const isUploading = uploadingDocumentType === type;

    return (
      <Box>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => handleDocumentSelected(type, event)}
        />
        <Button
          fullWidth
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          sx={{
            p: 1.35,
            borderRadius: "1rem",
            bgcolor: "#FFFFFF",
            border: "1px dashed rgba(203,213,225,0.96)",
            textAlign: "center",
            textTransform: "none",
            color: "#223146",
          }}
        >
          <Box>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "0.9rem",
                bgcolor: "#F5F7FB",
                color: "#556478",
                display: "grid",
                placeItems: "center",
                mx: "auto",
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: "1rem" }} />
            </Box>
            <Typography sx={{ mt: 0.8, color: "#223146", fontSize: "0.8rem", fontWeight: 700 }}>
              {isUploading ? "Uploading..." : title}
            </Typography>
            <Typography sx={{ mt: 0.18, color: "#7A8799", fontSize: "0.68rem" }}>
              {subtitle}
            </Typography>
          </Box>
        </Button>

        <Stack spacing={0.8} sx={{ mt: 0.9 }}>
          {records.map((document) => (
            <DocumentRow key={document.id} document={document} onDelete={deleteDocument} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2.2} sx={{ pb: 1.15, borderBottom: "1px solid #E7ECF2" }}>
        {tabs.map((tab) => (
          <Box
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              pb: 0.95,
              borderBottom: activeTab === tab ? "2px solid #0E56C8" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                color: activeTab === tab ? "#0E56C8" : "#556478",
                fontSize: "0.78rem",
                fontWeight: activeTab === tab ? 800 : 600,
              }}
            >
              {tab}
            </Typography>
          </Box>
        ))}
      </Stack>

      {error ? <Alert severity="error" sx={{ mt: 1.4, borderRadius: "0.9rem" }}>{error}</Alert> : null}
      {location.state?.needsBusinessProfile ? (
        <Alert severity="info" sx={{ mt: 1.4, borderRadius: "0.9rem" }}>
          Complete all required business details before accessing vendor tools.
        </Alert>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ mt: 1.4, borderRadius: "0.9rem" }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={1.4}
        sx={{ mt: 2.3 }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            {activeTab === "Profile" ? "Vendor Profile" : "Business Details"}
          </Typography>
          <Typography sx={{ mt: 0.45, color: "#6F7D8F", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {activeTab === "Profile"
              ? "Manage your business identity and account security settings."
              : "Manage your commercial profile and operational certificates."}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="text"
            onClick={resetForm}
            sx={{ minHeight: 38, px: 1.2, color: "#556478", fontSize: "0.74rem", fontWeight: 700, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isSaving || isLoading || form.account.fullName.trim().length < 2}
            onClick={saveChanges}
            sx={{
              minHeight: 38,
              px: 2,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {isComplete ? (
            <Button
              variant="contained"
              onClick={() => navigate("/vendor", { replace: true })}
              sx={{
                minHeight: 38,
                px: 2,
                borderRadius: "0.95rem",
                bgcolor: "#239654",
                boxShadow: "0 12px 24px rgba(35,150,84,0.16)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Continue to Dashboard
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {!isComplete ? (
        <CompletionChecklist completion={completion} missingRequirements={missingRequirements} />
      ) : (
        <Alert severity="success" sx={{ mt: 1.4, borderRadius: "0.9rem" }}>
          Vendor profile is complete. You can access leads, quotes, projects, and payments.
        </Alert>
      )}

      {activeTab === "Profile" ? (
        <ProfileHeader
          form={form}
          user={user}
          avatarSource={getAvatarSource()}
          isUploadingAvatar={isUploadingAvatar}
          avatarInputRef={avatarInputRef}
          onAvatarSelected={handleAvatarSelected}
        />
      ) : (
        <BusinessHeader form={form} completedServices={completedServices} completion={completion} />
      )}

      <Box sx={{ mt: 1.8, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "0.55fr 1fr" }, gap: 1.7 }}>
        <SectionIntro
          title={activeTab === "Profile" ? "Account Details" : "Company Information"}
          description={
            activeTab === "Profile"
              ? "Update your contact information. This information will be visible on official quotes."
              : "Manage your registered business information shown across profile surfaces and commercial submissions."
          }
        />

        <Box sx={{ p: 1.45, borderRadius: "1.15rem", bgcolor: "#F8FAFD", border: "1px solid rgba(230,235,242,0.95)" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2 }}>
            {activeTab === "Profile" ? (
              <>
                <FieldBlock label="Full Name" value={form.account.fullName} onChange={(value) => updateGroupField("account", "fullName", value)} />
                <FieldBlock label="Email Address" value={form.account.email} readOnly />
                <FieldBlock label="Phone Number" value={form.account.phoneNumber} onChange={(value) => updateGroupField("account", "phoneNumber", value)} fullWidth />
              </>
            ) : (
              <>
                <FieldBlock label="Company Name" value={form.company.name} onChange={(value) => updateGroupField("company", "name", value)} />
                <FieldBlock label="GST Number" value={form.company.gstNumber} onChange={(value) => updateGroupField("company", "gstNumber", value)} />
                <FieldBlock label="Full Business Address" value={form.company.address} onChange={(value) => updateGroupField("company", "address", value)} fullWidth />
                <FieldBlock label="City" value={form.company.city} onChange={(value) => updateGroupField("company", "city", value)} />
                <FieldBlock label="State" value={form.company.state} onChange={(value) => updateGroupField("company", "state", value)} />
                <FieldBlock label="Coverage Area" value={form.company.coverageArea} onChange={(value) => updateGroupField("company", "coverageArea", value)} />
                <FieldBlock label="Experience Years" value={form.company.experienceYears} type="number" onChange={(value) => updateGroupField("company", "experienceYears", value)} />
                <FieldBlock label="Projects Completed" value={form.company.projectsCompleted} type="number" onChange={(value) => updateGroupField("company", "projectsCompleted", value)} />
                <FieldBlock label="Total Capacity MW" value={form.company.totalCapacityMw} type="number" onChange={(value) => updateGroupField("company", "totalCapacityMw", value)} />
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 1.9, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "0.55fr 1fr" }, gap: 1.7 }}>
        <SectionIntro
          title={activeTab === "Profile" ? "Security" : "Compliance Documents"}
          description={
            activeTab === "Profile"
              ? "Keep your account secure by enabling two-factor authentication and regularly updating your credentials."
              : "Upload business paperwork and certifications so your vendor account remains marketplace-ready."
          }
        />

        {activeTab === "Profile" ? (
          <SecurityPanel />
        ) : (
          <Box sx={{ p: 1.45, borderRadius: "1.15rem", bgcolor: "#F8FAFD", border: "1px solid rgba(230,235,242,0.95)" }}>
            <Stack spacing={1.05}>
              {renderDocumentZone("company", "Company Documents", "PDF, JPG, PNG, WEBP (Max 5MB)", companyDocuments)}
              {renderDocumentZone("certification", "Certifications & Awards", "Verified ISO or local certificates", certificationDocuments)}
            </Stack>
          </Box>
        )}
      </Box>

      {activeTab === "Business Details" ? (
        <Box sx={{ mt: 1.9, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "0.55fr 1fr" }, gap: 1.7 }}>
          <SectionIntro
            title="Service Capability"
            description="Choose the work categories you can handle so leads and service tickets can be routed correctly."
          />
          <Box sx={{ p: 1.45, borderRadius: "1.15rem", bgcolor: "#F8FAFD", border: "1px solid rgba(230,235,242,0.95)" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0.75 }}>
              {serviceItems.map((item) => (
                <Stack
                  key={item.key}
                  direction="row"
                  spacing={0.7}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ minHeight: 42, px: 0.9, borderRadius: "0.75rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)" }}
                >
                  <Stack direction="row" spacing={0.7} alignItems="center">
                    <CheckBoxRoundedIcon sx={{ color: form.services[item.key] ? "#0E56C8" : "#B8C2D0", fontSize: "0.95rem" }} />
                    <Typography sx={{ color: "#223146", fontSize: "0.74rem", fontWeight: 600 }}>{item.label}</Typography>
                  </Stack>
                  <Switch
                    size="small"
                    checked={Boolean(form.services[item.key])}
                    onChange={(event) => updateGroupField("services", item.key, event.target.checked)}
                  />
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

function CompletionChecklist({ completion, missingRequirements }) {
  const visibleMissing = missingRequirements.slice(0, 6);

  return (
    <Box
      sx={{
        mt: 1.4,
        p: 1.35,
        borderRadius: "1rem",
        bgcolor: "#FFF8E6",
        border: "1px solid rgba(244,165,28,0.28)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography sx={{ color: "#6B4E00", fontSize: "0.88rem", fontWeight: 800 }}>
            Business profile is {completion}% complete
          </Typography>
          <Typography sx={{ mt: 0.25, color: "#7A5B10", fontSize: "0.74rem", lineHeight: 1.55 }}>
            Required before accessing vendor dashboard, leads, quotes, projects, and payments.
          </Typography>
        </Box>
        <Box
          sx={{
            px: 1,
            py: 0.45,
            borderRadius: "999px",
            bgcolor: "#FFFFFF",
            color: "#6B4E00",
            fontSize: "0.68rem",
            fontWeight: 800,
          }}
        >
          {missingRequirements.length} item{missingRequirements.length === 1 ? "" : "s"} remaining
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 0.7,
        }}
      >
        {visibleMissing.map((item) => (
          <Box
            key={item.key}
            sx={{
              px: 0.9,
              py: 0.65,
              borderRadius: "0.75rem",
              bgcolor: "#FFFFFF",
              color: "#263449",
              fontSize: "0.72rem",
              fontWeight: 700,
              border: "1px solid rgba(244,165,28,0.18)",
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ProfileHeader({ form, user, avatarSource, isUploadingAvatar, avatarInputRef, onAvatarSelected }) {
  return (
    <Box sx={{ mt: 2.1, p: { xs: 1.35, md: 1.6 }, borderRadius: "1.25rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
      <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onAvatarSelected} />
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.6}>
        <Stack direction="row" spacing={1.35} alignItems="center">
          <Box component="img" src={avatarSource} alt="Vendor profile" sx={{ width: 112, height: 112, borderRadius: "50%", objectFit: "cover", boxShadow: "0 14px 28px rgba(16,29,51,0.1)" }} />
          <Box>
            <Typography sx={{ color: "#223146", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.05 }}>
              {form.account.fullName || "Vendor"}
            </Typography>
            <Typography sx={{ mt: 0.45, color: "#5F6C7E", fontSize: "0.88rem" }}>
              {form.account.email || user?.email || "Email not available"}
            </Typography>
            <Box sx={{ mt: 1.05, display: "inline-flex", px: 1, py: 0.38, borderRadius: "999px", bgcolor: "#E7F318", color: "#6C7300", fontSize: "0.64rem", fontWeight: 800, lineHeight: 1 }}>
              Vendor Account
            </Box>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<UploadOutlinedIcon />}
          disabled={isUploadingAvatar}
          onClick={() => avatarInputRef.current?.click()}
          sx={{ minHeight: 38, px: 1.45, borderRadius: "0.95rem", borderColor: "rgba(208,216,226,0.95)", bgcolor: "#F5F7FB", color: "#223146", fontSize: "0.74rem", fontWeight: 700, textTransform: "none" }}
        >
          {isUploadingAvatar ? "Uploading..." : "Change Photo"}
        </Button>
      </Stack>
    </Box>
  );
}

function BusinessHeader({ form, completedServices, completion }) {
  return (
    <Box sx={{ mt: 2.1, display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1.18fr 0.82fr" }, gap: 1.6 }}>
      <Box sx={{ p: { xs: 1.35, md: 1.5 }, borderRadius: "1.25rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", boxShadow: "0 14px 28px rgba(16,29,51,0.04)" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.2}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <Box component="img" src={vendorProfileAvatar} alt="Business profile" sx={{ width: 60, height: 60, borderRadius: "0.95rem", objectFit: "cover", boxShadow: "0 12px 24px rgba(16,29,51,0.08)" }} />
            <Box>
              <Typography sx={{ color: "#223146", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.08 }}>
                {form.company.name || "Company name pending"}
              </Typography>
              <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap" sx={{ mt: 0.65 }}>
                <Box sx={{ display: "inline-flex", px: 0.9, py: 0.34, borderRadius: "999px", bgcolor: "#E7F318", color: "#6C7300", fontSize: "0.62rem", fontWeight: 800, lineHeight: 1 }}>
                  {form.company.businessType || "EPC Contractor"}
                </Box>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: completion >= 80 ? "#239654" : "#F4A51C" }} />
                  <Typography sx={{ color: "#223146", fontSize: "0.74rem", fontWeight: 700 }}>
                    {completion}% Complete
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ width: 88, height: 88, borderRadius: "1.1rem", bgcolor: "#F7F9FC", border: "1px solid rgba(232,237,244,0.96)", color: "#D7DEE8", display: "grid", placeItems: "center" }}>
            <WorkspacePremiumOutlinedIcon sx={{ fontSize: "2.2rem" }} />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 1.45, borderRadius: "1.15rem", bgcolor: "#F8FAFD", border: "1px solid rgba(230,235,242,0.95)" }}>
        <Stack direction="row" spacing={0.9} alignItems="center" sx={{ mb: 1.35 }}>
          <Box sx={{ width: 30, height: 30, borderRadius: "0.8rem", bgcolor: "#EEF4FF", color: "#0E56C8", display: "grid", placeItems: "center" }}>
            <BusinessOutlinedIcon sx={{ fontSize: "0.95rem" }} />
          </Box>
          <Typography sx={{ color: "#223146", fontSize: "0.96rem", fontWeight: 800 }}>
            Service Capability
          </Typography>
        </Stack>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}>
          <Metric label="Services" value={String(completedServices)} tone="#0E56C8" />
          <Metric label="Coverage Area" value={form.company.coverageArea || "Pending"} tone="#0E56C8" />
          <Metric label="Experience" value={`${Number(form.company.experienceYears) || 0}+ years`} tone="#239654" />
          <Metric label="Capacity" value={`${Number(form.company.totalCapacityMw) || 0} MW`} tone="#239654" />
        </Box>
      </Box>
    </Box>
  );
}

function Metric({ label, value, tone }) {
  return (
    <Box sx={{ minHeight: 38, px: 1, borderRadius: "0.8rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Typography sx={{ color: "#7D8797", fontSize: "0.64rem", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ mt: 0.16, color: tone, fontSize: "0.76rem", fontWeight: 800 }}>{value}</Typography>
    </Box>
  );
}

function SecurityPanel() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(() => window.localStorage.getItem("sparkin.vendor.mfaEnabled") !== "false");

  function updatePasswordField(field, value) {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  }

  function toggleMfa(value) {
    setMfaEnabled(value);
    window.localStorage.setItem("sparkin.vendor.mfaEnabled", String(value));
  }

  async function changePassword() {
    setIsChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      await authApi.changePassword(passwordForm);
      setPasswordSuccess("Password updated.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setIsPasswordDialogOpen(false);
    } catch (apiError) {
      setPasswordError(apiError?.response?.data?.message || "Could not update password.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <>
      <Box sx={{ p: 1.45, borderRadius: "1.15rem", bgcolor: "#F8FAFD", border: "1px solid rgba(230,235,242,0.95)" }}>
        <Stack spacing={1.25}>
          {passwordError ? <Alert severity="error" sx={{ borderRadius: "0.85rem" }}>{passwordError}</Alert> : null}
          {passwordSuccess ? <Alert severity="success" sx={{ borderRadius: "0.85rem" }}>{passwordSuccess}</Alert> : null}
          <Stack direction="row" justifyContent="space-between" spacing={1.2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 30, height: 30, borderRadius: "0.8rem", bgcolor: "#EEF4FF", color: "#0E56C8", display: "grid", placeItems: "center" }}>
                <LockResetOutlinedIcon sx={{ fontSize: "0.95rem" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 800 }}>Password</Typography>
                <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.7rem" }}>
                  Update your login password through identity service.
                </Typography>
              </Box>
            </Stack>
            <Button
              onClick={() => {
                setPasswordError("");
                setPasswordSuccess("");
                setIsPasswordDialogOpen(true);
              }}
              sx={{ px: 0, minHeight: 28, color: "#0E56C8", fontSize: "0.74rem", fontWeight: 700, textTransform: "none" }}
            >
              Change Password
            </Button>
          </Stack>

          <Stack direction="row" justifyContent="space-between" spacing={1.2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 30, height: 30, borderRadius: "0.8rem", bgcolor: "#EEF9F1", color: "#239654", display: "grid", placeItems: "center" }}>
                <SecurityOutlinedIcon sx={{ fontSize: "0.95rem" }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 800 }}>Two-Factor Authentication</Typography>
                <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.7rem" }}>
                  Preference saved for this browser until full MFA is added.
                </Typography>
              </Box>
            </Stack>
            <Switch checked={mfaEnabled} onChange={(event) => toggleMfa(event.target.checked)} />
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "1rem" } }}
      >
        <DialogTitle sx={{ color: "#18253A", fontSize: "1.1rem", fontWeight: 800 }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.4} sx={{ pt: 0.5 }}>
            <TextField
              label="Current password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => updatePasswordField("newPassword", event.target.value)}
              fullWidth
              size="small"
              helperText="Use at least 8 characters."
            />
            {passwordError ? <Alert severity="error">{passwordError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.2 }}>
          <Button onClick={() => setIsPasswordDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={
              isChangingPassword ||
              passwordForm.currentPassword.length < 8 ||
              passwordForm.newPassword.length < 8
            }
            onClick={changePassword}
            sx={{ borderRadius: "0.8rem", textTransform: "none" }}
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
function DocumentRow({ document, onDelete }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center" sx={{ p: 1.05, borderRadius: "0.95rem", bgcolor: "#FFFFFF", border: "1px solid rgba(225,232,241,0.96)" }}>
      <Stack direction="row" spacing={0.9} alignItems="center" sx={{ minWidth: 0 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: "0.8rem", bgcolor: "#EEF9F1", color: "#239654", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <BadgeOutlinedIcon sx={{ fontSize: "0.95rem" }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {document.fileName}
          </Typography>
          <Typography sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.68rem" }}>
            {formatBytes(document.size)}
          </Typography>
        </Box>
      </Stack>

      <Button onClick={() => onDelete(document.id)} sx={{ minWidth: 28, width: 28, height: 28, p: 0, borderRadius: "50%", color: "#E24D4D" }}>
        <DeleteOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
      </Button>
    </Stack>
  );
}

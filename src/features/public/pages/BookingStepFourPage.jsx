import {
  Box,
  Button,
  Container,
  Grid,
  Alert,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import uploadSummaryPlaceholder from "@/shared/assets/images/public/booking/upload-summary-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import { useBookingDraft } from "@/features/public/booking/BookingDraftProvider";
import { leadsApi } from "@/features/public/api/leadsApi";
import {
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
} from "@/features/public/booking/bookingValidation";

const steps = [
  { label: "Step 1", state: "complete" },
  { label: "Step 2", state: "complete" },
  { label: "Step 3", state: "complete" },
  { label: "Step 4", state: "active" },
];

const whyUploadItems = [
  {
    title: "Accurate System Design",
    description:
      "Better photos help our engineers design the optimal panel layout.",
    icon: <ArchitectureRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#1A57C8",
    bg: "#E9EEFF",
  },
  {
    title: "Faster Quotes",
    description:
      "Vendors can provide firm prices without a physical site visit.",
    icon: <FlashOnRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#188D48",
    bg: "#62F082",
  },
  {
    title: "Identify Obstructions",
    description: "Help us spot vents, chimneys, or shading issues early.",
    icon: <VisibilityOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    color: "#5D6400",
    bg: "#E7EB00",
  },
];

const documents = [
  {
    title: "Electricity Bill",
    meta: "Last 3 months required for usage analysis.",
    icon: <DescriptionOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: "#2E7D4F",
    bg: "#E8F6EC",
  },
  {
    title: "Govt Photo ID",
    meta: "Aadhaar or PAN for KYC verification.",
    icon: <ShieldRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: "#3566DA",
    bg: "#ECF2FF",
  },
];

const trustItems = [
  {
    title: "Data Secure",
    subtitle: "256-bit encryption",
    icon: <SecurityRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#174B22",
    bg: "#60F177",
  },
  {
    title: "No Spam Calls",
    subtitle: "Privacy protected",
    icon: <BlockRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#5D6400",
    bg: "#E7EB00",
  },
  {
    title: "Verified Vendors",
    subtitle: "Certified installers",
    icon: <VerifiedRoundedIcon sx={{ fontSize: "0.85rem" }} />,
    color: "#203D89",
    bg: "#E9EEFF",
  },
];

function BookingStepper() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        position: "relative",
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "4%",
          right: "4%",
          top: 15,
          height: 2,
          bgcolor: "#E7ECF3",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "4%",
          width: "83.5%",
          top: 15,
          height: 2,
          bgcolor: "#0E56C8",
        }}
      />

      {steps.map((step) => (
        <Stack
          key={step.label}
          alignItems="center"
          spacing={0.72}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              width: step.state === "active" ? 32 : 28,
              height: step.state === "active" ? 32 : 28,
              borderRadius: "50%",
              border: step.state === "active" ? "3px solid #0E56C8" : "none",
              bgcolor: step.state === "active" ? "white" : "#0E56C8",
              boxShadow:
                step.state === "active"
                  ? "0 8px 20px rgba(14,86,200,0.08)"
                  : "0 8px 20px rgba(17,31,54,0.06)",
              display: "grid",
              placeItems: "center",
            }}
          >
            {step.state === "complete" ? (
              <Typography
                sx={{ color: "white", fontSize: "0.9rem", fontWeight: 800 }}
              >
                {"\u2713"}
              </Typography>
            ) : (
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#0E56C8",
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              color: "#202938",
              fontSize: "0.74rem",
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {step.label}
          </Typography>

          <Typography
            sx={{
              minHeight: 14,
              color: step.state === "active" ? "#0E56C8" : "transparent",
              fontSize: "0.54rem",
              fontWeight: 800,
              letterSpacing: 0.48,
              textTransform: "uppercase",
            }}
          >
            {step.state === "active" ? "In Progress" : "."}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        mb: 1.2,
        color: "#59667A",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}

function UploadZone({
  icon,
  title,
  description,
  buttonLabel,
  helper,
  compact = false,
  files = [],
  onClick,
  onRemove,
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      sx={{
        minHeight: compact ? { xs: 164, md: 184 } : { xs: 220, md: 252 },
        borderRadius: "1.1rem",
        border: "1.5px dashed #C9D9F4",
        bgcolor: "#FFFFFF",
        px: 2.2,
        py: compact ? 2.6 : 3.1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Stack spacing={compact ? 0.95 : 1.15} alignItems="center">
        <Box
          sx={{
            width: compact ? 38 : 44,
            height: compact ? 38 : 44,
            borderRadius: "0.9rem",
            bgcolor: "#DCE4FF",
            color: "#0E56C8",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color: "#202938",
            fontSize: compact ? "0.92rem" : "0.95rem",
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            sx={{
              maxWidth: 270,
              color: "#6D7889",
              fontSize: "0.78rem",
              lineHeight: 1.55,
            }}
          >
            {description}
          </Typography>
        ) : null}

        {buttonLabel ? (
          <Box
            sx={{
              mt: 0.35,
              px: 1.8,
              py: 0.72,
              borderRadius: 999,
              bgcolor: "white",
              border: "1px solid #E8EDF5",
              color: "#0E56C8",
              fontSize: "0.7rem",
              fontWeight: 700,
              lineHeight: 1,
              boxShadow: "0 8px 20px rgba(20,34,56,0.04)",
            }}
          >
            {buttonLabel}
          </Box>
        ) : null}

        {helper ? (
          <Typography
            sx={{
              color: "#8F9AAC",
              fontSize: "0.52rem",
              fontWeight: 800,
              letterSpacing: 0.55,
              textTransform: "uppercase",
            }}
          >
            {helper}
          </Typography>
        ) : null}
        {files.length ? (
          <Stack spacing={0.75} sx={{ width: "100%", maxWidth: 330, mt: 0.5 }}>
            {files.map((file, index) => (
              <Stack
                key={`${file.fileName}-${index}`}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1,
                  py: 0.7,
                  borderRadius: "0.75rem",
                  bgcolor: "#F5F8FC",
                  textAlign: "left",
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                  {file.dataUrl?.startsWith("data:image") ? (
                    <Box
                      component="img"
                      src={file.dataUrl}
                      alt={file.fileName}
                      sx={{ width: 34, height: 34, borderRadius: "0.55rem", objectFit: "cover" }}
                    />
                  ) : (
                    <DescriptionOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                  )}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ color: "#263244", fontSize: "0.72rem", fontWeight: 800 }}>
                      {file.fileName}
                    </Typography>
                    <Typography sx={{ color: "#7A8798", fontSize: "0.62rem" }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </Typography>
                  </Box>
                </Stack>
                {onRemove ? (
                  <IconButton size="small" onClick={() => onRemove(index)} sx={{ color: "#D74C4C" }}>
                    <DeleteOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                  </IconButton>
                ) : null}
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

const maxUploadSize = 2 * 1024 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToAttachment(file, category) {
  if (file.size > maxUploadSize) {
    throw new Error(`${file.name} is larger than 2 MB.`);
  }

  return {
    category,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    dataUrl: await readFileAsDataUrl(file),
    capturedAt: null,
    location: { latitude: null, longitude: null },
  };
}

function getLocationSnapshot() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: null, longitude: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve({ latitude: null, longitude: null }),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 },
    );
  });
}

export default function BookingStepFourPage() {
  const navigate = useNavigate();
  const { draft, updateDraft, updateField, resetDraft } = useBookingDraft();
  const roofInputRef = useRef(null);
  const billInputRef = useRef(null);
  const idInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (
      !isStep1Complete(draft) ||
      !isStep2Complete(draft) ||
      !isStep3Complete(draft)
    ) {
      navigate("/booking", { replace: true });
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function updateAttachments(values) {
    updateDraft("attachments", values);
  }

  async function handleFiles(event, bucket, category, limit) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length) return;

    setUploadError("");
    try {
      const attachments = await Promise.all(
        selected.slice(0, limit).map((file) => fileToAttachment(file, category)),
      );
      const current = draft.attachments?.[bucket] || [];
      updateAttachments({
        [bucket]: [...current, ...attachments].slice(0, limit),
      });
    } catch (uploadIssue) {
      setUploadError(uploadIssue.message || "Unable to read selected file.");
    }
  }

  function removeAttachment(bucket, index) {
    const current = draft.attachments?.[bucket] || [];
    updateAttachments({
      [bucket]: current.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  async function startCamera() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Camera permission is blocked or unavailable on this device.");
    }
  }

  function stopCamera() {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setCameraActive(false);
  }

  async function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    const location = await getLocationSnapshot();
    const current = draft.attachments?.roofPhotos || [];
    updateAttachments({
      roofPhotos: [
        ...current,
        {
          category: "roof_photo",
          fileName: `roof-camera-${new Date().toISOString().replace(/[:.]/g, "-")}.jpg`,
          mimeType: "image/jpeg",
          size: Math.round((dataUrl.length * 3) / 4),
          dataUrl,
          capturedAt: new Date().toISOString(),
          location,
        },
      ].slice(0, 5),
    });
  }

  function buildLeadPayload() {
    return {
      ...draft,
      contact: {
        ...draft.contact,
        email: draft.contact.email.trim() || null,
      },
      installationAddress: {
        ...draft.installationAddress,
        landmark: draft.installationAddress.landmark.trim() || null,
      },
      inspection: {
        preferredDate: draft.inspection.preferredDate || null,
        preferredTimeSlot: draft.inspection.preferredTimeSlot || null,
      },
      property: {
        ...draft.property,
        distributionCompany: draft.property.distributionCompany || null,
        consumerNumber: draft.property.consumerNumber.trim() || null,
        sanctionedLoadKw: draft.property.sanctionedLoadKw
          ? Number(draft.property.sanctionedLoadKw)
          : null,
      },
      notes: draft.notes.trim() || null,
      specialInstructions: draft.specialInstructions.trim() || null,
      attachments: draft.attachments,
      calculatorEstimate: draft.calculatorEstimate,
    };
  }

  function getErrorMessage(apiError) {
    return (
      apiError?.response?.data?.message ||
      apiError?.message ||
      "Could not submit your request. Please check the details and try again."
    );
  }

  async function handleSubmit() {
    if (isSubmitting) return; // guard against double-click
    setError("");
    setIsSubmitting(true);

    try {
      const lead = await leadsApi.createLead(buildLeadPayload());
      resetDraft();
      navigate("/booking/submitted", {
        replace: true,
        state: { leadId: lead.id },
      });
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.78) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
          sx={{
            maxWidth: "1200px !important",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={{ xs: 2.8, md: 3.2 }}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 720,
                p: { xs: 2.2, md: 3 },
                borderRadius: "1.65rem",
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(228,234,241,0.98)",
                boxShadow: "0 20px 56px rgba(20,34,56,0.08)",
              }}
            >
              <Stack spacing={{ xs: 3, md: 3.5 }}>
                {error ? (
                  <Alert
                    severity="error"
                    sx={{ borderRadius: "0.9rem", fontSize: "0.82rem" }}
                  >
                    {error}
                  </Alert>
                ) : null}

                <Box sx={{ width: "100%", maxWidth: 540, mx: "auto" }}>
                  <BookingStepper />
                </Box>

                <Stack spacing={1} sx={{ textAlign: "center", mx: "auto" }}>
                  <Typography
                    variant="h1"
                    sx={{
                      ...publicTypography.pageTitle,
                      color: "#20242B",
                    }}
                  >
                    Almost done!
                    <Box component="span" sx={{ ml: 0.35 }}>
                      {"\uD83D\uDE80"}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#667084",
                      fontSize: "0.94rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload a few details to help vendors give you accurate
                    quotes
                  </Typography>
                </Stack>

                <Box>
                  <SectionLabel>Roof Reference</SectionLabel>
                  <input
                    ref={roofInputRef}
                    hidden
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(event) =>
                      handleFiles(event, "roofPhotos", "roof_photo", 5)
                    }
                  />
                  <Stack spacing={2}>
                    <UploadZone
                      icon={
                        <CloudUploadOutlinedIcon sx={{ fontSize: "1rem" }} />
                      }
                      title="Upload roof photos (optional)"
                      description="Provide a visual reference to help experts design your perfect system"
                      buttonLabel="Browse Files"
                      helper="JPG, PNG, PDF up to 2 MB"
                      files={draft.attachments?.roofPhotos || []}
                      onClick={() => roofInputRef.current?.click()}
                      onRemove={(index) => removeAttachment("roofPhotos", index)}
                    />

                    <Box
                      sx={{
                        borderRadius: "1.1rem",
                        border: "1.5px dashed #C9D9F4",
                        bgcolor: "#FFFFFF",
                        p: 2,
                      }}
                    >
                      <Stack spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: cameraActive ? 220 : 160,
                            borderRadius: "0.95rem",
                            bgcolor: "#F4F7FB",
                            overflow: "hidden",
                            display: "grid",
                            placeItems: "center",
                            border: "1px solid #E5ECF6",
                          }}
                        >
                          {cameraActive ? (
                            <Box
                              component="video"
                              ref={videoRef}
                              muted
                              playsInline
                              sx={{ width: "100%", height: 240, objectFit: "cover" }}
                            />
                          ) : (
                            <Stack spacing={1} alignItems="center" textAlign="center">
                              <Box
                                sx={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: "0.9rem",
                                  bgcolor: "#DCE4FF",
                                  color: "#0E56C8",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                <CameraAltOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                              </Box>
                              <Typography sx={{ color: "#202938", fontSize: "0.92rem", fontWeight: 700 }}>
                                Capture Live Photo
                              </Typography>
                              <Typography sx={{ color: "#6D7889", fontSize: "0.78rem" }}>
                                Uses camera and location when allowed
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                        <canvas ref={canvasRef} hidden />
                        {cameraError ? (
                          <Alert severity="warning" sx={{ width: "100%", borderRadius: "0.85rem", fontSize: "0.78rem" }}>
                            {cameraError}
                          </Alert>
                        ) : null}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%" }}>
                          <Button
                            fullWidth
                            variant={cameraActive ? "outlined" : "contained"}
                            onClick={cameraActive ? stopCamera : startCamera}
                            sx={{
                              minHeight: 42,
                              borderRadius: "0.85rem",
                              textTransform: "none",
                              fontWeight: 800,
                            }}
                          >
                            {cameraActive ? "Stop Camera" : "Open Camera"}
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            disabled={!cameraActive}
                            onClick={capturePhoto}
                            sx={{
                              minHeight: 42,
                              borderRadius: "0.85rem",
                              textTransform: "none",
                              fontWeight: 800,
                              bgcolor: "#0E56C8",
                            }}
                          >
                            Capture Photo
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                  {uploadError ? (
                    <Alert severity="error" sx={{ mt: 1.4, borderRadius: "0.85rem", fontSize: "0.78rem" }}>
                      {uploadError}
                    </Alert>
                  ) : null}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      mb: 2.4,
                      color: "#202938",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Why upload photos?
                  </Typography>
                  <Grid container spacing={1.8}>
                    {whyUploadItems.map((item) => (
                      <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                        <Stack
                          spacing={1.05}
                          alignItems="center"
                          textAlign="center"
                        >
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              bgcolor: item.bg,
                              color: item.color,
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Typography
                            sx={{
                              color: "#202938",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              lineHeight: 1.35,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              maxWidth: 160,
                              color: "#707D90",
                              fontSize: "0.68rem",
                              lineHeight: 1.55,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box>
                  <SectionLabel>Additional Context</SectionLabel>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    value={draft.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="Any specific requirements or questions? (e.g. 'Considering an EV charger soon')"
                    InputProps={{
                      sx: {
                        borderRadius: "0.95rem",
                        bgcolor: "#F6F7FA",
                        minHeight: 86,
                        alignItems: "flex-start",
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    p: { xs: 1.8, md: 2 },
                    borderRadius: "1.1rem",
                    bgcolor: "#F3F5F8",
                    border: "1px solid #EEF2F7",
                  }}
                >
                  <input
                    ref={billInputRef}
                    hidden
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(event) =>
                      handleFiles(event, "electricityBill", "electricity_bill", 3)
                    }
                  />
                  <input
                    ref={idInputRef}
                    hidden
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(event) =>
                      handleFiles(event, "photoId", "photo_id", 2)
                    }
                  />
                  <Stack spacing={1.55}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <DescriptionOutlinedIcon
                        sx={{ fontSize: "1rem", color: "#1A57C8" }}
                      />
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                        }}
                      >
                        Required Documents
                      </Typography>
                    </Stack>

                    <Grid container spacing={1.4}>
                      {documents.map((item) => {
                        const bucket =
                          item.title === "Electricity Bill"
                            ? "electricityBill"
                            : "photoId";
                        const files = draft.attachments?.[bucket] || [];
                        const inputRef =
                          bucket === "electricityBill" ? billInputRef : idInputRef;
                        return (
                        <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                          <Box
                            role="button"
                            tabIndex={0}
                            onClick={() => inputRef.current?.click()}
                            sx={{
                              minHeight: 120,
                              borderRadius: "1rem",
                              bgcolor: "white",
                              border: "1px solid #E9EDF4",
                              px: 1.5,
                              py: 1.3,
                              cursor: "pointer",
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "0.55rem",
                                    bgcolor: item.bg,
                                    color: item.tone,
                                    display: "grid",
                                    placeItems: "center",
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                <AddCircleOutlineRoundedIcon
                                  sx={{ fontSize: "1rem", color: "#C3CAD8" }}
                                />
                              </Stack>

                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.82rem",
                                  fontWeight: 700,
                                }}
                              >
                                {item.title}
                              </Typography>

                              <Typography
                                sx={{
                                  color: "#687588",
                                  fontSize: "0.72rem",
                                  lineHeight: 1.5,
                                  maxWidth: 180,
                                }}
                              >
                                {item.meta}
                              </Typography>
                              {files.length ? (
                                <Stack spacing={0.6}>
                                  {files.map((file, index) => (
                                    <Chip
                                      key={`${file.fileName}-${index}`}
                                      label={file.fileName}
                                      onDelete={(event) => {
                                        event.stopPropagation();
                                        removeAttachment(bucket, index);
                                      }}
                                      sx={{
                                        justifyContent: "space-between",
                                        maxWidth: "100%",
                                        bgcolor: "#F4F7FB",
                                        fontSize: "0.68rem",
                                        fontWeight: 700,
                                      }}
                                    />
                                  ))}
                                </Stack>
                              ) : null}
                            </Stack>
                          </Box>
                        </Grid>
                        );
                      })}
                    </Grid>
                  </Stack>
                </Box>

                <Grid container spacing={1.4}>
                  <Grid size={{ xs: 12, md: 5.1 }}>
                    <Box
                      sx={{
                        minHeight: 126,
                        borderRadius: "1rem",
                        border: "1px solid #EEF2F7",
                        bgcolor: "white",
                        px: 1.4,
                        py: 1.15,
                      }}
                    >
                      <Stack spacing={0.9}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            sx={{
                              color: "#5D6879",
                              fontSize: "0.5rem",
                              fontWeight: 800,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            System Status
                          </Typography>
                          <Box
                            sx={{
                              px: 0.7,
                              py: 0.2,
                              borderRadius: 999,
                              bgcolor: "#62F082",
                              color: "#174B22",
                              fontSize: "0.46rem",
                              fontWeight: 800,
                              letterSpacing: 0.38,
                              textTransform: "uppercase",
                            }}
                          >
                            Ready
                          </Box>
                        </Stack>

                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.98rem",
                            fontWeight: 800,
                          }}
                        >
                          Ideal
                        </Typography>

                        <Typography
                          sx={{
                            color: "#6A778A",
                            fontSize: "0.6rem",
                            lineHeight: 1.55,
                            maxWidth: 190,
                          }}
                        >
                          High potential for solar efficiency at your location.
                        </Typography>

                        <Box
                          sx={{
                            px: 0.95,
                            py: 0.5,
                            borderRadius: 999,
                            bgcolor: "#F4F7FB",
                            width: "fit-content",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#233044",
                              fontSize: "0.58rem",
                              fontWeight: 700,
                            }}
                          >
                            98% Data Accuracy
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6.9 }}>
                    <Box
                      sx={{
                        minHeight: 126,
                        borderRadius: "1rem",
                        overflow: "hidden",
                        backgroundImage: `linear-gradient(180deg, rgba(7,18,31,0.02) 0%, rgba(8,17,28,0.62) 100%), url(${uploadSummaryPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 1.15,
                      }}
                    >
                      <Stack spacing={0.18}>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.92)",
                            fontSize: "0.48rem",
                            fontWeight: 800,
                            letterSpacing: 0.42,
                            textTransform: "uppercase",
                          }}
                        >
                          Solar Potential
                        </Typography>
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: "0.9rem",
                            lineHeight: 1.35,
                            fontWeight: 700,
                            maxWidth: 240,
                          }}
                        >
                          12kW peak generation potential
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1.6, sm: 2.25 }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "#E7EB00",
                        color: "#5D6400",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <LightbulbOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        maxWidth: 230,
                        color: "#6E798B",
                        fontSize: "0.62rem",
                        lineHeight: 1.55,
                      }}
                    >
                      Photos help identify vent placement and roof pitch for
                      instant, accurate quotes.
                    </Typography>
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1.2, sm: 2 }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Button
                      component={RouterLink}
                      to="/booking/roof"
                      sx={{
                        color: "#4A5668",
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        textTransform: "none",
                        minWidth: 0,
                        px: 0,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      endIcon={<ArrowForwardRoundedIcon />}
                      variant="contained"
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        minWidth: 170,
                        minHeight: 42,
                        borderRadius: "1rem",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        textTransform: "none",
                        background:
                          "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                        boxShadow: "0 12px 24px rgba(14,86,200,0.24)",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            <Grid
              container
              spacing={1.15}
              sx={{ width: "100%", maxWidth: 720 }}
            >
              {trustItems.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      px: 1.05,
                      py: 0.9,
                      borderRadius: "1rem",
                      bgcolor: "rgba(255,255,255,0.94)",
                      border: "1px solid #EEF2F7",
                      boxShadow: "0 12px 24px rgba(25,38,62,0.04)",
                    }}
                  >
                    <Stack direction="row" spacing={0.9} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: item.bg,
                          color: item.color,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#7A8698",
                            fontSize: "0.54rem",
                            lineHeight: 1.45,
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

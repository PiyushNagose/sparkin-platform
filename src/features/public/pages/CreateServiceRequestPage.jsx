import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useAuth } from "@/features/auth/AuthProvider";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";
import serviceNetworkPlaceholder from "@/shared/assets/images/public/support/service-network-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const requestTypes = [
  {
    value: "maintenance",
    title: "Maintenance",
    text: "Scheduled cleaning and check-ups",
    tone: "#EEF4FF",
    color: "#0E56C8",
    icon: <ConstructionRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    value: "repair",
    title: "Repair",
    text: "Fixing specific component failures",
    tone: "#EEF4FF",
    color: "#0E56C8",
    icon: <BuildRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    active: true,
  },
  {
    value: "warranty",
    title: "Warranty",
    text: "In-warranty replacement or service",
    tone: "#F3F6FB",
    color: "#7D889B",
    icon: <ShieldOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

const guarantees = [
  "Certified technicians with over 500+ solar installations.",
  "24/7 Monitoring ensures we know the problem before you do.",
  "Original Sparkin components used for all repairs.",
];

function CardShell({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 1.95, md: 2.2 },
        borderRadius: "1.45rem",
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        color: "#2B3340",
        fontSize: "0.78rem",
        fontWeight: 800,
      }}
    >
      {children}
    </Typography>
  );
}

function formatProjectAddress(address) {
  if (!address) return "Address pending";

  return [address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
}

function getProjectLabel(project) {
  if (!project) return "Select project";

  return `${project.system.sizeKw}kW ${project.system.panelType} - ${project.installationAddress.city}, ${project.installationAddress.state}`;
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: "0.9rem",
    bgcolor: "#F5F7FB",
    fontSize: "0.9rem",
    color: "#202938",
    "& fieldset": {
      borderColor: "#E6EBF2",
    },
    "&:hover fieldset": {
      borderColor: "#D9E1ED",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#98A2B3",
    opacity: 1,
  },
};

export default function CreateServiceRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || "";
  const { user } = useAuth();
  const [form, setForm] = useState({
    projectId: requestedProjectId,
    type: "repair",
    description: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setIsLoadingProjects(true);

      try {
        const result = await projectsApi.listProjects();

        if (!active) return;

        setProjects(result);

        const queryProjectExists = result.some((project) => project.id === requestedProjectId);

        if (queryProjectExists) {
          setForm((current) => ({ ...current, projectId: requestedProjectId }));
        } else if (!requestedProjectId && result.length === 1) {
          setForm((current) => ({ ...current, projectId: result[0].id }));
        }
      } catch (apiError) {
        if (active) {
          setError(apiError?.response?.data?.message || "Could not load your projects.");
        }
      } finally {
        if (active) {
          setIsLoadingProjects(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [requestedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === form.projectId) ?? null,
    [form.projectId, projects],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    if (projects.length > 0 && !form.projectId) {
      setError("Please select the project that needs service.");
      return;
    }

    if (form.description.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const request = await serviceRequestsApi.createRequest({
        ...form,
        projectId: form.projectId || null,
        description: form.description.trim(),
        preferredDate: form.preferredDate || null,
        preferredTime: form.preferredTime || null,
      });
      navigate(`/service-support/request/submitted?requestId=${request.id}`, { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not submit service request.");
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
            "radial-gradient(circle at top center, rgba(214,229,246,0.72) 0%, rgba(247,250,252,0.98) 24%, #F9FBFD 68%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack spacing={{ xs: 3.1, md: 3.5 }}>
            <Box sx={{ maxWidth: 520 }}>
              <Typography
                variant="h1"
                sx={{
                  color: "#20242B",
                  ...publicTypography.heroTitle,
                  whiteSpace: { md: "nowrap" },
                }}
              >
                Create Service Request
              </Typography>
              <Typography
                sx={{
                  mt: 0.7,
                  color: "#667084",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                Manage your solar infrastructure with precision and care.
              </Typography>
            </Box>

            <Grid
              container
              spacing={{ xs: 2.3, md: 2.5 }}
              alignItems="flex-start"
            >
              <Grid size={{ xs: 12, md: 8.1 }}>
                <CardShell>
                  <Stack spacing={{ xs: 2.1, md: 2.3 }}>
                    <Box>
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "1.36rem",
                          fontWeight: 800,
                        }}
                      >
                        Submit a Service Request
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.32,
                          color: "#667084",
                          fontSize: "0.84rem",
                          lineHeight: 1.55,
                        }}
                      >
                        Our technicians will review your request and get back to
                        you within 24 hours.
                      </Typography>
                    </Box>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 1: Select Project</SectionLabel>
                      {isLoadingProjects ? (
                        <Box sx={{ py: 1.2, display: "flex", alignItems: "center", gap: 1 }}>
                          <CircularProgress size={18} />
                          <Typography sx={{ color: "#667084", fontSize: "0.78rem" }}>
                            Loading your projects...
                          </Typography>
                        </Box>
                      ) : null}

                      {!isLoadingProjects && projects.length === 0 ? (
                        <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
                          No active installation project was found. You can still raise a general support request.
                        </Alert>
                      ) : null}

                      {!isLoadingProjects && projects.length > 0 ? (
                        <TextField
                          select
                          value={form.projectId}
                          onChange={(event) => updateField("projectId", event.target.value)}
                          sx={fieldStyles}
                        >
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {getProjectLabel(project)}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : null}

                      {selectedProject ? (
                        <Box
                          sx={{
                            p: 1.05,
                            borderRadius: "0.95rem",
                            bgcolor: "#F5F7FB",
                            border: "1px solid #E8EDF5",
                          }}
                        >
                          <Typography sx={{ color: "#202938", fontSize: "0.78rem", fontWeight: 800 }}>
                            {getProjectLabel(selectedProject)}
                          </Typography>
                          <Typography sx={{ mt: 0.22, color: "#667084", fontSize: "0.68rem", lineHeight: 1.5 }}>
                            {formatProjectAddress(selectedProject.installationAddress)}
                          </Typography>
                        </Box>
                      ) : null}
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 2: Request Details</SectionLabel>
                      <Grid container spacing={1.2}>
                        {requestTypes.map((item) => (
                          <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
                            <Box
                              onClick={() => updateField("type", item.value)}
                              sx={{
                                p: 1.2,
                                minHeight: 88,
                                borderRadius: "1rem",
                                bgcolor: form.type === item.value ? "white" : "#F5F7FB",
                                border: form.type === item.value
                                  ? "2px solid #0E56C8"
                                  : "1px solid #E8EDF5",
                                boxShadow: form.type === item.value
                                  ? "0 10px 22px rgba(14,86,200,0.08)"
                                  : "none",
                                cursor: "pointer",
                              }}
                            >
                              <Stack spacing={0.7}>
                                <Box
                                  sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "0.75rem",
                                    bgcolor: item.tone,
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
                                    fontSize: "0.77rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#7C8797",
                                    fontSize: "0.62rem",
                                    lineHeight: 1.46,
                                  }}
                                >
                                  {item.text}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>
                        Section 3: Problem Description
                      </SectionLabel>
                      <TextField
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        multiline
                        minRows={4}
                        placeholder="Describe your issue..."
                        sx={{
                          ...fieldStyles,
                          "& .MuiOutlinedInput-root": {
                            ...fieldStyles["& .MuiOutlinedInput-root"],
                            alignItems: "flex-start",
                            py: 0.4,
                          },
                        }}
                      />
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>Section 4: Preferred Schedule</SectionLabel>
                      <Grid container spacing={1.2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            type="date"
                            value={form.preferredDate}
                            onChange={(event) => updateField("preferredDate", event.target.value)}
                            InputProps={{
                              startAdornment: (
                                <CalendarMonthRoundedIcon
                                  sx={{
                                    color: "#7F8A9C",
                                    mr: 1,
                                    fontSize: "1rem",
                                  }}
                                />
                              ),
                            }}
                            sx={fieldStyles}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            type="time"
                            value={form.preferredTime}
                            onChange={(event) => updateField("preferredTime", event.target.value)}
                            InputProps={{
                              startAdornment: (
                                <ScheduleRoundedIcon
                                  sx={{
                                    color: "#7F8A9C",
                                    mr: 1,
                                    fontSize: "1rem",
                                  }}
                                />
                              ),
                            }}
                            sx={fieldStyles}
                          />
                        </Grid>
                      </Grid>
                    </Stack>

                    <Stack spacing={1.05}>
                      <SectionLabel>
                        Section 5: Contact Confirmation
                      </SectionLabel>
                      <Box
                        sx={{
                          p: 1.18,
                          borderRadius: "1rem",
                          bgcolor: "#F5F7FB",
                          border: "1px solid #E8EDF5",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "0.8rem",
                              bgcolor: "#EEF4FF",
                              color: "#0E56C8",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <HeadsetMicRoundedIcon sx={{ fontSize: "1rem" }} />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                color: "#202938",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                              }}
                            >
                              Primary Contact: {user?.fullName || "Sparkin Customer"}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#7C8797",
                                fontSize: "0.64rem",
                                mt: 0.12,
                              }}
                            >
                              {user?.email || "Email not available"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    {error ? (
                      <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                        {error}
                      </Alert>
                    ) : null}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ pt: 0.45 }}>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingProjects}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          minWidth: 132,
                          minHeight: 42,
                          borderRadius: "0.85rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          background:
                            "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                          boxShadow: "0 14px 24px rgba(14,86,200,0.18)",
                        }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/service-support"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          minWidth: 92,
                          minHeight: 42,
                          borderRadius: "0.85rem",
                          bgcolor: "#EAEFF6",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </CardShell>
              </Grid>

              <Grid size={{ xs: 12, md: 3.9 }}>
                <Stack spacing={1.5}>
                  <CardShell sx={{ bgcolor: "#FBFCFF" }}>
                    <Stack spacing={1.15}>
                      <Stack direction="row" spacing={0.62} alignItems="center">
                        <TaskAltRoundedIcon
                          sx={{ fontSize: "0.9rem", color: "#8D8900" }}
                        />
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.88rem",
                            fontWeight: 800,
                          }}
                        >
                          Service Guarantees
                        </Typography>
                      </Stack>

                      {guarantees.map((item) => (
                        <Stack
                          key={item}
                          direction="row"
                          spacing={0.68}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              bgcolor: "#EAF8F0",
                              color: "#14824D",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                              mt: 0.08,
                            }}
                          >
                            <TaskAltRoundedIcon sx={{ fontSize: "0.72rem" }} />
                          </Box>
                          <Typography
                            sx={{
                              color: "#667084",
                              fontSize: "0.72rem",
                              lineHeight: 1.64,
                            }}
                          >
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ bgcolor: "#F7FAFD", p: 1.35 }}>
                    <Stack spacing={0.9}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "0.84rem",
                            fontWeight: 800,
                          }}
                        >
                          Service Context
                        </Typography>
                        <Box
                          sx={{
                            px: 0.66,
                            py: 0.28,
                            borderRadius: 999,
                            bgcolor: "#FFF6A7",
                            color: "#6B6200",
                            fontSize: "0.5rem",
                            fontWeight: 800,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                          }}
                        >
                          {selectedProject ? "Project Linked" : "General"}
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          minHeight: 150,
                          borderRadius: "1rem",
                          overflow: "hidden",
                          backgroundImage: `url(${serviceNetworkPlaceholder})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#7A8596",
                          fontSize: "0.64rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {selectedProject
                          ? `This request will be linked to ${getProjectLabel(selectedProject)} and routed to the assigned project vendor.`
                          : "This request will be handled by Sparkin support until it can be linked to an installation project."}
                        <Box
                          component="span"
                          sx={{ color: "#0E56C8", fontWeight: 700, ml: 0.2 }}
                        >
                          {projects.length ? `${projects.length} project${projects.length === 1 ? "" : "s"} on file.` : ""}
                        </Box>
                      </Typography>
                    </Stack>
                  </CardShell>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}



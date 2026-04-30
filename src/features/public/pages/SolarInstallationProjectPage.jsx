import {
  Alert,
  Box,
  Button,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const journeySteps = [
  { title: "Site Visit", status: "Completed", active: false, done: true },
  { title: "Installation", status: "In Progress", active: true, done: false },
  { title: "Inspection", status: "Pending", active: false, done: false },
  { title: "Activation", status: "Pending", active: false, done: false },
];

const projectMeta = [
  {
    label: "Vendor",
    value: "Tata Power Solar",
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "System Size",
    value: "5kW On-Grid",
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Project Cost",
    value: "₹2,85,000",
    icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Location",
    value: "Sector 45, Gurgaon, Haryana",
    icon: <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatAddress(address) {
  if (!address) {
    return "Location pending";
  }

  return [address.city, address.state].filter(Boolean).join(", ");
}

function getVendorName(project) {
  return project?.vendorEmail ? project.vendorEmail.split("@")[0] : "Assigned Vendor";
}

function buildJourneySteps(project) {
  const milestones = project?.milestones ?? [];

  if (milestones.length === 0) {
    return journeySteps;
  }

  return milestones.map((milestone) => ({
    title: milestone.title,
    status:
      milestone.status === "completed"
        ? "Completed"
        : milestone.status === "in_progress"
          ? "In Progress"
          : "Pending",
    active: milestone.status === "in_progress",
    done: milestone.status === "completed",
  }));
}

function buildRecentActivity(project) {
  const milestones = project?.milestones ?? [];
  const activities = milestones
    .filter((milestone) => milestone.status !== "pending")
    .map((milestone) => ({
      title:
        milestone.status === "completed"
          ? `${milestone.title} completed`
          : `${milestone.title} in progress`,
      text:
        milestone.status === "completed"
          ? `${milestone.title} has been completed by the assigned vendor.`
          : `Your assigned vendor is currently working on ${milestone.title.toLowerCase()}.`,
      tag: milestone.status === "completed" ? formatDate(milestone.completedAt) : "Active now",
      tone: milestone.status === "completed" ? "#12824C" : "#0E56C8",
      icon:
        milestone.status === "completed" ? (
          <TaskAltRoundedIcon sx={{ fontSize: "0.82rem" }} />
        ) : (
          <BoltRoundedIcon sx={{ fontSize: "0.82rem" }} />
        ),
    }));

  if (activities.length > 0) {
    return activities.reverse();
  }

  return [
    {
      title: "Project created",
      text: "Your accepted quote has been converted into an installation project.",
      tag: formatDate(project?.createdAt),
      tone: "#0E56C8",
      icon: <TaskAltRoundedIcon sx={{ fontSize: "0.82rem" }} />,
    },
  ];
}

function getPaymentStatusMeta(status) {
  if (status === "paid") {
    return { label: "Paid", bg: "#DDF8E7", tone: "#12824C" };
  }

  if (status === "overdue") {
    return { label: "Overdue", bg: "#FFE9E6", tone: "#B42318" };
  }

  return { label: "Pending", bg: "#F2F5F8", tone: "#677487" };
}

function CardShell({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 2.05, md: 2.25 },
        borderRadius: "1.5rem",
        bgcolor: "rgba(255,255,255,0.94)",
        border: "1px solid #E8EDF5",
        boxShadow: "0 16px 34px rgba(17,31,54,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default function SolarInstallationProjectPage() {
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [error, setError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setIsLoading(true);
      setError("");

      try {
        const projectId = searchParams.get("projectId");
        const result = projectId
          ? await projectsApi.getProject(projectId)
          : (await projectsApi.listProjects())[0] ?? null;

        if (active) setProject(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load project.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      if (!project?.id) {
        setPayments([]);
        return;
      }

      setIsLoadingPayments(true);
      setPaymentsError("");

      try {
        const result = await paymentsApi.listPayments();
        const projectPayments = result.filter((payment) => payment.projectId === project.id);

        if (active) {
          setPayments(projectPayments);
        }
      } catch (apiError) {
        if (active) {
          setPaymentsError(apiError?.response?.data?.message || "Could not load payment schedule.");
        }
      } finally {
        if (active) {
          setIsLoadingPayments(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, [project?.id]);

  const vendorName = getVendorName(project);
  const dynamicJourneySteps = useMemo(() => buildJourneySteps(project), [project]);
  const dynamicRecentActivity = useMemo(() => buildRecentActivity(project), [project]);
  const paidAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const activeStep = dynamicJourneySteps.find((step) => step.active) ?? dynamicJourneySteps[0];
  const completedSteps = dynamicJourneySteps.filter((step) => step.done).length;
  const progressPercent = Math.max(12, Math.round((completedSteps / dynamicJourneySteps.length) * 100));
  const dynamicProjectMeta = useMemo(
    () => [
      {
        label: "Vendor",
        value: vendorName,
        icon: <HomeWorkOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
      },
      {
        label: "System Size",
        value: project ? `${project.system.sizeKw}kW ${project.system.panelType}` : "-",
        icon: <SolarPowerRoundedIcon sx={{ fontSize: "0.95rem" }} />,
      },
      {
        label: "Project Cost",
        value: project ? formatPrice(project.pricing.totalPrice) : "-",
        icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
      },
      {
        label: "Location",
        value: formatAddress(project?.installationAddress),
        icon: <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
      },
    ],
    [project, vendorName],
  );

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
        <Container maxWidth={false} disableGutters className={styles.contentContainer}>
          <Stack spacing={{ xs: 3.2, md: 3.8 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: "flex-start", md: "flex-start" }}
            >
              <Box sx={{ maxWidth: 620 }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#20242B",
                    ...publicTypography.heroTitle,
                  }}
                >
                  Your Solar Installation Project
                  <Box component="span" sx={{ ml: 0.4 }}>
                    ☀️
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    color: "#667084",
                    fontSize: "0.94rem",
                    lineHeight: 1.6,
                  }}
                >
                  Track progress and stay updated on your installation
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.1}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                <Button
                  component={RouterLink}
                  to={project ? `/service-support/request?projectId=${project.id}` : "/service-support/request"}
                  startIcon={<HelpOutlineRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minHeight: 40,
                    px: 1.45,
                    borderRadius: "0.85rem",
                    bgcolor: "#F1F4F8",
                    color: "#2B3443",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Request Service
                </Button>
                <Button
                  component={RouterLink}
                  to="/customer/projects"
                  variant="contained"
                  startIcon={<SolarPowerRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minHeight: 40,
                    px: 1.55,
                    borderRadius: "0.85rem",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 12px 22px rgba(14,86,200,0.18)",
                  }}
                >
                  My Projects
                </Button>
              </Stack>
            </Stack>

            {isLoading ? (
              <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : null}

            {!isLoading && error ? (
              <Alert severity="error" sx={{ borderRadius: "0.9rem" }}>
                {error}
              </Alert>
            ) : null}

            {!isLoading && !error && !project ? (
              <Alert severity="info" sx={{ borderRadius: "0.9rem" }}>
                No installation project is active yet. Please select a vendor quote first.
              </Alert>
            ) : null}

            {!isLoading && !error && project ? (
            <Grid container spacing={{ xs: 2.2, md: 2.4 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={{ xs: 2.2, md: 2.4 }}>
                  <CardShell>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 800 }}>
                          Installation Journey
                        </Typography>
                        <Box
                          sx={{
                            px: 0.9,
                            py: 0.3,
                            borderRadius: 999,
                            bgcolor: "#39D290",
                            color: "white",
                            fontSize: "0.56rem",
                            fontWeight: 800,
                          }}
                        >
                          Phase {Math.min(completedSteps + 1, dynamicJourneySteps.length)} of {dynamicJourneySteps.length}
                        </Box>
                      </Stack>

                      <Box sx={{ position: "relative", px: { xs: 0.1, md: 0.35 }, pt: 0.6 }}>
                        <Box
                          sx={{
                            position: "absolute",
                            left: 18,
                            right: 18,
                            top: 20,
                            height: 2,
                            bgcolor: "#E1E7F0",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            left: 18,
                            width: `${progressPercent}%`,
                            top: 20,
                            height: 2,
                            bgcolor: "#0E56C8",
                          }}
                        />

                        <Grid
                          container
                          columns={{ xs: 2, sm: 4 }}
                          rowSpacing={{ xs: 1.5, sm: 0 }}
                        >
                          {dynamicJourneySteps.map((step) => (
                            <Grid key={step.title} size={{ xs: 1, sm: 1 }}>
                              <Stack alignItems="center" spacing={0.7}>
                                <Box
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    bgcolor: step.done ? "#0E56C8" : step.active ? "white" : "#EFF3F8",
                                    color: step.done ? "white" : step.active ? "#0E56C8" : "#98A3B6",
                                    border: step.active ? "3px solid #0E56C8" : "1px solid transparent",
                                    boxShadow: step.active ? "0 6px 14px rgba(14,86,200,0.12)" : "none",
                                    display: "grid",
                                    placeItems: "center",
                                    zIndex: 1,
                                  }}
                                >
                                  {step.done ? (
                                    <TaskAltRoundedIcon sx={{ fontSize: "0.95rem" }} />
                                  ) : step.active ? (
                                    <SolarPowerRoundedIcon sx={{ fontSize: "0.85rem" }} />
                                  ) : (
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "currentColor" }} />
                                  )}
                                </Box>
                                <Stack spacing={0.1} alignItems="center">
                                  <Typography sx={{ color: "#2A3444", fontSize: "0.72rem", fontWeight: 700 }}>
                                    {step.title}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: step.active ? "#0E56C8" : step.done ? "#12824C" : "#8C96A6",
                                      fontSize: "0.63rem",
                                      fontWeight: step.active || step.done ? 700 : 500,
                                    }}
                                  >
                                    {step.status}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ py: { xs: 1.7, md: 1.8 } }}>
                    <Grid container spacing={{ xs: 1.4, md: 1.8 }}>
                      {dynamicProjectMeta.map((item) => (
                        <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                          <Stack spacing={0.52}>
                            <Typography
                              sx={{
                                color: "#8A93A4",
                                fontSize: "0.56rem",
                                fontWeight: 800,
                                letterSpacing: 0.34,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Stack direction="row" spacing={0.55} alignItems="flex-start">
                              <Box sx={{ mt: 0.14, color: "#0E56C8" }}>{item.icon}</Box>
                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.9rem",
                                  fontWeight: 700,
                                  lineHeight: 1.45,
                                  maxWidth: item.label === "Location" ? { xs: "none", md: 140 } : "none",
                                }}
                              >
                                {item.value}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </CardShell>

                  <CardShell>
                    <Stack spacing={1.4}>
                      <Typography sx={{ color: "#202938", fontSize: "1rem", fontWeight: 800 }}>
                        Recent Activity
                      </Typography>
                      <Stack spacing={1.35}>
                        {dynamicRecentActivity.map((item, index) => (
                          <Stack key={item.title} direction="row" spacing={1.15} alignItems="flex-start">
                            <Stack alignItems="center" sx={{ pt: 0.1 }}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  bgcolor: item.tone,
                                  color: "white",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                {item.icon}
                              </Box>
                              {index < dynamicRecentActivity.length - 1 ? (
                                <Box sx={{ width: 2, minHeight: 40, bgcolor: "#E0E6EF", mt: 0.45 }} />
                              ) : null}
                            </Stack>

                            <Box sx={{ flex: 1, pt: 0.02 }}>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                spacing={0.7}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                              >
                                <Typography sx={{ color: "#202938", fontSize: "0.84rem", fontWeight: 700 }}>
                                  {item.title}
                                </Typography>
                                <Box
                                  sx={{
                                    px: 0.65,
                                    py: 0.22,
                                    borderRadius: "0.55rem",
                                    bgcolor: "#F1F4F8",
                                    color: "#788495",
                                    fontSize: "0.58rem",
                                  }}
                                >
                                  {item.tag}
                                </Box>
                              </Stack>
                              <Typography sx={{ color: "#687487", fontSize: "0.72rem", lineHeight: 1.6, mt: 0.32 }}>
                                {item.text}
                              </Typography>
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardShell>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={{ xs: 2.2, md: 2.4 }}>
                  <Box
                    sx={{
                      p: { xs: 2.05, md: 2.2 },
                      borderRadius: "1.45rem",
                      color: "white",
                      background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      boxShadow: "0 18px 34px rgba(14,86,200,0.2)",
                    }}
                  >
                    <Stack spacing={1.4}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "0.9rem",
                            bgcolor: "rgba(255,255,255,0.12)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <SolarPowerRoundedIcon sx={{ fontSize: "1rem" }} />
                        </Box>
                        <Box
                          sx={{
                            px: 0.8,
                            py: 0.28,
                            borderRadius: 999,
                            bgcolor: "rgba(255,255,255,0.14)",
                            fontSize: "0.54rem",
                            fontWeight: 800,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                          }}
                        >
                          Active Stage
                        </Box>
                      </Stack>
                      <Box>
                        <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, lineHeight: 1.12 }}>
                          {activeStep?.title ?? "Project Started"}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.8rem", lineHeight: 1.65, mt: 0.7 }}>
                          {project.status === "site_audit_pending"
                            ? "Your selected vendor will coordinate the site audit and confirm the installation plan."
                            : "Your project is moving through the installation workflow."}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Stack direction="row" spacing={-0.5}>
                          {["#FDD96A", "#9EE7FF", "#FFD1D1"].map((tone) => (
                            <Box
                              key={tone}
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: tone,
                                border: "2px solid #0E56C8",
                              }}
                            />
                          ))}
                        </Stack>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.92)" }}>
                          Assigned vendor: {vendorName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <CardShell>
                    <Stack spacing={1.25}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: "#202938", fontSize: "0.98rem", fontWeight: 800 }}>
                          Payment Schedule
                        </Typography>
                        <PaymentsOutlinedIcon sx={{ fontSize: "1.05rem", color: "#0E56C8" }} />
                      </Stack>

                      {isLoadingPayments ? (
                        <Box sx={{ py: 2, display: "grid", placeItems: "center" }}>
                          <CircularProgress size={22} />
                        </Box>
                      ) : null}

                      {!isLoadingPayments && paymentsError ? (
                        <Alert severity="error" sx={{ borderRadius: "0.85rem" }}>
                          {paymentsError}
                        </Alert>
                      ) : null}

                      {!isLoadingPayments && !paymentsError && payments.length === 0 ? (
                        <Alert severity="info" sx={{ borderRadius: "0.85rem" }}>
                          Payment schedule is being prepared.
                        </Alert>
                      ) : null}

                      {!isLoadingPayments && !paymentsError && payments.length > 0 ? (
                        <Stack spacing={0.9}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "0.95rem",
                              bgcolor: "#F5F7FB",
                              border: "1px solid #E8EDF5",
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                              <Box>
                                <Typography sx={{ color: "#7D8797", fontSize: "0.62rem", fontWeight: 800 }}>
                                  Paid
                                </Typography>
                                <Typography sx={{ color: "#12824C", fontSize: "0.92rem", fontWeight: 800 }}>
                                  {formatPrice(paidAmount)}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography sx={{ color: "#7D8797", fontSize: "0.62rem", fontWeight: 800 }}>
                                  Pending
                                </Typography>
                                <Typography sx={{ color: "#202938", fontSize: "0.92rem", fontWeight: 800 }}>
                                  {formatPrice(pendingAmount)}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>

                          {payments.map((payment) => {
                            const status = getPaymentStatusMeta(payment.status);

                            return (
                              <Box
                                key={payment.id}
                                sx={{
                                  p: 1,
                                  borderRadius: "0.95rem",
                                  bgcolor: "#FFFFFF",
                                  border: "1px solid #E8EDF5",
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" spacing={1.2}>
                                  <Box>
                                    <Typography sx={{ color: "#243142", fontSize: "0.78rem", fontWeight: 800 }}>
                                      {payment.milestone.title}
                                    </Typography>
                                    <Typography sx={{ mt: 0.18, color: "#7D8797", fontSize: "0.64rem" }}>
                                      Due {formatDate(payment.dueAt)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography sx={{ color: "#202938", fontSize: "0.78rem", fontWeight: 800 }}>
                                      {formatPrice(payment.amount)}
                                    </Typography>
                                    <Box
                                      sx={{
                                        mt: 0.28,
                                        px: 0.62,
                                        py: 0.2,
                                        borderRadius: 999,
                                        bgcolor: status.bg,
                                        color: status.tone,
                                        fontSize: "0.52rem",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {status.label}
                                    </Box>
                                  </Box>
                                </Stack>
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : null}
                    </Stack>
                  </CardShell>

                  <CardShell sx={{ bgcolor: "rgba(249,251,254,0.96)" }}>
                    <Stack spacing={1.2}>
                      <Typography sx={{ color: "#202938", fontSize: "1.05rem", fontWeight: 800 }}>
                        Need Assistance?
                      </Typography>
                      <Typography sx={{ color: "#687487", fontSize: "0.75rem", lineHeight: 1.65 }}>
                        Our support team is available 24/7 to help with your project queries.
                      </Typography>
                      <Button
                        component={RouterLink}
                        to={project ? `/service-support/request?projectId=${project.id}` : "/service-support/request"}
                        sx={{
                          minHeight: 42,
                          borderRadius: "0.9rem",
                          bgcolor: "#FFFFFF",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          border: "1px solid #E4EAF3",
                        }}
                      >
                        Raise Service Request
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/service-support"
                        startIcon={<HelpOutlineRoundedIcon />}
                        sx={{
                          minHeight: 42,
                          borderRadius: "0.9rem",
                          bgcolor: "#FFFFFF",
                          color: "#202938",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          border: "1px solid #E4EAF3",
                        }}
                      >
                        Help Center
                      </Button>
                    </Stack>
                  </CardShell>
                </Stack>
              </Grid>
            </Grid>
            ) : null}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

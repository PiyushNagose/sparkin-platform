import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import { Link as RouterLink } from "react-router-dom";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value, suffix = "") {
  return `${Math.round(value || 0).toLocaleString("en-IN")}${suffix}`;
}

function getSavingsModel(projects) {
  const totalKw = projects.reduce((sum, project) => sum + (Number(project.system?.sizeKw) || 0), 0);
  const monthlySavings = Math.round(totalKw * 1500);
  const annualSavings = monthlySavings * 12;
  const lifetimeSavings = annualSavings * 25;
  const annualGeneration = totalKw * 1450;
  const annualCo2AvoidedKg = annualGeneration * 0.82;

  return {
    totalKw,
    monthlySavings,
    annualSavings,
    lifetimeSavings,
    annualGeneration,
    annualCo2AvoidedKg,
  };
}

function getProjectSavings(project) {
  const systemKw = Number(project.system?.sizeKw) || 0;
  return {
    id: project.id,
    title: `${project.installationAddress.city}, ${project.installationAddress.state}`,
    system: `${systemKw}kW ${project.system.panelType}`,
    monthly: Math.round(systemKw * 1500),
    annual: Math.round(systemKw * 1500 * 12),
    status: project.status.replaceAll("_", " "),
    to: `/project/installation?projectId=${project.id}`,
  };
}

function StatCard({ icon, label, value, helper, tone = "#0E56C8", bg = "#EEF4FF" }) {
  return (
    <Box
      sx={{
        p: 1.35,
        borderRadius: "1.1rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "0.85rem",
          bgcolor: bg,
          color: tone,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ mt: 1, color: "#7D8797", fontSize: "0.68rem", fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.35, color: "#18253A", fontSize: "1.45rem", fontWeight: 800 }}>
        {value}
      </Typography>
      <Typography sx={{ mt: 0.25, color: "#667084", fontSize: "0.68rem", lineHeight: 1.45 }}>
        {helper}
      </Typography>
    </Box>
  );
}

function SavingsBar({ label, value, maxValue }) {
  const width = maxValue > 0 ? Math.max(8, Math.round((value / maxValue) * 100)) : 0;

  return (
    <Stack spacing={0.55}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography sx={{ color: "#4F5F73", fontSize: "0.76rem", fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#18253A", fontSize: "0.76rem", fontWeight: 800 }}>
          {formatPrice(value)}
        </Typography>
      </Stack>
      <Box sx={{ height: 9, borderRadius: 999, bgcolor: "#E8EDF5", overflow: "hidden" }}>
        <Box
          sx={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 999,
            bgcolor: "#0E56C8",
          }}
        />
      </Box>
    </Stack>
  );
}

export default function CustomerSavingsPage() {
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSavings() {
      setIsLoading(true);
      setError("");

      try {
        const [projectResult, paymentResult] = await Promise.all([
          projectsApi.listProjects(),
          paymentsApi.listPayments(),
        ]);

        if (active) {
          setProjects(projectResult);
          setPayments(paymentResult);
        }
      } catch (apiError) {
        if (active) {
          setError(apiError?.response?.data?.message || "Could not load savings data.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSavings();

    return () => {
      active = false;
    };
  }, []);

  const savings = useMemo(() => getSavingsModel(projects), [projects]);
  const projectRows = useMemo(() => projects.map(getProjectSavings), [projects]);
  const maxAnnualSavings = projectRows.reduce((max, project) => Math.max(max, project.annual), 0);
  const paidAmount = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.05rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Savings
          </Typography>
          <Typography sx={{ mt: 0.4, color: "#4F5F73", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 560 }}>
            Track projected energy savings from your real Sparkin installation projects.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/customer/projects"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          sx={{
            minHeight: 38,
            px: 1.55,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          View Projects
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ py: 5, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}

      {!isLoading && error ? (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      {!isLoading && !error && projects.length === 0 ? (
        <Alert severity="info" sx={{ mt: 1.5, borderRadius: "0.9rem" }}>
          Savings analytics will appear after you select a vendor quote and your project is created.
        </Alert>
      ) : null}

      {!isLoading && !error && projects.length > 0 ? (
        <>
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" },
              gap: 1.2,
            }}
          >
            <StatCard
              icon={<SavingsOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="Monthly Savings"
              value={formatPrice(savings.monthlySavings)}
              helper="Estimated from installed system size"
            />
            <StatCard
              icon={<BoltOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="Annual Savings"
              value={formatPrice(savings.annualSavings)}
              helper={`${formatNumber(savings.totalKw, "kW")} connected capacity`}
              tone="#7C7A00"
              bg="#F2F08E"
            />
            <StatCard
              icon={<SolarPowerOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="25-Year Value"
              value={formatPrice(savings.lifetimeSavings)}
              helper="Projected long-term bill reduction"
              tone="#239654"
              bg="#DDF8E7"
            />
            <StatCard
              icon={<Co2OutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="Annual CO2 Avoided"
              value={formatNumber(savings.annualCo2AvoidedKg / 1000, " t")}
              helper={`${formatNumber(savings.annualGeneration, " kWh")} estimated generation`}
              tone="#12824C"
              bg="#E8FAEF"
            />
          </Box>

          <Box
            sx={{
              mt: 1.6,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.8fr" },
              gap: 1.4,
            }}
          >
            <Box
              sx={{
                p: 1.45,
                borderRadius: "1.2rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                Project Savings Breakdown
              </Typography>
              <Stack spacing={1.15} sx={{ mt: 1.35 }}>
                {projectRows.map((project) => (
                  <Box key={project.id}>
                    <SavingsBar label={`${project.title} | ${project.system}`} value={project.annual} maxValue={maxAnnualSavings} />
                    <Button
                      component={RouterLink}
                      to={project.to}
                      sx={{
                        mt: 0.45,
                        px: 0,
                        minHeight: 24,
                        color: "#0E56C8",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      Open project
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.45,
                borderRadius: "1.2rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Stack direction="row" spacing={0.7} alignItems="center">
                <PaymentsOutlinedIcon sx={{ color: "#0E56C8", fontSize: "1rem" }} />
                <Typography sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}>
                  Payment Position
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ mt: 1.25 }}>
                <Box sx={{ p: 1.05, borderRadius: "0.95rem", bgcolor: "#F5F7FB" }}>
                  <Typography sx={{ color: "#7D8797", fontSize: "0.68rem", fontWeight: 800 }}>
                    Paid
                  </Typography>
                  <Typography sx={{ mt: 0.25, color: "#12824C", fontSize: "1.1rem", fontWeight: 800 }}>
                    {formatPrice(paidAmount)}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.05, borderRadius: "0.95rem", bgcolor: "#F5F7FB" }}>
                  <Typography sx={{ color: "#7D8797", fontSize: "0.68rem", fontWeight: 800 }}>
                    Pending
                  </Typography>
                  <Typography sx={{ mt: 0.25, color: "#18253A", fontSize: "1.1rem", fontWeight: 800 }}>
                    {formatPrice(pendingAmount)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  );
}

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import Co2OutlinedIcon from "@mui/icons-material/Co2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { CustomerErrorBlock, CustomerLoadingBlock } from "@/features/customer/components/CustomerPageStates";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatCompact(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return formatPrice(n);
}

function formatKwh(value) {
  const n = Math.round(Number(value) || 0);
  return n.toLocaleString("en-IN") + " kWh";
}

function formatCo2(kg) {
  const tons = (Number(kg) || 0) / 1000;
  return `${tons.toFixed(1)}t`;
}

// Human-readable panel type from DB enum
function formatPanelType(type) {
  const map = {
    monocrystalline: "Mono-PERC",
    polycrystalline: "Poly-Si",
    bifacial: "Bifacial",
  };
  return map[type] || type;
}

// Human-readable project status
function formatProjectStatus(status) {
  const map = {
    site_audit_pending: "Site Audit Pending",
    design_approval_pending: "Design Approval",
    installation_scheduled: "Scheduled",
    installation_in_progress: "Installing",
    inspection_pending: "Inspection",
    activated: "Activated",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] || status.replaceAll("_", " ");
}

// Savings model derived from installed capacity
function getSavingsModel(projects) {
  const totalKw = projects.reduce(
    (sum, p) => sum + (Number(p.system?.sizeKw) || 0),
    0,
  );
  const monthly = Math.round(totalKw * 1500);
  const annual = monthly * 12;
  const lifetime = annual * 25;
  const annualGeneration = Math.round(totalKw * 1450);
  const annualCo2Kg = Math.round(annualGeneration * 0.82);

  return { totalKw, monthly, annual, lifetime, annualGeneration, annualCo2Kg };
}

function getProjectRow(project) {
  const kw = Number(project.system?.sizeKw) || 0;
  return {
    id: project.id,
    label: `${project.installationAddress.city}, ${project.installationAddress.state}`,
    system: `${kw}kW ${formatPanelType(project.system?.panelType)}`,
    monthly: Math.round(kw * 1500),
    annual: Math.round(kw * 1500 * 12),
    status: formatProjectStatus(project.status),
    to: `/customer/projects`,
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  helper,
  tone = "#0E56C8",
  bg = "#EEF4FF",
}) {
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
      <Typography
        sx={{ mt: 1, color: "#7D8797", fontSize: "0.68rem", fontWeight: 800 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.35,
          color: "#18253A",
          fontSize: "1.45rem",
          fontWeight: 800,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          color: "#667084",
          fontSize: "0.68rem",
          lineHeight: 1.45,
        }}
      >
        {helper}
      </Typography>
    </Box>
  );
}

function SavingsBar({ label, value, maxValue }) {
  const pct =
    maxValue > 0 ? Math.max(6, Math.round((value / maxValue) * 100)) : 6;
  return (
    <Stack spacing={0.55}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography
          sx={{
            color: "#4F5F73",
            fontSize: "0.76rem",
            fontWeight: 700,
            minWidth: 0,
          }}
          noWrap
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: "#18253A",
            fontSize: "0.76rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {formatPrice(value)}
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: "#E8EDF5",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            bgcolor: "#0E56C8",
            transition: "width 0.4s ease",
          }}
        />
      </Box>
    </Stack>
  );
}

function PaymentRow({ payment }) {
  const isPaid = payment.status === "paid";
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{
        p: 1,
        borderRadius: "0.9rem",
        bgcolor: "#F5F7FB",
      }}
    >
      <Stack
        direction="row"
        spacing={0.7}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        {isPaid ? (
          <CheckCircleOutlinedIcon
            sx={{ color: "#12824C", fontSize: "0.95rem", flexShrink: 0 }}
          />
        ) : (
          <PendingOutlinedIcon
            sx={{ color: "#8F98A7", fontSize: "0.95rem", flexShrink: 0 }}
          />
        )}
        <Typography
          sx={{ color: "#223146", fontSize: "0.76rem", fontWeight: 700 }}
          noWrap
        >
          {payment.milestone?.title || "Payment"}
        </Typography>
      </Stack>
      <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            color: isPaid ? "#12824C" : "#18253A",
            fontSize: "0.82rem",
            fontWeight: 800,
          }}
        >
          {formatPrice(payment.amount)}
        </Typography>
        <Typography
          sx={{ color: "#98A3B2", fontSize: "0.6rem", fontWeight: 700 }}
        >
          {isPaid ? "Paid" : "Pending"}
        </Typography>
      </Stack>
    </Stack>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerSavingsPage() {
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSavings(active = true) {
    setIsLoading(true);
    setError("");

    try {
      const [projectResult, paymentResult] = await Promise.all([
        projectsApi.listProjects(),
        paymentsApi.listPayments(),
      ]);

      if (!active) return;
      setProjects(projectResult);
      setPayments(paymentResult);
    } catch (apiError) {
      if (active) {
        setError(apiError?.response?.data?.message || "Could not load savings data.");
      }
    } finally {
      if (active) setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadSavings(active);
    return () => {
      active = false;
    };
  }, []);

  // ── derived state ──────────────────────────────────────────────────────────

  const savings = useMemo(() => getSavingsModel(projects), [projects]);
  const projectRows = useMemo(() => projects.map(getProjectRow), [projects]);
  const maxAnnual = useMemo(
    () => projectRows.reduce((m, r) => Math.max(m, r.annual), 0),
    [projectRows],
  );

  const paidAmount = useMemo(
    () =>
      payments
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments],
  );

  const pendingAmount = useMemo(
    () =>
      payments
        .filter((p) => p.status !== "paid")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments],
  );

  const totalProjectCost = paidAmount + pendingAmount;
  const paymentProgress =
    totalProjectCost > 0
      ? Math.round((paidAmount / totalProjectCost) * 100)
      : 0;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
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
          <Typography
            sx={{
              mt: 0.4,
              color: "#4F5F73",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            Projected energy savings from your Sparkin installation projects.
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

      {/* Loading */}
      {isLoading && <CustomerLoadingBlock />}

      {/* Error */}
      {!isLoading && error && <CustomerErrorBlock message={error} onRetry={() => loadSavings(true)} mt={1.5} />}

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <Box
          sx={{
            mt: 1.85,
            py: 5,
            px: 2,
            borderRadius: "1.2rem",
            bgcolor: "#F8FAFD",
            border: "1px solid rgba(225,232,241,0.9)",
            textAlign: "center",
          }}
        >
          <SavingsOutlinedIcon
            sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }}
          />
          <Typography
            sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
          >
            No savings data yet
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: "#6F7D8F",
              fontSize: "0.84rem",
              lineHeight: 1.65,
              maxWidth: 360,
              mx: "auto",
            }}
          >
            Savings analytics appear once you have an active installation
            project. Accept a vendor quote to get started.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/customer/tenders"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{
              mt: 1.8,
              minHeight: 38,
              px: 1.65,
              borderRadius: "0.95rem",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            View My Tenders
          </Button>
        </Box>
      )}

      {/* Content */}
      {!isLoading && !error && projects.length > 0 && (
        <>
          {/* KPI strip */}
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", xl: "repeat(4, 1fr)" },
              gap: 1.2,
            }}
          >
            <StatCard
              icon={<SavingsOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="Monthly Savings"
              value={formatPrice(savings.monthly)}
              helper="Estimated from installed capacity"
            />
            <StatCard
              icon={<BoltOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="Annual Savings"
              value={formatCompact(savings.annual)}
              helper={`${savings.totalKw}kW connected`}
              tone="#7C7A00"
              bg="#F2F08E"
            />
            <StatCard
              icon={<SolarPowerOutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="25-Year Value"
              value={formatCompact(savings.lifetime)}
              helper="Projected bill reduction"
              tone="#239654"
              bg="#DDF8E7"
            />
            <StatCard
              icon={<Co2OutlinedIcon sx={{ fontSize: "1rem" }} />}
              label="CO₂ Avoided / Year"
              value={formatCo2(savings.annualCo2Kg)}
              helper={`${formatKwh(savings.annualGeneration)} est. generation`}
              tone="#12824C"
              bg="#E8FAEF"
            />
          </Box>

          {/* Breakdown + payments */}
          <Box
            sx={{
              mt: 1.6,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.8fr" },
              gap: 1.4,
            }}
          >
            {/* Project savings breakdown */}
            <Box
              sx={{
                p: 1.45,
                borderRadius: "1.2rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Typography
                sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}
              >
                Project Savings Breakdown
              </Typography>
              <Stack spacing={1.35} sx={{ mt: 1.35 }}>
                {projectRows.map((row) => (
                  <Box key={row.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 0.55 }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#223146",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                          }}
                          noWrap
                        >
                          {row.label}
                        </Typography>
                        <Typography
                          sx={{ color: "#7A8799", fontSize: "0.66rem" }}
                        >
                          {row.system} · {row.status}
                        </Typography>
                      </Box>
                      <Button
                        component={RouterLink}
                        to={row.to}
                        sx={{
                          minHeight: 24,
                          px: 0.8,
                          flexShrink: 0,
                          color: "#0E56C8",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "transparent" },
                        }}
                      >
                        Open ↗
                      </Button>
                    </Stack>
                    <SavingsBar
                      label={`₹${(row.monthly / 1000).toFixed(0)}K/mo`}
                      value={row.annual}
                      maxValue={maxAnnual}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Payment position */}
            <Box
              sx={{
                p: 1.45,
                borderRadius: "1.2rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <PaymentsOutlinedIcon
                    sx={{ color: "#0E56C8", fontSize: "1rem" }}
                  />
                  <Typography
                    sx={{ color: "#18253A", fontSize: "1rem", fontWeight: 800 }}
                  >
                    Payment Position
                  </Typography>
                </Stack>
              </Stack>

              {/* Progress bar */}
              {totalProjectCost > 0 && (
                <Box sx={{ mt: 1.2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography
                      sx={{
                        color: "#7D8797",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                      }}
                    >
                      {paymentProgress}% paid
                    </Typography>
                    <Typography
                      sx={{
                        color: "#7D8797",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                      }}
                    >
                      {formatCompact(totalProjectCost)} total
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      height: 7,
                      borderRadius: 999,
                      bgcolor: "#E8EDF5",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${paymentProgress}%`,
                        height: "100%",
                        borderRadius: 999,
                        bgcolor: "#12824C",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Payment rows */}
              <Stack spacing={0.75} sx={{ mt: 1.25 }}>
                {payments.length === 0 ? (
                  <Typography sx={{ color: "#7D8797", fontSize: "0.76rem" }}>
                    Payment schedule is being prepared.
                  </Typography>
                ) : (
                  payments
                    .slice(0, 4)
                    .map((payment) => (
                      <PaymentRow key={payment.id} payment={payment} />
                    ))
                )}
              </Stack>

              {/* Totals */}
              {payments.length > 0 && (
                <Box
                  sx={{
                    mt: 1.2,
                    pt: 1.1,
                    borderTop: "1px solid rgba(225,232,241,0.9)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      sx={{
                        color: "#7D8797",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      Paid
                    </Typography>
                    <Typography
                      sx={{
                        color: "#12824C",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                      }}
                    >
                      {formatPrice(paidAmount)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 0.45 }}
                  >
                    <Typography
                      sx={{
                        color: "#7D8797",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      Remaining
                    </Typography>
                    <Typography
                      sx={{
                        color: "#18253A",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                      }}
                    >
                      {formatPrice(pendingAmount)}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import customerSolarTipPlaceholder from "@/shared/assets/images/customer/dashboard/customer-solar-tip-placeholder.png";

const milestones = [
  { label: "Site Visit", meta: "Completed Oct 12", state: "completed" },
  { label: "Installation", meta: "In Progress", state: "active" },
  { label: "Inspection", meta: "Pending", state: "upcoming" },
  { label: "Activation", meta: "Estimated Nov 03", state: "upcoming" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toDashboardMilestone(milestone) {
  const completed = milestone.status === "completed";
  const active = milestone.status === "in_progress";

  return {
    label: milestone.title,
    meta: completed ? "Completed" : active ? "In Progress" : "Pending",
    state: completed ? "completed" : active ? "active" : "upcoming",
  };
}

function getFirstName(user) {
  return user?.fullName?.split(" ")?.[0] || "there";
}

function DashboardStep({ item, isFirst, isLast }) {
  const completed = item.state === "completed";
  const active = item.state === "active";

  return (
    <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
      {!isFirst && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "-50%",
            width: "100%",
            height: 2,
            bgcolor: completed || active ? "#0E56C8" : "#E2E8F0",
          }}
        />
      )}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "50%",
            width: "100%",
            height: 2,
            bgcolor: completed ? "#0E56C8" : "#E2E8F0",
          }}
        />
      )}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: completed || active ? "#0E56C8" : "#EEF2F7",
            color: completed || active ? "#FFFFFF" : "#8E99A8",
            border: active ? "3px solid #0E56C8" : "none",
            boxShadow: completed ? "0 10px 18px rgba(14,86,200,0.16)" : "none",
            display: "grid",
            placeItems: "center",
            fontSize: "0.78rem",
            fontWeight: 800,
          }}
        >
          {completed ? "✓" : active ? "⚡" : "◌"}
        </Box>
        <Typography
          sx={{
            mt: 0.95,
            color: active ? "#0E56C8" : "#223146",
            fontSize: "0.72rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          sx={{
            mt: 0.22,
            color: active ? "#0E56C8" : "#7C8797",
            fontSize: "0.6rem",
            fontWeight: active ? 800 : 500,
            textAlign: "center",
          }}
        >
          {item.meta}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [leadResult, quoteResult, projectResult] = await Promise.all([
          leadsApi.listLeads(),
          quotesApi.listQuotes(),
          projectsApi.listProjects(),
        ]);

        if (active) {
          setLeads(leadResult);
          setQuotes(quoteResult);
          setProjects(projectResult);
        }
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load dashboard.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const activeLead = leads.find((lead) => lead.status === "open_for_quotes") ?? leads[0];
  const activeProject = projects[0] ?? null;
  const leadQuotes = activeLead
    ? quotes.filter((quote) => String(quote.leadId) === String(activeLead.id))
    : [];
  const bestQuote = leadQuotes.length
    ? Math.min(...leadQuotes.map((quote) => Number(quote.pricing.totalPrice)))
    : null;
  const selectedSystemSize = projects.reduce((sum, project) => sum + (Number(project.system?.sizeKw) || 0), 0);
  const monthlySavings = selectedSystemSize > 0 ? Math.round(selectedSystemSize * 1500) : 0;
  const lifetimeSavings = monthlySavings * 12 * 5;
  const projectMilestones = useMemo(
    () => activeProject?.milestones?.map(toDashboardMilestone) ?? milestones,
    [activeProject],
  );
  const activeProjectLocation = activeProject
    ? `${activeProject.installationAddress.city}, ${activeProject.installationAddress.state}`
    : "No active project yet";

  return (
    <Box sx={{ width: "100%" }}>
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
          Good morning, {getFirstName(user)}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: "#6F7D8F",
            fontSize: "0.92rem",
            lineHeight: 1.6,
          }}
        >
          {projects.length > 0
            ? "Your solar project is now connected to live progress tracking."
            : "Your booking and quote activity will appear here as vendors respond."}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ mt: 1.5, py: 3, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}

      {!isLoading && error ? (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          mt: 1.8,
          p: 1.55,
          borderRadius: "1.2rem",
          bgcolor: "#0E56C8",
          color: "#FFFFFF",
          boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
        }}
      >
        <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
          Refer a friend, save ₹5000
        </Typography>
        <Typography
          sx={{
            mt: 0.45,
            maxWidth: 540,
            color: "rgba(255,255,255,0.78)",
            fontSize: "0.76rem",
            lineHeight: 1.65,
          }}
        >
          Earn credits on your installation by sharing Sparkin Solar with your
          network.
        </Typography>
        <Button
          variant="contained"
          startIcon={<CardGiftcardRoundedIcon />}
          sx={{
            mt: 1.35,
            minHeight: 34,
            px: 1.3,
            borderRadius: "0.85rem",
            bgcolor: "#FFFFFF",
            color: "#0E56C8",
            boxShadow: "none",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#FFFFFF" },
          }}
        >
          Get Referral Code
        </Button>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.95fr" },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1.55,
            borderRadius: "1.25rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 78% 38%, rgba(255,255,255,0.14), transparent 18%), radial-gradient(circle at 85% 55%, rgba(255,255,255,0.1), transparent 20%), radial-gradient(circle at 72% 72%, rgba(255,255,255,0.08), transparent 22%)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
              gap: 1.3,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Total Lifetime Savings
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  lineHeight: 1.02,
                }}
              >
                {formatPrice(lifetimeSavings)}
                <Box
                  component="span"
                  sx={{ ml: 0.45, fontSize: "1.25rem", fontWeight: 700 }}
                >
                  projected
                </Box>
              </Typography>
              <Typography
                sx={{
                  mt: 0.95,
                  color: "#80F0A8",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                }}
              >
                Based on {selectedSystemSize || 0}kW selected capacity
              </Typography>
            </Box>

            <Stack spacing={0.95}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                  }}
                >
                  Monthly Savings
                </Typography>
                <Typography
                  sx={{ mt: 0.45, fontSize: "1.4rem", fontWeight: 800 }}
                >
                  {formatPrice(monthlySavings)}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                  }}
                >
                  Carbon Offset
                </Typography>
                <Typography
                  sx={{ mt: 0.45, fontSize: "1.3rem", fontWeight: 800 }}
                >
                  {(selectedSystemSize * 0.5).toFixed(1)} Tons
                  <Box
                    component="span"
                    sx={{ ml: 0.35, fontSize: "0.72rem", fontWeight: 700 }}
                  >
                    CO2
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ mt: 0.2 }}>
                <Stack
                  direction="row"
                  spacing={0.55}
                  alignItems="flex-end"
                  sx={{ height: 56 }}
                >
                  {[18, 32, 28, 48, 66].map((height, index) => (
                    <Box
                      key={height}
                      sx={{
                        flex: 1,
                        height,
                        borderRadius: "0.38rem 0.38rem 0 0",
                        bgcolor:
                          index === 4 ? "#46D36F" : "rgba(255,255,255,0.18)",
                      }}
                    />
                  ))}
                </Stack>
                <Typography
                  sx={{
                    mt: 0.45,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.52rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Efficiency Trend • Last 30 Days
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "1fr" },
            gap: 1.3,
          }}
        >
          <Box
            sx={{
              p: 1.35,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.82,
                  py: 0.34,
                  borderRadius: "999px",
                  bgcolor: "#E7F318",
                  color: "#6C7300",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Status: Live
              </Box>
              <GavelRoundedIcon sx={{ color: "#7A8799", fontSize: "1rem" }} />
            </Stack>
            <Typography
              sx={{
                mt: 1.05,
                color: "#223146",
                fontSize: "1rem",
                fontWeight: 800,
              }}
            >
              Active Solar Tender
            </Typography>
            <Stack spacing={0.7} sx={{ mt: 1 }}>
              <Box sx={{ p: 0.9, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#6F7D8F", fontSize: "0.72rem" }}>
                    Bids Received
                  </Typography>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                    }}
                  >
                    {leadQuotes.length}
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 0.9, borderRadius: "0.9rem", bgcolor: "#F8FAFD" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#6F7D8F", fontSize: "0.72rem" }}>
                    Best Offer Price
                  </Typography>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                    }}
                  >
                    {bestQuote ? formatPrice(bestQuote) : "Waiting"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Button
              variant="contained"
              component={RouterLink}
              to={leadQuotes.length > 0 ? "/quotes/compare" : "/tenders/live"}
              fullWidth
              sx={{
                mt: 1.05,
                minHeight: 36,
                borderRadius: "0.9rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {leadQuotes.length > 0 ? "View All Bids" : "Track Tender"}
            </Button>
          </Box>

          <Box
            sx={{
              p: 1.35,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.82,
                  py: 0.34,
                  borderRadius: "999px",
                  bgcolor: "#DDF8E7",
                  color: "#239654",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                Support Active
              </Box>
              <BuildCircleOutlinedIcon
                sx={{ color: "#7A8799", fontSize: "1rem" }}
              />
            </Stack>
            <Typography
              sx={{
                mt: 1.05,
                color: "#223146",
                fontSize: "1rem",
                fontWeight: 800,
              }}
            >
              Maintenance Service
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 0.95,
                borderRadius: "0.95rem",
                bgcolor: "#F8FAFD",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ color: "#6F7D8F", fontSize: "0.68rem" }}>
                  Ticket ID
                </Typography>
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  SR-8821
                </Typography>
              </Stack>
              <Typography
                sx={{
                  mt: 0.75,
                  color: "#223146",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                }}
              >
                Technician Assigned
              </Typography>
              <Typography
                sx={{
                  mt: 0.18,
                  color: "#6F7D8F",
                  fontSize: "0.7rem",
                  lineHeight: 1.55,
                }}
              >
                Visit scheduled for Tomorrow, 10:00 AM
              </Typography>
            </Box>
            <Button
              fullWidth
              sx={{
                mt: 1.05,
                minHeight: 36,
                borderRadius: "0.9rem",
                bgcolor: "#F3F6FB",
                color: "#223146",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              View Service History ↗
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.55,
          p: 1.45,
          borderRadius: "1.2rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={1.3}
        >
          <Stack direction="row" spacing={0.95} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "0.9rem",
                bgcolor: "#EEF4FF",
                color: "#0E56C8",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ApartmentRoundedIcon sx={{ fontSize: "1rem" }} />
            </Box>
            <Box>
              <Typography
                sx={{ color: "#223146", fontSize: "1.02rem", fontWeight: 800 }}
              >
                {activeProject
                  ? `Active Project: ${activeProject.system.sizeKw}kW Rooftop`
                  : "No active project yet"}
              </Typography>
              <Typography
                sx={{ mt: 0.12, color: "#7A8799", fontSize: "0.74rem" }}
              >
                {activeProject
                  ? `Residential Installation - ${activeProjectLocation}`
                  : "Select a quote to start installation tracking"}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            component={RouterLink}
            to={activeProject ? `/project/installation?projectId=${activeProject.id}` : "/customer/bookings"}
            sx={{
              minHeight: 36,
              px: 1.45,
              borderRadius: "999px",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.14)",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {activeProject ? "Track Installation" : "View Bookings"}
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 0 }}
          sx={{ mt: 1.8 }}
        >
          {projectMilestones.map((item, index) => (
            <DashboardStep
              key={item.label}
              item={item}
              isFirst={index === 0}
              isLast={index === projectMilestones.length - 1}
            />
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 1.55,
          p: 1.35,
          borderRadius: "1.2rem",
          background: "linear-gradient(90deg, #F2F47D 0%, #F0F7A6 100%)",
          border: "1px solid rgba(227,233,167,0.95)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box
            component="img"
            src={customerSolarTipPlaceholder}
            alt="Solar tip illustration placeholder"
            sx={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              sx={{ color: "#4C5A00", fontSize: "1rem", fontWeight: 800 }}
            >
              Solar Pro-Tip: Optimize your morning usage
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
                color: "#5D6A16",
                fontSize: "0.76rem",
                lineHeight: 1.68,
                maxWidth: 720,
              }}
            >
              Your panels reach peak efficiency between 10:00 AM and 2:00 PM.
              Schedule heavy appliances like your dishwasher or washing machine
              during this window to maximize direct consumption and save an
              additional ₹400 monthly.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

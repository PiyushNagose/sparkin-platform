import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import { Link as RouterLink } from "react-router-dom";
import { referralsApi } from "@/features/customer/api/referralsApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function getStatusStyle(status) {
  switch (status) {
    case "rewarded":
      return { label: "Rewarded", bg: "#E8FAEF", tone: "#177D45" };
    case "installed":
      return { label: "Installed", bg: "#E8FAEF", tone: "#177D45" };
    case "signed_up":
      return { label: "Signed Up", bg: "#EEF4FF", tone: "#0E56C8" };
    default:
      return { label: "Invited", bg: "#F2F5F8", tone: "#677487" };
  }
}

function toReferralRow(referral) {
  const status = getStatusStyle(referral.status);
  return {
    id: referral.id,
    name: referral.friend.fullName,
    initials: getInitials(referral.friend.fullName),
    statusLabel: status.label,
    statusBg: status.bg,
    statusTone: status.tone,
    reward:
      referral.rewardStatus === "pending" || referral.rewardStatus === "earned"
        ? referral.rewardStatus === "earned"
          ? formatPrice(referral.rewardAmount)
          : "Pending"
        : referral.rewardStatus === "paid"
          ? formatPrice(referral.rewardAmount)
          : "—",
    rewardPaid: referral.rewardStatus === "paid",
    date: formatDate(referral.createdAt),
  };
}

// CSV export
function downloadCsv(rows) {
  const header = "Friend Name,Status,Reward,Date\n";
  const body = rows
    .map((r) => `"${r.name}","${r.statusLabel}","${r.reward}","${r.date}"`)
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sparkin-referrals-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ title, value, meta, metaTone, icon }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.25rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", right: 14, top: 10, color: "#E8EEF9" }}>
        {icon}
      </Box>
      <Typography
        sx={{ color: "#7F8A9B", fontSize: "0.62rem", fontWeight: 700 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.65,
          color: "#223146",
          fontSize: "2.1rem",
          fontWeight: 800,
          lineHeight: 1.02,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{ mt: 0.95, color: metaTone, fontSize: "0.68rem", fontWeight: 700 }}
      >
        {meta}
      </Typography>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function CustomerReferralEarningsPage() {
  const [dashboard, setDashboard] = useState({ summary: null, referrals: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEarnings() {
      setIsLoading(true);
      setError("");

      try {
        const result = await referralsApi.getDashboard();
        if (!active) return;
        setDashboard(result);
      } catch (apiError) {
        if (active)
          setError(
            apiError?.response?.data?.message ||
              "Could not load referral earnings.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadEarnings();
    return () => {
      active = false;
    };
  }, []);

  const summary = dashboard.summary;
  const allRows = useMemo(
    () => dashboard.referrals.map(toReferralRow),
    [dashboard.referrals],
  );
  const visibleRows = showAll ? allRows : allRows.slice(0, PAGE_SIZE);

  // Milestone bonus — how many more referrals to next tier (every 5)
  const successful = summary?.successfulReferrals ?? 0;
  const nextMilestone = Math.ceil((successful + 1) / 5) * 5;
  const toNextMilestone = nextMilestone - successful;

  const summaryCards = [
    {
      title: "Total Earnings",
      value: formatPrice(summary?.totalEarnings),
      meta: `${formatPrice(summary?.availableEarnings)} available to withdraw`,
      metaTone: "#177D45",
      icon: <SavingsOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
    },
    {
      title: "Total Referrals",
      value: String(summary?.invitesSent ?? 0),
      meta: `${successful} successful · ${summary?.pendingReferrals ?? 0} pending`,
      metaTone: "#647387",
      icon: <GroupOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
    },
  ];

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
            Earnings History
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              maxWidth: 430,
            }}
          >
            Track your solar referral rewards and monitor your impact.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/customer/referrals/share"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            minHeight: 38,
            px: 1.65,
            alignSelf: { xs: "stretch", sm: "flex-start" },
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          New Referral
        </Button>
      </Stack>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ mt: 2, py: 5, display: "grid", placeItems: "center" }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: "0.9rem" }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {/* Summary cards */}
          <Box
            sx={{
              mt: 1.8,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.35,
            }}
          >
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </Box>

          {/* Referral table */}
          <Box
            sx={{
              mt: 1.75,
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.4, py: 1.15 }}
            >
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                Referral List
              </Typography>
              <Button
                onClick={() => allRows.length > 0 && downloadCsv(allRows)}
                disabled={allRows.length === 0}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: "0.9rem" }} />}
                sx={{
                  minHeight: 30,
                  px: 1,
                  color: "#647387",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Export CSV
              </Button>
            </Stack>

            {/* Desktop table */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                  px: 1.45,
                  py: 0.8,
                  borderTop: "1px solid rgba(232,237,244,0.9)",
                  borderBottom: "1px solid rgba(232,237,244,0.9)",
                  color: "#7F8A9B",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <Box>Friend Name</Box>
                <Box>Status</Box>
                <Box>Reward</Box>
                <Box>Date</Box>
              </Box>

              {visibleRows.length === 0 ? (
                <Box sx={{ px: 1.45, py: 2 }}>
                  <RedeemRoundedIcon
                    sx={{ color: "#C8D0DC", fontSize: "1.5rem", mb: 0.5 }}
                  />
                  <Typography sx={{ color: "#647387", fontSize: "0.82rem" }}>
                    No referrals yet. Create your first invite to start tracking
                    rewards.
                  </Typography>
                </Box>
              ) : (
                visibleRows.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                      px: 1.45,
                      py: 1.1,
                      alignItems: "center",
                      borderBottom: "1px solid rgba(232,237,244,0.9)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: "#EEF2F7",
                          color: "#647387",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.initials}
                      </Avatar>
                      <Typography
                        sx={{
                          color: "#223146",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Stack>
                    <Box>
                      <Box
                        sx={{
                          display: "inline-flex",
                          px: 0.7,
                          py: 0.28,
                          borderRadius: "999px",
                          bgcolor: item.statusBg,
                          color: item.statusTone,
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {item.statusLabel}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        color: item.rewardPaid ? "#177D45" : "#223146",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.reward}
                    </Typography>
                    <Typography sx={{ color: "#647387", fontSize: "0.78rem" }}>
                      {item.date}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            {/* Mobile cards */}
            <Stack
              spacing={1}
              sx={{
                display: { xs: "flex", md: "none" },
                px: 1.15,
                pb: 1.2,
                pt: 0.5,
              }}
            >
              {visibleRows.length === 0 ? (
                <Typography
                  sx={{ color: "#647387", fontSize: "0.82rem", py: 1 }}
                >
                  No referrals yet.
                </Typography>
              ) : (
                visibleRows.map((item) => (
                  <Box
                    key={`m-${item.id}`}
                    sx={{
                      p: 1.05,
                      borderRadius: "1rem",
                      bgcolor: "#F8FAFD",
                      border: "1px solid rgba(232,237,244,0.9)",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1}
                    >
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: "#EEF2F7",
                            color: "#647387",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.initials}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              color: "#223146",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.15,
                              color: "#647387",
                              fontSize: "0.68rem",
                            }}
                          >
                            {item.date}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography
                        sx={{
                          color: item.rewardPaid ? "#177D45" : "#223146",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.reward}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        mt: 0.85,
                        display: "inline-flex",
                        px: 0.7,
                        py: 0.28,
                        borderRadius: "999px",
                        bgcolor: item.statusBg,
                        color: item.statusTone,
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {item.statusLabel}
                    </Box>
                  </Box>
                ))
              )}
            </Stack>

            {/* Show more / less */}
            {allRows.length > PAGE_SIZE && (
              <Button
                onClick={() => setShowAll((v) => !v)}
                sx={{
                  mx: "auto",
                  my: 1.05,
                  display: "flex",
                  color: "#0E56C8",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {showAll ? "Show Less" : `View All ${allRows.length} Referrals`}
              </Button>
            )}
          </Box>

          {/* Bottom cards */}
          <Box
            sx={{
              mt: 1.55,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.45fr 0.95fr" },
              gap: 1.45,
            }}
          >
            {/* Grow the community */}
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
                  right: -10,
                  bottom: -18,
                  opacity: 0.13,
                  fontSize: "5rem",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: "#FFFFFF",
                  userSelect: "none",
                }}
              >
                ₹
              </Box>
              <Typography
                sx={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Grow the Community
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  maxWidth: 260,
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "0.78rem",
                  lineHeight: 1.65,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Earn ₹5,000 for every home that goes solar with your unique
                referral link.
              </Typography>
              <Button
                component={RouterLink}
                to="/customer/referrals/share"
                startIcon={<ContentCopyRoundedIcon />}
                sx={{
                  mt: 1.35,
                  minHeight: 34,
                  px: 1.35,
                  borderRadius: "0.85rem",
                  bgcolor: "#E7F318",
                  color: "#223146",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#DDE90F" },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Share Referral Link
              </Button>
            </Box>

            {/* Milestone bonus — data-driven */}
            <Box
              sx={{
                p: 1.45,
                borderRadius: "1.25rem",
                bgcolor: "#F3F6FB",
                border: "1px solid rgba(225,232,241,0.9)",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#E7F318",
                  color: "#6C7300",
                  display: "grid",
                  placeItems: "center",
                  mb: 1.05,
                }}
              >
                <StarsRoundedIcon sx={{ fontSize: "0.85rem" }} />
              </Box>
              <Typography
                sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
              >
                Milestone Bonus
              </Typography>
              {successful >= 5 ? (
                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#177D45",
                    fontSize: "0.76rem",
                    lineHeight: 1.68,
                    fontWeight: 700,
                  }}
                >
                  🎉 You've hit {successful} referrals! Keep going to unlock the
                  next tier bonus.
                </Typography>
              ) : (
                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#647387",
                    fontSize: "0.76rem",
                    lineHeight: 1.68,
                  }}
                >
                  You are{" "}
                  <Box
                    component="span"
                    sx={{ color: "#0E56C8", fontWeight: 800 }}
                  >
                    {toNextMilestone} referral{toNextMilestone === 1 ? "" : "s"}
                  </Box>{" "}
                  away from unlocking the next milestone bonus of ₹10,000.
                </Typography>
              )}

              {/* Progress toward next milestone */}
              <Box sx={{ mt: 1.5 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    sx={{
                      color: "#7D8797",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                    }}
                  >
                    {successful} / {nextMilestone} referrals
                  </Typography>
                  <RedeemRoundedIcon
                    sx={{ color: "#C8D0DC", fontSize: "0.9rem" }}
                  />
                </Stack>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "#E8EDF5",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.round((successful / nextMilestone) * 100)}%`,
                      height: "100%",
                      borderRadius: 999,
                      bgcolor: "#0E56C8",
                      transition: "width 0.4s ease",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

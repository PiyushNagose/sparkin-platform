import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { NavLink } from "react-router-dom";
import { referralsApi } from "@/features/customer/api/referralsApi";

const summaryCards = [
  {
    title: "Total Earnings",
    value: "\u20B925,000",
    meta: "\u2197 12% increase from last month",
    icon: <SavingsOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
    iconTone: "#E8EEF9",
    metaTone: "#177D45",
  },
  {
    title: "Total Referrals",
    value: "5",
    meta: "\u25A1 60% conversion rate",
    icon: <GroupOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
    iconTone: "#E8EEF9",
    metaTone: "#647387",
  },
];

const referrals = [
  { name: "Priya Sharma", initials: "Pr", status: "Installed", statusBg: "#E8FAEF", statusTone: "#177D45", reward: "\u20B95,000", date: "Oct 24, 2023" },
  { name: "Rahul Verma", initials: "RV", status: "Signed Up", statusBg: "#EEF4FF", statusTone: "#0E56C8", reward: "-", date: "Oct 22, 2023" },
  { name: "Amit Singh", initials: "Ar", status: "Invited", statusBg: "#F2F5F8", statusTone: "#677487", reward: "-", date: "Oct 20, 2023" },
  { name: "Sneha Reddy", initials: "r R", status: "Installed", statusBg: "#E8FAEF", statusTone: "#177D45", reward: "\u20B95,000", date: "Oct 15, 2023" },
  { name: "Vikram Rao", initials: "VR", status: "Signed Up", statusBg: "#EEF4FF", statusTone: "#0E56C8", reward: "-", date: "Oct 10, 2023" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusStyle(status) {
  if (status === "installed" || status === "rewarded") {
    return { label: status.replaceAll("_", " "), bg: "#E8FAEF", tone: "#177D45" };
  }

  if (status === "signed_up") {
    return { label: "signed up", bg: "#EEF4FF", tone: "#0E56C8" };
  }

  return { label: "invited", bg: "#F2F5F8", tone: "#677487" };
}

function toReferralRow(referral) {
  const status = getStatusStyle(referral.status);

  return {
    name: referral.friend.fullName,
    initials: getInitials(referral.friend.fullName),
    status: status.label,
    statusBg: status.bg,
    statusTone: status.tone,
    reward: referral.rewardStatus === "pending" ? "-" : formatPrice(referral.rewardAmount),
    date: formatDate(referral.createdAt),
  };
}

function getSummaryCards(summary) {
  return [
    {
      title: "Total Earnings",
      value: formatPrice(summary?.totalEarnings),
      meta: `${formatPrice(summary?.availableEarnings)} available`,
      icon: <SavingsOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
      iconTone: "#E8EEF9",
      metaTone: "#177D45",
    },
    {
      title: "Total Referrals",
      value: String(summary?.invitesSent ?? 0),
      meta: `${summary?.successfulReferrals ?? 0} successful referrals`,
      icon: <GroupOutlinedIcon sx={{ fontSize: "1.7rem" }} />,
      iconTone: "#E8EEF9",
      metaTone: "#647387",
    },
  ];
}

function SummaryCard({ item }) {
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
      <Box
        sx={{
          position: "absolute",
          right: 14,
          top: 10,
          color: item.iconTone,
        }}
      >
        {item.icon}
      </Box>
      <Typography sx={{ color: "#7F8A9B", fontSize: "0.62rem", fontWeight: 700 }}>{item.title}</Typography>
      <Typography sx={{ mt: 0.65, color: "#223146", fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.02 }}>
        {item.value}
      </Typography>
      <Typography sx={{ mt: 0.95, color: item.metaTone, fontSize: "0.68rem", fontWeight: 700 }}>
        {item.meta}
      </Typography>
    </Box>
  );
}

export default function CustomerReferralEarningsPage() {
  const [dashboard, setDashboard] = useState({ summary: null, referrals: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEarnings() {
      setIsLoading(true);
      setError("");

      try {
        const result = await referralsApi.getDashboard();
        if (active) setDashboard(result);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load referral earnings.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadEarnings();

    return () => {
      active = false;
    };
  }, []);

  const displaySummaryCards = useMemo(() => getSummaryCards(dashboard.summary), [dashboard.summary]);
  const displayReferrals = useMemo(() => dashboard.referrals.map(toReferralRow), [dashboard.referrals]);

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
            Track your solar referral rewards and monitor your impact on the green energy transition.
          </Typography>
        </Box>

        <Button
          component={NavLink}
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

      {!isLoading && !error ? (
      <>
      <Box
        sx={{
          mt: 1.8,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 1.35,
        }}
      >
        {displaySummaryCards.map((item) => (
          <SummaryCard key={item.title} item={item} />
        ))}
      </Box>

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1.4, py: 1.15 }}>
          <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>Referral List</Typography>
          <Stack direction="row" spacing={0.9} alignItems="center">
            <TuneRoundedIcon sx={{ color: "#647387", fontSize: "0.95rem" }} />
            <DownloadRoundedIcon sx={{ color: "#647387", fontSize: "0.95rem" }} />
          </Stack>
        </Stack>

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
            <Box>Reward Amount</Box>
            <Box>Date</Box>
          </Box>

          {displayReferrals.length === 0 ? (
            <Box sx={{ px: 1.45, py: 1.4, borderTop: "1px solid rgba(232,237,244,0.9)" }}>
              <Typography sx={{ color: "#647387", fontSize: "0.82rem" }}>
                No referrals yet. Create your first referral invite to start tracking rewards.
              </Typography>
            </Box>
          ) : null}

          {displayReferrals.map((item) => (
            <Box
              key={`${item.name}-${item.date}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                px: 1.45,
                py: 1.1,
                alignItems: "center",
                borderBottom: "1px solid rgba(232,237,244,0.9)",
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Avatar sx={{ width: 28, height: 28, bgcolor: "#EEF2F7", color: "#647387", fontSize: "0.72rem", fontWeight: 700 }}>
                  {item.initials}
                </Avatar>
                <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 600 }}>{item.name}</Typography>
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
                  {item.status}
                </Box>
              </Box>
              <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 600 }}>{item.reward}</Typography>
              <Typography sx={{ color: "#647387", fontSize: "0.78rem" }}>{item.date}</Typography>
            </Box>
          ))}
        </Box>

        <Stack spacing={1} sx={{ display: { xs: "flex", md: "none" }, px: 1.15, pb: 1.2 }}>
          {displayReferrals.map((item) => (
            <Box
              key={`mobile-${item.name}-${item.date}`}
              sx={{
                p: 1.05,
                borderRadius: "1rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(232,237,244,0.9)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Avatar sx={{ width: 30, height: 30, bgcolor: "#EEF2F7", color: "#647387", fontSize: "0.72rem", fontWeight: 700 }}>
                    {item.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}>{item.name}</Typography>
                    <Typography sx={{ mt: 0.15, color: "#647387", fontSize: "0.68rem" }}>{item.date}</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ color: "#223146", fontSize: "0.8rem", fontWeight: 700 }}>{item.reward}</Typography>
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
                {item.status}
              </Box>
            </Box>
          ))}
        </Stack>

        <Button
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
          View All Referrals
        </Button>
      </Box>

      <Box
        sx={{
          mt: 1.55,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.45fr 0.95fr" },
          gap: 1.45,
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
              right: -10,
              bottom: -18,
              opacity: 0.13,
              color: "#FFFFFF",
              fontSize: "5rem",
              fontWeight: 800,
            }}
          >
            ₹
          </Box>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, position: "relative", zIndex: 1 }}>
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
            Earn ₹5,000 for every home that goes solar with your unique referral link.
          </Typography>
          <Button
            component={NavLink}
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
              "&:hover": { bgcolor: "#E7F318" },
              position: "relative",
              zIndex: 1,
            }}
          >
            Copy Referral Link
          </Button>
        </Box>

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
              width: 24,
              height: 24,
              borderRadius: "50%",
              bgcolor: "#E7F318",
              color: "#6C7300",
              display: "grid",
              placeItems: "center",
              mb: 1.05,
            }}
          >
            <StarsRoundedIcon sx={{ fontSize: "0.8rem" }} />
          </Box>
          <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
            Milestone Bonus
          </Typography>
          <Typography sx={{ mt: 0.5, color: "#647387", fontSize: "0.76rem", lineHeight: 1.68 }}>
            You are 2 referrals away from unlocking the Diamond Partner badge and a ₹10,000 bonus!
          </Typography>
        </Box>
      </Box>
      </>
      ) : null}
    </Box>
  );
}

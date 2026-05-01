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
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
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

function formatStatus(status) {
  const map = {
    invited: "Invited",
    signed_up: "Signed Up",
    installed: "Installed",
    rewarded: "Rewarded",
  };
  return (
    map[status] ||
    status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function getRewardTone(referral) {
  if (referral.rewardStatus === "paid" || referral.rewardStatus === "earned")
    return "#239654";
  if (referral.status === "signed_up" || referral.status === "installed")
    return "#0E56C8";
  return "#677487";
}

function getAvatarColor(name) {
  const colors = ["#132C58", "#0E56C8", "#087A2D", "#8B4513", "#6B238E"];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function toActivityItem(referral) {
  return {
    id: referral.id,
    name: referral.friend.fullName,
    initial: referral.friend.fullName.charAt(0).toUpperCase(),
    avatarColor: getAvatarColor(referral.friend.fullName),
    detail: formatStatus(referral.status),
    amount:
      referral.rewardStatus === "pending"
        ? "Pending"
        : `+${formatPrice(referral.rewardAmount)}`,
    rewardLabel:
      referral.rewardStatus === "paid"
        ? "Paid"
        : referral.rewardStatus === "earned"
          ? "Earned"
          : "In Progress",
    tone: getRewardTone(referral),
  };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function StatCard({ icon, iconBg, iconTone, value, label }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.25rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          mx: "auto",
          borderRadius: "0.85rem",
          bgcolor: iconBg,
          color: iconTone,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          mt: 1.05,
          color: "#223146",
          fontSize: "1.65rem",
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#647387", fontSize: "0.74rem" }}>
        {label}
      </Typography>
    </Box>
  );
}

function QuickShareRow({
  icon,
  iconBg,
  iconTone,
  label,
  description,
  onClick,
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.15,
        borderRadius: "1rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 10px 20px rgba(16,29,51,0.04)",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
        "&:hover": { boxShadow: "0 14px 28px rgba(16,29,51,0.08)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={0.85} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "0.75rem",
              bgcolor: iconBg,
              color: iconTone,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              sx={{ color: "#223146", fontSize: "0.82rem", fontWeight: 700 }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ mt: 0.12, color: "#98A3B2", fontSize: "0.62rem" }}
              noWrap
            >
              {description}
            </Typography>
          </Box>
        </Stack>
        <ChevronRightRoundedIcon
          sx={{ color: "#B4BECC", fontSize: "1.15rem", flexShrink: 0 }}
        />
      </Stack>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerReferralsPage() {
  const [dashboard, setDashboard] = useState({ summary: null, referrals: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReferrals() {
      setIsLoading(true);
      setError("");

      try {
        const result = await referralsApi.getDashboard();
        if (!active) return;
        setDashboard(result);
      } catch (apiError) {
        if (active)
          setError(
            apiError?.response?.data?.message || "Could not load referrals.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadReferrals();
    return () => {
      active = false;
    };
  }, []);

  const summary = dashboard.summary;
  const activityItems = useMemo(
    () => dashboard.referrals.slice(0, 5).map(toActivityItem),
    [dashboard.referrals],
  );

  async function copyReferralLink() {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      setNotice("Referral link copied to clipboard.");
    } catch {
      setNotice("Could not copy — please copy the link manually.");
    }
  }

  async function shareReferral() {
    if (!summary?.referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sparkin Solar referral",
          text: "Go solar with Sparkin and use my referral link for a discount.",
          url: summary.referralLink,
        });
        return;
      } catch {
        // user cancelled share — fall through to copy
      }
    }
    await copyReferralLink();
  }

  function openWhatsApp() {
    if (!summary?.referralLink) return;
    const msg = `Hey! I'm saving on electricity with Sparkin Solar. Use my referral link: ${summary.referralLink}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const quickShareItems = [
    {
      label: "WhatsApp",
      description: "Share directly via WhatsApp",
      icon: <WhatsAppIcon sx={{ fontSize: "0.95rem" }} />,
      iconBg: "#DDF7E8",
      iconTone: "#177D45",
      onClick: openWhatsApp,
    },
    {
      label: "Copy Link",
      description:
        summary?.referralLink?.replace("https://", "") || "Link unavailable",
      icon: <LinkRoundedIcon sx={{ fontSize: "0.95rem" }} />,
      iconBg: "#EEF4FF",
      iconTone: "#0E56C8",
      onClick: copyReferralLink,
    },
    {
      label: "QR Code",
      description: "Coming soon",
      icon: <QrCode2RoundedIcon sx={{ fontSize: "0.95rem" }} />,
      iconBg: "#F2F5F8",
      iconTone: "#647387",
      onClick: () => {},
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
            Refer & Earn
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Invite friends and earn rewards for every successful installation.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            px: 1.15,
            py: 0.6,
            borderRadius: "0.9rem",
            bgcolor: "#E7F318",
            color: "#6C7300",
            fontSize: "0.72rem",
            fontWeight: 800,
            lineHeight: 1,
            alignItems: "center",
            gap: 0.45,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Earn ₹5,000 per referral
        </Box>
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

      {/* Copy notice */}
      {notice && (
        <Alert
          severity="success"
          sx={{ mt: 1.5, borderRadius: "0.9rem" }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {/* Code + wallet */}
          <Box
            sx={{
              mt: 1.85,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "1.65fr 0.95fr" },
              gap: 1.55,
            }}
          >
            {/* Referral code card */}
            <Box
              sx={{
                p: 1.6,
                borderRadius: "1.35rem",
                bgcolor: "#F8FAFD",
                border: "1px solid rgba(225,232,241,0.92)",
              }}
            >
              <Typography
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Your Personal Code
              </Typography>
              <Typography
                sx={{
                  mt: 0.85,
                  color: "#223146",
                  fontSize: "1.55rem",
                  fontWeight: 800,
                }}
              >
                Spark your network
              </Typography>
              <Typography
                sx={{
                  mt: 0.45,
                  maxWidth: 390,
                  color: "#647387",
                  fontSize: "0.84rem",
                  lineHeight: 1.7,
                }}
              >
                Share this code with friends. They get a ₹2,000 discount, and
                you earn ₹500 instantly when they sign up.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    px: 1.25,
                    py: 1.1,
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(225,232,241,0.96)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  onClick={copyReferralLink}
                >
                  <Typography
                    sx={{
                      color: "#0E56C8",
                      fontSize: { xs: "1.4rem", md: "1.75rem" },
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      lineHeight: 1,
                    }}
                  >
                    {summary?.referralCode || "—"}
                  </Typography>
                  <ContentCopyRoundedIcon
                    sx={{ color: "#7F8A9B", fontSize: "1rem", flexShrink: 0 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={shareReferral}
                  sx={{
                    minHeight: 42,
                    px: 1.75,
                    borderRadius: "0.95rem",
                    bgcolor: "#0E56C8",
                    boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Share Now
                </Button>
              </Stack>
            </Box>

            {/* Earnings wallet */}
            <Box
              sx={{
                p: 1.55,
                borderRadius: "1.35rem",
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "0.8rem",
                  bgcolor: "#E7F318",
                  color: "#6C7300",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: "1rem" }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.15,
                  color: "rgba(255,255,255,0.76)",
                  fontSize: "0.76rem",
                }}
              >
                Total Earnings
              </Typography>
              <Typography
                sx={{
                  mt: 0.45,
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  lineHeight: 1.02,
                }}
              >
                {formatPrice(summary?.totalEarnings)}
              </Typography>

              <Box
                sx={{
                  mt: 1.2,
                  mb: 1.15,
                  height: 1,
                  bgcolor: "rgba(255,255,255,0.16)",
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.56rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Available
                  </Typography>
                  <Typography
                    sx={{ mt: 0.3, fontSize: "1.2rem", fontWeight: 800 }}
                  >
                    {formatPrice(summary?.availableEarnings)}
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/customer/referrals/earnings"
                  variant="contained"
                  sx={{
                    minHeight: 34,
                    px: 1.25,
                    borderRadius: "0.8rem",
                    bgcolor: "#FFFFFF",
                    color: "#0E56C8",
                    boxShadow: "none",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#F0F5FF" },
                  }}
                >
                  View Earnings
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              mt: 1.55,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.35,
            }}
          >
            <StatCard
              icon={<MarkEmailReadOutlinedIcon sx={{ fontSize: "1rem" }} />}
              iconBg="#E8F0FF"
              iconTone="#4F89FF"
              value={String(summary?.invitesSent ?? 0)}
              label="Invites sent"
            />
            <StatCard
              icon={<VerifiedRoundedIcon sx={{ fontSize: "1rem" }} />}
              iconBg="#E8FAEF"
              iconTone="#177D45"
              value={String(summary?.successfulReferrals ?? 0)}
              label="Successful referrals"
            />
            <StatCard
              icon={<PendingActionsRoundedIcon sx={{ fontSize: "1rem" }} />}
              iconBg="#F4F1C9"
              iconTone="#8B8600"
              value={String(summary?.pendingReferrals ?? 0)}
              label="Pending referrals"
            />
          </Box>

          {/* Quick share */}
          <Box sx={{ mt: 1.8 }}>
            <Typography
              sx={{ color: "#223146", fontSize: "1.1rem", fontWeight: 800 }}
            >
              Quick Share
            </Typography>
            <Box
              sx={{
                mt: 1.2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.2,
              }}
            >
              {quickShareItems.map((item) => (
                <QuickShareRow key={item.label} {...item} />
              ))}
            </Box>
          </Box>

          {/* Recent activity */}
          <Box sx={{ mt: 2.05 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ color: "#223146", fontSize: "1.1rem", fontWeight: 800 }}
              >
                Recent Activity
              </Typography>
              <Button
                component={RouterLink}
                to="/customer/referrals/earnings"
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "none",
                  minWidth: 0,
                  px: 0,
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                View All
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 1.15,
                borderRadius: "1.25rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                overflow: "hidden",
              }}
            >
              {activityItems.length === 0 ? (
                <Box sx={{ px: 1.35, py: 2 }}>
                  <RedeemRoundedIcon
                    sx={{ color: "#C8D0DC", fontSize: "1.5rem", mb: 0.5 }}
                  />
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                    }}
                  >
                    No referral activity yet
                  </Typography>
                  <Typography
                    sx={{ mt: 0.3, color: "#647387", fontSize: "0.76rem" }}
                  >
                    Share your code to invite your first friend.
                  </Typography>
                </Box>
              ) : (
                activityItems.map((item, index) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1.2}
                    sx={{
                      px: 1.35,
                      py: 1.2,
                      borderTop:
                        index === 0
                          ? "none"
                          : "1px solid rgba(232,237,244,0.9)",
                    }}
                  >
                    <Stack direction="row" spacing={0.95} alignItems="center">
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: item.avatarColor,
                          fontSize: "0.82rem",
                        }}
                      >
                        {item.initial}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            color: "#223146",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.15,
                            color: "#7F8A9B",
                            fontSize: "0.68rem",
                          }}
                        >
                          {item.detail}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography
                        sx={{
                          color: item.tone,
                          fontSize: "0.92rem",
                          fontWeight: 800,
                        }}
                      >
                        {item.amount}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.12,
                          color: "#98A3B2",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.rewardLabel}
                      </Typography>
                    </Box>
                  </Stack>
                ))
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

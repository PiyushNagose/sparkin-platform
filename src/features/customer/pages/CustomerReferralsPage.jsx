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
import { buildReferralUrl } from "@/features/customer/referrals/referralTracking";

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
        p: { xs: 1.4, md: 1.8 },
        borderRadius: "1.35rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 6px 18px rgba(16,29,51,0.05)",
        textAlign: "center",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 28px rgba(16,29,51,0.09)",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          mx: "auto",
          borderRadius: "50%",
          bgcolor: iconBg,
          color: iconTone,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 4px 12px ${iconBg}`,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          mt: 1.2,
          color: "#18253A",
          fontSize: { xs: "1.8rem", md: "2rem" },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ mt: 0.5, color: "#647387", fontSize: "0.74rem", fontWeight: 600 }}>
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
  actionLabel,
  onClick,
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: "1.35rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 6px 20px rgba(16,29,51,0.05)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 1.6,
        minHeight: 148,
        transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 16px 36px rgba(16,29,51,0.1)",
          borderColor: iconTone,
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "1rem",
          bgcolor: iconBg,
          color: iconTone,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {/* clone icon at larger size */}
        {icon}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800, lineHeight: 1.2 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{ mt: 0.45, color: "#8A96A8", fontSize: "0.72rem", lineHeight: 1.5 }}
          noWrap
        >
          {description}
        </Typography>
      </Box>

      {/* Action row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: iconTone,
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.02em",
          }}
        >
          {actionLabel || "Tap to share →"}
        </Typography>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: iconBg,
            color: iconTone,
            display: "grid",
            placeItems: "center",
          }}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: "1rem" }} />
        </Box>
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
  const [codeCopied, setCodeCopied] = useState(false);

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
  const rewardAmountLabel = formatPrice(summary?.rewardAmount || 0);
  const friendDiscountLabel = formatPrice(summary?.friendDiscountAmount || 0);

  async function copyReferralLink() {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(buildReferralUrl(summary.referralLink));
      setNotice("Referral link copied to clipboard.");
    } catch {
      setNotice("Could not copy — please copy the link manually.");
    }
  }

  async function copyReferralCode() {
    if (!summary?.referralCode) return;
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function copyReferralLinkForChannel(channel) {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(
        `${buildReferralUrl(summary.referralLink)}?channel=${channel}`,
      );
      setNotice(`${channel === "qr" ? "QR" : "Referral"} link copied to clipboard.`);
    } catch {
      setNotice("Could not copy the referral link.");
    }
  }

  async function shareReferral() {
    if (!summary?.referralLink) return;
    const referralUrl = buildReferralUrl(summary.referralLink);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sparkin Solar referral",
          text: "Go solar with Sparkin and use my referral link for a discount.",
          url: referralUrl,
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
    const referralUrl = `${buildReferralUrl(summary.referralLink)}?channel=whatsapp`;
    const msg = `Hey! I'm saving on electricity with Sparkin Solar. Use my referral link: ${referralUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const quickShareItems = [
    {
      label: "WhatsApp",
      description: "Send directly to contacts",
      actionLabel: "Open WhatsApp →",
      icon: <WhatsAppIcon sx={{ fontSize: "1.4rem" }} />,
      iconBg: "#DDF7E8",
      iconTone: "#177D45",
      onClick: openWhatsApp,
    },
    {
      label: "Copy Link",
      description:
        buildReferralUrl(summary?.referralLink || "").replace(/^https?:\/\//, "") || "Link unavailable",
      actionLabel: "Copy to clipboard →",
      icon: <LinkRoundedIcon sx={{ fontSize: "1.4rem" }} />,
      iconBg: "#EEF4FF",
      iconTone: "#0E56C8",
      onClick: copyReferralLink,
    },
    {
      label: "QR Code",
      description: "Download for print or share",
      actionLabel: "Copy QR link →",
      icon: <QrCode2RoundedIcon sx={{ fontSize: "1.4rem" }} />,
      iconBg: "#F2F5F8",
      iconTone: "#647387",
      onClick: () => copyReferralLinkForChannel("qr"),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
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
            Refer &amp; Earn
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
            px: 1.35,
            py: 0.7,
            borderRadius: "0.9rem",
            bgcolor: "#E7F318",
            color: "#4A5800",
            fontSize: "0.76rem",
            fontWeight: 900,
            lineHeight: 1,
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(231,243,24,0.35)",
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: "0.95rem" }} />
          Earn {rewardAmountLabel} per referral
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
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "1.65fr 0.95fr" },
              gap: 1.8,
            }}
          >
            {/* Referral code card */}
            <Box
              sx={{
                p: 2.2,
                borderRadius: "1.5rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 8px 24px rgba(16,29,51,0.06)",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.9,
                  py: 0.35,
                  borderRadius: "0.5rem",
                  bgcolor: "#EEF4FF",
                  color: "#0E56C8",
                  fontSize: "0.58rem",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  mb: 1.2,
                }}
              >
                Personal Code
              </Box>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: "1.55rem",
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                Spark your network
              </Typography>
              <Typography
                sx={{
                  mt: 0.6,
                  maxWidth: 400,
                  color: "#647387",
                  fontSize: "0.84rem",
                  lineHeight: 1.7,
                }}
              >
                Share this code with friends. They get a {friendDiscountLabel} discount, and
                you earn {rewardAmountLabel} instantly when they sign up.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2}
                sx={{ mt: 2.2 }}
              >
                {/* Code box */}
                <Box
                  onClick={copyReferralCode}
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    px: 1.6,
                    py: 1.2,
                    borderRadius: "1.1rem",
                    bgcolor: "#F4F7FB",
                    border: "2px dashed rgba(14,86,200,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                    "&:hover": {
                      borderColor: "#0E56C8",
                      bgcolor: "#EEF4FF",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#0E56C8",
                      fontSize: { xs: "1.5rem", md: "1.8rem" },
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      lineHeight: 1,
                    }}
                  >
                    {summary?.referralCode || "—"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      color: codeCopied ? "#177D45" : "#7F8A9B",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                  >
                    <ContentCopyRoundedIcon sx={{ fontSize: "1rem" }} />
                    {codeCopied ? "Copied!" : "Copy"}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={shareReferral}
                  sx={{
                    minHeight: 52,
                    px: 2.2,
                    borderRadius: "1.1rem",
                    bgcolor: "#0E56C8",
                    boxShadow: "0 12px 28px rgba(14,86,200,0.28)",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#0B49AD", boxShadow: "0 16px 32px rgba(14,86,200,0.32)" },
                  }}
                >
                  Share Now
                </Button>
              </Stack>
            </Box>

            {/* Earnings wallet */}
            <Box
              sx={{
                borderRadius: "1.5rem",
                background: "linear-gradient(145deg, #0E56C8 0%, #1A3A8F 100%)",
                color: "#FFFFFF",
                boxShadow: "0 16px 40px rgba(14,86,200,0.28)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 220,
              }}
            >
              {/* decorative circles — purely visual, no overflow clip needed */}
              <Box
                sx={{
                  position: "absolute",
                  top: -24,
                  right: -24,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 30,
                  right: 40,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  pointerEvents: "none",
                }}
              />

              {/* Top section */}
              <Box sx={{ p: 2.2, pb: 0, position: "relative", zIndex: 1 }}>
                {/* Icon + label row */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.6 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "0.9rem",
                      bgcolor: "#E7F318",
                      color: "#4A5800",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: "1.15rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Earnings
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: "2.6rem",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatPrice(summary?.totalEarnings)}
                </Typography>
              </Box>

              {/* Bottom available + withdraw — sits on a slightly darker strip */}
              <Box
                sx={{
                  mt: "auto",
                  mx: 1.5,
                  mb: 1.5,
                  p: 1.4,
                  borderRadius: "1rem",
                  bgcolor: "rgba(0,0,0,0.22)",
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      mb: 0.3,
                    }}
                  >
                    Available to Withdraw
                  </Typography>
                  <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, lineHeight: 1 }}>
                    {formatPrice(summary?.availableEarnings)}
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/customer/referrals/earnings"
                  variant="contained"
                  sx={{
                    minHeight: 38,
                    px: 1.6,
                    borderRadius: "0.85rem",
                    bgcolor: "#FFFFFF",
                    color: "#0E56C8",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    textTransform: "none",
                    flexShrink: 0,
                    "&:hover": { bgcolor: "#EEF4FF" },
                  }}
                >
                  Withdraw
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              mt: 1.8,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
              },
              gap: 1.4,
            }}
          >
            <StatCard
              icon={<MarkEmailReadOutlinedIcon sx={{ fontSize: "1.1rem" }} />}
              iconBg="#E8F0FF"
              iconTone="#4F89FF"
              value={String(summary?.invitesSent ?? 0)}
              label="Invites sent"
            />
            <StatCard
              icon={<VerifiedRoundedIcon sx={{ fontSize: "1.1rem" }} />}
              iconBg="#E8FAEF"
              iconTone="#177D45"
              value={String(summary?.successfulReferrals ?? 0)}
              label="Successful referrals"
            />
            <StatCard
              icon={<PendingActionsRoundedIcon sx={{ fontSize: "1.1rem" }} />}
              iconBg="#FFF4D6"
              iconTone="#A05C00"
              value={String(summary?.pendingReferrals ?? 0)}
              label="Pending referrals"
            />
          </Box>

          {/* Quick share */}
          <Box sx={{ mt: 2.2 }}>
            <Typography
              sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800, mb: 1.3 }}
            >
              Quick Share
            </Typography>
            <Box
              sx={{
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
          <Box sx={{ mt: 2.4 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.3 }}
            >
              <Typography
                sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800 }}
              >
                Recent Activity
              </Typography>
              <Button
                component={RouterLink}
                to="/customer/referrals/earnings"
                sx={{
                  color: "#0E56C8",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  textTransform: "none",
                  minWidth: 0,
                  px: 0,
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                View All
              </Button>
            </Stack>

            <Box
              sx={{
                borderRadius: "1.35rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 8px 24px rgba(16,29,51,0.05)",
                overflow: "hidden",
              }}
            >
              {activityItems.length === 0 ? (
                <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      bgcolor: "#F2F5F8",
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                      mb: 1.2,
                    }}
                  >
                    <RedeemRoundedIcon sx={{ color: "#B4BECC", fontSize: "1.5rem" }} />
                  </Box>
                  <Typography sx={{ color: "#223146", fontSize: "0.9rem", fontWeight: 700 }}>
                    No referral activity yet
                  </Typography>
                  <Typography sx={{ mt: 0.4, color: "#647387", fontSize: "0.76rem" }}>
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
                      px: 1.6,
                      py: 1.35,
                      borderTop: index === 0 ? "none" : "1px solid rgba(232,237,244,0.9)",
                      transition: "background 0.12s",
                      "&:hover": { bgcolor: "#F8FAFD" },
                    }}
                  >
                    <Stack direction="row" spacing={1.1} alignItems="center">
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: item.avatarColor,
                          fontSize: "0.84rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.initial}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{ color: "#223146", fontSize: "0.88rem", fontWeight: 700 }}
                        >
                          {item.name}
                        </Typography>
                        <Typography sx={{ mt: 0.1, color: "#7F8A9B", fontSize: "0.7rem" }}>
                          {item.detail}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography
                        sx={{ color: item.tone, fontSize: "0.94rem", fontWeight: 800 }}
                      >
                        {item.amount}
                      </Typography>
                      <Box
                        sx={{
                          mt: 0.3,
                          display: "inline-flex",
                          px: 0.7,
                          py: 0.2,
                          borderRadius: "999px",
                          bgcolor: item.tone === "#239654" ? "#E8FAEF" : item.tone === "#0E56C8" ? "#EEF4FF" : "#F2F5F8",
                          color: item.tone,
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.rewardLabel}
                      </Box>
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

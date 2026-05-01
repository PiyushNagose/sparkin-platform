import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { referralsApi } from "@/features/customer/api/referralsApi";
import customerShareEarnHeroPlaceholder from "@/shared/assets/images/customer/referrals/customer-share-earn-hero-placeholder.png";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// ─── static content ───────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    Icon: CampaignRoundedIcon,
    iconTone: "#0E56C8",
    title: "1. Send Invite",
    description:
      "Share your unique link via WhatsApp or email to your friends and family.",
  },
  {
    Icon: SolarPowerRoundedIcon,
    iconTone: "#0E56C8",
    title: "2. They Go Solar",
    description:
      "Once they book a site visit and complete the installation through Sparkin.",
  },
  {
    Icon: AccountBalanceWalletOutlinedIcon,
    iconTone: "#177D45",
    title: "3. You Get Paid",
    description:
      "The referral bonus is credited directly to your bank account within 15 days.",
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

function StepCard({ Icon, iconTone, title, description }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.2rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
      }}
    >
      <Box sx={{ color: iconTone, mb: 1 }}>
        <Icon sx={{ fontSize: "1.1rem" }} />
      </Box>
      <Typography
        sx={{ color: "#223146", fontSize: "0.92rem", fontWeight: 800 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{ mt: 0.5, color: "#647387", fontSize: "0.76rem", lineHeight: 1.7 }}
      >
        {description}
      </Typography>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CustomerShareEarnPage() {
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      setIsLoading(true);
      setError("");

      try {
        const result = await referralsApi.getDashboard();
        if (!active) return;
        setSummary(result.summary);
      } catch (apiError) {
        if (active)
          setError(
            apiError?.response?.data?.message ||
              "Could not load referral details.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function copyReferralLink() {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      setSuccess("Referral link copied to clipboard.");
    } catch {
      setSuccess("Could not copy — please copy the link manually.");
    }
  }

  function shareOnWhatsApp() {
    if (!summary?.referralLink) return;
    const msg = `Hey! I'm saving on electricity with Sparkin Solar. Use my referral link: ${summary.referralLink}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function submitReferral() {
    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError("Please enter your friend's name.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await referralsApi.createReferral({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
      });
      setSummary(result.summary);
      setForm({ fullName: "", email: "", phoneNumber: "" });
      setSuccess(`Invite sent to ${result.referral.friend.fullName}.`);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Could not create referral invite.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    form.fullName.trim().length > 0 &&
    isValidEmail(form.email) &&
    !isSubmitting;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.95fr 1.15fr" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "2rem", md: "2.2rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            Share &{" "}
            <Box component="span" sx={{ color: "#0E56C8" }}>
              Earn
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 1.1,
              maxWidth: 360,
              color: "#5E6C7F",
              fontSize: "0.95rem",
              lineHeight: 1.75,
            }}
          >
            Invite friends using your referral link and help them transition to
            clean energy while you earn rewards.
          </Typography>
          <Button
            component={RouterLink}
            to="/customer/referrals/earnings"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{
              mt: 1.5,
              minHeight: 36,
              px: 1.35,
              borderRadius: "0.9rem",
              bgcolor: "#EEF4FF",
              color: "#0E56C8",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            View Earnings History
          </Button>
        </Box>

        <Box
          component="img"
          src={customerShareEarnHeroPlaceholder}
          alt="Share and earn"
          sx={{
            width: "100%",
            maxWidth: 470,
            justifySelf: { xs: "stretch", lg: "end" },
            height: { xs: 220, md: 280 },
            objectFit: "cover",
            borderRadius: "1.35rem",
            boxShadow: "0 18px 32px rgba(16,29,51,0.12)",
          }}
        />
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ mt: 2, py: 5, display: "grid", placeItems: "center" }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1.5, borderRadius: "0.9rem" }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mt: 1.5, borderRadius: "0.9rem" }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {!isLoading && (
        <>
          {/* Unique link */}
          <Box
            sx={{
              mt: 2,
              p: 1.45,
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{
                color: "#7F8A9B",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Your Unique Referral Link
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
              sx={{ mt: 1.1 }}
            >
              <Typography
                sx={{
                  color: "#0E56C8",
                  fontSize: { xs: "1rem", md: "1.35rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  wordBreak: "break-all",
                  flex: 1,
                }}
              >
                {summary?.referralLink?.replace("https://", "") ||
                  "Referral link unavailable"}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ flexShrink: 0 }}
              >
                <Button
                  startIcon={<ContentCopyRoundedIcon />}
                  onClick={copyReferralLink}
                  disabled={!summary?.referralLink}
                  sx={{
                    minHeight: 38,
                    px: 1.35,
                    borderRadius: "0.9rem",
                    bgcolor: "#EEF2F6",
                    color: "#223146",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={shareOnWhatsApp}
                  disabled={!summary?.referralLink}
                  sx={{
                    minHeight: 38,
                    px: 1.35,
                    borderRadius: "0.9rem",
                    bgcolor: "#25D366",
                    boxShadow: "0 12px 24px rgba(37,211,102,0.18)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1EB85A" },
                  }}
                >
                  Share on WhatsApp
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Create invite form */}
          <Box
            sx={{
              mt: 1.55,
              p: 1.45,
              borderRadius: "1.3rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Create Referral Invite
            </Typography>
            <Typography sx={{ mt: 0.3, color: "#7A8799", fontSize: "0.76rem" }}>
              Send a direct invite — your friend will receive an email with your
              referral link.
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              sx={{ mt: 1.2 }}
            >
              <TextField
                label="Friend's name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                size="small"
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
              />
              <TextField
                label="Friend's email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                size="small"
                fullWidth
                error={form.email.length > 0 && !isValidEmail(form.email)}
                helperText={
                  form.email.length > 0 && !isValidEmail(form.email)
                    ? "Enter a valid email"
                    : ""
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
              />
              <TextField
                label="Phone (optional)"
                value={form.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
                size="small"
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" } }}
              />
              <Button
                variant="contained"
                disabled={!canSubmit}
                onClick={submitReferral}
                sx={{
                  minHeight: 40,
                  px: 1.55,
                  flexShrink: 0,
                  borderRadius: "0.9rem",
                  bgcolor: "#0E56C8",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {isSubmitting ? "Sending…" : "Send Invite"}
              </Button>
            </Stack>
          </Box>

          {/* Reward info */}
          <Box
            sx={{
              mt: 1.55,
              p: 1.5,
              borderRadius: "1.3rem",
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
                  "radial-gradient(circle at 85% 50%, rgba(255,255,255,0.08), transparent 40%)",
                pointerEvents: "none",
              }}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1.5}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "0.82rem",
                    bgcolor: "rgba(255,255,255,0.16)",
                    display: "grid",
                    placeItems: "center",
                    mb: 1,
                  }}
                >
                  <CampaignRoundedIcon sx={{ fontSize: "0.95rem" }} />
                </Box>
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 800 }}>
                  Referral Rewards
                </Typography>
                <Typography
                  sx={{
                    mt: 0.45,
                    maxWidth: 380,
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.76rem",
                    lineHeight: 1.68,
                  }}
                >
                  Earn {formatPrice(summary?.rewardAmount || 5000)} for every
                  successful solar installation referred by you. Credited within
                  15 days of activation.
                </Typography>
              </Box>

              <Box
                sx={{ textAlign: { xs: "left", sm: "right" }, flexShrink: 0 }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "0.56rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Total Earned
                </Typography>
                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "2rem",
                    fontWeight: 800,
                    lineHeight: 1.02,
                  }}
                >
                  {formatPrice(summary?.totalEarnings)}
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    display: "inline-flex",
                    px: 0.78,
                    py: 0.34,
                    borderRadius: "999px",
                    bgcolor: "#E7F318",
                    color: "#6C7300",
                    fontSize: "0.56rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {summary?.successfulReferrals ?? 0} successful
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* How it works */}
          <Box
            sx={{
              mt: 1.75,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.35,
            }}
          >
            {HOW_IT_WORKS.map((item) => (
              <StepCard key={item.title} {...item} />
            ))}
          </Box>

          {/* Terms note */}
          <Typography
            sx={{
              mt: 2.1,
              textAlign: "center",
              color: "#6F7D8F",
              fontSize: "0.74rem",
            }}
          >
            Have questions?{" "}
            <Box
              component={RouterLink}
              to="/faq"
              sx={{ color: "#0E56C8", fontWeight: 600, textDecoration: "none" }}
            >
              Check our Referral FAQ
            </Box>
          </Typography>
        </>
      )}
    </Box>
  );
}

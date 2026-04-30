import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { NavLink } from "react-router-dom";
import { referralsApi } from "@/features/customer/api/referralsApi";
import customerShareEarnHeroPlaceholder from "@/shared/assets/images/customer/referrals/customer-share-earn-hero-placeholder.png";

const steps = [
  {
    icon: <CampaignRoundedIcon sx={{ fontSize: "1.1rem" }} />,
    iconTone: "#0E56C8",
    title: "1. Send Invite",
    description:
      "Share your unique link via WhatsApp or email to your friends and family.",
  },
  {
    icon: <SolarPowerRoundedIcon sx={{ fontSize: "1.1rem" }} />,
    iconTone: "#0E56C8",
    title: "2. They Go Solar",
    description:
      "Once they book a site visit and complete the installation through Sparkin.",
  },
  {
    icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
    iconTone: "#177D45",
    title: "3. You Get Paid",
    description:
      "The referral bonus is credited directly to your bank account within 15 days.",
  },
];

function StepCard({ item }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.2rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
      }}
    >
      <Box
        sx={{
          color: item.iconTone,
          display: "grid",
          placeItems: "start",
          mb: 1,
        }}
      >
        {item.icon}
      </Box>
      <Typography
        sx={{ color: "#223146", fontSize: "0.92rem", fontWeight: 800 }}
      >
        {item.title}
      </Typography>
      <Typography
        sx={{ mt: 0.5, color: "#647387", fontSize: "0.76rem", lineHeight: 1.7 }}
      >
        {item.description}
      </Typography>
    </Box>
  );
}

export default function CustomerShareEarnPage() {
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "" });
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
        if (active) setSummary(result.summary);
      } catch (apiError) {
        if (active) setError(apiError?.response?.data?.message || "Could not load referral details.");
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
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function copyReferralLink() {
    if (!summary?.referralLink) return;
    await navigator.clipboard.writeText(summary.referralLink);
    setSuccess("Referral link copied.");
  }

  function shareOnWhatsApp() {
    if (!summary?.referralLink) return;
    const message = `Go solar with Sparkin and use my referral link for a discount: ${summary.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  async function submitReferral() {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await referralsApi.createReferral({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber || null,
      });
      setSummary(result.summary);
      setForm({ fullName: "", email: "", phoneNumber: "" });
      setSuccess(`Referral invite created for ${result.referral.friend.fullName}.`);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not create referral invite.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
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
        </Box>

        <Box
          component="img"
          src={customerShareEarnHeroPlaceholder}
          alt="Share and earn solar placeholder"
          sx={{
            width: "100%",
            maxWidth: 470,
            justifySelf: { xs: "stretch", lg: "end" },
            height: { xs: 240, md: 300 },
            objectFit: "cover",
            borderRadius: "1.35rem",
            boxShadow: "0 18px 32px rgba(16,29,51,0.12)",
          }}
        />
      </Box>

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

      {!isLoading && success ? (
        <Alert severity="success" sx={{ mt: 1.5, borderRadius: "0.9rem" }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      ) : null}

      {!isLoading ? (
      <>
      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.95fr" },
          gap: 1.55,
        }}
      >
        <Box
          sx={{
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
            Your Unique Link
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
                fontSize: { xs: "1.15rem", md: "1.5rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                wordBreak: "break-all",
              }}
            >
              {summary?.referralLink?.replace("https://", "") || "Referral link unavailable"}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                startIcon={<ContentCopyRoundedIcon />}
                onClick={copyReferralLink}
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
                sx={{
                  minHeight: 38,
                  px: 1.35,
                  borderRadius: "0.9rem",
                  bgcolor: "#2FD45E",
                  boxShadow: "0 12px 24px rgba(47,212,94,0.18)",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                WhatsApp Share
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

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
        <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>
          Create Referral Invite
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ mt: 1.1 }}>
          <TextField
            label="Friend name"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Friend email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Phone optional"
            value={form.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            disabled={isSubmitting || !form.fullName.trim() || !form.email.trim()}
            onClick={submitReferral}
            sx={{
              minHeight: 40,
              px: 1.55,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isSubmitting ? "Creating..." : "Create Invite"}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 1.55,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.2fr 0.85fr" },
          gap: 1.55,
        }}
      >
        <Box
          sx={{
            p: 1.45,
            borderRadius: "1.3rem",
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
            <Typography
              sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}
            >
              Personalize Message
            </Typography>
            <EditNoteRoundedIcon sx={{ color: "#647387", fontSize: "1rem" }} />
          </Stack>

          <Box
            sx={{
              mt: 1.1,
              p: 1.3,
              minHeight: 120,
              borderRadius: "1rem",
              bgcolor: "#F3F6FB",
              color: "#5C687B",
              fontSize: "0.84rem",
              lineHeight: 1.72,
            }}
          >
            Hey! I'm saving thousands on my electricity bills with Sparkin
            Solar. You should check them out and get a referral discount too!
          </Box>

          <Typography sx={{ mt: 0.9, color: "#8A95A5", fontSize: "0.68rem" }}>
            Click above to edit the message before sharing.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: "1.3rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 16px 30px rgba(14,86,200,0.18)",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "0.82rem",
              bgcolor: "rgba(255,255,255,0.16)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <CampaignRoundedIcon sx={{ fontSize: "0.95rem" }} />
          </Box>

          <Typography sx={{ mt: 1.15, fontSize: "1.45rem", fontWeight: 800 }}>
            Referral Rewards
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              maxWidth: 250,
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.76rem",
              lineHeight: 1.68,
            }}
          >
            {
              `Earn ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(summary?.rewardAmount || 5000)} for every successful solar installation referred by you.`
            }
          </Typography>

          <Box
            sx={{
              mt: 1.55,
              mb: 1.15,
              height: 1,
              bgcolor: "rgba(255,255,255,0.16)",
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            spacing={1}
          >
            <Box>
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
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(summary?.totalEarnings || 0)}
              </Typography>
            </Box>
            <Box
              sx={{
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
              {summary?.successfulReferrals || 0} Referrals
            </Box>
          </Stack>
          <Button
            component={NavLink}
            to="/customer/referrals/earnings"
            variant="contained"
            sx={{
              mt: 1.15,
              minHeight: 34,
              px: 1.25,
              alignSelf: "flex-start",
              borderRadius: "0.8rem",
              bgcolor: "#FFFFFF",
              color: "#0E56C8",
              boxShadow: "none",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#FFFFFF", boxShadow: "none" },
            }}
          >
            View Earnings History
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.35,
        }}
      >
        {steps.map((item) => (
          <StepCard key={item.title} item={item} />
        ))}
      </Box>

      <Typography
        sx={{
          mt: 2.1,
          textAlign: "center",
          color: "#6F7D8F",
          fontSize: "0.74rem",
        }}
      >
        Have questions? Check our{" "}
        <Box component="span" sx={{ color: "#0E56C8", fontWeight: 600 }}>
          Referral Terms & Conditions
        </Box>
      </Typography>
      </>
      ) : null}
    </Box>
  );
}

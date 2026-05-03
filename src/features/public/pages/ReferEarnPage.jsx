import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { Link as RouterLink } from "react-router-dom";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";
import referralHeroImage from "@/shared/assets/images/customer/referrals/customer-share-earn-hero-placeholder.png";

const steps = [
  {
    title: "Share your link",
    text: "Invite friends, neighbours, or housing society members who are exploring rooftop solar.",
    icon: <IosShareRoundedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "They compare quotes",
    text: "Your referral gets access to verified vendors, savings estimates, and guided support.",
    icon: <SolarPowerOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    title: "You earn rewards",
    text: "When their installation milestone is verified, rewards are credited to your Sparkin wallet.",
    icon: <CurrencyRupeeRoundedIcon sx={{ fontSize: "1rem" }} />,
  },
];

const rewards = [
  { value: "Rs 2,500", label: "successful home referral" },
  { value: "Rs 10,000", label: "society bulk referral" },
  { value: "7 days", label: "average reward review" },
];

const history = [
  ["Priya K.", "Quote comparison started", "Active"],
  ["Green Heights RWA", "Site survey completed", "Review"],
  ["Amit S.", "Installation verified", "Paid"],
];

export default function ReferEarnPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageYCompact,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 64%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Grid
          container
          spacing={{ xs: 3.2, md: 4.2 }}
          alignItems="center"
          sx={{ mb: { xs: 5.8, md: 6.8 } }}
          className={layoutStyles.revealUp}
        >
          <Grid size={{ xs: 12, md: 6.2 }}>
            <Chip
              label="Refer & Earn"
              sx={{
                height: 30,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#566000",
                fontSize: "0.64rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                mt: 1.25,
                ...publicTypography.heroTitle,
                color: "#18253A",
                maxWidth: 700,
              }}
            >
              Help someone go solar and earn meaningful rewards.
            </Typography>
            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 540,
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
              }}
            >
              Share Sparkin with people who want transparent solar quotes. We
              guide them through the journey, and you get rewarded when they
              install with a verified partner.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  minHeight: 46,
                  px: 2.3,
                  borderRadius: "0.72rem",
                  fontSize: "0.86rem",
                  fontWeight: 800,
                  textTransform: "none",
                  background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                  boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                }}
              >
                Start Referring
              </Button>
              <Button
                component={RouterLink}
                to="/calculator"
                variant="contained"
                sx={{
                  minHeight: 46,
                  px: 2.1,
                  borderRadius: "0.72rem",
                  bgcolor: "white",
                  color: "#18253A",
                  border: "1px solid #DCE6F3",
                  boxShadow: "0 10px 24px rgba(16,29,51,0.05)",
                  fontSize: "0.86rem",
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Share Calculator
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5.8 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                minHeight: { xs: 320, md: 390 },
                borderRadius: "2rem",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.04) 0%, rgba(7,22,55,0.46) 100%), url(${referralHeroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 24px 52px rgba(16,29,51,0.14)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: 24,
                  p: 2.15,
                  borderRadius: "1.3rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  boxShadow: "0 14px 30px rgba(12,29,56,0.18)",
                }}
              >
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "1rem",
                      bgcolor: "#DDF8E8",
                      color: "#12A765",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <CardGiftcardRoundedIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#18253A", fontWeight: 800 }}>
                      SPARKIN-FRIEND
                    </Typography>
                    <Typography sx={{ mt: 0.25, color: "#6E7B8E", fontSize: "0.82rem" }}>
                      Personal code ready to share.
                    </Typography>
                  </Box>
                  <ContentCopyRoundedIcon sx={{ ml: "auto", color: "#0E56C8" }} />
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {rewards.map((reward) => (
            <Grid key={reward.label} size={{ xs: 12, md: 4 }}>
              <Box
                className={layoutStyles.interactiveSurface}
                sx={{
                  p: { xs: 1.8, md: 2.1 },
                  borderRadius: "1.25rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "#0E56C8", fontSize: { xs: "1.45rem", md: "1.8rem" }, fontWeight: 800 }}>
                  {reward.value}
                </Typography>
                <Typography sx={{ mt: 0.4, color: "#6E7B8E", fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {reward.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2, md: 2.4 }} sx={{ mb: { xs: 5.8, md: 6.8 } }}>
          {steps.map((step) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }}>
              <Box
                className={`${layoutStyles.interactiveSurface} ${layoutStyles.revealUpSlow}`}
                sx={{
                  height: "100%",
                  minHeight: 220,
                  p: { xs: 2.1, md: 2.35 },
                  borderRadius: "1.45rem",
                  bgcolor: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 12px 28px rgba(16,29,51,0.05)",
                }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: "0.9rem", bgcolor: "#EAF1FF", color: "#0E56C8", display: "grid", placeItems: "center", mb: 1.35 }}>
                  {step.icon}
                </Box>
                <Typography sx={{ color: "#18253A", fontSize: "1.05rem", fontWeight: 800 }}>
                  {step.title}
                </Typography>
                <Typography sx={{ mt: 0.85, color: "#6E7B8E", fontSize: "0.88rem", lineHeight: 1.72 }}>
                  {step.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={{ xs: 2.5, md: 3.5 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              className={layoutStyles.interactiveSurface}
              sx={{
                height: "100%",
                p: { xs: 2.5, md: 3 },
                borderRadius: "1.8rem",
                background: "linear-gradient(180deg, #121C32 0%, #182641 100%)",
                color: "white",
                boxShadow: "0 22px 46px rgba(15,22,33,0.18)",
              }}
            >
              <TaskAltRoundedIcon sx={{ color: "#DDF509", fontSize: "2rem" }} />
              <Typography sx={{ mt: 1.55, fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                Track every referral from invite to payout.
              </Typography>
              <Typography sx={{ mt: 1.05, color: "rgba(235,241,248,0.72)", fontSize: "0.9rem", lineHeight: 1.76 }}>
                Keep visibility into quote status, installation milestones, and
                reward approvals from one clean referral dashboard.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                height: "100%",
                p: { xs: 2.25, md: 2.8 },
                borderRadius: "1.8rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(223,231,241,0.92)",
              }}
            >
              <Typography sx={{ color: "#18253A", fontSize: "1.18rem", fontWeight: 800 }}>
                Referral activity
              </Typography>
              <Stack spacing={1.1} sx={{ mt: 1.8 }}>
                {history.map(([name, status, badge]) => (
                  <Stack
                    key={name}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1}
                    sx={{
                      p: 1.35,
                      borderRadius: "1rem",
                      bgcolor: "#F8FAFD",
                      border: "1px solid #E9EEF6",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 800 }}>
                        {name}
                      </Typography>
                      <Typography sx={{ mt: 0.25, color: "#7A879A", fontSize: "0.78rem" }}>
                        {status}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "fit-content",
                        alignSelf: { xs: "flex-start", sm: "center" },
                        px: 0.9,
                        py: 0.35,
                        borderRadius: 999,
                        bgcolor: badge === "Paid" ? "#DDF8E8" : "#EAF1FF",
                        color: badge === "Paid" ? "#12A765" : "#0E56C8",
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {badge}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


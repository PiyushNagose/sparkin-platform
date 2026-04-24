import { Box, Button, Stack, Typography } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import { NavLink } from "react-router-dom";
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
              sparkin.in/ref/user123
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                startIcon={<ContentCopyRoundedIcon />}
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
              "Earn \u20B95,000 for every successful solar installation referred by you."
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
                {"\u20B925,000"}
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
              5 Referrals
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
    </Box>
  );
}

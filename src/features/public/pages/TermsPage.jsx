import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import layoutStyles from "@/app/layouts/PublicLayout.module.css";

const responsibilityCards = [
  {
    title: "Account Security",
    text: "Users are responsible for maintaining the confidentiality of their account credentials. Any activity occurring under your account is your responsibility.",
  },
  {
    title: "Accuracy of Data",
    text: "You must provide accurate, current, and complete information during the request and quote process. We reserve the right to reject false or misleading submissions.",
  },
];

const bookingCards = [
  {
    title: "Solar Calculator Estimates",
    text: "Estimates provided by the Sparkin Solar Calculator are for informational purposes only. Final pricing is determined once your property is assessed by a verified vendor.",
  },
  {
    title: "Payment Processing",
    text: "Sparkin collects service and platform fees where applicable. Payments are only released to service partners after verified completion milestones are achieved.",
  },
];

const vendorTerms = [
  { label: "Vendor Vetting", icon: <VerifiedOutlinedIcon sx={{ fontSize: "1rem" }} /> },
  { label: "Direct Contracts", icon: <GavelRoundedIcon sx={{ fontSize: "1rem" }} /> },
  { label: "Dispute Support", icon: <BalanceRoundedIcon sx={{ fontSize: "1rem" }} /> },
];

export default function TermsPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth={false} disableGutters className={layoutStyles.publicContentContainer}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={{ xs: 2.2, md: 3.2 }}
          sx={{ mb: { xs: 5.6, md: 6.6 } }}
          className={layoutStyles.revealUp}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Box
              sx={{
                width: "fit-content",
                px: 0.75,
                py: 0.32,
                borderRadius: 999,
                bgcolor: "#E5F20D",
                color: "#566000",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Legal Framework
            </Box>

            <Typography
              variant="h1"
              sx={{
                mt: 1.2,
                ...publicTypography.heroTitle,
                color: "#18253A",
              }}
            >
              Terms &amp; Conditions
            </Typography>

            <Typography
              sx={{
                mt: 1.1,
                color: "#6E7B8E",
                ...publicTypography.body,
                maxWidth: { xs: "100%", md: 440 },
              }}
            >
              Last updated: May 3, 2026. Please read these terms carefully before
              using our platform.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ color: "#5F6D82", pt: { xs: 0.4, md: 1.25 } }}
          >
            <ReceiptLongRoundedIcon sx={{ fontSize: "1rem", color: "#0E56C8" }} />
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
              Binding agreement
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={{ xs: 3.2, md: 4.2 }}>
          <Box
            className={layoutStyles.interactiveSurface}
            sx={{
              p: { xs: 2.2, md: 3.1 },
              borderRadius: "1.65rem",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(223,231,241,0.92)",
              boxShadow: "0 18px 40px rgba(16,29,51,0.07)",
            }}
          >
            <Typography
              sx={{
                color: "#BCC4D3",
                fontSize: { xs: "1.35rem", md: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              01{" "}
              <Box component="span" sx={{ color: "#18253A", fontSize: { xs: "1.02rem", md: "1.15rem" }, ml: 0.5 }}>
                Introduction
              </Box>
            </Typography>

            <Typography sx={{ mt: 2.1, color: "#6E7B8E", fontSize: { xs: "0.88rem", md: "0.92rem" }, lineHeight: 1.86 }}>
              Welcome to Sparkin Solar. These Terms and Conditions govern your use
              of our digital platform, connecting homeowners and businesses with
              renewable energy solutions and certified solar vendors.
            </Typography>
            <Typography sx={{ mt: 1.35, color: "#6E7B8E", fontSize: { xs: "0.88rem", md: "0.92rem" }, lineHeight: 1.86 }}>
              By accessing or using Sparkin, you agree to be bound by these terms.
              If you disagree with any part of these terms, you may not access the
              service. We provide a marketplace for solar exploration, calculation,
              and connection, acting as a facilitator between users and service
              providers.
            </Typography>

            <Box
              sx={{
                mt: 2.2,
                p: { xs: 1.2, md: 1.35 },
                borderRadius: "0.95rem",
                bgcolor: "#F6F8FC",
                borderLeft: "3px solid #BAC7DB",
              }}
            >
              <Typography sx={{ color: "#3C4759", fontSize: { xs: "0.76rem", md: "0.8rem" }, fontStyle: "italic", lineHeight: 1.78 }}>
                &quot;We reserve the exclusive right to refuse any energy through
                transparency and technological precision.&quot;
              </Typography>
            </Box>
          </Box>

          <Box
            className={layoutStyles.interactiveSurface}
            sx={{
              p: { xs: 2.2, md: 3.1 },
              borderRadius: "1.65rem",
              bgcolor: "rgba(248,250,253,0.92)",
              border: "1px solid rgba(230,236,244,0.9)",
            }}
          >
            <Typography
              sx={{
                color: "#D0D6E1",
                fontSize: { xs: "1.35rem", md: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              02{" "}
              <Box component="span" sx={{ color: "#18253A", fontSize: { xs: "1.02rem", md: "1.15rem" }, ml: 0.5 }}>
                User Responsibilities
              </Box>
            </Typography>

            <Grid container spacing={{ xs: 2.2, md: 2.8 }} sx={{ mt: 0.45 }}>
              {responsibilityCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                  <Box sx={{ pt: { xs: 0.6, md: 1.6 } }}>
                    <Typography sx={{ color: "#0E56C8", fontSize: { xs: "0.88rem", md: "0.92rem" }, fontWeight: 800 }}>
                      {card.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.8,
                        color: "#6E7B8E",
                        fontSize: { xs: "0.86rem", md: "0.9rem" },
                        lineHeight: 1.8,
                        maxWidth: 440,
                      }}
                    >
                      {card.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            className={layoutStyles.interactiveSurface}
            sx={{
              p: { xs: 2.2, md: 3.1 },
              borderRadius: "1.65rem",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(223,231,241,0.92)",
            }}
          >
            <Typography
              sx={{
                color: "#D0D6E1",
                fontSize: { xs: "1.35rem", md: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              03{" "}
              <Box component="span" sx={{ color: "#18253A", fontSize: { xs: "1.02rem", md: "1.15rem" }, ml: 0.5 }}>
                Booking and Payments
              </Box>
            </Typography>

            <Grid container spacing={{ xs: 2.2, md: 2.5 }} sx={{ mt: 0.55 }}>
              {bookingCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 1.8 },
                      borderRadius: "1rem",
                      bgcolor: "#FBFCFE",
                      border: "1px solid #EEF2F7",
                    }}
                  >
                    <Typography sx={{ color: "#18253A", fontSize: { xs: "0.88rem", md: "0.92rem" }, fontWeight: 800 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ mt: 0.7, color: "#6E7B8E", fontSize: { xs: "0.82rem", md: "0.86rem" }, lineHeight: 1.8 }}>
                      {card.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: { xs: 2.4, md: 2.6 },
                p: { xs: 1.2, md: 1.3 },
                borderRadius: "0.95rem",
                bgcolor: "#EEF6EF",
                borderLeft: "3px solid #B5D7B7",
              }}
            >
              <Typography sx={{ color: "#607768", fontSize: { xs: "0.76rem", md: "0.8rem" }, lineHeight: 1.72 }}>
                Note: Transactions fees may vary depending on your region and
                selected payment method. All currency conversions are handled at
                the time of transaction.
              </Typography>
            </Box>
          </Box>

          <Box
            className={layoutStyles.interactiveSurface}
            sx={{
              p: { xs: 2.2, md: 3.1 },
              borderRadius: "1.65rem",
              bgcolor: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(223,231,241,0.92)",
            }}
          >
            <Typography
              sx={{
                color: "#D0D6E1",
                fontSize: { xs: "1.35rem", md: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              04{" "}
              <Box component="span" sx={{ color: "#18253A", fontSize: { xs: "1.02rem", md: "1.15rem" }, ml: 0.5 }}>
                Vendor Terms
              </Box>
            </Typography>

            <Typography sx={{ mt: 1.9, color: "#6E7B8E", fontSize: { xs: "0.86rem", md: "0.9rem" }, lineHeight: 1.85, maxWidth: 930 }}>
              Sparkin acts as an intermediary marketplace. While we vet all solar
              vendors for basic certifications, the final contract for
              installation and maintenance lies between the user and the vendor.
            </Typography>

            <Grid container spacing={{ xs: 1.8, md: 2.3 }} sx={{ mt: 2.4 }}>
              {vendorTerms.map((item) => (
                <Grid key={item.label} size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      p: { xs: 1.45, md: 1.7 },
                      borderRadius: "1rem",
                      bgcolor: "#FBFCFE",
                      border: "1px solid #EEF2F7",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "0.85rem",
                        bgcolor: "#F0F4A8",
                        color: "#666A00",
                        display: "grid",
                        placeItems: "center",
                        mx: "auto",
                        mb: 1.05,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography sx={{ color: "#4B5567", fontSize: { xs: "0.8rem", md: "0.84rem" }, fontWeight: 700 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            className={layoutStyles.interactiveSurface}
            sx={{
              p: { xs: 2.35, md: 3.3 },
              borderRadius: "1.65rem",
              background:
                "radial-gradient(circle at 88% 18%, rgba(38,94,210,0.22) 0%, rgba(38,94,210,0) 22%), linear-gradient(180deg, #1A1F24 0%, #161B1F 100%)",
              color: "white",
              boxShadow: "0 22px 46px rgba(15,22,33,0.18)",
            }}
          >
            <Typography
              sx={{
                color: "#8E98A9",
                fontSize: { xs: "1.35rem", md: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              05{" "}
              <Box component="span" sx={{ color: "white", fontSize: { xs: "1.02rem", md: "1.15rem" }, ml: 0.5 }}>
                Liability
              </Box>
            </Typography>

            <Typography sx={{ mt: 1.9, color: "rgba(235,241,248,0.72)", fontSize: { xs: "0.86rem", md: "0.9rem" }, lineHeight: 1.86 }}>
              Sparkin shall not be liable for any indirect, incidental, special,
              consequential or punitive damages, including without limitation, loss
              of profits, data, use, goodwill, or other intangible losses,
              resulting from your access to or use of or inability to access or use
              the platform.
            </Typography>
            <Typography sx={{ mt: 1.35, color: "rgba(235,241,248,0.72)", fontSize: { xs: "0.86rem", md: "0.9rem" }, lineHeight: 1.86 }}>
              We do not warrant the quality, safety, legality of third-party
              products or services advertised by vendors on our platform. All
              installations are subject to local regulations and manufacturer
              warranties.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.4}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mt: 2.7 }}
            >
              <Button
                variant="contained"
                sx={{
                  minWidth: 138,
                  minHeight: 40,
                  borderRadius: "0.7rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#E6F10B",
                  color: "#1C1F23",
                  boxShadow: "none",
                }}
              >
                Download PDF Copy
              </Button>
              <Typography sx={{ color: "rgba(255,255,255,0.46)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                Ref: SPK-TC-V2-01
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}


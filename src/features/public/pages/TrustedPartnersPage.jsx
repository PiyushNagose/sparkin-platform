import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import trustedPartnersHero from "@/shared/assets/images/public/partners/trusted-partners-hero-placeholder.png";
import luminaPartner from "@/shared/assets/images/public/partners/lumina-partner-placeholder.png";
import voltPartner from "@/shared/assets/images/public/partners/volt-partner-placeholder.png";
import ecoSmartPartner from "@/shared/assets/images/public/partners/ecosmart-partner-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const verificationLogos = [
  "Tata Power",
  "Adani Solar",
  "Renew",
  "Suzlon",
  "Loom Solar",
];

const performers = [
  {
    name: "Lumina Systems",
    rating: "4.9",
    badge: "Trusted Partner",
    location: "Pune, Maharashtra",
    expertise: "12 Years Experience",
    image: luminaPartner,
    accent: "#F2F60E",
  },
  {
    name: "Volt Horizon",
    rating: "5.0",
    badge: "Curated Tier",
    location: "Surat, Gujarat",
    expertise: "9 Years Experience",
    image: voltPartner,
    accent: "#27D87F",
  },
  {
    name: "EcoSmart Energy",
    rating: "4.8",
    badge: "Fastest Onboarding",
    location: "Jaipur, Rajasthan",
    expertise: "11 Years Experience",
    image: ecoSmartPartner,
    accent: "#E5F20D",
  },
];

const advantages = [
  {
    title: "Access to Verified Leads",
    text: "Receive qualified project-ready homeowners who are actively exploring installation.",
    icon: <VerifiedOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#EAF1FF", fg: "#285DDE" },
  },
  {
    title: "Transparent System",
    text: "Everyone sees cleaner tender structures, proposal flow, and service quality benchmarks.",
    icon: <CurrencyExchangeRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#DDF8E8", fg: "#108A49" },
  },
  {
    title: "Marketing Support",
    text: "Sparkin boosts your regional visibility with trust-driven campaigns and brand exposure.",
    icon: <CampaignOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F5F7BE", fg: "#7A7B00" },
  },
  {
    title: "End-to-End Handling",
    text: "From demand qualification to booking management, we help you close installations faster.",
    icon: <HandshakeOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F2F4F7", fg: "#1E2430" },
  },
];

export default function TrustedPartnersPage() {
  return (
    <Box
      sx={{
        pt: { xs: 0, md: 0 },
        pb: { xs: 9.5, md: 12.5 },
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 360, md: 430 },
          backgroundImage: `linear-gradient(180deg, rgba(7,17,36,0.16) 0%, rgba(7,17,36,0.54) 70%, rgba(7,17,36,0.66) 100%), url(${trustedPartnersHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 18px 30px rgba(16,29,51,0.12)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: { xs: 360, md: 430 },
              display: "flex",
              alignItems: "center",
              py: publicPageSpacing.pageYCompact,
            }}
          >
            <Box sx={{ maxWidth: 470 }}>
            <Typography
              sx={{
                color: "#FFFFFF",
                ...publicTypography.heroTitle,
              }}
            >
              Our Trusted
              <Box component="span" sx={{ display: "block", color: "#E5F20D" }}>
                Solar Partners
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 1.25,
                maxWidth: 420,
                color: "rgba(241,246,255,0.78)",
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                lineHeight: 1.72,
              }}
            >
              Forging the future of energy through a meticulously verified
              network of world-class installers and innovators.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.3}
              sx={{ mt: 2.35 }}
            >
              <Button
                variant="contained"
                sx={{
                  minHeight: 42,
                  px: 2.1,
                  borderRadius: "0.72rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#0E56C8",
                  boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                }}
              >
                Become a Partner
              </Button>
              <Button
                variant="contained"
                sx={{
                  minHeight: 42,
                  px: 2.05,
                  borderRadius: "0.72rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "rgba(255,255,255,0.14)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mt: { xs: 7.5, md: 9.5 } }}>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.3rem", md: "1.65rem" },
              fontWeight: 800,
              letterSpacing: "-0.035em",
            }}
          >
            Verification Network
          </Typography>
          <Typography sx={{ mt: 0.55, color: "#7A879A", fontSize: "0.86rem" }}>
            Industry leaders powering the Sparkin ecosystem.
          </Typography>

          <Grid container spacing={{ xs: 1.2, md: 1.5 }} sx={{ mt: 3 }}>
            {verificationLogos.map((logo) => (
              <Grid key={logo} size={{ xs: 6, md: 2.4 }}>
                <Box
                  sx={{
                    height: 54,
                    borderRadius: "0.95rem",
                    bgcolor: "rgba(255,255,255,0.94)",
                    border: "1px solid rgba(223,231,241,0.92)",
                    display: "grid",
                    placeItems: "center",
                    color: "#96A2B4",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {logo}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: { xs: 8.5, md: 10.5 } }}>
          <Stack
            direction="row"
            alignItems="end"
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: { xs: "1.45rem", md: "1.85rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Top-Tier Performers
              </Typography>
              <Typography
                sx={{ mt: 0.5, color: "#7A879A", fontSize: "0.86rem" }}
              >
                Recognizing the ecosystem leaders in trust and service delivery.
              </Typography>
            </Box>
            <Typography
              component={RouterLink}
              to="/vendors"
              sx={{
                textDecoration: "none",
                color: "#0E56C8",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              View All Partners
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 2, md: 2.2 }}>
            {performers.map((partner) => (
              <Grid key={partner.name} size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 1.15,
                    borderRadius: "1.5rem",
                    bgcolor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(223,231,241,0.92)",
                    boxShadow: "0 16px 34px rgba(16,29,51,0.07)",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 170,
                      borderRadius: "1.1rem",
                      overflow: "hidden",
                      backgroundImage: `linear-gradient(180deg, rgba(8,20,42,0.04) 0%, rgba(8,20,42,0.12) 100%), url(${partner.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: 10,
                        top: 10,
                        px: 0.8,
                        py: 0.35,
                        borderRadius: 999,
                        bgcolor: partner.accent,
                        color: "#18253A",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {partner.badge}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      px: 1.05,
                      pt: 1.35,
                      pb: 0.85,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="start"
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#18253A",
                            fontSize: "1rem",
                            fontWeight: 800,
                          }}
                        >
                          {partner.name}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.3, color: "#7A879A", fontSize: "0.8rem" }}
                        >
                          {partner.location}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.25,
                            color: "#7A879A",
                            fontSize: "0.78rem",
                          }}
                        >
                          {partner.expertise}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.35} alignItems="center">
                        <CheckCircleRoundedIcon
                          sx={{ fontSize: "0.9rem", color: "#F0C419" }}
                        />
                        <Typography
                          sx={{
                            color: "#18253A",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          {partner.rating}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Button
                      component={RouterLink}
                      to="/vendors"
                      variant="contained"
                      sx={{
                        mt: "auto",
                        pt: 1.6,
                        width: "100%",
                        minHeight: 40,
                        borderRadius: "0.8rem",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textTransform: "none",
                        bgcolor: "#F7F9FC",
                        color: "#18253A",
                        boxShadow: "none",
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: { xs: 10.5, md: 13 } }}>
          <Grid container spacing={{ xs: 2.2, md: 2.2 }}>
            <Grid size={{ xs: 12, md: 4.2 }}>
              <Typography
                sx={{
                  color: "#18253A",
                  fontSize: { xs: "1.55rem", md: "2rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Why Partner with{" "}
                <Box component="span" sx={{ color: "#0E56C8" }}>
                  Sparkin?
                </Box>
              </Typography>
              <Typography
                sx={{
                  mt: 1.05,
                  color: "#7A879A",
                  fontSize: "0.9rem",
                  lineHeight: 1.78,
                  maxWidth: 380,
                }}
              >
                We built an atmospheric energy bridge that connects the most
                ambitious solar vendors with highly qualified residential and
                commercial demand.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 7.8 }}>
              <Grid container spacing={{ xs: 1.6, md: 1.7 }}>
                {advantages.map((item) => (
                  <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: { xs: 2, md: 2.15 },
                        minHeight: 168,
                        borderRadius: "1.35rem",
                        bgcolor: "rgba(255,255,255,0.94)",
                        border: "1px solid rgba(223,231,241,0.92)",
                        boxShadow: "0 12px 28px rgba(16,29,51,0.05)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "0.88rem",
                          bgcolor: item.tone.bg,
                          color: item.tone.fg,
                          display: "grid",
                          placeItems: "center",
                          mb: 1.25,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          color: "#18253A",
                          fontSize: "1rem",
                          fontWeight: 800,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.8,
                          color: "#6E7B8E",
                          fontSize: "0.84rem",
                          lineHeight: 1.72,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mt: { xs: 10.5, md: 13 },
            p: { xs: 3.3, md: 4.5 },
            borderRadius: "2rem",
            background:
              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 50%, rgba(130,173,255,0.18) 0%, rgba(130,173,255,0) 55%), linear-gradient(180deg, #0F4FBE 0%, #0A43A8 100%)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 20px 44px rgba(14,86,200,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background:
                "repeating-conic-gradient(from 270deg at 50% 100%, rgba(255,255,255,0.08) 0deg, rgba(255,255,255,0.08) 2deg, transparent 2deg, transparent 10deg)",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />
          <Typography
            sx={{
              position: "relative",
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.04,
            }}
          >
            Build the Future of Energy Together
          </Typography>

          <Typography
            sx={{
              position: "relative",
              mt: 1.2,
              mx: "auto",
              maxWidth: 520,
              color: "rgba(239,245,255,0.86)",
              fontSize: "0.95rem",
              lineHeight: 1.78,
            }}
          >
            Join the most sophisticated solar vendors in the market. Start your
            journey as a trusted Sparkin partner today.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.35}
            justifyContent="center"
            sx={{ mt: 2.8, position: "relative" }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minWidth: 150,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#DDF509",
                color: "#162331",
                boxShadow: "none",
              }}
            >
              Apply Now
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: 166,
                minHeight: 44,
                borderRadius: "0.72rem",
                fontSize: "0.84rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "none",
              }}
            >
              Partner Handbook
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

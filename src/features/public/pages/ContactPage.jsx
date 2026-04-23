import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import contactOfficePlaceholder from "@/shared/assets/images/public/contact/contact-office-placeholder.png";
import contactMapPlaceholder from "@/shared/assets/images/public/contact/contact-map-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const contactCards = [
  {
    title: "Phone",
    body: "Available Mon-Fri, 9am - 6pm IST",
    value: "+91 800-SPARKIN",
    icon: <CallOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    tone: { bg: "#EAF1FF", fg: "#285DDE" },
  },
  {
    title: "Email",
    body: "Our support team usually responds within 2 hours.",
    value: "hello@sparkin.io",
    icon: <EmailOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    tone: { bg: "#F4F7A8", fg: "#7A7B00" },
  },
  {
    title: "Office",
    body: "Visit our sustainable headquarters in the tech hub.",
    value: "Hyderabad, Telangana, India",
    icon: <PlaceOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    tone: { bg: "#DDF8E8", fg: "#14A75B" },
  },
];

export default function ContactPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 2.5, md: 4 }}
          alignItems="start"
          sx={{ mb: publicPageSpacing.sectionBottom }}
        >
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Typography
              variant="h1"
              sx={{
                ...publicTypography.heroTitle,
                color: "#18253A",
              }}
            >
              Contact Us
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Typography
              sx={{
                color: "#6E7B8E",
                ...publicTypography.sectionBody,
                maxWidth: 360,
              }}
            >
              We&apos;re here to help you accelerate your transition to clean
              energy. Reach out to our team of experts.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {contactCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 2.2, md: 2.5 },
                  minHeight: 156,
                  borderRadius: "1.35rem",
                  bgcolor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(223,231,241,0.9)",
                  boxShadow: "0 16px 36px rgba(16,29,51,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "0.8rem",
                    bgcolor: card.tone.bg,
                    color: card.tone.fg,
                    display: "grid",
                    placeItems: "center",
                    mb: 1.5,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    color: "#18253A",
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    color: "#6F7C90",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    minHeight: 54,
                  }}
                >
                  {card.body}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.3,
                    color: "#0E56C8",
                    fontSize: "0.94rem",
                    fontWeight: 700,
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          spacing={{ xs: 2.5, md: 2.5 }}
          sx={{ mt: publicPageSpacing.sectionTop }}
          alignItems="stretch"
        >
          <Grid size={{ xs: 12, md: 4.4 }}>
            <Box
              sx={{
                height: "100%",
                p: { xs: 2.4, md: 2.7 },
                borderRadius: "1.65rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(223,231,241,0.9)",
                boxShadow: "0 18px 40px rgba(16,29,51,0.08)",
              }}
            >
              <Typography
                sx={{ color: "#18253A", fontSize: "1.38rem", fontWeight: 800 }}
              >
                Send a Message
              </Typography>

              <Stack spacing={1.65} sx={{ mt: 2.35 }}>
                <Box>
                  <Typography
                    sx={{
                      mb: 0.55,
                      color: "#3B4658",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    InputProps={{
                      sx: {
                        height: 48,
                        borderRadius: "0.85rem",
                        bgcolor: "#F2F5F9",
                      },
                    }}
                  />
                </Box>

                <Grid container spacing={1.45}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        mb: 0.55,
                        color: "#3B4658",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="john@example.com"
                      InputProps={{
                        sx: {
                          height: 48,
                          borderRadius: "0.85rem",
                          bgcolor: "#F2F5F9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      sx={{
                        mb: 0.55,
                        color: "#3B4658",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      Phone
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="+91 00000 00000"
                      InputProps={{
                        sx: {
                          height: 48,
                          borderRadius: "0.85rem",
                          bgcolor: "#F2F5F9",
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box>
                  <Typography
                    sx={{
                      mb: 0.55,
                      color: "#3B4658",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    Message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Tell us about your solar project..."
                    InputProps={{
                      sx: {
                        borderRadius: "0.95rem",
                        bgcolor: "#F2F5F9",
                        alignItems: "start",
                      },
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    mt: 0.4,
                    minHeight: 46,
                    borderRadius: "0.7rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    textTransform: "none",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.16)",
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7.6 }}>
            <Stack spacing={{ xs: 2.35, md: 2.8 }} sx={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "1.55rem",
                  minHeight: { xs: 250, md: 290 },
                  backgroundImage: `linear-gradient(180deg, rgba(7,22,55,0.14) 0%, rgba(7,22,55,0.42) 100%), url(${contactOfficePlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 18px 40px rgba(16,29,51,0.1)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    p: { xs: 2, md: 2.3 },
                    color: "white",
                  }}
                >
                  <Box
                    sx={{
                      width: "fit-content",
                      px: 0.7,
                      py: 0.25,
                      borderRadius: 999,
                      bgcolor: "#F4DD3B",
                      color: "#3E3500",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Headquarters
                  </Box>
                  <Typography
                    sx={{
                      mt: 1.1,
                      fontSize: { xs: "1.2rem", md: "1.45rem" },
                      fontWeight: 800,
                    }}
                  >
                    Visit our Innovation Lab in Hyderabad
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "1.35rem",
                  minHeight: 150,
                  backgroundImage: `linear-gradient(180deg, rgba(7,34,74,0.18) 0%, rgba(7,34,74,0.22) 100%), url(${contactMapPlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 16px 34px rgba(16,29,51,0.08)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    px: 1.15,
                    py: 0.9,
                    borderRadius: "0.95rem",
                    bgcolor: "rgba(255,255,255,0.94)",
                    boxShadow: "0 12px 24px rgba(12,29,56,0.18)",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "0.75rem",
                      bgcolor: "#0E56C8",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <PlaceOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    Sparkin Solar HQ
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: { xs: 6.75, md: 8.75 },
            p: { xs: 3.5, md: 4.8 },
            borderRadius: "2rem",
            background:
              "radial-gradient(circle at 84% 32%, rgba(191,255,118,0.2) 0%, rgba(191,255,118,0) 18%), linear-gradient(90deg, #0E56C8 0%, #1557D1 62%, #0D45B4 100%)",
            color: "white",
            textAlign: "center",
            boxShadow: "0 20px 44px rgba(14,86,200,0.18)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.04,
            }}
          >
            Ready to power your
            <Box component="span" sx={{ display: "block" }}>
              business with solar?
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 1.3,
              mx: "auto",
              maxWidth: 560,
              color: "rgba(239,245,255,0.84)",
              fontSize: "1rem",
              lineHeight: 1.82,
            }}
          >
            Join 500+ enterprises that have reduced their carbon footprint and
            energy costs by up to 60%.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 3.25 }}
          >
            <Button
              component={RouterLink}
              to="/calculator"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minWidth: 172,
                minHeight: 46,
                borderRadius: "0.75rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#DDF509",
                color: "#162331",
                boxShadow: "none",
              }}
            >
              Calculate Savings
            </Button>
            <Button
              component={RouterLink}
              to="/quotes/compare"
              variant="contained"
              sx={{
                minWidth: 140,
                minHeight: 46,
                borderRadius: "0.75rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "none",
              }}
            >
              View Pricing
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

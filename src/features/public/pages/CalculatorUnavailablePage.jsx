import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { Link as RouterLink } from "react-router-dom";
import regionPlaceholder from "@/shared/assets/images/public/calculator/calculator-region-placeholder.svg";
import styles from "@/features/public/pages/CalculatorPage.module.css";

const insightCards = [
  {
    title: "Sustainable Grid",
    text: "Building the infrastructure for India’s clean energy future.",
    icon: <GridViewRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
  {
    title: "Precision Analytics",
    text: "Every ray of sunshine accounted for with atmospheric precision.",
    icon: <InsightsRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
  {
    title: "Expert Support",
    text: "Our engineers are standing by to plan your installation.",
    icon: <SupportAgentRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
];

export default function CalculatorUnavailablePage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: { xs: 8, md: 9.25 },
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.84) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
          sx={{ maxWidth: "1120px !important" }}
        >
          <Box
            sx={{
              maxWidth: 720,
              mx: "auto",
              mt: { xs: 3, md: 4.25 },
              borderRadius: "1.3rem",
              overflow: "hidden",
              bgcolor: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(220,228,239,0.96)",
              boxShadow: "0 22px 54px rgba(20,34,56,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 5.1 }}>
                <Box
                  sx={{
                    minHeight: { xs: 320, md: 340 },
                    height: "100%",
                    backgroundImage: `url(${regionPlaceholder})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6.9 }}>
                <Box
                  sx={{
                    p: { xs: 2.35, md: 3.1 },
                    minHeight: { md: 340 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      alignSelf: "flex-start",
                      px: 1.05,
                      py: 0.42,
                      borderRadius: 999,
                      bgcolor: "#D9EF2A",
                      color: "#5A6300",
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      letterSpacing: 0.75,
                      textTransform: "uppercase",
                    }}
                  >
                    Regional Expansion
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      mt: 1.55,
                      fontSize: { xs: "2rem", md: "2.35rem" },
                      lineHeight: 1.04,
                      letterSpacing: "-0.05em",
                      color: "#202938",
                    }}
                  >
                    We’re coming soon to
                    <br />
                    your neighborhood! 📍
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.55,
                      maxWidth: 360,
                      color: "#606F84",
                      fontSize: "0.98rem",
                      lineHeight: 1.78,
                    }}
                  >
                    Sparkin is currently expanding across India. While we
                    haven’t reached your specific location yet, we’re working
                    hard to bring precision solar energy to your doorstep.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2.2,
                      mb: 0.85,
                      color: "#414C5F",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                    }}
                  >
                    Notify Me When Available
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ alignItems: { sm: "stretch" } }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Enter your email"
                      InputProps={{
                        sx: {
                          height: 46,
                          borderRadius: "0.9rem",
                          bgcolor: "#F1F4F8",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: { sm: 112 },
                        minHeight: 46,
                        borderRadius: "0.9rem",
                        bgcolor: "#1B1F26",
                        color: "white",
                        fontWeight: 700,
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#161A20",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Notify Me
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      mt: 2.2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.1,
                      color: "#A0A9B7",
                    }}
                  >
                    <Box sx={{ flex: 1, height: 1, bgcolor: "#E6EAF0" }} />
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      Or
                    </Typography>
                    <Box sx={{ flex: 1, height: 1, bgcolor: "#E6EAF0" }} />
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      mt: 1.25,
                      alignSelf: "center",
                      color: "#0E56C8",
                      fontWeight: 700,
                      fontSize: "0.98rem",
                      textTransform: "none",
                    }}
                  >
                    Explore Sparkin
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            spacing={{ xs: 2.25, md: 4 }}
            justifyContent="center"
            sx={{ mt: { xs: 4.2, md: 4.8 } }}
          >
            {insightCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ maxWidth: 200, mx: "auto" }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "0.5rem",
                      display: "grid",
                      placeItems: "center",
                      color: "#0E56C8",
                      mb: 1.15,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      color: "#233040",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.75,
                      color: "#7B8799",
                      lineHeight: 1.65,
                      fontSize: "0.82rem",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

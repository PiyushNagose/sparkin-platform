import { Box, Button, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { Link as RouterLink } from "react-router-dom";
import { calculatorStorage } from "@/features/public/calculator/calculatorStorage";
import regionPlaceholder from "@/shared/assets/images/public/calculator/calculator-region-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing, publicTypography } from "@/features/public/pages/publicPageStyles";

const insightCards = [
  {
    title: "Target Launch",
    text: "Sparkin calculator coverage is currently focused on Andhra Pradesh, Telangana, and Karnataka.",
    icon: <GridViewRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
  {
    title: "Pincode Mapping",
    text: "Unsupported pincodes are captured so our team can prioritize expansion clusters.",
    icon: <InsightsRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
  {
    title: "Expert Support",
    text: "Our team can still help you understand your solar project manually.",
    icon: <SupportAgentRoundedIcon sx={{ fontSize: "0.96rem" }} />,
  },
];

export default function CalculatorUnavailablePage() {
  const serviceability = calculatorStorage.getServiceability();
  const supportedStates = serviceability?.supportedStates?.join(", ") || "Andhra Pradesh, Telangana, Karnataka";

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background: "radial-gradient(circle at top center, rgba(214,229,246,0.84) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container maxWidth={false} disableGutters className={styles.compactContainer}>
          <Box sx={{ maxWidth: 720, mx: "auto", mt: { xs: 3.5, md: 4.5 }, borderRadius: "1.3rem", overflow: "hidden", bgcolor: "rgba(255,255,255,0.92)", border: "1px solid rgba(220,228,239,0.96)", boxShadow: "0 22px 54px rgba(20,34,56,0.08)" }}>
            <Grid container>
              <Grid size={{ xs: 12, md: 5.1 }}>
                <Box sx={{ position: "relative", minHeight: { xs: 320, md: 340 }, height: "100%", backgroundImage: `url(${regionPlaceholder})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 86, height: 86, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.94)", boxShadow: "0 16px 30px rgba(18,32,54,0.18)", display: "grid", placeItems: "center" }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: "#0E56C8", color: "#FFFFFF", display: "grid", placeItems: "center" }}>
                      <LocationOnRoundedIcon sx={{ fontSize: "1.4rem" }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6.9 }}>
                <Box sx={{ p: { xs: 2.35, md: 3.1 }, minHeight: { md: 340 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Box sx={{ alignSelf: "flex-start", px: 1.05, py: 0.42, borderRadius: 999, bgcolor: "#D9EF2A", color: "#5A6300", fontSize: "0.58rem", fontWeight: 800, letterSpacing: 0.75, textTransform: "uppercase" }}>
                    Regional Expansion
                  </Box>

                  <Typography variant="h1" sx={{ mt: 1.55, ...publicTypography.pageTitle, color: "#202938" }}>
                    We're coming soon to your neighborhood.
                  </Typography>

                  <Typography sx={{ mt: 1.55, maxWidth: 370, color: "#606F84", ...publicTypography.sectionBody }}>
                    {serviceability?.reason || "This pincode is outside the current Sparkin calculator coverage."} Current calculator states: {supportedStates}.
                  </Typography>

                  <Typography sx={{ mt: 2.2, mb: 0.85, color: "#414C5F", fontSize: "0.76rem", fontWeight: 700 }}>
                    Notify Me When Available
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { sm: "stretch" } }}>
                    <TextField fullWidth placeholder="Enter your email" InputProps={{ sx: { height: 46, borderRadius: "0.9rem", bgcolor: "#F1F4F8" } }} />
                    <Button variant="contained" sx={{ minWidth: { sm: 112 }, minHeight: 46, borderRadius: "0.9rem", bgcolor: "#1B1F26", color: "white", fontWeight: 700, boxShadow: "none" }}>
                      Notify Me
                    </Button>
                  </Stack>

                  <Button component={RouterLink} to="/calculator" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 1.8, alignSelf: "center", color: "#0E56C8", fontWeight: 700, fontSize: "0.98rem", textTransform: "none" }}>
                    Try another pincode
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={{ xs: 2.25, md: 4 }} justifyContent="center" sx={{ mt: publicPageSpacing.sectionTop }}>
            {insightCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ maxWidth: 240, mx: "auto", p: { xs: 1.5, md: 1.7 }, borderRadius: "1rem" }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: "0.5rem", display: "grid", placeItems: "center", color: "#0E56C8", mb: 1.15 }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ color: "#233040", fontWeight: 700, fontSize: "1rem" }}>{item.title}</Typography>
                  <Typography sx={{ mt: 0.75, color: "#7B8799", lineHeight: 1.65, fontSize: "0.82rem" }}>{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

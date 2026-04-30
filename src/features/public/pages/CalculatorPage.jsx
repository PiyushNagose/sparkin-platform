import { Box, Button, Chip, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const insightCards = [
  {
    title: "Solar Intensity",
    text: "We analyze historical irradiance data for your specific geographic coordinates.",
    icon: <BoltRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#F0F3A6", fg: "#5B6200" },
  },
  {
    title: "Local Incentives",
    text: "Calculation includes current federal tax credits and state-specific solar rebates.",
    icon: <PaidOutlinedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#DDF5E9", fg: "#0B7D5C" },
  },
  {
    title: "Real-time Utility",
    text: "Cross-referenced with local utility rate structures for 99% estimation accuracy.",
    icon: <TrendingUpRoundedIcon sx={{ fontSize: "1rem" }} />,
    tone: { bg: "#E6F0FF", fg: "#256BFF" },
  },
];

export default function CalculatorPage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.8) 0%, rgba(245,248,251,0.96) 24%, #F9FBFD 62%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
        >
          <Stack
            spacing={1.35}
            alignItems="center"
            textAlign="center"
            sx={{ maxWidth: 760, mx: "auto" }}
          >
            <Typography
              variant="h1"
              sx={{
                ...publicTypography.heroTitle,
                color: "#18253A",
              }}
            >
              Calculate Your{" "}
              <Box component="span" sx={{ color: "#0E56C8" }}>
                Solar Savings
              </Box>
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                color: "#7A889D",
                ...publicTypography.sectionBody,
              }}
            >
              Instantly estimate your potential energy savings and
              environmental impact based on your current utility patterns.
            </Typography>
          </Stack>

          <Box
            sx={{
              mt: { xs: 4.8, md: 5.8 },
              mx: "auto",
              maxWidth: 620,
              p: { xs: 2.15, md: 2.8 },
              borderRadius: "1.45rem",
              bgcolor: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(218,228,240,0.95)",
              boxShadow: "0 18px 50px rgba(22,36,58,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={2.45}>
              <Box>
                <Typography
                  sx={{
                    mb: 1.25,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    color: "#3B4658",
                  }}
                >
                  Property Type
                </Typography>
                <Box
                  sx={{
                    p: 0.45,
                    borderRadius: "0.85rem",
                    bgcolor: "#EFF2F7",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 0.55,
                  }}
                >
                  <Chip
                    label="Residential"
                    sx={{
                      height: 38,
                      borderRadius: "0.65rem",
                      bgcolor: "white",
                      color: "#0E56C8",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label="Commercial"
                    sx={{
                      height: 38,
                      borderRadius: "0.65rem",
                      bgcolor: "transparent",
                      color: "#4C586C",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{
                    mb: 1.25,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    color: "#3B4658",
                  }}
                >
                  Monthly Electricity Bill
                </Typography>
                <TextField
                  fullWidth
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <Typography
                        sx={{
                          color: "#5A6475",
                          fontWeight: 700,
                          mr: 1,
                        }}
                      >
                        ₹
                      </Typography>
                    ),
                    sx: {
                      height: 52,
                      borderRadius: "0.75rem",
                      bgcolor: "#F2F5F9",
                      color: "#18253A",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    mb: 1.25,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    color: "#3B4658",
                  }}
                >
                  Location
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter zip code or city"
                  InputProps={{
                    startAdornment: (
                      <PlaceOutlinedIcon
                        sx={{ color: "#727E92", fontSize: "1.1rem", mr: 1 }}
                      />
                    ),
                    sx: {
                      height: 52,
                      borderRadius: "0.75rem",
                      bgcolor: "#F2F5F9",
                      color: "#18253A",
                    },
                  }}
                />
              </Box>

              <Button
                component={RouterLink}
                to="/calculator/processing"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 0.5,
                  minHeight: 54,
                  borderRadius: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #14B0D1 0%, #1BC17B 100%)",
                  boxShadow: "0 10px 24px rgba(27,193,123,0.18)",
                }}
              >
                Calculate Savings
              </Button>
            </Stack>
          </Box>
        </Container>

        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
          sx={{ mt: { xs: 5.8, md: 7 } }}
        >
          <Grid container spacing={{ xs: 2.5, md: 4 }} justifyContent="center">
            {insightCards.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3.3 }}>
                <Box
                  sx={{
                    maxWidth: 300,
                    mx: "auto",
                    p: { xs: 1.8, md: 2 },
                    height: "100%",
                    borderRadius: "1.15rem",
                    bgcolor: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(223,231,241,0.8)",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 14px 30px rgba(16,29,51,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "0.9rem",
                      bgcolor: item.tone.bg,
                      color: item.tone.fg,
                      display: "grid",
                      placeItems: "center",
                      mb: 1.35,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#6C7990",
                      lineHeight: 1.72,
                      fontSize: "0.9rem",
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

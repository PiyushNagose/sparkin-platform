import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const nextSteps = [
  {
    title: "Vendors review your request",
    description: "Experts analyze your energy needs and roof layout.",
    icon: <ImageSearchRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    title: "You receive multiple quotes",
    description: "Transparent pricing from top-rated solar installers.",
    icon: <LocalOfferOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    title: "Compare and choose the best one",
    description: "Select the plan that maximizes your long-term savings.",
    icon: <CompareArrowsRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

function NextStepItem({ icon, title, description }) {
  return (
    <Stack direction="row" spacing={1.05} alignItems="flex-start">
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: "0.55rem",
          bgcolor: "#F3F6FC",
          color: "#0E56C8",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#202938",
            fontSize: "0.72rem",
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#768297",
            fontSize: "0.6rem",
            lineHeight: 1.45,
            mt: 0.15,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function BookingSubmittedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/tenders/live");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.78) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
          sx={{
            maxWidth: "1120px !important",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={{ xs: 2.2, md: 2.6 }} sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 444,
                px: { xs: 2.2, md: 2.55 },
                py: { xs: 2.9, md: 3.1 },
                borderRadius: "1.45rem",
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(228,234,241,0.98)",
                boxShadow: "0 22px 54px rgba(20,34,56,0.08)",
              }}
            >
              <Stack alignItems="center" textAlign="center" spacing={{ xs: 1.45, md: 1.7 }}>
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    bgcolor: "#E8F6EC",
                    color: "#0E6A36",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: "1.65rem" }} />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    maxWidth: 480,
                    color: "#20242B",
                    fontSize: { xs: "1.55rem", sm: "1.7rem", md: "1.85rem", lg: "2rem" },
                    lineHeight: 1.12,
                    letterSpacing: "-0.04em",
                    fontWeight: 800,
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  Your request has been submitted!
                  <Box component="span" sx={{ ml: 0.22 }}>
                    {"\uD83C\uDF89"}
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 300,
                    color: "#667084",
                    fontSize: "0.94rem",
                    lineHeight: 1.6,
                  }}
                >
                  We&apos;re now connecting you with verified solar vendors to
                  get the best offers for your home.
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    p: 1.45,
                    borderRadius: "1rem",
                    bgcolor: "#F4F7FB",
                    border: "1px solid #EEF2F7",
                  }}
                >
                  <Stack spacing={1.2}>
                    {nextSteps.map((item) => (
                      <NextStepItem key={item.title} {...item} />
                    ))}
                  </Stack>
                </Box>

                <Button
                  component={RouterLink}
                  to="/tenders/live"
                  variant="contained"
                  sx={{
                    width: "100%",
                    minHeight: 46,
                    borderRadius: "0.85rem",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    textTransform: "none",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 12px 24px rgba(14,86,200,0.22)",
                  }}
                >
                  Track My Request
                </Button>

                <Button
                  component={RouterLink}
                  to="/customer"
                  sx={{
                    color: "#0E56C8",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "transparent" },
                  }}
                >
                  Go to Dashboard
                </Button>

                <Stack direction="row" spacing={0.55} alignItems="center">
                  <RadioButtonUncheckedRoundedIcon
                    sx={{ fontSize: "0.82rem", color: "#8693A7" }}
                  />
                  <Typography
                    sx={{
                      color: "#8A96A7",
                      fontSize: "0.56rem",
                      fontWeight: 700,
                      letterSpacing: 0.38,
                      textTransform: "uppercase",
                    }}
                  >
                    Redirecting you in 3 seconds...
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Typography
              sx={{
                color: "#6F7C90",
                fontSize: "0.72rem",
                textAlign: "center",
              }}
            >
              Need help?{" "}
              <Box
                component="span"
                sx={{ color: "#0E56C8", fontWeight: 600 }}
              >
                Contact our energy consultants
              </Box>
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SolarPowerOutlinedIcon from "@mui/icons-material/SolarPowerOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const processingSteps = [
  {
    title: "Analyzing your usage",
    text: "Gathering historical data from regional utility nodes",
    icon: <TrendingUpRoundedIcon sx={{ fontSize: "1rem" }} />,
    active: true,
  },
  {
    title: "Checking sunlight availability",
    text: "Cross-referencing satellite shading data",
    icon: <TipsAndUpdatesOutlinedIcon sx={{ fontSize: "1rem" }} />,
    active: false,
  },
  {
    title: "Matching with best solar options",
    text: "Finalizing hardware configurations and ROI",
    icon: <TuneRoundedIcon sx={{ fontSize: "1rem" }} />,
    active: false,
  },
];

export default function CalculatorProcessingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/calculator/results");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.86) 0%, rgba(244,248,251,0.97) 25%, #F9FBFD 62%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
        >
          <Box
            sx={{
              maxWidth: 780,
              mx: "auto",
              minHeight: { xs: "auto", md: 680 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              alignItems="center"
              textAlign="center"
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#0E56C8",
                  bgcolor: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(214,224,238,0.95)",
                  boxShadow: "0 18px 40px rgba(18,38,70,0.12)",
                  position: "relative",
                  mb: { xs: 3.25, md: 3.6 },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 9,
                    borderRadius: "50%",
                    border: "1.5px dashed rgba(14,86,200,0.9)",
                  }}
                />
                <SolarPowerOutlinedIcon sx={{ fontSize: "1.3rem" }} />
              </Box>

              <Typography
                variant="h1"
              sx={{
                ...publicTypography.pageTitle,
                color: "#18253A",
              }}
              >
                Calculating your solar potential...
                <Box component="span" sx={{ ml: 0.45 }}>
                  {"\u2600\uFE0F"}
                </Box>
              </Typography>

              <Typography
              sx={{
                mt: 1.15,
                maxWidth: 440,
                color: "#66758A",
                ...publicTypography.body,
              }}
              >
                Analyzing your electricity usage and location
              </Typography>

              <Box
                sx={{
                  mt: { xs: 4, md: 4.5 },
                  width: "100%",
                  maxWidth: 510,
                  p: { xs: 2.1, md: 2.35 },
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(221,229,239,0.98)",
                  boxShadow: "0 18px 46px rgba(20,34,56,0.08)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 22px 52px rgba(20,34,56,0.1)",
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#0E56C8",
                      }}
                    >
                      Progress
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#5E6C80",
                      }}
                    >
                      35% Complete
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={35}
                    sx={{
                      height: 5,
                      borderRadius: 999,
                      bgcolor: "#E6EBF1",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #0F57C9 0%, #C7E41D 100%)",
                      },
                    }}
                  />

                  <Stack spacing={1.35}>
                    {processingSteps.map((step) => (
                      <Box
                        key={step.title}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.35,
                          opacity: step.active ? 1 : 0.42,
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            flexShrink: 0,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            color: step.active ? "#0E56C8" : "#7F8CA1",
                            bgcolor: step.active ? "#F0F5FF" : "#F6F7F9",
                            border: `1px solid ${
                              step.active
                                ? "rgba(179,199,236,0.95)"
                                : "rgba(225,229,236,0.95)"
                            }`,
                          }}
                        >
                          {step.active ? (
                            <AutorenewRoundedIcon sx={{ fontSize: "1rem" }} />
                          ) : (
                            step.icon
                          )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                          <Typography
                            sx={{
                              color: "#1B283A",
                              fontWeight: 700,
                              fontSize: "0.96rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.2,
                              color: "#7C889B",
                              fontSize: "0.78rem",
                              lineHeight: 1.45,
                            }}
                          >
                            {step.text}
                          </Typography>
                        </Box>

                        {step.active && (
                          <Chip
                            label="Running"
                            sx={{
                              height: 22,
                              borderRadius: 999,
                              bgcolor: "#E8F041",
                              color: "#4A5300",
                              fontSize: "0.58rem",
                              fontWeight: 800,
                              letterSpacing: 0.6,
                              textTransform: "uppercase",
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>

              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: { xs: 3, md: 3.4 }, color: "#8B96A9" }}
              >
                <LockOutlinedIcon sx={{ fontSize: "0.82rem" }} />
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    lineHeight: 1.55,
                  }}
                >
                  Securely processing your data via Sparkin Cloud
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import resultBannerImage from "@/shared/assets/images/public/calculator/calculator-results-banner-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const overviewCards = [
  {
    title: "Monthly Savings",
    value: "₹8,200",
    text: "Equivalent to 450 units of free electricity per month.",
    icon: <CalendarMonthRoundedIcon sx={{ fontSize: "0.92rem" }} />,
    iconTone: { bg: "#EEF4FF", fg: "#165BCA" },
  },
  {
    title: "Annual Savings",
    value: "₹98,400",
    text: "Estimated tax benefits and subsidies included.",
    icon: <CreditCardRoundedIcon sx={{ fontSize: "0.92rem" }} />,
    iconTone: { bg: "#EEF4FF", fg: "#165BCA" },
  },
  {
    title: "5-Year ROI",
    value: "₹6.4 Lakhs",
    text: "Post-subsidy ROI including ₹1.08L combined upfront government benefits.",
    icon: <TrendingUpRoundedIcon sx={{ fontSize: "0.92rem" }} />,
    iconTone: { bg: "#E6F8EC", fg: "#0A7A3B" },
    highlight: true,
  },
];

const subsidyItems = [
  {
    title: "300 Units Free",
    text: "Monthly free electricity allowance.",
    icon: <BoltRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    title: "Low Interest Loans",
    text: "0% collateral on residential solar financing.",
    icon: <AccountBalanceRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    title: "₹78,000 Subsidy",
    text: "+ ₹30,000 per kW up to 2kW\n+ ₹18,000 for additional 3kW",
    icon: <ReceiptLongRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

const axisLabels = [
  "Year 0",
  "Year 5",
  "Year 10",
  "Year 15",
  "Year 20",
  "Year 25",
];

export default function CalculatorResultsPage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.84) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.compactContainer}
        >
          <Stack spacing={{ xs: 2.6, md: 3.15 }}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  ...publicTypography.pageTitle,
                  color: "#18253A",
                  whiteSpace: { md: "nowrap" },
                }}
              >
                Your Solar Potential
              </Typography>
              <Typography
              sx={{
                mt: 0.8,
                maxWidth: 500,
                color: "#697790",
                ...publicTypography.body,
              }}
              >
                Based on your energy profile, we’ve optimized a system designed
                for maximum ROI and energy independence.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 2.1 }} alignItems="stretch">
              <Grid size={{ xs: 12, md: 8.2 }}>
                <Box
                  sx={{
                    minHeight: 210,
                    p: { xs: 2.35, md: 2.75 },
                    borderRadius: "1.2rem",
                    bgcolor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(220,228,239,0.96)",
                    boxShadow: "0 18px 46px rgba(20,34,56,0.08)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 22px 52px rgba(20,34,56,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -18,
                      right: 24,
                      width: 170,
                      height: 170,
                      background:
                        "radial-gradient(circle, rgba(245,239,120,0.9) 0%, rgba(245,239,120,0) 70%)",
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        px: 0.95,
                        py: 0.34,
                        borderRadius: 999,
                        bgcolor: "#18BF73",
                        color: "white",
                        fontSize: "0.54rem",
                        fontWeight: 800,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        display: "inline-flex",
                      }}
                    >
                      Estimated Savings
                    </Box>

                    <Typography
                      sx={{
                        mt: 1.1,
                        color: "#2A92F5",
                        fontWeight: 800,
                        fontSize: { xs: "2rem", md: "2.55rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.05em",
                      }}
                    >
                      ₹8,200/month
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.45,
                        color: "#5E6C81",
                        fontSize: "0.86rem",
                        lineHeight: 1.58,
                      }}
                    >
                      You can save up to ₹98,400 annually with solar
                    </Typography>

                    <Grid
                      container
                      spacing={{ xs: 1.4, md: 1.6 }}
                      sx={{ mt: 2.55 }}
                    >
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          sx={{
                            color: "#7B889B",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                          }}
                        >
                          System Size
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.4,
                            color: "#19263A",
                            fontWeight: 800,
                            fontSize: "1rem",
                          }}
                        >
                          5kW
                          <Box
                            component="span"
                            sx={{
                              ml: 0.3,
                              fontSize: "0.68rem",
                              color: "#5B677A",
                            }}
                          >
                            Peak
                          </Box>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          sx={{
                            color: "#7B889B",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                          }}
                        >
                          Payback Period
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.4,
                            color: "#19263A",
                            fontWeight: 800,
                            fontSize: "1rem",
                          }}
                        >
                          2.2 Years
                          <Box
                            component="span"
                            sx={{
                              ml: 0.32,
                              fontSize: "0.64rem",
                              color: "#0A8B53",
                            }}
                          >
                            + Post-Subsidy
                          </Box>
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          sx={{
                            color: "#7B889B",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                          }}
                        >
                          Lifetime Savings
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.4,
                            color: "#157C36",
                            fontWeight: 800,
                            fontSize: "1rem",
                          }}
                        >
                          ₹7.5-9 Lakhs
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 3.8 }}>
                <Box
                  sx={{
                    minHeight: 210,
                    p: { xs: 2.3, md: 2.6 },
                    borderRadius: "1.2rem",
                    background:
                      "linear-gradient(180deg, #0F58C7 0%, #123C9C 100%)",
                    color: "white",
                    boxShadow: "0 18px 46px rgba(20,34,56,0.1)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 22px 52px rgba(20,34,56,0.14)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      right: -18,
                      bottom: -22,
                      width: 120,
                      height: 120,
                      borderRadius: "1.5rem",
                      border: "2px solid rgba(255,255,255,0.08)",
                      opacity: 0.35,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: 16,
                      bottom: 8,
                      width: 62,
                      height: 62,
                      borderRadius: "1rem",
                      border: "2px solid rgba(255,255,255,0.08)",
                      opacity: 0.35,
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                      }}
                    >
                      Ready to Switch?
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.75,
                        maxWidth: 205,
                        color: "rgba(240,245,255,0.78)",
                        fontSize: "0.82rem",
                        lineHeight: 1.62,
                      }}
                    >
                      Connect with verified installers in your area
                      <br />
                      and start your transition today.
                    </Typography>
                  </Box>

                  <Stack
                    spacing={1.05}
                    sx={{ mt: 2.2, position: "relative", zIndex: 1 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        minHeight: 42,
                        borderRadius: "0.7rem",
                        fontWeight: 700,
                        background:
                          "linear-gradient(90deg, #17B2D3 0%, #1BC17B 100%)",
                        boxShadow: "none",
                      }}
                    >
                      Get Free Quotes
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/booking"
                      variant="contained"
                      sx={{
                        minHeight: 42,
                        borderRadius: "0.7rem",
                        fontWeight: 700,
                        bgcolor: "rgba(255,255,255,0.12)",
                        color: "white",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.18)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Proceed to Booking
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={{ xs: 2, md: 2.1 }}>
              {overviewCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      p: { xs: 1.95, md: 2.05 },
                      minHeight: 148,
                      borderRadius: "1.15rem",
                      bgcolor: "rgba(255,255,255,0.95)",
                      border: card.highlight
                        ? "1px solid rgba(120,170,135,0.48)"
                        : "1px solid rgba(220,228,239,0.96)",
                      boxShadow: "0 18px 46px rgba(20,34,56,0.06)",
                      transition: "transform 200ms ease, box-shadow 200ms ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 20px 48px rgba(20,34,56,0.09)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={0.78} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "0.48rem",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: card.iconTone.bg,
                          color: card.iconTone.fg,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        sx={{
                          color: "#445165",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        mt: 1.15,
                        color: "#18253A",
                        fontWeight: 800,
                        fontSize: { xs: "1.55rem", md: "1.8rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {card.value}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        color: "#7B8799",
                        fontSize: "0.75rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {card.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                p: { xs: 2.35, md: 2.8 },
                borderRadius: "1.15rem",
                background: "linear-gradient(180deg, #0E873A 0%, #0C6B2F 100%)",
                color: "white",
                boxShadow: "0 24px 54px rgba(18,72,34,0.18)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "flex-start" }}
                spacing={{ xs: 1.2, md: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={0.8}>
                    {["Official Schemes", "Eligible"].map((item) => (
                      <Box
                        key={item}
                        sx={{
                          px: 0.95,
                          py: 0.35,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,0.14)",
                          fontSize: "0.54rem",
                          fontWeight: 800,
                          letterSpacing: 0.6,
                          textTransform: "uppercase",
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1.15,
                      fontWeight: 800,
                      fontSize: { xs: "1.5rem", md: "1.78rem" },
                    }}
                  >
                    Available Government Support
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography
                    sx={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      color: "rgba(239,248,242,0.78)",
                    }}
                  >
                    Total Combined Benefit
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.35,
                      fontWeight: 800,
                      fontSize: { xs: "1.6rem", md: "1.95rem" },
                    }}
                  >
                    ₹78,000
                    <Box
                      component="span"
                      sx={{
                        ml: 0.4,
                        fontSize: "0.86rem",
                        color: "rgba(238,248,241,0.82)",
                      }}
                    >
                      DBT Direct
                    </Box>
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  mt: 2.15,
                  p: { xs: 1.7, md: 2 },
                  borderRadius: "0.95rem",
                  bgcolor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(232,247,236,0.72)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                  }}
                >
                  Central Government Scheme
                </Typography>
                <Typography
                  sx={{
                    mt: 0.95,
                    fontWeight: 800,
                    fontSize: { xs: "1.08rem", md: "1.18rem" },
                  }}
                >
                  PM Surya Ghar: Muft Bijli Yojana
                </Typography>
                <Typography
                  sx={{
                    mt: 0.38,
                    color: "rgba(238,248,241,0.78)",
                    fontSize: "0.8rem",
                  }}
                >
                  Major federal push for 1 crore households
                </Typography>

                <Grid
                  container
                  spacing={{ xs: 1.35, md: 1.6 }}
                  sx={{ mt: 1.7 }}
                >
                  {subsidyItems.map((item) => (
                    <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                      <Box
                        sx={{
                          p: 1.35,
                          minHeight: 106,
                          borderRadius: "0.82rem",
                          bgcolor: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "0.5rem",
                            bgcolor: "#54EA7A",
                            color: "#0B5B2D",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          sx={{
                            mt: 1,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.5,
                            color: "rgba(238,248,241,0.8)",
                            fontSize: "0.72rem",
                            lineHeight: 1.5,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            <Grid
              container
              spacing={{ xs: 2.25, md: 2.3 }}
              alignItems="stretch"
            >
              <Grid size={{ xs: 12, md: 8.3 }}>
                <Box
                  sx={{
                    p: { xs: 2.15, md: 2.35 },
                    borderRadius: "1rem",
                    bgcolor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(220,228,239,0.96)",
                    boxShadow: "0 18px 46px rgba(20,34,56,0.06)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={{ xs: 1.1, sm: 0 }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#223041",
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        Savings Growth Over Time
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.35,
                          color: "#7B879A",
                          fontSize: "0.76rem",
                        }}
                      >
                        Projected cumulative savings over 25 years
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.55}>
                      {["Solar", "Grid"].map((item, index) => (
                        <Box
                          key={item}
                          sx={{
                            px: 0.75,
                            py: 0.26,
                            borderRadius: 999,
                            bgcolor: index === 0 ? "#EFF4FF" : "#F2F4F8",
                            color: index === 0 ? "#0E56C8" : "#808B9B",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.45,
                          }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              bgcolor: index === 0 ? "#0E56C8" : "#C9CED9",
                            }}
                          />
                          {item}
                        </Box>
                      ))}
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      mt: 2.1,
                      height: { xs: 218, md: 228 },
                      position: "relative",
                      overflow: "hidden",
                      borderTop: "1px solid rgba(235,239,245,0.95)",
                    }}
                  >
                    {[58, 118, 178].map((top, index) => (
                      <Box
                        key={top}
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top,
                          borderTop: `1px solid ${
                            index === 2
                              ? "rgba(233,237,244,0.8)"
                              : "rgba(235,239,245,0.9)"
                          }`,
                        }}
                      />
                    ))}

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        top: 6,
                        bottom: 28,
                      }}
                    >
                      <Box
                        component="svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        sx={{ width: "100%", height: "100%", overflow: "visible" }}
                      >
                        <defs>
                          <linearGradient
                            id="solarAreaFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="rgba(14,86,200,0.18)" />
                            <stop offset="100%" stopColor="rgba(14,86,200,0.02)" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M 0 86 C 12 82, 24 75, 36 62 S 63 28, 82 18 S 95 16, 100 18 L 100 100 L 0 100 Z"
                          fill="url(#solarAreaFill)"
                        />
                        <path
                          d="M 0 91 C 18 89, 35 86, 52 83 S 78 78, 100 74"
                          fill="none"
                          stroke="#C8CFDF"
                          strokeWidth="3"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 0 86 C 12 82, 24 75, 36 62 S 63 28, 82 18 S 95 16, 100 18"
                          fill="none"
                          stroke="#0E56C8"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 6,
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#7C889A",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                      }}
                    >
                      {axisLabels.map((label) => (
                        <Box key={label}>{label}</Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 3.7 }}>
                <Stack spacing={{ xs: 2, md: 2.2 }} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      p: { xs: 1.95, md: 2.1 },
                      borderRadius: "1rem",
                      background:
                        "linear-gradient(180deg, #066728 0%, #05571F 100%)",
                      color: "white",
                      minHeight: 148,
                    }}
                  >
                    <Stack direction="row" spacing={0.72} alignItems="center">
                      <SpaRoundedIcon sx={{ fontSize: "0.96rem" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.96rem" }}>
                        Eco-Impact
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        mt: 0.95,
                        color: "rgba(238,248,241,0.82)",
                        fontSize: "0.75rem",
                        lineHeight: 1.56,
                        maxWidth: 170,
                      }}
                    >
                      Your solar plant is equivalent to planting
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.05,
                        fontWeight: 800,
                        fontSize: { xs: "1.85rem", md: "2rem" },
                        lineHeight: 1,
                      }}
                    >
                      124 Trees
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.38,
                        color: "rgba(238,248,241,0.82)",
                        fontSize: "0.7rem",
                      }}
                    >
                      annually in CO2 offset
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: { xs: 1.95, md: 2.1 },
                      borderRadius: "1rem",
                      bgcolor: "rgba(255,255,255,0.95)",
                      border: "1px solid rgba(220,228,239,0.96)",
                      boxShadow: "0 18px 46px rgba(20,34,56,0.06)",
                      minHeight: 124,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 74,
                        height: 74,
                        mx: "auto",
                        borderRadius: "50%",
                        border: "4px solid #C7D22A",
                        display: "grid",
                        placeItems: "center",
                        color: "#233040",
                        fontWeight: 800,
                        fontSize: "1.05rem",
                      }}
                    >
                      88%
                    </Box>
                    <Typography
                      sx={{
                        mt: 1.05,
                        color: "#223041",
                        fontWeight: 700,
                        fontSize: "0.94rem",
                      }}
                    >
                      Energy Offset
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.38,
                        color: "#7B8799",
                        fontSize: "0.72rem",
                        lineHeight: 1.48,
                      }}
                    >
                      Coverage of your total electricity needs
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Box
              sx={{
                minHeight: { xs: 220, md: 244 },
                borderRadius: "1rem",
                overflow: "hidden",
                backgroundImage: `linear-gradient(180deg, rgba(5,16,28,0.05) 0%, rgba(8,17,28,0.72) 86%), url(${resultBannerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  p: { xs: 2.45, md: 2.75 },
                  color: "white",
                  maxWidth: 360,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.35rem", md: "1.58rem" },
                  }}
                >
                  Optimized for Your Roof
                </Typography>
                <Typography
                  sx={{
                    mt: 0.7,
                    color: "rgba(239,244,249,0.84)",
                    fontSize: "0.82rem",
                    lineHeight: 1.65,
                  }}
                >
                  Our algorithm detected 420 sq. ft. of unshaded area on your
                  south-facing roof slope, ideal for maximum efficiency and
                  eligibility for full subsidies.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

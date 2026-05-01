import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MiscellaneousServicesRoundedIcon from "@mui/icons-material/MiscellaneousServicesRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Link as RouterLink } from "react-router-dom";
import styles from "@/features/public/pages/HomePage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";
import heroBackgroundImage from "@/shared/assets/images/public/home/hero-background-placeholder.png";
import animeshAvatarPlaceholder from "@/shared/assets/images/public/home/avatar-animesh-placeholder.svg";
import priyaAvatarPlaceholder from "@/shared/assets/images/public/home/avatar-priya-placeholder.svg";
import rohanAvatarPlaceholder from "@/shared/assets/images/public/home/avatar-rohan-placeholder.svg";
import serviceMaintenancePlaceholder from "@/shared/assets/images/public/home/service-maintenance-placeholder.png";
import servicePanelCleaningPlaceholder from "@/shared/assets/images/public/home/service-panel-cleaning-placeholder.png";
import serviceRepairsPlaceholder from "@/shared/assets/images/public/home/service-repairs-placeholder.png";

const heroStats = [
  {
    icon: <VerifiedOutlinedIcon />,
    value: "4.8\u2605",
    label: "Customer Rating",
  },
  { icon: <HomeWorkOutlinedIcon />, value: "350+", label: "Verified Vendors" },
  {
    icon: <PaidOutlinedIcon />,
    value: "\u20B92.8L",
    label: "Avg. 5yr Savings",
  },
];

const bidCards = [
  {
    initials: "TP",
    name: "Tata Power Solar",
    price: "\u20B92.85L",
    tag: "Best Value",
    tone: "#E7F0FF",
  },
  {
    initials: "ASL",
    name: "Adani Solar",
    price: "\u20B93.10L",
    tag: "Fast Install",
    tone: "#FFF0DF",
  },
  {
    initials: "WEL",
    name: "Waaree Energies",
    price: "\u20B92.90L",
    tag: "Top Rated",
    tone: "#DDFBEF",
  },
];

const steps = [
  {
    number: "01",
    title: "Calculate Savings",
    description:
      "Enter your details to instantly see your potential solar yield and 20-year savings. Our algorithm accounts for local irradiance and shading.",
    dark: false,
  },
  {
    number: "02",
    title: "Compare Vendors",
    description:
      "Review personalized quotes from our network of pre-vetted, high-quality solar installers. We only partner with firms that meet strict architectural standards.",
    dark: true,
  },
  {
    number: "03",
    title: "Install & Save",
    description:
      "Professional installation with end-to-end support for net metering and subsidy applications. Start saving from the very first day of production.",
    dark: false,
  },
];

const promiseCards = [
  {
    title: "Guaranteed Quality",
    text: "We only partner with Tier-1 verified solar providers.",
  },
  {
    title: "Price Transparency",
    text: "No hidden costs. Get the best market rates through competitive bidding.",
  },
  {
    title: "End-to-End Handling",
    text: "From paperwork to grid connection, we manage the entire process for a hassle-free transition.",
  },
  {
    title: "Verified Savings",
    text: "Our ROI projections are based on real-time regional data and verified utility rates.",
  },
];

const offers = [
  {
    badge: "Govt Scheme",
    title: "PM Surya Ghar Subsidy",
    text: "Get up to \u20B978,000 direct benefit transfer from the Central Government.",
    action: "Claim Subsidy",
    href: "/booking",
  },
  {
    badge: "Limited Time",
    title: "Monsoon Flash Discount",
    text: "Get an additional \u20B915,000 off on all 5kW+ installations booked this month.",
    action: "View Details",
    href: "/calculator/results",
  },
  {
    badge: "Financing",
    title: "Zero-Cost EMI Offer",
    text: "0% interest financing for up to 24 months through our banking partners.",
    action: "Apply Now",
    href: "/loan-financing",
  },
];

const serviceCards = [
  {
    title: "Panel Cleaning",
    text: "Automated and manual cleaning schedules to maintain maximum sun absorption year-round.",
    image: servicePanelCleaningPlaceholder,
    icon: <HomeWorkOutlinedIcon />,
    action: "Schedule Service",
    href: "/service-support/request",
  },
  {
    title: "System Maintenance",
    text: "Regular health checks and preventative maintenance to ensure your system performs at peak efficiency.",
    image: serviceMaintenancePlaceholder,
    icon: <SettingsSuggestRoundedIcon />,
    action: "Book Maintenance",
    href: "/service-support/request",
  },
  {
    title: "Repairs & Support",
    text: "Fast-response technical support and expert repairs for any hardware or performance issues.",
    image: serviceRepairsPlaceholder,
    icon: <MiscellaneousServicesRoundedIcon />,
    action: "Get Support",
    href: "/service-support",
  },
];

const testimonials = [
  {
    quote:
      '"Our electricity bill dropped from \u20B97,500 to almost zero within the first month. Sparkin made the selection process so easy by comparing multiple vendor quotes for us."',
    name: "Animesh Sharma",
    city: "Bangalore, KA",
    avatar: animeshAvatarPlaceholder,
  },
  {
    quote:
      '"The transparency was what sold me. No hidden costs, and the PM Surya Ghar subsidy help was a lifesaver. Highly recommend Sparkin for anyone in Pune."',
    name: "Priya Kulkarni",
    city: "Pune, MH",
    avatar: priyaAvatarPlaceholder,
  },
  {
    quote:
      '"Best investment I\'ve made for my home. The solar calculator was spot on with the savings estimate. The dashboard makes tracking performance fun!"',
    name: "Rohan Mehta",
    city: "New Delhi, DL",
    avatar: rohanAvatarPlaceholder,
  },
];

const faqs = [
  {
    question: "How much can I really save?",
    answer:
      "Savings depend on roof size, electricity usage, tariff slab, and subsidy eligibility. Most households in our target range recover their investment in 3 to 5 years.",
  },
  {
    question: "What is the PM Surya Ghar subsidy?",
    answer:
      "It is a government-backed rooftop solar subsidy program for residential users. We help customers understand eligibility, paperwork, and expected benefit amount.",
  },
  {
    question: "What happens on cloudy or rainy days?",
    answer:
      "Your system still generates power during cloudy weather, just at a lower efficiency. Grid-connected homes continue to draw from the grid whenever needed.",
  },
];

const systemTypes = [
  "On-Grid (Hybrid)",
  "On-Grid",
  "Off-Grid",
  "Battery Ready",
];

function formatInr(value) {
  return `\u20B9${Math.round(value).toLocaleString("en-IN")}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useCountUp(target, { duration = 1200, decimals = 0, started = true } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    let frameId;
    const start = performance.now();

    const animate = (time) => {
      const progress = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = target * eased;
      setValue(Number(nextValue.toFixed(decimals)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [target, duration, decimals, started]);

  return value;
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function CountUpValue({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
  suffixSx,
  started = true,
}) {
  const value = useCountUp(target, { decimals, started });
  const formatted = compact
    ? value.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })
    : value.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      });

  return (
    <>
      {prefix}
      {formatted}
      {suffix ? (
        <Box component="span" sx={suffixSx}>
          {suffix}
        </Box>
      ) : null}
    </>
  );
}

function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [
    [String(hours).padStart(2, "0"), "Hours"],
    [String(minutes).padStart(2, "0"), "Mins"],
    [String(seconds).padStart(2, "0"), "Secs"],
  ];
}

function SectionTitle({ title, highlight, subtitle, centered = true }) {
  return (
    <Stack
      spacing={{ xs: 1.8, md: 2.1 }}
      alignItems={centered ? "center" : "flex-start"}
      textAlign={centered ? "center" : "left"}
    >
      <Typography
        variant="h2"
        sx={{
          ...publicTypography.sectionTitle,
          maxWidth: 720,
        }}
      >
        {title}
        {highlight ? (
          <Box component="span" sx={{ color: "#19C98B" }}>
            {" "}
            {highlight}
          </Box>
        ) : null}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 620, ...publicTypography.sectionBody }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function ImagePlaceholder({
  height,
  dark = false,
  label = "Image Placeholder",
}) {
  return (
    <Box
      sx={{
        height,
        borderRadius: "2rem",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E7EDF4",
        background: dark
          ? "linear-gradient(135deg, rgba(35,55,92,0.95) 0%, rgba(11,18,38,0.98) 100%)"
          : "linear-gradient(135deg, rgba(203,224,246,0.85) 0%, rgba(227,241,250,0.9) 100%)",
        display: "grid",
        placeItems: "center",
        color: dark ? "rgba(255,255,255,0.65)" : "rgba(16,25,47,0.4)",
        fontWeight: 700,
        fontSize: "0.95rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 34%), linear-gradient(180deg, transparent, rgba(0,0,0,0.08))",
        }}
      />
      <Typography sx={{ position: "relative", zIndex: 1 }}>{label}</Typography>
    </Box>
  );
}

function StatsSection() {
  const [ref, inView] = useInView();
  return (
    <Grid ref={ref} container spacing={{ xs: 2.5, md: 3 }}>
      {[
        ["Verified Users", "Homes powered across 20 cities", false],
        ["Satisfaction", "Average customer satisfaction", true],
        ["Energy Yield", "Total installed capacity", false],
      ].map(([label, subtitle, dark]) => (
        <Grid key={label} size={{ xs: 12, md: 4 }}>
          <Box
            className={styles.animatedSurface}
            sx={{
              p: { xs: 2.5, md: 2.7 },
              minHeight: 212,
              borderRadius: "2rem",
              border: dark ? "none" : "1px solid #E7EDF5",
              bgcolor: dark ? "#10192F" : "white",
              color: dark ? "white" : "#10192F",
              boxShadow: dark
                ? "0 18px 40px rgba(16,25,47,0.12)"
                : "0 0 0 1px rgba(16,25,47,0.02)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {!dark ? (
              <Box
                sx={{
                  position: "absolute",
                  top: -18,
                  right: -18,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  bgcolor:
                    label === "Verified Users"
                      ? "rgba(231,239,250,0.8)"
                      : "rgba(223,246,238,0.8)",
                }}
              />
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at bottom left, rgba(23,204,143,0.12), transparent 34%)",
                }}
              />
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: dark ? "rgba(23,204,143,0.12)" : "#EFF4FE",
                    color: dark ? "#22D490" : "#0E56C8",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {label === "Verified Users" ? (
                    <HomeWorkOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                  ) : label === "Satisfaction" ? (
                    <VerifiedOutlinedIcon sx={{ fontSize: "1rem" }} />
                  ) : (
                    <BoltRoundedIcon sx={{ fontSize: "1rem" }} />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: dark ? "#8DA4C5" : "#97A4B8",
                    letterSpacing: 2.1,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
              </Stack>
              {dark ? (
                <Chip
                  label="Live"
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: "rgba(23,204,143,0.12)",
                    color: "#22D490",
                    borderRadius: "999px",
                    fontWeight: 700,
                    "& .MuiChip-label": {
                      px: 1.1,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    },
                  }}
                />
              ) : null}
            </Stack>
            <Typography
              sx={{
                mt: 4,
                position: "relative",
                zIndex: 1,
                fontSize: { xs: "3.1rem", md: "3.35rem" },
                lineHeight: 0.95,
                fontWeight: 800,
              }}
            >
              {label === "Satisfaction" ? (
                <CountUpValue
                  target={4.8}
                  decimals={1}
                  suffix=" /5"
                  suffixSx={{ color: "#22D490", fontSize: "2.3rem" }}
                  started={inView}
                />
              ) : label === "Energy Yield" ? (
                <CountUpValue
                  target={2.5}
                  decimals={1}
                  suffix=" GW+"
                  suffixSx={{ color: "#22D490", fontSize: "2.1rem" }}
                  started={inView}
                />
              ) : (
                <CountUpValue target={50000} suffix="+" started={inView} />
              )}
            </Typography>
            <Typography
              sx={{
                mt: 1.35,
                position: "relative",
                zIndex: 1,
                color: dark ? "rgba(255,255,255,0.76)" : "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                fontWeight: 700,
                fontSize: "0.82rem",
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

function ReferralStatsSection() {
  const [ref, inView] = useInView();
  return (
    <Grid ref={ref} container spacing={{ xs: 2.5, md: 3 }}>
      {[
        [14500, "₹", "", "Total Rewards Earned", "Updated 2m ago"],
        [1200, "", "+", "Active Ambassadors", "Growing Daily"],
        [5000, "₹", "", "Per Referral Bonus", "Guaranteed payout and earn extra ₹10,000 for 4 successful referrals"],
      ].map(([target, prefix, suffix, title, foot]) => (
        <Grid key={title} size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              p: { xs: 2.3, md: 2.5 },
              minHeight: 154,
              borderRadius: "2rem",
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color:
                  title === "Total Rewards Earned"
                    ? "#26D08E"
                    : title === "Active Ambassadors"
                      ? "#1C8DFF"
                      : "rgba(255,255,255,0.58)",
                letterSpacing: 1.8,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{ mt: 1.25, fontSize: "1.95rem", fontWeight: 800 }}
            >
              <CountUpValue target={target} prefix={prefix} suffix={suffix} started={inView} />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1.45,
                color: "rgba(255,255,255,0.46)",
                fontSize: "0.82rem",
                textTransform:
                  foot === "Updated 2m ago" || foot === "Growing Daily"
                    ? "uppercase"
                    : "none",
                letterSpacing:
                  foot === "Updated 2m ago" || foot === "Growing Daily"
                    ? 1
                    : 0,
              }}
            >
              {foot === "Updated 2m ago" ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "#20D08D",
                      mr: 0.8,
                      verticalAlign: "middle",
                    }}
                  />
                  {foot}
                </>
              ) : (
                foot
              )}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

function HomePage() {
  const primaryBlueGradient =
    "linear-gradient(180deg, #1A66E8 0%, #0E56C8 100%)";
  const [monthlyBill, setMonthlyBill] = useState(5000);
  const [roofArea, setRoofArea] = useState(800);
  const [pinCode, setPinCode] = useState("560001");
  const [systemType, setSystemType] = useState(systemTypes[0]);
  const [saleSecondsLeft, setSaleSecondsLeft] = useState(
    14 * 60 * 60 + 42 * 60 + 58,
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSaleSecondsLeft((seconds) =>
        seconds > 0 ? seconds - 1 : 14 * 60 * 60 + 42 * 60 + 58,
      );
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const estimate = useMemo(() => {
    const monthlySavings = monthlyBill * 0.68;
    const annualSavings = monthlySavings * 12;
    const roofDrivenKw = roofArea / 110;
    const billDrivenKw = monthlyBill / 1150;
    const recommendedKw = clamp(
      Number(((roofDrivenKw + billDrivenKw) / 2).toFixed(1)),
      2.5,
      12,
    );
    const paybackYears = clamp(5.8 - recommendedKw * 0.18, 3.2, 6.5);
    const co2Reduced = clamp(recommendedKw * 0.84, 2.1, 8.8);

    return {
      monthlySavings,
      annualSavings,
      recommendedKw,
      paybackYears,
      co2Reduced,
    };
  }, [monthlyBill, roofArea]);

  const shareMessage =
    "I found Sparkin Solar helpful for comparing verified solar vendors and savings. Check it out: https://sparkin.in";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sparkin Solar",
          text: shareMessage,
          url: "https://sparkin.in",
        });
        return;
      } catch {
        return;
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareMessage);
    }
  };

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          bgcolor: "#143556",
          backgroundImage: `linear-gradient(90deg, rgba(10,28,45,0.74) 0%, rgba(10,28,45,0.54) 42%, rgba(10,28,45,0.24) 78%), linear-gradient(180deg, rgba(8,26,42,0.42) 0%, rgba(8,26,42,0.38) 100%), url(${heroBackgroundImage})`,
          backgroundPosition: { xs: "center", md: "center 57%" },
          backgroundRepeat: "no-repeat",
          backgroundSize: { xs: "cover", md: "100% auto" },
          color: "white",
          pb: { xs: 2, md: 2 },
          minHeight: { xs: 620, md: "calc(100vh - 72px)" },
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 18%)",
          }}
        />
        <Container
          maxWidth={false}
          disableGutters
          className={styles.heroContainer}
          sx={{
            pt: { xs: 2.5, md: 0 },
            pb: { xs: 2.5, md: 0 },
            position: "relative",
            zIndex: 1,
            minHeight: { xs: 620, md: "calc(100vh - 72px)" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              px: 0,
              py: { xs: 2.5, md: 2 },
              position: "relative",
              minHeight: { xs: 540, md: 570 },
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.03), transparent 40%)",
              }}
            />

            <Grid
              container
              spacing={{ xs: 3, md: 4 }}
              sx={{
                position: "relative",
                zIndex: 1,
                alignItems: "center",
                mt: { xs: 1.5, md: 0.5 },
              }}
            >
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack
                  className={styles.heroContentColumn}
                  sx={{
                    minHeight: { xs: "auto", lg: 430 },
                    maxWidth: { lg: 760 },
                  }}
                >
                  <Stack
                    className={`${styles.heroCopyStack} ${styles.heroRevealPrimary}`}
                    spacing={{ xs: 2.05, md: 2.45 }}
                    alignItems="flex-start"
                  >
                    <Chip
                      label="Trusted by 50,000+ Homeowners"
                      sx={{
                        bgcolor: "#EAFFF5",
                        color: "#0D8D61",
                        fontWeight: 800,
                        letterSpacing: 1.1,
                        textTransform: "uppercase",
                        mb: 1.55,
                        height: 30,
                        borderRadius: 999,
                        fontSize: "0.75rem",
                        px: 1.25,
                      }}
                    />

                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: "2rem", md: "3.18rem" },
                        lineHeight: { xs: 1.08, md: 1.08 },
                        letterSpacing: "-0.03em",
                        maxWidth: 690,
                        fontWeight: 900,
                      }}
                    >
                      <Box component="span" sx={{ color: "#2299FF" }}>
                        Switch to Solar Save More,
                      </Box>
                      <br />
                      <Box component="span" sx={{ color: "#32E0A0" }}>
                        Live Smarter.
                      </Box>
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        maxWidth: 650,
                        lineHeight: 1.52,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.88)",
                        fontSize: { xs: "0.92rem", md: "1rem" },
                      }}
                    >
                      Compare solar costs, choose trusted vendors, and install
                      your system with complete transparency — from quote to
                      installation.
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.15}
                      sx={{ pt: 1.05 }}
                    >
                      <Button
                        component={RouterLink}
                        to="/calculator"
                        variant="contained"
                        size="large"
                        startIcon={<BoltRoundedIcon />}
                        className={styles.blueCta}
                        sx={{
                          minWidth: 230,
                          minHeight: 54,
                          fontSize: "0.98rem",
                          borderRadius: "0.8rem",
                          background:
                            primaryBlueGradient,
                          boxShadow: "0 16px 34px rgba(14,86,200,0.26)",
                        }}
                      >
                        Calculate Savings
                      </Button>

                      <Button
                        component={RouterLink}
                        to="/booking"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          minWidth: 220,
                          minHeight: 54,
                          fontSize: "0.98rem",
                          borderRadius: "0.8rem",
                          bgcolor: "white",
                          color: "#10192F",
                          "&:hover": { bgcolor: "#F8FBFF" },
                        }}
                      >
                        Get Free Quotes
                      </Button>
                    </Stack>
                  </Stack>

                  <Stack
                    className={`${styles.heroStatsRow} ${styles.heroRevealStats}`}
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 2.3, md: 4.8 }}
                    sx={{
                      mt: { xs: 3.6, md: 4.2 },
                      pt: 0,
                      width: "100%",
                    }}
                  >
                    {heroStats.map((stat) => (
                      <Stack
                        key={stat.label}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            bgcolor: "white",
                            display: "grid",
                            placeItems: "center",
                            color: "primary.main",
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "1.42rem",
                              lineHeight: 1,
                              fontWeight: 800,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              textTransform: "uppercase",
                              opacity: 0.76,
                              letterSpacing: 0.5,
                              fontSize: "0.7rem",
                              fontWeight: 800,
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Box
                  className={styles.heroRevealCard}
                  sx={{
                    ml: { lg: "auto" },
                    mt: { xs: 2.4, lg: 2.6 },
                    maxWidth: 374,
                    borderRadius: "1.55rem",
                    p: 1.65,
                    bgcolor: "rgba(255,255,255,0.68)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.34)",
                    boxShadow: "0 22px 58px rgba(8, 20, 40, 0.22)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ px: 0.6, py: 0.45, mb: 1 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8DA2BC",
                        fontWeight: 800,
                        letterSpacing: 2,
                      }}
                    >
                      LIVE VENDOR BIDS
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/quotes/compare"
                      variant="text"
                      sx={{
                        minWidth: 0,
                        px: 0,
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        textTransform: "none",
                      }}
                    >
                      View All
                    </Button>
                  </Stack>

                  <Stack spacing={1.5}>
                    {bidCards.map((bid) => (
                      <Box
                        key={bid.name}
                        className={styles.animatedSurface}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.45,
                          borderRadius: "1rem",
                          bgcolor: "rgba(255,255,255,0.74)",
                          border: "1px solid rgba(255,255,255,0.64)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: bid.tone,
                            display: "grid",
                            placeItems: "center",
                            color: "#0E56C8",
                            fontWeight: 800,
                          }}
                        >
                          {bid.initials}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: "#10192F",
                              fontWeight: 800,
                            fontSize: "0.92rem",
                            }}
                          >
                            {bid.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#F5B400", fontSize: "0.78rem" }}
                          >
                            {"★★★★★"} 4.8
                          </Typography>
                        </Box>

                        <Stack alignItems="flex-end">
                          <Typography
                            sx={{
                              color: "#10192F",
                              fontWeight: 800,
                              fontSize: "0.95rem",
                            }}
                          >
                            {bid.price}
                          </Typography>
                          <Chip
                            label={bid.tag}
                            size="small"
                            sx={{
                              bgcolor: "#EAF5FF",
                              color: "#0E56C8",
                              fontWeight: 700,
                              borderRadius: "0.5rem",
                            }}
                          />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    ml: { lg: "auto" },
                    maxWidth: 374,
                    borderRadius: "1rem",
                    px: 2.2,
                    py: 1.2,
                    bgcolor: "rgba(255,255,255,0.76)",
                    backdropFilter: "blur(16px)",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#5B677A",
                    fontWeight: 700,
                  }}
                >
                  <Typography variant="body2">
                    Warranty Backed Systems
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#13C784" }}>
                    Secure
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          pt: { xs: 6.5, md: 9 },
          pb: { xs: 9, md: 12 },
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Box
            sx={{
              bgcolor: "#0F1830",
              color: "white",
              borderRadius: "2rem",
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(15,24,48,0.18)",
              mb: { xs: 8.5, md: 11 },
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 2.25, md: 3.25 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <SettingsSuggestRoundedIcon sx={{ color: "#18CA8C" }} />
                  <Typography sx={{ fontSize: "1.55rem", fontWeight: 800 }}>
                    Solar Savings Tool
                  </Typography>
                </Stack>
                <Typography
                  color="rgba(255,255,255,0.56)"
                  sx={{ mb: 2.5, fontSize: "0.9rem" }}
                >
                  Fine-tune your parameters for a precision estimate.
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.62)",
                          textTransform: "uppercase",
                        }}
                      >
                        Avg. Monthly Bill
                      </Typography>
                      <Typography sx={{ fontSize: "1.45rem", fontWeight: 800 }}>
                        {formatInr(monthlyBill)}
                      </Typography>
                    </Stack>
                    <Slider
                      value={monthlyBill}
                      min={2000}
                      max={15000}
                      step={250}
                      onChange={(_, value) =>
                        setMonthlyBill(Array.isArray(value) ? value[0] : value)
                      }
                      sx={{ color: "#19C98B" }}
                    />
                  </Box>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.62)",
                          textTransform: "uppercase",
                        }}
                      >
                        Roof Area (sq ft)
                      </Typography>
                      <Typography sx={{ fontSize: "1.45rem", fontWeight: 800 }}>
                        {roofArea}
                      </Typography>
                    </Stack>
                    <Slider
                      value={roofArea}
                      min={400}
                      max={2200}
                      step={50}
                      onChange={(_, value) =>
                        setRoofArea(Array.isArray(value) ? value[0] : value)
                      }
                      sx={{ color: "#19C98B" }}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        value={pinCode}
                        onChange={(event) => setPinCode(event.target.value)}
                        label="Pin Code"
                        InputProps={{
                          sx: {
                            borderRadius: "1rem",
                            bgcolor: "#111D38",
                            color: "white",
                            height: 44,
                          },
                        }}
                        InputLabelProps={{
                          sx: { color: "rgba(255,255,255,0.54)" },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        value={systemType}
                        onChange={(event) => setSystemType(event.target.value)}
                        label="System Type"
                        InputProps={{
                          sx: {
                            borderRadius: "1rem",
                            bgcolor: "#111D38",
                            color: "white",
                            height: 44,
                          },
                        }}
                        InputLabelProps={{
                          sx: { color: "rgba(255,255,255,0.54)" },
                        }}
                      >
                        {systemTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                  p: { xs: 2.25, md: 3.25 },
                  background:
                    "linear-gradient(180deg, rgba(18,30,57,0.9) 0%, rgba(8,44,46,0.95) 100%)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#72C8AF", fontWeight: 800, letterSpacing: 2 }}
                >
                  Estimated Annual Savings
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: { xs: "2.35rem", md: "3.2rem" },
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {formatInr(estimate.annualSavings)}
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 2 }}>
                  {[
                    ["Recommended System", `${estimate.recommendedKw} kW`],
                    ["Payback Period", `${estimate.paybackYears.toFixed(1)} Years`],
                    ["CO2 Reduced", `${estimate.co2Reduced.toFixed(1)} Tons/yr`],
                  ].map(([label, value]) => (
                    <Box
                      key={label}
                      sx={{
                        px: 1.75,
                        py: 1.35,
                        borderRadius: "1rem",
                        bgcolor: "rgba(255,255,255,0.06)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ color: "rgba(255,255,255,0.64)" }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Button
                  component={RouterLink}
                  to="/calculator/results"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardRoundedIcon />}
                  className={styles.blueCta}
                  sx={{
                    mt: 2.5,
                    minHeight: 52,
                    fontSize: "0.98rem",
                    borderRadius: "0.5rem",
                    background: primaryBlueGradient,
                    boxShadow: "0 10px 22px rgba(14,86,200,0.18)",
                  }}
                >
                  See Full Report
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "rgba(255,255,255,0.34)",
                  }}
                >
                  Preview built from monthly bill, roof area, pincode, and {systemType.toLowerCase()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
          sx={{ mt: { xs: 8.5, md: 11 } }}
        >
          <Stack
            spacing={1.35}
            alignItems="center"
            textAlign="center"
            sx={{ maxWidth: 620, mx: "auto" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "2.35rem" },
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#10192F",
              }}
            >
              Simple Path
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.95rem", md: "2.25rem" },
                lineHeight: 1.06,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#18CA8C",
              }}
            >
              Energy Independence
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                pt: 0.85,
                fontSize: "0.94rem",
                lineHeight: 1.8,
                color: "#738198",
              }}
            >
              From calculation to installation, we guide you every step of the
              way. Experience a curated transition to sustainable living.
            </Typography>
          </Stack>

          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            sx={{ mt: { xs: 6.5, md: 8 } }}
          >
            {steps.map((step) => (
              <Grid
                key={step.number}
                size={{ xs: 12, md: 4 }}
                sx={{ display: "flex" }}
              >
                <Box
                  className={styles.animatedSurface}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "2rem",
                    p: { xs: 2.5, md: 2.75 },
                    minHeight: 258,
                    bgcolor: step.dark ? "#10192F" : "white",
                    color: step.dark ? "white" : "#10192F",
                    border: step.dark ? "none" : "1px solid #E8EDF4",
                    boxShadow: step.dark
                      ? "0 18px 40px rgba(16,25,47,0.12)"
                      : "0 18px 40px rgba(16,25,47,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "1rem",
                      bgcolor: step.dark ? "#19C98B" : "#0E56C8",
                      display: "grid",
                      placeItems: "center",
                      mb: 2.4,
                      color: "white",
                    }}
                  >
                    {step.number === "01" ? (
                      <PaidOutlinedIcon />
                    ) : step.number === "02" ? (
                      <ArrowForwardRoundedIcon />
                    ) : (
                      <MiscellaneousServicesRoundedIcon />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 18,
                      right: 22,
                      fontSize: "4rem",
                      fontWeight: 800,
                      color: step.dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(16,25,47,0.04)",
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 1.2,
                      fontSize: "1.2rem",
                      lineHeight: 1.2,
                      fontWeight: 800,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    color={
                      step.dark ? "rgba(255,255,255,0.72)" : "text.secondary"
                    }
                    sx={{
                      lineHeight: 1.72,
                      fontSize: "0.84rem",
                      mt: "auto",
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          color: "white",
          background:
            "linear-gradient(90deg, #04091C 0%, #04091C 78%, #072132 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Grid
            container
            spacing={{ xs: 4, md: 6 }}
            alignItems="center"
            sx={{ py: { xs: 7, md: 8.5 } }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ maxWidth: 460 }}>
                <Chip
                  label="Limited Time Offer"
                  sx={{
                    height: 30,
                    px: 0.65,
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "#C7D6F4",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "999px",
                    fontWeight: 800,
                    letterSpacing: 1.4,
                    mb: 3.25,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.6rem", md: "4rem" },
                    lineHeight: 0.98,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Great Solar
                  <br />
                  <Box component="span" sx={{ color: "#2392FF" }}>
                    Summer
                  </Box>{" "}
                  <Box component="span" sx={{ color: "#27D28F" }}>
                    Sale
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    mt: 3,
                    fontSize: { xs: "1.02rem", md: "1.08rem" },
                    maxWidth: 380,
                    color: "rgba(255,255,255,0.84)",
                    lineHeight: 1.45,
                    fontWeight: 600,
                  }}
                >
                  Save an Extra{" "}
                  <Box
                    component="span"
                    sx={{
                      bgcolor: "#123E44",
                      px: 1.15,
                      py: 0.15,
                      borderRadius: "999px",
                      border: "1px solid rgba(39,210,143,0.14)",
                    }}
                  >
                    {"\u20B915,000"}
                  </Box>{" "}
                  on every installation.
                </Typography>
                <Stack spacing={1.55} sx={{ mt: 4.25, maxWidth: 255 }}>
                  <Button
                    component={RouterLink}
                    to="/booking"
                    variant="contained"
                    endIcon={<LocalOfferOutlinedIcon />}
                    className={styles.blueCta}
                    sx={{
                      minHeight: 58,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      background: primaryBlueGradient,
                      boxShadow: "0 14px 30px rgba(21,104,230,0.28)",
                    }}
                  >
                    Claim Your Discount
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="contained"
                    startIcon={<IosShareRoundedIcon />}
                    sx={{
                      minHeight: 58,
                      borderRadius: "0.5rem",
                      bgcolor: "rgba(255,255,255,0.06)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "none",
                    }}
                  >
                    Share This Sale
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                alignItems={{ xs: "stretch", md: "flex-end" }}
                spacing={2.5}
              >
                <Box
                  className={styles.animatedSurface}
                  sx={{
                    width: "100%",
                    maxWidth: 396,
                    p: { xs: 3, md: 4 },
                    borderRadius: "2.1rem",
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.16)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.48)",
                      letterSpacing: 4,
                      fontWeight: 700,
                    }}
                  >
                    OFFER ENDS IN
                  </Typography>
                  <Stack
                    direction="row"
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "rgba(255,255,255,0.08)" }}
                      />
                    }
                    sx={{ mt: 3.2 }}
                  >
                    {formatTimer(saleSecondsLeft).map(([value, label]) => (
                      <Box key={label} sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "2.55rem", md: "3.05rem" },
                            fontWeight: 800,
                            lineHeight: 1,
                            color: label === "Secs" ? "#27D28F" : "white",
                          }}
                        >
                          {value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            display: "block",
                            color: "rgba(255,255,255,0.42)",
                            letterSpacing: 1.6,
                            fontWeight: 700,
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    width: "100%",
                    maxWidth: 396,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  <ShieldOutlinedIcon
                    sx={{ color: "#13C784", fontSize: "1.1rem" }}
                  />
                  <Typography sx={{ fontSize: "0.98rem", fontWeight: 600 }}>
                    Terms & Conditions apply. Valid till Jan 31st.
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: "#0F56A8",
          color: "white",
          py: { xs: 5.5, md: 6.5 },
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Grid
            container
            spacing={{ xs: 4, md: 5 }}
            alignItems="center"
            sx={{
              borderLeft: "1px dashed rgba(116,197,255,0.28)",
              borderRight: "1px dashed rgba(116,197,255,0.28)",
              px: { xs: 1.5, md: 2.5 },
            }}
          >
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#26D08E",
                  fontWeight: 800,
                  letterSpacing: 2.6,
                }}
              >
                Intelligent Analysis
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: 1.15,
                  fontSize: { xs: "2.4rem", md: "3.8rem" },
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                  maxWidth: 430,
                }}
              >
                Precision Power Analysis.
              </Typography>
              <Typography
                sx={{
                  mt: 2.3,
                  maxWidth: 430,
                  color: "rgba(255,255,255,0.84)",
                  lineHeight: 1.6,
                  fontSize: "0.96rem",
                }}
              >
                We&apos;ve vetted the industry&apos;s most reliable
                manufacturers. Compare hardware specs, warranty lifecycles, and
                installation authority in one unified view.
              </Typography>
              <Stack spacing={1.15} sx={{ mt: 3.25, maxWidth: 435 }}>
                {[
                  "Save up to \u20B98,000/month",
                  "4-6 Lakhs savings in 5 years",
                  "Payback in 3-4 years",
                ].map((item) => (
                  <Box
                    className={styles.animatedSurface}
                    key={item}
                    sx={{
                      px: 1.3,
                      py: 1.25,
                      borderRadius: "1rem",
                      bgcolor: "rgba(197,223,245,0.58)",
                      color: "#19324E",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "white",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{ color: "#1CCF8E", fontSize: "1rem" }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" spacing={5} sx={{ mt: 4.5 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#26D08E",
                    }}
                  >
                    25Y
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.72,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      fontSize: "0.74rem",
                    }}
                  >
                    System Life
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#26D08E",
                    }}
                  >
                    ~14%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.72,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      fontSize: "0.74rem",
                    }}
                  >
                    Avg. ROI
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                className={styles.animatedSurface}
                sx={{
                  p: { xs: 2, md: 2.35 },
                  borderRadius: "2rem",
                  bgcolor: "#10192F",
                  boxShadow: "0 22px 60px rgba(9,18,45,0.22)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 1.1, py: 0.9, mb: 1.8 }}
                >
                  <Stack direction="row" spacing={1.1} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "#0C2D62",
                        display: "grid",
                        placeItems: "center",
                        color: "#1C8DFF",
                      }}
                    >
                      <TrendingUpRoundedIcon sx={{ fontSize: "1rem" }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                        Savings Projection
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.52)",
                          fontSize: "0.78rem",
                        }}
                      >
                        Estimated monthly performance
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      p: 0.45,
                      borderRadius: "999px",
                      bgcolor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <Chip
                      label="Financial"
                      sx={{
                        bgcolor: "white",
                        fontWeight: 700,
                        height: 28,
                        "& .MuiChip-label": { px: 1.4 },
                      }}
                    />
                    <Chip
                      label="Impact"
                      sx={{
                        bgcolor: "transparent",
                        color: "rgba(255,255,255,0.5)",
                        height: 28,
                        "& .MuiChip-label": { px: 1.1 },
                      }}
                    />
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    height: 240,
                    borderRadius: "1.5rem",
                    bgcolor: "#141F39",
                    p: { xs: 1.7, md: 2.2 },
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1.5,
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[0.36, 0.52, 0.64, 0.78, 0.88, 0.84].map((height, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        height: `${height * 100}%`,
                        borderRadius: "16px 16px 0 0",
                        background:
                          "linear-gradient(180deg, #22D490 0%, #105B5D 100%)",
                      }}
                    />
                  ))}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 28,
                      right: 24,
                      px: 2.1,
                      py: 1.1,
                      borderRadius: "1.15rem",
                      bgcolor: "rgba(20,55,63,0.95)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.54)",
                        letterSpacing: 1.3,
                      }}
                    >
                      Peak Monthly Savings
                    </Typography>
                    <Typography
                      sx={{
                        color: "#26D08E",
                        fontWeight: 800,
                        fontSize: "1.75rem",
                      }}
                    >
                      {"\u20B98,400"}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={1.25} sx={{ mt: 1.35 }}>
                  {[
                    ["Monthly", "\u20B98.4K"],
                    ["5-Year ROI", "\u20B95.2L"],
                    ["Payback", "3.2 Years"],
                  ].map(([label, value], index) => (
                    <Grid key={label} size={{ xs: 12, sm: 4 }}>
                      <Box
                        sx={{
                          p: 1.55,
                          borderRadius: "1.15rem",
                          bgcolor: index === 2 ? "#0E56C8" : "#141F39",
                          border:
                            index === 2
                              ? "none"
                              : "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.54)",
                            letterSpacing: 1.4,
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          sx={{ mt: 0.35, fontWeight: 800, fontSize: "1.1rem" }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 5.5, md: 6.75 }, bgcolor: "white" }}>
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <StatsSection />
        </Container>
      </Box>

      <Box
        sx={{
          bgcolor: "#10192F",
          color: "white",
          py: { xs: 5.5, md: 7.25 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -40,
            width: 300,
            height: 220,
            opacity: 0.14,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 25% 28%, rgba(130,150,190,0.6) 0 22px, transparent 23px), linear-gradient(32deg, transparent 0 60%, rgba(130,150,190,0.48) 60% 66%, transparent 66%), linear-gradient(145deg, transparent 0 44%, rgba(130,150,190,0.38) 44% 50%, transparent 50%)",
          }}
        />
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Grid container spacing={4.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.55rem", md: "4rem" },
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  maxWidth: 480,
                }}
              >
                Empower your
                <br />
                neighbors.{" "}
                <Box component="span" sx={{ color: "#20D08D" }}>
                  Get
                </Box>
                <br />
                <Box component="span" sx={{ color: "#20D08D" }}>
                  rewarded.
                </Box>
              </Typography>
              <Typography
                sx={{
                  mt: 2.5,
                  maxWidth: 450,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                  fontSize: "0.98rem",
                }}
              >
                Refer a friend to Sparkin and earn {"\u20B95,000"} for every
                successful installation.
              </Typography>
              <Button
                component={RouterLink}
                to="/auth/signup"
                variant="contained"
                className={styles.blueCta}
                sx={{
                  mt: 3,
                  minWidth: 228,
                  minHeight: 56,
                  borderRadius: "0.75rem",
                  fontSize: "0.98rem",
                  fontWeight: 700,
                  background: primaryBlueGradient,
                  boxShadow: "0 14px 30px rgba(14,86,200,0.18)",
                }}
              >
                Start Referring Now
              </Button>
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mt: { xs: 5, md: 5.5 }, mb: 3.1 }}
          >
            <Box
              sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,0.08)" }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.34)",
                letterSpacing: 3.2,
                fontWeight: 700,
              }}
            >
              Live Community Impact
            </Typography>
            <Box
              sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,0.08)" }}
            />
          </Stack>
          <ReferralStatsSection />
        </Container>
      </Box>

      <Box
        sx={{
          pt: { xs: 6.5, md: 7.5 },
          pb: { xs: 5.5, md: 6.5 },
          bgcolor: "#FAFBFD",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack
            spacing={1.25}
            alignItems="center"
            textAlign="center"
            sx={{ maxWidth: 720, mx: "auto" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", md: "3rem" },
                lineHeight: 1.06,
                letterSpacing: "-0.04em",
              }}
            >
              Our Promises to You
            </Typography>
            <Typography
              sx={{
                maxWidth: 560,
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.02rem" },
                lineHeight: 1.65,
              }}
            >
              We&apos;re more than just a platform; we&apos;re your long-term
              partner in clean energy.
            </Typography>
          </Stack>
          <Grid container spacing={{ xs: 2.25, md: 3 }} sx={{ mt: 4 }}>
            {promiseCards.map((card, index) => (
              <Grid
                key={card.title}
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{ display: "flex" }}
              >
                <Box
                  className={styles.animatedSurface}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: { xs: 2.5, md: 3 },
                    minHeight: 348,
                    borderRadius: "2rem",
                    bgcolor: "white",
                    border: "1px solid #EBEFF5",
                    boxShadow: "0 8px 24px rgba(16,25,47,0.03)",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "1rem",
                      bgcolor:
                        index === 1 || index === 3 ? "#EEF4FF" : "#EAFBF3",
                      display: "grid",
                      placeItems: "center",
                      mb: 3.1,
                      color: index === 1 || index === 3 ? "#256BFF" : "#13C784",
                    }}
                  >
                    {index === 1 ? (
                      <PaidOutlinedIcon />
                    ) : index === 2 ? (
                      <CheckCircleRoundedIcon />
                    ) : index === 3 ? (
                      <TrendingUpRoundedIcon />
                    ) : (
                      <VerifiedOutlinedIcon />
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1.45,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      lineHeight: 1.35,
                      maxWidth: 190,
                      color: "#18253A",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      maxWidth: 210,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      flex: 1,
                    }}
                  >
                    {card.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: { xs: 9.5, md: 12 } }}>
            <Stack
              spacing={1.25}
              alignItems="center"
              textAlign="center"
              sx={{ maxWidth: 760, mx: "auto" }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  lineHeight: 1.06,
                  letterSpacing: "-0.04em",
                }}
              >
                Exclusive Solar Offers & Savings
              </Typography>
              <Typography
                sx={{
                  maxWidth: 620,
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.02rem" },
                  lineHeight: 1.65,
                }}
              >
                Maximize your investment with the latest government incentives
                and Sparkin exclusive deals.
              </Typography>
            </Stack>
            <Grid container spacing={{ xs: 2.25, md: 3 }} sx={{ mt: 4 }}>
              {offers.map((offer) => (
                <Grid
                  key={offer.title}
                  size={{ xs: 12, md: 4 }}
                  sx={{ display: "flex" }}
                >
                <Box
                  className={styles.animatedSurface}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: { xs: 2.5, md: 2.7 },
                    minHeight: 288,
                    borderRadius: "2rem",
                    bgcolor: "white",
                    border: "1px solid #E7EDF4",
                    boxShadow: "0 8px 24px rgba(16,25,47,0.03)",
                  }}
                >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3.1 }}
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          bgcolor:
                            offer.badge === "Limited Time"
                              ? "#EAFBF3"
                              : "#EFF5FF",
                          display: "grid",
                          placeItems: "center",
                          color:
                            offer.badge === "Limited Time"
                              ? "#13C784"
                              : "#0E56C8",
                        }}
                      >
                        {offer.badge === "Govt Scheme" ? (
                          <HomeWorkOutlinedIcon fontSize="small" />
                        ) : offer.badge === "Limited Time" ? (
                          <BoltRoundedIcon fontSize="small" />
                        ) : (
                          <PaidOutlinedIcon fontSize="small" />
                        )}
                      </Box>
                      <Chip
                        label={offer.badge}
                        size="small"
                        sx={{
                          bgcolor:
                            offer.badge === "Limited Time"
                              ? "#EAFBF3"
                              : "#EEF7FF",
                          color:
                            offer.badge === "Limited Time"
                              ? "#0D8D61"
                              : "#0E56C8",
                          fontWeight: 700,
                          borderRadius: "999px",
                          "& .MuiChip-label": {
                            px: 1.1,
                            letterSpacing: 0.5,
                          },
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 1.4,
                        fontSize: "1.08rem",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        maxWidth: 230,
                        color: "#18253A",
                      }}
                    >
                      {offer.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        maxWidth: 250,
                        lineHeight: 1.75,
                        fontSize: "0.95rem",
                        flex: 1,
                      }}
                    >
                      {offer.text}
                    </Typography>
                    <Divider sx={{ mt: 3.4, borderColor: "#E8EDF4" }} />
                    <Button
                      component={RouterLink}
                      to={offer.href}
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        mt: 2.2,
                        px: 0,
                        color: "primary.main",
                        fontWeight: 800,
                        letterSpacing: 0.4,
                      }}
                    >
                      {offer.action}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8.5, md: 10.5 }, bgcolor: "white" }}>
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack
            spacing={1.25}
            alignItems="center"
            textAlign="center"
            sx={{ maxWidth: 760, mx: "auto" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", md: "3rem" },
                lineHeight: 1.06,
                letterSpacing: "-0.04em",
              }}
            >
              Support Beyond Installation
            </Typography>
            <Typography
              sx={{
                maxWidth: 620,
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.02rem" },
                lineHeight: 1.65,
              }}
            >
              Our lifetime service ecosystem ensures your energy production
              remains at peak efficiency through specialized care.
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ mt: 5.25 }}>
            {serviceCards.map((card) => (
              <Grid
                key={card.title}
                size={{ xs: 12, md: 4 }}
                sx={{ display: "flex" }}
              >
                <Box
                  className={styles.animatedSurface}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "2.25rem",
                    overflow: "hidden",
                    minHeight: 438,
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 12px 28px rgba(16,25,47,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(16,25,47,0.1) 48%, rgba(16,25,47,0.65) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: { xs: 18, md: 28 },
                      right: { xs: 18, md: 28 },
                      bottom: { xs: 18, md: 28 },
                      p: { xs: 1.85, md: 2 },
                      minHeight: { xs: 182, md: 178 },
                      borderRadius: "1.45rem",
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(20px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          bgcolor: "rgba(255,255,255,0.16)",
                          border: "1px solid rgba(255,255,255,0.28)",
                          display: "grid",
                          placeItems: "center",
                          mb: 1.55,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{ fontSize: "1.08rem", mb: 0.8, maxWidth: 220 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.76)",
                          lineHeight: 1.55,
                          fontSize: "0.82rem",
                          maxWidth: 235,
                          minHeight: 62,
                        }}
                      >
                        {card.text}
                      </Typography>
                    </Box>
                    <Button
                      component={RouterLink}
                      to={card.href}
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        mt: 1.55,
                        px: 0,
                        color: "white",
                        fontWeight: 800,
                        letterSpacing: 0.5,
                      }}
                    >
                      {card.action}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: { xs: 11, md: 13.5 } }}>
            <Stack
              spacing={1.2}
              alignItems="center"
              textAlign="center"
              sx={{ maxWidth: 760, mx: "auto" }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  maxWidth: 760,
                }}
              >
                Trusted by thousands of{" "}
                <Box component="span" sx={{ color: "#20D08D" }}>
                  energy-independent
                </Box>{" "}
                homes
              </Typography>
              <Typography
                sx={{
                  maxWidth: 540,
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.02rem" },
                  lineHeight: 1.65,
                }}
              >
                Real stories from homeowners who made the switch.
              </Typography>
            </Stack>
            <Grid container spacing={{ xs: 2.25, md: 3 }} sx={{ mt: 5 }}>
              {testimonials.map((item) => (
                <Grid
                  key={item.name}
                  size={{ xs: 12, md: 4 }}
                  sx={{ display: "flex" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 2.5, md: 2.7 },
                      minHeight: 286,
                      borderRadius: "2rem",
                      border: "1px solid #E8EDF4",
                      bgcolor: "white",
                      boxShadow: "0 8px 24px rgba(16,25,47,0.03)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#FFB400",
                        fontSize: "1.15rem",
                        mb: 2.25,
                        letterSpacing: 0.08,
                      }}
                    >
                      {"\u2605\u2605\u2605\u2605\u2605"}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.9,
                        fontSize: "0.95rem",
                        minHeight: 124,
                      }}
                    >
                      {item.quote}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mt: "auto", pt: 3.2 }}
                    >
                      <Box
                        component="img"
                        src={item.avatar}
                        alt={item.name}
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                          boxShadow: "0 4px 10px rgba(16,25,47,0.12)",
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#98A4B5",
                            textTransform: "uppercase",
                            letterSpacing: 1.1,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          {item.city}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: { xs: 10, md: 12 } }}>
            <Stack
              spacing={1.15}
              alignItems="center"
              textAlign="center"
              sx={{ maxWidth: 760, mx: "auto" }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.04em",
                  maxWidth: 700,
                }}
              >
                Common questions about switching to solar
              </Typography>
            </Stack>
            <Stack spacing={1.8} sx={{ mt: 6.25 }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={faq.question}
                  defaultExpanded={index === 0}
                  sx={{
                    borderRadius: "1.5rem !important",
                    border: "1px solid #AEBBCC",
                    boxShadow: "none",
                    overflow: "hidden",
                    bgcolor: "transparent",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreRoundedIcon sx={{ color: "#8FA0B5" }} />
                    }
                    sx={{
                      minHeight: 78,
                      px: 3,
                      "& .MuiAccordionSummary-content": {
                        my: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "#18253A",
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0.25 }}>
                    <Typography color="text.secondary" lineHeight={1.8}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pt: { xs: 6.5, md: 8 }, pb: 0, bgcolor: "#E9EEF7" }}>
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
          sx={{
            py: { xs: 6.75, md: 8.25 },
            px: { xs: 3, md: 6 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.25rem" },
              maxWidth: 900,
              mx: "auto",
              lineHeight: 1.14,
              letterSpacing: "-0.04em",
            }}
          >
            Harness the sun&apos;s brilliance for a legacy of sustainability.
          </Typography>
          <Button
            component={RouterLink}
            to="/booking"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            className={styles.blueCta}
            sx={{
              mt: 3.25,
              minWidth: 224,
              minHeight: 52,
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              background: primaryBlueGradient,
              boxShadow: "0 10px 22px rgba(14,86,200,0.18)",
            }}
          >
            Get My Free Quote
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;

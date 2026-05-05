import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing } from "@/features/public/pages/publicPageStyles";
import { leadsApi } from "@/features/public/api/leadsApi";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return rupeeFormatter.format(Number(value || 0));
}

const paymentMethods = [
  {
    id: "upi",
    label: "UPI (GPay, PhonePe, Paytm)",
    subtitle: "Instant confirmation via your mobile app",
    icon: <PhoneAndroidOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay, Amex",
    icon: <CreditCardOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
  },
  {
    id: "net_banking",
    label: "Net Banking",
    subtitle: "All major Indian banks supported",
    icon: <AccountBalanceOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
  },
];

const whyItems = [
  {
    title: "Verified Quotes Only",
    description:
      "Ensure you only get quotes from pre-vetted, Tier-1 installers who have the capacity to take on your project.",
    icon: <VerifiedOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
    color: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Priority Engineering",
    description:
      "Your roof plan is sent for priority shade analysis and electrical layout design by our in-house experts.",
    icon: <WbSunnyOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
    color: "#7A6B00",
    bg: "#FFF8D6",
  },
  {
    title: "Guaranteed Savings",
    description:
      "Users who pay the commitment fee save an average of ₹18,000 on their final installation cost through bulk-bidding.",
    icon: <GppGoodOutlinedIcon sx={{ fontSize: "1.1rem" }} />,
    color: "#0E7A4A",
    bg: "#E4F7EE",
  },
];

function TrustBadge({ icon, title, subtitle }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "0.7rem",
          bgcolor: "#E4F7EE",
          color: "#0E7A4A",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{ color: "#202938", fontSize: "0.78rem", fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ color: "#6E7B8C", fontSize: "0.66rem", lineHeight: 1.4 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function BookingPaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const leadId = state?.leadId;

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!leadId) {
      navigate("/booking", { replace: true });
      return;
    }

    let active = true;
    setLoading(true);

    leadsApi
      .getLead(leadId)
      .then((data) => {
        if (active) {
          setLead(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(
            err?.response?.data?.message ||
              err.message ||
              "Could not load booking details.",
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [leadId, navigate]);

  // Derive values from lead
  const systemSizeKw =
    lead?.adminSystemSizeKw || lead?.property?.sanctionedLoadKw || 5;
  const estimatedTotal = lead?.estimatedCost || systemSizeKw * 65000;
  const commitmentFee = Math.round(estimatedTotal * 0.1);
  const location = [
    lead?.installationAddress?.city,
    lead?.installationAddress?.state,
  ]
    .filter(Boolean)
    .join(", ");
  const systemLabel = `${systemSizeKw}kW Residential Solar`;

  async function handlePay() {
    setPayError("");
    setIsPaying(true);

    try {
      // Mark commitment fee as paid in backend
      await leadsApi.markCommitmentPaid(leadId);
      navigate("/booking/submitted", {
        replace: true,
        state: { leadId, paymentDone: true },
      });
    } catch (err) {
      setPayError(
        err?.response?.data?.message ||
          err.message ||
          "Payment could not be processed. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  if (loading) {
    return (
      <Box
        className={styles.pageShell}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={36} sx={{ color: "#0E56C8" }} />
      </Box>
    );
  }

  if (loadError || !lead) {
    return (
      <Box className={styles.pageShell}>
        <Box
          sx={{
            py: publicPageSpacing.pageYCompact,
            minHeight: "calc(100vh - 72px)",
            background:
              "radial-gradient(circle at top center, rgba(214,229,246,0.78) 0%, rgba(244,248,251,0.97) 24%, #F9FBFD 64%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            alignItems="center"
            spacing={2}
            sx={{ textAlign: "center", px: 2 }}
          >
            <Typography
              sx={{ color: "#202938", fontSize: "1.1rem", fontWeight: 700 }}
            >
              {loadError || "Booking not found"}
            </Typography>
            <Button
              component={RouterLink}
              to="/booking"
              variant="contained"
              sx={{
                minHeight: 44,
                borderRadius: "0.85rem",
                fontWeight: 700,
                fontSize: "0.86rem",
                textTransform: "none",
                background: "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
              }}
            >
              Start New Booking
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          py: publicPageSpacing.pageYCompact,
          minHeight: "calc(100vh - 72px)",
          bgcolor: "#F0F4F8",
        }}
      >
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                color: "#18253A",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Confirm Your Solar Request
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: "#5E6A7D",
                fontSize: "0.96rem",
                lineHeight: 1.6,
              }}
            >
              Pay 10% commitment fee to start receiving verified vendor quotes
              and personalized engineering plans.
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="flex-start">
            {/* LEFT COLUMN */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5}>
                {/* Hero card with system info */}
                <Box
                  sx={{
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E4EAF2",
                    boxShadow: "0 4px 20px rgba(20,34,56,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      background:
                        "linear-gradient(135deg, #0E56C8 0%, #1BC17B 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      px: 2.5,
                      pb: 2,
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          px: 0.9,
                          py: 0.3,
                          borderRadius: "0.4rem",
                          bgcolor: "#D7E600",
                          color: "#3C4700",
                          fontSize: "0.58rem",
                          fontWeight: 950,
                          letterSpacing: "0.06em",
                          width: "fit-content",
                        }}
                      >
                        ACTIVE REQUEST
                      </Box>
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "1.25rem",
                          fontWeight: 800,
                        }}
                      >
                        {systemLabel}
                      </Typography>
                      {location ? (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <LocationOnOutlinedIcon
                            sx={{
                              fontSize: "0.8rem",
                              color: "rgba(255,255,255,0.8)",
                            }}
                          />
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.85)",
                              fontSize: "0.76rem",
                            }}
                          >
                            {location}
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  </Box>

                  {/* Customer Details */}
                  <Box sx={{ px: 2.5, py: 2.2 }}>
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                      sx={{ mb: 1.8 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          bgcolor: "#EAF1FF",
                          color: "#0E56C8",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.6rem", fontWeight: 900 }}
                        >
                          👤
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                        }}
                      >
                        Customer Details
                      </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            color: "#8A96A8",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            mb: 0.4,
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.92rem",
                            fontWeight: 700,
                          }}
                        >
                          {lead.contact?.fullName || "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            color: "#8A96A8",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            mb: 0.4,
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.92rem",
                            fontWeight: 700,
                          }}
                        >
                          {lead.contact?.phoneNumber || "—"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            color: "#8A96A8",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            mb: 0.4,
                          }}
                        >
                          Installation Address
                        </Typography>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            lineHeight: 1.5,
                          }}
                        >
                          {[
                            lead.installationAddress?.street,
                            lead.installationAddress?.city,
                            lead.installationAddress?.state,
                            lead.installationAddress?.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {/* Payment Summary */}
                <Box
                  sx={{
                    borderRadius: "1.2rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E4EAF2",
                    boxShadow: "0 4px 20px rgba(20,34,56,0.06)",
                    p: 2.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#202938",
                      fontSize: "1rem",
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    Payment Summary
                  </Typography>

                  <Stack spacing={1.4}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{ color: "#5E6A7D", fontSize: "0.88rem" }}
                      >
                        Estimated Total
                      </Typography>
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                        }}
                      >
                        {formatMoney(estimatedTotal)}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        p: 1.6,
                        borderRadius: "0.85rem",
                        bgcolor: "#F0F4FF",
                        border: "1.5px solid #C5D8FF",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#0E56C8",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Commitment Fee (10%)
                          </Typography>
                          <Typography
                            sx={{
                              color: "#5E6A7D",
                              fontSize: "0.66rem",
                              mt: 0.2,
                            }}
                          >
                            Fully refundable if you don't find a match
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "1.3rem",
                            fontWeight: 900,
                          }}
                        >
                          {formatMoney(commitmentFee)}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider sx={{ borderColor: "#EEF2F7" }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "0.92rem",
                          fontWeight: 800,
                        }}
                      >
                        Amount Payable Now
                      </Typography>
                      <Typography
                        sx={{
                          color: "#202938",
                          fontSize: "1.2rem",
                          fontWeight: 900,
                        }}
                      >
                        {formatMoney(commitmentFee)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* Trust badges */}
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <TrustBadge
                      icon={<ShieldOutlinedIcon sx={{ fontSize: "1rem" }} />}
                      title="Secure 256-bit encryption"
                      subtitle="Your transaction is fully encrypted"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TrustBadge
                      icon={<ReplayRoundedIcon sx={{ fontSize: "1rem" }} />}
                      title="100% Refundable"
                      subtitle="Hassle-free commitment refund policy"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            {/* RIGHT COLUMN — Payment Method */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  borderRadius: "1.2rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E4EAF2",
                  boxShadow: "0 4px 20px rgba(20,34,56,0.06)",
                  p: 2.5,
                  position: { md: "sticky" },
                  top: { md: 24 },
                }}
              >
                <Typography
                  sx={{
                    color: "#202938",
                    fontSize: "1rem",
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  Select Payment Method
                </Typography>

                <Stack spacing={1.2} sx={{ mb: 2.5 }}>
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <Box
                        key={method.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedMethod(method.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setSelectedMethod(method.id)
                        }
                        sx={{
                          p: 1.6,
                          borderRadius: "0.9rem",
                          border: isSelected
                            ? "2px solid #0E56C8"
                            : "1.5px solid #E4EAF2",
                          bgcolor: isSelected ? "#F0F4FF" : "#FAFBFC",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            borderColor: "#0E56C8",
                            bgcolor: "#F5F8FF",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "0.65rem",
                            bgcolor: isSelected ? "#DCE9FF" : "#EEF2F7",
                            color: isSelected ? "#0E56C8" : "#5E6A7D",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              color: "#202938",
                              fontSize: "0.86rem",
                              fontWeight: 700,
                            }}
                          >
                            {method.label}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#7A8698",
                              fontSize: "0.68rem",
                              mt: 0.15,
                            }}
                          >
                            {method.subtitle}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: isSelected
                              ? "5px solid #0E56C8"
                              : "2px solid #C8D4E4",
                            bgcolor: "white",
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>

                {payError ? (
                  <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: "0.75rem", fontSize: "0.8rem" }}
                  >
                    {payError}
                  </Alert>
                ) : null}

                <Button
                  fullWidth
                  variant="contained"
                  disabled={isPaying}
                  onClick={handlePay}
                  sx={{
                    minHeight: 52,
                    borderRadius: "0.9rem",
                    fontWeight: 800,
                    fontSize: "0.96rem",
                    textTransform: "none",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.28)",
                    "&:hover": {
                      background:
                        "linear-gradient(180deg, #0B49AD 0%, #0A3E9A 100%)",
                    },
                  }}
                >
                  {isPaying ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} sx={{ color: "white" }} />
                      <span>Processing...</span>
                    </Stack>
                  ) : (
                    `Pay ${formatMoney(commitmentFee)} & Unlock Quotes`
                  )}
                </Button>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: "#8A96A8",
                    fontSize: "0.66rem",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  By proceeding, you agree to Sparkin&apos;s{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "#0E56C8",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Terms of Service
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Why the commitment fee section */}
          <Box sx={{ mt: 6 }}>
            <Typography
              sx={{
                color: "#202938",
                fontSize: { xs: "1.4rem", md: "1.7rem" },
                fontWeight: 800,
                letterSpacing: "-0.03em",
                textAlign: "center",
                mb: 3,
              }}
            >
              Why the commitment fee?
            </Typography>
            <Grid container spacing={2.5}>
              {whyItems.map((item) => (
                <Grid key={item.title} item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "1.1rem",
                      bgcolor: "#FFFFFF",
                      border: "1px solid #E4EAF2",
                      boxShadow: "0 4px 16px rgba(20,34,56,0.05)",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "0.85rem",
                        bgcolor: item.bg,
                        color: item.color,
                        display: "grid",
                        placeItems: "center",
                        mb: 1.8,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        color: "#202938",
                        fontSize: "0.96rem",
                        fontWeight: 800,
                        mb: 0.8,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#5E6A7D",
                        fontSize: "0.82rem",
                        lineHeight: 1.65,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

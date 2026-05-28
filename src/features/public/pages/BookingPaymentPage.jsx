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
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import { publicPageSpacing } from "@/features/public/pages/publicPageStyles";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { pollUntil } from "@/shared/lib/http/pollUntil";
import roofTipImage from "@/shared/assets/images/public/booking/roof-tip-placeholder.png";

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return rupeeFormatter.format(Number(value || 0));
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const paymentMethods = [
  {
    id: "upi",
    label: "UPI (GPay, PhonePe, Paytm)",
    subtitle: "Instant confirmation via your mobile app",
    icon: <PhoneAndroidOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    online: true,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay, Amex",
    icon: <CreditCardOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    online: true,
  },
  {
    id: "net_banking",
    label: "Net Banking",
    subtitle: "All major Indian banks supported",
    icon: <AccountBalanceOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    online: true,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    subtitle: "Pay in cash when the vendor visits your site",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    online: false,
  },
];

const whyItems = [
  {
    title: "Verified Quotes Only",
    description:
      "Ensure you only get quotes from pre-vetted, Tier-1 installers who have the capacity to take on your project.",
    icon: <VerifiedOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Priority Engineering",
    description:
      "Your roof plan is sent for priority shade analysis and electrical layout design by our in-house experts.",
    icon: <WbSunnyOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#0E56C8",
    bg: "#EAF1FF",
  },
  {
    title: "Guaranteed Savings",
    description:
      "Users who pay the commitment fee save an average of INR 18,000 on their final installation cost through bulk-bidding.",
    icon: <GppGoodOutlinedIcon sx={{ fontSize: "1.05rem" }} />,
    color: "#0E56C8",
    bg: "#EAF1FF",
  },
];

function TrustBadge({ icon, title, subtitle }) {
  return (
    <Stack
      direction="row"
      spacing={1.1}
      alignItems="center"
      sx={{
        p: 1.35,
        borderRadius: "0.9rem",
        bgcolor: "rgba(255,255,255,0.42)",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "0.65rem",
          bgcolor: "#078B45",
          color: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#151B22",
            fontSize: "0.72rem",
            fontWeight: 850,
            lineHeight: 1.25,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ color: "#667386", fontSize: "0.62rem", lineHeight: 1.35 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Stack>
  );
}

function FieldBlock({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#8A96A8",
          fontSize: "0.58rem",
          fontWeight: 850,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          mb: 0.45,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "#151B22",
          fontSize: "0.86rem",
          fontWeight: 750,
          lineHeight: 1.45,
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

export default function BookingPaymentPage() {
  const { state } = useLocation();
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const leadId = state?.leadId;

  const [lead, setLead] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!leadId && !quoteId) {
      navigate("/booking", { replace: true });
      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");

    async function loadPaymentContext() {
      try {
        if (quoteId) {
          const quoteResult = await quotesApi.getQuote(quoteId);
          const leadResult = await leadsApi.getLead(quoteResult.leadId);
          if (active) {
            setQuote(quoteResult);
            setLead(leadResult);
            setLoading(false);
          }
          return;
        }

        const data = await leadsApi.getLead(leadId);
        if (active) {
          setLead(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setLoadError(
            err?.response?.data?.message ||
              err.message ||
              "Could not load booking details.",
          );
          setLoading(false);
        }
      }
    }

    loadPaymentContext();
    return () => {
      active = false;
    };
  }, [leadId, navigate, quoteId]);

  const systemSizeKw =
    quote?.system?.sizeKw ||
    lead?.adminSystemSizeKw ||
    lead?.property?.sanctionedLoadKw ||
    5;
  const estimatedTotal =
    quote?.pricing?.totalPrice || lead?.estimatedCost || systemSizeKw * 65000;
  const commitmentFee = Math.round(estimatedTotal * 0.1);
  const firstMilestoneAmount = Math.round(estimatedTotal * 0.4);
  const finalMilestoneAmount =
    estimatedTotal - commitmentFee - firstMilestoneAmount;
  const remainingAmount = estimatedTotal - commitmentFee;
  const location = [
    lead?.installationAddress?.city,
    lead?.installationAddress?.state,
  ]
    .filter(Boolean)
    .join(", ");
  const address = [
    lead?.installationAddress?.street,
    lead?.installationAddress?.city,
    lead?.installationAddress?.state,
    lead?.installationAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ");
  const systemLabel = `${systemSizeKw}kW ${lead?.property?.type === "commercial" ? "Commercial" : "Residential"} Solar`;
  const selectedMethodMeta = paymentMethods.find(
    (method) => method.id === selectedMethod,
  );
  const isCod = !selectedMethodMeta?.online;

  const buttonLabel = isCod
    ? quote
      ? "Confirm Vendor (Pay on Visit)"
      : "Confirm & Unlock Quotes (Pay on Visit)"
    : quote
      ? `Pay ${formatMoney(commitmentFee)} & Confirm Vendor`
      : `Pay ${formatMoney(commitmentFee)} & Unlock Quotes`;

  async function handleCodPayment(result) {
    if (quoteId) {
      const bookingAdvancePaymentId = result?.project?.bookingAdvancePaymentId;
      if (bookingAdvancePaymentId) {
        await paymentsApi.confirmCodPayment(bookingAdvancePaymentId);
      }
      if (result?.project?.id) {
        navigate(`/project/installation?projectId=${result.project.id}`, {
          replace: true,
        });
      } else {
        navigate("/project/installation", { replace: true });
      }
    } else {
      await leadsApi.markCommitmentPaid(leadId);
      navigate("/booking/submitted", {
        replace: true,
        state: { leadId, paymentDone: true },
      });
    }
  }

  async function openRazorpay(bookingAdvancePaymentId, orderData) {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error(
        "Could not load payment gateway. Please check your connection and try again.",
      );
    }

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Sparkin Solar",
        description: orderData.invoiceNumber,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
        },
        theme: { color: "#0E56C8" },
        handler: async (response) => {
          try {
            const payment = await paymentsApi.verifyRazorpayPayment({
              paymentId: bookingAdvancePaymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            resolve(payment);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment was cancelled.")),
        },
      });
      rzp.open();
    });
  }

  async function handlePay() {
    if (isPaying) return;
    setPayError("");
    setIsPaying(true);

    try {
      let result = null;
      let projectId = null;

      if (quoteId) {
        result = await quotesApi.acceptQuote(quoteId);

        // Poll for project creation with exponential backoff
        // Project should be created within 5-10 seconds after quote acceptance
        try {
          const project = await pollUntil(
            async () => {
              const projects = await projectsApi.listProjects({ force: true });
              return projects.find(
                (p) => String(p.quoteId) === String(quoteId),
              );
            },
            {
              maxAttempts: 20,
              delayMs: 300,
              backoffMultiplier: 1.1,
              timeoutMs: 10000,
            },
          );
          projectId = project?.id;
        } catch (pollErr) {
          console.warn(
            "Project polling timeout, but quote was accepted:",
            pollErr.message,
          );
          // Continue anyway - project might be created shortly
        }
      }

      if (isCod) {
        await handleCodPayment(result);
        return;
      }

      const bookingAdvancePaymentId = result?.project?.bookingAdvancePaymentId;

      if (!bookingAdvancePaymentId) {
        if (!quoteId) {
          await leadsApi.markCommitmentPaid(leadId);
          navigate("/booking/submitted", {
            replace: true,
            state: { leadId, paymentDone: true },
          });
          return;
        }
        throw new Error("Could not find payment record. Please try again.");
      }

      const orderData = await paymentsApi.createRazorpayOrder(
        bookingAdvancePaymentId,
      );
      await openRazorpay(bookingAdvancePaymentId, orderData);

      // After successful payment, navigate to project
      if (projectId) {
        navigate(`/project/installation?projectId=${projectId}`, {
          replace: true,
        });
      } else if (result?.project?.id) {
        navigate(`/project/installation?projectId=${result.project.id}`, {
          replace: true,
        });
      } else {
        navigate("/project/installation", { replace: true });
      }
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
                color: "#FFFFFF",
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
          bgcolor: "#EEF4F1",
          background:
            "radial-gradient(circle at 78% 24%, rgba(14,86,200,0.07) 0%, rgba(14,86,200,0) 28%), #EEF4F1",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", lg: 1240, xl: 1320 },
            px: { xs: 2, sm: 3, lg: 4 },
          }}
        >
          <Box sx={{ mb: { xs: 3, md: 4.5 }, maxWidth: 680 }}>
            <Typography
              variant="h1"
              sx={{
                color: "#151B22",
                fontSize: { xs: "2rem", md: "2.7rem" },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Confirm Your Solar Request
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: "#526070",
                fontSize: { xs: "0.92rem", md: "1rem" },
                lineHeight: 1.55,
              }}
            >
              {quote
                ? "Pay the confirmation amount to lock your selected vendor and open your project tracker."
                : "Pay 10% commitment fee to start receiving verified vendor quotes and personalized engineering plans."}
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 2.5, md: 4, lg: 5 }}
            alignItems="flex-start"
          >
            <Grid item xs={12} md={7.2}>
              <Stack spacing={2.4}>
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 1.8 },
                    borderRadius: "1.15rem",
                    bgcolor: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(226,234,242,0.95)",
                    boxShadow: "0 16px 44px rgba(31,44,64,0.045)",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "172px 1fr" },
                    gap: 2,
                    alignItems: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Box
                    component="img"
                    src={roofTipImage}
                    alt="Solar panels on roof"
                    sx={{
                      width: "100%",
                      height: { xs: 150, sm: 112 },
                      borderRadius: "0.35rem",
                      objectFit: "cover",
                    }}
                  />
                  <Stack spacing={0.55}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 0.9,
                        py: 0.3,
                        borderRadius: "0.35rem",
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
                        color: "#151B22",
                        fontSize: { xs: "1.15rem", md: "1.25rem" },
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {systemLabel}
                    </Typography>
                    {location ? (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnOutlinedIcon
                          sx={{ fontSize: "0.82rem", color: "#526070" }}
                        />
                        <Typography
                          sx={{
                            color: "#526070",
                            fontSize: "0.76rem",
                            fontWeight: 650,
                          }}
                        >
                          {location}
                        </Typography>
                      </Stack>
                    ) : null}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: { xs: 2.2, md: 2.5 },
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(226,234,242,0.95)",
                    boxShadow: "0 16px 44px rgba(31,44,64,0.045)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    sx={{ mb: 1.8 }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: "#EAF1FF",
                        color: "#0E56C8",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <PersonOutlineRoundedIcon sx={{ fontSize: "0.9rem" }} />
                    </Box>
                    <Typography
                      sx={{
                        color: "#151B22",
                        fontSize: "0.9rem",
                        fontWeight: 850,
                      }}
                    >
                      Customer Details
                    </Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FieldBlock
                        label="Full Name"
                        value={lead.contact?.fullName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldBlock
                        label="Phone Number"
                        value={lead.contact?.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FieldBlock
                        label="Installation Address"
                        value={address}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "1rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(226,234,242,0.95)",
                    boxShadow: "0 16px 44px rgba(31,44,64,0.045)",
                    p: { xs: 2.2, md: 2.5 },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: -42,
                      right: -28,
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      bgcolor: "#EDF2FF",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#151B22",
                      fontSize: "1rem",
                      fontWeight: 850,
                      mb: 2,
                    }}
                  >
                    Payment Summary
                  </Typography>

                  <Stack spacing={1.4} sx={{ position: "relative", zIndex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{ color: "#526070", fontSize: "0.88rem" }}
                      >
                        Estimated Total
                      </Typography>
                      <Typography
                        sx={{
                          color: "#151B22",
                          fontSize: "0.88rem",
                          fontWeight: 750,
                        }}
                      >
                        {formatMoney(estimatedTotal)}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        p: 1.6,
                        borderRadius: "0.85rem",
                        bgcolor: "#F1F5FA",
                        borderLeft: "4px solid #0E56C8",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#0E56C8",
                              fontSize: "0.72rem",
                              fontWeight: 850,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {isCod
                              ? "Commitment Fee (10%) - Pay on Visit"
                              : "Commitment Fee (10%)"}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#526070",
                              fontSize: "0.66rem",
                              mt: 0.2,
                            }}
                          >
                            {isCod
                              ? "You will pay this amount when the vendor visits your site"
                              : "Fully refundable if you don't find a match"}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "#0E56C8",
                            fontSize: "1.42rem",
                            fontWeight: 950,
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
                          color: "#151B22",
                          fontSize: "0.92rem",
                          fontWeight: 850,
                        }}
                      >
                        {isCod
                          ? "Amount Payable on Visit"
                          : "Amount Payable Now"}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#151B22",
                          fontSize: "1.24rem",
                          fontWeight: 950,
                        }}
                      >
                        {formatMoney(commitmentFee)}
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderColor: "#EEF2F7" }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#526070",
                            fontSize: "0.82rem",
                            fontWeight: 650,
                          }}
                        >
                          Remaining Balance
                        </Typography>
                        <Typography
                          sx={{ color: "#8A96A8", fontSize: "0.66rem" }}
                        >
                          Due after installation milestones
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#526070",
                          fontSize: "0.96rem",
                          fontWeight: 750,
                        }}
                      >
                        {formatMoney(remainingAmount)}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 1,
                      }}
                    >
                      {[
                        [
                          "Project Start Payment",
                          "40% after vendor confirmation",
                          firstMilestoneAmount,
                        ],
                        [
                          "Final Installation Payment",
                          "50% across installation milestones",
                          finalMilestoneAmount,
                        ],
                      ].map(([label, note, amount]) => (
                        <Box
                          key={label}
                          sx={{
                            p: 1.2,
                            borderRadius: "0.8rem",
                            bgcolor: "#F7FAFC",
                            border: "1px solid #E7EEF5",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#151B22",
                              fontSize: "0.76rem",
                              fontWeight: 850,
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.18,
                              color: "#7A8798",
                              fontSize: "0.62rem",
                              lineHeight: 1.35,
                            }}
                          >
                            {note}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.65,
                              color: "#0E56C8",
                              fontSize: "0.95rem",
                              fontWeight: 950,
                            }}
                          >
                            {formatMoney(amount)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                </Box>

                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <TrustBadge
                      icon={<LockOutlinedIcon sx={{ fontSize: "1rem" }} />}
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

            <Grid item xs={12} md={4.8}>
              <Box
                sx={{
                  borderRadius: "1.08rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(226,234,242,0.95)",
                  boxShadow: "0 22px 58px rgba(31,44,64,0.08)",
                  p: { xs: 2.2, md: 2.5 },
                  position: { md: "sticky" },
                  top: { md: 24 },
                }}
              >
                <Typography
                  sx={{
                    color: "#151B22",
                    fontSize: "1rem",
                    fontWeight: 850,
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
                        onKeyDown={(event) =>
                          event.key === "Enter" && setSelectedMethod(method.id)
                        }
                        sx={{
                          p: 1.45,
                          minHeight: 72,
                          borderRadius: "0.8rem",
                          border: isSelected
                            ? "2px solid #0E56C8"
                            : "1px solid #E4EAF2",
                          bgcolor: isSelected ? "#F9FBFF" : "#F5F7FA",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            borderColor: "#0E56C8",
                            bgcolor: "#F9FBFF",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: "#FFFFFF",
                            color: isSelected ? "#0E56C8" : "#5E6A7D",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "#151B22",
                              fontSize: "0.84rem",
                              fontWeight: 850,
                              lineHeight: 1.2,
                            }}
                          >
                            {method.label}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#667386",
                              fontSize: "0.66rem",
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
                    borderRadius: "0.75rem",
                    fontWeight: 850,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    color: "#FFFFFF",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.28)",
                    "&.Mui-disabled": {
                      color: "#FFFFFF",
                      background:
                        "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                      opacity: 0.75,
                    },
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
                    buttonLabel
                  )}
                </Button>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: "#8A96A8",
                    fontSize: "0.62rem",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  By proceeding, you agree to Sparkin&apos;s{" "}
                  <Box
                    component="span"
                    sx={{ color: "#0E56C8", fontWeight: 650 }}
                  >
                    Terms of Service
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: { xs: 5, md: 6.5 } }}>
            <Typography
              sx={{
                color: "#151B22",
                fontSize: { xs: "1.42rem", md: "1.65rem" },
                fontWeight: 900,
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
                      borderRadius: "1rem",
                      bgcolor: "#FFFFFF",
                      border: "1px solid rgba(226,234,242,0.95)",
                      boxShadow: "0 16px 44px rgba(31,44,64,0.045)",
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
                        color: "#151B22",
                        fontSize: "0.96rem",
                        fontWeight: 850,
                        mb: 0.8,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#526070",
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

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import loanHeroPlaceholder from "@/shared/assets/images/public/financing/loan-hero-placeholder.png";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const tenureOptions = ["1-3", "3-5", "5+"];

const banks = [
  {
    name: "State Bank of India",
    badge: "Lowest Interest",
    rate: "8.5% p.a.",
    subtitle: "Special Solar Subsidy rate",
    maxAmount: "Up to ₹25L",
    maxCopy: "Collateral-free up to ₹5L",
    emi: "₹10,244",
    emiCopy: "for 5 years",
    fee: "0.25%",
    feeCopy: "Max ₹2,500",
    featured: true,
  },
  {
    name: "HDFC Bank",
    badge: "Fast Approval",
    rate: "9.2% p.a.",
    subtitle: "",
    maxAmount: "Up to ₹50L",
    maxCopy: "",
    emi: "₹10,400",
    emiCopy: "Instant disbursement",
    fee: "NIL",
    feeCopy: "For Sparkin users",
  },
  {
    name: "ICICI Bank",
    badge: "",
    rate: "8.95% p.a.",
    subtitle: "",
    maxAmount: "Up to ₹15L",
    maxCopy: "",
    emi: "₹10,345",
    emiCopy: "",
    fee: "₹1,999",
    feeCopy: "Flat processing fee",
  },
];

export default function SolarLoanPage() {
  return (
    <Box
      sx={{
        py: publicPageSpacing.pageY,
        background:
          "radial-gradient(circle at top center, rgba(214,229,246,0.82) 0%, rgba(245,248,251,0.96) 22%, #F9FBFD 60%, #F7FAFB 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: 320, md: 360 },
            borderRadius: "1.9rem",
            px: { xs: 2.4, md: 4.2 },
            py: { xs: 3.2, md: 4.2 },
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.78) 100%), url(${loanHeroPlaceholder})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 20px 42px rgba(16,29,51,0.08)",
          }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="start">
            <Grid size={{ xs: 12, md: 7.2 }}>
              <Box
                sx={{
                  width: "fit-content",
                  px: 0.8,
                  py: 0.32,
                  borderRadius: 999,
                  bgcolor: "#E5F20D",
                  color: "#576000",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Energy Independence
              </Box>

              <Typography
                variant="h1"
                sx={{
                  mt: 1.25,
                  ...publicTypography.heroTitle,
                  color: "#18253A",
                }}
              >
                Solar Loan
                <Box
                  component="span"
                  sx={{ display: "block", color: "#0E56C8" }}
                >
                  Interest Rates
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.2,
                  maxWidth: 430,
                  color: "#5F6D81",
                  ...publicTypography.sectionBody,
                }}
              >
                Compare top bank offers and find the most affordable financing
                for your solar installation with atmospheric precision.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4.8 }}>
              <Box
                sx={{
                  ml: { md: "auto" },
                  width: "fit-content",
                  px: 1.2,
                  py: 1,
                  borderRadius: "1rem",
                  bgcolor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(223,231,241,0.92)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.9,
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "0.85rem",
                    bgcolor: "#DDF8E8",
                    color: "#159E56",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <SavingsRoundedIcon sx={{ fontSize: "1rem" }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "#7C8798",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  >
                    Estimated Avg. Savings
                  </Typography>
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontSize: "1.28rem",
                      fontWeight: 800,
                    }}
                  >
                    ₹2.4L / Year
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: publicPageSpacing.heroBottom,
              p: { xs: 1.4, md: 1.55 },
              borderRadius: "1.35rem",
              bgcolor: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(223,231,241,0.94)",
              boxShadow: "0 16px 34px rgba(16,29,51,0.08)",
            }}
          >
            <Grid container spacing={{ xs: 1.4, md: 1.8 }} alignItems="end">
              <Grid size={{ xs: 12, md: 3.1 }}>
                <Typography
                  sx={{
                    color: "#8A96A7",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Loan Amount
                </Typography>
                <Box sx={{ mt: 0.95 }}>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: "#E4E9F0",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{ width: "44%", height: "100%", bgcolor: "#D5DCE8" }}
                    />
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 0.75 }}
                  >
                    <Typography
                      sx={{
                        color: "#9BA8B9",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      ₹1L
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0E56C8",
                        fontSize: "1rem",
                        fontWeight: 800,
                      }}
                    >
                      ₹5,00,000
                    </Typography>
                    <Typography
                      sx={{
                        color: "#9BA8B9",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      ₹10L
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 2.5 }}>
                <Typography
                  sx={{
                    color: "#8A96A7",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Tenure (Years)
                </Typography>
                <Stack direction="row" spacing={0.7} sx={{ mt: 0.9 }}>
                  {tenureOptions.map((option, index) => (
                    <Box
                      key={option}
                      sx={{
                        minWidth: 40,
                        px: 0.95,
                        py: 0.65,
                        borderRadius: "0.72rem",
                        bgcolor: index === 0 ? "#FFFFFF" : "#F2F5F9",
                        border:
                          index === 0
                            ? "1px solid rgba(14,86,200,0.32)"
                            : "1px solid transparent",
                        color: "#18253A",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textAlign: "center",
                        boxShadow:
                          index === 0
                            ? "0 6px 14px rgba(16,29,51,0.05)"
                            : "none",
                      }}
                    >
                      {option}
                    </Box>
                  ))}
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 2.8 }}>
                <Typography
                  sx={{
                    color: "#8A96A7",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Interest Type
                </Typography>
                <Box
                  sx={{
                    mt: 0.9,
                    minHeight: 44,
                    px: 1.1,
                    borderRadius: "0.85rem",
                    bgcolor: "#F2F5F9",
                    color: "#2B3645",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  Fixed Interest
                  <KeyboardArrowDownRoundedIcon
                    sx={{ fontSize: "1rem", color: "#677385" }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 3.6 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    minHeight: 46,
                    borderRadius: "0.85rem",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#1C1F25",
                    color: "#FFFFFF",
                    boxShadow: "none",
                  }}
                >
                  Update Rates
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            mt: publicPageSpacing.sectionTop,
            borderRadius: "1.6rem",
            bgcolor: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(223,231,241,0.92)",
            boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
            overflow: "hidden",
          }}
        >
          <Grid
            container
            sx={{
              px: { xs: 2, md: 2.3 },
              py: 1.2,
              borderBottom: "1px solid rgba(229,234,242,0.9)",
            }}
          >
            {[
              "Bank Name",
              "Interest Rate",
              "Max Amount",
              "Estimated EMI",
              "Processing Fee",
              "",
            ].map((head, index) => (
              <Grid
                key={head || index}
                size={{
                  xs: 12,
                  md: index === 0 ? 3.1 : index === 5 ? 1.7 : 1.9,
                }}
              >
                <Typography
                  sx={{
                    color: "#8A96A7",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {head}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {banks.map((bank, idx) => (
            <Grid
              key={bank.name}
              container
              alignItems="center"
              spacing={{ xs: 1.8, md: 1 }}
              sx={{
                px: { xs: 2, md: 2.3 },
                py: { xs: 2, md: 2.15 },
                borderBottom:
                  idx === banks.length - 1
                    ? "none"
                    : "1px solid rgba(229,234,242,0.9)",
              }}
            >
              <Grid size={{ xs: 12, md: 3.1 }}>
                <Stack direction="row" spacing={1} alignItems="start">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "0.65rem",
                      bgcolor: "#EEF2F7",
                      display: "grid",
                      placeItems: "center",
                      color: "#748197",
                    }}
                  >
                    <CurrencyRupeeRoundedIcon sx={{ fontSize: "0.9rem" }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#18253A",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                      }}
                    >
                      {bank.name}
                    </Typography>
                    {bank.badge ? (
                      <Box
                        sx={{
                          mt: 0.4,
                          width: "fit-content",
                          px: 0.58,
                          py: 0.2,
                          borderRadius: 999,
                          bgcolor: bank.featured ? "#E9FFF4" : "#F5F7BE",
                          color: bank.featured ? "#0E8F50" : "#777B00",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {bank.badge}
                      </Box>
                    ) : null}
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 1.9 }}>
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "1.55rem",
                    fontWeight: 800,
                  }}
                >
                  {bank.rate}
                </Typography>
                {bank.subtitle ? (
                  <Typography
                    sx={{ mt: 0.2, color: "#7A879A", fontSize: "0.72rem" }}
                  >
                    {bank.subtitle}
                  </Typography>
                ) : null}
              </Grid>
              <Grid size={{ xs: 12, md: 1.9 }}>
                <Typography
                  sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 800 }}
                >
                  {bank.maxAmount}
                </Typography>
                {bank.maxCopy ? (
                  <Typography
                    sx={{ mt: 0.2, color: "#7A879A", fontSize: "0.72rem" }}
                  >
                    {bank.maxCopy}
                  </Typography>
                ) : null}
              </Grid>
              <Grid size={{ xs: 12, md: 1.9 }}>
                <Typography
                  sx={{ color: "#18253A", fontSize: "0.9rem", fontWeight: 800 }}
                >
                  {bank.emi}
                </Typography>
                {bank.emiCopy ? (
                  <Typography
                    sx={{ mt: 0.2, color: "#7A879A", fontSize: "0.72rem" }}
                  >
                    {bank.emiCopy}
                  </Typography>
                ) : null}
              </Grid>
              <Grid size={{ xs: 12, md: 1.5 }}>
                <Typography
                  sx={{
                    color: bank.fee === "NIL" ? "#D34F4F" : "#18253A",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                  }}
                >
                  {bank.fee}
                </Typography>
                {bank.feeCopy ? (
                  <Typography
                    sx={{ mt: 0.2, color: "#7A879A", fontSize: "0.72rem" }}
                  >
                    {bank.feeCopy}
                  </Typography>
                ) : null}
              </Grid>
              <Grid size={{ xs: 12, md: 1.7 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    minHeight: 40,
                    borderRadius: "0.78rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: bank.featured ? "#0E56C8" : "#F2F5F9",
                    color: bank.featured ? "#FFFFFF" : "#2B3645",
                    boxShadow: "none",
                  }}
                >
                  Apply Now
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Grid
          container
          spacing={{ xs: 2.2, md: 2.4 }}
          sx={{ mt: publicPageSpacing.sectionTopLarge }}
        >
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4.2 },
                minHeight: 260,
                borderRadius: "1.75rem",
                background: "linear-gradient(180deg, #0F4FBE 0%, #0A43A8 100%)",
                color: "white",
                boxShadow: "0 20px 44px rgba(14,86,200,0.18)",
              }}
            >
              <Typography
                sx={{
                  ...publicTypography.sectionTitle,
                  maxWidth: 340,
                }}
              >
                Ready to switch to clean energy?
              </Typography>
              <Typography
                sx={{
                  mt: 1.15,
                  maxWidth: 420,
                  color: "rgba(239,245,255,0.82)",
                  ...publicTypography.body,
                }}
              >
                Get a pre-approved solar loan in under 24 hours. Our financing
                partners offer the industry's low rates exclusively for Sparkin
                customers.
              </Typography>
              <Button
                component={RouterLink}
                to="/calculator"
                variant="contained"
                sx={{
                  mt: 2.5,
                  minHeight: 44,
                  px: 2.1,
                  borderRadius: "0.78rem",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#DDF509",
                  color: "#162331",
                  boxShadow: "none",
                }}
              >
                Check Eligibility
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: { xs: 2.4, md: 2.8 },
                minHeight: 260,
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(223,231,241,0.92)",
                boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.9rem",
                  bgcolor: "#EEF3FF",
                  color: "#285DDE",
                  display: "grid",
                  placeItems: "center",
                  mb: 1.35,
                }}
              >
                <HelpOutlineRoundedIcon sx={{ fontSize: "1rem" }} />
              </Box>
              <Typography
                sx={{ ...publicTypography.cardTitle, color: "#18253A", fontSize: { xs: "1.18rem", md: "1.3rem" } }}
              >
                Expert Advice
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: "#6E7B8E",
                  ...publicTypography.cardBody,
                  maxWidth: 240,
                }}
              >
                Not sure which loan fits your roof? Talk to our energy financing
                consultants today.
              </Typography>
              <Typography
                component={RouterLink}
                to="/contact"
                sx={{
                  mt: 3.3,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.4,
                  textDecoration: "none",
                  color: "#0E56C8",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                }}
              >
                Book a Free Consultation
                <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

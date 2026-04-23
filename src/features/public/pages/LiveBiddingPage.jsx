import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PriceChangeRoundedIcon from "@mui/icons-material/PriceChangeRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Link as RouterLink } from "react-router-dom";
import liveBiddingHeroPlaceholder from "@/shared/assets/images/public/bidding/live-bidding-hero-placeholder.png";
import liveBiddingAdvantagePlaceholder from "@/shared/assets/images/public/bidding/live-bidding-advantage-placeholder.png";
import styles from "@/features/public/pages/CalculatorPage.module.css";
import {
  publicPageSpacing,
  publicTypography,
} from "@/features/public/pages/publicPageStyles";

const workflowCards = [
  {
    title: "Broadcast Phase",
    description:
      "Our system intelligently distributes your specs to engineers specializing in your climate and architecture.",
    step: "STEP 01",
    icon: <CampaignRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    accent: "#9AC0FF",
    tone: "#0E56C8",
  },
  {
    title: "Live Bidding",
    description:
      "Watch as providers outbid each other. Transparent pricing and component breakdowns appear in real-time.",
    step: "STEP 02",
    icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: "1.15rem" }} />,
    accent: "#C9C45A",
    tone: "#A7B400",
  },
  {
    title: "Elite Selection",
    description:
      "Compare long-term ROI, warranty depth, and installation timelines to pick your perfect energy partner.",
    step: "STEP 03",
    icon: <ShieldOutlinedIcon sx={{ fontSize: "1.15rem" }} />,
    accent: "#9BCBB0",
    tone: "#0E6A36",
  },
];

const advantageItems = [
  {
    title: "Reverse Auction Pricing",
    description:
      "Vendors bid in a transparent environment, naturally pushing costs down to true market value.",
    icon: <PriceChangeRoundedIcon sx={{ fontSize: "1rem" }} />,
    bg: "#E7F0FF",
    color: "#1A57C8",
  },
  {
    title: "Smart Asset Matching",
    description:
      "Our AI matches your roof orientation and local shading patterns with the right panel technology.",
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: "1rem" }} />,
    bg: "#FBF6C8",
    color: "#978B00",
  },
  {
    title: "Triple-Vetted Network",
    description:
      "Only the top 5% of regional solar providers pass our 120-point technical and financial audit.",
    icon: <GppGoodRoundedIcon sx={{ fontSize: "1rem" }} />,
    bg: "#E8F5EA",
    color: "#167A44",
  },
];

function WorkflowCard({ title, description, step, icon, accent, tone }) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 252, md: 310 },
        px: { xs: 2, md: 2.2 },
        py: { xs: 2.05, md: 2.45 },
        borderRadius: "2rem",
        bgcolor: "rgba(255,255,255,0.98)",
        border: "1px solid #E7EDF4",
        boxShadow: "0 18px 42px rgba(17,31,54,0.08)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: "999px 999px 0 0",
          bgcolor: accent,
        }}
      />

      <Stack spacing={1.5} sx={{ height: "100%" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "1rem",
            bgcolor: tone,
            color: "white",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 12px 24px rgba(17,31,54,0.14)",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color: "#202938",
            fontSize: { xs: "1.02rem", md: "1.12rem" },
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#576376",
            fontSize: "0.82rem",
            lineHeight: 1.75,
            maxWidth: 235,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          <Typography
            sx={{
              color: tone,
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: 0.28,
              textTransform: "uppercase",
            }}
          >
            {step}
          </Typography>
          <Box sx={{ mt: 0.45, width: 72, height: 1.5, bgcolor: "#D8E0EA" }} />
        </Box>
      </Stack>
    </Box>
  );
}

export default function LiveBiddingPage() {
  return (
    <Box className={styles.pageShell}>
      <Box
        sx={{
          pt: publicPageSpacing.pageYCompact,
          pb: 0,
          background:
            "radial-gradient(circle at top center, rgba(214,229,246,0.38) 0%, rgba(247,250,252,0.95) 22%, #F9FBFD 66%, #F7FAFB 100%)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          className={styles.contentContainer}
        >
          <Stack spacing={{ xs: 12.5, md: 16.5 }} sx={{ width: "100%" }}>
            {/* SECTION 1 */}
            <Grid container spacing={{ xs: 4.8, md: 6.6 }} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2.75} sx={{ maxWidth: 530 }}>
                  <Box
                    sx={{
                      width: "fit-content",
                      px: 1.4,
                      py: 0.64,
                      borderRadius: 999,
                      bgcolor: "#19BE73",
                      color: "white",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.7,
                    }}
                  >
                    <InsightsRoundedIcon sx={{ fontSize: "0.9rem" }} />
                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: 0.55,
                        textTransform: "uppercase",
                      }}
                    >
                      Live Tender Hub Active
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      color: "#20242B",
                      ...publicTypography.heroTitle,
                      fontSize: { xs: "2.9rem", md: "4.1rem" },
                      lineHeight: { xs: 1, md: 0.97 },
                      letterSpacing: "-0.07em",
                      maxWidth: 500,
                    }}
                  >
                    Sit back while vendors{" "}
                    <Box component="span" sx={{ color: "#0E56C8" }}>
                      compete for you.
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      color: "#667084",
                      fontSize: { xs: "0.96rem", md: "1rem" },
                      lineHeight: 1.62,
                      maxWidth: 430,
                    }}
                  >
                    Your energy needs have been broadcast to our elite network.
                    Sit tight as custom engineering bids roll in in real-time.
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.35}
                    sx={{ pt: 0.7, alignItems: { sm: "center" } }}
                  >
                    <Button
                      component={RouterLink}
                      to="/quotes/compare"
                      variant="contained"
                      sx={{
                        minWidth: 186,
                        minHeight: 50,
                        borderRadius: "1.05rem",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        textTransform: "none",
                        background:
                          "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                        boxShadow: "0 14px 28px rgba(14,86,200,0.22)",
                      }}
                    >
                      Review Live Quotes
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        minWidth: 186,
                        minHeight: 50,
                        borderRadius: "1.05rem",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        textTransform: "none",
                        borderColor: "#D9E1EB",
                        bgcolor: "#F3F5F8",
                        color: "#202938",
                      }}
                    >
                      Manage Dashboard
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 450,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        minHeight: { xs: 320, md: 415 },
                        borderRadius: "2rem",
                        overflow: "hidden",
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(13,56,112,0.1) 100%), url(${liveBiddingHeroPlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 24px 46px rgba(17,31,54,0.12)",
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        right: { xs: 12, md: -14 },
                        bottom: 18,
                        px: 1.25,
                        py: 1,
                        borderRadius: "1.25rem",
                        bgcolor: "rgba(255,255,255,0.96)",
                        boxShadow: "0 18px 36px rgba(17,31,54,0.14)",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "1rem",
                            bgcolor: "#0E56C8",
                            color: "white",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <InsightsRoundedIcon sx={{ fontSize: "1rem" }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              color: "#6D7889",
                              fontSize: "0.56rem",
                              fontWeight: 800,
                              letterSpacing: 0.46,
                              textTransform: "uppercase",
                            }}
                          >
                            Active Bids
                          </Typography>
                          <Typography
                            sx={{
                              color: "#0E56C8",
                              fontSize: "1.42rem",
                              fontWeight: 800,
                              lineHeight: 1.1,
                            }}
                          >
                            12+
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* SECTION 2 CLEAN */}
            <Box
              sx={{
                py: { xs: 2.5, md: 3.4 },
                px: { xs: 2.2, md: 3.2 },
                borderRadius: "1.6rem",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid #EEF3F8",
                boxShadow: "0 20px 48px rgba(17,31,54,0.05)",
              }}
            >
              <Stack alignItems="center" textAlign="center" spacing={1.05}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "#20242B",
                    fontSize: { xs: "2.2rem", md: "3.15rem" },
                    lineHeight: 1.05,
                    letterSpacing: "-0.05em",
                  }}
                >
                  The Winning Workflow
                </Typography>
                <Typography
                  sx={{
                    color: "#667084",
                    fontSize: "0.96rem",
                    lineHeight: 1.55,
                    maxWidth: 500,
                  }}
                >
                  How we ensure you get the absolute best solar deals on the
                  market.
                </Typography>
              </Stack>

              <Box
                sx={{
                  mt: { xs: 4.2, md: 5.1 },
                }}
              >
                <Grid
                  container
                  spacing={{ xs: 2.5, md: 3.2 }}
                  alignItems="stretch"
                >
                  {workflowCards.map((card) => (
                    <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                      <WorkflowCard {...card} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* SECTION 3 WITH LIGHT RECTANGLE BACKGROUND */}
            <Box
              sx={{
                position: "relative",
                pt: { xs: 5.5, md: 7.5 },
                pb: { xs: 4.5, md: 6.5 },
                px: { xs: 0, md: 1.5 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 22, md: 0 },
                  left: { xs: -18, md: -24 },
                  right: { xs: -18, md: 24 },
                  bottom: { xs: 0, md: 0 },
                  bgcolor: "#DCE7F3",
                  opacity: 0.72,
                  zIndex: 0,
                }}
              />

              <Grid
                container
                spacing={{ xs: 5.8, md: 9.6 }}
                alignItems="center"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ position: "relative", maxWidth: 560 }}>
                    <Box
                      sx={{
                        minHeight: { xs: 460, md: 602 },
                        borderRadius: "2.1rem",
                        overflow: "hidden",
                        backgroundImage: `url(${liveBiddingAdvantagePlaceholder})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow: "0 24px 46px rgba(17,31,54,0.12)",
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        top: 38,
                        left: { xs: 16, md: -12 },
                        width: { xs: 180, md: 174 },
                        px: 1.2,
                        py: 1.05,
                        borderRadius: "1.25rem",
                        bgcolor: "rgba(255,255,255,0.94)",
                        boxShadow: "0 16px 34px rgba(17,31,54,0.14)",
                      }}
                    >
                      <Stack spacing={0.55}>
                        <Stack direction="row" spacing={0.7} alignItems="center">
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              bgcolor: "#11813B",
                            }}
                          />
                          <Typography
                            sx={{
                              color: "#11813B",
                              fontSize: "0.5rem",
                              fontWeight: 800,
                              letterSpacing: 0.42,
                              textTransform: "uppercase",
                            }}
                          >
                            Verified Partner
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            color: "#202938",
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            lineHeight: 1.45,
                          }}
                        >
                          &quot;Sparkin reduced our project overhead by 22% while
                          increasing system efficiency.&quot;
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2.2} sx={{ maxWidth: 500 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        color: "#20242B",
                        fontSize: { xs: "2.45rem", md: "3.35rem" },
                        lineHeight: 1.02,
                        letterSpacing: "-0.05em",
                      }}
                    >
                      The Sparkin{" "}
                      <Box component="span" sx={{ color: "#0E56C8" }}>
                        Advantage
                      </Box>
                    </Typography>

                    <Typography
                      sx={{
                        color: "#4F5B6C",
                        fontSize: "1rem",
                        lineHeight: 1.65,
                        maxWidth: 470,
                      }}
                    >
                      We don&apos;t just find installers; we curate the perfect
                      ecosystem for your home&apos;s energy future.
                    </Typography>

                    <Stack spacing={1.5}>
                      {advantageItems.map((item) => (
                        <Box
                          key={item.title}
                          sx={{
                            px: 1.8,
                            py: 1.5,
                            borderRadius: "1.55rem",
                            bgcolor: "rgba(255,255,255,0.92)",
                            border: "1px solid #EFF3F8",
                            boxShadow: "0 16px 34px rgba(17,31,54,0.06)",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                bgcolor: item.bg,
                                color: item.color,
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#202938",
                                  fontSize: "0.98rem",
                                  fontWeight: 700,
                                  lineHeight: 1.35,
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#5F6B7D",
                                  fontSize: "0.82rem",
                                  lineHeight: 1.65,
                                  mt: 0.4,
                                }}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Container>

        {/* SECTION 4 FULL WIDTH ATTACHED TO FOOTER */}
        <Box
          sx={{
            width: "100%",
            mt: { xs: 8.5, md: 10.5 },
            mb: 0,
            px: { xs: 2.5, md: 4 },
            py: { xs: 6.5, md: 8.8 },
            bgcolor: "#1B1F20",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: -90,
              top: "50%",
              transform: "translateY(-50%)",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(189,219,72,0.22) 0%, rgba(189,219,72,0.02) 70%, transparent 100%)",
            }}
          />

          <Container
            maxWidth={false}
            disableGutters
            className={styles.contentContainer}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Stack alignItems="center" textAlign="center" spacing={2}>
              <Typography
                variant="h2"
                sx={{
                  color: "white",
                  fontSize: { xs: "2.5rem", md: "4.05rem" },
                  lineHeight: 0.98,
                  letterSpacing: "-0.06em",
                  maxWidth: 680,
                }}
              >
                Ready to light up your{" "}
                <Box component="span" sx={{ color: "#B4CC67" }}>
                  future?
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  maxWidth: 560,
                }}
              >
                The bids are in. Your path to energy independence and
                significant savings is one click away.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                sx={{ pt: 1 }}
              >
                <Button
                  component={RouterLink}
                  to="/quotes/compare"
                  variant="contained"
                  sx={{
                    minWidth: 170,
                    minHeight: 52,
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    textTransform: "none",
                    background:
                      "linear-gradient(180deg, #0E56C8 0%, #0D49B0 100%)",
                    boxShadow: "0 14px 28px rgba(14,86,200,0.24)",
                  }}
                >
                  View Quotes
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 198,
                    minHeight: 52,
                    borderRadius: "999px",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    textTransform: "none",
                  }}
                >
                  Go to Dashboard
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

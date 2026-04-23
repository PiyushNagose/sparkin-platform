import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const tierCards = [
  {
    title: "1.2 MW",
    subtitle: "Total Capacity Installed",
    tone: "linear-gradient(180deg, #FAF8CF 0%, #F5F3BF 100%)",
    color: "#6C6B0D",
  },
  {
    title: "Platinum Tier",
    subtitle: "Partner Reliability Rating",
    tone: "linear-gradient(180deg, #E3F7EA 0%, #D6F1DF 100%)",
    color: "#108A49",
  },
];

export default function VendorOnboardingPage() {
  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: "auto",
      }}
    >
      <Box sx={{ textAlign: "center", mb: { xs: 3.5, md: 4.25 } }}>
        <Typography
          sx={{
            color: "#18253A",
            fontSize: { xs: "2rem", md: "2.45rem" },
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.04,
          }}
        >
          Vendor Onboarding
        </Typography>
        <Typography
          sx={{
            mt: 0.8,
            color: "#7A879A",
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.72,
          }}
        >
          Finalize your professional profile to start receiving project leads.
        </Typography>
      </Box>

      <Box
        sx={{
          p: { xs: 2.2, md: 2.6 },
          borderRadius: "1.6rem",
          bgcolor: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(223,231,241,0.92)",
          boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
          mb: { xs: 3.2, md: 4.2 },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
              }}
            >
              <VerifiedUserOutlinedIcon sx={{ fontSize: "1rem" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#6E7B8E",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Onboarding Status
              </Typography>
              <Typography sx={{ mt: 0.2, color: "#18253A", fontSize: "1.2rem", fontWeight: 800 }}>
                Final Review
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ color: "#0E56C8", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
              100%
            </Typography>
            <Typography sx={{ mt: 0.15, color: "#7A879A", fontSize: "0.74rem", fontWeight: 700 }}>
              Profile Completion
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 2.1,
            height: 8,
            borderRadius: 999,
            bgcolor: "#E6EDF7",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", height: "100%", bgcolor: "#0E56C8" }} />
        </Box>
      </Box>

      <Stack spacing={{ xs: 2.6, md: 3 }} sx={{ mb: { xs: 3.6, md: 4.2 } }}>
        <Box
          sx={{
            p: { xs: 2.3, md: 2.8 },
            borderRadius: "1.7rem",
            bgcolor: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(223,231,241,0.92)",
            boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "0.55rem",
                bgcolor: "#EEF3FF",
                color: "#285DDE",
                display: "grid",
                placeItems: "center",
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              1
            </Box>
            <Typography sx={{ color: "#18253A", fontSize: "1.32rem", fontWeight: 800 }}>
              Company Profile
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 1.8, md: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 0.5, color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
                Legal Company Name
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., Solar Flow Systems LLC"
                InputProps={{
                  sx: {
                    height: 48,
                    borderRadius: "0.85rem",
                    bgcolor: "#F2F5F9",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 0.5, color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
                Business Type
              </Typography>
              <TextField
                fullWidth
                placeholder="EPC Contractor"
                InputProps={{
                  sx: {
                    height: 48,
                    borderRadius: "0.85rem",
                    bgcolor: "#F2F5F9",
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <Typography sx={{ mb: 0.5, color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
                Business Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Street Address, Suite, City, State, ZIP"
                InputProps={{
                  sx: {
                    height: 48,
                    borderRadius: "0.85rem",
                    bgcolor: "#F2F5F9",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            p: { xs: 2.3, md: 2.8 },
            borderRadius: "1.7rem",
            bgcolor: "rgba(247,249,252,0.98)",
            border: "1px solid rgba(233,238,245,0.95)",
            boxShadow: "0 12px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "0.55rem",
                bgcolor: "#EEF3FF",
                color: "#285DDE",
                display: "grid",
                placeItems: "center",
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              2
            </Box>
            <Typography sx={{ color: "#18253A", fontSize: "1.32rem", fontWeight: 800 }}>
              Certifications &amp; Compliance
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 1.8, md: 2 }}>
            {[
              { title: "Electrical License", copy: "PDF or JPEG, max 10MB" },
              { title: "Liability Insurance", copy: "Valid for current fiscal year" },
            ].map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    minHeight: 134,
                    borderRadius: "1.1rem",
                    border: "1px dashed rgba(181,198,226,0.96)",
                    bgcolor: "rgba(255,255,255,0.92)",
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        mx: "auto",
                        width: 42,
                        height: 42,
                        borderRadius: "0.95rem",
                        bgcolor: "#EEF3FF",
                        color: "#285DDE",
                        display: "grid",
                        placeItems: "center",
                        mb: 1,
                      }}
                    >
                      <UploadFileRoundedIcon sx={{ fontSize: "1.1rem" }} />
                    </Box>
                    <Typography sx={{ color: "#18253A", fontSize: "0.92rem", fontWeight: 800 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ mt: 0.35, color: "#7A879A", fontSize: "0.74rem" }}>
                      {item.copy}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            p: { xs: 2.3, md: 2.8 },
            borderRadius: "1.7rem",
            bgcolor: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(223,231,241,0.92)",
            boxShadow: "0 16px 34px rgba(16,29,51,0.06)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "0.55rem",
                bgcolor: "#EEF3FF",
                color: "#285DDE",
                display: "grid",
                placeItems: "center",
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              3
            </Box>
            <Typography sx={{ color: "#18253A", fontSize: "1.32rem", fontWeight: 800 }}>
              Professional Experience
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 2, md: 2.4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography sx={{ color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
                Years of Solar Experience
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                {["1-3", "4-7", "8+"].map((item, index) => (
                  <Box
                    key={item}
                    sx={{
                      minWidth: 54,
                      px: 1.1,
                      py: 0.7,
                      borderRadius: "0.8rem",
                      bgcolor: index === 0 ? "#FFFFFF" : "#F2F5F9",
                      border: index === 0 ? "1px solid rgba(14,86,200,0.34)" : "1px solid transparent",
                      color: "#18253A",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textAlign: "center",
                      boxShadow: index === 0 ? "0 6px 12px rgba(16,29,51,0.05)" : "none",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography sx={{ color: "#3B4658", fontSize: "0.76rem", fontWeight: 700 }}>
                Projects Completed
              </Typography>
              <Box sx={{ mt: 1.35 }}>
                <Box sx={{ height: 6, borderRadius: 999, bgcolor: "#E4E9F0", overflow: "hidden" }}>
                  <Box sx={{ width: "86%", height: "100%", bgcolor: "#D5DCE8" }} />
                </Box>
                <Typography sx={{ mt: 0.5, color: "#0E56C8", fontSize: "0.82rem", fontWeight: 800, textAlign: "right" }}>
                  50+
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 1.8, md: 2 }} sx={{ mt: 2.4 }}>
            {tierCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    minHeight: 96,
                    borderRadius: "1.1rem",
                    background: card.tone,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <BoltRoundedIcon sx={{ fontSize: "0.95rem", color: card.color, mb: 0.55 }} />
                  <Typography sx={{ color: "#18253A", fontSize: "1.18rem", fontWeight: 800 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ mt: 0.3, color: card.color, fontSize: "0.75rem", fontWeight: 700 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      <Box
        sx={{
          p: { xs: 2.2, md: 2.5 },
          borderRadius: "1.45rem",
          bgcolor: "#2A2F36",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Ready to Launch?
          </Typography>
          <Typography sx={{ mt: 0.55, color: "rgba(255,255,255,0.72)", fontSize: "0.82rem" }}>
            By submitting, you agree to our Vendor Terms &amp; Conditions.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/vendor"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            minWidth: 190,
            minHeight: 46,
            borderRadius: "0.82rem",
            fontSize: "0.84rem",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#0E56C8",
            boxShadow: "none",
            alignSelf: { xs: "stretch", md: "auto" },
          }}
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
}

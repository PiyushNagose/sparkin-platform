import { Box, Button, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link as RouterLink } from "react-router-dom";

const specCards = [
  {
    icon: BoltRoundedIcon,
    label: "System Size",
    value: "5.5 kW",
    tone: "#2F73FF",
    bg: "#EEF4FF",
  },
  {
    icon: CurrencyRupeeRoundedIcon,
    label: "Budget Range",
    value: "\u20B93,20,000",
    tone: "#239654",
    bg: "#EAF7EF",
  },
  {
    icon: CottageOutlinedIcon,
    label: "Property Type",
    value: "Independent House",
    tone: "#8C9400",
    bg: "#F7F6D7",
  },
  {
    icon: StraightenRoundedIcon,
    label: "Roof Size",
    value: "1,200 sq ft",
    tone: "#4F89FF",
    bg: "#EEF4FF",
  },
  {
    icon: WbSunnyOutlinedIcon,
    label: "Shadow Availability",
    value: "No Shadow",
    tone: "#2A9656",
    bg: "#EAF7EF",
  },
  {
    icon: CalendarMonthOutlinedIcon,
    label: "Installation Timeline",
    value: "Immediate",
    tone: "#2F73FF",
    bg: "#EEF4FF",
  },
];

const verificationRows = [
  { label: "Ownership Status", value: "Owned", tone: "#2A9656", bg: "#E8F7EC" },
  { label: "Phone Verified", value: "", iconOnly: true },
  { label: "Location Accuracy", value: "High (98%)" },
];

export default function VendorLeadDetailPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          p: { xs: 1.4, md: 1.7 },
          borderRadius: "1.35rem",
          bgcolor: "#F4F6FA",
          border: "1px solid rgba(229,234,241,0.95)",
          mb: { xs: 2.4, md: 2.7 },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={1.6}
        >
          <Stack direction="row" spacing={1.3} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "1rem",
                bgcolor: "#0E56C8",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontSize: "1.65rem",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              AK
            </Box>

            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography
                  sx={{
                    color: "#18253A",
                    fontSize: { xs: "1.7rem", md: "1.95rem" },
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Amit Kulkarni
                </Typography>
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.32,
                    borderRadius: "999px",
                    bgcolor: "#ECEA00",
                    color: "#4B4A00",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Hot Lead
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.6} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap" }}>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <PlaceOutlinedIcon sx={{ color: "#7D8797", fontSize: "0.95rem" }} />
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.88rem" }}>
                    Pune, Maharashtra
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.45} alignItems="center">
                  <AccessTimeRoundedIcon sx={{ color: "#7D8797", fontSize: "0.95rem" }} />
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.88rem" }}>
                    2 hours ago
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.9} flexWrap="wrap">
            {[
              { icon: PhoneOutlinedIcon },
              { icon: MailOutlineRoundedIcon },
              { icon: ShareOutlinedIcon },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "0.95rem",
                    bgcolor: "#FFFFFF",
                    border: "1px solid rgba(225,232,241,0.96)",
                    color: "#0E56C8",
                    p: 0,
                  }}
                >
                  <Icon sx={{ fontSize: "1rem" }} />
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      <Typography
        sx={{
          mb: 1.45,
          color: "#18253A",
          fontSize: "1.2rem",
          fontWeight: 800,
        }}
      >
        System Specifications
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.7fr 0.82fr" },
          gap: 1.8,
          mb: { xs: 2.4, md: 2.8 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1.5,
          }}
        >
          {specCards.map((card) => {
            const Icon = card.icon;
            return (
              <Box
                key={card.label}
                sx={{
                  p: 1.65,
                  minHeight: 104,
                  borderRadius: "1.15rem",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(225,232,241,0.96)",
                  boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "0.8rem",
                    bgcolor: card.bg,
                    color: card.tone,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon sx={{ fontSize: "0.95rem" }} />
                </Box>
                <Typography
                  sx={{
                    mt: 1.2,
                    color: "#8B97A8",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.45,
                    color: "#18253A",
                    fontSize: "0.98rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Stack spacing={1.5}>
          <Box
            sx={{
              p: 1.65,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Typography
              sx={{
                color: "#18253A",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 1.4,
              }}
            >
              Verification Status
            </Typography>

            <Stack spacing={1.05}>
              {verificationRows.map((row) => (
                <Stack
                  key={row.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography sx={{ color: "#5E6A7D", fontSize: "0.8rem" }}>
                    {row.label}
                  </Typography>

                  {row.iconOnly ? (
                    <CheckCircleRoundedIcon sx={{ color: "#239654", fontSize: "1rem" }} />
                  ) : row.tone ? (
                    <Box
                      sx={{
                        px: 0.7,
                        py: 0.28,
                        borderRadius: "999px",
                        bgcolor: row.bg,
                        color: row.tone,
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {row.value}
                    </Box>
                  ) : (
                    <Typography sx={{ color: "#18253A", fontSize: "0.8rem", fontWeight: 700 }}>
                      {row.value}
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 156,
                background:
                  "linear-gradient(135deg, #7E8A7A 0%, #BDAE8A 35%, #7B8E61 70%, #9C9571 100%)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  opacity: 0.38,
                }}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.2, py: 0.9 }}
            >
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem", fontWeight: 500 }}>
                Location Preview
              </Typography>
              <Button
                endIcon={<OpenInNewRoundedIcon />}
                sx={{
                  minHeight: 28,
                  px: 0,
                  color: "#0E56C8",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Map
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Typography
        sx={{
          mb: 1.45,
          color: "#18253A",
          fontSize: "1.2rem",
          fontWeight: 800,
        }}
      >
        Customer Notes
      </Typography>

      <Box
        sx={{
          p: { xs: 1.6, md: 1.8 },
          borderRadius: "1.15rem",
          bgcolor: "#F7F9FD",
          borderLeft: "3px solid #0E56C8",
          boxShadow: "0 14px 28px rgba(16,29,51,0.03)",
          maxWidth: 760,
          mb: { xs: 2.6, md: 2.9 },
          position: "relative",
        }}
      >
        <Typography
          sx={{
            color: "#556478",
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.7,
            fontStyle: "italic",
            maxWidth: 560,
          }}
        >
          Looking for high-efficiency bifacial panels to maximize yield on a
          south-facing roof.
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            right: 18,
            bottom: 10,
            color: "#D7E1F1",
            fontSize: "3.4rem",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {"\u201D"}
        </Typography>
      </Box>

      <Box
        sx={{
          p: { xs: 1.35, md: 1.55 },
          borderRadius: "1.15rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1.4}
        >
          <Box>
            <Typography
              sx={{
                color: "#8B97A8",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Estimated Value
            </Typography>
            <Stack direction="row" spacing={0.6} alignItems="baseline" sx={{ mt: 0.35 }}>
              <Typography sx={{ color: "#118A44", fontSize: "1.8rem", fontWeight: 800 }}>
                \u20B93.2 Lakhs
              </Typography>
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.82rem" }}>
                Project Revenue
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.05} sx={{ flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              sx={{
                minHeight: 40,
                px: 1.8,
                borderRadius: "0.95rem",
                borderColor: "rgba(220,228,238,0.96)",
                bgcolor: "#F5F7FB",
                color: "#556478",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Save for Later
            </Button>
            <Button
              component={RouterLink}
              to="/vendor/leads/ak/quote"
              variant="contained"
              sx={{
                minHeight: 40,
                px: 2,
                borderRadius: "0.95rem",
                bgcolor: "#0E56C8",
                boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Submit Quote
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

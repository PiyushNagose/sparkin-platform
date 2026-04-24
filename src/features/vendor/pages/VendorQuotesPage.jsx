import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link as RouterLink } from "react-router-dom";

const kpiCards = [
  {
    label: "Total Quotes",
    value: "128",
    delta: "+12%",
    icon: "file",
    tone: "#4F89FF",
    bg: "#EEF4FF",
  },
  {
    label: "Pending",
    value: "42",
    icon: "pending",
    tone: "#4F89FF",
    bg: "#EEF4FF",
  },
  {
    label: "Accepted",
    value: "76",
    badge: "High Win Rate",
    icon: "accepted",
    tone: "#1FA453",
    bg: "#E8FAEF",
  },
  {
    label: "Rejected",
    value: "10",
    icon: "rejected",
    tone: "#E05252",
    bg: "#FDECEC",
  },
];

const tabs = ["All", "Pending", "Accepted", "Rejected"];

const quotes = [
  {
    initials: "AS",
    name: "Amit Sharma",
    type: "Residential Project",
    location: "Pune, Maharashtra",
    systemSize: "5.5 kW",
    yourPrice: "\u20B94,25,000",
    status: "Pending",
    statusTone: "#4F89FF",
    statusBg: "#EEF4FF",
    date: "24 Oct, 2023",
  },
  {
    initials: "PK",
    name: "Priya Kulkarni",
    type: "Villa Installation",
    location: "Mumbai, MH",
    systemSize: "8.0 kW",
    yourPrice: "\u20B96,80,000",
    status: "Accepted",
    statusTone: "#1FA453",
    statusBg: "#E8FAEF",
    date: "22 Oct, 2023",
  },
  {
    initials: "RJ",
    name: "Rohan Joshi",
    type: "Small Scale Industrial",
    location: "Nagpur, MH",
    systemSize: "15.0 kW",
    yourPrice: "\u20B912,50,000",
    status: "Under Review",
    statusTone: "#878500",
    statusBg: "#F2F08E",
    date: "21 Oct, 2023",
  },
  {
    initials: "SK",
    name: "Suresh Khan",
    type: "Bungalow Project",
    location: "Nashik, MH",
    systemSize: "3.0 kW",
    yourPrice: "\u20B92,90,000",
    status: "Rejected",
    statusTone: "#E05252",
    statusBg: "#FDECEC",
    date: "18 Oct, 2023",
  },
];

const columns = [
  "Customer",
  "Location",
  "System Size",
  "Your Price (₹)",
  "Status",
  "Date",
  "Actions",
];

function KpiIcon({ type, tone, bg }) {
  const base = {
    width: 30,
    height: 30,
    borderRadius: "0.8rem",
    bgcolor: bg,
    color: tone,
    display: "grid",
    placeItems: "center",
    fontSize: "0.95rem",
    fontWeight: 800,
  };

  if (type === "accepted") {
    return (
      <Box sx={base}>
        <CheckRoundedIcon sx={{ fontSize: "0.95rem" }} />
      </Box>
    );
  }

  if (type === "rejected") {
    return (
      <Box sx={base}>
        <CloseRoundedIcon sx={{ fontSize: "0.95rem" }} />
      </Box>
    );
  }

  return <Box sx={base}>□</Box>;
}

export default function VendorQuotesPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: { xs: 2.4, md: 2.8 } }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.1rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Quotes
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Manage and track all your submitted quotes
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/vendor/quotes/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            minHeight: 38,
            px: 1.7,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Create New Quote
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.4, md: 2.7 },
        }}
      >
        {kpiCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              p: 1.65,
              minHeight: 108,
              borderRadius: "1.15rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <KpiIcon type={card.icon} tone={card.tone} bg={card.bg} />
              {card.delta ? (
                <Typography sx={{ color: "#778597", fontSize: "0.58rem", fontWeight: 800 }}>
                  {card.delta}
                </Typography>
              ) : card.badge ? (
                <Box
                  sx={{
                    px: 0.75,
                    py: 0.28,
                    borderRadius: "999px",
                    bgcolor: "#9AF39D",
                    color: "#167D2E",
                    fontSize: "0.54rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {card.badge}
                </Box>
              ) : null}
            </Stack>
            <Typography
              sx={{
                mt: 1.2,
                color: "#6F7D8F",
                fontSize: "0.76rem",
                fontWeight: 500,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                color: "#18253A",
                fontSize: "1.9rem",
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          borderRadius: "1.55rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
          overflow: "hidden",
          mb: { xs: 2.5, md: 2.8 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.2}
          sx={{ px: 1.7, pt: 1.5 }}
        >
          <Stack direction="row" spacing={0.7} flexWrap="wrap">
            {tabs.map((tab, index) => (
              <Button
                key={tab}
                sx={{
                  minHeight: 30,
                  px: 1.2,
                  borderRadius: "999px",
                  bgcolor: index === 0 ? "#0E56C8" : "transparent",
                  color: index === 0 ? "#FFFFFF" : "#556478",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {tab}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.8} flexWrap="wrap">
            <Button
              startIcon={<TuneRoundedIcon />}
              variant="outlined"
              sx={{
                minHeight: 32,
                px: 1.2,
                borderRadius: "0.8rem",
                borderColor: "rgba(225,232,241,0.96)",
                color: "#556478",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              More Filters
            </Button>
            <Button
              startIcon={<FileDownloadOutlinedIcon />}
              variant="outlined"
              sx={{
                minHeight: 32,
                px: 1.2,
                borderRadius: "0.8rem",
                borderColor: "rgba(225,232,241,0.96)",
                color: "#556478",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.7, pt: 1.55, pb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.25fr 1fr 0.72fr 0.98fr 0.92fr 0.88fr 0.95fr",
              gap: 1,
            }}
          >
            {columns.map((column) => (
              <Typography
                key={column}
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.56rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {column}
              </Typography>
            ))}
          </Box>
        </Box>

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 1.7 }, pb: 1.1 }}>
          {quotes.map((quote, index) => (
            <Box
              key={quote.name}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.55 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", lg: "grid" },
                  gridTemplateColumns: "1.25fr 1fr 0.72fr 0.98fr 0.92fr 0.88fr 0.95fr",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "#EEF2F8",
                      color: "#667388",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                    }}
                  >
                    {quote.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.86rem", fontWeight: 700, lineHeight: 1.15 }}>
                      {quote.name}
                    </Typography>
                    <Typography sx={{ mt: 0.15, color: "#98A3B2", fontSize: "0.66rem", lineHeight: 1.3 }}>
                      {quote.type}
                    </Typography>
                  </Box>
                </Stack>

                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem", lineHeight: 1.35 }}>
                  {quote.location}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.76rem", fontWeight: 600 }}>
                  {quote.systemSize}
                </Typography>
                <Typography sx={{ color: "#0E56C8", fontSize: "0.8rem", fontWeight: 800 }}>
                  {quote.yourPrice}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 0.9,
                    py: 0.34,
                    borderRadius: "999px",
                    bgcolor: quote.statusBg,
                    color: quote.statusTone,
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {quote.status}
                </Box>
                <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem" }}>
                  {quote.date}
                </Typography>

                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Button
                    sx={{
                      minWidth: 30,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      p: 0,
                      color: "#0E56C8",
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      minHeight: 30,
                      px: 1,
                      borderRadius: "0.8rem",
                      borderColor: "rgba(225,232,241,0.96)",
                      bgcolor: "#F6F8FB",
                      color: "#223146",
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={1.1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#EEF2F8",
                        color: "#667388",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                      }}
                    >
                      {quote.initials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: "#223146", fontSize: "0.9rem", fontWeight: 700 }}>
                        {quote.name}
                      </Typography>
                      <Typography sx={{ color: "#98A3B2", fontSize: "0.7rem", mt: 0.12 }}>
                        {quote.type}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {[
                      ["Location", quote.location],
                      ["System Size", quote.systemSize],
                      ["Your Price", quote.yourPrice],
                      ["Date", quote.date],
                    ].map(([label, value]) => (
                      <Box key={label}>
                        <Typography
                          sx={{
                            color: "#98A3B2",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.22,
                            color: label === "Your Price" ? "#0E56C8" : "#223146",
                            fontSize: "0.76rem",
                            fontWeight: label === "Your Price" ? 800 : 600,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Box
                      sx={{
                        px: 0.9,
                        py: 0.34,
                        borderRadius: "999px",
                        bgcolor: quote.statusBg,
                        color: quote.statusTone,
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {quote.status}
                    </Box>
                    <Button
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        p: 0,
                        color: "#0E56C8",
                      }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        minHeight: 30,
                        px: 1,
                        borderRadius: "0.8rem",
                        borderColor: "rgba(225,232,241,0.96)",
                        bgcolor: "#F6F8FB",
                        color: "#223146",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.4}
          sx={{
            px: { xs: 1.2, md: 1.7 },
            py: 1.25,
            borderTop: "1px solid rgba(234,239,245,0.95)",
          }}
        >
          <Typography sx={{ color: "#738094", fontSize: "0.72rem", fontWeight: 500 }}>
            Showing 1 to 4 of 128 quotes
          </Typography>

          <Stack direction="row" spacing={0.45} alignItems="center">
            <Button
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                sx={{
                  minWidth: 30,
                  width: 30,
                  height: 30,
                  borderRadius: "0.6rem",
                  p: 0,
                  color: page === 1 ? "#FFFFFF" : "#223146",
                  bgcolor: page === 1 ? "#0E56C8" : "#FFFFFF",
                  border: page === 1 ? "none" : "1px solid rgba(225,232,241,0.96)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              sx={{
                minWidth: 30,
                width: 30,
                height: 30,
                borderRadius: "0.6rem",
                color: "#647387",
                p: 0,
                border: "1px solid rgba(225,232,241,0.96)",
              }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.35fr 0.95fr" },
          gap: 1.8,
        }}
      >
        <Box
          sx={{
            p: 1.7,
            borderRadius: "1.35rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Typography sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}>
            Quote Insights
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1.6}
            sx={{ mt: 1.2 }}
          >
            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ color: "#5E6A7D", fontSize: "0.84rem", lineHeight: 1.7 }}>
                Your conversion rate has increased by 15% this month compared
                to the regional average. Try optimizing your pricing for Pune
                region leads.
              </Typography>
              <Button
                sx={{
                  mt: 2,
                  px: 0,
                  minHeight: 28,
                  color: "#0E56C8",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Detailed Analytics →
              </Button>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: 112 },
                height: 112,
                borderRadius: "1rem",
                bgcolor: "#F4F7FB",
                display: "grid",
                placeItems: "center",
                color: "#8CB2EA",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              ↗
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            p: 1.7,
            borderRadius: "1.35rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 18px 34px rgba(14,86,200,0.18)",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "0.8rem",
              bgcolor: "rgba(255,255,255,0.14)",
              display: "grid",
              placeItems: "center",
              fontSize: "0.95rem",
            }}
          >
            ✦
          </Box>
          <Typography sx={{ mt: 1.2, fontSize: "1.1rem", fontWeight: 800 }}>
            Smart Pricing Suggestion
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              maxWidth: 290,
              color: "rgba(255,255,255,0.78)",
              fontSize: "0.8rem",
              lineHeight: 1.65,
            }}
          >
            Current market trends suggest ₹ 3.9L - 4.1L for 5kW systems in
            your area. Adjusting quotes could increase acceptance.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2.2,
              minHeight: 38,
              width: "100%",
              borderRadius: "0.9rem",
              bgcolor: "#FFFFFF",
              color: "#0E56C8",
              boxShadow: "none",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#FFFFFF" },
            }}
          >
            Review Pricing Strategy
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

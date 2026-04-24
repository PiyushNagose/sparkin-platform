import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import vendorHeatmapPlaceholder from "@/shared/assets/images/vendor/dashboard/vendor-heatmap-placeholder.png";

const kpiCards = [
  {
    icon: Groups2RoundedIcon,
    label: "New Leads",
    value: "24",
    delta: "+12%",
    color: "#4F7FFF",
    bg: "#EEF4FF",
  },
  {
    icon: AccessTimeRoundedIcon,
    label: "Avg. Response",
    value: "2.4 hrs",
    delta: "+8%",
    color: "#A04FFF",
    bg: "#F4EDFF",
  },
  {
    icon: RequestQuoteRoundedIcon,
    label: "Quotes Submitted",
    value: "18",
    delta: "+5%",
    color: "#F0A33D",
    bg: "#FFF4E8",
  },
  {
    icon: CheckCircleRoundedIcon,
    label: "Won Projects",
    value: "12",
    delta: "+24%",
    color: "#90A524",
    bg: "#F6F7D8",
  },
  {
    icon: CurrencyRupeeRoundedIcon,
    label: "Revenue",
    value: "\u20B914.5L",
    delta: "+18%",
    color: "#47A26D",
    bg: "#E9F7EE",
  },
];

const leads = [
  {
    initials: "AS",
    name: "Amit Sharma",
    location: "Mumbai, MH",
    system: "5.5 kW",
    budget: "\u20B94,20,000",
    status: "New",
    tone: "#4F89FF",
    bg: "#EEF4FF",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    location: "Bangalore, KA",
    system: "8.0 kW",
    budget: "\u20B96,50,000",
    status: "In Progress",
    tone: "#8C9400",
    bg: "#F7F6C7",
  },
  {
    initials: "RK",
    name: "Rohan Kulkarni",
    location: "Pune, MH",
    system: "3.5 kW",
    budget: "\u20B92,80,000",
    status: "Quoted",
    tone: "#2B9C58",
    bg: "#E7F8EC",
  },
  {
    initials: "VJ",
    name: "Vikram Jain",
    location: "Nashik, MH",
    system: "10.0 kW",
    budget: "\u20B98,10,000",
    status: "New",
    tone: "#4F89FF",
    bg: "#EEF4FF",
  },
];

const activities = [
  {
    color: "#2E78FF",
    title: "Quote #QS-8820 signed by Arijit Verma",
    time: "12 mins ago",
  },
  {
    color: "#95A000",
    title: "Site survey completed for Project Skyline",
    time: "2 hours ago",
  },
  {
    color: "#1C9B57",
    title: "Milestone payment received: \u20B91,25,000",
    time: "4 hours ago",
  },
  {
    color: "#8E98A9",
    title: "New lead assigned: Rahul Deshmukh",
    time: "Yesterday",
  },
];

const feedback = [
  {
    quote:
      "The installation was incredibly smooth. The technician, Sandeep M., was professional and explained every step clearly.",
    author: "Vikas Rathore",
    time: "2 days ago",
  },
  {
    quote:
      "Excellent technician performance by Kiran Rao. The work progress was on schedule, although the final handoff needed one more review.",
    author: "Meera Nair",
    time: "1 week ago",
  },
];

export default function VendorDashboardPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
        sx={{ mb: { xs: 2.8, md: 3.2 } }}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "2rem", md: "2.2rem" },
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: "-0.045em",
            }}
          >
            Vendor Dashboard
          </Typography>
          <Typography
            sx={{
              mt: 0.6,
              maxWidth: 430,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.62,
            }}
          >
            Real-time overview of your solar installation pipeline across
            Maharashtra and Karnataka regions.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.1}>
          <Button
            variant="outlined"
            sx={{
              minHeight: 36,
              px: 1.8,
              borderRadius: "999px",
              borderColor: "rgba(208,216,226,0.95)",
              color: "#223146",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            sx={{
              minHeight: 36,
              px: 1.8,
              borderRadius: "999px",
              bgcolor: "#0E56C8",
              boxShadow: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Download Leads
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.4, md: 2.8 },
        }}
      >
        {kpiCards.slice(0, 4).map((card) => {
          const Icon = card.icon;

          return (
            <Box
              key={card.label}
              sx={{
                p: 2.1,
                minHeight: 114,
                borderRadius: "1.35rem",
                bgcolor: "#FFFFFF",
                border: "1px solid rgba(225,232,241,0.96)",
                boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "0.8rem",
                    bgcolor: card.bg,
                    color: card.color,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon sx={{ fontSize: "0.95rem" }} />
                </Box>
                <Typography
                  sx={{
                    color: "#3DAB62",
                    fontSize: "0.66rem",
                    fontWeight: 800,
                  }}
                >
                  {card.delta}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  mt: 1.5,
                  color: "#8B97A8",
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {card.label}
              </Typography>
              <Typography
                sx={{
                  mt: 0.55,
                  color: "#18253A",
                  fontSize: "1.55rem",
                  fontWeight: 800,
                  lineHeight: 1.06,
                }}
              >
                {card.value}
              </Typography>
            </Box>
          );
        })}

        <Box
          sx={{
            p: 2.1,
            minHeight: 114,
            borderRadius: "1.35rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            gridColumn: { xs: "auto", md: "span 1" },
            maxWidth: { xs: "100%", md: 188 },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "0.8rem",
                bgcolor: kpiCards[4].bg,
                color: kpiCards[4].color,
                display: "grid",
                placeItems: "center",
              }}
            >
              <CurrencyRupeeRoundedIcon sx={{ fontSize: "0.95rem" }} />
            </Box>
            <Typography
              sx={{ color: "#3DAB62", fontSize: "0.66rem", fontWeight: 800 }}
            >
              {kpiCards[4].delta}
            </Typography>
          </Stack>
          <Typography
            sx={{
              mt: 1.5,
              color: "#8B97A8",
              fontSize: "0.67rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Revenue
          </Typography>
          <Typography
            sx={{
              mt: 0.55,
              color: "#18253A",
              fontSize: "1.55rem",
              fontWeight: 800,
              lineHeight: 1.06,
            }}
          >
            {kpiCards[4].value}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.55fr 0.82fr" },
          gap: 1.8,
          mb: { xs: 2.4, md: 2.8 },
        }}
      >
        <Box
          sx={{
            p: 2.2,
            borderRadius: "1.45rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              sx={{ color: "#18253A", fontSize: "1.12rem", fontWeight: 800 }}
            >
              Active Leads
            </Typography>
            <Stack direction="row" spacing={0.9} alignItems="center">
              <Typography
                sx={{ color: "#798698", fontSize: "0.72rem", fontWeight: 600 }}
              >
                Filter by Status:
              </Typography>
              <Typography
                sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 700 }}
              >
                All Leads
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr 0.78fr 0.9fr 0.9fr 0.55fr",
              gap: 1,
              px: 0.4,
              mb: 1.1,
            }}
          >
            {[
              "Customer Name",
              "Location",
              "System Size",
              "Budget",
              "Status",
              "Actions",
            ].map((label) => (
              <Typography
                key={label}
                sx={{
                  color: "#8B97A8",
                  fontSize: "0.61rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          <Stack spacing={0.35}>
            {leads.map((lead) => (
              <Box
                key={lead.name}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.35fr 1fr 0.78fr 0.9fr 0.9fr 0.55fr",
                  gap: 1,
                  alignItems: "center",
                  px: 0.4,
                  py: 1.15,
                  borderRadius: "0.95rem",
                  "&:hover": { bgcolor: "#F8FAFD" },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "#EFF3F9",
                      color: "#18253A",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                    }}
                  >
                    {lead.initials}
                  </Avatar>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.79rem",
                      fontWeight: 700,
                    }}
                  >
                    {lead.name}
                  </Typography>
                </Stack>
                <Typography sx={{ color: "#4E5C70", fontSize: "0.79rem" }}>
                  {lead.location}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.79rem" }}>
                  {lead.system}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.79rem" }}>
                  {lead.budget}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 1,
                    py: 0.42,
                    borderRadius: "999px",
                    bgcolor: lead.bg,
                    color: lead.tone,
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {lead.status}
                </Box>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  <VisibilityOutlinedIcon
                    sx={{ color: "#93A0B3", fontSize: "0.9rem" }}
                  />
                  <MailOutlineRoundedIcon
                    sx={{ color: "#93A0B3", fontSize: "0.9rem" }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>

          <Typography
            sx={{
              mt: 1.8,
              color: "#0E56C8",
              fontSize: "0.76rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            View all active leads
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2.2,
            borderRadius: "1.45rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Typography
            sx={{
              color: "#18253A",
              fontSize: "1.12rem",
              fontWeight: 800,
              mb: 1.8,
            }}
          >
            Recent Activity
          </Typography>
          <Stack spacing={1.4}>
            {activities.map((item) => (
              <Stack
                key={item.title}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: item.color,
                    mt: 0.52,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "0.79rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.25, color: "#8B97A8", fontSize: "0.71rem" }}
                  >
                    {item.time}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2.1,
              minHeight: 40,
              borderRadius: "0.95rem",
              borderColor: "rgba(222,228,236,0.96)",
              color: "#556478",
              bgcolor: "#F7F9FC",
              textTransform: "none",
              fontSize: "0.76rem",
              fontWeight: 700,
            }}
          >
            View Audit Log
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2.2,
          borderRadius: "1.45rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          mb: { xs: 2.4, md: 2.8 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.6 }}
        >
          <Typography
            sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}
          >
            Customer Feedback
          </Typography>
          <Stack direction="row" spacing={0.35} alignItems="center">
            <StarRoundedIcon sx={{ color: "#FFB648", fontSize: "0.98rem" }} />
            <Typography
              sx={{ color: "#F39A20", fontSize: "0.76rem", fontWeight: 800 }}
            >
              4.8
            </Typography>
            <Typography sx={{ color: "#8B97A8", fontSize: "0.71rem" }}>
              (120+ reviews)
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.4,
          }}
        >
          {feedback.map((item) => (
            <Box
              key={item.author}
              sx={{
                p: 1.6,
                minHeight: 126,
                borderRadius: "1.05rem",
                bgcolor: "#FBFCFE",
                border: "1px solid rgba(231,236,244,0.96)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box sx={{ display: "flex", gap: 0.18 }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarRoundedIcon
                      key={index}
                      sx={{ color: "#FFB648", fontSize: "0.82rem" }}
                    />
                  ))}
                </Box>
                <Typography
                  sx={{
                    color: "#A1ACBA",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {item.time}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  mt: 1.2,
                  color: "#556478",
                  fontSize: "0.8rem",
                  lineHeight: 1.65,
                  fontStyle: "italic",
                }}
              >
                "{item.quote}"
              </Typography>
              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                sx={{ mt: 1.6 }}
              >
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    bgcolor: "#E4EAF4",
                    fontSize: "0.62rem",
                  }}
                >
                  {item.author[0]}
                </Avatar>
                <Typography
                  sx={{
                    color: "#223146",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {item.author}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.55fr 0.82fr" },
          gap: 1.8,
        }}
      >
        <Box
          sx={{
            p: 2.2,
            borderRadius: "1.45rem",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(225,232,241,0.96)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.5 }}
          >
            <Typography
              sx={{ color: "#18253A", fontSize: "1.08rem", fontWeight: 800 }}
            >
              Installation Heatmap
            </Typography>
            <Stack direction="row" spacing={0.6}>
              {["Maharashtra", "Karnataka"].map((chip, index) => (
                <Box
                  key={chip}
                  sx={{
                    px: 0.8,
                    py: 0.3,
                    borderRadius: "999px",
                    bgcolor: index === 0 ? "#EAF1FF" : "#F3F5F9",
                    color: index === 0 ? "#0E56C8" : "#7D899A",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {chip}
                </Box>
              ))}
            </Stack>
          </Stack>

          <Box
            sx={{
              height: 168,
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid rgba(220,228,238,0.96)",
              backgroundImage: `url(${vendorHeatmapPlaceholder})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Box>

        <Box
          sx={{
            p: 2.35,
            borderRadius: "1.45rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            boxShadow: "0 18px 34px rgba(14,86,200,0.18)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 228,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "0.85rem",
              bgcolor: "rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <MapOutlinedIcon sx={{ fontSize: "1rem" }} />
          </Box>
          <Box sx={{ mt: 2.2 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 800 }}>
              Total Power Yield
            </Typography>
            <Typography
              sx={{
                mt: 0.7,
                maxWidth: 220,
                color: "rgba(255,255,255,0.78)",
                fontSize: "0.82rem",
                lineHeight: 1.62,
              }}
            >
              Your installed capacity is powering 240+ households this month.
            </Typography>
          </Box>
          <Typography
            sx={{ mt: 3.2, fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}
          >
            842
            <Typography
              component="span"
              sx={{ ml: 0.6, fontSize: "1rem", fontWeight: 700, opacity: 0.82 }}
            >
              MWH
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

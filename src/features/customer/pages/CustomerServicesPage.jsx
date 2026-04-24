import { Box, Button, Stack, Typography } from "@mui/material";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import customerServicesGuidePlaceholder from "@/shared/assets/images/customer/services/customer-services-guide-placeholder.png";

const tabs = [
  { label: "Active", active: true },
  { label: "History", active: false },
];

const services = [
  {
    icon: <HandymanOutlinedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#EEF4FF",
    iconTone: "#0E56C8",
    status: "In Progress",
    statusBg: "#E7F318",
    statusTone: "#6C7300",
    ticket: "Ticket ID: #SR-1024",
    title: "System Maintenance",
    description:
      "Full diagnostic and performance optimization for inverter units.",
    progressIcon: <ManageSearchRoundedIcon sx={{ fontSize: "0.95rem" }} />,
    progressLabel: "Status: Contacted",
    date: "Nov 12, 2023",
  },
  {
    icon: <CleaningServicesOutlinedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#E8FAEF",
    iconTone: "#177D45",
    status: "Pending",
    statusBg: "#F2F5F8",
    statusTone: "#677487",
    ticket: "Ticket ID: #SR-1018",
    title: "Panel Cleaning",
    description:
      "Removal of debris and dust to increase sunlight absorption efficiency.",
    progressIcon: <ScheduleOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    progressLabel: "Status: Requested",
    date: "Nov 10, 2023",
  },
  {
    icon: <SupportAgentRoundedIcon sx={{ fontSize: "1rem" }} />,
    iconBg: "#F4F1C9",
    iconTone: "#808000",
    status: "Action Required",
    statusBg: "#FFF0EE",
    statusTone: "#D92D20",
    ticket: "Ticket ID: #SR-0995",
    title: "Repair & Support",
    description:
      "Cable wiring audit and structural support inspection for North Array.",
    progressIcon: <ReceiptLongOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
    progressLabel: "Status: Quote Shared",
    date: "Nov 05, 2023",
  },
];

function ServiceCard({ item }) {
  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "1.3rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "0.92rem",
            bgcolor: item.iconBg,
            color: item.iconTone,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {item.icon}
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            px: 0.82,
            py: 0.34,
            borderRadius: "999px",
            bgcolor: item.statusBg,
            color: item.statusTone,
            fontSize: "0.56rem",
            fontWeight: 800,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {item.status}
        </Box>
      </Stack>

      <Typography
        sx={{ mt: 1.1, color: "#B0B8C5", fontSize: "0.72rem", fontWeight: 500 }}
      >
        {item.ticket}
      </Typography>

      <Typography
        sx={{
          mt: 0.35,
          color: "#223146",
          fontSize: "1rem",
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {item.title}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,
          color: "#647387",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          minHeight: 64,
        }}
      >
        {item.description}
      </Typography>

      <Box
        sx={{
          mt: 1.15,
          p: 0.92,
          borderRadius: "0.95rem",
          bgcolor: "#F3F6FB",
        }}
      >
        <Stack direction="row" spacing={0.6} alignItems="center">
          <Box sx={{ color: "#0E56C8", display: "grid", placeItems: "center" }}>
            {item.progressIcon}
          </Box>
          <Typography
            sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 500 }}
          >
            {item.progressLabel}
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.2 }}
      >
        <Typography
          sx={{ color: "#B0B8C5", fontSize: "0.68rem", fontWeight: 500 }}
        >
          {item.date}
        </Typography>
        <Button
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
          sx={{
            minHeight: 28,
            px: 0,
            color: "#0E56C8",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          Track Service
        </Button>
      </Stack>
    </Box>
  );
}

export default function CustomerServicesPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: { xs: "1.95rem", md: "2.05rem" },
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            My Services
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#4F5F73",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              maxWidth: 430,
            }}
          >
            Track your service requests and history in real-time. Our team
            ensures your energy output is always at peak efficiency.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={0.45}
          sx={{
            p: 0.45,
            borderRadius: "1rem",
            bgcolor: "#F4F7FB",
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              sx={{
                minHeight: 34,
                px: 1.6,
                borderRadius: "0.85rem",
                bgcolor: tab.active ? "#FFFFFF" : "transparent",
                color: tab.active ? "#0E56C8" : "#4E5D70",
                boxShadow: tab.active
                  ? "0 8px 18px rgba(16,29,51,0.06)"
                  : "none",
                fontSize: "0.78rem",
                fontWeight: tab.active ? 700 : 500,
                textTransform: "none",
                "&:hover": { bgcolor: tab.active ? "#FFFFFF" : "transparent" },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        {services.map((item) => (
          <ServiceCard key={item.ticket} item={item} />
        ))}
      </Box>

      <Button
        variant="contained"
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />}
        sx={{
          mt: 1.8,
          minHeight: 38,
          px: 1.55,
          borderRadius: "0.95rem",
          bgcolor: "#0E56C8",
          boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Request Service
      </Button>

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.95fr 0.95fr" },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1.55,
            borderRadius: "1.35rem",
            color: "#FFFFFF",
            background:
              "linear-gradient(135deg, rgba(34,76,151,0.96) 0%, rgba(27,57,114,0.94) 100%)",
            boxShadow: "0 14px 28px rgba(16,29,51,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={customerServicesGuidePlaceholder}
            alt="Performance guide placeholder"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.78,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(25,54,109,0.42) 0%, rgba(18,38,78,0.22) 100%)",
            }}
          />
          <Typography
            sx={{
              fontSize: "1.05rem",
              fontWeight: 800,
              position: "relative",
              zIndex: 1,
            }}
          >
            Maximize Your Savings
          </Typography>
          <Typography
            sx={{
              mt: 0.6,
              maxWidth: 340,
              color: "rgba(255,255,255,0.82)",
              fontSize: "0.8rem",
              lineHeight: 1.68,
              position: "relative",
              zIndex: 1,
            }}
          >
            Learn how regular maintenance can increase your energy output by up
            to 25%.
          </Typography>
          <Button
            sx={{
              mt: 1.45,
              minHeight: 34,
              px: 1.35,
              borderRadius: "0.85rem",
              bgcolor: "#FFFFFF",
              color: "#0E56C8",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#FFFFFF" },
              position: "relative",
              zIndex: 1,
            }}
          >
            Read Performance Guide
          </Button>
        </Box>

        <Box
          sx={{
            p: 1.55,
            borderRadius: "1.35rem",
            bgcolor: "#E7F318",
            boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <LocalFloristOutlinedIcon
            sx={{
              color: "#6C7300",
              fontSize: "1.45rem",
            }}
          />
          <Typography
            sx={{
              mt: 1.05,
              color: "#4F5600",
              fontSize: "1.2rem",
              fontWeight: 800,
            }}
          >
            Carbon Offset
          </Typography>
          <Typography
            sx={{
              mt: 0.55,
              color: "#677100",
              fontSize: "0.82rem",
              lineHeight: 1.6,
              maxWidth: 220,
            }}
          >
            Your panels have saved 4.2 metric tons of CO2 this year. Keep it up!
          </Typography>

          <Box
            sx={{
              mt: 2,
              width: "100%",
              height: 6,
              borderRadius: "999px",
              bgcolor: "rgba(108,115,0,0.14)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "76%",
                height: "100%",
                borderRadius: "999px",
                bgcolor: "#6C7300",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import { Box, Button, Stack, Typography } from "@mui/material";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";

const projects = [
  {
    status: "Active",
    statusTone: "#6C7300",
    statusBg: "#E7F318",
    id: "#SOL-2941",
    title: "Gurgaon, Sector 45",
    subtitle: "5kW Rooftop Solar System",
    vendorInitials: "TP",
    vendorName: "Tata Power Solar",
    action: "Track Project",
    actionPrimary: true,
    steps: [
      { label: "Site Visit", meta: "Oct 12, 2023", state: "completed", icon: "check" },
      { label: "Installation", meta: "In Progress", state: "active", icon: "install" },
      { label: "Inspection", meta: "Pending", state: "upcoming", icon: "inspect" },
      { label: "Activation", meta: "Pending", state: "upcoming", icon: "power" },
    ],
  },
  {
    status: "Pending",
    statusTone: "#239654",
    statusBg: "#E8FAEF",
    id: "#SOL-3102",
    title: "Noida, Sector 62",
    subtitle: "10kW Commercial System",
    vendorInitials: "LS",
    vendorName: "Luminous Solar",
    action: "Reschedule Visit",
    actionPrimary: false,
    steps: [
      { label: "Site Visit", meta: "Scheduled: Oct 28", state: "active", icon: "calendar" },
      { label: "Installation", meta: "Upcoming", state: "upcoming", icon: "install" },
      { label: "Inspection", meta: "Upcoming", state: "upcoming", icon: "inspect" },
      { label: "Activation", meta: "Upcoming", state: "upcoming", icon: "power" },
    ],
  },
];

function StepIcon({ step }) {
  const isActive = step.state === "active";
  const isCompleted = step.state === "completed";
  const bg = isCompleted || isActive ? "#0E56C8" : "#EEF2F7";
  const color = isCompleted || isActive ? "#FFFFFF" : "#8E99A8";

  if (step.icon === "check") {
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: bg,
          color,
          display: "grid",
          placeItems: "center",
          fontSize: "0.82rem",
          fontWeight: 800,
          boxShadow: isCompleted ? "0 10px 18px rgba(14,86,200,0.16)" : "none",
        }}
      >
        {"\u2713"}
      </Box>
    );
  }

  const IconComponent =
    step.icon === "calendar"
      ? CalendarMonthOutlinedIcon
      : step.icon === "install"
        ? HandymanOutlinedIcon
        : step.icon === "inspect"
          ? SearchOutlinedIcon
          : BoltOutlinedIcon;

  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        bgcolor: bg,
        color,
        display: "grid",
        placeItems: "center",
        boxShadow: isActive ? "0 10px 18px rgba(14,86,200,0.16)" : "none",
      }}
    >
      <IconComponent sx={{ fontSize: "0.86rem" }} />
    </Box>
  );
}

function ProjectMilestone({ step, isFirst, isLast }) {
  const lineTone = step.state === "completed" ? "#0E56C8" : "#D9E0EA";

  return (
    <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
      {!isFirst && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "-50%",
            width: "100%",
            height: 2,
            bgcolor: lineTone,
          }}
        />
      )}
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 13,
            left: "50%",
            width: "100%",
            height: 2,
            bgcolor: step.state === "upcoming" ? "#D9E0EA" : "#0E56C8",
          }}
        />
      )}

      <Stack alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <StepIcon step={step} />
        <Typography
          sx={{
            mt: 0.9,
            color: step.state === "active" ? "#0E56C8" : "#223146",
            fontSize: "0.72rem",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.28,
          }}
        >
          {step.label}
        </Typography>
        <Typography
          sx={{
            mt: 0.18,
            color: step.state === "active" ? "#0E56C8" : "#8C97A7",
            fontSize: "0.56rem",
            fontWeight: step.state === "active" ? 800 : 500,
            textAlign: "center",
            textTransform: step.state === "active" ? "uppercase" : "none",
          }}
        >
          {step.meta}
        </Typography>
      </Stack>
    </Box>
  );
}

function ProjectCard({ item }) {
  return (
    <Box
      sx={{
        p: { xs: 1.35, md: 1.6 },
        borderRadius: "1.35rem",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
        boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
      }}
    >
      <Stack
        direction={{ xs: "column", xl: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", xl: "center" }}
      >
        <Stack spacing={1.4} sx={{ minWidth: 0, flex: 1 }}>
          <Box>
            <Stack direction="row" spacing={0.55} alignItems="center" flexWrap="wrap" useFlexGap>
              <Box
                sx={{
                  display: "inline-flex",
                  px: 0.78,
                  py: 0.32,
                  borderRadius: "999px",
                  bgcolor: item.statusBg,
                  color: item.statusTone,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {item.status}
              </Box>
              <Typography sx={{ color: "#6F7D8F", fontSize: "0.72rem", fontWeight: 600 }}>
                {item.id}
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 0.8,
                color: "#223146",
                fontSize: { xs: "1.45rem", md: "1.65rem" },
                fontWeight: 800,
                lineHeight: 1.08,
              }}
            >
              {item.title}
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: "#6F7D8F" }}>
              <HomeWorkOutlinedIcon sx={{ fontSize: "0.82rem" }} />
              <Typography sx={{ fontSize: "0.84rem", lineHeight: 1.55 }}>{item.subtitle}</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              Assigned Vendor
            </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.7 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "0.72rem",
                  bgcolor: "#E8EEFF",
                  color: "#0E56C8",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                }}
              >
                {item.vendorInitials}
              </Box>
              <Typography sx={{ color: "#223146", fontSize: "0.95rem", fontWeight: 700 }}>
                {item.vendorName}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ flex: 1.1, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 0 }}
            sx={{ pr: { xl: 1.5 } }}
          >
            {item.steps.map((step, index) => (
              <ProjectMilestone
                key={step.label}
                step={step}
                isFirst={index === 0}
                isLast={index === item.steps.length - 1}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: "flex", justifyContent: { xs: "stretch", xl: "flex-end" } }}>
          <Button
            variant={item.actionPrimary ? "contained" : "outlined"}
            endIcon={item.actionPrimary ? <ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} /> : <EditOutlinedIcon sx={{ fontSize: "0.92rem" }} />}
            sx={{
              minHeight: 38,
              px: 1.5,
              width: { xs: "100%", sm: "auto" },
              borderRadius: "0.95rem",
              bgcolor: item.actionPrimary ? "#0E56C8" : "#F3F6FB",
              color: item.actionPrimary ? "#FFFFFF" : "#223146",
              borderColor: item.actionPrimary ? "#0E56C8" : "rgba(225,232,241,0.96)",
              boxShadow: item.actionPrimary ? "0 12px 24px rgba(14,86,200,0.14)" : "none",
              fontSize: "0.76rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {item.action}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

function PromoCard({ title, description, buttonLabel, tone = "blue", icon }) {
  const config =
    tone === "green"
      ? {
          bg: "#087A2D",
          buttonBg: "#065C22",
          shadow: "0 16px 28px rgba(8,122,45,0.18)",
        }
      : {
          bg: "#0E56C8",
          buttonBg: "#FFFFFF",
          shadow: "0 16px 28px rgba(14,86,200,0.18)",
        };

  return (
    <Box
      sx={{
        p: 1.55,
        borderRadius: "1.25rem",
        bgcolor: config.bg,
        color: "#FFFFFF",
        boxShadow: config.shadow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: -8,
          bottom: -18,
          opacity: 0.12,
          transform: "scale(1.25)",
        }}
      >
        {icon}
      </Box>

      <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, position: "relative", zIndex: 1 }}>
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.55,
          maxWidth: 300,
          color: "rgba(255,255,255,0.82)",
          fontSize: "0.78rem",
          lineHeight: 1.65,
          position: "relative",
          zIndex: 1,
        }}
      >
        {description}
      </Typography>
      <Button
        sx={{
          mt: 1.35,
          minHeight: 34,
          px: 1.35,
          borderRadius: "0.85rem",
          bgcolor: config.buttonBg,
          color: tone === "green" ? "#FFFFFF" : "#0E56C8",
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: config.buttonBg },
          position: "relative",
          zIndex: 1,
        }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}

export default function CustomerProjectsPage() {
  return (
    <Box sx={{ width: "100%" }}>
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
          My Projects
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: "#6F7D8F",
            fontSize: "0.92rem",
            lineHeight: 1.6,
          }}
        >
          Track your solar installation progress and manage milestones.
        </Typography>
      </Box>

      <Stack spacing={1.6} sx={{ mt: 1.85 }}>
        {projects.map((item) => (
          <ProjectCard key={item.id} item={item} />
        ))}
      </Stack>

      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 1.45,
        }}
      >
        <PromoCard
          title={"Refer a friend, save \u20B95000"}
          description="Earn credits on your installation by sharing Sparkin Solar with your network."
          buttonLabel="Get Referral Code"
          icon={<RedeemRoundedIcon sx={{ fontSize: "5rem" }} />}
        />
        <PromoCard
          title="Need Help?"
          description="Connect with your project manager for any technical queries or delays."
          buttonLabel="Contact Support"
          tone="green"
          icon={<SupportAgentRoundedIcon sx={{ fontSize: "5rem" }} />}
        />
      </Box>
    </Box>
  );
}

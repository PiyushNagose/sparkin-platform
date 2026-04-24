import {
  Avatar,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import { Link as RouterLink } from "react-router-dom";

const kpiCards = [
  {
    label: "Active Projects",
    value: "24",
    tone: "#4F89FF",
    bg: "#EEF4FF",
    icon: "□",
  },
  {
    label: "Installation in Progress",
    value: "8",
    tone: "#7D7B00",
    bg: "#F4F1C9",
    icon: "◌",
  },
  {
    label: "Pending Start",
    value: "6",
    tone: "#8F98A7",
    bg: "#F2F5F8",
    icon: "◔",
  },
  {
    label: "Completed",
    value: "112",
    tone: "#239654",
    bg: "#E4F7EA",
    icon: "✓",
  },
];

const tabs = ["All", "Active", "In Progress", "Completed"];

const projects = [
  {
    initials: "AS",
    id: "amit-sharma",
    name: "Amit Sharma",
    location: "Pune, Maharashtra",
    systemSize: "5.4 kW",
    systemType: "MONOPERC",
    status: "Active",
    statusTone: "#7C7A00",
    statusBg: "#F2F08E",
    stage: "Site Visit",
    progress: 45,
  },
  {
    initials: "PK",
    id: "priya-kulkarni",
    name: "Priya Kulkarni",
    location: "Mumbai, MH",
    systemSize: "8.2 kW",
    systemType: "BIFACIAL",
    status: "In Progress",
    statusTone: "#239654",
    statusBg: "#DDF8E7",
    stage: "Site Visit",
    progress: 75,
  },
  {
    initials: "RJ",
    id: "rahul-joshi",
    name: "Rahul Joshi",
    location: "Nagpur, Maharashtra",
    systemSize: "3.0 kW",
    systemType: "GRID-TIED",
    status: "Pending",
    statusTone: "#6F7D8F",
    statusBg: "#EDF1F5",
    stage: "Site Visit",
    progress: 15,
  },
];

const columns = [
  "Customer",
  "System Size",
  "Status",
  "Stage Progression",
  "Actions",
];

function KpiIcon({ tone, bg, icon }) {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "0.75rem",
        bgcolor: bg,
        color: tone,
        display: "grid",
        placeItems: "center",
        fontSize: "0.88rem",
        fontWeight: 800,
      }}
    >
      {icon}
    </Box>
  );
}

function ProjectRow({ project, mobile = false }) {
  const customerBlock = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar
        sx={{
          width: 30,
          height: 30,
          bgcolor: "#EEF2F8",
          color: "#5D6B80",
          fontSize: "0.68rem",
          fontWeight: 800,
        }}
      >
        {project.initials}
      </Avatar>
      <Box>
        <Typography
          sx={{
            color: "#223146",
            fontSize: "0.86rem",
            fontWeight: 700,
            lineHeight: 1.16,
          }}
        >
          {project.name}
        </Typography>
        <Typography
          sx={{
            mt: 0.14,
            color: "#7A8799",
            fontSize: "0.68rem",
            lineHeight: 1.35,
          }}
        >
          {project.location}
        </Typography>
      </Box>
    </Stack>
  );

  const sizeBlock = (
    <Box>
      <Typography sx={{ color: "#223146", fontSize: "0.84rem", fontWeight: 700 }}>
        {project.systemSize}
      </Typography>
      <Box
        sx={{
          mt: 0.45,
          display: "inline-flex",
          px: 0.62,
          py: 0.16,
          borderRadius: "999px",
          bgcolor: "#F1F4F8",
          color: "#6E7B8C",
          fontSize: "0.5rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {project.systemType}
      </Box>
    </Box>
  );

  const statusBlock = (
    <Box
      sx={{
        display: "inline-flex",
        px: 0.88,
        py: 0.34,
        borderRadius: "999px",
        bgcolor: project.statusBg,
        color: project.statusTone,
        fontSize: "0.62rem",
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      {project.status}
    </Box>
  );

  const progressBlock = (
    <Stack spacing={0.45} sx={{ minWidth: 0, width: "100%" }}>
      <Typography
        sx={{
          color: "#0E56C8",
          fontSize: "0.48rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {project.stage}
      </Typography>
      <Stack direction="row" spacing={0.8} alignItems="center">
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: "999px",
            bgcolor: "#E7ECF2",
            "& .MuiLinearProgress-bar": {
              borderRadius: "999px",
              bgcolor: "#0F6A38",
            },
          }}
        />
        <Typography sx={{ color: "#223146", fontSize: "0.72rem", fontWeight: 700 }}>
          {project.progress}%
        </Typography>
      </Stack>
    </Stack>
  );

  const actionBlock = (
    <Stack direction="row" spacing={0.7} alignItems="center">
      <Button
        component={RouterLink}
        to={`/vendor/projects/${project.id}`}
        sx={{
          minWidth: 28,
          width: 28,
          height: 28,
          p: 0,
          borderRadius: "50%",
          color: "#0E56C8",
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: "0.92rem" }} />
      </Button>
      <Button
        component={RouterLink}
        to={`/vendor/projects/${project.id}`}
        variant="outlined"
        sx={{
          minHeight: 29,
          px: 1.05,
          borderRadius: "0.8rem",
          borderColor: "rgba(225,232,241,0.96)",
          bgcolor: "#F7F9FC",
          color: "#223146",
          fontSize: "0.66rem",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Update
      </Button>
    </Stack>
  );

  if (mobile) {
    return (
      <Stack spacing={1.15}>
        {customerBlock}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              System Size
            </Typography>
            <Box sx={{ mt: 0.3 }}>{sizeBlock}</Box>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#98A3B2",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Status
            </Typography>
            <Box sx={{ mt: 0.32 }}>{statusBlock}</Box>
          </Box>
        </Box>
        {progressBlock}
        {actionBlock}
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1.28fr 0.9fr 0.86fr 1.24fr 0.72fr",
        gap: 1,
        alignItems: "center",
      }}
    >
      {customerBlock}
      {sizeBlock}
      {statusBlock}
      {progressBlock}
      {actionBlock}
    </Box>
  );
}

export default function VendorProjectsPage() {
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
            Projects
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Manage your ongoing solar installations
          </Typography>
        </Box>

        <Button
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
          Create New Project
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.6,
          mb: { xs: 2.35, md: 2.7 },
        }}
      >
        {kpiCards.map((card) => (
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
            <KpiIcon tone={card.tone} bg={card.bg} icon={card.icon} />
            <Typography
              sx={{
                mt: 1.1,
                color: "#6F7D8F",
                fontSize: "0.76rem",
                fontWeight: 500,
                lineHeight: 1.45,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.35,
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
          mb: { xs: 2.45, md: 2.75 },
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
                  px: 1.18,
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

          <Stack direction="row" spacing={0.7} alignItems="center" justifyContent="flex-end">
            <Button
              sx={{
                minWidth: 28,
                width: 28,
                height: 28,
                p: 0,
                borderRadius: "50%",
                color: "#7A8799",
              }}
            >
              <TuneRoundedIcon sx={{ fontSize: "0.88rem" }} />
            </Button>
            <Button
              sx={{
                minWidth: 28,
                width: 28,
                height: 28,
                p: 0,
                borderRadius: "50%",
                color: "#7A8799",
              }}
            >
              <SortRoundedIcon sx={{ fontSize: "0.92rem" }} />
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ display: { xs: "none", lg: "block" }, px: 1.7, pt: 1.45, pb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.28fr 0.9fr 0.86fr 1.24fr 0.72fr",
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
          {projects.map((project, index) => (
            <Box
              key={project.name}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.55 },
              }}
            >
              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <ProjectRow project={project} />
              </Box>
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <ProjectRow project={project} mobile />
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
            Showing 1-3 of 24 active projects
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
          p: { xs: 1.5, md: 1.8 },
          borderRadius: "1.45rem",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,247,255,0.95) 52%, rgba(243,249,252,0.95) 100%)",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" },
          gap: 1.8,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#0E56C8", fontSize: "1.08rem", fontWeight: 800 }}>
            Project Efficiency Insights
          </Typography>
          <Typography
            sx={{
              mt: 1,
              maxWidth: 420,
              color: "#5E6A7D",
              fontSize: "0.84rem",
              lineHeight: 1.72,
            }}
          >
            Your installation cycle has improved by{" "}
            <Box component="span" sx={{ color: "#239654", fontWeight: 800 }}>
              12%
            </Box>{" "}
            this month. Complete 4 more projects by Friday to reach your
            quarterly bonus tier.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
            minHeight: 96,
          }}
        >
          <Box sx={{ position: "relative", width: 118, height: 84 }}>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 78,
                height: 58,
                borderRadius: "0.95rem",
                background:
                  "linear-gradient(180deg, #E5F2FF 0%, #8FC3FF 48%, #1A5BB5 100%)",
                boxShadow: "0 10px 20px rgba(15,47,95,0.14)",
                border: "3px solid #FFFFFF",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 8,
                top: 2,
                width: 86,
                height: 62,
                borderRadius: "1rem",
                background:
                  "linear-gradient(180deg, #A8D7FF 0%, #5CA4E8 42%, #0E56C8 100%)",
                boxShadow: "0 14px 26px rgba(14,86,200,0.16)",
                border: "3px solid #FFFFFF",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  background:
                    "linear-gradient(140deg, transparent 0%, transparent 32%, rgba(255,255,255,0.78) 33%, transparent 35%, transparent 58%, rgba(255,255,255,0.56) 59%, transparent 61%)",
                  opacity: 0.65,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

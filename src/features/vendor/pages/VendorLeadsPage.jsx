import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Link as RouterLink } from "react-router-dom";

const filters = [
  { label: "Status", value: "All Statuses" },
  { label: "Location", value: "Maharashtra" },
  { label: "System", value: "Any Size" },
];

const leads = [
  {
    initials: "AK",
    name: "Amit Kulkarni",
    location: "Pune, Maharashtra",
    systemSize: "5.5 kW",
    budget: "\u20B93,20,000",
    status: "New",
    statusTone: "#4F89FF",
    statusBg: "#EEF4FF",
    timeReceived: "2 hours ago",
    primaryAction: "Submit Quote",
    detailAction: "View Details",
  },
  {
    initials: "SP",
    name: "Sunita Patil",
    location: "Mumbai, Maharashtra",
    systemSize: "3.0 kW",
    budget: "\u20B91,85,000",
    status: "In Review",
    statusTone: "#7D7B00",
    statusBg: "#F2F08E",
    timeReceived: "5 hours ago",
    primaryAction: "Submit Quote",
    detailAction: "View Details",
  },
  {
    initials: "RM",
    name: "Rahul Mehta",
    location: "Bangalore, Karnataka",
    systemSize: "10.0 kW",
    budget: "\u20B97,50,000",
    status: "Quoted",
    statusTone: "#239654",
    statusBg: "#E4F7EA",
    timeReceived: "Yesterday",
    primaryAction: "Update Quote",
    detailAction: "View Details",
  },
  {
    initials: "OD",
    name: "Oitesh Deshmukh",
    location: "Nashik, Maharashtra",
    systemSize: "4.2 kW",
    budget: "\u20B92,40,000",
    status: "Won",
    statusTone: "#7D8798",
    statusBg: "#EDF1F5",
    timeReceived: "2 days ago",
    primaryAction: "Won",
    detailAction: "View Project",
    actionDisabled: true,
  },
];

const columns = [
  "Customer Name",
  "Location",
  "System Size",
  "Budget",
  "Status",
  "Time Received",
  "Actions",
];

function FilterChip({ label, value }) {
  return (
    <Stack
      direction="row"
      spacing={0.6}
      alignItems="center"
      sx={{
        minHeight: 40,
        px: 1.3,
        borderRadius: "999px",
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(225,232,241,0.96)",
      }}
    >
      <Typography
        sx={{
          color: "#A1ACBA",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}:
      </Typography>
      <Typography sx={{ color: "#223146", fontSize: "0.74rem", fontWeight: 700 }}>
        {value}
      </Typography>
      <KeyboardArrowDownRoundedIcon sx={{ color: "#7D8797", fontSize: "1rem" }} />
    </Stack>
  );
}

export default function VendorLeadsPage() {
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
            Leads
          </Typography>
          <Typography
            sx={{
              mt: 0.45,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            Manage and track your potential solar installations.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.05} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{
              minHeight: 38,
              px: 1.65,
              borderRadius: "999px",
              borderColor: "rgba(208,216,226,0.95)",
              color: "#223146",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              minHeight: 38,
              px: 1.7,
              borderRadius: "999px",
              bgcolor: "#0E56C8",
              boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Manual Lead
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          p: { xs: 1.4, md: 1.7 },
          borderRadius: "1.35rem",
          bgcolor: "#F4F6FA",
          border: "1px solid rgba(229,234,241,0.95)",
          mb: { xs: 2.2, md: 2.5 },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          spacing={1.35}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} flexWrap="wrap">
            {filters.map((filter) => (
              <FilterChip key={filter.label} label={filter.label} value={filter.value} />
            ))}
          </Stack>

          <Stack direction="row" spacing={0.85} alignItems="center" justifyContent="flex-end">
            <TuneRoundedIcon sx={{ color: "#6E7B8C", fontSize: "0.95rem" }} />
            <Typography sx={{ color: "#6E7B8C", fontSize: "0.74rem", fontWeight: 600 }}>
              Sort by:
            </Typography>
            <Typography sx={{ color: "#0E56C8", fontSize: "0.74rem", fontWeight: 700 }}>
              Time Received (Newest)
            </Typography>
            <KeyboardArrowDownRoundedIcon sx={{ color: "#7D8797", fontSize: "1rem" }} />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          borderRadius: "1.7rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(225,232,241,0.96)",
          boxShadow: "0 16px 30px rgba(16,29,51,0.04)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: { xs: "none", lg: "block" }, px: 2.4, pt: 1.7, pb: 1.1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr 0.7fr 0.82fr 0.8fr 0.88fr 0.9fr",
              gap: 1,
            }}
          >
            {columns.map((column) => (
              <Typography
                key={column}
                sx={{
                  color: "#616E82",
                  fontSize: "0.6rem",
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

        <Stack spacing={0} sx={{ px: { xs: 1.2, md: 2.4 }, pb: 1.25 }}>
          {leads.map((lead, index) => (
            <Box
              key={lead.name}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(234,239,245,0.95)",
                py: { xs: 1.45, md: 1.6 },
              }}
            >
              <Box sx={{ display: { xs: "none", lg: "grid" }, gridTemplateColumns: "1.35fr 1fr 0.7fr 0.82fr 0.8fr 0.88fr 0.9fr", gap: 1, alignItems: "center" }}>
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
                    {lead.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: "#223146", fontSize: "0.92rem", fontWeight: 700, lineHeight: 1.18 }}>
                      {lead.name}
                    </Typography>
                  </Box>
                </Stack>

                <Typography sx={{ color: "#5E6A7D", fontSize: "0.78rem", lineHeight: 1.4 }}>
                  {lead.location}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 600 }}>
                  {lead.systemSize}
                </Typography>
                <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 600 }}>
                  {lead.budget}
                </Typography>
                <Box
                  sx={{
                    justifySelf: "start",
                    px: 1,
                    py: 0.38,
                    borderRadius: "999px",
                    bgcolor: lead.statusBg,
                    color: lead.statusTone,
                    fontSize: "0.64rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {lead.status}
                </Box>
                <Typography sx={{ color: "#5E6A7D", fontSize: "0.78rem", lineHeight: 1.35 }}>
                  {lead.timeReceived}
                </Typography>

                <Stack spacing={0.7} alignItems="flex-start">
                  <Typography sx={{ color: "#0E56C8", fontSize: "0.73rem", fontWeight: 700 }}>
                    <Box
                      component={RouterLink}
                      to={`/vendor/leads/${lead.initials.toLowerCase()}`}
                      sx={{ color: "inherit", textDecoration: "none" }}
                    >
                      {lead.detailAction}
                    </Box>
                  </Typography>
                  <Button
                    component={lead.actionDisabled ? "button" : RouterLink}
                    to={lead.actionDisabled ? undefined : `/vendor/leads/${lead.initials.toLowerCase()}`}
                    variant={lead.actionDisabled ? "outlined" : "contained"}
                    disabled={lead.actionDisabled}
                    sx={{
                      minHeight: 34,
                      px: 1.25,
                      borderRadius: "999px",
                      bgcolor: lead.actionDisabled ? "#F2F4F8" : "#0E56C8",
                      borderColor: "rgba(225,232,241,0.96)",
                      color: lead.actionDisabled ? "#A1ACBA" : "#FFFFFF",
                      boxShadow: lead.actionDisabled ? "none" : "0 10px 20px rgba(14,86,200,0.16)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    {lead.primaryAction}
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
                      {lead.initials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: "#223146", fontSize: "0.92rem", fontWeight: 700 }}>
                        {lead.name}
                      </Typography>
                      <Typography sx={{ color: "#5E6A7D", fontSize: "0.76rem", mt: 0.15 }}>
                        {lead.location}
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
                      ["System Size", lead.systemSize],
                      ["Budget", lead.budget],
                      ["Status", lead.status],
                      ["Time Received", lead.timeReceived],
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
                        <Typography sx={{ mt: 0.28, color: "#223146", fontSize: "0.76rem", fontWeight: 600 }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      component={RouterLink}
                      to={`/vendor/leads/${lead.initials.toLowerCase()}`}
                      variant="text"
                      sx={{
                        px: 0,
                        minHeight: 32,
                        color: "#0E56C8",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      {lead.detailAction}
                    </Button>
                    <Button
                      component={lead.actionDisabled ? "button" : RouterLink}
                      to={lead.actionDisabled ? undefined : `/vendor/leads/${lead.initials.toLowerCase()}`}
                      variant={lead.actionDisabled ? "outlined" : "contained"}
                      disabled={lead.actionDisabled}
                      sx={{
                        minHeight: 34,
                        px: 1.25,
                        borderRadius: "999px",
                        bgcolor: lead.actionDisabled ? "#F2F4F8" : "#0E56C8",
                        borderColor: "rgba(225,232,241,0.96)",
                        color: lead.actionDisabled ? "#A1ACBA" : "#FFFFFF",
                        boxShadow: lead.actionDisabled ? "none" : "0 10px 20px rgba(14,86,200,0.16)",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      {lead.primaryAction}
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
            px: { xs: 1.2, md: 2.4 },
            py: 1.4,
            borderTop: "1px solid rgba(234,239,245,0.95)",
          }}
        >
          <Typography sx={{ color: "#738094", fontSize: "0.74rem", fontWeight: 500 }}>
            Showing 1-4 of 128 leads
          </Typography>

          <Stack direction="row" spacing={0.55} alignItems="center">
            <Button
              minWidth={32}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                borderRadius: "50%",
                color: "#647387",
                p: 0,
              }}
            >
              <KeyboardArrowLeftRoundedIcon />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                sx={{
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  p: 0,
                  color: page === 1 ? "#FFFFFF" : "#223146",
                  bgcolor: page === 1 ? "#0E56C8" : "transparent",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              minWidth={32}
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                borderRadius: "50%",
                color: "#647387",
                p: 0,
              }}
            >
              <KeyboardArrowRightRoundedIcon />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

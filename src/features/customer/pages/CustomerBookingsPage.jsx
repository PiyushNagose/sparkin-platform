import { Box, Button, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import bookingHouseModern from "@/shared/assets/images/customer/bookings/booking-house-modern-placeholder.png";
import bookingHouseClassic from "@/shared/assets/images/customer/bookings/booking-house-classic-placeholder.png";
import bookingSolarFacility from "@/shared/assets/images/customer/bookings/booking-solar-facility-placeholder.png";
import bookingHouseUnderConstruction from "@/shared/assets/images/customer/bookings/booking-house-underconstruction-placeholder.png";

const kpiCards = [
  {
    label: "Total",
    value: "04",
    subtitle: "Active Requests",
    tone: "#8B8600",
    bg: "#F4F1C9",
    icon: <CalendarMonthOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Live",
    value: "02",
    subtitle: "Bidding Active",
    tone: "#4F89FF",
    bg: "#EEF4FF",
    icon: <TrackChangesRoundedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Saved",
    value: "\u20B91.4L",
    subtitle: "Est. Lifetime Savings",
    tone: "#239654",
    bg: "#E8FAEF",
    icon: <SavingsOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
  {
    label: "Power",
    value: "22kW",
    subtitle: "Total System Size",
    tone: "#8F98A7",
    bg: "#F2F5F8",
    icon: <BoltOutlinedIcon sx={{ fontSize: "0.95rem" }} />,
  },
];

const bookings = [
  {
    image: bookingHouseModern,
    title: "Gurgaon - Independent House",
    meta: "DLF Phase 5, Sector 54 • Submitted Oct 24, 2023",
    sizeLabel: "System Size",
    sizeValue: "5kW Mono-Perc",
    infoLabel: "Total Bids",
    infoValue: "12 Received",
    status: "Bidding Live",
    statusTone: "#6C7300",
    statusBg: "#E7F318",
    action: "View Bids",
    actionPrimary: true,
  },
  {
    image: bookingHouseClassic,
    title: "Noida - Residential Complex",
    meta: "Sector 128 • Submitted Oct 12, 2023",
    sizeLabel: "System Size",
    sizeValue: "10kW Poly-Si",
    infoLabel: "Current Status",
    infoValue: "Validating Documents",
    status: "Tender Generated",
    statusTone: "#4F89FF",
    statusBg: "#EEF4FF",
    action: "View Details",
  },
  {
    image: bookingSolarFacility,
    title: "Bangalore - Warehouse",
    meta: "Whitefield • Submitted Sep 30, 2023",
    sizeLabel: "System Size",
    sizeValue: "50kW Bifacial",
    infoLabel: "Installation",
    infoValue: "Verified Successful",
    status: "Closed / Completed",
    statusTone: "#239654",
    statusBg: "#E8FAEF",
    action: "Project Report",
  },
  {
    image: bookingHouseUnderConstruction,
    title: "Mumbai - Penthouse",
    meta: "Worli • Submitted Oct 28, 2023",
    sizeLabel: "System Size",
    sizeValue: "3kW Off-Grid",
    infoLabel: "Next Step",
    infoValue: "Survey Pending",
    status: "Created",
    statusTone: "#8F98A7",
    statusBg: "#F2F5F8",
    action: "View Details",
  },
];

function KpiCard({ card }) {
  return (
    <Box
      sx={{
        p: 1.45,
        minHeight: 104,
        borderRadius: "1.15rem",
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
            color: card.tone,
            display: "grid",
            placeItems: "center",
          }}
        >
          {card.icon}
        </Box>
        <Typography
          sx={{
            color: card.tone,
            fontSize: "0.56rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {card.label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 1.05,
          color: "#18253A",
          fontSize: "1.65rem",
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        {card.value}
      </Typography>
      <Typography sx={{ mt: 0.45, color: "#6F7D8F", fontSize: "0.74rem" }}>
        {card.subtitle}
      </Typography>
    </Box>
  );
}

export default function CustomerBookingsPage() {
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
            My Bookings
          </Typography>
          <Typography
            sx={{
              mt: 0.4,
              color: "#6F7D8F",
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            View all your solar requests and monitor their real-time progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            minHeight: 38,
            px: 1.65,
            alignSelf: { xs: "stretch", sm: "flex-start" },
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          New Booking
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 1.75,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 1.3,
        }}
      >
        {kpiCards.map((card) => (
          <KpiCard key={card.label} card={card} />
        ))}
      </Box>

      <Stack spacing={1.35} sx={{ mt: 1.8 }}>
        {bookings.map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 1.35,
              borderRadius: "1.2rem",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(225,232,241,0.96)",
              boxShadow: "0 14px 28px rgba(16,29,51,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.1}
                sx={{ minWidth: 0, flex: 1 }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={`${item.title} booking placeholder`}
                  sx={{
                    width: { xs: "100%", sm: 94 },
                    height: { xs: 152, sm: 62 },
                    borderRadius: "0.85rem",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "#223146",
                      fontSize: "1rem",
                      fontWeight: 800,
                      lineHeight: 1.25,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.4}
                    alignItems="center"
                    sx={{ mt: 0.25, color: "#7A8799" }}
                  >
                    <LocationOnOutlinedIcon sx={{ fontSize: "0.82rem" }} />
                    <Typography sx={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
                      {item.meta}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      mt: 1,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(120px, 1fr))",
                      },
                      gap: 0.85,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: "#98A3B2",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.sizeLabel}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.28,
                          color: "#223146",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.sizeValue}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          color: "#98A3B2",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.infoLabel}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.28,
                          color: "#223146",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.infoValue}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>

              <Stack
                spacing={1}
                alignItems={{ xs: "flex-start", md: "flex-end" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 0.85,
                    py: 0.34,
                    borderRadius: "999px",
                    bgcolor: item.statusBg,
                    color: item.statusTone,
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {item.status}
                </Box>

                <Button
                  variant={item.actionPrimary ? "contained" : "outlined"}
                  endIcon={
                    item.actionPrimary ? (
                      <ArrowForwardRoundedIcon sx={{ fontSize: "0.95rem" }} />
                    ) : null
                  }
                  sx={{
                    minHeight: 34,
                    px: 1.35,
                    alignSelf: { xs: "stretch", sm: "flex-start", md: "auto" },
                    borderRadius: "0.85rem",
                    bgcolor: item.actionPrimary ? "#0E56C8" : "#F5F7FB",
                    borderColor: "rgba(225,232,241,0.96)",
                    color: item.actionPrimary ? "#FFFFFF" : "#223146",
                    boxShadow: item.actionPrimary
                      ? "0 12px 24px rgba(14,86,200,0.14)"
                      : "none",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {item.action}
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack
        direction="row"
        spacing={0.45}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 1.85 }}
      >
        <Button
          sx={{
            minWidth: 30,
            width: 30,
            height: 30,
            borderRadius: "50%",
            color: "#647387",
            p: 0,
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
              borderRadius: "50%",
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
            borderRadius: "50%",
            color: "#647387",
            p: 0,
          }}
        >
          <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1rem" }} />
        </Button>
      </Stack>
    </Box>
  );
}

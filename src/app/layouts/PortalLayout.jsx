import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { NavLink, Outlet } from "react-router-dom";
import { portalNavigation } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import { AppFooter } from "@/shared/components/AppFooter";

const vendorNavIcons = {
  Dashboard: DashboardRoundedIcon,
  Leads: Groups2OutlinedIcon,
  Quotes: RequestQuoteOutlinedIcon,
  Projects: AssignmentOutlinedIcon,
  Payments: PaymentsOutlinedIcon,
  Settings: SettingsOutlinedIcon,
};

const customerNavIcons = {
  Dashboard: DashboardRoundedIcon,
  "My Bookings": CalendarMonthOutlinedIcon,
  "My Tenders": RequestQuoteOutlinedIcon,
  "My Projects": AssignmentOutlinedIcon,
  Services: BoltOutlinedIcon,
  Savings: SavingsOutlinedIcon,
  "Refer & Earn": RedeemOutlinedIcon,
  Profile: PersonOutlineOutlinedIcon,
};

export function PortalLayout({ portal }) {
  const navItems = portalNavigation[portal];
  const sidebarWidth = 158;
  const navIconMap = portal === "customer" ? customerNavIcons : vendorNavIcons;
  const portalLabel = portal === "customer" ? "" : "Vendor Portal";
  const profileName = portal === "customer" ? "Arjun Mehta" : "Rajesh Kumar";
  const profileRole = portal === "customer" ? "Residential User" : "Solar Lead Partner";
  const profileInitial = portal === "customer" ? "A" : "R";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F4F7F2",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Box
          component="aside"
          sx={{
            width: sidebarWidth,
            borderRight: "1px solid rgba(218,226,236,0.9)",
            bgcolor: "#FFFFFF",
            px: 1.45,
            py: 0.95,
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: 0,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1.35 }}>
            <Box
              component="img"
              src={logoPlaceholder}
              alt="Sparkin logo"
              sx={{
                width: 72,
                height: 72,
                objectFit: "contain",
                mx: "auto",
                display: "block",
              }}
            />
            {portalLabel ? (
              <Typography
                sx={{
                  mt: 0.05,
                  color: "#7D8797",
                  fontSize: "0.54rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {portalLabel}
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={0.6}>
            {navItems.map((item) => {
              const Icon = navIconMap[item.label] || DashboardRoundedIcon;

              return (
                <Button
                  key={item.label}
                  component={NavLink}
                  to={item.href}
                  end
                  variant="text"
                  color="inherit"
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.9,
                    minHeight: 36,
                    px: 1.05,
                    width: "100%",
                    borderRadius: "0.7rem",
                    color: "#647387",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&.active": {
                      bgcolor: "#F3F6FF",
                      color: "#0E56C8",
                      boxShadow: "inset 0 0 0 1px rgba(14,86,200,0.08)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: "0.92rem" }} />
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ mt: "auto", pt: 2 }}>
            {portal === "vendor" ? (
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                sx={{
                  width: "100%",
                  minHeight: 38,
                  borderRadius: "0.8rem",
                  textTransform: "none",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  bgcolor: "#0E56C8",
                  boxShadow: "none",
                }}
              >
                New Project
              </Button>
            ) : (
              <Stack spacing={0.65}>
                <Button
                  variant="text"
                  color="inherit"
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.9,
                    minHeight: 34,
                    px: 1.05,
                    borderRadius: "0.7rem",
                    color: "#647387",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  <SettingsOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  Settings
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.9,
                    minHeight: 34,
                    px: 1.05,
                    borderRadius: "0.7rem",
                    color: "#647387",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: "0.9rem" }} />
                  Logout
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="header"
            sx={{
              px: { xs: 1.8, md: 2.2 },
              py: 1.45,
              borderBottom: "1px solid rgba(220,228,238,0.92)",
              display: "flex",
              alignItems: "center",
              gap: 1.8,
              bgcolor: "rgba(255,255,255,0.84)",
              backdropFilter: "blur(14px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <TextField
              size="small"
              placeholder="Search leads, projects..."
              sx={{
                flex: 1,
                maxWidth: 610,
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  borderRadius: "999px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.82rem",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: "#92A0B4", fontSize: "1.05rem" }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={1.15}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <IconButton sx={{ color: "#6D7A8D" }}>
                <NotificationsNoneRoundedIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ color: "#6D7A8D" }}
              >
                <HelpOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                <Typography sx={{ fontSize: "0.77rem", fontWeight: 600 }}>
                  Support
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ pl: 0.4 }}
                component={NavLink}
                to={`/${portal}/profile`}
                color="inherit"
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: "0.82rem",
                    bgcolor: "#132C58",
                  }}
                >
                  {profileInitial}
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontSize: "0.79rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {profileName}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.1,
                      color: "#8490A1",
                      fontSize: "0.59rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {profileRole}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Container
            maxWidth={false}
            sx={{
              width: "100%",
              maxWidth: "none",
              py: { xs: 3.2, md: 3.8 },
              px: { xs: 2, md: 3.2, lg: 3.8 },
              ml: 0,
              mr: "auto",
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
}

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { portalNavigation } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import { AppFooter } from "@/shared/components/AppFooter";
import { useAuth } from "@/features/auth/AuthProvider";
import { leadsApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";

const vendorNavIcons = {
  Dashboard: DashboardRoundedIcon,
  Leads: Groups2OutlinedIcon,
  Quotes: RequestQuoteOutlinedIcon,
  Projects: AssignmentOutlinedIcon,
  Services: BoltOutlinedIcon,
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

const vendorSearchRoutes = [
  { terms: ["lead", "leads", "customer", "booking", "quote request"], path: "/vendor/leads" },
  { terms: ["quote", "quotes", "proposal", "bid"], path: "/vendor/quotes" },
  { terms: ["project", "projects", "install", "installation", "milestone"], path: "/vendor/projects" },
  { terms: ["service", "services", "ticket", "support", "repair"], path: "/vendor/services" },
  { terms: ["payment", "payments", "transaction", "invoice", "payout"], path: "/vendor/payments" },
  { terms: ["setting", "settings", "notification", "logout"], path: "/vendor/settings" },
  { terms: ["profile", "business", "company", "document"], path: "/vendor/profile" },
];

function resolvePortalSearchPath(portal, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return `/${portal}`;
  }

  if (portal === "vendor") {
    return vendorSearchRoutes.find((route) => route.terms.some((term) => normalizedQuery.includes(term)))?.path || "/vendor/leads";
  }

  if (normalizedQuery.includes("project")) return "/customer/projects";
  if (normalizedQuery.includes("service") || normalizedQuery.includes("support")) return "/customer/services";
  if (normalizedQuery.includes("saving")) return "/customer/savings";
  if (normalizedQuery.includes("tender") || normalizedQuery.includes("quote")) return "/customer/tenders";
  if (normalizedQuery.includes("booking")) return "/customer/bookings";

  return "/customer";
}

export function PortalLayout({ portal }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [vendorSummary, setVendorSummary] = useState({
    openLeads: 0,
    activeProjects: 0,
    pendingPayments: 0,
  });
  const navItems = portalNavigation[portal];
  const sidebarWidth = 158;
  const navIconMap = portal === "customer" ? customerNavIcons : vendorNavIcons;
  const portalLabel = portal === "customer" ? "" : "Vendor Portal";
  const profileName = user?.fullName || "Sparkin User";
  const profileRole =
    user?.role === "vendor" ? "Solar Lead Partner" : user?.role === "admin" ? "Administrator" : "Residential User";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "S";
  const notificationCount = portal === "vendor"
    ? vendorSummary.openLeads + vendorSummary.activeProjects + vendorSummary.pendingPayments
    : 0;
  const notificationItems = useMemo(
    () => [
      {
        label: `${vendorSummary.openLeads} open leads need review`,
        caption: "Review new customer opportunities",
        path: "/vendor/leads",
      },
      {
        label: `${vendorSummary.activeProjects} active projects`,
        caption: "Track installation milestones",
        path: "/vendor/projects",
      },
      {
        label: `${vendorSummary.pendingPayments} pending payments`,
        caption: "Check payment schedules and invoices",
        path: "/vendor/payments",
      },
    ],
    [vendorSummary],
  );

  useEffect(() => {
    if (portal !== "vendor") return undefined;

    let active = true;

    async function loadVendorSummary() {
      const [leadsResult, projectsResult, paymentsResult] = await Promise.allSettled([
        leadsApi.listLeads(),
        projectsApi.listProjects(),
        paymentsApi.listPayments(),
      ]);

      if (!active) return;

      const leads = leadsResult.status === "fulfilled" ? leadsResult.value : [];
      const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
      const payments = paymentsResult.status === "fulfilled" ? paymentsResult.value : [];

      setVendorSummary({
        openLeads: leads.filter((lead) => !["accepted", "closed", "cancelled"].includes(lead.status)).length,
        activeProjects: projects.filter((project) => !["completed", "cancelled"].includes(project.status)).length,
        pendingPayments: payments.filter((payment) => payment.status === "pending").length,
      });
    }

    loadVendorSummary();

    return () => {
      active = false;
    };
  }, [portal]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    const path = resolvePortalSearchPath(portal, query);

    navigate(path, { state: query ? { portalSearch: query } : undefined });
  }

  function openNotifications(event) {
    setNotificationAnchor(event.currentTarget);
  }

  function closeNotifications() {
    setNotificationAnchor(null);
  }

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
              <Stack spacing={0.65}>
                <Button
                  component={NavLink}
                  to="/vendor/projects"
                  state={{ openCreateProject: true }}
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
                  Create Project
                </Button>
              </Stack>
            ) : (
              <Box />
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
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: 610 }}>
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={portal === "vendor" ? "Search leads, projects..." : "Search bookings, projects..."}
                sx={{
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
            </Box>

            <Stack
              direction="row"
              spacing={1.15}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <IconButton
                onClick={openNotifications}
                aria-label="Open notifications"
                sx={{ color: "#6D7A8D" }}
              >
                <Badge
                  badgeContent={notificationCount}
                  color="error"
                  max={99}
                  invisible={notificationCount === 0}
                >
                  <NotificationsNoneRoundedIcon sx={{ fontSize: "1.05rem" }} />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={closeNotifications}
                PaperProps={{
                  sx: {
                    mt: 1,
                    width: 300,
                    borderRadius: "1rem",
                    border: "1px solid rgba(225,232,241,0.96)",
                    boxShadow: "0 18px 38px rgba(16,29,51,0.14)",
                  },
                }}
              >
                <Box sx={{ px: 1.5, py: 1.1 }}>
                  <Typography sx={{ color: "#18253A", fontSize: "0.86rem", fontWeight: 800 }}>
                    Notifications
                  </Typography>
                  <Typography sx={{ mt: 0.2, color: "#7A8799", fontSize: "0.7rem" }}>
                    Live vendor activity summary
                  </Typography>
                </Box>
                {portal === "vendor" ? (
                  notificationItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      onClick={closeNotifications}
                      sx={{ alignItems: "flex-start", py: 1.05, whiteSpace: "normal" }}
                    >
                      <Box>
                        <Typography sx={{ color: "#223146", fontSize: "0.78rem", fontWeight: 800 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ mt: 0.15, color: "#7A8799", fontSize: "0.68rem" }}>
                          {item.caption}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem onClick={closeNotifications}>
                    <Typography sx={{ color: "#7A8799", fontSize: "0.76rem" }}>
                      No notifications right now.
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
              <Stack
                component={NavLink}
                to={portal === "vendor" ? "/vendor/services" : "/customer/services"}
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ color: "#6D7A8D" }}
                style={{ textDecoration: "none" }}
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
              py: { xs: 3.8, md: 4.6 },
              px: { xs: 2.2, md: 3.6, lg: 4.2 },
              ml: 0,
              mr: "auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                "& > .MuiBox-root, & > .MuiStack-root": {
                  "& > .MuiStack-root:first-of-type": {
                    mb: { xs: 2.8, md: 3.4 },
                  },
                  "& > .MuiBox-root + .MuiBox-root, & > .MuiBox-root + .MuiStack-root, & > .MuiStack-root + .MuiBox-root, & > .MuiStack-root + .MuiStack-root":
                    {
                      mt: { xs: 2.3, md: 3 },
                    },
                  "& > .MuiTypography-root + .MuiTypography-root": {
                    mt: 0.75,
                  },
                  "& .MuiTypography-body1, & .MuiTypography-body2": {
                    lineHeight: 1.72,
                  },
                },
              }}
            >
              <Outlet />
            </Box>
          </Container>
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
}

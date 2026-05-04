import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useEffect, useMemo, useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { portalNavigation } from "@/shared/config/navigation";
import logoPlaceholder from "@/shared/assets/logo-placeholder.png";
import { AppFooter } from "@/shared/components/AppFooter";
import { useAuth } from "@/features/auth/AuthProvider";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

// ─── constants ────────────────────────────────────────────────────────────────

const IDENTITY_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api/v1"
).replace(/\/api\/v1\/?$/, "");

const VENDOR_NAV_ICONS = {
  Dashboard: DashboardRoundedIcon,
  Leads: Groups2OutlinedIcon,
  Quotes: RequestQuoteOutlinedIcon,
  Projects: AssignmentOutlinedIcon,
  Services: BoltOutlinedIcon,
  Payments: PaymentsOutlinedIcon,
  Settings: SettingsOutlinedIcon,
};

const CUSTOMER_NAV_ICONS = {
  Dashboard: DashboardRoundedIcon,
  "My Bookings": CalendarMonthOutlinedIcon,
  "My Tenders": RequestQuoteOutlinedIcon,
  "My Projects": AssignmentOutlinedIcon,
  Services: BoltOutlinedIcon,
  Savings: SavingsOutlinedIcon,
  "Refer & Earn": RedeemOutlinedIcon,
  Profile: PersonOutlineOutlinedIcon,
};

const ADMIN_NAV_ICONS = {
  Dashboard: DashboardRoundedIcon,
  Leads: Groups2OutlinedIcon,
  Payments: PaymentsOutlinedIcon,
  "Vendor Assignment": AdminPanelSettingsOutlinedIcon,
  Vendors: StorefrontOutlinedIcon,
  Bidding: GavelOutlinedIcon,
  "Customers/Projects": AssignmentOutlinedIcon,
  Reports: BarChartOutlinedIcon,
  Settings: SettingsOutlinedIcon,
  Notifications: NotificationsNoneRoundedIcon,
};

const VENDOR_SEARCH_ROUTES = [
  {
    terms: ["lead", "leads", "customer", "booking", "quote request"],
    path: "/vendor/leads",
  },
  { terms: ["quote", "quotes", "proposal", "bid"], path: "/vendor/quotes" },
  {
    terms: ["project", "projects", "install", "installation", "milestone"],
    path: "/vendor/projects",
  },
  {
    terms: ["service", "services", "ticket", "support", "repair"],
    path: "/vendor/services",
  },
  {
    terms: ["payment", "payments", "transaction", "invoice", "payout"],
    path: "/vendor/payments",
  },
  { terms: ["setting", "settings", "notification"], path: "/vendor/settings" },
  {
    terms: ["profile", "business", "company", "document"],
    path: "/vendor/profile",
  },
];

const CUSTOMER_SEARCH_ROUTES = [
  {
    terms: ["project", "projects", "install", "installation", "milestone"],
    path: "/customer/projects",
  },
  {
    terms: [
      "service",
      "services",
      "ticket",
      "support",
      "repair",
      "maintenance",
    ],
    path: "/customer/services",
  },
  {
    terms: ["saving", "savings", "co2", "carbon", "energy"],
    path: "/customer/savings",
  },
  {
    terms: ["tender", "tenders", "quote", "quotes", "bid", "bidding"],
    path: "/customer/tenders",
  },
  { terms: ["booking", "bookings", "request"], path: "/customer/bookings" },
  {
    terms: ["referral", "referrals", "refer", "earn", "reward"],
    path: "/customer/referrals",
  },
  {
    terms: ["profile", "account", "password", "photo"],
    path: "/customer/profile",
  },
];

const ADMIN_SEARCH_ROUTES = [
  { terms: ["lead", "leads", "customer", "verification"], path: "/admin/leads" },
  { terms: ["payment", "payments", "invoice", "transaction"], path: "/admin/payments" },
  { terms: ["vendor", "vendors", "partner"], path: "/admin/vendors" },
  { terms: ["assign", "assignment"], path: "/admin/vendor-assignment" },
  { terms: ["bid", "bidding", "quote", "quotes"], path: "/admin/bidding" },
  { terms: ["project", "projects", "customer"], path: "/admin/customers-projects" },
  { terms: ["report", "reports", "metric"], path: "/admin/reports" },
  { terms: ["setting", "settings"], path: "/admin/settings" },
  { terms: ["notification", "alert", "log"], path: "/admin/notifications" },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolveSearchPath(portal, query) {
  const q = query.trim().toLowerCase();
  if (!q) return `/${portal}`;

  const routes =
    portal === "admin"
      ? ADMIN_SEARCH_ROUTES
      : portal === "vendor"
        ? VENDOR_SEARCH_ROUTES
        : CUSTOMER_SEARCH_ROUTES;
  return (
    routes.find((r) => r.terms.some((t) => q.includes(t)))?.path || `/${portal}`
  );
}

function getAvatarSrc(user) {
  if (!user?.avatarUrl) return null;
  if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
  return `${IDENTITY_ORIGIN}${user.avatarUrl}`;
}

// ─── component ────────────────────────────────────────────────────────────────

export function PortalLayout({ portal }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Vendor summary for notification badge
  const [vendorSummary, setVendorSummary] = useState({
    openLeads: 0,
    activeProjects: 0,
    pendingPayments: 0,
  });

  // Customer summary for notification badge
  const [customerSummary, setCustomerSummary] = useState({
    pendingQuotes: 0,
    activeServiceRequests: 0,
    activeProjects: 0,
  });

  const [adminSummary, setAdminSummary] = useState({
    leadsNeedReview: 0,
    pendingPayments: 0,
    activeProjects: 0,
  });

  const navItems = portalNavigation[portal];
  const navIconMap =
    portal === "admin"
      ? ADMIN_NAV_ICONS
      : portal === "customer"
        ? CUSTOMER_NAV_ICONS
        : VENDOR_NAV_ICONS;
  const sidebarWidth = portal === "admin" ? 210 : 158;

  const profileName = user?.fullName || "Sparkin User";
  const profileRole =
    user?.role === "vendor"
      ? "Solar Lead Partner"
      : user?.role === "admin"
        ? "Administrator"
        : "Residential User";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "S";
  const avatarSrc = getAvatarSrc(user);

  // ── notification data ──────────────────────────────────────────────────────

  useEffect(() => {
    if (portal !== "vendor") return undefined;
    let active = true;

    async function loadVendorSummary() {
      const [leadsRes, projectsRes, paymentsRes] = await Promise.allSettled([
        leadsApi.listLeads(),
        projectsApi.listProjects(),
        paymentsApi.listPayments(),
      ]);
      if (!active) return;

      const leads = leadsRes.status === "fulfilled" ? leadsRes.value : [];
      const projects =
        projectsRes.status === "fulfilled" ? projectsRes.value : [];
      const payments =
        paymentsRes.status === "fulfilled" ? paymentsRes.value : [];

      setVendorSummary({
        openLeads: leads.filter(
          (l) => !["accepted", "closed", "cancelled"].includes(l.status),
        ).length,
        activeProjects: projects.filter(
          (p) => !["completed", "cancelled"].includes(p.status),
        ).length,
        pendingPayments: payments.filter((p) => p.status === "pending").length,
      });
    }

    loadVendorSummary();
    return () => {
      active = false;
    };
  }, [portal]);

  useEffect(() => {
    if (portal !== "customer") return undefined;
    let active = true;

    async function loadCustomerSummary() {
      const [quotesRes, serviceRes, projectsRes] = await Promise.allSettled([
        quotesApi.listQuotes(),
        serviceRequestsApi.listRequests(),
        projectsApi.listProjects(),
      ]);
      if (!active) return;

      const quotes = quotesRes.status === "fulfilled" ? quotesRes.value : [];
      const services =
        serviceRes.status === "fulfilled" ? serviceRes.value : [];
      const projects =
        projectsRes.status === "fulfilled" ? projectsRes.value : [];

      setCustomerSummary({
        pendingQuotes: quotes.filter((q) => q.status === "submitted").length,
        activeServiceRequests: services.filter(
          (s) => s.status !== "resolved" && s.status !== "cancelled",
        ).length,
        activeProjects: projects.filter(
          (p) => p.status !== "completed" && p.status !== "cancelled",
        ).length,
      });
    }

    loadCustomerSummary();
    return () => {
      active = false;
    };
  }, [portal]);

  useEffect(() => {
    if (portal !== "admin") return undefined;
    let active = true;

    async function loadAdminSummary() {
      const [leadsRes, projectsRes, paymentsRes] = await Promise.allSettled([
        leadsApi.listLeads(),
        projectsApi.listProjects(),
        paymentsApi.listPayments(),
      ]);
      if (!active) return;

      const leads = leadsRes.status === "fulfilled" ? leadsRes.value : [];
      const projects =
        projectsRes.status === "fulfilled" ? projectsRes.value : [];
      const payments =
        paymentsRes.status === "fulfilled" ? paymentsRes.value : [];

      setAdminSummary({
        leadsNeedReview: leads.filter((lead) =>
          ["submitted", "reviewing"].includes(lead.status),
        ).length,
        pendingPayments: payments.filter((payment) => payment.status === "pending").length,
        activeProjects: projects.filter(
          (project) => !["completed", "cancelled"].includes(project.status),
        ).length,
      });
    }

    loadAdminSummary();
    return () => {
      active = false;
    };
  }, [portal]);

  // ── notification config ────────────────────────────────────────────────────

  const notificationCount =
    portal === "admin"
      ? adminSummary.leadsNeedReview +
        adminSummary.pendingPayments +
        adminSummary.activeProjects
      : portal === "vendor"
        ? vendorSummary.openLeads +
          vendorSummary.activeProjects +
          vendorSummary.pendingPayments
        : customerSummary.pendingQuotes +
          customerSummary.activeServiceRequests +
          customerSummary.activeProjects;

  const notificationItems = useMemo(() => {
    if (portal === "admin") {
      return [
        {
          label: `${adminSummary.leadsNeedReview} lead${adminSummary.leadsNeedReview === 1 ? "" : "s"} need verification`,
          caption: "Review submitted and manually created leads",
          path: "/admin/leads",
        },
        {
          label: `${adminSummary.pendingPayments} pending payment${adminSummary.pendingPayments === 1 ? "" : "s"}`,
          caption: "Track invoice and payment recovery queue",
          path: "/admin/payments",
        },
        {
          label: `${adminSummary.activeProjects} active project${adminSummary.activeProjects === 1 ? "" : "s"}`,
          caption: "Monitor customer and vendor project progress",
          path: "/admin/customers-projects",
        },
      ];
    }

    if (portal === "vendor") {
      return [
        {
          label: `${vendorSummary.openLeads} open lead${vendorSummary.openLeads === 1 ? "" : "s"} need review`,
          caption: "Review new customer opportunities",
          path: "/vendor/leads",
        },
        {
          label: `${vendorSummary.activeProjects} active project${vendorSummary.activeProjects === 1 ? "" : "s"}`,
          caption: "Track installation milestones",
          path: "/vendor/projects",
        },
        {
          label: `${vendorSummary.pendingPayments} pending payment${vendorSummary.pendingPayments === 1 ? "" : "s"}`,
          caption: "Check payment schedules and invoices",
          path: "/vendor/payments",
        },
      ];
    }

    return [
      {
        label: `${customerSummary.pendingQuotes} new quote${customerSummary.pendingQuotes === 1 ? "" : "s"} received`,
        caption: "Compare vendor proposals on your tenders",
        path: "/customer/tenders",
      },
      {
        label: `${customerSummary.activeProjects} active project${customerSummary.activeProjects === 1 ? "" : "s"}`,
        caption: "Track your solar installation progress",
        path: "/customer/projects",
      },
      {
        label: `${customerSummary.activeServiceRequests} open service request${customerSummary.activeServiceRequests === 1 ? "" : "s"}`,
        caption: "Check status of your support tickets",
        path: "/customer/services",
      },
    ];
  }, [portal, vendorSummary, customerSummary, adminSummary]);

  // ── handlers ──────────────────────────────────────────────────────────────

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(resolveSearchPath(portal, query), {
      state: query ? { portalSearch: query } : undefined,
    });
  }

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  // ── sidebar content — defined outside render to avoid remount ─────────────

  const SidebarContent = useCallback(
    function SidebarContent({ onNavClick }) {
      return (
        <>
          <Box sx={{ textAlign: "center", mb: 1.35 }}>
            <Box
              component="img"
              src={logoPlaceholder}
              alt="Sparkin"
              sx={{
                width: 72,
                height: 72,
                objectFit: "contain",
                mx: "auto",
                display: "block",
              }}
            />
            {portal === "admin" ? (
              <Box sx={{ mt: -0.45 }}>
                <Typography
                  sx={{
                    color: "#0E56C8",
                    fontSize: "1rem",
                    fontWeight: 850,
                    lineHeight: 1,
                  }}
                >
                  Sparkin Admin
                </Typography>
                <Typography
                  sx={{
                    mt: 0.25,
                    color: "#7D8797",
                    fontSize: "0.54rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Operational Control
                </Typography>
              </Box>
            ) : portal === "vendor" ? (
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
                Vendor Portal
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
                  end={item.href === `/${portal}`}
                  variant="text"
                  color="inherit"
                  onClick={onNavClick}
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.9,
                    minHeight: 40,
                    px: 1.05,
                    width: "100%",
                    borderRadius: "0.7rem",
                    color: "#647387",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": { bgcolor: "#F4F7FF", color: "#0E56C8" },
                    "&.active": {
                      bgcolor: "#EEF4FF",
                      color: "#0E56C8",
                      boxShadow: "inset 0 0 0 1px rgba(14,86,200,0.12)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: "1rem" }} />
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ mt: "auto", pt: 2 }}>
            {portal === "admin" ? null : portal === "vendor" ? (
              <Button
                component={NavLink}
                to="/vendor/projects"
                state={{ openCreateProject: true }}
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onNavClick}
                sx={{
                  width: "100%",
                  minHeight: 40,
                  borderRadius: "0.8rem",
                  textTransform: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  bgcolor: "#0E56C8",
                  boxShadow: "0 6px 16px rgba(14,86,200,0.2)",
                  transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    bgcolor: "#0B49AD",
                    boxShadow: "0 10px 22px rgba(14,86,200,0.28)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Create Project
              </Button>
            ) : (
              <Button
                component={NavLink}
                to="/booking"
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onNavClick}
                sx={{
                  width: "100%",
                  minHeight: 40,
                  borderRadius: "0.8rem",
                  textTransform: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  bgcolor: "#0E56C8",
                  boxShadow: "0 6px 16px rgba(14,86,200,0.2)",
                  transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    bgcolor: "#0B49AD",
                    boxShadow: "0 10px 22px rgba(14,86,200,0.28)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                New Booking
              </Button>
            )}
          </Box>
        </>
      );
    },
    [navItems, navIconMap, portal],
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F0F3F8",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileNavOpen}
        onClose={closeMobileNav}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: 220,
            bgcolor: "#FFFFFF",
            px: 1.45,
            py: 1.2,
            display: "flex",
            flexDirection: "column",
            borderRight: "none",
            boxShadow: "4px 0 24px rgba(16,29,51,0.12)",
          },
        }}
        SlideProps={{ timeout: 280 }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          <IconButton
            onClick={closeMobileNav}
            size="small"
            sx={{ color: "#647387" }}
          >
            <CloseRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Box>
        <SidebarContent onNavClick={closeMobileNav} />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 1.5,
          p: { xs: 0, lg: 1.5 },
          pb: 0,
          alignItems: "stretch",
        }}
      >
        {/* Desktop sidebar */}
        <Box
          component="aside"
          sx={{
            width: sidebarWidth,
            borderRadius: "1.35rem",
            border: "1px solid rgba(218,226,236,0.9)",
            bgcolor: "#FFFFFF",
            px: 1.45,
            py: 0.95,
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: 0,
            position: "sticky",
            top: 12,
            height: "calc(100vh - 24px)",
            overflowY: "auto",
          }}
        >
          <SidebarContent onNavClick={undefined} />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Topbar */}
          <Box
            component="header"
            sx={{
              px: { xs: 1.4, md: 2.2 },
              py: 1.45,
              borderBottom: "1px solid rgba(220,228,238,0.92)",
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 1.8 },
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(14px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
              borderRadius: { lg: "1.35rem 1.35rem 0 0" },
              borderTop: { lg: "1px solid rgba(220,228,238,0.92)" },
              borderLeft: { lg: "1px solid rgba(220,228,238,0.92)" },
              borderRight: { lg: "1px solid rgba(220,228,238,0.92)" },
            }}
          >
            {/* Hamburger — mobile only */}
            <IconButton
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              sx={{
                display: { xs: "flex", lg: "none" },
                color: "#647387",
                mr: 0.5,
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>

            {/* Search */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ flex: 1, maxWidth: 610 }}
            >
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  portal === "admin"
                    ? "Search systems or leads..."
                    : portal === "vendor"
                      ? "Search leads, projects, payments..."
                      : "Search bookings, projects, savings..."
                }
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

            {/* Right actions */}
            <Stack
              direction="row"
              spacing={1.15}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              {/* Notifications */}
              <IconButton
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
                aria-label="Notifications"
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
                onClose={() => setNotificationAnchor(null)}
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
                  <Typography
                    sx={{
                      color: "#18253A",
                      fontSize: "0.86rem",
                      fontWeight: 800,
                    }}
                  >
                    Notifications
                  </Typography>
                  <Typography
                    sx={{ mt: 0.2, color: "#7A8799", fontSize: "0.7rem" }}
                  >
                    {portal === "admin"
                      ? "Operational activity summary"
                      : portal === "vendor"
                        ? "Live vendor activity summary"
                        : "Your account activity"}
                  </Typography>
                </Box>

                {notificationItems.every((item) => {
                  const count = parseInt(item.label.split(" ")[0], 10);
                  return count === 0;
                }) ? (
                  <MenuItem onClick={() => setNotificationAnchor(null)}>
                    <Typography sx={{ color: "#7A8799", fontSize: "0.76rem" }}>
                      No new notifications.
                    </Typography>
                  </MenuItem>
                ) : (
                  notificationItems
                    .filter(
                      (item) => parseInt(item.label.split(" ")[0], 10) > 0,
                    )
                    .map((item) => (
                      <MenuItem
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        onClick={() => setNotificationAnchor(null)}
                        sx={{
                          alignItems: "flex-start",
                          py: 1.05,
                          whiteSpace: "normal",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#223146",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.15,
                              color: "#7A8799",
                              fontSize: "0.68rem",
                            }}
                          >
                            {item.caption}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                )}
              </Menu>

              {/* Support */}
              <Stack
                component={NavLink}
                to={
                  portal === "admin"
                    ? "/admin/notifications"
                    : portal === "vendor"
                      ? "/vendor/services"
                      : "/service-support"
                }
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ color: "#6D7A8D", textDecoration: "none" }}
              >
                <HelpOutlineRoundedIcon sx={{ fontSize: "0.95rem" }} />
                <Typography
                  sx={{
                    fontSize: "0.77rem",
                    fontWeight: 600,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Support
                </Typography>
              </Stack>

              {/* Profile */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ pl: 0.4, textDecoration: "none" }}
                component={NavLink}
                to={portal === "admin" ? "/admin/settings" : `/${portal}/profile`}
                color="inherit"
              >
                <Avatar
                  src={avatarSrc || undefined}
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: "0.82rem",
                    bgcolor: "#132C58",
                  }}
                >
                  {!avatarSrc ? profileInitial : undefined}
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

          {/* Page content */}
          <Box
            sx={{
              width: "100%",
              py: { xs: 3.8, md: 4.6 },
              px: { xs: 2.2, md: 3.6, lg: 4.2 },
              flex: 1,
              bgcolor: portal === "admin" ? "#F5F8F6" : "#FFFFFF",
              borderLeft: { lg: "1px solid rgba(220,228,238,0.92)" },
              borderRight: { lg: "1px solid rgba(220,228,238,0.92)" },
              borderBottom: { lg: "1px solid rgba(220,228,238,0.92)" },
              borderRadius: { lg: "0 0 1.35rem 1.35rem" },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <AppFooter />
    </Box>
  );
}

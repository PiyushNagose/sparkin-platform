import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  AdminPrimaryButton,
  adminUi,
} from "@/features/admin/components/AdminPortalUI";
import { getAdminDashboardData } from "@/features/admin/api/adminApi";
import {
  buildAdminNotifications,
  decorateAdminNotifications,
  formatAdminNotificationTime,
  markAdminNotificationsRead,
  readAdminNotificationIds,
} from "@/features/admin/lib/adminNotifications";

const FILTERS = ["All", "Unread", "High", "Payments", "Leads", "Partners"];

const SEVERITY_META = {
  high: {
    label: "High",
    color: "#D94444",
    bg: "#FDECEC",
    icon: ErrorOutlineRoundedIcon,
  },
  medium: {
    label: "Medium",
    color: "#8A9700",
    bg: "#FAFAEF",
    icon: CampaignOutlinedIcon,
  },
  low: {
    label: "Info",
    color: "#0E56C8",
    bg: "#EEF4FF",
    icon: NotificationsNoneRoundedIcon,
  },
};

function matchesFilter(notification, filter) {
  if (filter === "Unread") return !notification.isRead;
  if (filter === "High") return notification.severity === "high";
  if (filter === "Payments") return notification.type === "Payment";
  if (filter === "Leads") return notification.type === "Lead";
  if (filter === "Partners") return notification.type === "Partner Application";
  return true;
}

function NotificationRow({ notification, onMarkRead }) {
  const meta = SEVERITY_META[notification.severity] || SEVERITY_META.low;
  const Icon = meta.icon;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "52px minmax(0, 1fr) auto" },
        gap: { xs: 1.4, md: 1.8 },
        alignItems: "center",
        px: { xs: 1.6, md: 2.2 },
        py: { xs: 1.7, md: 2 },
        borderBottom: "1px solid rgba(225,232,241,0.86)",
        bgcolor: notification.isRead ? "#FFFFFF" : "#F8FBFF",
        transition: "background-color 0.18s ease",
        "&:hover": { bgcolor: "#F4F8FF" },
      }}
    >
      <Avatar
        sx={{
          width: 44,
          height: 44,
          borderRadius: "0.95rem",
          bgcolor: meta.bg,
          color: meta.color,
          display: { xs: "none", md: "flex" },
        }}
      >
        <Icon sx={{ fontSize: "1.15rem" }} />
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {!notification.isRead ? (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#0E56C8",
              }}
            />
          ) : null}
          <Typography
            sx={{
              color: adminUi.colors.text,
              fontSize: "0.95rem",
              fontWeight: 900,
              lineHeight: 1.25,
            }}
          >
            {notification.title}
          </Typography>
          <Chip
            size="small"
            label={notification.type}
            sx={{
              height: 22,
              borderRadius: "999px",
              bgcolor: "#F1F5F9",
              color: "#5B687A",
              fontSize: "0.65rem",
              fontWeight: 850,
            }}
          />
          <Chip
            size="small"
            label={meta.label}
            sx={{
              height: 22,
              borderRadius: "999px",
              bgcolor: meta.bg,
              color: meta.color,
              fontSize: "0.65rem",
              fontWeight: 900,
            }}
          />
        </Stack>

        <Typography
          sx={{
            mt: 0.55,
            color: "#667386",
            fontSize: "0.82rem",
            lineHeight: 1.55,
          }}
        >
          {notification.message}
        </Typography>
        <Typography
          sx={{
            mt: 0.65,
            color: "#8B97A8",
            fontSize: "0.7rem",
            fontWeight: 750,
          }}
        >
          {formatAdminNotificationTime(notification.createdAt)}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "row", md: "column" }}
        spacing={0.9}
        alignItems={{ xs: "stretch", md: "flex-end" }}
        justifyContent="center"
      >
        <Button
          component={NavLink}
          to={notification.path}
          onClick={() => onMarkRead(notification.id)}
          sx={{
            minHeight: 34,
            px: 1.4,
            borderRadius: "0.75rem",
            bgcolor: "#0E56C8",
            color: "#FFFFFF",
            fontSize: "0.72rem",
            fontWeight: 850,
            textTransform: "none",
            "&:hover": { bgcolor: "#0B49AD" },
          }}
        >
          {notification.actionLabel}
        </Button>
        {!notification.isRead ? (
          <Button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            sx={{
              minHeight: 32,
              px: 1.1,
              borderRadius: "0.7rem",
              color: "#647387",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": { bgcolor: "#EEF4FF", color: "#0E56C8" },
            }}
          >
            Mark read
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function AdminNotificationsPage() {
  const [state, setState] = useState({
    loading: true,
    refreshing: false,
    error: "",
    data: null,
  });
  const [activeFilter, setActiveFilter] = useState("All");
  const [readIds, setReadIds] = useState(() => readAdminNotificationIds());

  async function loadNotifications(force = false) {
    setState((current) => ({
      ...current,
      loading: current.data ? false : true,
      refreshing: Boolean(current.data),
      error: "",
    }));

    try {
      const data = await getAdminDashboardData({ force });
      setState({ loading: false, refreshing: false, error: "", data });
    } catch (error) {
      setState((current) => ({
        loading: false,
        refreshing: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unable to load notifications",
        data: current.data,
      }));
    }
  }

  useEffect(() => {
    loadNotifications(false);
  }, []);

  const notifications = useMemo(() => {
    return decorateAdminNotifications(
      buildAdminNotifications(state.data || {}),
      readIds,
    );
  }, [state.data, readIds]);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        matchesFilter(notification, activeFilter),
      ),
    [notifications, activeFilter],
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const highPriorityCount = notifications.filter(
    (notification) => notification.severity === "high",
  ).length;

  function handleMarkRead(notificationId) {
    setReadIds(markAdminNotificationsRead([notificationId]));
  }

  function handleMarkAllRead() {
    setReadIds(
      markAdminNotificationsRead(
        notifications.map((notification) => notification.id),
      ),
    );
  }

  if (state.loading) return <AdminLoadingState />;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Notifications"
        subtitle="Monitor high-priority Sparkin activity across leads, payments, partner applications, service requests, bidding, and active projects."
        actions={
          <>
            <Button
              type="button"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => loadNotifications(true)}
              disabled={state.refreshing}
              sx={{
                minHeight: 38,
                px: 1.4,
                borderRadius: adminUi.radius.button,
                bgcolor: "#FFFFFF",
                color: "#1F2C40",
                border: "1px solid rgba(225,232,241,0.96)",
                fontSize: "0.74rem",
                fontWeight: 850,
                textTransform: "none",
                "&:hover": { bgcolor: "#F4F7FF" },
              }}
            >
              Refresh
            </Button>
            <AdminPrimaryButton
              type="button"
              startIcon={<CheckCircleOutlineRoundedIcon />}
              onClick={handleMarkAllRead}
              disabled={!unreadCount}
            >
              Mark all read
            </AdminPrimaryButton>
          </>
        }
      />

      {state.error ? <AdminErrorState>{state.error}</AdminErrorState> : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 1.5,
          mb: 2,
        }}
      >
        {[
          ["Unread", unreadCount, "#0E56C8"],
          ["High priority", highPriorityCount, "#D94444"],
          ["Total alerts", notifications.length, "#8A9700"],
        ].map(([label, value, color]) => (
          <AdminPanel key={label} sx={{ p: 2, borderLeft: `4px solid ${color}` }}>
            <Typography
              sx={{
                color: "#6F7D8F",
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                mt: 0.7,
                color: adminUi.colors.text,
                fontSize: "2rem",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </AdminPanel>
        ))}
      </Box>

      <AdminPanel sx={{ overflow: "hidden" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1.5}
          sx={{ p: { xs: 1.4, md: 1.8 }, bgcolor: "#F8FAFC" }}
        >
          <Stack direction="row" spacing={0.9} alignItems="center">
            <FilterListRoundedIcon sx={{ color: "#647387", fontSize: "1rem" }} />
            <Typography
              sx={{
                color: "#5B687A",
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Filter by
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                sx={{
                  minHeight: 34,
                  px: 1.35,
                  borderRadius: "999px",
                  bgcolor: activeFilter === filter ? "#0E56C8" : "#FFFFFF",
                  color: activeFilter === filter ? "#FFFFFF" : "#536174",
                  border: "1px solid rgba(225,232,241,0.96)",
                  fontSize: "0.72rem",
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: activeFilter === filter ? "#0B49AD" : "#EEF4FF",
                  },
                }}
              >
                {filter}
              </Button>
            ))}
          </Stack>
        </Stack>

        {filteredNotifications.length ? (
          filteredNotifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <AdminEmptyState
            title="No notifications found"
            subtitle="There are no Sparkin platform alerts for this filter right now."
          />
        )}
      </AdminPanel>

      <Alert
        severity="info"
        sx={{ mt: 2, borderRadius: "1rem", color: "#344154" }}
      >
        Notifications are generated from live platform data. Read state is saved
        in this browser until a dedicated notification service is added.
      </Alert>
    </AdminPageShell>
  );
}

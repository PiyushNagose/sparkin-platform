import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { forwardRef } from "react";
import {
  metricTypography,
  platformTypography,
} from "@/shared/ui/data-display/metricTypography";

export const adminUi = {
  colors: {
    text: "#18253A",
    muted: "#6F7D8F",
    border: "rgba(225,232,241,0.96)",
    primary: "#0E56C8",
    surface: "#FFFFFF",
    softSurface: "#F4F7F2",
  },
  shadow: "0 12px 30px rgba(16,29,51,0.06)",
  radius: {
    panel: "1.2rem",
    button: "0.85rem",
    pill: "999px",
  },
  typography: {
    pageTitle: {
      ...platformTypography.pageTitle,
    },
    pageSubtitle: platformTypography.pageSubtitle,
    sectionTitle: platformTypography.sectionTitle,
    cardTitle: platformTypography.cardTitle,
    cardText: platformTypography.cardText,
    smallText: platformTypography.smallText,
    actionText: platformTypography.actionText,
    metricLabel: metricTypography.label,
    metricValue: metricTypography.dashboardValue,
    metricValueCompact: metricTypography.compactValue,
  },
};

export function AdminPageShell({ children, sx }) {
  return <Box sx={{ width: "100%", ...sx }}>{children}</Box>;
}

export function AdminPageHeader({ title, subtitle, subtitleSx, actions }) {
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", lg: "center" }}
      spacing={2}
      sx={{ mb: { xs: 2.4, md: 3 } }}
    >
      <Box>
        <Typography
          sx={{
            color: adminUi.colors.text,
            ...adminUi.typography.pageTitle,
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            sx={{
              mt: 0.8,
              color: "#647387",
              ...adminUi.typography.pageSubtitle,
              maxWidth: 560,
              ...subtitleSx,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {actions ? (
        <Stack direction="row" spacing={1}>
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}

export function AdminPanel({ children, sx }) {
  return (
    <Box
      sx={{
        borderRadius: adminUi.radius.panel,
        bgcolor: adminUi.colors.surface,
        border: `1px solid ${adminUi.colors.border}`,
        boxShadow: adminUi.shadow,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function AdminPrimaryButton({ sx, ...props }) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        minHeight: 38,
        px: 1.6,
        borderRadius: adminUi.radius.button,
        bgcolor: adminUi.colors.primary,
        boxShadow: "0 10px 22px rgba(14,86,200,0.18)",
        ...adminUi.typography.actionText,
        fontWeight: 800,
        "&:hover": { bgcolor: "#0B49AD" },
        ...sx,
      }}
    />
  );
}

export function AdminLoadingState({ minHeight = 420 }) {
  return (
    <Box sx={{ minHeight, display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}

export const AdminErrorState = forwardRef(function AdminErrorState(
  { children },
  ref,
) {
  return (
    <Alert ref={ref} severity="error" sx={{ mb: 2, borderRadius: "0.9rem" }}>
      {children}
    </Alert>
  );
});

export function AdminEmptyState({ title, subtitle }) {
  return (
    <Box sx={{ py: 4.5, px: 2, textAlign: "center" }}>
      <InboxOutlinedIcon sx={{ color: "#CAD3DF", fontSize: "2.1rem", mb: 1 }} />
      <Typography
        sx={{ color: adminUi.colors.text, ...adminUi.typography.cardTitle }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          sx={{ mt: 0.45, color: adminUi.colors.muted, ...adminUi.typography.cardText }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}

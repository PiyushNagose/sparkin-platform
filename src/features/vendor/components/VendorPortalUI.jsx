import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import {
  metricTypography,
  platformTypography,
} from "@/shared/ui/data-display/metricTypography";

export const vendorUi = {
  colors: {
    text: "#18253A",
    muted: "#6F7D8F",
    border: "rgba(225,232,241,0.96)",
    primary: "#0E56C8",
    surface: "#FFFFFF",
    softSurface: "#F0F3F8",
  },
  shadow: "0 4px 16px rgba(16,29,51,0.06)",
  primaryShadow: "0 8px 20px rgba(14,86,200,0.18)",
  radius: {
    panel: "1.35rem",
    button: "0.95rem",
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
  transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
};

export function VendorPageShell({ children, sx }) {
  return <Box sx={{ width: "100%", ...sx }}>{children}</Box>;
}

export function VendorPageHeader({ title, subtitle, actions, sx }) {
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", lg: "center" }}
      spacing={2}
      sx={{ mb: { xs: 2.4, md: 2.8 }, ...sx }}
    >
      <Box>
        <Typography
          sx={{
            color: vendorUi.colors.text,
            ...vendorUi.typography.pageTitle,
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            sx={{
              mt: 0.45,
              maxWidth: 520,
              color: vendorUi.colors.muted,
              ...vendorUi.typography.pageSubtitle,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {actions ? (
        <Stack direction="row" spacing={1.05} sx={{ flexWrap: "wrap" }}>
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}

export function VendorPrimaryButton({ sx, ...props }) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        minHeight: 38,
        px: 1.7,
        borderRadius: vendorUi.radius.button,
        bgcolor: vendorUi.colors.primary,
        boxShadow: vendorUi.primaryShadow,
        ...vendorUi.typography.actionText,
        transition: vendorUi.transition,
        "&:hover": {
          bgcolor: "#0B49AD",
          boxShadow: "0 14px 28px rgba(14,86,200,0.26)",
          transform: "translateY(-1px)",
        },
        "&:active": { transform: "translateY(0)" },
        ...sx,
      }}
    />
  );
}

export function VendorSecondaryButton({ sx, ...props }) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        minHeight: 38,
        px: 1.65,
        borderRadius: vendorUi.radius.button,
        borderColor: "rgba(208,216,226,0.95)",
        color: "#223146",
        bgcolor: "#FFFFFF",
        ...vendorUi.typography.actionText,
        transition: vendorUi.transition,
        "&:hover": {
          borderColor: "rgba(184,196,212,0.98)",
          bgcolor: "#F8FAFD",
          transform: "translateY(-1px)",
        },
        "&:active": { transform: "translateY(0)" },
        ...sx,
      }}
    />
  );
}

export function VendorPanel({ children, sx }) {
  return (
    <Box
      sx={{
        borderRadius: vendorUi.radius.panel,
        bgcolor: vendorUi.colors.surface,
        border: `1px solid ${vendorUi.colors.border}`,
        boxShadow: vendorUi.shadow,
        transition: vendorUi.transition,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function VendorFilterPanel({ children, sx }) {
  return (
    <Box
      sx={{
        p: { xs: 1.4, md: 1.7 },
        borderRadius: vendorUi.radius.panel,
        bgcolor: "#F0F3F8",
        border: "1px solid rgba(229,234,241,0.95)",
        mb: { xs: 2.2, md: 2.5 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function VendorStatusPill({ children, tone = "#596579", bg = "#EEF2F6", sx }) {
  return (
    <Box
      sx={{
        justifySelf: "start",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.55,
        px: 1,
        py: 0.38,
        borderRadius: vendorUi.radius.pill,
        bgcolor: bg,
        color: tone,
        fontSize: "0.64rem",
        fontWeight: 800,
        lineHeight: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          bgcolor: tone,
          flexShrink: 0,
        }}
      />
      {children}
    </Box>
  );
}

export function VendorLoadingState({ minHeight = 360 }) {
  return (
    <Box sx={{ minHeight, display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}

export function VendorErrorState({ children, sx }) {
  return (
    <Alert severity="error" sx={{ mb: 2, borderRadius: "0.9rem", ...sx }}>
      {children}
    </Alert>
  );
}

export function VendorEmptyState({
  title,
  subtitle,
  icon,
  actionLabel,
  actionOnClick,
  sx,
}) {
  const Icon = icon || InboxOutlinedIcon;

  return (
    <Box
      sx={{
        py: 5,
        px: 2,
        borderRadius: "1.2rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
        textAlign: "center",
        ...sx,
      }}
    >
      <Icon sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }} />
      <Typography sx={{ color: "#223146", ...vendorUi.typography.cardTitle }}>{title}</Typography>
      {subtitle ? (
        <Typography
          sx={{
            mt: 0.5,
            color: "#6F7D8F",
            ...vendorUi.typography.cardText,
            maxWidth: 360,
            mx: "auto",
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
      {actionLabel && actionOnClick ? (
        <Button
          variant="contained"
          onClick={actionOnClick}
          sx={{
            mt: 1.8,
            minHeight: 38,
            px: 1.65,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            ...vendorUi.typography.actionText,
          }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}

import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

export function CustomerLoadingBlock({ mt = 2, py = 5 }) {
  return (
    <Box sx={{ mt, py, display: "grid", placeItems: "center" }}>
      <CircularProgress size={32} />
    </Box>
  );
}

export function CustomerErrorBlock({ message, onRetry, mt = 1.5 }) {
  return (
    <Alert
      severity="error"
      sx={{ mt, borderRadius: "0.9rem" }}
      action={
        onRetry ? (
          <Button
            size="small"
            color="inherit"
            onClick={onRetry}
            startIcon={<RefreshRoundedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Retry
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}

export function CustomerEmptyCard({
  icon,
  title,
  description,
  actionLabel,
  action,
  mt = 1.8,
}) {
  const Icon = icon;

  return (
    <Box
      sx={{
        mt,
        py: 5,
        px: 2,
        borderRadius: "1.2rem",
        bgcolor: "#F8FAFD",
        border: "1px solid rgba(225,232,241,0.9)",
        textAlign: "center",
      }}
    >
      {Icon ? <Icon sx={{ color: "#C8D0DC", fontSize: "2rem", mb: 1 }} /> : null}
      <Typography sx={{ color: "#223146", fontSize: "1rem", fontWeight: 800 }}>{title}</Typography>
      {description ? (
        <Typography
          sx={{
            mt: 0.5,
            color: "#6F7D8F",
            fontSize: "0.84rem",
            lineHeight: 1.65,
            maxWidth: 360,
            mx: "auto",
          }}
        >
          {description}
        </Typography>
      ) : null}
      {actionLabel && action ? (
        <Button
          variant="contained"
          onClick={action}
          sx={{
            mt: 1.8,
            minHeight: 38,
            px: 1.65,
            borderRadius: "0.95rem",
            bgcolor: "#0E56C8",
            boxShadow: "0 12px 24px rgba(14,86,200,0.16)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}

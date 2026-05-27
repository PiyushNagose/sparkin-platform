import { Box, Button, Stack, Typography } from "@mui/material";
import {
  isRouteErrorResponse,
  Link as RouterLink,
  useRouteError,
} from "react-router-dom";

function getMessage(error) {
  if (isRouteErrorResponse(error)) {
    return error.statusText || `Request failed with status ${error.status}.`;
  }

  return error?.message || "An unexpected route error occurred.";
}

export function RouteErrorPage() {
  const error = useRouteError();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: "#F6F8FB",
      }}
    >
      <Stack
        spacing={1.8}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 3,
          borderRadius: "1.2rem",
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(220,228,238,0.92)",
          boxShadow: "0 18px 36px rgba(16,29,51,0.08)",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{ color: "#1B2838", fontSize: "1.5rem", fontWeight: 800 }}
        >
          This page could not load
        </Typography>
        <Typography sx={{ color: "#647286", fontSize: "0.95rem", lineHeight: 1.7 }}>
          {getMessage(error)}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            sx={{
              minHeight: 44,
              borderRadius: "0.9rem",
              borderColor: "#0E56C8",
              color: "#0E56C8",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Go Home
          </Button>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              minHeight: 44,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Reload
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

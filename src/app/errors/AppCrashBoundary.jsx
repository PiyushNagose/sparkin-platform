import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

export class AppCrashBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crash boundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

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
            maxWidth: 460,
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
            Something went wrong
          </Typography>
          <Typography sx={{ color: "#647286", fontSize: "0.95rem", lineHeight: 1.7 }}>
            The app hit an unexpected error. Reload to recover the current
            session safely.
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReload}
            sx={{
              minHeight: 44,
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Reload App
          </Button>
        </Stack>
      </Box>
    );
  }
}

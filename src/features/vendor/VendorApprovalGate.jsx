import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";

export default function VendorApprovalGate() {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    status: null,
    error: "",
  });

  function loadProfile(active = true) {
    setState({ loading: true, status: null, error: "" });

    vendorsApi
      .getMyProfile({ force: true })
      .then((profile) => {
        if (!active) return;
        setState({
          loading: false,
          status: profile?.verificationStatus || "draft",
          error: "",
        });
      })
      .catch((apiError) => {
        if (!active) return;
        setState({
          loading: false,
          status: null,
          error:
            apiError?.response?.data?.message ||
            "Could not verify your account status. Please try again.",
        });
      });
  }

  useEffect(() => {
    let active = true;
    loadProfile(active);
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "#F4F7F2",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // API failed — show a recoverable error screen instead of silently redirecting
  if (state.error && state.status === null) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "#F4F7F2",
          px: 2,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 380 }}>
          <Typography
            sx={{
              color: "#18253A",
              fontSize: "1.1rem",
              fontWeight: 800,
              mb: 1,
            }}
          >
            Unable to load your account
          </Typography>
          <Typography
            sx={{
              color: "#6F7D8F",
              fontSize: "0.88rem",
              lineHeight: 1.65,
              mb: 2.5,
            }}
          >
            {state.error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => loadProfile(true)}
            sx={{
              borderRadius: "0.9rem",
              bgcolor: "#0E56C8",
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
            }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  if (state.status === "verified") {
    return <Outlet />;
  }

  if (state.status === "draft") {
    return (
      <Navigate to="/vendor/onboarding" replace state={{ from: location }} />
    );
  }

  return (
    <Navigate
      to="/vendor/pending-approval"
      replace
      state={{ from: location }}
    />
  );
}

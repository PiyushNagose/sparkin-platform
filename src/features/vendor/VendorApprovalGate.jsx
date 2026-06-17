import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";
import { useSocket } from "@/shared/websocket/SocketProvider";

export default function VendorApprovalGate() {
  const location = useLocation();
  const { refreshKey } = useSocket();
  const initialLoadDone = useRef(false);
  const [state, setState] = useState({
    loading: true,
    status: null,
    error: "",
  });

  function loadProfile(active = true) {
    // Don't show full-screen loading spinner on socket-triggered re-checks
    // after the first load — only update status silently.
    if (initialLoadDone.current) {
      vendorsApi
        .getMyProfile({ force: true })
        .then((profile) => {
          if (!active) return;
          setState((prev) => ({
            ...prev,
            status: profile?.verificationStatus || prev.status || "draft",
          }));
        })
        .catch(() => {});
      return;
    }

    setState({ loading: true, status: null, error: "" });

    vendorsApi
      .getMyProfile({ force: true })
      .then((profile) => {
        if (!active) return;
        initialLoadDone.current = true;
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

  // Initial load
  useEffect(() => {
    let active = true;
    loadProfile(active);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check status whenever the socket signals a vendor-related change
  // (e.g. admin approves the vendor → refresh:page fires → refreshKey bumps)
  useEffect(() => {
    if (refreshKey === 0) return; // skip the initial mount value
    let active = true;
    loadProfile(active);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

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

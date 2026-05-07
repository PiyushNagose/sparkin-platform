import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";

export default function VendorApprovalGate() {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    status: "draft",
    error: "",
  });

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await vendorsApi.getMyProfile({ force: true });

        if (!active) return;

        setState({
          loading: false,
          status: profile?.verificationStatus || "draft",
          error: "",
        });
      } catch (apiError) {
        if (!active) return;

        setState({
          loading: false,
          status: "draft",
          error:
            apiError?.response?.data?.message ||
            "Could not verify vendor approval status.",
        });
      }
    }

    loadProfile();

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

  if (state.status === "verified") {
    return <Outlet />;
  }

  if (state.status === "draft") {
    return <Navigate to="/vendor/onboarding" replace state={{ from: location }} />;
  }

  return (
    <Navigate
      to="/vendor/pending-approval"
      replace
      state={{ from: location, error: state.error || undefined }}
    />
  );
}

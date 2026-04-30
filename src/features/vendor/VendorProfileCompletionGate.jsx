import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";

function getCompletion(profile) {
  if (!profile) return 0;

  const checks = [
    profile.account?.fullName,
    profile.account?.email,
    profile.account?.phoneNumber,
    profile.company?.name,
    profile.company?.gstNumber,
    profile.company?.address,
    profile.company?.city,
    profile.company?.state,
    Object.values(profile.services || {}).some(Boolean) ? "services" : "",
    profile.documents?.length ? "documents" : "",
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function VendorProfileCompletionGate() {
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(user?.role === "vendor");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (user?.role !== "vendor") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result = await vendorsApi.getMyProfile();
        if (active) setProfile(result);
      } catch {
        if (active) setProfile(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.role]);

  const completion = useMemo(() => getCompletion(profile), [profile]);
  const isProfilePage = location.pathname.startsWith("/vendor/profile");

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#F4F7F2" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user?.role === "vendor" && completion < 80 && !isProfilePage) {
    return <Navigate to="/vendor/profile" replace state={{ needsBusinessProfile: true, from: location }} />;
  }

  return <Outlet />;
}

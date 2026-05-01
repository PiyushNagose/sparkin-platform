import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { vendorsApi } from "@/features/vendor/api/vendorsApi";

export function getVendorProfileRequirements(profile) {
  const companyDocuments = profile?.documents?.filter((document) => document.type === "company") || [];
  const certificationDocuments = profile?.documents?.filter((document) => document.type === "certification") || [];

  return [
    { key: "fullName", label: "Account full name", complete: Boolean(profile?.account?.fullName) },
    { key: "email", label: "Account email", complete: Boolean(profile?.account?.email) },
    { key: "phoneNumber", label: "Phone number", complete: Boolean(profile?.account?.phoneNumber) },
    { key: "companyName", label: "Company name", complete: Boolean(profile?.company?.name) },
    { key: "businessType", label: "Business type", complete: Boolean(profile?.company?.businessType) },
    { key: "gstNumber", label: "GST number", complete: Boolean(profile?.company?.gstNumber) },
    { key: "address", label: "Business address", complete: Boolean(profile?.company?.address) },
    { key: "city", label: "City", complete: Boolean(profile?.company?.city) },
    { key: "state", label: "State", complete: Boolean(profile?.company?.state) },
    { key: "coverageArea", label: "Coverage area", complete: Boolean(profile?.company?.coverageArea) },
    { key: "experienceYears", label: "Experience years", complete: Number(profile?.company?.experienceYears) > 0 },
    { key: "projectsCompleted", label: "Projects completed", complete: Number(profile?.company?.projectsCompleted) > 0 },
    { key: "totalCapacityMw", label: "Total capacity", complete: Number(profile?.company?.totalCapacityMw) > 0 },
    { key: "services", label: "At least one service capability", complete: Object.values(profile?.services || {}).some(Boolean) },
    { key: "companyDocument", label: "Company compliance document", complete: companyDocuments.length > 0 },
    { key: "certificationDocument", label: "Certification or insurance document", complete: certificationDocuments.length > 0 },
  ];
}

export function getVendorProfileCompletion(profile) {
  const requirements = getVendorProfileRequirements(profile);
  return Math.round((requirements.filter((item) => item.complete).length / requirements.length) * 100);
}

export function isVendorProfileComplete(profile) {
  return getVendorProfileRequirements(profile).every((item) => item.complete);
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

    function handleProfileUpdated(event) {
      if (active) setProfile(event.detail);
    }

    window.addEventListener("sparkin:vendor-profile-updated", handleProfileUpdated);

    return () => {
      active = false;
      window.removeEventListener("sparkin:vendor-profile-updated", handleProfileUpdated);
    };
  }, [user?.role]);

  const isComplete = useMemo(() => isVendorProfileComplete(profile), [profile]);
  const isProfilePage = location.pathname.startsWith("/vendor/profile");

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#F4F7F2" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user?.role === "vendor" && !isComplete && !isProfilePage) {
    return <Navigate to="/vendor/profile" replace state={{ needsBusinessProfile: true, from: location }} />;
  }

  return <Outlet />;
}

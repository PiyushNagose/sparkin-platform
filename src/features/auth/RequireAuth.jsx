import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export function RequireAuth({ allowedRoles, children }) {
  const location = useLocation();
  const { user, isAuthenticated, isBootstrapping, getRoleHome } = useAuth();

  if (isBootstrapping) {
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

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith("/vendor")
      ? "/vendor/login"
      : location.pathname.startsWith("/admin")
        ? "/admin/login"
        : "/auth/login";

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children ?? <Outlet />;
}

export function GuestOnly({ children }) {
  const { user, isAuthenticated, isBootstrapping, getRoleHome } = useAuth();

  if (isBootstrapping) {
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

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children ?? <Outlet />;
}

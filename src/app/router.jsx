import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PortalLayout } from "@/app/layouts/PortalLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { adminRoutes } from "@/features/admin/routes";
import { authRoutes } from "@/features/auth/routes";
import VendorLoginPage from "@/features/auth/pages/VendorLoginPage";
import VendorSignupPage from "@/features/auth/pages/VendorSignupPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import { customerRoutes } from "@/features/customer/routes";
import { publicRoutes } from "@/features/public/routes";
import VendorApprovalGate from "@/features/vendor/VendorApprovalGate";
import VendorPendingApprovalPage from "@/features/vendor/pages/VendorPendingApprovalPage";
import { vendorRoutes } from "@/features/vendor/routes";
import VendorOnboardingPage from "@/features/vendor/pages/VendorOnboardingPage";
import { useSocket } from "@/shared/websocket/SocketProvider";

const RootOutlet = () => {
  const { refreshKey } = useSocket();
  return <Outlet key={refreshKey} />;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootOutlet />,
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: authRoutes,
      },
      {
        path: "/vendor/login",
        element: <AuthLayout />,
        children: [{ index: true, element: <VendorLoginPage /> }],
      },
      {
        path: "/vendor/signup",
        element: <AuthLayout />,
        children: [{ index: true, element: <VendorSignupPage /> }],
      },
      {
        path: "/admin/login",
        element: <AuthLayout />,
        children: [{ index: true, element: <AdminLoginPage /> }],
      },
      {
        path: "/admin",
        element: <RequireAuth allowedRoles={["admin"]} />,
        children: [
          {
            element: <PortalLayout portal="admin" />,
            children: adminRoutes,
          },
        ],
      },
      {
        path: "/customer",
        element: <RequireAuth allowedRoles={["customer", "admin"]} />,
        children: [
          {
            element: <PortalLayout portal="customer" />,
            children: customerRoutes,
          },
        ],
      },
      {
        path: "/vendor",
        element: <RequireAuth allowedRoles={["vendor", "admin"]} />,
        children: [
          {
            path: "onboarding",
            element: <VendorOnboardingPage />,
          },
          {
            path: "pending-approval",
            element: <VendorPendingApprovalPage />,
          },
          {
            element: <VendorApprovalGate />,
            children: [
              {
                element: <PortalLayout portal="vendor" />,
                children: vendorRoutes,
              },
            ],
          },
        ],
      },
    ],
  },
]);

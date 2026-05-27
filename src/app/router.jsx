import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { RouteErrorPage } from "@/app/errors/RouteErrorPage";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PortalLayout } from "@/app/layouts/PortalLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { adminRoutes } from "@/features/admin/routes";
import { authRoutes } from "@/features/auth/routes";
import { customerRoutes } from "@/features/customer/routes";
import { publicRoutes } from "@/features/public/routes";
import VendorApprovalGate from "@/features/vendor/VendorApprovalGate";
import { vendorRoutes } from "@/features/vendor/routes";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";

const VendorLoginPage = lazy(
  () => import("@/features/auth/pages/VendorLoginPage"),
);
const VendorSignupPage = lazy(
  () => import("@/features/auth/pages/VendorSignupPage"),
);
const AdminLoginPage = lazy(
  () => import("@/features/auth/pages/AdminLoginPage"),
);
const VendorPendingApprovalPage = lazy(
  () => import("@/features/vendor/pages/VendorPendingApprovalPage"),
);
const VendorOnboardingPage = lazy(
  () => import("@/features/vendor/pages/VendorOnboardingPage"),
);

const RootOutlet = () => <Outlet />;

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootOutlet />,
    errorElement: <RouteErrorPage />,
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
        children: [{ index: true, element: <LazyRoute component={VendorLoginPage} /> }],
      },
      {
        path: "/vendor/signup",
        element: <AuthLayout />,
        children: [{ index: true, element: <LazyRoute component={VendorSignupPage} /> }],
      },
      {
        path: "/admin/login",
        element: <AuthLayout />,
        children: [{ index: true, element: <LazyRoute component={AdminLoginPage} /> }],
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
            element: <LazyRoute component={VendorOnboardingPage} />,
          },
          {
            path: "pending-approval",
            element: <LazyRoute component={VendorPendingApprovalPage} />,
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

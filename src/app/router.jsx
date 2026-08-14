import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { NotFoundPage, RouteErrorPage } from "@/app/errors/RouteErrorPage";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PortalLayout } from "@/app/layouts/PortalLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { GuestOnly, RequireAuth } from "@/features/auth/RequireAuth";
import { adminRoutes } from "@/features/admin/routes";
import { authRoutes } from "@/features/auth/routes";
import { customerRoutes } from "@/features/customer/routes";
import { publicRoutes } from "@/features/public/routes";
import VendorApprovalGate from "@/features/vendor/VendorApprovalGate";
import { vendorRoutes } from "@/features/vendor/routes";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";
import { NavigationProgress } from "@/shared/ui/progress/NavigationProgress";

const VendorLoginPage = lazy(
  () => import("@/features/auth/pages/VendorLoginPage"),
);
const VendorSignupPage = lazy(
  () => import("@/features/auth/pages/VendorSignupPage"),
);
const VendorForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/VendorForgotPasswordPage"),
);
const VendorResetPasswordPage = lazy(
  () => import("@/features/auth/pages/VendorResetPasswordPage"),
);
const AdminLoginPage = lazy(
  () => import("@/features/auth/pages/AdminLoginPage"),
);
const AdminForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/AdminForgotPasswordPage"),
);
const AdminResetPasswordPage = lazy(
  () => import("@/features/auth/pages/AdminResetPasswordPage"),
);
const VendorPendingApprovalPage = lazy(
  () => import("@/features/vendor/pages/VendorPendingApprovalPage"),
);
const VendorOnboardingPage = lazy(
  () => import("@/features/vendor/pages/VendorOnboardingPage"),
);

const RootOutlet = () => (
  <>
    <NavigationProgress />
    <Outlet />
  </>
);

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
        element: (
          <GuestOnly>
            <AuthLayout />
          </GuestOnly>
        ),
        children: authRoutes,
      },
      {
        path: "/vendor/login",
        element: (
          <GuestOnly allowAuthenticatedRoles={["customer", "admin"]}>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          { index: true, element: <LazyRoute component={VendorLoginPage} /> },
        ],
      },
      {
        path: "/vendor/forgot-password",
        element: (
          <GuestOnly allowAuthenticatedRoles={["customer", "admin"]}>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          {
            index: true,
            element: <LazyRoute component={VendorForgotPasswordPage} />,
          },
        ],
      },
      {
        path: "/vendor/reset-password",
        element: (
          <GuestOnly allowAuthenticatedRoles={["customer", "admin"]}>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          {
            index: true,
            element: <LazyRoute component={VendorResetPasswordPage} />,
          },
        ],
      },
      {
        path: "/vendor/signup",
        element: (
          <GuestOnly allowAuthenticatedRoles={["customer", "admin"]}>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          { index: true, element: <LazyRoute component={VendorSignupPage} /> },
        ],
      },
      {
        path: "/admin/login",
        element: (
          <GuestOnly>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          { index: true, element: <LazyRoute component={AdminLoginPage} /> },
        ],
      },
      {
        path: "/admin/forgot-password",
        element: (
          <GuestOnly>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          {
            index: true,
            element: <LazyRoute component={AdminForgotPasswordPage} />,
          },
        ],
      },
      {
        path: "/admin/reset-password",
        element: (
          <GuestOnly>
            <AuthLayout />
          </GuestOnly>
        ),
        children: [
          {
            index: true,
            element: <LazyRoute component={AdminResetPasswordPage} />,
          },
        ],
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
        element: <RequireAuth allowedRoles={["customer"]} />,
        children: [
          {
            element: <PortalLayout portal="customer" />,
            children: customerRoutes,
          },
        ],
      },
      {
        path: "/vendor",
        element: <RequireAuth allowedRoles={["vendor"]} />,
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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

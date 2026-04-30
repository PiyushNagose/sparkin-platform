import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PortalLayout } from "@/app/layouts/PortalLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { authRoutes } from "@/features/auth/routes";
import { customerRoutes } from "@/features/customer/routes";
import { publicRoutes } from "@/features/public/routes";
import { vendorRoutes } from "@/features/vendor/routes";

const RootOutlet = () => <Outlet />;

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
            element: <PortalLayout portal="vendor" />,
            children: vendorRoutes,
          },
        ],
      },
    ],
  },
]);

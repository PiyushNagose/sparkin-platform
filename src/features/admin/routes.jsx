import AdminDashboardPage, { makeAdminPlaceholder } from "@/features/admin/pages/AdminDashboardPage";

export const adminRoutes = [
  {
    index: true,
    element: <AdminDashboardPage />,
  },
  {
    path: "leads",
    element: makeAdminPlaceholder("Leads"),
  },
  {
    path: "payments",
    element: makeAdminPlaceholder("Payments"),
  },
  {
    path: "vendor-assignment",
    element: makeAdminPlaceholder("Vendor Assignment"),
  },
  {
    path: "vendors",
    element: makeAdminPlaceholder("Vendors"),
  },
  {
    path: "bidding",
    element: makeAdminPlaceholder("Bidding"),
  },
  {
    path: "customers-projects",
    element: makeAdminPlaceholder("Customers/Projects"),
  },
  {
    path: "reports",
    element: makeAdminPlaceholder("Reports"),
  },
  {
    path: "settings",
    element: makeAdminPlaceholder("Settings"),
  },
  {
    path: "notifications",
    element: makeAdminPlaceholder("Notifications"),
  },
];

import AdminDashboardPage, { makeAdminPlaceholder } from "@/features/admin/pages/AdminDashboardPage";
import AdminLeadDetailPage from "@/features/admin/pages/AdminLeadDetailPage";
import AdminLeadsPage from "@/features/admin/pages/AdminLeadsPage";
import AdminPaymentsPage from "@/features/admin/pages/AdminPaymentsPage";
import AdminVendorAssignmentPage from "@/features/admin/pages/AdminVendorAssignmentPage";

export const adminRoutes = [
  {
    index: true,
    element: <AdminDashboardPage />,
  },
  {
    path: "leads",
    element: <AdminLeadsPage />,
  },
  {
    path: "leads/:leadId",
    element: <AdminLeadDetailPage />,
  },
  {
    path: "payments",
    element: <AdminPaymentsPage />,
  },
  {
    path: "payments/:paymentId",
    element: makeAdminPlaceholder("Payment Details"),
  },
  {
    path: "vendor-assignment",
    element: <AdminVendorAssignmentPage />,
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

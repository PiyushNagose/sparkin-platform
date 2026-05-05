import AdminDashboardPage, { makeAdminPlaceholder } from "@/features/admin/pages/AdminDashboardPage";
import AdminBiddingPage from "@/features/admin/pages/AdminBiddingPage";
import AdminBroadcastPage from "@/features/admin/pages/AdminBroadcastPage";
import AdminHelpDeskPage from "@/features/admin/pages/AdminHelpDeskPage";
import AdminLeadDetailPage from "@/features/admin/pages/AdminLeadDetailPage";
import AdminLeadsPage from "@/features/admin/pages/AdminLeadsPage";
import AdminPaymentsPage from "@/features/admin/pages/AdminPaymentsPage";
import AdminProjectDetailPage from "@/features/admin/pages/AdminProjectDetailPage";
import AdminProjectsPage from "@/features/admin/pages/AdminProjectsPage";
import AdminReportsPage from "@/features/admin/pages/AdminReportsPage";
import AdminServicesPage from "@/features/admin/pages/AdminServicesPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import AdminCreateOfferPage from "@/features/admin/pages/AdminCreateOfferPage";
import AdminOffersPage from "@/features/admin/pages/AdminOffersPage";
import AdminTicketDetailPage from "@/features/admin/pages/AdminTicketDetailPage";
import AdminVendorApplicationsPage from "@/features/admin/pages/AdminVendorApplicationsPage";
import AdminVendorAssignmentPage from "@/features/admin/pages/AdminVendorAssignmentPage";
import AdminVendorsPage from "@/features/admin/pages/AdminVendorsPage";

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
    element: <AdminVendorsPage />,
  },
  {
    path: "vendors/:vendorId",
    element: makeAdminPlaceholder("Vendor Details"),
  },
  {
    path: "bidding",
    element: <AdminBiddingPage />,
  },
  {
    path: "customers-projects",
    element: <AdminProjectsPage />,
  },
  {
    path: "customers-projects/:projectId",
    element: <AdminProjectDetailPage />,
  },
  {
    path: "services",
    element: <AdminServicesPage />,
  },
  {
    path: "reports",
    element: <AdminReportsPage />,
  },
  {
    path: "settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "notifications",
    element: makeAdminPlaceholder("Notifications"),
  },
  {
    path: "help-desk",
    element: <AdminHelpDeskPage />,
  },
  {
    path: "help-desk/:ticketId",
    element: <AdminTicketDetailPage />,
  },
  {
    path: "broadcast",
    element: <AdminBroadcastPage />,
  },
  {
    path: "offers",
    element: <AdminOffersPage />,
  },
  {
    path: "offers/create",
    element: <AdminCreateOfferPage />,
  },
  {
    path: "vendor-applications",
    element: <AdminVendorApplicationsPage />,
  },
];

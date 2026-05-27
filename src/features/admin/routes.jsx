import { lazy } from "react";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";

const AdminDashboardPage = lazy(
  () => import("@/features/admin/pages/AdminDashboardPage"),
);
const AdminBiddingPage = lazy(
  () => import("@/features/admin/pages/AdminBiddingPage"),
);
const AdminBroadcastPage = lazy(
  () => import("@/features/admin/pages/AdminBroadcastPage"),
);
const AdminHelpDeskPage = lazy(
  () => import("@/features/admin/pages/AdminHelpDeskPage"),
);
const AdminLeadDetailPage = lazy(
  () => import("@/features/admin/pages/AdminLeadDetailPage"),
);
const AdminLeadsPage = lazy(() => import("@/features/admin/pages/AdminLeadsPage"));
const AdminPaymentDetailPage = lazy(
  () => import("@/features/admin/pages/AdminPaymentDetailPage"),
);
const AdminPaymentsPage = lazy(
  () => import("@/features/admin/pages/AdminPaymentsPage"),
);
const AdminProjectDetailPage = lazy(
  () => import("@/features/admin/pages/AdminProjectDetailPage"),
);
const AdminProjectsPage = lazy(
  () => import("@/features/admin/pages/AdminProjectsPage"),
);
const AdminReportsPage = lazy(
  () => import("@/features/admin/pages/AdminReportsPage"),
);
const AdminServicesPage = lazy(
  () => import("@/features/admin/pages/AdminServicesPage"),
);
const AdminSettingsPage = lazy(
  () => import("@/features/admin/pages/AdminSettingsPage"),
);
const AdminCreateOfferPage = lazy(
  () => import("@/features/admin/pages/AdminCreateOfferPage"),
);
const AdminOffersPage = lazy(() => import("@/features/admin/pages/AdminOffersPage"));
const AdminTicketDetailPage = lazy(
  () => import("@/features/admin/pages/AdminTicketDetailPage"),
);
const AdminVendorApplicationsPage = lazy(
  () => import("@/features/admin/pages/AdminVendorApplicationsPage"),
);
const AdminVendorApplicationDetailPage = lazy(
  () => import("@/features/admin/pages/AdminVendorApplicationDetailPage"),
);
const AdminVendorAssignmentPage = lazy(
  () => import("@/features/admin/pages/AdminVendorAssignmentPage"),
);
const AdminVendorDetailPage = lazy(
  () => import("@/features/admin/pages/AdminVendorDetailPage"),
);
const AdminVendorsPage = lazy(
  () => import("@/features/admin/pages/AdminVendorsPage"),
);
const AdminReferralManagementPage = lazy(
  () => import("@/features/admin/pages/AdminReferralManagementPage"),
);
const AdminNotificationsPage = lazy(
  () => import("@/features/admin/pages/AdminNotificationsPage"),
);

export const adminRoutes = [
  { index: true, element: <LazyRoute component={AdminDashboardPage} /> },
  { path: "leads", element: <LazyRoute component={AdminLeadsPage} /> },
  {
    path: "leads/:leadId",
    element: <LazyRoute component={AdminLeadDetailPage} />,
  },
  { path: "payments", element: <LazyRoute component={AdminPaymentsPage} /> },
  {
    path: "payments/:paymentId",
    element: <LazyRoute component={AdminPaymentDetailPage} />,
  },
  {
    path: "vendor-assignment",
    element: <LazyRoute component={AdminVendorAssignmentPage} />,
  },
  { path: "vendors", element: <LazyRoute component={AdminVendorsPage} /> },
  {
    path: "vendors/:vendorId",
    element: <LazyRoute component={AdminVendorDetailPage} />,
  },
  { path: "bidding", element: <LazyRoute component={AdminBiddingPage} /> },
  {
    path: "customers-projects",
    element: <LazyRoute component={AdminProjectsPage} />,
  },
  {
    path: "customers-projects/:projectId",
    element: <LazyRoute component={AdminProjectDetailPage} />,
  },
  { path: "services", element: <LazyRoute component={AdminServicesPage} /> },
  { path: "reports", element: <LazyRoute component={AdminReportsPage} /> },
  { path: "settings", element: <LazyRoute component={AdminSettingsPage} /> },
  {
    path: "notifications",
    element: <LazyRoute component={AdminNotificationsPage} />,
  },
  {
    path: "help-desk",
    element: <LazyRoute component={AdminHelpDeskPage} />,
  },
  {
    path: "help-desk/:ticketId",
    element: <LazyRoute component={AdminTicketDetailPage} />,
  },
  { path: "broadcast", element: <LazyRoute component={AdminBroadcastPage} /> },
  { path: "offers", element: <LazyRoute component={AdminOffersPage} /> },
  {
    path: "offers/create",
    element: <LazyRoute component={AdminCreateOfferPage} />,
  },
  {
    path: "vendor-applications",
    element: <LazyRoute component={AdminVendorApplicationsPage} />,
  },
  {
    path: "vendor-applications/:vendorId",
    element: <LazyRoute component={AdminVendorApplicationDetailPage} />,
  },
  {
    path: "referral-management",
    element: <LazyRoute component={AdminReferralManagementPage} />,
  },
];

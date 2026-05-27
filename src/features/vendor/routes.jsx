import { lazy } from "react";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";

const VendorDashboardPage = lazy(
  () => import("@/features/vendor/pages/VendorDashboardPage"),
);
const VendorLeadsPage = lazy(
  () => import("@/features/vendor/pages/VendorLeadsPage"),
);
const VendorLeadDetailPage = lazy(
  () => import("@/features/vendor/pages/VendorLeadDetailPage"),
);
const VendorQuoteProposalPage = lazy(
  () => import("@/features/vendor/pages/VendorQuoteProposalPage"),
);
const VendorQuotesPage = lazy(
  () => import("@/features/vendor/pages/VendorQuotesPage"),
);
const VendorProjectsPage = lazy(
  () => import("@/features/vendor/pages/VendorProjectsPage"),
);
const VendorProjectDetailPage = lazy(
  () => import("@/features/vendor/pages/VendorProjectDetailPage"),
);
const VendorPaymentsPage = lazy(
  () => import("@/features/vendor/pages/VendorPaymentsPage"),
);
const VendorTransactionsPage = lazy(
  () => import("@/features/vendor/pages/VendorTransactionsPage"),
);
const VendorInvoiceDetailPage = lazy(
  () => import("@/features/vendor/pages/VendorInvoiceDetailPage"),
);
const VendorProfilePage = lazy(
  () => import("@/features/vendor/pages/VendorProfilePage"),
);
const VendorSettingsPage = lazy(
  () => import("@/features/vendor/pages/VendorSettingsPage"),
);
const VendorChatPage = lazy(() => import("@/features/vendor/pages/VendorChatPage"));
const VendorHelpCenterPage = lazy(
  () => import("@/features/vendor/pages/VendorHelpCenterPage"),
);

export const vendorRoutes = [
  { index: true, element: <LazyRoute component={VendorDashboardPage} /> },
  { path: "leads", element: <LazyRoute component={VendorLeadsPage} /> },
  {
    path: "leads/:leadId",
    element: <LazyRoute component={VendorLeadDetailPage} />,
  },
  { path: "quotes", element: <LazyRoute component={VendorQuotesPage} /> },
  { path: "quotes/new", element: <LazyRoute component={VendorLeadsPage} /> },
  {
    path: "leads/:leadId/quote",
    element: <LazyRoute component={VendorQuoteProposalPage} />,
  },
  { path: "projects", element: <LazyRoute component={VendorProjectsPage} /> },
  {
    path: "projects/:projectId",
    element: <LazyRoute component={VendorProjectDetailPage} />,
  },
  { path: "payments", element: <LazyRoute component={VendorPaymentsPage} /> },
  {
    path: "payments/transactions",
    element: <LazyRoute component={VendorTransactionsPage} />,
  },
  {
    path: "payments/transactions/:invoiceId",
    element: <LazyRoute component={VendorInvoiceDetailPage} />,
  },
  { path: "profile", element: <LazyRoute component={VendorProfilePage} /> },
  { path: "settings", element: <LazyRoute component={VendorSettingsPage} /> },
  { path: "chat", element: <LazyRoute component={VendorChatPage} /> },
  { path: "help", element: <LazyRoute component={VendorHelpCenterPage} /> },
];

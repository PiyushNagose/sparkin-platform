import VendorOnboardingPage from "@/features/vendor/pages/VendorOnboardingPage";
import VendorDashboardPage from "@/features/vendor/pages/VendorDashboardPage";
import VendorLeadsPage from "@/features/vendor/pages/VendorLeadsPage";
import VendorLeadDetailPage from "@/features/vendor/pages/VendorLeadDetailPage";
import VendorQuoteProposalPage from "@/features/vendor/pages/VendorQuoteProposalPage";
import VendorQuotesPage from "@/features/vendor/pages/VendorQuotesPage";
import VendorProjectsPage from "@/features/vendor/pages/VendorProjectsPage";
import VendorProjectDetailPage from "@/features/vendor/pages/VendorProjectDetailPage";
import VendorPaymentsPage from "@/features/vendor/pages/VendorPaymentsPage";
import VendorTransactionsPage from "@/features/vendor/pages/VendorTransactionsPage";
import VendorInvoiceDetailPage from "@/features/vendor/pages/VendorInvoiceDetailPage";
import VendorProfilePage from "@/features/vendor/pages/VendorProfilePage";

export const vendorRoutes = [
  {
    index: true,
    element: <VendorDashboardPage />,
  },
  {
    path: "onboarding",
    element: <VendorOnboardingPage />,
  },
  {
    path: "leads",
    element: <VendorLeadsPage />,
  },
  {
    path: "leads/:leadId",
    element: <VendorLeadDetailPage />,
  },
  {
    path: "quotes",
    element: <VendorQuotesPage />,
  },
  {
    path: "quotes/new",
    element: <VendorQuoteProposalPage />,
  },
  {
    path: "leads/:leadId/quote",
    element: <VendorQuoteProposalPage />,
  },
  {
    path: "projects",
    element: <VendorProjectsPage />,
  },
  {
    path: "projects/:projectId",
    element: <VendorProjectDetailPage />,
  },
  {
    path: "payments",
    element: <VendorPaymentsPage />,
  },
  {
    path: "payments/transactions",
    element: <VendorTransactionsPage />,
  },
  {
    path: "payments/transactions/:invoiceId",
    element: <VendorInvoiceDetailPage />,
  },
  {
    path: "profile",
    element: <VendorProfilePage />,
  },
];

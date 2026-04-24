import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
import CustomerDashboardPage from "@/features/customer/pages/CustomerDashboardPage";
import CustomerBookingsPage from "@/features/customer/pages/CustomerBookingsPage";
import CustomerTendersPage from "@/features/customer/pages/CustomerTendersPage";
import CustomerProjectsPage from "@/features/customer/pages/CustomerProjectsPage";
import CustomerServicesPage from "@/features/customer/pages/CustomerServicesPage";
import CustomerProfilePage from "@/features/customer/pages/CustomerProfilePage";
import CustomerReferralsPage from "@/features/customer/pages/CustomerReferralsPage";
import CustomerShareEarnPage from "@/features/customer/pages/CustomerShareEarnPage";
import CustomerReferralEarningsPage from "@/features/customer/pages/CustomerReferralEarningsPage";

export const customerRoutes = [
  {
    index: true,
    element: <CustomerDashboardPage />,
  },
  {
    path: "bookings",
    element: <CustomerBookingsPage />,
  },
  {
    path: "tenders",
    element: <CustomerTendersPage />,
  },
  {
    path: "projects",
    element: <CustomerProjectsPage />,
  },
  {
    path: "services",
    element: <CustomerServicesPage />,
  },
  {
    path: "savings",
    element: (
      <ScreenPlaceholder
        title="Savings"
        description="Savings analytics with performance chart, impact metrics, and referral callout."
        sections={["Savings hero", "Forecast chart", "Impact metrics", "Referral banner"]}
      />
    ),
  },
  {
    path: "referrals",
    element: <CustomerReferralsPage />,
  },
  {
    path: "referrals/share",
    element: <CustomerShareEarnPage />,
  },
  {
    path: "referrals/earnings",
    element: <CustomerReferralEarningsPage />,
  },
  {
    path: "profile",
    element: <CustomerProfilePage />,
  },
];

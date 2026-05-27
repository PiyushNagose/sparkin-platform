import { lazy } from "react";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";

const CustomerDashboardPage = lazy(
  () => import("@/features/customer/pages/CustomerDashboardPage"),
);
const CustomerBookingsPage = lazy(
  () => import("@/features/customer/pages/CustomerBookingsPage"),
);
const CustomerChatPage = lazy(
  () => import("@/features/customer/pages/CustomerChatPage"),
);
const CustomerTendersPage = lazy(
  () => import("@/features/customer/pages/CustomerTendersPage"),
);
const CustomerProjectsPage = lazy(
  () => import("@/features/customer/pages/CustomerProjectsPage"),
);
const CustomerServicesPage = lazy(
  () => import("@/features/customer/pages/CustomerServicesPage"),
);
const CustomerSavingsPage = lazy(
  () => import("@/features/customer/pages/CustomerSavingsPage"),
);
const CustomerProfilePage = lazy(
  () => import("@/features/customer/pages/CustomerProfilePage"),
);
const CustomerReferralsPage = lazy(
  () => import("@/features/customer/pages/CustomerReferralsPage"),
);
const CustomerShareEarnPage = lazy(
  () => import("@/features/customer/pages/CustomerShareEarnPage"),
);
const CustomerReferralEarningsPage = lazy(
  () => import("@/features/customer/pages/CustomerReferralEarningsPage"),
);
const CustomerTenderDetailPage = lazy(
  () => import("@/features/customer/pages/CustomerTenderDetailPage"),
);

export const customerRoutes = [
  { index: true, element: <LazyRoute component={CustomerDashboardPage} /> },
  { path: "bookings", element: <LazyRoute component={CustomerBookingsPage} /> },
  {
    path: "bookings/:leadId",
    element: <LazyRoute component={CustomerTenderDetailPage} />,
  },
  { path: "tenders", element: <LazyRoute component={CustomerTendersPage} /> },
  {
    path: "tenders/:leadId",
    element: <LazyRoute component={CustomerTenderDetailPage} />,
  },
  { path: "projects", element: <LazyRoute component={CustomerProjectsPage} /> },
  { path: "services", element: <LazyRoute component={CustomerServicesPage} /> },
  { path: "savings", element: <LazyRoute component={CustomerSavingsPage} /> },
  {
    path: "referrals",
    element: <LazyRoute component={CustomerReferralsPage} />,
  },
  {
    path: "referrals/share",
    element: <LazyRoute component={CustomerShareEarnPage} />,
  },
  {
    path: "referrals/earnings",
    element: <LazyRoute component={CustomerReferralEarningsPage} />,
  },
  { path: "profile", element: <LazyRoute component={CustomerProfilePage} /> },
  { path: "chat", element: <LazyRoute component={CustomerChatPage} /> },
];

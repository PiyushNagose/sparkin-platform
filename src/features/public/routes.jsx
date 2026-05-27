import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";
import { RequireAuth } from "@/features/auth/RequireAuth";

const CalculatorPage = lazy(() => import("@/features/public/pages/CalculatorPage"));
const CalculatorProcessingPage = lazy(
  () => import("@/features/public/pages/CalculatorProcessingPage"),
);
const CalculatorResultsPage = lazy(
  () => import("@/features/public/pages/CalculatorResultsPage"),
);
const CalculatorUnavailablePage = lazy(
  () => import("@/features/public/pages/CalculatorUnavailablePage"),
);
const BookingStepOnePage = lazy(
  () => import("@/features/public/pages/BookingStepOnePage"),
);
const BookingStepTwoPage = lazy(
  () => import("@/features/public/pages/BookingStepTwoPage"),
);
const BookingStepThreePage = lazy(
  () => import("@/features/public/pages/BookingStepThreePage"),
);
const BookingStepFourPage = lazy(
  () => import("@/features/public/pages/BookingStepFourPage"),
);
const BookingPaymentPage = lazy(
  () => import("@/features/public/pages/BookingPaymentPage"),
);
const BookingSubmittedPage = lazy(
  () => import("@/features/public/pages/BookingSubmittedPage"),
);
const LiveBiddingPage = lazy(
  () => import("@/features/public/pages/LiveBiddingPage"),
);
const QuoteComparisonPage = lazy(
  () => import("@/features/public/pages/QuoteComparisonPage"),
);
const VendorTataPowerPage = lazy(
  () => import("@/features/public/pages/VendorTataPowerPage"),
);
const VendorPublicProfilePage = lazy(
  () => import("@/features/public/pages/VendorPublicProfilePage"),
);
const VendorConfirmSelectionPage = lazy(
  () => import("@/features/public/pages/VendorConfirmSelectionPage"),
);
const SolarInstallationProjectPage = lazy(
  () => import("@/features/public/pages/SolarInstallationProjectPage"),
);
const ServiceSupportPage = lazy(
  () => import("@/features/public/pages/ServiceSupportPage"),
);
const CreateServiceRequestPage = lazy(
  () => import("@/features/public/pages/CreateServiceRequestPage"),
);
const ServiceRequestSubmittedPage = lazy(
  () => import("@/features/public/pages/ServiceRequestSubmittedPage"),
);
const TrackServiceRequestPage = lazy(
  () => import("@/features/public/pages/TrackServiceRequestPage"),
);
const ContactPage = lazy(() => import("@/features/public/pages/ContactPage"));
const FaqPage = lazy(() => import("@/features/public/pages/FaqPage"));
const TermsPage = lazy(() => import("@/features/public/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/features/public/pages/PrivacyPage"));
const AboutPage = lazy(() => import("@/features/public/pages/AboutPage"));
const ArticlesPage = lazy(() => import("@/features/public/pages/ArticlesPage"));
const BlogPage = lazy(() => import("@/features/public/pages/BlogPage"));
const ReferEarnPage = lazy(
  () => import("@/features/public/pages/ReferEarnPage"),
);
const ReferralLandingPage = lazy(
  () => import("@/features/public/pages/ReferralLandingPage"),
);
const ResourcesPage = lazy(
  () => import("@/features/public/pages/ResourcesPage"),
);
const TrustedPartnersPage = lazy(
  () => import("@/features/public/pages/TrustedPartnersPage"),
);
const VendorDiscoveryPage = lazy(
  () => import("@/features/public/pages/VendorDiscoveryPage"),
);
const SolarLoanPage = lazy(
  () => import("@/features/public/pages/SolarLoanPage"),
);
const HomePage = lazy(() => import("@/features/public/pages/HomePage"));
const WhyChooseUsPage = lazy(
  () => import("@/features/public/pages/WhyChooseUsPage"),
);

function protectedCustomerPage(Component) {
  return (
    <RequireAuth allowedRoles={["customer", "admin"]}>
      <LazyRoute component={Component} />
    </RequireAuth>
  );
}

export const publicRoutes = [
  { index: true, element: <LazyRoute component={HomePage} /> },
  { path: "about", element: <LazyRoute component={AboutPage} /> },
  { path: "about-us", element: <LazyRoute component={AboutPage} /> },
  {
    path: "how-it-works",
    element: (
      <ScreenPlaceholder
        eyebrow="How It Works"
        title="Quote Journey Overview"
        description="Explain how the lead, bidding, selection, project, and service flow works for customers."
        sections={[
          "Broadcast phase",
          "Competitive bidding",
          "Selection process",
          "Bottom CTA",
        ]}
      />
    ),
  },
  { path: "why-choose-us", element: <LazyRoute component={WhyChooseUsPage} /> },
  { path: "calculator", element: <LazyRoute component={CalculatorPage} /> },
  {
    path: "calculator/processing",
    element: <LazyRoute component={CalculatorProcessingPage} />,
  },
  {
    path: "calculator/results",
    element: <LazyRoute component={CalculatorResultsPage} />,
  },
  {
    path: "calculator/unavailable",
    element: <LazyRoute component={CalculatorUnavailablePage} />,
  },
  { path: "partners", element: <LazyRoute component={TrustedPartnersPage} /> },
  { path: "vendors", element: <LazyRoute component={VendorDiscoveryPage} /> },
  {
    path: "vendors/partners",
    element: <LazyRoute component={TrustedPartnersPage} />,
  },
  { path: "resources", element: <LazyRoute component={ResourcesPage} /> },
  { path: "loan-financing", element: <LazyRoute component={SolarLoanPage} /> },
  { path: "contact", element: <LazyRoute component={ContactPage} /> },
  { path: "contact-us", element: <LazyRoute component={ContactPage} /> },
  { path: "faq", element: <LazyRoute component={FaqPage} /> },
  { path: "faqs", element: <LazyRoute component={FaqPage} /> },
  { path: "terms", element: <LazyRoute component={TermsPage} /> },
  { path: "privacy", element: <LazyRoute component={PrivacyPage} /> },
  { path: "refer-earn", element: <LazyRoute component={ReferEarnPage} /> },
  {
    path: "ref/:referralCode",
    element: <LazyRoute component={ReferralLandingPage} />,
  },
  { path: "articles", element: <LazyRoute component={ArticlesPage} /> },
  { path: "blog", element: <LazyRoute component={BlogPage} /> },
  { path: "booking", element: protectedCustomerPage(BookingStepOnePage) },
  {
    path: "booking/property",
    element: protectedCustomerPage(BookingStepTwoPage),
  },
  {
    path: "booking/roof",
    element: protectedCustomerPage(BookingStepThreePage),
  },
  {
    path: "booking/upload",
    element: protectedCustomerPage(BookingStepFourPage),
  },
  {
    path: "booking/payment",
    element: protectedCustomerPage(BookingPaymentPage),
  },
  {
    path: "booking/submitted",
    element: protectedCustomerPage(BookingSubmittedPage),
  },
  {
    path: "tenders/live",
    element: protectedCustomerPage(LiveBiddingPage),
  },
  {
    path: "quotes/compare",
    element: protectedCustomerPage(QuoteComparisonPage),
  },
  {
    path: "quotes/:quoteId/details",
    element: protectedCustomerPage(VendorTataPowerPage),
  },
  {
    path: "quotes/:quoteId/confirm",
    element: protectedCustomerPage(VendorConfirmSelectionPage),
  },
  {
    path: "quotes/:quoteId/payment",
    element: protectedCustomerPage(BookingPaymentPage),
  },
  {
    path: "vendors/tata-power-solar",
    element: <LazyRoute component={VendorTataPowerPage} />,
  },
  {
    path: "vendors/tata-power-solar/confirm",
    element: protectedCustomerPage(VendorConfirmSelectionPage),
  },
  {
    path: "vendors/:vendorId",
    element: <LazyRoute component={VendorPublicProfilePage} />,
  },
  {
    path: "vendors/onboarding",
    element: <Navigate to="/project/installation" replace />,
  },
  {
    path: "project/installation",
    element: protectedCustomerPage(SolarInstallationProjectPage),
  },
  {
    path: "service-support",
    element: <LazyRoute component={ServiceSupportPage} />,
  },
  {
    path: "service-support/request",
    element: protectedCustomerPage(CreateServiceRequestPage),
  },
  {
    path: "service-support/request/submitted",
    element: protectedCustomerPage(ServiceRequestSubmittedPage),
  },
  {
    path: "service-support/track",
    element: protectedCustomerPage(TrackServiceRequestPage),
  },
];

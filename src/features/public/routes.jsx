import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
import { Navigate } from "react-router-dom";
import CalculatorPage from "@/features/public/pages/CalculatorPage";
import CalculatorProcessingPage from "@/features/public/pages/CalculatorProcessingPage";
import CalculatorResultsPage from "@/features/public/pages/CalculatorResultsPage";
import CalculatorUnavailablePage from "@/features/public/pages/CalculatorUnavailablePage";
import BookingStepOnePage from "@/features/public/pages/BookingStepOnePage";
import BookingStepTwoPage from "@/features/public/pages/BookingStepTwoPage";
import BookingStepThreePage from "@/features/public/pages/BookingStepThreePage";
import BookingStepFourPage from "@/features/public/pages/BookingStepFourPage";
import BookingSubmittedPage from "@/features/public/pages/BookingSubmittedPage";
import LiveBiddingPage from "@/features/public/pages/LiveBiddingPage";
import QuoteComparisonPage from "@/features/public/pages/QuoteComparisonPage";
import VendorTataPowerPage from "@/features/public/pages/VendorTataPowerPage";
import VendorConfirmSelectionPage from "@/features/public/pages/VendorConfirmSelectionPage";
import SolarInstallationProjectPage from "@/features/public/pages/SolarInstallationProjectPage";
import ServiceSupportPage from "@/features/public/pages/ServiceSupportPage";
import CreateServiceRequestPage from "@/features/public/pages/CreateServiceRequestPage";
import ServiceRequestSubmittedPage from "@/features/public/pages/ServiceRequestSubmittedPage";
import TrackServiceRequestPage from "@/features/public/pages/TrackServiceRequestPage";
import ContactPage from "@/features/public/pages/ContactPage";
import FaqPage from "@/features/public/pages/FaqPage";
import TermsPage from "@/features/public/pages/TermsPage";
import PrivacyPage from "@/features/public/pages/PrivacyPage";
import AboutPage from "@/features/public/pages/AboutPage";
import ArticlesPage from "@/features/public/pages/ArticlesPage";
import BlogPage from "@/features/public/pages/BlogPage";
import ReferEarnPage from "@/features/public/pages/ReferEarnPage";
import ResourcesPage from "@/features/public/pages/ResourcesPage";
import TrustedPartnersPage from "@/features/public/pages/TrustedPartnersPage";
import VendorDiscoveryPage from "@/features/public/pages/VendorDiscoveryPage";
import SolarLoanPage from "@/features/public/pages/SolarLoanPage";
import HomePage from "@/features/public/pages/HomePage";
import WhyChooseUsPage from "@/features/public/pages/WhyChooseUsPage";
import { RequireAuth } from "@/features/auth/RequireAuth";

function protectedCustomerPage(element) {
  return <RequireAuth allowedRoles={["customer", "admin"]}>{element}</RequireAuth>;
}

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "about-us",
    element: <AboutPage />,
  },
  {
    path: "how-it-works",
    element: (
      <ScreenPlaceholder
        eyebrow="How It Works"
        title="Quote Journey Overview"
        description="Explain how the lead, bidding, selection, project, and service flow works for customers."
        sections={["Broadcast phase", "Competitive bidding", "Selection process", "Bottom CTA"]}
      />
    ),
  },
  {
    path: "why-choose-us",
    element: <WhyChooseUsPage />,
  },
  {
    path: "calculator",
    element: <CalculatorPage />,
  },
  {
    path: "calculator/processing",
    element: <CalculatorProcessingPage />,
  },
  {
    path: "calculator/results",
    element: <CalculatorResultsPage />,
  },
  {
    path: "calculator/unavailable",
    element: <CalculatorUnavailablePage />,
  },
  {
    path: "vendors",
    element: <VendorDiscoveryPage />,
  },
  {
    path: "vendors/partners",
    element: <TrustedPartnersPage />,
  },
  {
    path: "resources",
    element: <ResourcesPage />,
  },
  {
    path: "loan-financing",
    element: <SolarLoanPage />,
  },
  {
    path: "contact",
    element: <ContactPage />,
  },
  {
    path: "contact-us",
    element: <ContactPage />,
  },
  {
    path: "faq",
    element: <FaqPage />,
  },
  {
    path: "faqs",
    element: <FaqPage />,
  },
  {
    path: "terms",
    element: <TermsPage />,
  },
  {
    path: "privacy",
    element: <PrivacyPage />,
  },
  {
    path: "refer-earn",
    element: <ReferEarnPage />,
  },
  {
    path: "articles",
    element: <ArticlesPage />,
  },
  {
    path: "blog",
    element: <BlogPage />,
  },
  {
    path: "booking",
    element: protectedCustomerPage(<BookingStepOnePage />),
  },
  {
    path: "booking/property",
    element: protectedCustomerPage(<BookingStepTwoPage />),
  },
  {
    path: "booking/roof",
    element: protectedCustomerPage(<BookingStepThreePage />),
  },
  {
    path: "booking/upload",
    element: protectedCustomerPage(<BookingStepFourPage />),
  },
  {
    path: "booking/submitted",
    element: protectedCustomerPage(<BookingSubmittedPage />),
  },
  {
    path: "tenders/live",
    element: protectedCustomerPage(<LiveBiddingPage />),
  },
  {
    path: "quotes/compare",
    element: protectedCustomerPage(<QuoteComparisonPage />),
  },
  {
    path: "quotes/:quoteId/confirm",
    element: protectedCustomerPage(<VendorConfirmSelectionPage />),
  },
  {
    path: "vendors/tata-power-solar",
    element: <VendorTataPowerPage />,
  },
  {
    path: "vendors/tata-power-solar/confirm",
    element: protectedCustomerPage(<VendorConfirmSelectionPage />),
  },
  {
    path: "vendors/onboarding",
    element: <Navigate to="/project/installation" replace />,
  },
  {
    path: "project/installation",
    element: protectedCustomerPage(<SolarInstallationProjectPage />),
  },
  {
    path: "service-support",
    element: <ServiceSupportPage />,
  },
  {
    path: "service-support/request",
    element: protectedCustomerPage(<CreateServiceRequestPage />),
  },
  {
    path: "service-support/request/submitted",
    element: protectedCustomerPage(<ServiceRequestSubmittedPage />),
  },
  {
    path: "service-support/track",
    element: protectedCustomerPage(<TrackServiceRequestPage />),
  },
];

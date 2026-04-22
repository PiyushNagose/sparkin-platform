import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
import CalculatorPage from "@/features/public/pages/CalculatorPage";
import CalculatorProcessingPage from "@/features/public/pages/CalculatorProcessingPage";
import CalculatorResultsPage from "@/features/public/pages/CalculatorResultsPage";
import CalculatorUnavailablePage from "@/features/public/pages/CalculatorUnavailablePage";
import BookingStepOnePage from "@/features/public/pages/BookingStepOnePage";
import BookingStepTwoPage from "@/features/public/pages/BookingStepTwoPage";
import BookingStepThreePage from "@/features/public/pages/BookingStepThreePage";
import BookingStepFourPage from "@/features/public/pages/BookingStepFourPage";
import HomePage from "@/features/public/pages/HomePage";

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "about",
    element: (
      <ScreenPlaceholder
        eyebrow="About"
        title="About Sparkin Solar"
        description="Brand story, mission, measurable impact, and trust-building company narrative."
        sections={["Vision and mission", "Impact metrics", "Brand story", "Join-us CTA"]}
      />
    ),
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
    element: (
      <ScreenPlaceholder
        eyebrow="Vendors"
        title="Vendor Discovery"
        description="Vendor listing and partner overview screens for browsing, filtering, and comparing solar providers."
        sections={["Hero banner", "Filters", "Vendor cards", "Consultation CTA"]}
      />
    ),
  },
  {
    path: "loan-financing",
    element: (
      <ScreenPlaceholder
        eyebrow="Financing"
        title="Solar Financing"
        description="Loan comparison, rates, estimated EMI, and financing CTAs."
        sections={["Rate calculator", "Bank table", "Eligibility CTA", "Expert consultation card"]}
      />
    ),
  },
  {
    path: "contact",
    element: (
      <ScreenPlaceholder
        eyebrow="Contact"
        title="Contact Sparkin"
        description="Structured support contact page with message form, office, map, and enterprise CTA."
        sections={["Contact cards", "Message form", "Office media blocks", "Final CTA"]}
      />
    ),
  },
  {
    path: "faq",
    element: (
      <ScreenPlaceholder
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Searchable FAQ page with category tabs, expanded answers, and support CTA."
        sections={["Search and filters", "Accordion list", "Featured support answer", "Support CTA"]}
      />
    ),
  },
  {
    path: "terms",
    element: (
      <ScreenPlaceholder
        eyebrow="Legal"
        title="Terms and Conditions"
        description="Structured legal content page with grouped policy cards and strong readability."
        sections={["Intro", "User responsibilities", "Vendor terms", "Liability section"]}
      />
    ),
  },
  {
    path: "privacy",
    element: (
      <ScreenPlaceholder
        eyebrow="Privacy"
        title="Privacy Policy"
        description="Clear legal structure covering data collection, usage, sharing, security, and user rights."
        sections={["Information collected", "Data usage", "Security measures", "User rights"]}
      />
    ),
  },
  {
    path: "booking",
    element: <BookingStepOnePage />,
  },
  {
    path: "booking/property",
    element: <BookingStepTwoPage />,
  },
  {
    path: "booking/roof",
    element: <BookingStepThreePage />,
  },
  {
    path: "booking/upload",
    element: <BookingStepFourPage />,
  },
  {
    path: "booking/submitted",
    element: (
      <ScreenPlaceholder
        eyebrow="Booking Flow"
        title="Request Submitted"
        description="Success confirmation, next-step guidance, and dashboard tracking entry point."
        sections={["Success card", "Next steps", "Track request CTA", "Dashboard CTA"]}
      />
    ),
  },
  {
    path: "service-support",
    element: (
      <ScreenPlaceholder
        eyebrow="Support"
        title="Customer Service and Support"
        description="Service dashboard, service request creation, service success state, and live technician tracking."
        sections={["System summary", "Service request form", "Success state", "Tracking screen"]}
      />
    ),
  },
];

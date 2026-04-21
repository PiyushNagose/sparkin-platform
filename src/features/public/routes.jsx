import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
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
    element: (
      <ScreenPlaceholder
        eyebrow="Calculator"
        title="Solar Savings Calculator"
        description="Property type, bill amount, and location based calculator flow with loading, unavailable area, and results states."
        sections={["Input form", "Processing state", "Unavailable-state card", "Savings results"]}
      />
    ),
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
    element: (
      <ScreenPlaceholder
        eyebrow="Booking Flow"
        title="Guided Quote Request"
        description="Four-step quote request flow with progress tracking, uploads, success screen, and compare-quotes entry."
        sections={["Step 1 personal details", "Step 2 property details", "Step 3 roof details", "Step 4 uploads and success"]}
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

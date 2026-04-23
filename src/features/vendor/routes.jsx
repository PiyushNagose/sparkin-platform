import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";
import VendorOnboardingPage from "@/features/vendor/pages/VendorOnboardingPage";

export const vendorRoutes = [
  {
    index: true,
    element: (
      <ScreenPlaceholder
        eyebrow="Vendor Portal"
        title="Vendor Dashboard"
        description="Operational dashboard with KPIs, active leads, recent activity, feedback, heatmap, and yield tracking."
        sections={["Top KPIs", "Active leads table", "Recent activity", "Yield and heatmap blocks"]}
      />
    ),
  },
  {
    path: "onboarding",
    element: <VendorOnboardingPage />,
  },
  {
    path: "leads",
    element: (
      <ScreenPlaceholder
        title="Leads"
        description="Filterable leads table and lead details for reviewing project requirements and responding with quotes."
        sections={["Lead filters", "Lead table", "Lead detail summary", "Submit quote CTA"]}
      />
    ),
  },
  {
    path: "quotes",
    element: (
      <ScreenPlaceholder
        title="Quotes"
        description="Quote list, quote creation flow, win-rate guidance, and analytics cards."
        sections={["Quote KPIs", "Quote table", "Proposal form", "Pricing suggestion card"]}
      />
    ),
  },
  {
    path: "projects",
    element: (
      <ScreenPlaceholder
        title="Projects"
        description="Project list and project detail workspace with milestones, tabs, documents, and update actions."
        sections={["Project list", "Project detail header", "Milestones and tabs", "Footer action bar"]}
      />
    ),
  },
  {
    path: "payments",
    element: (
      <ScreenPlaceholder
        title="Payments"
        description="Payments overview, payout setup, transaction tracking, and invoice details."
        sections={["Revenue KPIs", "Revenue chart", "Transactions table", "Invoice detail view"]}
      />
    ),
  },
  {
    path: "profile",
    element: (
      <ScreenPlaceholder
        title="Vendor Profile and Business Details"
        description="Vendor identity, security settings, business details, capabilities, and compliance documents."
        sections={["Profile settings", "Security controls", "Business details form", "Compliance uploads"]}
      />
    ),
  },
];

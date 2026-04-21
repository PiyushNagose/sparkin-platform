import { ScreenPlaceholder } from "@/shared/ui/placeholder/ScreenPlaceholder";

export const customerRoutes = [
  {
    index: true,
    element: (
      <ScreenPlaceholder
        eyebrow="Customer Portal"
        title="Customer Dashboard"
        description="Overview dashboard with savings, active tenders, service status, milestones, and smart utility guidance."
        sections={["Savings hero", "Tender and service cards", "Project milestone strip", "Insight card"]}
      />
    ),
  },
  {
    path: "bookings",
    element: (
      <ScreenPlaceholder
        title="My Bookings"
        description="Booking cards with request status, bids received, project report, and lifecycle summaries."
        sections={["Summary stats", "Booking list", "Status badges", "Pagination"]}
      />
    ),
  },
  {
    path: "tenders",
    element: (
      <ScreenPlaceholder
        title="My Tenders"
        description="Live and closed bid competitions with best prices and countdown urgency."
        sections={["Tender cards", "Active and closed tabs", "Price highlights", "Load more CTA"]}
      />
    ),
  },
  {
    path: "projects",
    element: (
      <ScreenPlaceholder
        title="My Projects"
        description="Project cards, milestone timelines, assigned vendor details, and support or referral cross-sells."
        sections={["Project status cards", "Milestone tracker", "Assigned vendor block", "Support and referral CTAs"]}
      />
    ),
  },
  {
    path: "services",
    element: (
      <ScreenPlaceholder
        title="My Services"
        description="Service request list with active and history tabs, service cards, and performance education CTA."
        sections={["Service cards", "Tabs", "Track-service actions", "Educational promo section"]}
      />
    ),
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
    element: (
      <ScreenPlaceholder
        title="Refer and Earn"
        description="Referral code management, quick-share actions, earnings tracking, and referral history."
        sections={["Referral code block", "Share methods", "Earnings summary", "Activity list"]}
      />
    ),
  },
  {
    path: "profile",
    element: (
      <ScreenPlaceholder
        title="Customer Profile"
        description="Personal information, preferences, notifications, and household energy profile settings."
        sections={["Profile header", "Personal details form", "Preferences panel", "Save actions"]}
      />
    ),
  },
];


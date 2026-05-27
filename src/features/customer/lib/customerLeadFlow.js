export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPropertyType(type) {
  const map = {
    independent_house: "Independent House",
    apartment: "Apartment",
    commercial: "Commercial",
  };

  return map[type] || "Solar Request";
}

export function formatRoofSize(sizeRange) {
  const map = {
    under_500: "Under 500 sq ft",
    "500_1000": "500-1000 sq ft",
    over_1000: "Over 1000 sq ft",
  };

  return map[sizeRange] || "Shared after survey";
}

export function formatProjectStatus(status) {
  const map = {
    site_audit_pending: "Site Audit Pending",
    design_approval_pending: "Design Approval Pending",
    installation_scheduled: "Installation Scheduled",
    installation_in_progress: "Installation In Progress",
    inspection_pending: "Inspection Pending",
    activated: "Activated",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return map[status] || status?.replaceAll("_", " ") || "In Progress";
}

export function buildBookingDetailsPath(leadId) {
  return `/customer/bookings/${leadId}`;
}

export function buildTenderDetailsPath(leadId) {
  return `/customer/tenders/${leadId}`;
}

function parseDate(value) {
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function getLeadQuotes(quotes = [], leadId, options = {}) {
  const matches = quotes.filter((quote) => String(quote.leadId) === String(leadId));

  if (!options.activeOnly) {
    return matches.sort(
      (a, b) =>
        parseDate(b.submittedAt || b.updatedAt || b.createdAt) -
        parseDate(a.submittedAt || a.updatedAt || a.createdAt),
    );
  }

  return matches
    .filter((quote) => !["withdrawn", "rejected"].includes(quote.status))
    .sort(
      (a, b) =>
        parseDate(b.submittedAt || b.updatedAt || b.createdAt) -
        parseDate(a.submittedAt || a.updatedAt || a.createdAt),
    );
}

export function getRelevantProject(projects = [], leadId) {
  const leadProjects = projects.filter(
    (project) => String(project.leadId) === String(leadId),
  );

  if (!leadProjects.length) return null;

  return [...leadProjects].sort((a, b) => {
    const aActive = a.status !== "cancelled" ? 1 : 0;
    const bActive = b.status !== "cancelled" ? 1 : 0;

    if (aActive !== bActive) return bActive - aActive;

    return (
      parseDate(b.updatedAt || b.createdAt) - parseDate(a.updatedAt || a.createdAt)
    );
  })[0];
}

export function getLeadStatusMeta(lead) {
  if (lead?.status === "closed" && !lead?.selection?.quoteId) {
    return { label: "Bidding Closed", tone: "#596579", bg: "#EEF2F6" };
  }

  if (isLeadBiddingExpired(lead)) {
    return { label: "Bidding Closed", tone: "#596579", bg: "#EEF2F6" };
  }

  switch (lead?.status) {
    case "quote_selected":
    case "closed":
      return { label: "Project Created", tone: "#239654", bg: "#E8FAEF" };
    case "open_for_quotes":
      return { label: "Bidding Live", tone: "#6C7300", bg: "#E7F318" };
    case "vendors_assigned":
      return { label: "Vendors Assigned", tone: "#7A6B00", bg: "#FFF8E6" };
    case "verified":
      return { label: "Verified", tone: "#0E56C8", bg: "#EEF4FF" };
    case "reviewing":
      return { label: "Under Review", tone: "#4F89FF", bg: "#EEF4FF" };
    default:
      return { label: "Submitted", tone: "#8F98A7", bg: "#F2F5F8" };
  }
}

export function isLeadBiddingExpired(lead) {
  if (!lead?.biddingEndsAt) return false;
  if (!["vendors_assigned", "open_for_quotes"].includes(lead?.status)) return false;

  return new Date(lead.biddingEndsAt).getTime() <= Date.now();
}

export function getPrimaryLeadAction(lead, quotes = [], projects = []) {
  const activeQuotes = getLeadQuotes(quotes, lead?.id, { activeOnly: true });
  const project = getRelevantProject(projects, lead?.id);

  if (
    isLeadBiddingExpired(lead) ||
    (lead?.status === "closed" && !lead?.selection?.quoteId)
  ) {
    return {
      label: "Book Again",
      to: "/booking",
      primary: true,
    };
  }

  if (["quote_selected", "closed"].includes(lead?.status)) {
    if (project && project.status !== "cancelled") {
      return {
        label: "Track Project",
        to: `/project/installation?projectId=${project.id}`,
        primary: true,
      };
    }

    return {
      label: "View Tender",
      to: buildTenderDetailsPath(lead?.id),
      primary: false,
    };
  }

  if (lead?.status === "open_for_quotes") {
    if (activeQuotes.length > 0) {
      return {
        label: "View Bids",
        to: `/quotes/compare?leadId=${lead?.id}`,
        primary: true,
      };
    }

    return {
      label: "Sit Back & Relax",
      to: `/tenders/live?leadId=${lead?.id}`,
      primary: true,
    };
  }

  return {
    label: "Sit Back & Relax",
    to: `/tenders/live?leadId=${lead?.id}`,
    primary: true,
  };
}

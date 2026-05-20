const READ_STORAGE_KEY = "sparkin.admin.notifications.read.v1";
export const ADMIN_NOTIFICATIONS_CHANGED = "sparkin:admin-notifications-changed";

const ACTIVE_LEAD_STATUSES = new Set([
  "submitted",
  "reviewing",
  "verified",
  "vendors_assigned",
  "open_for_quotes",
]);

function getId(item) {
  return item?.id || item?._id || item?.leadId || item?.vendorId || "";
}

function parseDate(value) {
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getBestDate(item) {
  return (
    item?.updatedAt ||
    item?.submittedAt ||
    item?.paidAt ||
    item?.onboardingSubmittedAt ||
    item?.createdAt ||
    new Date().toISOString()
  );
}

function titleCaseStatus(status = "") {
  return status
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatAdminNotificationTime(value) {
  if (!value) return "Just now";

  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function readAdminNotificationIds() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function writeAdminNotificationIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(ADMIN_NOTIFICATIONS_CHANGED));
}

export function markAdminNotificationsRead(notificationIds) {
  const readIds = readAdminNotificationIds();
  notificationIds.forEach((id) => readIds.add(id));
  writeAdminNotificationIds(readIds);
  return readIds;
}

export function buildAdminNotifications(data = {}) {
  const notifications = [];
  const leads = data.leads || [];
  const payments = data.payments || [];
  const projects = data.projects || [];
  const quotes = data.quotes || [];
  const serviceRequests = data.serviceRequests || [];
  const vendors = data.vendors || [];

  leads.forEach((lead) => {
    const leadId = getId(lead);
    if (!leadId) return;

    const status = lead.status || "submitted";
    const customerName =
      lead.contact?.fullName || lead.customer?.fullName || "Customer";
    const city =
      lead.installationAddress?.city ||
      lead.installationAddress?.district ||
      lead.installationAddress?.state ||
      "service area";

    if (["submitted", "reviewing"].includes(status)) {
      notifications.push({
        id: `lead:${leadId}:verification`,
        type: "Lead",
        severity: "high",
        title: "Lead verification pending",
        message: `${customerName} submitted a solar request in ${city}. Verify the lead and assign vendors.`,
        actionLabel: "Open lead",
        path: `/admin/leads/${leadId}`,
        createdAt: getBestDate(lead),
      });
    }

    if (status === "verified") {
      notifications.push({
        id: `lead:${leadId}:assign-vendors`,
        type: "Vendor Assignment",
        severity: "medium",
        title: "Verified lead needs vendors",
        message: `${customerName}'s verified request is ready for vendor assignment.`,
        actionLabel: "Assign vendors",
        path: `/admin/vendor-assignment?leadId=${leadId}`,
        createdAt: getBestDate(lead),
      });
    }

    if (lead.assignedVendorIds?.length && !lead.commitmentFeePaid) {
      notifications.push({
        id: `lead:${leadId}:payment`,
        type: "Payment",
        severity: "medium",
        title: "Commitment payment pending",
        message: `${customerName}'s assigned lead is open for bidding, but payment is not marked complete yet.`,
        actionLabel: "Review lead",
        path: `/admin/leads/${leadId}`,
        createdAt: getBestDate(lead),
      });
    }

    if (ACTIVE_LEAD_STATUSES.has(status)) {
      const assignedCount = lead.assignedVendors?.length || 0;
      const quoteCount = quotes.filter((quote) => {
        const quoteLeadId =
          quote.leadId || quote.lead?.id || quote.lead?._id || quote.lead?._id;
        return String(quoteLeadId) === String(leadId);
      }).length;

      if (assignedCount > 0 && quoteCount === 0) {
        notifications.push({
          id: `lead:${leadId}:awaiting-bids`,
          type: "Bidding",
          severity: "low",
          title: "Assigned vendors have not bid yet",
          message: `${assignedCount} vendor${assignedCount === 1 ? "" : "s"} assigned for ${customerName}, with no submitted quote yet.`,
          actionLabel: "Monitor bidding",
          path: "/admin/bidding",
          createdAt: getBestDate(lead),
        });
      }
    }
  });

  payments.forEach((payment) => {
    const paymentId = getId(payment);
    if (!paymentId || !["pending", "failed"].includes(payment.status)) return;

    const customerName = payment.customer?.fullName || "Customer";
    notifications.push({
      id: `payment:${paymentId}:${payment.status}`,
      type: "Payment",
      severity: payment.status === "failed" ? "high" : "medium",
      title:
        payment.status === "failed"
          ? "Payment failed"
          : "Payment awaiting collection",
      message: `${customerName}'s invoice ${payment.invoiceNumber || paymentId} is ${titleCaseStatus(payment.status).toLowerCase()}.`,
      actionLabel: "Open payment",
      path: `/admin/payments/${paymentId}`,
      createdAt: getBestDate(payment),
    });
  });

  vendors.forEach((vendor) => {
    const vendorId = vendor.vendorId || getId(vendor);
    if (!vendorId || !["draft", "submitted"].includes(vendor.verificationStatus)) {
      return;
    }

    const companyName =
      vendor.company?.name || vendor.account?.fullName || "Vendor partner";
    notifications.push({
      id: `vendor:${vendorId}:${vendor.verificationStatus}`,
      type: "Partner Application",
      severity: vendor.verificationStatus === "submitted" ? "medium" : "low",
      title:
        vendor.verificationStatus === "submitted"
          ? "Partner application ready for review"
          : "Partner onboarding draft saved",
      message: `${companyName} is waiting in the partner application queue.`,
      actionLabel: "Review application",
      path: `/admin/vendor-applications/${vendorId}`,
      createdAt: getBestDate(vendor),
    });
  });

  projects.forEach((project) => {
    const projectId = getId(project);
    if (!projectId || ["completed", "cancelled"].includes(project.status)) return;

    const title = project.customer?.fullName || project.title || "Solar project";
    notifications.push({
      id: `project:${projectId}:${project.status || "active"}`,
      type: "Project",
      severity: "low",
      title: "Active project needs monitoring",
      message: `${title} is currently ${titleCaseStatus(project.status || "active").toLowerCase()}.`,
      actionLabel: "Open project",
      path: `/admin/customers-projects/${projectId}`,
      createdAt: getBestDate(project),
    });
  });

  serviceRequests.forEach((request) => {
    const requestId = getId(request);
    if (!requestId || ["resolved", "cancelled"].includes(request.status)) return;

    notifications.push({
      id: `service:${requestId}:${request.status || "open"}`,
      type: "Service",
      severity: request.priority === "urgent" ? "high" : "medium",
      title: "Open customer service request",
      message: `${request.customer?.fullName || "Customer"} needs support for ${request.category || "service"}.`,
      actionLabel: "Open service",
      path: "/admin/services",
      createdAt: getBestDate(request),
    });
  });

  return notifications
    .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    .slice(0, 80);
}

export function decorateAdminNotifications(notifications, readIds) {
  return notifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id),
  }));
}

const READ_STORAGE_KEY = "sparkin.customer.notifications.read.v1";
export const CUSTOMER_NOTIFICATIONS_CHANGED =
  "sparkin:customer-notifications-changed";

function getId(item) {
  return item?.id || item?._id || item?.leadId || item?.projectId || "";
}

function getLeadId(item) {
  return item?.leadId || item?.lead?.id || item?.lead?._id || "";
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
    item?.createdAt ||
    new Date().toISOString()
  );
}

export function formatCustomerNotificationTime(value) {
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

export function readCustomerNotificationIds() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function writeCustomerNotificationIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(CUSTOMER_NOTIFICATIONS_CHANGED));
}

export function markCustomerNotificationsRead(notificationIds) {
  const readIds = readCustomerNotificationIds();
  notificationIds.forEach((id) => readIds.add(id));
  writeCustomerNotificationIds(readIds);
  return readIds;
}

export function buildCustomerNotifications(data = {}) {
  const notifications = [];
  const leads = data.leads || [];
  const quotes = data.quotes || [];
  const projects = data.projects || [];
  const payments = data.payments || [];

  // Individual quote notifications
  quotes.forEach((quote) => {
    const quoteId = getId(quote);
    const leadId = getLeadId(quote);
    if (!quoteId || quote.status === "withdrawn" || quote.status === "rejected")
      return;

    const vendorName = quote.vendorEmail?.split("@")[0] || "Vendor";
    const price = quote.pricing?.totalPrice || 0;

    if (quote.status === "submitted") {
      notifications.push({
        id: `quote:${quoteId}:received`,
        type: "Quote",
        severity: "high",
        title: `New quote from ${vendorName}`,
        message: `${vendorName} submitted a quote for ₹${price.toLocaleString("en-IN")}. Compare with other bids.`,
        actionLabel: "View quote",
        path: leadId
          ? `/quotes/compare?leadId=${leadId}`
          : `/select-vendor/${quoteId}`,
        createdAt: getBestDate(quote),
      });
    }

    if (quote.status === "accepted") {
      notifications.push({
        id: `quote:${quoteId}:accepted`,
        type: "Quote",
        severity: "medium",
        title: `Quote accepted: ${vendorName}`,
        message: `Your quote from ${vendorName} has been accepted. Project is being created.`,
        actionLabel: "View quote",
        path: leadId
          ? `/quotes/compare?leadId=${leadId}`
          : `/select-vendor/${quoteId}`,
        createdAt: getBestDate(quote),
      });
    }
  });

  // Individual project notifications
  projects.forEach((project) => {
    const projectId = getId(project);
    if (!projectId) return;

    const vendorName = project.vendorEmail?.split("@")[0] || "Vendor";

    if (project.status === "site_audit_pending") {
      notifications.push({
        id: `project:${projectId}:site-audit`,
        type: "Project",
        severity: "high",
        title: `Site audit scheduled`,
        message: `${vendorName} will visit your site for inspection. Be available on the scheduled date.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "design_approval_pending") {
      notifications.push({
        id: `project:${projectId}:design`,
        type: "Project",
        severity: "medium",
        title: `Design ready for approval`,
        message: `${vendorName} has prepared the design. Review and approve to proceed.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "installation_scheduled") {
      notifications.push({
        id: `project:${projectId}:installation`,
        type: "Project",
        severity: "medium",
        title: `Installation scheduled`,
        message: `${vendorName} has scheduled your installation. Check the details and confirm.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "installation_in_progress") {
      notifications.push({
        id: `project:${projectId}:in-progress`,
        type: "Project",
        severity: "medium",
        title: `Installation in progress`,
        message: `${vendorName} is currently installing your solar system. Track progress here.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "inspection_pending") {
      notifications.push({
        id: `project:${projectId}:inspection`,
        type: "Project",
        severity: "medium",
        title: `Inspection scheduled`,
        message: `Final inspection is scheduled for your installation. Ensure site is ready.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "activated") {
      notifications.push({
        id: `project:${projectId}:activated`,
        type: "Project",
        severity: "low",
        title: `System activated`,
        message: `Congratulations! Your solar system is now active and generating power.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "cancelled") {
      notifications.push({
        id: `project:${projectId}:cancelled`,
        type: "Project",
        severity: "high",
        title: `Project cancelled`,
        message: `Your project has been cancelled. A new vendor is being assigned.`,
        actionLabel: "View project",
        path: `/project/installation?projectId=${projectId}`,
        createdAt: getBestDate(project),
      });
    }
  });

  // Individual payment notifications
  payments.forEach((payment) => {
    const paymentId = getId(payment);
    if (!paymentId) return;

    if (payment.status === "pending") {
      notifications.push({
        id: `payment:${paymentId}:pending`,
        type: "Payment",
        severity: "medium",
        title: `Payment due: ₹${payment.amount?.toLocaleString("en-IN") || 0}`,
        message: `Invoice ${payment.invoiceNumber || paymentId} is due. Complete payment to proceed.`,
        actionLabel: "View payment",
        path: `/customer/projects`,
        createdAt: getBestDate(payment),
      });
    }

    if (payment.status === "overdue") {
      notifications.push({
        id: `payment:${paymentId}:overdue`,
        type: "Payment",
        severity: "high",
        title: `Payment overdue: ₹${payment.amount?.toLocaleString("en-IN") || 0}`,
        message: `Invoice ${payment.invoiceNumber || paymentId} is overdue. Please pay immediately.`,
        actionLabel: "View payment",
        path: `/customer/projects`,
        createdAt: getBestDate(payment),
      });
    }

    if (payment.status === "paid") {
      notifications.push({
        id: `payment:${paymentId}:paid`,
        type: "Payment",
        severity: "low",
        title: `Payment received: ₹${payment.amount?.toLocaleString("en-IN") || 0}`,
        message: `Thank you! Invoice ${payment.invoiceNumber || paymentId} has been received.`,
        actionLabel: "View payment",
        path: `/customer/projects`,
        createdAt: getBestDate(payment),
      });
    }
  });

  return notifications
    .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    .slice(0, 80);
}

export function decorateCustomerNotifications(notifications, readIds) {
  return notifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id),
  }));
}

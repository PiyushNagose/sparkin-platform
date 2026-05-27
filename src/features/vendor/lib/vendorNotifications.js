const READ_STORAGE_KEY = "sparkin.vendor.notifications.read.v1";
export const VENDOR_NOTIFICATIONS_CHANGED =
  "sparkin:vendor-notifications-changed";

function getId(item) {
  return item?.id || item?._id || item?.leadId || item?.projectId || "";
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

function titleCaseStatus(status = "") {
  return status
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatVendorNotificationTime(value) {
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

export function readVendorNotificationIds() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function writeVendorNotificationIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(VENDOR_NOTIFICATIONS_CHANGED));
}

export function markVendorNotificationsRead(notificationIds) {
  const readIds = readVendorNotificationIds();
  notificationIds.forEach((id) => readIds.add(id));
  writeVendorNotificationIds(readIds);
  return readIds;
}

export function buildVendorNotifications(data = {}) {
  const notifications = [];
  const leads = data.leads || [];
  const projects = data.projects || [];
  const payments = data.payments || [];

  // Individual lead notifications
  leads.forEach((lead) => {
    const leadId = getId(lead);
    if (!leadId) return;

    const customerName = lead.contact?.fullName || "Customer";
    const city =
      lead.installationAddress?.city ||
      lead.installationAddress?.district ||
      lead.installationAddress?.state ||
      "service area";

    // Lead assigned to vendor
    if (lead.status === "open_for_quotes") {
      notifications.push({
        id: `lead:${leadId}:assigned`,
        type: "Lead Assignment",
        severity: "high",
        title: `New lead: ${customerName}`,
        message: `${customerName} in ${city} is looking for solar installation. Review and submit your quote.`,
        actionLabel: "View lead",
        path: `/vendor/leads/${leadId}`,
        createdAt: getBestDate(lead),
      });
    }
  });

  // Individual project notifications
  projects.forEach((project) => {
    const projectId = getId(project);
    if (!projectId) return;

    const customerName = project.customer?.fullName || "Customer";

    if (project.status === "site_audit_pending") {
      notifications.push({
        id: `project:${projectId}:site-audit`,
        type: "Site Audit",
        severity: "high",
        title: `Site audit pending: ${customerName}`,
        message: `Schedule and complete the site visit for ${customerName}'s project.`,
        actionLabel: "View project",
        path: `/vendor/projects/${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "design_approval_pending") {
      notifications.push({
        id: `project:${projectId}:design`,
        type: "Design Approval",
        severity: "medium",
        title: `Design approval needed: ${customerName}`,
        message: `Submit design approval for ${customerName}'s solar system.`,
        actionLabel: "View project",
        path: `/vendor/projects/${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "installation_scheduled") {
      notifications.push({
        id: `project:${projectId}:installation`,
        type: "Installation",
        severity: "medium",
        title: `Installation scheduled: ${customerName}`,
        message: `Installation is scheduled for ${customerName}. Prepare your team.`,
        actionLabel: "View project",
        path: `/vendor/projects/${projectId}`,
        createdAt: getBestDate(project),
      });
    }

    if (project.status === "inspection_pending") {
      notifications.push({
        id: `project:${projectId}:inspection`,
        type: "Inspection",
        severity: "medium",
        title: `Inspection pending: ${customerName}`,
        message: `Schedule inspection for ${customerName}'s completed installation.`,
        actionLabel: "View project",
        path: `/vendor/projects/${projectId}`,
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
        title: `Payment pending: ₹${payment.amount?.toLocaleString("en-IN") || 0}`,
        message: `Invoice ${payment.invoiceNumber || paymentId} is awaiting payment.`,
        actionLabel: "View payment",
        path: `/vendor/payments/transactions/${paymentId}`,
        createdAt: getBestDate(payment),
      });
    }

    if (payment.status === "overdue") {
      notifications.push({
        id: `payment:${paymentId}:overdue`,
        type: "Payment",
        severity: "high",
        title: `Payment overdue: ₹${payment.amount?.toLocaleString("en-IN") || 0}`,
        message: `Invoice ${payment.invoiceNumber || paymentId} is overdue.`,
        actionLabel: "View payment",
        path: `/vendor/payments/transactions/${paymentId}`,
        createdAt: getBestDate(payment),
      });
    }
  });

  return notifications
    .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
    .slice(0, 80);
}

export function decorateVendorNotifications(notifications, readIds) {
  return notifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id),
  }));
}

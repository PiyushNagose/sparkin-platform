import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

let dashboardInFlight = null;

export const adminVendorsApi = {
  async listVendors(options = {}) {
    const { data } = await cachedGet(businessClient, "/vendors", options);
    return data.vendors;
  },

  async updateVendorStatus(vendorId, payload) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, payload);
    invalidateRequestCache((key) => key.includes("/vendors"));
    invalidateAdminDashboardData();
    return data.vendorProfile;
  },
};

export const platformSettingsApi = {
  async getSettings(options = {}) {
    const { data } = await cachedGet(businessClient, "/platform-settings", options);
    return data.settings;
  },

  async updateSettings(payload) {
    const { data } = await businessClient.patch("/platform-settings", payload);
    invalidateRequestCache("/platform-settings");
    return data.settings;
  },
};

export function invalidateAdminDashboardData() {
  dashboardInFlight = null;
}

export async function getAdminDashboardData(options = {}) {
  const { force = false } = options;

  if (!force && dashboardInFlight) {
    return dashboardInFlight;
  }

  const [leads, quotes, payments, projects, serviceRequests, vendors] =
    await (dashboardInFlight = Promise.all([
      leadsApi.listLeads(options),
      quotesApi.listQuotes({}, options),
      paymentsApi.listPayments(options),
      projectsApi.listProjects(options),
      serviceRequestsApi.listRequests(options),
      adminVendorsApi.listVendors(options),
    ]).finally(() => {
      dashboardInFlight = null;
    }));

  return {
    leads,
    quotes,
    payments,
    projects,
    serviceRequests,
    vendors,
  };
}

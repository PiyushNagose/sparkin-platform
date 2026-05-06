import { businessClient } from "@/shared/lib/http/businessClient";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

export const adminVendorsApi = {
  async listVendors() {
    const { data } = await businessClient.get("/vendors");
    return data.vendors;
  },

  async updateVendorStatus(vendorId, payload) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, payload);
    return data.vendorProfile;
  },
};

export const platformSettingsApi = {
  async getSettings() {
    const { data } = await businessClient.get("/platform-settings");
    return data.settings;
  },

  async updateSettings(payload) {
    const { data } = await businessClient.patch("/platform-settings", payload);
    return data.settings;
  },
};

export async function getAdminDashboardData() {
  const [leads, quotes, payments, projects, serviceRequests, vendors] =
    await Promise.all([
      leadsApi.listLeads(),
      quotesApi.listQuotes(),
      paymentsApi.listPayments(),
      projectsApi.listProjects(),
      serviceRequestsApi.listRequests(),
      adminVendorsApi.listVendors(),
    ]);

  return {
    leads,
    quotes,
    payments,
    projects,
    serviceRequests,
    vendors,
  };
}

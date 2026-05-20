import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";
import { leadsApi, quotesApi } from "@/features/public/api/leadsApi";
import { paymentsApi } from "@/features/public/api/paymentsApi";
import { projectsApi } from "@/features/public/api/projectsApi";
import { serviceRequestsApi } from "@/features/public/api/serviceRequestsApi";

let dashboardInFlight = null;
let dashboardCache = null;
let dashboardCacheExpiresAt = 0;
const DASHBOARD_CACHE_TTL_MS = 30_000;

function readArrayResult(result, fallback = []) {
  if (result.status !== "fulfilled") {
    return fallback;
  }

  return Array.isArray(result.value) ? result.value : fallback;
}

function readErrorMessage(result) {
  if (result.status === "fulfilled") {
    return "";
  }

  return (
    result.reason?.response?.data?.message ||
    result.reason?.message ||
    "Service unavailable"
  );
}

export const adminVendorsApi = {
  async listVendors(options = {}) {
    const { data } = await cachedGet(businessClient, "/vendors", options);
    return data.vendors || [];
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
  dashboardCache = null;
  dashboardCacheExpiresAt = 0;
}

export function getCachedAdminDashboardData() {
  return dashboardCache;
}

export async function getAdminDashboardData(options = {}) {
  const {
    force = false,
    ttlMs = DASHBOARD_CACHE_TTL_MS,
  } = options;

  if (!force && dashboardCache && dashboardCacheExpiresAt > Date.now()) {
    return dashboardCache;
  }

  if (dashboardInFlight) {
    return dashboardInFlight;
  }

  dashboardInFlight = Promise.allSettled([
      leadsApi.listLeads(options),
      quotesApi.listQuotes({}, options),
      paymentsApi.listPayments(options),
      projectsApi.listProjects(options),
      serviceRequestsApi.listRequests(options),
      adminVendorsApi.listVendors(options),
    ])
    .then(([leads, quotes, payments, projects, serviceRequests, vendors]) => {
      const data = {
        leads: readArrayResult(leads),
        quotes: readArrayResult(quotes),
        payments: readArrayResult(payments),
        projects: readArrayResult(projects),
        serviceRequests: readArrayResult(serviceRequests),
        vendors: readArrayResult(vendors),
        sourceErrors: {
          leads: readErrorMessage(leads),
          quotes: readErrorMessage(quotes),
          payments: readErrorMessage(payments),
          projects: readErrorMessage(projects),
          serviceRequests: readErrorMessage(serviceRequests),
          vendors: readErrorMessage(vendors),
        },
      };

      dashboardCache = data;
      dashboardCacheExpiresAt = Date.now() + ttlMs;
      return data;
    })
    .finally(() => {
      dashboardInFlight = null;
    });

  return dashboardInFlight;
}

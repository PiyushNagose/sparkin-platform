import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

export const vendorApplicationsApi = {
  /**
   * List all vendor profiles (admin only).
   * Returns all vendors regardless of status — we filter client-side for pagination
   * since the backend doesn't support paginated vendor listing yet.
   */
  async list(options = {}) {
    const { data } = await cachedGet(businessClient, "/vendors", options);
    return data.vendors || [];
  },

  /**
   * Get a single vendor profile by vendorId.
   */
  async getById(vendorId, options = {}) {
    const { data } = await cachedGet(businessClient, `/vendors/${vendorId}`, options);
    return data.vendorProfile || data;
  },

  /**
   * Approve a vendor application (set verificationStatus to "verified").
   */
  async approve(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "verified",
    });
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },

  /**
   * Reject a vendor application (set verificationStatus to "rejected").
   */
  async reject(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "rejected",
    });
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },

  /**
   * Move back to submitted (under review).
   */
  async setUnderReview(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "submitted",
    });
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },
};

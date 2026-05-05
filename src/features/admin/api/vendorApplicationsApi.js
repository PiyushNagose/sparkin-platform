import { businessClient } from "@/shared/lib/http/businessClient";

export const vendorApplicationsApi = {
  /**
   * List all vendor profiles (admin only).
   * Returns all vendors regardless of status — we filter client-side for pagination
   * since the backend doesn't support paginated vendor listing yet.
   */
  async list() {
    const { data } = await businessClient.get("/vendors");
    return data.vendors || [];
  },

  /**
   * Get a single vendor profile by vendorId.
   */
  async getById(vendorId) {
    const { data } = await businessClient.get(`/vendors/${vendorId}`);
    return data.vendorProfile || data;
  },

  /**
   * Approve a vendor application (set verificationStatus to "verified").
   */
  async approve(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "verified",
    });
    return data.vendorProfile;
  },

  /**
   * Reject a vendor application (set verificationStatus to "rejected").
   */
  async reject(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "rejected",
    });
    return data.vendorProfile;
  },

  /**
   * Move back to submitted (under review).
   */
  async setUnderReview(vendorId) {
    const { data } = await businessClient.patch(`/vendors/${vendorId}/status`, {
      verificationStatus: "submitted",
    });
    return data.vendorProfile;
  },
};

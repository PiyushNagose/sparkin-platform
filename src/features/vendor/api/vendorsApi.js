import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet, invalidateRequestCache } from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const vendorsApi = {
  async getMyProfile(options = {}) {
    const { data } = await cachedGet(businessClient, "/vendors/me", options);
    return data.vendorProfile;
  },

  async updateMyProfile(payload) {
    const { data } = await businessClient.patch("/vendors/me", payload);
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },

  async uploadDocument(payload) {
    const { data } = await businessClient.post("/vendors/me/documents", payload);
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },

  async deleteDocument(documentId) {
    const { data } = await businessClient.delete(`/vendors/me/documents/${requireId(documentId, "Document id")}`);
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },

  async submitApplication() {
    const { data } = await businessClient.post("/vendors/me/submit");
    invalidateRequestCache((key) => key.includes("/vendors"));
    return data.vendorProfile;
  },
};

import { businessClient } from "@/shared/lib/http/businessClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const vendorsApi = {
  async getMyProfile() {
    const { data } = await businessClient.get("/vendors/me");
    return data.vendorProfile;
  },

  async updateMyProfile(payload) {
    const { data } = await businessClient.patch("/vendors/me", payload);
    return data.vendorProfile;
  },

  async uploadDocument(payload) {
    const { data } = await businessClient.post("/vendors/me/documents", payload);
    return data.vendorProfile;
  },

  async deleteDocument(documentId) {
    const { data } = await businessClient.delete(`/vendors/me/documents/${requireId(documentId, "Document id")}`);
    return data.vendorProfile;
  },

  async submitApplication() {
    const { data } = await businessClient.post("/vendors/me/submit");
    return data.vendorProfile;
  },
};

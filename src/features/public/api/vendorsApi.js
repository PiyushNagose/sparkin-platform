import { businessClient } from "@/shared/lib/http/businessClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const publicVendorsApi = {
  async listFeaturedVendors() {
    const { data } = await businessClient.get("/vendors/public/featured");
    return data.vendors;
  },

  async getVendorProfile(vendorId) {
    const { data } = await businessClient.get(`/vendors/${requireId(vendorId, "Vendor id")}`);
    return data.vendorProfile;
  },
};

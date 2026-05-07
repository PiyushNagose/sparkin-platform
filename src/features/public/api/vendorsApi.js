import { businessClient } from "@/shared/lib/http/businessClient";
import { cachedGet } from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const publicVendorsApi = {
  async listFeaturedVendors(options = {}) {
    const { data } = await cachedGet(businessClient, "/vendors/public/featured", options);
    return data.vendors;
  },

  async getVendorProfile(vendorId, options = {}) {
    const { data } = await cachedGet(
      businessClient,
      `/vendors/public/${requireId(vendorId, "Vendor id")}`,
      options,
    );
    return data.vendorProfile;
  },
};

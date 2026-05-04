import { VendorProfileModel } from "./vendor-profile.model.js";

function normalizeVendorProfile(profile) {
  const value = profile?.toObject ? profile.toObject() : profile;

  if (!value) {
    return value;
  }

  return {
    ...value,
    id: value.id || value._id?.toString(),
    documents: (value.documents || []).map((document) => ({
      ...document,
      id: document.id || document._id?.toString(),
    })),
  };
}

export const vendorsRepository = {
  async listFeatured(limit = 6) {
    const profiles = await VendorProfileModel.find({
      verificationStatus: { $in: ["submitted", "verified"] },
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean({ virtuals: true });

    return profiles.map((profile) => normalizeVendorProfile(profile));
  },

  async findAll() {
    const profiles = await VendorProfileModel.find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean({ virtuals: true });

    return profiles.map((profile) => normalizeVendorProfile(profile));
  },

  async findByVendorId(vendorId) {
    const profile = await VendorProfileModel.findOne({ vendorId }).lean({ virtuals: true });
    return normalizeVendorProfile(profile);
  },

  async create(profile) {
    const created = await VendorProfileModel.create(profile);
    return normalizeVendorProfile(created);
  },

  async updateByVendorId(vendorId, patch) {
    const updated = await VendorProfileModel.findOneAndUpdate(
      { vendorId },
      { $set: patch },
      { new: true, runValidators: true },
    ).lean({ virtuals: true });

    return normalizeVendorProfile(updated);
  },

  async addDocument(vendorId, document) {
    const updated = await VendorProfileModel.findOneAndUpdate(
      { vendorId },
      { $push: { documents: document } },
      { new: true, runValidators: true },
    ).lean({ virtuals: true });

    return normalizeVendorProfile(updated);
  },

  async removeDocument(vendorId, documentId) {
    const updated = await VendorProfileModel.findOneAndUpdate(
      { vendorId },
      { $pull: { documents: { _id: documentId } } },
      { new: true, runValidators: true },
    ).lean({ virtuals: true });

    return normalizeVendorProfile(updated);
  },
};

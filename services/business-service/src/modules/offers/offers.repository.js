import { OfferModel } from "./offer.model.js";

function normalize(doc) {
  const value = doc?.toObject ? doc.toObject() : doc;
  if (!value) return value;
  return { ...value, id: value.id || value._id?.toString() };
}

function normalizeMany(docs) {
  return docs.map(normalize);
}

export const offersRepository = {
  async create(data) {
    const created = await OfferModel.create(data);
    return normalize(created);
  },

  async findAll({ page = 1, limit = 10, status, search } = {}) {
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { couponCode: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const [offers, total] = await Promise.all([
      OfferModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      OfferModel.countDocuments(filter),
    ]);
    return { offers: normalizeMany(offers), total };
  },

  async findPublicActive({ limit = 3 } = {}) {
    const now = new Date();
    const offers = await OfferModel.find({
      status: "active",
      campaignType: "public",
      validFrom: { $lte: now },
      validTo: { $gte: now },
    })
      .sort({ usedCount: -1, createdAt: -1 })
      .limit(limit)
      .lean({ virtuals: true });

    return normalizeMany(offers);
  },

  async findById(id) {
    const doc = await OfferModel.findById(id).lean({ virtuals: true });
    return normalize(doc);
  },

  async findByOfferId(offerId) {
    const doc = await OfferModel.findOne({ offerId }).lean({ virtuals: true });
    return normalize(doc);
  },

  async findByCouponCode(code) {
    const doc = await OfferModel.findOne({
      couponCode: code.toUpperCase(),
    }).lean({ virtuals: true });
    return normalize(doc);
  },

  async update(id, data) {
    const doc = await OfferModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async incrementUsage(id) {
    const doc = await OfferModel.findByIdAndUpdate(
      id,
      { $inc: { usedCount: 1 } },
      { new: true },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async delete(id) {
    await OfferModel.findByIdAndDelete(id);
  },

  async getStats() {
    const now = new Date();
    const [active, total, totalRedemptions] = await Promise.all([
      OfferModel.countDocuments({ status: "active", validTo: { $gte: now } }),
      OfferModel.countDocuments({}),
      OfferModel.aggregate([
        { $group: { _id: null, sum: { $sum: "$usedCount" } } },
      ]),
    ]);
    return {
      activeCount: active,
      totalCount: total,
      totalRedemptions: totalRedemptions[0]?.sum || 0,
    };
  },
};

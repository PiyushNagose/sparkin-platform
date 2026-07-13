import { BroadcastModel } from "./broadcast.model.js";

function normalize(doc) {
  const value = doc?.toObject ? doc.toObject() : doc;
  if (!value) return value;
  return { ...value, id: value.id || value._id?.toString() };
}

function normalizeMany(docs) {
  return docs.map(normalize);
}

export const broadcastsRepository = {
  async create(data) {
    const created = await BroadcastModel.create(data);
    return normalize(created);
  },

  async findAll({ page = 1, limit = 10, status } = {}) {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [broadcasts, total] = await Promise.all([
      BroadcastModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      BroadcastModel.countDocuments(filter),
    ]);
    return { broadcasts: normalizeMany(broadcasts), total };
  },

  async findById(id) {
    const doc = await BroadcastModel.findById(id).lean({ virtuals: true });
    return normalize(doc);
  },

  async findByBroadcastId(broadcastId) {
    const doc = await BroadcastModel.findOne({ broadcastId }).lean({
      virtuals: true,
    });
    return normalize(doc);
  },

  async updateStatus(id, status, extra = {}) {
    const doc = await BroadcastModel.findByIdAndUpdate(
      id,
      { $set: { status, ...extra } },
      { returnDocument: "after" },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async update(id, data) {
    const doc = await BroadcastModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after" },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async delete(id) {
    await BroadcastModel.findByIdAndDelete(id);
  },
};

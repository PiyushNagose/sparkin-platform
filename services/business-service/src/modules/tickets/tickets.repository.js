import { TicketModel } from "./ticket.model.js";

function normalize(doc) {
  const value = doc?.toObject ? doc.toObject() : doc;
  if (!value) return value;
  return { ...value, id: value.id || value._id?.toString() };
}

function normalizeMany(docs) {
  return docs.map(normalize);
}

export const ticketsRepository = {
  async create(data) {
    const created = await TicketModel.create(data);
    return normalize(created);
  },

  async findAll({ page = 1, limit = 20, status, priority, search } = {}) {
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { issueType: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      TicketModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      TicketModel.countDocuments(filter),
    ]);
    return { tickets: normalizeMany(tickets), total };
  },

  async findById(id) {
    const doc = await TicketModel.findById(id).lean({ virtuals: true });
    return normalize(doc);
  },

  async findByTicketId(ticketId) {
    const doc = await TicketModel.findOne({ ticketId }).lean({
      virtuals: true,
    });
    return normalize(doc);
  },

  async update(id, data) {
    const doc = await TicketModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async addMessage(id, message) {
    const doc = await TicketModel.findByIdAndUpdate(
      id,
      { $push: { messages: message } },
      { new: true },
    ).lean({ virtuals: true });
    return normalize(doc);
  },

  async delete(id) {
    await TicketModel.findByIdAndDelete(id);
  },
};

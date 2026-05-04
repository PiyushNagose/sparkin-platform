import { LeadModel } from "./lead.model.js";

function normalizeLead(lead) {
  const value = lead?.toObject ? lead.toObject() : lead;

  if (!value) {
    return value;
  }

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

function normalizeLeads(leads) {
  return leads.map((lead) => normalizeLead(lead));
}

export const leadsRepository = {
  async createLead(lead) {
    const created = await LeadModel.create(lead);
    return normalizeLead(created);
  },

  async findLeadsForCustomer(customerId) {
    const leads = await LeadModel.find({ customerId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeLeads(leads);
  },

  async findAll() {
    const leads = await LeadModel.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeLeads(leads);
  },

  async findLeadById(id) {
    const lead = await LeadModel.findById(id).lean({ virtuals: true });
    return normalizeLead(lead);
  },

  async findLeadsByIds(ids) {
    const leads = await LeadModel.find({ _id: { $in: ids } }).lean({ virtuals: true });
    return normalizeLeads(leads);
  },

  async findVendorVisibleLeads() {
    const leads = await LeadModel.find({ status: { $in: ["submitted", "reviewing", "open_for_quotes"] } })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return normalizeLeads(leads);
  },

  async markOpenForQuotes(id) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { status: "open_for_quotes" } },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async updateStatus(id, status) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async markQuoteSelected(id, selection) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "quote_selected",
          selection,
        },
      },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },
};

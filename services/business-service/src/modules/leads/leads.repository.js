import { LeadModel } from "./lead.model.js";

const LIST_QUERY_MAX_TIME_MS = 8_000;
const LEAD_LIST_PROJECTION = {
  "attachments.roofPhotos.dataUrl": 0,
  "attachments.electricityBill.dataUrl": 0,
  "attachments.photoId.dataUrl": 0,
};

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

function stripAttachmentBodies(lead) {
  if (!lead?.attachments) return lead;

  const stripFiles = (files = []) =>
    files.map(({ dataUrl, ...file }) => ({
      ...file,
      hasData: Boolean(dataUrl),
    }));

  return {
    ...lead,
    attachments: {
      roofPhotos: stripFiles(lead.attachments.roofPhotos),
      electricityBill: stripFiles(lead.attachments.electricityBill),
      photoId: stripFiles(lead.attachments.photoId),
    },
  };
}

function normalizeLeanList(leads) {
  return normalizeLeads(leads).map(stripAttachmentBodies);
}

export const leadsRepository = {
  async createLead(lead) {
    const created = await LeadModel.create(lead);
    return normalizeLead(created);
  },

  async findLeadsForCustomer(customerId) {
    const leads = await LeadModel.find({ customerId })
      .select(LEAD_LIST_PROJECTION)
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeLeanList(leads);
  },

  async findAll() {
    const leads = await LeadModel.find({})
      .select(LEAD_LIST_PROJECTION)
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });
    return normalizeLeanList(leads);
  },

  async findLeadById(id) {
    const lead = await LeadModel.findById(id).lean({ virtuals: true });
    return normalizeLead(lead);
  },

  async findLeadsByIds(ids) {
    const leads = await LeadModel.find({ _id: { $in: ids } })
      .select(LEAD_LIST_PROJECTION)
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({
        virtuals: true,
      });
    return normalizeLeanList(leads);
  },

  async findVendorVisibleLeads(vendorId) {
    // Show leads where this vendor is explicitly assigned
    // Include vendors_assigned status so vendors can see leads even before payment
    const leads = await LeadModel.find({
      status: {
        $in: ["vendors_assigned", "open_for_quotes", "quote_selected"],
      },
      assignedVendorIds: vendorId,
    })
      .select(LEAD_LIST_PROJECTION)
      .sort({ createdAt: -1 })
      .maxTimeMS(LIST_QUERY_MAX_TIME_MS)
      .lean({ virtuals: true });

    return normalizeLeanList(leads);
  },

  async markOpenForQuotes(id) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { status: "open_for_quotes", verifiedAt: new Date() } },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async assignVendors(id, vendorIds, biddingMeta = {}) {
    const nextStatus = biddingMeta.status || "vendors_assigned";
    const { status, ...meta } = biddingMeta;
    const updates = {
      assignedVendorIds: vendorIds,
      vendorsAssignedAt: new Date(),
      verifiedAt: new Date(),
      status: nextStatus,
      ...meta,
    };

    if (nextStatus === "open_for_quotes") {
      updates.selection = { quoteId: null, vendorId: null, selectedAt: null };
    }

    const lead = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async updateStatus(id, status) {
    const extra =
      status === "verified" || status === "open_for_quotes"
        ? { verifiedAt: new Date() }
        : {};
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { status, ...extra } },
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

  async updateDetails(id, updates) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async markCommitmentPaid(id) {
    const paidAt = new Date();
    const update = {
      commitmentFeePaid: true,
      commitmentFeePaidAt: paidAt,
    };
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  // Rollback: revert a lead from "quote_selected" back to "open_for_quotes".
  // Called when project creation fails after quote acceptance.
  async revertQuoteSelection(id) {
    const lead = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "open_for_quotes",
          selection: { quoteId: null, vendorId: null, selectedAt: null },
        },
      },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async rejectLead(id, rejectionData = {}) {
    const { rejectedBy, reason, rejectedByRole = "admin" } = rejectionData;

    const lead = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "rejected",
        },
        $push: {
          rejectionHistory: {
            rejectedAt: new Date(),
            rejectedBy,
            reason: reason || null,
            rejectedByRole,
          },
        },
      },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },

  async reassignLeadToVendor(id, vendorIds, reassignmentData = {}) {
    const { reassignedBy, reassignmentReason = null } = reassignmentData;

    const lead = await LeadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "vendors_assigned",
          assignedVendorIds: vendorIds,
          vendorsAssignedAt: new Date(),
          // Reset selection when reassigning
          selection: { quoteId: null, vendorId: null, selectedAt: null },
        },
        $push: {
          rejectionHistory: {
            rejectedAt: new Date(),
            rejectedBy: reassignedBy,
            reason: reassignmentReason,
            rejectedByRole: "admin",
          },
        },
      },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeLead(lead);
  },
};

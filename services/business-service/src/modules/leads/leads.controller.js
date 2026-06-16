import { leadsService } from "./leads.service.js";

function emitLeadUpdate(io, lead, eventType = "lead:updated") {
  if (!io) return;
  // Emit to all connected users
  io.emit(eventType, { lead, timestamp: new Date().toISOString() });
  // Also emit to specific lead (if subscribed)
  io.to(`lead:${lead.id}`).emit(eventType, {
    lead,
    timestamp: new Date().toISOString(),
  });
}

export const leadsController = {
  async create(req, res) {
    const lead = await leadsService.createLead(req.auth, req.body);
    emitLeadUpdate(req.io, lead, "lead:created");
    res.status(201).json({ lead });
  },

  async analyzeRoof(req, res) {
    const analysis = await leadsService.analyzeRoof(req.auth, req.body);
    res.status(200).json({ analysis });
  },

  async list(req, res) {
    const leads = await leadsService.listLeads(req.auth);
    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const total = leads.length;
      const start = (page - 1) * limit;
      const paginated = leads.slice(start, start + limit);
      return res.status(200).json({
        leads: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    res.status(200).json({ leads });
  },

  async getById(req, res) {
    const lead = await leadsService.getLead(req.auth, req.params.leadId);
    res.status(200).json({ lead });
  },

  async updateStatus(req, res) {
    const lead = await leadsService.updateLeadStatus(
      req.auth,
      req.params.leadId,
      req.body,
    );
    emitLeadUpdate(req.io, lead, "lead:statusChanged");
    res.status(200).json({ lead });
  },

  async updateDetails(req, res) {
    const lead = await leadsService.updateDetails(
      req.auth,
      req.params.leadId,
      req.body,
    );
    emitLeadUpdate(req.io, lead, "lead:detailsUpdated");
    res.status(200).json({ lead });
  },

  async markCommitmentPaid(req, res) {
    const lead = await leadsService.markCommitmentPaid(
      req.auth,
      req.params.leadId,
    );
    emitLeadUpdate(req.io, lead, "lead:commitmentPaid");
    res.status(200).json({ lead });
  },

  async assignVendors(req, res) {
    const lead = await leadsService.assignVendors(
      req.auth,
      req.params.leadId,
      req.body,
    );
    emitLeadUpdate(req.io, lead, "lead:vendorsAssigned");
    res.status(200).json({ lead });
  },

  async rejectLead(req, res) {
    const lead = await leadsService.rejectLead(
      req.auth,
      req.params.leadId,
      req.body,
    );
    emitLeadUpdate(req.io, lead, "lead:rejected");
    res.status(200).json({ lead });
  },

  async reassignLead(req, res) {
    const lead = await leadsService.reassignLeadToVendors(
      req.auth,
      req.params.leadId,
      req.body,
    );
    emitLeadUpdate(req.io, lead, "lead:reassigned");
    res.status(200).json({ lead });
  },
};

import { leadsService } from "./leads.service.js";

export const leadsController = {
  async create(req, res) {
    const lead = await leadsService.createLead(req.auth, req.body);
    res.status(201).json({ lead });
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
    res.status(200).json({ lead });
  },

  async updateDetails(req, res) {
    const lead = await leadsService.updateDetails(
      req.auth,
      req.params.leadId,
      req.body,
    );
    res.status(200).json({ lead });
  },

  async markCommitmentPaid(req, res) {
    const lead = await leadsService.markCommitmentPaid(
      req.auth,
      req.params.leadId,
    );
    res.status(200).json({ lead });
  },

  async assignVendors(req, res) {
    const lead = await leadsService.assignVendors(
      req.auth,
      req.params.leadId,
      req.body,
    );
    res.status(200).json({ lead });
  },
};

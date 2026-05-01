import { leadsService } from "./leads.service.js";

export const leadsController = {
  async create(req, res) {
    const lead = await leadsService.createLead(req.auth, req.body);
    res.status(201).json({ lead });
  },

  async list(req, res) {
    const leads = await leadsService.listLeads(req.auth);
    res.status(200).json({ leads });
  },

  async getById(req, res) {
    const lead = await leadsService.getLead(req.auth, req.params.leadId);
    res.status(200).json({ lead });
  },

  async updateStatus(req, res) {
    const lead = await leadsService.updateLeadStatus(req.auth, req.params.leadId, req.body);
    res.status(200).json({ lead });
  },
};

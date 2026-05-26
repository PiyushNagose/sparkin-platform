import { projectsService } from "./projects.service.js";

export const projectsController = {
  async createFromAcceptedQuote(req, res) {
    const project = await projectsService.createFromAcceptedQuote(
      req.auth,
      req.body,
    );
    res.status(201).json({ project });
  },

  async createManual(req, res) {
    const project = await projectsService.createManualProject(
      req.auth,
      req.body,
    );
    res.status(201).json({ project });
  },

  async list(req, res) {
    const projects = await projectsService.listProjects(req.auth);
    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const total = projects.length;
      const start = (page - 1) * limit;
      const paginated = projects.slice(start, start + limit);
      return res.status(200).json({
        projects: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    res.status(200).json({ projects });
  },

  async getById(req, res) {
    const project = await projectsService.getProject(
      req.auth,
      req.params.projectId,
    );
    res.status(200).json({ project });
  },

  async updateMilestone(req, res) {
    const project = await projectsService.updateMilestone(
      req.auth,
      req.params.projectId,
      req.body,
    );
    res.status(200).json({ project });
  },

  async sendSiteVisitReminder(req, res) {
    const project = await projectsService.sendSiteVisitReminder(
      req.auth,
      req.params.projectId,
      req.body,
    );
    res.status(200).json({ project });
  },

  async submitOnboarding(req, res) {
    const project = await projectsService.submitOnboarding(
      req.auth,
      req.params.projectId,
      req.body,
    );
    res.status(200).json({ project });
  },

  async uploadDocument(req, res) {
    const project = await projectsService.uploadDocument(
      req.auth,
      req.params.projectId,
      req.body,
    );
    res.status(201).json({ project });
  },

  async reassignVendor(req, res) {
    const project = await projectsService.reassignVendor(
      req.auth,
      req.params.projectId,
      req.body,
    );
    res.status(201).json({ project });
  },
};

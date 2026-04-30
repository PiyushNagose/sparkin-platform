import { projectsService } from "./projects.service.js";

export const projectsController = {
  async createFromAcceptedQuote(req, res) {
    const project = await projectsService.createFromAcceptedQuote(req.auth, req.body);
    res.status(201).json({ project });
  },

  async list(req, res) {
    const projects = await projectsService.listProjects(req.auth);
    res.status(200).json({ projects });
  },

  async getById(req, res) {
    const project = await projectsService.getProject(req.auth, req.params.projectId);
    res.status(200).json({ project });
  },

  async updateMilestone(req, res) {
    const project = await projectsService.updateMilestone(req.auth, req.params.projectId, req.body);
    res.status(200).json({ project });
  },

  async submitOnboarding(req, res) {
    const project = await projectsService.submitOnboarding(req.auth, req.params.projectId, req.body);
    res.status(200).json({ project });
  },
};

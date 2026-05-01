import { ProjectModel } from "./project.model.js";

function normalizeProject(project) {
  const value = project?.toObject ? project.toObject() : project;

  if (!value) {
    return value;
  }

  return {
    ...value,
    id: value.id || value._id?.toString(),
    documents: (value.documents || []).map((document) => ({
      ...document,
      id: document.id || document._id?.toString(),
    })),
  };
}

function normalizeProjects(projects) {
  return projects.map((project) => normalizeProject(project));
}

export const projectsRepository = {
  async createProject(project) {
    const created = await ProjectModel.create(project);
    return normalizeProject(created);
  },

  async findByQuoteId(quoteId) {
    const project = await ProjectModel.findOne({ quoteId }).lean({ virtuals: true });
    return normalizeProject(project);
  },

  async findById(projectId) {
    const project = await ProjectModel.findById(projectId).lean({ virtuals: true });
    return normalizeProject(project);
  },

  async findByIds(projectIds) {
    const projects = await ProjectModel.find({ _id: { $in: projectIds } }).lean({ virtuals: true });
    return normalizeProjects(projects);
  },

  async findForCustomer(customerId) {
    const projects = await ProjectModel.find({ customerId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeProjects(projects);
  },

  async findForVendor(vendorId) {
    const projects = await ProjectModel.find({ vendorId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeProjects(projects);
  },

  async findAll() {
    const projects = await ProjectModel.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeProjects(projects);
  },

  async updateProject(projectId, updates) {
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: updates },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeProject(project);
  },

  async addDocument(projectId, document) {
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $push: { documents: document } },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeProject(project);
  },
};

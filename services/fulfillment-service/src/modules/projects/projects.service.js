import mongoose from "mongoose";
import { AppError } from "../../common/errors/app-error.js";
import { paymentsService } from "../payments/payments.service.js";
import { projectsRepository } from "./projects.repository.js";

const initialMilestones = [
  { key: "site_visit", title: "Site Visit", status: "in_progress", completedAt: null },
  { key: "design_approval", title: "Design Approval", status: "pending", completedAt: null },
  { key: "installation", title: "Installation", status: "pending", completedAt: null },
  { key: "inspection", title: "Inspection", status: "pending", completedAt: null },
  { key: "activation", title: "Activation", status: "pending", completedAt: null },
];

function getSiteAuditDueAt() {
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 2);
  return dueAt;
}

function canViewProject(user, project) {
  return (
    user.role === "admin" ||
    project.customerId === user.userId ||
    project.vendorId === user.userId
  );
}

function canManageProject(user, project) {
  return user.role === "admin" || project.vendorId === user.userId;
}

function getStatusForMilestones(milestones) {
  const active = milestones.find((milestone) => milestone.status === "in_progress");

  if (milestones.every((milestone) => milestone.status === "completed")) {
    return "completed";
  }

  if (!active) {
    return "site_audit_pending";
  }

  const statusByMilestone = {
    site_visit: "site_audit_pending",
    design_approval: "design_approval_pending",
    installation: "installation_in_progress",
    inspection: "inspection_pending",
    activation: "activated",
  };

  return statusByMilestone[active.key] ?? "site_audit_pending";
}

function applyMilestoneStatus(project, milestoneKey, status) {
  const milestoneIndex = project.milestones.findIndex((milestone) => milestone.key === milestoneKey);

  if (milestoneIndex === -1) {
    throw new AppError(400, "Invalid project milestone");
  }

  return project.milestones.map((milestone, index) => {
    if (index < milestoneIndex) {
      return {
        ...milestone,
        status: "completed",
        completedAt: milestone.completedAt ?? new Date(),
      };
    }

    if (index === milestoneIndex) {
      return {
        ...milestone,
        status,
        completedAt: status === "completed" ? new Date() : null,
      };
    }

    if (status === "completed" && index === milestoneIndex + 1) {
      return {
        ...milestone,
        status: "in_progress",
        completedAt: null,
      };
    }

    return {
      ...milestone,
      status: "pending",
      completedAt: null,
    };
  });
}

export const projectsService = {
  async createFromAcceptedQuote(user, input) {
    const { lead, quote } = input;
    const isOwner = user.role === "admin" || lead.customerId === user.userId;

    if (!isOwner) {
      throw new AppError(403, "You can only create projects for your own accepted quote");
    }

    const existingProject = await projectsRepository.findByQuoteId(quote.id);

    if (existingProject) {
      return existingProject;
    }

    const project = await projectsRepository.createProject({
      leadId: lead.id,
      quoteId: quote.id,
      customerId: lead.customerId,
      vendorId: quote.vendorId,
      vendorEmail: quote.vendorEmail ?? null,
      customer: {
        fullName: lead.contact.fullName,
        phoneNumber: lead.contact.phoneNumber,
        email: lead.contact.email ?? null,
      },
      installationAddress: lead.installationAddress,
      status: "site_audit_pending",
      system: quote.system,
      pricing: quote.pricing,
      timeline: {
        installationWindow: quote.timeline.installationWindow,
        siteAuditDueAt: getSiteAuditDueAt(),
      },
      milestones: initialMilestones,
      createdFromQuoteAt: new Date(),
    });

    await paymentsService.createScheduleForProject(project);

    return project;
  },

  async listProjects(user) {
    if (user.role === "admin") {
      return projectsRepository.findAll();
    }

    if (user.role === "vendor") {
      return projectsRepository.findForVendor(user.userId);
    }

    return projectsRepository.findForCustomer(user.userId);
  },

  async getProject(user, projectId) {
    if (!mongoose.isValidObjectId(projectId)) {
      throw new AppError(400, "Invalid project id");
    }

    const project = await projectsRepository.findById(projectId);

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    if (!canViewProject(user, project)) {
      throw new AppError(403, "You do not have access to this project");
    }

    return project;
  },

  async updateMilestone(user, projectId, input) {
    const project = await this.getProject(user, projectId);

    if (!canManageProject(user, project)) {
      throw new AppError(403, "Only the assigned vendor can update this project");
    }

    if (project.status === "cancelled") {
      throw new AppError(409, "Cancelled projects cannot be updated");
    }

    const milestones = applyMilestoneStatus(project, input.milestoneKey, input.status);
    const status = getStatusForMilestones(milestones);

    return projectsRepository.updateProject(projectId, {
      milestones,
      status,
    });
  },
};

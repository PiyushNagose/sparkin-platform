import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
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
const allowedDocumentTypes = new Map([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxDocumentBytes = 5 * 1024 * 1024;

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

function decodeDocument(input) {
  const extension = allowedDocumentTypes.get(input.mimeType);

  if (!extension) {
    throw new AppError(400, "Only PDF, JPG, PNG, or WEBP documents are supported");
  }

  const base64 = input.data.includes(",") ? input.data.split(",").at(-1) : input.data;
  const buffer = Buffer.from(base64, "base64");

  if (!buffer.length || buffer.length > maxDocumentBytes) {
    throw new AppError(400, "Document must be smaller than 5MB");
  }

  return { buffer, extension };
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
      source: "accepted_quote",
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

  async createManualProject(user, input) {
    if (user.role !== "vendor" && user.role !== "admin") {
      throw new AppError(403, "Only vendors can create manual projects");
    }

    const now = Date.now();
    const manualProjectKey = `manual:${user.userId}:${now}`;
    const project = await projectsRepository.createProject({
      leadId: manualProjectKey,
      quoteId: manualProjectKey,
      source: "vendor_manual",
      customerId: `manual:${user.userId}:${input.customer.phoneNumber}`,
      vendorId: user.userId,
      vendorEmail: user.email ?? null,
      customer: {
        fullName: input.customer.fullName,
        phoneNumber: input.customer.phoneNumber,
        email: input.customer.email ?? null,
      },
      installationAddress: input.installationAddress,
      status: "site_audit_pending",
      system: input.system,
      pricing: input.pricing,
      timeline: {
        installationWindow: input.timeline.installationWindow,
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

  async submitOnboarding(user, projectId, input) {
    const project = await this.getProject(user, projectId);

    if (user.role !== "admin" && project.customerId !== user.userId) {
      throw new AppError(403, "Only the customer can submit project onboarding");
    }

    return projectsRepository.updateProject(projectId, {
      onboarding: {
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        siteAccessNotes: input.siteAccessNotes || null,
        preferredVisitWindow: input.preferredVisitWindow || null,
        completedAt: new Date(),
      },
    });
  },

  async uploadDocument(user, projectId, input) {
    const project = await this.getProject(user, projectId);

    if (!canManageProject(user, project)) {
      throw new AppError(403, "Only the assigned vendor can upload project documents");
    }

    const { buffer, extension } = decodeDocument(input);
    const uploadDir = path.resolve("uploads", "project-documents");
    await fs.mkdir(uploadDir, { recursive: true });

    const storedFileName = `${projectId}-${Date.now()}.${extension}`;
    await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

    return projectsRepository.addDocument(projectId, {
      title: input.title,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: buffer.length,
      url: `/uploads/project-documents/${storedFileName}`,
      uploadedBy: user.userId,
      uploadedAt: new Date(),
    });
  },
};

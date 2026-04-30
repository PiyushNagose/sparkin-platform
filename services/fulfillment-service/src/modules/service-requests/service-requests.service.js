import crypto from "node:crypto";
import mongoose from "mongoose";
import { AppError } from "../../common/errors/app-error.js";
import { projectsRepository } from "../projects/projects.repository.js";
import { serviceRequestsRepository } from "./service-requests.repository.js";

function makeTicketNumber() {
  return `SR-${crypto.randomInt(100000, 999999)}`;
}

const statusActivityTitles = {
  requested: "Service request reopened",
  under_review: "Request moved under review",
  technician_assigned: "Technician assignment started",
  resolved: "Service request resolved",
  cancelled: "Service request cancelled",
};

async function getLinkedProject(request) {
  if (!request.projectId) {
    return null;
  }

  return projectsRepository.findById(request.projectId.toString());
}

async function canViewRequest(user, request) {
  if (user.role === "admin" || request.customerId === user.userId) {
    return true;
  }

  if (user.role !== "vendor") {
    return false;
  }

  const project = await getLinkedProject(request);
  return project?.vendorId === user.userId;
}

async function canManageRequest(user, request) {
  if (user.role === "admin") {
    return true;
  }

  if (user.role !== "vendor") {
    return false;
  }

  const project = await getLinkedProject(request);
  return project?.vendorId === user.userId;
}

export const serviceRequestsService = {
  async createRequest(user, input) {
    if (user.role !== "customer" && user.role !== "admin") {
      throw new AppError(403, "Only customers can create service requests");
    }

    const request = await serviceRequestsRepository.create({
      customerId: user.userId,
      customerEmail: user.email ?? null,
      projectId: input.projectId || null,
      ticketNumber: makeTicketNumber(),
      type: input.type,
      description: input.description,
      preferredDate: input.preferredDate ?? null,
      preferredTime: input.preferredTime ?? null,
      status: "requested",
      activity: [
        {
          title: "Service request submitted",
          note: "Our support team will review your request shortly.",
          createdAt: new Date(),
        },
      ],
    });

    return request;
  },

  async listRequests(user) {
    if (user.role === "admin") {
      return serviceRequestsRepository.findAll();
    }

    if (user.role === "vendor") {
      const projects = await projectsRepository.findForVendor(user.userId);
      return serviceRequestsRepository.findForProjectIds(projects.map((project) => project.id));
    }

    return serviceRequestsRepository.findForCustomer(user.userId);
  },

  async getRequest(user, requestId) {
    if (!mongoose.isValidObjectId(requestId)) {
      throw new AppError(400, "Invalid service request id");
    }

    const request = await serviceRequestsRepository.findById(requestId);

    if (!request) {
      throw new AppError(404, "Service request not found");
    }

    if (!(await canViewRequest(user, request))) {
      throw new AppError(403, "You do not have access to this service request");
    }

    return request;
  },

  async updateStatus(user, requestId, input) {
    const request = await this.getRequest(user, requestId);

    if (!(await canManageRequest(user, request))) {
      throw new AppError(403, "Only the assigned vendor or admin can update this service request");
    }

    if (request.status === input.status) {
      return request;
    }

    const activity = [
      {
        title: statusActivityTitles[input.status],
        note: input.note ?? null,
        createdAt: new Date(),
      },
      ...(request.activity ?? []),
    ];

    return serviceRequestsRepository.updateRequest(requestId, {
      status: input.status,
      activity,
    });
  },
};

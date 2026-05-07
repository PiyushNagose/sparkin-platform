import mongoose from "mongoose";
import { AppError } from "../../common/errors/app-error.js";
import { projectsRepository } from "../projects/projects.repository.js";
import { paymentsRepository } from "./payments.repository.js";

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function buildInvoiceNumber(project, index) {
  const projectId = project.id || project._id?.toString();
  return `SPK-${projectId.slice(-6).toUpperCase()}-${String(index + 1).padStart(2, "0")}`;
}

function buildManualInvoiceNumber(project) {
  const projectId = project.id || project._id?.toString();
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  return `SPK-${projectId.slice(-6).toUpperCase()}-${suffix}`;
}

function canViewPayment(user, payment) {
  return (
    user.role === "admin" ||
    payment.customerId === user.userId ||
    payment.vendorId === user.userId
  );
}

async function attachProjects(payments) {
  const projectIds = [
    ...new Set(
      payments.map((payment) => payment.projectId?.toString()).filter(Boolean),
    ),
  ];
  const projects = projectIds.length
    ? await projectsRepository.findByIds(projectIds)
    : [];
  const projectById = new Map(
    projects.map((project) => [String(project.id || project._id), project]),
  );

  return payments.map((payment) => ({
    ...payment,
    project: payment.projectId
      ? (projectById.get(String(payment.projectId)) ?? null)
      : null,
  }));
}

export const paymentsService = {
  async createInvoice(user, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can create invoices");
    }

    if (!mongoose.isValidObjectId(input.projectId)) {
      throw new AppError(400, "Invalid project id");
    }

    const project = await projectsRepository.findById(input.projectId);

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return paymentsRepository.create({
      projectId: project.id,
      quoteId: project.quoteId,
      customerId: project.customerId,
      vendorId: project.vendorId,
      customer: {
        fullName: project.customer.fullName,
        email: project.customer.email ?? null,
      },
      vendorEmail: project.vendorEmail ?? null,
      invoiceNumber: buildManualInvoiceNumber(project),
      milestone: {
        key: "admin_invoice",
        title: input.title,
      },
      amount: input.amount,
      method: input.method,
      status: "pending",
      dueAt: input.dueAt ? new Date(input.dueAt) : addDays(7),
      paidAt: null,
    });
  },

  async createScheduleForProject(project) {
    const existingPayments = await paymentsRepository.findForProject(
      project.id,
    );

    if (existingPayments.length > 0) {
      return existingPayments;
    }

    // Use findOneAndUpdate with upsert on the first milestone to prevent
    // race conditions when two requests try to create the schedule simultaneously
    const firstCreated =
      await paymentsRepository.findOrCreateBookingAdvance(project);
    if (!firstCreated.wasNew) {
      // Another request already created the schedule, return all payments
      return paymentsRepository.findForProject(project.id);
    }

    const schedule = [
      {
        key: "installation_start",
        title: "Installation Start",
        ratio: 0.5,
        dueInDays: 7,
      },
      {
        key: "activation_balance",
        title: "Activation Balance",
        ratio: 0.4,
        dueInDays: 21,
      },
    ];

    const remaining = schedule.map((milestone, index) => ({
      projectId: project.id,
      quoteId: project.quoteId,
      customerId: project.customerId,
      vendorId: project.vendorId,
      customer: {
        fullName: project.customer.fullName,
        email: project.customer.email ?? null,
      },
      vendorEmail: project.vendorEmail ?? null,
      invoiceNumber: buildInvoiceNumber(project, index + 1),
      milestone: {
        key: milestone.key,
        title: milestone.title,
      },
      amount: Math.round(project.pricing.totalPrice * milestone.ratio),
      status: "pending",
      dueAt: addDays(milestone.dueInDays),
      paidAt: null,
    }));

    await paymentsRepository.createMany(remaining);
    return paymentsRepository.findForProject(project.id);
  },

  async listPayments(user) {
    if (user.role === "admin") {
      return attachProjects(await paymentsRepository.findAll());
    }

    if (user.role === "vendor") {
      return attachProjects(
        await paymentsRepository.findForVendor(user.userId),
      );
    }

    return attachProjects(
      await paymentsRepository.findForCustomer(user.userId),
    );
  },

  async updateStatus(user, paymentId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can update payment status");
    }

    const payment = await this.getPayment(user, paymentId);

    const updates = { status: input.status };
    if (input.method) updates.method = input.method;
    if (input.status === "paid") {
      updates.paidAt = input.paidAt ? new Date(input.paidAt) : new Date();
    }

    return paymentsRepository.update(payment.id, updates);
  },

  async getPayment(user, paymentId) {
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new AppError(400, "Invalid payment id");
    }

    const payment = await paymentsRepository.findById(paymentId);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    if (!canViewPayment(user, payment)) {
      throw new AppError(403, "You do not have access to this payment");
    }

    return (await attachProjects([payment]))[0];
  },
};

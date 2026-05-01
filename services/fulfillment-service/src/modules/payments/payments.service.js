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

function canViewPayment(user, payment) {
  return (
    user.role === "admin" ||
    payment.customerId === user.userId ||
    payment.vendorId === user.userId
  );
}

async function attachProjects(payments) {
  const projectIds = [...new Set(payments.map((payment) => payment.projectId?.toString()).filter(Boolean))];
  const projects = projectIds.length ? await projectsRepository.findByIds(projectIds) : [];
  const projectById = new Map(projects.map((project) => [String(project.id || project._id), project]));

  return payments.map((payment) => ({
    ...payment,
    project: payment.projectId ? projectById.get(String(payment.projectId)) ?? null : null,
  }));
}

export const paymentsService = {
  async createScheduleForProject(project) {
    const existingPayments = await paymentsRepository.findForProject(project.id);

    if (existingPayments.length > 0) {
      return existingPayments;
    }

    const schedule = [
      { key: "booking_advance", title: "Booking Advance", ratio: 0.1, dueInDays: 0 },
      { key: "installation_start", title: "Installation Start", ratio: 0.5, dueInDays: 7 },
      { key: "activation_balance", title: "Activation Balance", ratio: 0.4, dueInDays: 21 },
    ];

    const payments = schedule.map((milestone, index) => ({
      projectId: project.id,
      quoteId: project.quoteId,
      customerId: project.customerId,
      vendorId: project.vendorId,
      customer: {
        fullName: project.customer.fullName,
        email: project.customer.email ?? null,
      },
      vendorEmail: project.vendorEmail ?? null,
      invoiceNumber: buildInvoiceNumber(project, index),
      milestone: {
        key: milestone.key,
        title: milestone.title,
      },
      amount: Math.round(project.pricing.totalPrice * milestone.ratio),
      status: index === 0 ? "paid" : "pending",
      dueAt: addDays(milestone.dueInDays),
      paidAt: index === 0 ? new Date() : null,
    }));

    return paymentsRepository.createMany(payments);
  },

  async listPayments(user) {
    if (user.role === "admin") {
      const projects = await projectsRepository.findAll();
      await Promise.all(projects.map((project) => this.createScheduleForProject(project)));
      return attachProjects(await paymentsRepository.findAll());
    }

    if (user.role === "vendor") {
      const projects = await projectsRepository.findForVendor(user.userId);
      await Promise.all(projects.map((project) => this.createScheduleForProject(project)));
      return attachProjects(await paymentsRepository.findForVendor(user.userId));
    }

    const projects = await projectsRepository.findForCustomer(user.userId);
    await Promise.all(projects.map((project) => this.createScheduleForProject(project)));
    return attachProjects(await paymentsRepository.findForCustomer(user.userId));
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

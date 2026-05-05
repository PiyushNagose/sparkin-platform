import crypto from "node:crypto";
import { AppError } from "../../common/errors/app-error.js";
import { ticketsRepository } from "./tickets.repository.js";

function makeTicketId() {
  return `TK-${crypto.randomInt(1000, 9999)}`;
}

function getSlaHours(priority) {
  return { low: 120, medium: 72, high: 48, critical: 24 }[priority] || 48;
}

function getSatisfactionPotential(priority) {
  return (
    {
      low: "Low Impact",
      medium: "Medium Impact",
      high: "High Impact",
      critical: "Critical Impact",
    }[priority] || "Medium Impact"
  );
}

export const ticketsService = {
  async createTicket(user, input) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can create tickets");

    const ticketId = makeTicketId();
    const ticket = await ticketsRepository.create({
      ticketId,
      title: input.title.trim(),
      description: input.description.trim(),
      issueType: input.issueType.trim(),
      priority: input.priority || "medium",
      status: "open",
      customerId: input.customerId || user.userId,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail?.trim() || null,
      customerType: input.customerType?.trim() || "Residential User",
      customerPlan: input.customerPlan?.trim() || "Standard Plan",
      customerLocation: input.customerLocation?.trim() || null,
      assignedAgentId: user.userId,
      assignedAgentName: input.assignedAgentName || "Self (Super Admin)",
      resolutionTargetHours: getSlaHours(input.priority || "medium"),
      category: input.category?.trim() || "General",
      categoryNote: input.categoryNote?.trim() || null,
      satisfactionPotential: getSatisfactionPotential(
        input.priority || "medium",
      ),
      satisfactionNote: input.satisfactionNote?.trim() || null,
      attachments: input.attachments || [],
      messages: [],
    });
    return ticket;
  },

  async listTickets(user, query = {}) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can list tickets");
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    return ticketsRepository.findAll({
      page,
      limit,
      status: query.status,
      priority: query.priority,
      search: query.search,
    });
  },

  async getTicket(user, ticketId) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can view tickets");
    const ticket = await ticketsRepository.findByTicketId(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");
    return ticket;
  },

  async updateTicket(user, ticketId, input) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can update tickets");
    const ticket = await ticketsRepository.findByTicketId(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");

    const updates = {};
    const allowed = [
      "title",
      "description",
      "issueType",
      "priority",
      "status",
      "assignedAgentId",
      "assignedAgentName",
      "category",
      "categoryNote",
      "satisfactionPotential",
      "satisfactionNote",
    ];
    for (const key of allowed) {
      if (input[key] !== undefined) updates[key] = input[key];
    }
    if (input.status === "resolved" && !ticket.resolvedAt) {
      updates.resolvedAt = new Date();
    }
    return ticketsRepository.update(ticket.id, updates);
  },

  async addMessage(user, ticketId, input) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can reply to tickets");
    const ticket = await ticketsRepository.findByTicketId(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");

    const message = {
      type: input.isInternal ? "internal" : "admin",
      sender: input.senderName || "Admin",
      senderId: user.userId,
      text: input.text.trim(),
      isInternal: Boolean(input.isInternal),
      attachments: input.attachments || [],
    };

    return ticketsRepository.addMessage(ticket.id, message);
  },

  async deleteTicket(user, ticketId) {
    if (user.role !== "admin")
      throw new AppError(403, "Only admins can delete tickets");
    const ticket = await ticketsRepository.findByTicketId(ticketId);
    if (!ticket) throw new AppError(404, "Ticket not found");
    await ticketsRepository.delete(ticket.id);
  },
};

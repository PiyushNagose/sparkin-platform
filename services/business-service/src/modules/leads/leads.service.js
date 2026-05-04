import { AppError } from "../../common/errors/app-error.js";
import { leadsRepository } from "./leads.repository.js";
import mongoose from "mongoose";

export const leadsService = {
  async createLead(user, input) {
    if (!["customer", "vendor", "admin"].includes(user.role)) {
      throw new AppError(403, "You do not have permission to create leads");
    }

    const isVendorCreated = user.role === "vendor";

    const lead = await leadsRepository.createLead({
      ...input,
      customerId: isVendorCreated ? `manual:${user.userId}` : user.userId,
      createdByVendorId: isVendorCreated ? user.userId : null,
      source: isVendorCreated ? "vendor_manual" : "customer_booking",
      status: "submitted",
      submittedAt: new Date(),
    });

    if (isVendorCreated) {
      return leadsRepository.updateStatus(lead.id, "reviewing");
    }

    return lead;
  },

  async listLeads(user) {
    if (user.role === "admin") {
      return leadsRepository.findAll();
    }

    if (user.role === "vendor") {
      return leadsRepository.findVendorVisibleLeads();
    }

    return leadsRepository.findLeadsForCustomer(user.userId);
  },

  async getLead(user, leadId) {
    if (!mongoose.isValidObjectId(leadId)) {
      throw new AppError(400, "Invalid lead id");
    }

    const lead = await leadsRepository.findLeadById(leadId);

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const canView =
      user.role === "admin" ||
      user.role === "vendor" ||
      lead.customerId === user.userId;

    if (!canView) {
      throw new AppError(403, "You do not have access to this lead");
    }

    return lead;
  },

  async updateLeadStatus(user, leadId, input) {
    if (user.role !== "vendor" && user.role !== "admin") {
      throw new AppError(403, "Only vendors can update lead status");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "quote_selected" && input.status !== "closed") {
      throw new AppError(409, "Selected leads cannot be moved back into review");
    }

    return leadsRepository.updateStatus(leadId, input.status);
  },
};

import { AppError } from "../../common/errors/app-error.js";
import { leadsRepository } from "./leads.repository.js";
import mongoose from "mongoose";

export const leadsService = {
  async createLead(user, input) {
    if (!["customer", "vendor", "admin"].includes(user.role)) {
      throw new AppError(403, "You do not have permission to create leads");
    }

    const isVendorCreated = user.role === "vendor";
    const isAdminCreated = user.role === "admin";
    const isManualLead = isVendorCreated || isAdminCreated;

    const lead = await leadsRepository.createLead({
      ...input,
      customerId: isManualLead
        ? `manual:${user.userId}:${input.contact.phoneNumber}`
        : user.userId,
      createdByVendorId: isVendorCreated ? user.userId : null,
      source: isAdminCreated
        ? "admin_manual"
        : isVendorCreated
          ? "vendor_manual"
          : "customer_booking",
      status: "submitted",
      submittedAt: new Date(),
    });

    if (isManualLead) {
      return leadsRepository.updateStatus(lead.id, "reviewing");
    }

    return lead;
  },

  async listLeads(user) {
    if (user.role === "admin") {
      return leadsRepository.findAll();
    }

    if (user.role === "vendor") {
      return leadsRepository.findVendorVisibleLeads(user.userId);
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
      throw new AppError(
        409,
        "Selected leads cannot be moved back into review",
      );
    }

    return leadsRepository.updateStatus(leadId, input.status);
  },

  async assignVendors(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can assign vendors to leads");
    }

    const lead = await this.getLead(user, leadId);

    if (lead.status === "closed") {
      throw new AppError(409, "Closed leads cannot be assigned to vendors");
    }

    const vendorIds = [...new Set(input.vendorIds)];
    return leadsRepository.assignVendors(leadId, vendorIds);
  },

  async updateDetails(user, leadId, input) {
    if (user.role !== "admin") {
      throw new AppError(403, "Only admins can update lead details");
    }

    await this.getLead(user, leadId);

    const updates = {};
    if (input.adminSystemSizeKw !== undefined)
      updates.adminSystemSizeKw = input.adminSystemSizeKw;
    if (input.estimatedCost !== undefined)
      updates.estimatedCost = input.estimatedCost;

    return leadsRepository.updateDetails(leadId, updates);
  },

  async markCommitmentPaid(user, leadId) {
    // Customers mark their own lead payment; admins can mark any
    const lead = await this.getLead(user, leadId);

    if (user.role === "customer" && lead.customerId !== user.userId) {
      throw new AppError(403, "You can only update your own lead");
    }

    return leadsRepository.markCommitmentPaid(leadId);
  },
};

import { AppError } from "../../common/errors/app-error.js";
import { leadsRepository } from "./leads.repository.js";
import mongoose from "mongoose";

export const leadsService = {
  async createLead(customer, input) {
    if (customer.role !== "customer" && customer.role !== "admin") {
      throw new AppError(403, "Only customers can create booking requests");
    }

    return leadsRepository.createLead({
      ...input,
      customerId: customer.userId,
      status: "submitted",
      submittedAt: new Date(),
    });
  },

  async listLeads(user) {
    if (user.role === "vendor" || user.role === "admin") {
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
};

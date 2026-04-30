import { AppError } from "../../common/errors/app-error.js";
import { fulfillmentClient } from "../../common/http/fulfillment-client.js";
import { leadsRepository } from "../leads/leads.repository.js";
import { quotesRepository } from "./quotes.repository.js";
import mongoose from "mongoose";

export const quotesService = {
  async createQuote(user, leadId, input) {
    if (user.role !== "vendor" && user.role !== "admin") {
      throw new AppError(403, "Only vendors can submit quotes");
    }

    if (!mongoose.isValidObjectId(leadId)) {
      throw new AppError(400, "Invalid lead id");
    }

    const lead = await leadsRepository.findLeadById(leadId);

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const existingQuote = await quotesRepository.findQuoteByVendorAndLead(user.userId, leadId);

    if (existingQuote) {
      return quotesRepository.updateQuoteByVendorAndLead(user.userId, leadId, {
        ...input,
        customerId: lead.customerId,
      });
    }

    const quote = await quotesRepository.createQuote({
      ...input,
      leadId,
      customerId: lead.customerId,
      vendorId: user.userId,
      vendorEmail: user.email,
      status: "submitted",
      submittedAt: new Date(),
    });

    await leadsRepository.markOpenForQuotes(leadId);

    return quote;
  },

  async listQuotes(user, leadId = null) {
    if (leadId) {
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
        throw new AppError(403, "You do not have access to these quotes");
      }

      return quotesRepository.findQuotesByLeadId(leadId);
    }

    if (user.role === "vendor") {
      return quotesRepository.findQuotesByVendor(user.userId);
    }

    const leads = await leadsRepository.findLeadsForCustomer(user.userId);
    const leadIds = leads.map((lead) => lead._id || lead.id).filter(Boolean);
    return quotesRepository.findQuotesByCustomer(user.userId, leadIds);
  },

  async getQuote(user, quoteId) {
    if (!mongoose.isValidObjectId(quoteId)) {
      throw new AppError(400, "Invalid quote id");
    }

    const quote = await quotesRepository.findQuoteById(quoteId);

    if (!quote) {
      throw new AppError(404, "Quote not found");
    }

    const lead = await leadsRepository.findLeadById(quote.leadId);

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const canView =
      user.role === "admin" ||
      quote.vendorId === user.userId ||
      lead.customerId === user.userId;

    if (!canView) {
      throw new AppError(403, "You do not have access to this quote");
    }

    return quote;
  },

  async acceptQuote(user, quoteId, authorization) {
    if (user.role !== "customer" && user.role !== "admin") {
      throw new AppError(403, "Only customers can select a vendor");
    }

    if (!mongoose.isValidObjectId(quoteId)) {
      throw new AppError(400, "Invalid quote id");
    }

    const quote = await quotesRepository.findQuoteById(quoteId);

    if (!quote) {
      throw new AppError(404, "Quote not found");
    }

    if (quote.status === "withdrawn") {
      throw new AppError(409, "This quote is no longer available");
    }

    const lead = await leadsRepository.findLeadById(quote.leadId);

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    const canSelect = user.role === "admin" || lead.customerId === user.userId;

    if (!canSelect) {
      throw new AppError(403, "You can only select vendors for your own bookings");
    }

    if (lead.status === "quote_selected" && lead.selection?.quoteId?.toString() !== quoteId) {
      throw new AppError(409, "A vendor has already been selected for this booking");
    }

    const acceptedQuote = await quotesRepository.acceptQuote(quoteId, quote.leadId);
    const selectedLead = await leadsRepository.markQuoteSelected(quote.leadId, {
      quoteId,
      vendorId: quote.vendorId,
      selectedAt: new Date(),
    });
    const project = await fulfillmentClient.createProjectFromAcceptedQuote({
      lead: selectedLead,
      quote: acceptedQuote,
      authorization,
    });

    return {
      quote: acceptedQuote,
      lead: selectedLead,
      project,
    };
  },
};
